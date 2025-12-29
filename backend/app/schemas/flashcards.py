from typing import List, Optional, Literal
from pydantic import BaseModel, Field


SourceType = Literal["manual", "rule", "ai"]

class CardDraft(BaseModel):
    temp_id: str
    question: str
    answer: str


class GenerateRequest(BaseModel):
    note_id: int


class GenerateResponse(BaseModel):
    suggested_title: str
    cards: List[CardDraft]


class CardCreate(BaseModel):
    order_index: int = 0
    question: str
    answer: str


class DeckCreateRequest(BaseModel):
    note_id: Optional[int] = None
    title: str
    source_type: SourceType = "rule"
    cards: List[CardCreate] = Field(default_factory=list)


class DeckCreatedResponse(BaseModel):
    id: int


class DeckSummary(BaseModel):
    id: int
    title: str
    source_type: SourceType
    card_count: int


class CardOut(BaseModel):
    id: int
    order_index: int
    question: str
    answer: str


class DeckDetail(BaseModel):
    id: int
    note_id: Optional[int] = None
    title: str
    source_type: SourceType
    cards: List[CardOut]
