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
 Repository      Security Scanner   Docker Runner   JS Analyzers
   Module             Module            Module      (subprocesses)
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
| JavaScript Analysis | Subprocess analyzers (Node.js tooling invoked by FastAPI) |
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
* Emit domain events
* Notify the frontend

The orchestrator **never performs analysis itself**.

It only coordinates the workflow.

---

### Job State Machine

```text
PENDING
  │
  ▼
QUEUED
  │
  ▼
RUNNING ──────► CANCELLED
  │
  ├──► COMPLETED
  │
  └──► FAILED
```

Transitions:

| From | To | Trigger |
| ---- | -- | ------- |
| PENDING | QUEUED | Job accepted and enqueued |
| QUEUED | RUNNING | Worker claims job |
| RUNNING | COMPLETED | All required stages finish |
| RUNNING | FAILED | Unrecoverable error or timeout |
| RUNNING | CANCELLED | User cancellation |
| QUEUED | CANCELLED | User cancellation before start |

Terminal states: `COMPLETED`, `FAILED`, `CANCELLED`.

---

### Task Dependency Flow

```text
Clone Repository
        │
        ▼
Detect Tech Stack
        │
        ├──────────────┬──────────────┐
        ▼              ▼              ▼
 Security         Static / JS      Docker
 Analyzers         Analyzers      Validation
        │              │              │
        └──────────────┼──────────────┘
                       ▼
              Aggregate Findings
                       │
                       ▼
              Calculate Score
                       │
                       ▼
           Generate Recommendations
                       │
                       ▼
              Generate Report
```

Clone and stack detection are sequential prerequisites. Security, static/JavaScript, and Docker analyzers may run in parallel after detection. Scoring, recommendations, and reporting run only after aggregation.

---

### Retry Strategy

* Transient failures (network, GitHub rate limits, temporary Docker daemon errors) retry with exponential backoff.
* Default: up to 3 attempts per task.
* Permanent failures (auth revoked, repository deleted, unsupported size) fail immediately without retry.
* Retries never duplicate side effects already persisted for the same `job_id` + task name.

---

### Partial Failure Handling

* Analyzer failures are isolated; one analyzer failure does not abort the job.
* Failed analyzers emit findings or job-level warnings.
* Scoring continues with available results.
* Docker build failure records a deployment finding and allows remaining analyzers to finish.
* Only orchestration-level failures (clone failure, timeout budget exhausted, cancellation) mark the job terminal as `FAILED` or `CANCELLED`.

---

### Idempotency

* Starting analysis for the same repository commit with the same `analysis_version` and `ruleset_version` returns the existing job when one is already `QUEUED` or `RUNNING`.
* Completed analyses for an identical commit snapshot may be reused instead of creating a duplicate job.
* Domain events and result persistence are keyed by `job_id` so retries do not create duplicate scores or reports.

---

## Internal Domain Events

The orchestrator publishes internal domain events for analysis lifecycle observability and worker coordination.

| Event | When |
| ----- | ---- |
| `AnalysisCreated` | Job record created and accepted |
| `AnalysisStarted` | Worker begins execution |
| `AnalysisCompleted` | Job reaches `COMPLETED` |
| `AnalysisFailed` | Job reaches `FAILED` |

Events are internal to the backend (not a public webhook API in the MVP). They feed progress tracking, SSE updates, audit logs, and metrics.

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

### Sandbox Hardening

Analysis containers enforce:

* Rootless containers where the host supports them
* Non-root execution inside the container
* Read-only filesystem (writable temp mounts only where required)
* Disabled networking by default
* CPU limits
* Memory limits
* PID limits
* Seccomp profile
* AppArmor or SELinux confinement when available on the host

Containers are ephemeral and never reused.

---

## JavaScript Analysis

JavaScript and TypeScript analysis runs as **subprocess-based analyzers** invoked by the FastAPI backend and Celery workers.

Responsibilities:

* package.json parsing
* npm / pnpm / yarn detection
* Next.js analysis
* React analysis
* Express analysis

There is **no dedicated Node.js analysis microservice** in the MVP. Node.js tooling may be installed in the worker environment and executed as short-lived subprocesses under the same orchestrator and sandbox controls as other analyzers.

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

Architecture scoring is deferred to V2.

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

Run Static / JavaScript Analysis (subprocesses)

↓

Run Docker Validation

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

Emit AnalysisCompleted

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

JavaScript Analyzers (subprocesses)

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

Major technical decisions are documented in `docs/ADR.md`.

Initial ADRs:

* ADR-001: Modular Monolith over Microservices
* ADR-002: FastAPI as the Primary Backend
* ADR-003: PostgreSQL over MongoDB
* ADR-004: Docker Sandbox for Repository Analysis
* ADR-005: Plugin-Based Analyzer Framework
* ADR-006: REST API over GraphQL
* ADR-007: GitHub OAuth as Authentication Provider
* ADR-008: Server-Sent Events for Live Progress
* ADR-016: Engineering Readiness Standard
* ADR-017: Sandbox Execution Model
* ADR-018: Multi-language Analysis Strategy

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
