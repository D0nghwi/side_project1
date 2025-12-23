from typing import List, Dict
from fastapi import APIRouter
from pydantic import BaseModel

from app.services.hyperclova_client import (
    build_chat_messages,
    generate_chat_response,
)

router = APIRouter()

# Pydantic 모델 정의
class ChatMessage(BaseModel):
    role: str  # "user" 또는 "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    output: str


# 시스템 프롬프트 정의
SYSTEM_PROMPT = (
    '- 너는 "StudyI"라는 이름의 AI 학습 어시스턴트이다.\n'
    "- 사용자가 정리한 노트, 플래시카드, 코드, 자료 등을 바탕으로 개념을 이해하고 기억하도록 도와주는 것이 주요 역할이다.\n"
    "- 사용자의 수준은 초급~중급 개발자/학습자로 가정하고, 모르는 것을 전제로 차근차근 설명한다.\n"
    "- 사용자가 이미 정리해 둔 내용이 있으면 그 내용을 먼저 존중하고, 잘못된 부분이나 빠진 부분이 있다면 부드럽게 교정하고 보완해준다.\n"
    "- 설명할 때는 다음 순서를 기본으로 한다:\n"
    "  1) 핵심 요약\n"
    "  2) 단계별 상세 설명\n"
    "  3) 간단한 예시(코드, 수식, 비유 등)\n"
    "  4) 추가로 공부하면 좋은 키워드나 다음 단계 제안\n"
    "- 사용자가 표현한 용어나 기호를 최대한 그대로 사용하되, 헷갈릴 수 있는 부분은 용어 정의를 함께 제시한다.\n"
    "- 불명확한 질문일 경우, 바로 단정 짓기보다는 1~2개의 짧은 되물음을 통해 의도를 확인한 뒤 답변한다.\n"
    "- 답변은 너무 장황하지 않게, 하지만 피상적이지 않게 작성한다. 보통 3~7개의 단락 안에서 정리한다.\n"
    "- 답변은 항상 한국어로 작성한다."
)


# HyperCLOVAX-SEED를 이용한 간단한 챗봇 엔드포인트
@router.post("/", response_model=ChatResponse)
def chat(request: ChatRequest):
    
    # user_messages 리스트 구성
    user_messages: List[Dict[str, str]] = [
        {"role": msg.role, "content": msg.content}
        for msg in request.messages
    ]

    # HyperCLOVAX 템플릿 구조로 메시지 구성
    chat_messages = build_chat_messages(SYSTEM_PROMPT, user_messages)

    # 모델 호출
    raw_output = generate_chat_response(chat_messages)

    return ChatResponse(output=raw_output)
