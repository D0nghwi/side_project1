from sqlalchemy import Column, Integer, BigInteger, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.database import Base


class Deck(Base):
    __tablename__ = "decks"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    note_id = Column(BigInteger, nullable=True, index=True)
    title = Column(String(255), nullable=False)
    source_type = Column(String(16), nullable=False, default="rule") 

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")


class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    deck_id = Column(BigInteger, ForeignKey("decks.id", ondelete="CASCADE"), nullable=False, index=True)

    order_index = Column(Integer, nullable=False, default=0)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    deck = relationship("Deck", back_populates="cards")
