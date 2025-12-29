from dataclasses import dataclass
from typing import Any, Optional

@dataclass
class AppError(Exception):
    status_code: int
    code: str
    message: str
    details: Optional[Any] = None
