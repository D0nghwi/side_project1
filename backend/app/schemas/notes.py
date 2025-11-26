from pydantic import BaseModel
from typing import List, Optional

class NoteBase(BaseModel):
    title: str
    content: str
    tags: Optional[List[str]] = None

# 노트 생성 시
class NoteCreate(NoteBase):
    pass

# 노트 수정 시
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None

# 노트 출력 시 (응답용)
class NoteOut(NoteBase):
    id: int

    class Config:
        orm_mode = True # ORM 모델을 Pydantic 모델로 변환 가능하게 함
