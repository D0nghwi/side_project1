from typing import List, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.notes import Note
from app.errors.domain import NoteNotFound 
from app.schemas.chat import ChatRequest, ChatResponse, NoteContext

from app.services.hyperclova_client import (
    build_chat_messages,
    generate_chat_response,
)

from app.prompts.render import render_chat_system_prompt

router = APIRouter()

# HyperCLOVAX-SEED를 이용한 챗봇 엔드포인트
@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # user_messages 리스트 구성
    user_messages: List[Dict[str, str]] = [
        {"role": msg.role, "content": msg.content}
        for msg in request.messages
    ]
    
    note_ctx = None
    if request.note_id is not None:
        note = db.query(Note).filter(Note.id == request.note_id).first()
        if not note:
            raise NoteNotFound(request.note_id)
        
        note_ctx = NoteContext(
            id = note.id,
            title = note.title,
            content = note.content,
        )
    else:
        note_ctx = request.note
    
    system_prompt = render_chat_system_prompt(note_ctx)

    # HyperCLOVAX 템플릿 구조로 메시지 구성
    chat_messages = build_chat_messages(system_prompt, user_messages)
    # 모델 호출
    raw_output = generate_chat_response(chat_messages)

    return ChatResponse(output=raw_output)
