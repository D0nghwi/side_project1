from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite 파일 DB 경로
SQLALCHEMY_DATABASE_URL = "sqlite:///./notes.db"

# SQLite 필요한 옵션
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 모델들이 상속할 Base 클래스
Base = declarative_base()
