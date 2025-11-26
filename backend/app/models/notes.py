from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=True)
    # 태그는 "react,fastapi,study" 같은 문자열로 저장 + 콤마(,)로 구분
    tags = Column(String(500), nullable=True)
