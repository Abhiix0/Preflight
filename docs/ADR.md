# Preflight

# Architecture Decision Records (ADR)

**Version:** 1.0

**Status:** Approved

**Owner:** Engineering Team

---

# What is an ADR?

An Architecture Decision Record documents:

* The problem
* The options considered
* The decision
* Why the decision was made
* Trade-offs
* Future consequences

Every significant architectural decision gets its own ADR.

---

# ADR Index

| ADR     | Title                                  | Status   |
| ------- | -------------------------------------- | -------- |
| ADR-001 | Modular Monolith over Microservices    | Accepted |
| ADR-002 | FastAPI as Primary Backend             | Accepted |
| ADR-003 | Next.js App Router                     | Accepted |
| ADR-004 | PostgreSQL over MongoDB                | Accepted |
| ADR-005 | Celery + Redis for Background Jobs     | Accepted |
| ADR-006 | GitHub OAuth Authentication            | Accepted |
| ADR-007 | Docker Sandbox for Repository Analysis | Accepted |
| ADR-008 | Plugin-Based Analyzer Architecture     | Accepted |
| ADR-009 | REST API over GraphQL                  | Accepted |
| ADR-010 | GitHub Actions for CI/CD               | Accepted |
| ADR-011 | Docker Compose for MVP Infrastructure  | Accepted |
| ADR-012 | Modular Frontend with Feature Slices   | Accepted |
| ADR-013 | JSONB for Flexible Scanner Metadata    | Accepted |
| ADR-014 | Server-Sent Events for Live Progress   | Accepted |
| ADR-015 | Cloud-Agnostic Deployment Strategy     | Accepted |

---

# ADR Template

Every ADR follows the same structure.

```text
Title

Status

Context

Decision

Alternatives Considered

Consequences

Future Review
```

---

# ADR-001

## Modular Monolith over Microservices

### Status

Accepted

---

### Context

Preflight is initially developed by a single engineer.

The platform has clear business domains but limited operational resources.

Using microservices would increase:

* Deployment complexity
* Debugging difficulty
* Infrastructure cost
* Development overhead

without providing proportional value.

---

### Decision

Build the MVP as a **Modular Monolith** using FastAPI.

Business domains remain isolated internally so they can be extracted later if necessary.

---

### Alternatives Considered

Microservices

Rejected because:

* Too much operational overhead
* Requires service discovery
* More complex deployments
* Slower development

---

### Consequences

Pros

* Faster development
* Easier debugging
* Single deployment
* Simpler testing

Cons

* Larger application
* Requires discipline to maintain module boundaries

---

### Review Trigger

Revisit when:

* Multiple engineering teams exist.
* Backend exceeds ~150k LOC.
* Independent deployment becomes necessary.

---

# ADR-002

## FastAPI as Primary Backend

### Status

Accepted

---

### Context

The backend requires:

* Async support
* Automatic API documentation
* Strong typing
* High performance
* Excellent Python ecosystem integration

---

### Decision

Use **FastAPI** as the primary backend framework.

---

### Alternatives Considered

**Django**

Pros:

* Mature ecosystem

Cons:

* Too opinionated
* Unnecessary features for this project

---

**Flask**

Pros:

* Lightweight

Cons:

* Requires more boilerplate
* No native typing or OpenAPI generation

---

**NestJS**

Pros:

* Excellent architecture

Cons:

* JavaScript ecosystem
* Project already centered on Python analyzers

---

### Consequences

Pros

* Native async
* Automatic Swagger
* Strong typing
* Excellent performance

Cons

* Smaller ecosystem than Django

---

### Review Trigger

Only reconsider if Python ceases to be the primary implementation language.

---

# ADR-003

## PostgreSQL over MongoDB

### Context

Preflight manages highly relational data:

* Users
* Projects
* Repositories
* Analysis Jobs
* Findings
* Reports
* Scores

Strong relationships and transactional consistency are more important than schema flexibility.

---

### Decision

Use PostgreSQL as the primary database.

Use JSONB selectively for evolving scanner metadata.

---

### Alternatives Considered

MongoDB

Rejected because:

* Weak relational modeling
* Higher risk of data duplication
* More complex joins at the application layer

---

### Consequences

Pros

* ACID compliance
* Mature indexing
* Powerful SQL
* JSONB flexibility

Cons

* Requires migrations

---

# ADR-004

## Docker Sandbox for Repository Analysis

### Context

Repositories connected by users are untrusted code.

Executing them directly on the host creates unacceptable security risks.

---

### Decision

Every analysis executes inside an isolated Docker container.

Containers are:

* Ephemeral
* Resource-limited
* Automatically destroyed

---

### Alternatives Considered

Native execution

Rejected because it exposes the host environment.

Virtual Machines

Rejected due to significantly higher resource usage and slower startup.

---

### Consequences

Pros

* Strong isolation
* Reproducible builds
* Consistent environments

Cons

* Slightly higher execution overhead

---

# ADR-005

## Plugin-Based Analyzer Framework

### Context

Preflight will continuously gain new analyzers.

Examples:

* README Analyzer
* Secret Scanner
* Docker Analyzer
* Dependency Analyzer
* License Analyzer

The architecture should support adding analyzers without modifying existing logic.

---

### Decision

Every analyzer implements a shared interface and registers itself with the orchestrator.

---

### Consequences

Pros

* Open/Closed Principle
* Easy extensibility
* Independent testing
* Cleaner orchestration

Cons

* Slightly more abstraction than a simple function-based approach

---

# ADR-006

## REST API over GraphQL

### Context

The frontend primarily consumes well-defined resources and workflows.

GraphQL would add flexibility but also increase operational complexity.

---

### Decision

Expose a versioned REST API.

---

### Alternatives Considered

GraphQL

Rejected because:

* Higher complexity
* Additional caching considerations
* Limited immediate value for the MVP

---

### Consequences

Pros

* Simpler clients
* Easier caching
* Straightforward documentation

Cons

* Less flexible querying

---

# ADR-007

## GitHub OAuth as Authentication Provider

### Context

All users interact with GitHub repositories.

GitHub already provides verified identities and repository permissions.

---

### Decision

GitHub OAuth is the sole authentication provider for the MVP.

---

### Future Review

Expand to Google OAuth, SSO, and enterprise identity providers as organizational features are introduced.

---

# ADR-008

## Server-Sent Events for Live Analysis Progress

### Context

Repository analysis is a one-way stream of progress updates.

The frontend needs live status without the complexity of full-duplex communication.

---

### Decision

Use **Server-Sent Events (SSE)** for real-time progress updates.

---

### Alternatives Considered

**Polling**

Rejected due to unnecessary network traffic and delayed updates.

**WebSockets**

Rejected because bidirectional communication is unnecessary for the MVP.

---

### Consequences

Pros

* Simpler implementation
* Lower overhead
* Native browser support

Cons

* One-way communication only

---

# ADR-009

## GitHub Actions for CI/CD

### Decision

GitHub Actions is the default CI/CD platform.

Reasons:

* Repository-native
* Good Docker support
* Marketplace ecosystem
* Free tier suitable for MVP

---

# ADR-010

## Cloud-Agnostic Infrastructure

### Decision

Avoid vendor-specific services in the MVP.

Everything should run locally with Docker Compose and be portable to any Docker-compatible cloud.

This prevents vendor lock-in and simplifies contributor onboarding.

---

# ADR Governance

New ADRs are required whenever an architectural decision:

* Changes infrastructure
* Introduces a major dependency
* Alters deployment strategy
* Changes database technology
* Changes authentication
* Changes communication patterns
* Introduces new architectural patterns

Each ADR must include a review trigger so future engineers know when to revisit the decision.

---

# ADR Summary

Architecture Decision Records ensure that Preflight's technical evolution remains intentional and traceable. By documenting the context, alternatives, trade-offs, and consequences behind every major engineering choice, the project gains a durable engineering memory that supports onboarding, maintenance, and future scaling without relying on tribal knowledge.

