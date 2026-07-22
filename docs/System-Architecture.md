# Preflight

# System Architecture Document (SAD)

**Version:** 1.0
**Status:** Approved
**Owner:** Engineering Team
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the technical architecture of **Preflight**, an Engineering Readiness Platform that analyzes GitHub repositories, evaluates production readiness, and helps developers understand and improve their projects before deployment.

The architecture prioritizes:

* Maintainability
* Simplicity
* Scalability
* Educational value
* Modular design

Although Preflight is built as a **modular monolith** for the MVP, every module is designed so it can later be extracted into an independent service without major refactoring.

---

# 2. Architecture Philosophy

Preflight follows four core principles.

### Modular Monolith

All business logic lives inside one backend application.

Modules communicate internally instead of over HTTP.

This dramatically reduces deployment complexity while keeping clear service boundaries.

---

### API First

Every capability is exposed through REST APIs.

The frontend never communicates directly with databases or background workers.

---

### Asynchronous Processing

Repository analysis is long-running.

Every analysis executes in the background while the frontend receives live progress updates.

---

### Separation of Concerns

Each module owns exactly one responsibility.

Business logic is never duplicated.

---

# 3. High-Level Architecture

```text
                    ┌──────────────────────────┐
                    │      Next.js Frontend    │
                    │ Dashboard + Reports UI   │
                    └──────────────┬───────────┘
                                   │ HTTPS
                                   ▼
                    ┌──────────────────────────┐
                    │       FastAPI API        │
                    │     (Modular Monolith)   │
                    └──────────────┬───────────┘
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             ▼                     ▼                     ▼
      PostgreSQL              Redis Queue          Object Storage
                                                     (MinIO)

                                   │
                                   ▼
                           Celery Worker Pool
                                   │
                                   ▼
                      Analysis Orchestrator
                                   │
          ┌───────────────┬───────────────┬───────────────┐
          ▼               ▼               ▼               ▼
 Repository      Security Scanner   Docker Runner   JS Analyzer
   Module             Module            Module         Module
          └───────────────┬───────────────┴───────────────┘
                          ▼
                   Scoring Engine
                          ▼
              Recommendation Engine
                          ▼
                 Report Generator
```

---

# 4. Technology Stack

| Layer               | Technology                 |
| ------------------- | -------------------------- |
| Frontend            | Next.js + TypeScript       |
| Styling             | Tailwind CSS + shadcn/ui   |
| Backend             | FastAPI                    |
| Validation          | Pydantic                   |
| ORM                 | SQLAlchemy                 |
| Migrations          | Alembic                    |
| Database            | PostgreSQL                 |
| Cache               | Redis                      |
| Background Jobs     | Celery                     |
| Object Storage      | MinIO (Local), S3 (Future) |
| Authentication      | GitHub OAuth + JWT         |
| Containers          | Docker                     |
| Package Manager     | uv                         |
| JavaScript Analysis | Node.js + Express          |
| API Docs            | OpenAPI / Swagger          |

---

# 5. Core Modules

## Authentication Module

Responsible for:

* GitHub OAuth
* JWT authentication
* Refresh tokens
* User sessions
* Repository permissions

Owns:

* Users
* Sessions
* OAuth credentials

---

## Repository Module

Responsible for:

* Repository cloning
* Git metadata
* Branch selection
* Framework detection
* Language detection
* Dependency discovery

Produces a standardized Repository Profile.

---

## Analysis Orchestrator

The orchestrator coordinates the complete engineering analysis workflow.

Responsibilities:

* Create analysis jobs
* Schedule worker tasks
* Track analysis progress
* Retry failed tasks
* Aggregate results
* Trigger score generation
* Notify the frontend

The orchestrator **never performs analysis itself**.

It only coordinates the workflow.

---

## Security Module

Runs external security tools including:

* Semgrep
* Bandit
* detect-secrets
* pip-audit
* Trivy (future)

Normalizes all outputs into a unified finding format.

---

## Docker Validation Module

Creates isolated Docker containers for every repository.

Workflow:

1. Build image
2. Install dependencies
3. Start application
4. Validate startup
5. Capture logs
6. Destroy container

This verifies that the application works outside the developer's local machine.

---

## JavaScript Analysis Module

Dedicated Node.js service.

Responsibilities:

* package.json parsing
* npm validation
* pnpm/yarn detection
* Next.js analysis
* React analysis
* Express analysis

This service exists because JavaScript tooling evolves independently from Python tooling.

---

## Scoring Engine

Calculates the **Preflight Score™**.

Categories include:

* Security
* Maintainability
* Documentation
* Testing
* Deployment Readiness
* Configuration
* Architecture

Scores are deterministic and reproducible.

---

## Recommendation Engine

Transforms technical findings into educational recommendations.

Each recommendation includes:

* Issue summary
* Severity
* Why it matters
* Recommended fix
* Estimated effort
* Learning resources

---

## Report Module

Generates the Engineering Readiness Report.

Outputs:

* JSON report
* Dashboard view
* Historical reports

Future:

* PDF export
* Shareable reports

---

# 6. Analysis Workflow

```
User clicks Analyze

↓

FastAPI validates request

↓

Create Analysis Job

↓

Store Job in Database

↓

Queue Background Task

↓

Return Job ID

↓

Analysis Orchestrator Starts

↓

Clone Repository

↓

Detect Tech Stack

↓

Run Security Analysis

↓

Run Docker Validation

↓

Run JavaScript Analysis

↓

Aggregate Findings

↓

Calculate Preflight Score™

↓

Generate Recommendations

↓

Generate Engineering Report

↓

Persist Results

↓

Notify Frontend

↓

Analysis Complete
```

---

# 7. Data Flow

```
GitHub Repository

↓

Repository Module

↓

Analysis Queue

↓

Analysis Orchestrator

↓

Security Module

↓

Docker Module

↓

JavaScript Module

↓

Finding Aggregator

↓

Scoring Engine

↓

Recommendation Engine

↓

Report Generator

↓

PostgreSQL

↓

Frontend Dashboard
```

---

# 8. Background Processing

Repository analysis is fully asynchronous.

The frontend never waits for analysis to complete.

Instead:

```
POST /analysis

↓

Job Created

↓

HTTP 202 Accepted

↓

Worker Executes

↓

Progress Updates

↓

Completed
```

Progress is delivered using Server-Sent Events (SSE) for the MVP.

---

# 9. Data Storage Strategy

### PostgreSQL

Stores:

* Users
* Repositories
* Projects
* Analysis jobs
* Findings
* Scores
* Recommendations
* Reports

---

### Redis

Stores:

* Celery queues
* Job state
* Temporary cache

---

### Object Storage

Stores:

* Temporary repository archives
* Generated reports
* Build logs
* Future deployment artifacts

Repositories are deleted after analysis completes.

---

# 10. Security Architecture

Authentication

GitHub OAuth

↓

JWT

↓

Authorization

↓

API Validation

↓

Encrypted Secrets

↓

Ephemeral Containers

↓

Automatic Cleanup

No repository is permanently stored on the server.

---

# 11. Fault Tolerance

Preflight continues analysis even if one subsystem fails.

Examples:

* If Semgrep fails, Bandit still executes.
* If Docker validation fails, repository analysis continues.
* If README analysis fails, scoring still completes.

Each module reports failures independently.

---

# 12. Scalability Strategy

The modular monolith is designed for future extraction.

Potential future services:

* Repository Service
* Security Service
* Docker Service
* Recommendation Service
* Deployment Service

No public API contracts need to change during extraction.

---

# 13. Architecture Decision Records (ADR)

Major technical decisions will be documented separately.

Initial ADRs:

* ADR-001: Modular Monolith over Microservices
* ADR-002: FastAPI as the Primary Backend
* ADR-003: Celery + Redis for Background Processing
* ADR-004: External Scanner Orchestration
* ADR-005: Ephemeral Docker Validation
* ADR-006: GitHub OAuth as the Initial Identity Provider
* ADR-007: Server-Sent Events for Real-Time Progress

---

# 14. Future Extensions

The architecture intentionally supports future capabilities without redesign.

Planned extensions include:

* One-click deployment (V2)
* Additional framework support
* Pull request analysis
* Continuous repository monitoring
* Team workspaces
* Organization policies
* AI engineering mentor
* Plugin ecosystem

---

# 15. Architectural Summary

Preflight is designed as a **modular monolith with asynchronous workers**, combining the simplicity required for rapid development with the modularity required for long-term growth.

The architecture emphasizes orchestration rather than reinvention. Existing engineering tools are coordinated through a unified analysis pipeline, enriched with educational recommendations and a deterministic **Preflight Score™**. This approach aligns with the platform's mission of helping developers understand, improve, and confidently ship production-ready software while providing a clean migration path toward a distributed architecture as the product evolves.

---
