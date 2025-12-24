from typing import List, Dict, Optional
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.hyperclova_client import (
    build_chat_messages,
    generate_chat_response,
)

from app.prompts.render import render_chat_system_prompt

router = APIRouter()

# Pydantic 모델 정의
class ChatMessage(BaseModel):
    role: str  # "user" 또는 "assistant"
    content: str

class NoteContext(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    note: Optional[NoteContext] = None

class ChatResponse(BaseModel):
    output: str


# HyperCLOVAX-SEED를 이용한 챗봇 엔드포인트
@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    # user_messages 리스트 구성
    user_messages: List[Dict[str, str]] = [
        {"role": msg.role, "content": msg.content}
        for msg in request.messages
    ]
    
    system_prompt = render_chat_system_prompt(request.note)

    # HyperCLOVAX 템플릿 구조로 메시지 구성
    chat_messages = build_chat_messages(system_prompt, user_messages)
    # 모델 호출
    raw_output = generate_chat_response(chat_messages)

    return ChatResponse(output=raw_output)
