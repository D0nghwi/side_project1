from typing import List, Optional, Literal
from pydantic import BaseModel

Role = Literal["user", "assistant", "system"]


class ChatMessage(BaseModel):
    role: Role
    content: str


class NoteContext(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None


class ChatRequest(BaseModel):
    note_id: Optional[int] = None
    messages: List[ChatMessage]
    

class ChatResponse(BaseModel):
    output: str
