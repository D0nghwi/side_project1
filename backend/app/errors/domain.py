from .base import AppError

class NotFoundError(AppError):
    def __init__(self, message="Not found", details=None):
        super().__init__(status_code=404, code="NOT_FOUND", message=message, details=details)

class BadRequestError(AppError):
    def __init__(self, message="Bad request", details=None):
        super().__init__(status_code=400, code="BAD_REQUEST", message=message, details=details)

class NoteNotFound(NotFoundError):
    def __init__(self, note_id: int):
        super().__init__(message="Note not found", details={"note_id": note_id})

class DeckNotFound(NotFoundError):
    def __init__(self, deck_id: int):
        super().__init__(message="Deck not found", details={"deck_id": deck_id})

class TitleRequired(BadRequestError):
    def __init__(self):
        super().__init__(message="title is required")

class CardsEmpty(BadRequestError):
    def __init__(self):
        super().__init__(message="cards is empty")
