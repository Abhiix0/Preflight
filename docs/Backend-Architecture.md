# Preflight

# Backend Architecture Document (BAD)

**Version:** 1.0
**Status:** Approved
**Owner:** Backend Engineering Team
**Primary Framework:** FastAPI
**Language:** Python 3.12+
**Architecture Pattern:** Modular Monolith + Clean Architecture
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the internal architecture of the Preflight backend.

It describes how the backend is organized, how modules communicate, coding standards, dependency flow, business logic organization, background processing, and extension points.

The objective is to create a backend that is:

* Maintainable
* Testable
* Extensible
* Scalable
* Easy for multiple contributors

---

# 2. Architecture Philosophy

Preflight follows **Modular Monolith + Clean Architecture**.

The MVP intentionally avoids microservices to reduce deployment complexity while maintaining clear module boundaries.

Core principles:

* Business logic is independent of frameworks.
* Every module has a single responsibility.
* APIs are thin.
* Services contain business logic.
* Database access is isolated.
* Background work is asynchronous.
* Modules communicate through interfaces, not implementation details.

---

# 3. Backend Stack

| Layer           | Technology         |
| --------------- | ------------------ |
| Language        | Python 3.12+       |
| Framework       | FastAPI            |
| Validation      | Pydantic v2        |
| ORM             | SQLAlchemy 2.0     |
| Migrations      | Alembic            |
| Authentication  | GitHub OAuth + JWT |
| Queue           | Redis              |
| Background Jobs | Celery             |
| Object Storage  | MinIO              |
| Package Manager | uv                 |
| Testing         | Pytest             |
| Linting         | Ruff               |
| Type Checking   | MyPy               |
| API Docs        | OpenAPI / Swagger  |

---

# 4. Backend Directory Structure

```
backend/
│
├── app/
│
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── repositories.py
│   │   │   ├── analysis.py
│   │   │   ├── findings.py
│   │   │   ├── reports.py
│   │   │   ├── dashboard.py
│   │   │   └── score.py
│   │   │
│   │   ├── router.py
│   │   └── deps.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── logging.py
│   │   ├── constants.py
│   │   └── exceptions.py
│   │
│   ├── db/
│   │   ├── models/
│   │   ├── migrations/
│   │   ├── base.py
│   │   └── session.py
│   │
│   ├── schemas/
│   │
│   ├── repositories/
│   │
│   ├── services/
│   │
│   ├── analyzers/
│   │
│   ├── orchestrator/
│   │
│   ├── workers/
│   │
│   ├── scoring/
│   │
│   ├── recommendations/
│   │
│   ├── reports/
│   │
│   ├── integrations/
│   │
│   ├── utils/
│   │
│   └── main.py
│
├── tests/
│
├── scripts/
│
├── docker/
│
├── pyproject.toml
│
└── README.md
```

---

# 5. Layered Architecture

```
Client

↓

REST API Layer

↓

Service Layer

↓

Repository Layer

↓

Database
```

Each layer has one responsibility.

---

## API Layer

Responsibilities

* Receive HTTP requests
* Validate input
* Authenticate users
* Call services
* Return responses

Must NEVER

* Execute SQL
* Run analyzers
* Implement business logic

---

## Service Layer

The heart of the application.

Responsibilities

* Business logic
* Validation
* Workflow orchestration
* Authorization checks
* Calling repositories
* Triggering workers

Every feature begins here.

---

## Repository Layer

Responsible ONLY for data persistence.

Responsibilities

* CRUD
* SQLAlchemy queries
* Transactions
* Database optimization

Repositories never contain business logic.

---

## Database Layer

Stores persistent application state.

Owns:

* Models
* Relationships
* Constraints
* Indexes

---

# 6. Domain Modules

Each business capability owns its own module.

## Identity

* Authentication
* Authorization
* Sessions
* OAuth

---

## Repository

* GitHub integration
* Repository metadata
* Framework detection

---

## Analysis

* Job creation
* Progress tracking
* Worker coordination

---

## Findings

* Scanner outputs
* Categorization
* Severity

---

## Scoring

* Preflight Score™
* Category scores
* Readiness calculation

---

## Recommendations

* Educational guidance
* Fix suggestions
* Learning resources

---

## Reports

* Engineering reports
* JSON generation
* Historical reports

---

# 7. Dependency Injection

FastAPI's dependency system is used throughout the application.

Injectable components include:

* Database session
* Current user
* Settings
* Authentication service
* Repository service
* Analysis service

Example flow:

```
Request

↓

Depends(get_current_user)

↓

Depends(get_db)

↓

AnalysisService

↓

Repository
```

---

# 8. Service Layer Design

Each service owns one business capability.

```
AuthService

RepositoryService

AnalysisService

FindingService

ScoreService

RecommendationService

ReportService
```

Rules:

* Services communicate with repositories.
* Services may call other services.
* Services never call HTTP endpoints internally.
* Services are fully unit testable.

---

# 9. Repository Pattern

Every aggregate root has a dedicated repository.

```
UserRepository

ProjectRepository

RepositoryRepository

AnalysisRepository

FindingRepository

RecommendationRepository

ReportRepository
```

Responsibilities:

* Query database
* Persist entities
* Handle transactions

Nothing else.

---

# 10. Analysis Engine

The Analysis Engine is plugin-based.

Every analyzer implements a common interface.

```python
class Analyzer:

    name: str

    category: str

    async def analyze(self, context) -> list[Finding]:
        ...
```

Example analyzers:

```
SecretAnalyzer

ReadmeAnalyzer

DockerAnalyzer

DependencyAnalyzer

TodoAnalyzer

DebugAnalyzer

HealthEndpointAnalyzer

EnvironmentAnalyzer
```

Adding a new analyzer requires:

* Creating a new analyzer class.
* Registering it.
* No modification to existing analyzers.

This follows the **Open/Closed Principle**.

---

# 11. Analysis Orchestrator

The orchestrator coordinates all analysis tasks.

Workflow:

```
Create Job

↓

Clone Repository

↓

Detect Tech Stack

↓

Select Analyzers

↓

Execute Analyzers

↓

Collect Findings

↓

Generate Scores

↓

Generate Recommendations

↓

Generate Report

↓

Persist Results
```

Responsibilities:

* Progress tracking
* Failure recovery
* Retry management
* Result aggregation

---

# 12. Background Workers

Celery handles long-running tasks.

Worker Types:

```
Repository Worker

Security Worker

Docker Worker

JavaScript Worker

Report Worker
```

Each worker performs one specialized task.

Workers communicate through:

* Redis
* PostgreSQL

---

# 13. External Integrations

Preflight integrates with:

GitHub

* OAuth
* Repository access

Docker

* Container builds
* Runtime validation

Security Tools

* Semgrep
* Bandit
* detect-secrets
* pip-audit

Future:

* Trivy
* Gitleaks

---

# 14. Configuration Management

All configuration is centralized.

```
Settings
│
├── Database
├── Redis
├── JWT
├── GitHub OAuth
├── Docker
├── Logging
├── Storage
```

Configuration is loaded from environment variables.

No secrets are hardcoded.

---

# 15. Error Handling

Centralized exception handling.

Custom exceptions include:

```
RepositoryNotFound

AnalysisAlreadyRunning

UnsupportedFramework

AuthenticationFailed

ScannerExecutionError

DockerBuildFailed

ScoreCalculationError
```

API responses always follow the standard response schema.

---

# 16. Logging Strategy

Structured logging is mandatory.

Every request includes:

* Request ID
* User ID
* Repository ID
* Analysis Job ID
* Timestamp

Levels:

```
DEBUG

INFO

WARNING

ERROR

CRITICAL
```

Logs are JSON formatted for production.

---

# 17. Validation Strategy

Validation occurs at multiple layers.

API Layer

* Request validation
* Authentication

Service Layer

* Business rule validation

Database Layer

* Constraints
* Foreign keys
* Unique indexes

No layer trusts another layer completely.

---

# 18. Caching Strategy

Redis caches:

* Repository metadata
* GitHub API responses
* Framework detection
* Dashboard summaries

Cache is invalidated after every successful analysis.

---

# 19. Testing Strategy

Testing pyramid:

```
               E2E

         Integration

          Unit Tests
```

Coverage goals:

| Test Type   | Target             |
| ----------- | ------------------ |
| Unit        | 80%+               |
| Integration | Core workflows     |
| API         | All endpoints      |
| Worker      | All analysis tasks |

Mock external services whenever possible.

---

# 20. Coding Standards

Formatting:

* Ruff
* Black

Type Safety:

* MyPy

Testing:

* Pytest

Commits:

* Conventional Commits

Git Hooks:

* Pre-commit

Documentation:

* Google-style docstrings

---

# 21. Performance Guidelines

* Async endpoints where appropriate.
* Batch database operations.
* Minimize GitHub API requests.
* Stream logs instead of loading them entirely.
* Paginate large datasets.
* Avoid N+1 queries.

---

# 22. Security Guidelines

* Never log secrets.
* Encrypt OAuth tokens.
* Validate all user input.
* Sanitize scanner output.
* Run repositories inside isolated containers.
* Delete temporary files after analysis.

---

# 23. Extensibility

Future modules can be added without modifying existing architecture.

Examples:

* Deployment Engine
* AI Mentor
* Plugin System
* Team Management
* Organization Policies
* Marketplace

New analyzers only need to implement the Analyzer interface and register themselves.

---

# 24. Backend Request Lifecycle

```
HTTP Request

↓

Authentication

↓

Validation

↓

Service Layer

↓

Repository Layer

↓

Database

↓

Business Logic

↓

Response Schema

↓

JSON Response
```

For long-running operations:

```
HTTP Request

↓

Create Job

↓

Queue Task

↓

Celery Worker

↓

Analysis

↓

Persist Results

↓

Client Polling / SSE

↓

Completed
```

---

# 25. Design Principles

The backend follows these engineering principles:

* **Single Responsibility Principle (SRP):** Every module has one reason to change.
* **Open/Closed Principle (OCP):** Extend functionality through new analyzers, not by modifying existing ones.
* **Dependency Inversion:** Business logic depends on abstractions, not frameworks.
* **Convention over Configuration:** Predictable project structure and naming.
* **Explicit over Implicit:** Clear interfaces, typed schemas, and documented flows.
* **Fail Gracefully:** Partial failures should not terminate an entire analysis.

---

# 26. Future Evolution

The modular monolith is intentionally designed so that any major module can later be extracted into an independent service.

Potential future services:

* Repository Service
* Analysis Service
* Scoring Service
* Recommendation Service
* Deployment Service

No API contracts or database redesign should be required during this transition.

---

# 27. Architectural Summary

The Preflight backend is built as a **modular monolith** with **clean architectural boundaries**, **asynchronous analysis workflows**, and a **plugin-based analyzer framework**. This design balances rapid development with long-term maintainability, enabling the platform to grow from a student-focused engineering readiness tool into a scalable developer platform without sacrificing code quality or architectural clarity.

