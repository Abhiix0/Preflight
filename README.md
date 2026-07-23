# Preflight

Preflight is an Engineering Readiness Platform designed for student and early-career developers. It scans GitHub repositories prior to deployment to identify production risks, provides educational explanations for engineering issues, offers actionable guidance to improve software quality, and empowers developers to ship code with confidence.

## Stack

| Layer | Technologies |
| --- | --- |
| **Backend** | FastAPI, SQLAlchemy 2.0, Celery, PostgreSQL 17, Redis 8, MinIO |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS |

## Quickstart

1. Copy the environment configuration template:
   ```bash
   cp .env.example .env
   ```

2. Start the local development environment:
   ```bash
   make up
   ```

Once running, access the services at:
- **Frontend App**: [http://localhost:3001](http://localhost:3001)
- **Backend Interactive API Docs**: [http://localhost:8080/docs](http://localhost:8080/docs)

## Repository Layout

```text
Preflight/
├── backend/          # FastAPI modular monolith, Celery workers & Alembic migrations
├── frontend/         # Next.js 15 web application
└── docs/             # Technical architecture and product documentation
```

## Documentation

- [ADR.md](docs/ADR.md): Architectural Decision Records detailing key design choices and trade-offs.
- [Api-specification.md](docs/Api-specification.md): Complete REST API contract, request/response schemas, and endpoints.
- [Backend-Architecture.md](docs/Backend-Architecture.md): Detailed FastAPI modular monolith structure and internal module boundaries.
- [DataBase-Architecture.md](docs/DataBase-Architecture.md): Database schema, entity relationships, Alembic migration strategy, and indexing.
- [DevOps-Architecture.md](docs/DevOps-Architecture.md): Containerization specs, Docker Compose environments, and CI/CD pipelines.
- [Frontend-Architecture.md](docs/Frontend-Architecture.md): Next.js 15 App Router design, UI component hierarchy, and client state.
- [PRD.md](docs/PRD.md): Product Requirements Document defining functional requirements, user stories, and acceptance criteria.
- [Product-Definition.md](docs/Product-Definition.md): High-level product definition, vision, mission, and core problem statement.
- [Roadmap.md](docs/Roadmap.md): Project development timeline, sprint milestones, and feature delivery schedule.
- [Security-Architecture.md](docs/Security-Architecture.md): Authentication models, token security, RBAC, and vulnerability scanning.
- [System-Architecture.md](docs/System-Architecture.md): End-to-end system architecture overview, data flow diagrams, and tech stack choices.
