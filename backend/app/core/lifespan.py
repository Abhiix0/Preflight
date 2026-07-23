from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.logging import configure_logging, get_logger
from app.core.storage import ensure_bucket_exists

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    configure_logging()
    logger.info("Starting Preflight API")
    try:
        ensure_bucket_exists()
    except Exception as e:
        logger.warning("MinIO bucket initialization failed: %s", e)
    yield
    logger.info("Shutting down Preflight API")
