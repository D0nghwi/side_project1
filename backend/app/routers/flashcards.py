import re
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.flashcards import Deck, Flashcard
from app.models.notes import Note
from app.schemas.flashcards import (
    GenerateRequest,
    GenerateResponse,
    DeckCreateRequest,
    DeckCreatedResponse,
    DeckSummary,
    DeckDetail,
    CardOut,
)
from app.errors.domain import (NoteNotFound, DeckNotFound, TitleRequired, CardsEmpty)

router = APIRouter(tags=["flashcards"])

#html제거
def _strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    text = re.sub(r"\s+", " ", text).strip()
    return text

#규칙 기반 카드 생성
def _rule_generate_cards(note_text: str) -> List[dict]:
    cards = []
    if not note_text:
        return cards

    lines = re.split(r"[\n\r]+", note_text)
    for raw in lines:
        s = raw.strip()
        if not s:
            continue
        if ":" in s:
            left, right = s.split(":", 1)
            left, right = left.strip(), right.strip()
            if left and right:
                cards.append({"question": f"{left}란?", "answer": right})
        if len(cards) >= 20:
            return cards

    if len(cards) < 5:
        sentences = re.split(r"[.!?]\s+", note_text)
        for sent in sentences:
            t = sent.strip()
            if len(t) < 20:
                continue
            cards.append({"question": "핵심 내용은?", "answer": t})
            if len(cards) >= 10:
                break

    return cards



@router.post("/flashcards/generate", response_model=GenerateResponse)
def generate_flashcards(payload: GenerateRequest, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == payload.note_id).first()
    if not note:
        raise NoteNotFound(payload.note_id)

    note_text = _strip_html(note.content or "")
    cards_raw = _rule_generate_cards(note_text)

    cards = []
    for idx, c in enumerate(cards_raw, start=1):
        cards.append(
            {
                "temp_id": f"t{idx}",
                "question": c["question"],
                "answer": c["answer"],
            }
        )

    return {
        "suggested_title": note.title or "새 덱",
        "cards": cards,
    }


@router.post("/decks", response_model=DeckCreatedResponse)
def create_deck(payload: DeckCreateRequest, db: Session = Depends(get_db)):
    if not payload.title.strip():
        raise TitleRequired()

    if len(payload.cards) == 0:
        raise CardsEmpty()

    deck = Deck(
        note_id=payload.note_id,
        title=payload.title.strip(),
        source_type=payload.source_type,
    )
    db.add(deck)
    db.flush() 

    for c in payload.cards:
        card = Flashcard(
            deck_id=deck.id,
            order_index=c.order_index,
            question=c.question,
            answer=c.answer,
        )
        db.add(card)

    db.commit()
    return {"id": deck.id}


@router.get("/decks", response_model=List[DeckSummary])
def list_decks(db: Session = Depends(get_db)):
    rows = (
        db.query(
            Deck.id,
            Deck.title,
            Deck.source_type,
            func.count(Flashcard.id).label("card_count"),
        )
        .outerjoin(Flashcard, Flashcard.deck_id == Deck.id)
        .group_by(Deck.id)
        .order_by(Deck.id.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "title": r.title,
            "source_type": r.source_type,
            "card_count": int(r.card_count or 0),
        }
        for r in rows
    ]


@router.get("/decks/{deck_id}", response_model=DeckDetail)
def get_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise DeckNotFound(deck_id)

    cards = (
        db.query(Flashcard)
        .filter(Flashcard.deck_id == deck_id)
        .order_by(Flashcard.order_index.asc(), Flashcard.id.asc())
        .all()
    )

    return {
        "id": deck.id,
        "note_id": deck.note_id,
        "title": deck.title,
        "source_type": deck.source_type,
        "cards": [
            CardOut(
                id=c.id,
                order_index=c.order_index,
                question=c.question,
                answer=c.answer,
            )
            for c in cards
        ],
    }

@router.delete("/decks/{deck_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deck(deck_id: int, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id).first()
    if not deck:
        raise DeckNotFound(deck_id)

    db.query(Flashcard).filter(Flashcard.deck_id == deck_id).delete(synchronize_session=False)

    db.delete(deck)
    db.commit()
    return

