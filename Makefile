# Preflight Local Development Makefile
# Standard entrypoint for controlling Docker Compose services and running dev commands.

.PHONY: up down logs migrate lint test

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

migrate:
	docker compose exec backend uv run alembic upgrade head

lint:
	docker compose exec backend uv run ruff check .
	docker compose exec backend uv run ruff format --check .
	docker compose exec frontend npm run lint

test:
	docker compose exec backend uv run pytest
