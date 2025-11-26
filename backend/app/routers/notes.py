from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.notes import Note as NoteModel
from app.schemas.notes import NoteCreate, NoteUpdate, NoteOut

router = APIRouter()

# DB 세션을 요청마다 열고 닫기 위한 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 문자열 ↔ 리스트 변환 함수
def tags_str_to_list(tags_str: str | None) -> list[str]:
    if not tags_str:
        return []
    return [t.strip() for t in tags_str.split(",") if t.strip()]

# 리스트 → 문자열 변환 함수
def tags_list_to_str(tags: list[str] | None) -> str | None:
    if not tags:
        return None
    return ",".join(tags)

# 노트 목록 조회
@router.get("/", response_model=List[NoteOut])
def read_notes(db: Session = Depends(get_db)):
    notes = db.query(NoteModel).all()
    # tags를 문자열→리스트로 변환
    result: List[NoteOut] = []
    for note in notes:
        result.append(
            NoteOut(
                id=note.id,
                title=note.title,
                content=note.content,
                tags=tags_str_to_list(note.tags),
            )
        )
    return result

# 단일 노트 조회
@router.get("/{note_id}", response_model=NoteOut)
def read_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(NoteModel).filter(NoteModel.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return NoteOut(
        id=note.id,
        title=note.title,
        content=note.content,
        tags=tags_str_to_list(note.tags),
    )

# 노트 생성
@router.post("/", response_model=NoteOut)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = NoteModel(
        title=note.title,
        content=note.content,
        tags=tags_list_to_str(note.tags),
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    return NoteOut(
        id=db_note.id,
        title=db_note.title,
        content=db_note.content,
        tags=tags_str_to_list(db_note.tags),
    )

# 노트 수정
@router.put("/{note_id}", response_model=NoteOut)
def update_note(
    note_id: int,
    note_update: NoteUpdate,
    db: Session = Depends(get_db),
):
    note = db.query(NoteModel).filter(NoteModel.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # 부분 수정 허용
    if note_update.title is not None:
        note.title = note_update.title
    if note_update.content is not None:
        note.content = note_update.content
    if note_update.tags is not None:
        note.tags = tags_list_to_str(note_update.tags)

    db.commit()
    db.refresh(note)

    return NoteOut(
        id=note.id,
        title=note.title,
        content=note.content,
        tags=tags_str_to_list(note.tags),
    )



# 5) 노트 삭제
@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(NoteModel).filter(NoteModel.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()
    
    # 204는 response body 없이 반환
    return