from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# 프론트엔드 도메인
# 실행 명령어 : uvicorn app.main:app --reload --port 8000
origins = [
    "http://localhost:3000",  # webpack dev server 포트에 맞추기
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== Pydantic 모델 ======
class NoteBase(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = None

class Note(NoteBase):
    id: int

# ====== 임시DB 메모리 데이터 ======
fake_notes_db: List[Note] = [
    Note(id=1, title="첫 번째 노트", content="내용입니다", tags=["react", "study"]),
    Note(id=2, title="두 번째 노트", content="FastAPI 연습 중", tags=["backend"]),
    Note(id=3, title="세 번째 노트", content="ChatBot 추가 예정", tags=["chatbot", "AI"]),
]

# ====== API 엔드포인트 ======
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/notes", response_model=List[Note])
def get_notes():
    return fake_notes_db

@app.get("/notes/{note_id}", response_model=Note)
def get_note_detail(note_id: int):
    for note in fake_notes_db:
        if note.id == note_id:
            return note
    raise HTTPException(status_code=404, detail="Note not found")

@app.post("/notes", response_model=Note)
def create_note(note: NoteBase):
    new_id = max(n.id for n in fake_notes_db) + 1 if fake_notes_db else 1
    new_note = Note(id=new_id, **note.dict())
    fake_notes_db.append(new_note)
    return new_note
