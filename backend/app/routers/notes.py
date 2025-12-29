from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.models.notes import Note as NoteModel
from app.schemas.notes import NoteCreate, NoteUpdate, NoteOut
from app.errors.domain import NoteNotFound
from app.database import get_db

router = APIRouter()

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

def to_note_out(note: NoteModel) -> NoteOut:
    return NoteOut(
        id=note.id,
        title=note.title,
        content=note.content,
        tags=tags_str_to_list(note.tags),
    )

# 노트 목록 조회
@router.get("/", response_model=List[NoteOut])
def read_notes(db: Session = Depends(get_db)):
    notes = db.query(NoteModel).all()
    return [to_note_out(n) for n in notes]

# 단일 노트 조회
@router.get("/{note_id}", response_model=NoteOut)
def read_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(NoteModel).filter(NoteModel.id == note_id).first()
    if not note:
        raise NoteNotFound(note_id)
    return to_note_out(note)

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
    return to_note_out(db_note)

# 노트 수정
@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, note_update: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(NoteModel).filter(NoteModel.id == note_id).first()
    if not note:
        raise NoteNotFound(note_id)

    # 부분 수정 허용
    if note_update.title is not None:
        note.title = note_update.title
    if note_update.content is not None:
        note.content = note_update.content
    if note_update.tags is not None:
        note.tags = tags_list_to_str(note_update.tags)

    db.commit()
    db.refresh(note)

    return to_note_out(note)



# 노트 삭제
@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(NoteModel).filter(NoteModel.id == note_id).first()
    if not note:
        raise NoteNotFound(note_id)
    
    db.delete(note)
    db.commit()
    # 204는 response body 없이 반환
    return