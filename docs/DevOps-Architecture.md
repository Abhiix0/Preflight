# Preflight

# DevOps Architecture Document (DAD)

**Version:** 1.0
**Status:** Approved
**Owner:** Platform Engineering Team
**Infrastructure Philosophy:** Automation First
**Cloud Target:** Docker-first (Cloud Agnostic)
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the DevOps architecture for **Preflight**.

It describes how the application is:

* Built
* Tested
* Packaged
* Deployed
* Monitored
* Scaled
* Maintained

The objective is to create a deployment pipeline that is reliable, repeatable, secure, and easy to operate.

---

# 2. DevOps Philosophy

Preflight follows six core principles.

### Everything as Code

Infrastructure, configuration, CI/CD pipelines, and environments are version-controlled.

---

### Automate Everything

No manual deployments.

No manual testing.

No manual builds.

Every deployment follows the exact same pipeline.

---

### Immutable Deployments

Each deployment is built from a Git commit and never modified after release.

---

### One Command to Ship

Developers should be able to deploy with a single action after code review.

---

### Fail Fast

Errors should be detected during CI, not after deployment.

---

### Cloud Agnostic

The platform should be deployable on any Docker-compatible infrastructure.

---

# 3. Infrastructure Overview

```text
                     GitHub
                        │
                        ▼
               GitHub Actions CI
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
     Lint           Unit Tests      Build Images
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                Container Registry
                        │
                        ▼
              Docker Compose Stack
                        │
 ┌──────────┬──────────┬──────────┬──────────┐
 ▼          ▼          ▼          ▼
Frontend  Backend     Redis   PostgreSQL
                        │
                        ▼
                   Celery Workers
                        │
                        ▼
                 Docker Analyzer
```

---

# 4. Technology Stack

| Category                | Technology                       |
| ----------------------- | -------------------------------- |
| Source Control          | GitHub                           |
| CI/CD                   | GitHub Actions                   |
| Containers              | Docker                           |
| Container Orchestration | Docker Compose                   |
| Registry                | GitHub Container Registry (GHCR) |
| Reverse Proxy           | Caddy (MVP)                      |
| Backend                 | FastAPI                          |
| Frontend                | Next.js                          |
| Database                | PostgreSQL                       |
| Cache                   | Redis                            |
| Workers                 | Celery                           |
| Object Storage          | MinIO                            |
| Monitoring              | Prometheus                       |
| Dashboards              | Grafana                          |
| Logs                    | Loki                             |
| Log Collection          | Promtail                         |
| Tracing                 | OpenTelemetry                    |

---

# 5. Environment Strategy

Three environments exist.

```text
Development

↓

Staging

↓

Production
```

---

## Development

Purpose

Local development

Characteristics

* Hot reload
* Debug logging
* Local PostgreSQL
* Local Redis
* Local MinIO
* Docker Compose

---

## Staging

Purpose

Pre-production testing

Characteristics

* Production-like
* Automatic deployment
* Test repositories
* Smoke tests

---

## Production

Purpose

Live application

Characteristics

* HTTPS
* Monitoring
* Backup
* Restricted debugging
* Automatic rollback capability

---

# 6. Repository Structure

```text
preflight/

frontend/

backend/

docker/

infra/

.github/

scripts/

docs/

docker-compose.yml

docker-compose.prod.yml

.env.example
```

Infrastructure lives alongside application code.

---

# 7. Container Strategy

Every service runs independently.

```text
Frontend

↓

Next.js Container
```

```text
Backend

↓

FastAPI Container
```

```text
Workers

↓

Celery Container
```

```text
Redis

↓

Redis Container
```

```text
PostgreSQL

↓

Database Container
```

```text
MinIO

↓

Storage Container
```

Each service has its own Dockerfile.

---

# 8. CI Pipeline

Every Pull Request executes:

```text
Checkout Code

↓

Install Dependencies

↓

Lint

↓

Format Check

↓

Type Check

↓

Unit Tests

↓

Build Docker Images

↓

Security Scan

↓

Success
```

No merge without passing CI.

---

# 9. CD Pipeline

After merge to `main`:

```text
Build Images

↓

Push to Registry

↓

Deploy Staging

↓

Smoke Tests

↓

Manual Approval

↓

Deploy Production

↓

Health Check

↓

Completed
```

---

# 10. Branch Strategy

```text
main

develop

feature/*

fix/*

release/*
```

Rules:

* Direct commits to `main` prohibited.
* Pull requests required.
* Code review mandatory.

---

# 11. Versioning

Semantic Versioning.

```text
v1.0.0

v1.1.0

v1.1.1
```

Git tags correspond to releases.

---

# 12. Environment Variables

Environment variables are stored outside source code.

Examples

```text
DATABASE_URL

REDIS_URL

JWT_SECRET

GITHUB_CLIENT_ID

GITHUB_CLIENT_SECRET

MINIO_ACCESS_KEY

MINIO_SECRET_KEY
```

`.env` files are never committed.

---

# 13. Build Process

Frontend

```text
Install

↓

Build

↓

Optimize

↓

Containerize
```

Backend

```text
Install

↓

Type Check

↓

Run Tests

↓

Containerize
```

---

# 14. Docker Compose Architecture

```text
docker-compose

│

├── frontend

├── backend

├── celery

├── redis

├── postgres

├── minio

├── prometheus

├── grafana

└── loki
```

One command starts the complete development environment.

---

# 15. Deployment Workflow

```text
Developer

↓

Git Push

↓

GitHub Actions

↓

CI Success

↓

Container Build

↓

Registry Push

↓

Deployment

↓

Health Check

↓

Release Complete
```

---

# 16. Health Checks

Every service exposes:

```text
/health
```

Checks include:

* Database
* Redis
* Storage
* Queue
* API

Docker uses these endpoints for readiness.

---

# 17. Logging Architecture

All services produce structured JSON logs.

```text
Application

↓

Promtail

↓

Loki

↓

Grafana
```

Every log contains:

* Timestamp
* Request ID
* Service
* Severity
* User ID (where applicable)

---

# 18. Monitoring

Metrics collected:

Backend

* Request latency
* Error rate
* Active users
* Queue depth

Workers

* Running jobs
* Failed jobs
* Processing time

Database

* Connections
* Query time
* Storage

Infrastructure

* CPU
* Memory
* Disk
* Network

---

# 18.1 SLIs and SLOs

| Area | SLI | SLO (MVP target) |
| ---- | --- | ---------------- |
| Analysis duration | Time from `QUEUED` to terminal state | p95 ≤ 5 minutes for repositories within size limits |
| API latency | Request duration for authenticated API endpoints | p95 ≤ 300 ms excluding long-running analysis creation acknowledgements |
| Job success rate | Share of analysis jobs reaching `COMPLETED` (excluding user `CANCELLED`) | ≥ 95% over a rolling 7-day window |
| Deployment success rate | Share of production deploys that pass post-deploy health checks | ≥ 99% over a rolling 30-day window |

SLIs are exported via Prometheus metrics and correlated with OpenTelemetry traces. SLO burn alerts are introduced after baseline traffic exists.

---

# 19. Alerting

Future alerts:

* Service unavailable
* High error rate
* Queue backlog
* Failed deployment
* Database unavailable
* Storage full
* SLO burn-rate violations

---

# 20. Backup Strategy

### PostgreSQL

Daily snapshots

Encrypted storage

### MinIO

Daily backup of object storage buckets, including:

* Generated reports
* Build / analysis logs retained for audit
* Release artifacts / SBOMs when stored

### Audit Logs

* Export and retain audit log streams independently of application database backups
* Protect audit backups from overwrite by application operators where feasible

### Generated Reports

* Reports in PostgreSQL JSONB are covered by database backups
* Report artifacts in MinIO are covered by object-storage backups

### Retention

```text
Daily

7 Days

Weekly

4 Weeks

Monthly

6 Months
```

Recovery objectives remain RPO 24 hours / RTO 1 hour unless tightened per environment.

---

# 21. Rollback Strategy

Every deployment is versioned.

Rollback process:

```text
Select Previous Image

↓

Redeploy

↓

Health Check

↓

Traffic Restored
```

Rollback requires no database rollback unless migrations are breaking.

---

# 22. Database Migrations

Alembic manages schema changes.

Deployment process:

```text
Deploy Backend

↓

Run Migration

↓

Verify

↓

Start Services
```

Migration rules:

* Forward-only
* Reviewed before release
* Tested in staging

---

# 23. Dependency Management

Python

* `uv`

Node.js

* `pnpm`

Dependencies are locked.

Lockfiles are committed.

---

# 24. Secrets Management

Secrets are never stored in Git.

Development

`.env` (local only, never committed)

Production

Use a dedicated secrets manager (for example HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, or Doppler). Do **not** rely on long-lived plaintext environment variables as the primary production secret store.

Recommended production pattern:

* Secrets manager is the source of truth
* Runtime injects secrets into the application at deploy/start time
* Encryption keys for OAuth tokens are stored and rotated in the secrets manager
* Access is least-privilege and audited

Examples:

* JWT keys
* OAuth credentials
* Database passwords
* Storage credentials
* Token encryption keys

---

# 25. Scaling Strategy

Horizontal scaling supported for:

* FastAPI
* Celery Workers
* Frontend

Vertical scaling for:

* PostgreSQL
* Redis

MVP orchestration remains **Docker Compose**. Kubernetes is not part of the MVP.

---

# 25.1 Migration Path: Docker Compose → Kubernetes or ECS

Post-MVP, the Compose stack can migrate without redesigning application modules:

1. Keep images identical; promote the same GHCR artifacts.
2. Map Compose services to Kubernetes Deployments/Services or ECS services/tasks.
3. Replace Compose-managed PostgreSQL/Redis/MinIO with managed equivalents when ready.
4. Move secrets from Compose env files into the cloud secrets manager / Kubernetes Secrets sealed from the secrets manager.
5. Introduce horizontal worker autoscaling after queue depth SLIs justify it.
6. Retain OpenTelemetry instrumentation so traces/metrics remain continuous across orchestrators.

Compose remains the local and MVP production path until operational scale requires Kubernetes or ECS.

---

# 26. Disaster Recovery

Recovery flow:

```text
Infrastructure Failure

↓

Restore Database

↓

Restore Storage (MinIO / reports / audit exports)

↓

Deploy Containers

↓

Verify Health

↓

Resume Service
```

---

# 27. Observability

Three pillars, plus tracing:

### Logs

Loki

---

### Metrics

Prometheus

---

### Traces

OpenTelemetry is the tracing standard.

* Instrument FastAPI, Celery workers, and outbound GitHub/Docker calls
* Export to an OTLP-compatible backend (collector → Jaeger/Tempo or equivalent)
* Propagate trace context across API → queue → worker spans using analysis `job_id` as a correlating attribute

---

### Dashboards

Grafana

---

# 28. Deployment Principles

Deployments must be:

* Automated
* Repeatable
* Observable
* Reversible
* Versioned
* Tested

No manual server configuration.

---

# 29. Future Platform Evolution

Future improvements:

* Kubernetes or ECS (post-MVP; see §25.1)
* Helm Charts
* ArgoCD
* Terraform
* Multi-region deployment
* CDN
* Auto Scaling
* Blue-Green Deployment
* Canary Releases
* Service Mesh

The MVP architecture leaves room for these enhancements without requiring major redesign. Kubernetes is explicitly out of MVP scope.

---

# 30. DevOps Summary

Preflight's DevOps architecture emphasizes automation, reproducibility, and operational simplicity. A Docker-first, cloud-agnostic approach allows the platform to be developed locally, validated in staging, and deployed consistently to production. GitHub Actions, containerized services, structured observability with OpenTelemetry, defined SLIs/SLOs, and automated deployment pipelines ensure that engineering teams can ship confidently while maintaining reliability and operational visibility.
