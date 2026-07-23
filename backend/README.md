# Preflight Backend

FastAPI modular monolith for the Preflight Engineering Readiness Platform.

## Stack

- Python 3.12+
- FastAPI
- SQLAlchemy 2.0
- Alembic
- PostgreSQL
- Redis
- uv

## Layout

```text
backend/
├── app/
│   ├── api/v1/endpoints/
│   ├── core/
│   ├── db/
│   ├── models/
│   ├── repositories/
│   ├── schemas/
│   ├── services/
│   ├── analyzers/
│   ├── workers/
│   ├── utils/
│   └── main.py
├── tests/
├── alembic/
├── pyproject.toml
├── uv.lock
├── .env.example
└── README.md
```

## Setup

```bash
cp .env.example .env
uv sync
uv run uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

Health: http://localhost:8000/api/v1/health
