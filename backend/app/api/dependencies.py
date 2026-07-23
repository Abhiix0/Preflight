"""Shared FastAPI dependencies for the API layer."""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

DbSession = Annotated[Session, Depends(get_db)]


def get_db_session() -> Generator[Session, None, None]:
    """Yield a database session for request-scoped dependencies."""
    yield from get_db()
