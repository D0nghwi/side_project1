from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import notes, chat, flashcards


app = FastAPI()

# 앱 시작 시 테이블 생성
Base.metadata.create_all(bind=engine)

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

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(
    notes.router,
    prefix="/notes",
    tags=["notes"],
)
app.include_router(
    chat.router,
    prefix="/chat",
    tags=["chat"],
) 
app.include_router(
    flashcards.router,
    prefix="/flashcards",
    tags=["flashcards"],
)
