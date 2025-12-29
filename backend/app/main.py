from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import notes, chat, flashcards
from app.errors.base import AppError
from app.errors.http import app_error_handler

app = FastAPI()

app.add_exception_handler(AppError, app_error_handler)

# 앱 시작 시 테이블 생성
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list(),
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

