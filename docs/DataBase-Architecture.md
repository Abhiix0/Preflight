# Preflight

# Database Design Document (DDD)

**Version:** 1.0
**Status:** Approved
**Owner:** Backend Engineering
**Database:** PostgreSQL 17+
**ORM:** SQLAlchemy 2.0
**Migration Tool:** Alembic

---

# 1. Purpose

This document defines the database architecture for **Preflight**, including domain modeling, entity relationships, constraints, indexing strategies, naming conventions, and future extensibility.

The database is designed to support:

* High-performance repository analysis
* Historical analysis tracking
* Production readiness scoring
* Recommendation generation
* Future deployment capabilities

The design follows **Third Normal Form (3NF)** while selectively using **JSONB** where flexibility is more valuable than strict normalization.

---

# 2. Database Philosophy

## Why PostgreSQL?

PostgreSQL provides the ideal balance between relational consistency and modern document capabilities.

Reasons:

* ACID transactions
* Excellent JSONB support
* Strong indexing
* Full-text search
* Extensions
* Mature ecosystem
* Excellent SQLAlchemy support

MongoDB was intentionally rejected because relationships dominate this domain.

---

# 3. Domain Model

The database is organized into independent business domains.

```text
Identity Domain
│
├── users
├── oauth_accounts
└── sessions

Repository Domain
│
├── repositories
├── projects
└── analysis_jobs

Analysis Domain
│
├── findings
├── scores
├── recommendations
└── reports

Future Deployment Domain
│
├── deployments
├── deployment_logs
└── providers
```

Each domain owns its entities and relationships.

---

# 4. High-Level ER Diagram

```text
Users
 │
 ├──────────────┐
 │              │
 ▼              ▼
Projects     OAuth Accounts
 │
 ▼
Repositories
 │
 ▼
Analysis Jobs
 │
 ├────────────┬──────────────┬──────────────┐
 ▼            ▼              ▼              ▼
Findings   Scores   Recommendations    Reports
```

---

# 5. Entity Definitions

---

## users

Stores platform users.

| Column     | Type          |
| ---------- | ------------- |
| id         | UUID PK       |
| github_id  | BIGINT UNIQUE |
| username   | VARCHAR(100)  |
| email      | VARCHAR(255)  |
| avatar_url | TEXT          |
| created_at | TIMESTAMP     |
| updated_at | TIMESTAMP     |

### Relationships

```
User

↓

Projects

↓

Repositories
```

---

## oauth_accounts

Stores OAuth provider information.

| Column        | Type             |
| ------------- | ---------------- |
| id            | UUID             |
| user_id       | FK               |
| provider      | VARCHAR          |
| access_token  | TEXT (encrypted) |
| refresh_token | TEXT             |
| expires_at    | TIMESTAMP        |

---

## sessions

Tracks active user sessions.

| Column     | Type      |
| ---------- | --------- |
| id         | UUID      |
| user_id    | FK        |
| jwt_id     | UUID      |
| expires_at | TIMESTAMP |

---

## projects

Logical grouping of repositories.

Example

```
Preflight

↓

Frontend

Backend

CLI

Docs
```

Columns

| Column      | Type      |
| ----------- | --------- |
| id          | UUID      |
| user_id     | FK        |
| name        | VARCHAR   |
| description | TEXT      |
| created_at  | TIMESTAMP |

---

## repositories

Connected GitHub repositories.

| Column          | Type      |
| --------------- | --------- |
| id              | UUID      |
| project_id      | FK        |
| github_repo_id  | BIGINT    |
| name            | VARCHAR   |
| owner           | VARCHAR   |
| default_branch  | VARCHAR   |
| language        | VARCHAR   |
| framework       | VARCHAR   |
| last_commit_sha | VARCHAR   |
| repository_url  | TEXT      |
| created_at      | TIMESTAMP |

---

## analysis_jobs

Tracks repository analyses.

| Column        | Type           |
| ------------- | -------------- |
| id            | UUID           |
| repository_id | FK             |
| status        | ENUM           |
| started_at    | TIMESTAMP      |
| completed_at  | TIMESTAMP      |
| worker_id     | VARCHAR        |
| duration_ms   | INTEGER        |
| triggered_by  | UUID FK(users) |

---

### AnalysisStatus ENUM

```
PENDING

QUEUED

RUNNING

FAILED

COMPLETED

CANCELLED
```

---

## findings

Stores every issue detected.

| Column          | Type    |
| --------------- | ------- |
| id              | UUID    |
| analysis_job_id | FK      |
| category        | ENUM    |
| severity        | ENUM    |
| title           | VARCHAR |
| description     | TEXT    |
| file_path       | TEXT    |
| line_number     | INTEGER |
| scanner         | VARCHAR |
| metadata        | JSONB   |

---

### FindingCategory

```
SECURITY

CODE_QUALITY

DOCUMENTATION

TESTING

DOCKER

API

PERFORMANCE

CONFIGURATION
```

---

### Severity

```
CRITICAL

HIGH

MEDIUM

LOW

INFO
```

---

## scores

Stores Preflight Score™.

| Column                | Type      |
| --------------------- | --------- |
| id                    | UUID      |
| analysis_job_id       | FK        |
| overall_score         | INTEGER   |
| security_score        | INTEGER   |
| documentation_score   | INTEGER   |
| testing_score         | INTEGER   |
| deployment_score      | INTEGER   |
| maintainability_score | INTEGER   |
| architecture_score    | INTEGER   |
| created_at            | TIMESTAMP |

---

## recommendations

Educational recommendations.

| Column            | Type    |
| ----------------- | ------- |
| id                | UUID    |
| finding_id        | FK      |
| priority          | INTEGER |
| title             | VARCHAR |
| explanation       | TEXT    |
| recommendation    | TEXT    |
| estimated_minutes | INTEGER |
| documentation_url | TEXT    |
| metadata          | JSONB   |

---

## reports

Stores generated reports.

| Column          | Type      |
| --------------- | --------- |
| id              | UUID      |
| analysis_job_id | FK        |
| report_version  | INTEGER   |
| summary         | TEXT      |
| report_json     | JSONB     |
| created_at      | TIMESTAMP |

---

# 6. Relationship Summary

```
User

1 → N Projects

Project

1 → N Repositories

Repository

1 → N Analysis Jobs

Analysis Job

1 → N Findings

Analysis Job

1 → 1 Score

Analysis Job

1 → N Recommendations

Analysis Job

1 → 1 Report
```

---

# 7. JSONB Strategy

JSONB is intentionally used where schemas may evolve.

Used for:

* Scanner outputs
* Rule metadata
* Future plugins
* Report payloads
* Recommendation metadata

Example

```json
{
  "rule": "AWS_SECRET",
  "confidence": 0.97,
  "scanner": "detect-secrets",
  "references": [
    "https://..."
  ]
}
```

---

# 8. Indexing Strategy

Primary indexes

```
users.github_id

repositories.github_repo_id

analysis_jobs.repository_id

analysis_jobs.status

findings.analysis_job_id

findings.severity

recommendations.finding_id
```

Composite indexes

```
(repository_id, created_at DESC)

(analysis_job_id, severity)

(user_id, created_at DESC)
```

GIN indexes

```
findings.metadata

reports.report_json
```

---

# 9. Constraints

Examples

```
github_id UNIQUE

email UNIQUE

repository_url UNIQUE

overall_score CHECK

0 <= score <= 100

duration_ms >= 0
```

Foreign Keys

```
ON DELETE CASCADE

Projects

↓

Repositories

↓

Analysis Jobs

↓

Findings
```

---

# 10. Audit Columns

Every table contains:

```
created_at

updated_at
```

Soft deletes are **not** implemented in the MVP.

Deleted repositories and analyses are permanently removed.

---

# 11. Naming Conventions

Tables

```
snake_case

plural
```

Columns

```
snake_case
```

Primary Keys

```
id
```

Foreign Keys

```
user_id

project_id

repository_id
```

Enums

```
PascalCase (Python)

UPPER_SNAKE_CASE (Database values)
```

---

# 12. Migration Strategy

All schema changes are managed with Alembic.

Rules:

* Never edit an existing migration.
* One feature per migration.
* Always include downgrade scripts.
* Review generated SQL before applying.

---

# 13. Performance Strategy

* UUID primary keys for distributed safety.
* Connection pooling via SQLAlchemy.
* Read-heavy queries optimized with indexes.
* JSONB indexed using GIN.
* Historical reports archived after retention period (future).

---

# 14. Security Considerations

* OAuth tokens encrypted at rest.
* No plaintext secrets stored.
* JWT identifiers only, never JWT payloads.
* Reports sanitized before storage.
* Temporary repository data removed after analysis.

---

# 15. Future Schema Extensions

Reserved domains include:

* Deployments
* Deployment Providers
* Build Logs
* Organizations
* Teams
* Role-Based Access Control (RBAC)
* Plugin Registry
* Notification Center
* Billing & Subscription
* Audit Logs

These additions will not require changes to existing core tables due to the domain-oriented design.

---

# 16. Data Lifecycle

```text
User
  │
  ▼
Project
  │
  ▼
Repository
  │
  ▼
Analysis Job
  │
  ├──────────┬──────────┬──────────┐
  ▼          ▼          ▼          ▼
Findings   Score   Recommendations Report
```

Completed analyses remain available for historical comparison until explicitly deleted by the user.

---

# 17. Database Design Principles

1. **Single Source of Truth**: Each piece of data has one authoritative location.
2. **Normalize First, Optimize Later**: Avoid duplication unless profiling proves it necessary.
3. **Flexible Metadata**: Use JSONB only for evolving or tool-specific data.
4. **Immutable Analysis Results**: Once an analysis completes, its findings and scores are never modified. A new analysis creates a new record.
5. **Future-Proof Relationships**: Design domains so new features can be added without schema redesign.

---

# 18. Architectural Summary

The Preflight database is built around **domain-driven modeling**, emphasizing clear ownership, historical traceability, and extensibility. The schema balances relational integrity with selective flexibility through JSONB, ensuring the platform can evolve from a student-focused engineering readiness tool into a broader developer platform without major structural changes.

