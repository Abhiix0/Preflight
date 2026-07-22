# Preflight

# Roadmap & Sprint Plan (RSP)

**Version:** 1.0
**Status:** Approved
**Owner:** Product & Engineering
**Timeline:** MVP (16 Weeks)
**Methodology:** Agile Scrum (2-Week Sprints)
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the execution roadmap for building **Preflight**.

It translates the product vision and architecture into an actionable engineering plan with milestones, sprint goals, deliverables, and release criteria.

The roadmap is designed to:

* Build iteratively
* Deliver value early
* Minimize technical debt
* Validate assumptions quickly
* Maintain production-quality standards

---

# 2. Development Philosophy

Preflight follows four guiding principles:

### Build the Core First

Every feature must strengthen the core mission: **Analyze → Educate → Fix → Deploy**.

---

### Ship Small, Ship Often

Each sprint should produce a working increment.

---

### Quality Over Quantity

A smaller, polished MVP is preferred over a larger, unfinished product.

---

### Build for Extensibility

Every major feature should support future expansion without significant refactoring.

---

# 3. Development Timeline

| Phase       | Duration | Goal                                 |
| ----------- | -------- | ------------------------------------ |
| Sprint 0    | 1 Week   | Project Foundation                   |
| Sprint 1    | 2 Weeks  | Authentication & Core Infrastructure |
| Sprint 2    | 2 Weeks  | Repository Integration               |
| Sprint 3    | 2 Weeks  | Analysis Engine                      |
| Sprint 4    | 2 Weeks  | Findings & Scoring                   |
| Sprint 5    | 2 Weeks  | Reports & Dashboard                  |
| Sprint 6    | 2 Weeks  | One-Click Deployment (V2 Foundation) |
| Sprint 7    | 2 Weeks  | Testing, Security & Polish           |
| Launch Week | 1 Week   | MVP Release                          |

Total: **16 Weeks**

---

# 4. Milestone Roadmap

```text
Planning
      │
      ▼
Foundation
      │
      ▼
Authentication
      │
      ▼
Repository Integration
      │
      ▼
Analysis Engine
      │
      ▼
Findings & Reports
      │
      ▼
Deployment Engine
      │
      ▼
Testing & Security
      │
      ▼
MVP Launch
```

---

# Sprint 0

## Foundation

### Goal

Prepare the development environment and project structure.

### Deliverables

* GitHub repository
* Backend scaffold
* Frontend scaffold
* Docker Compose
* PostgreSQL
* Redis
* MinIO
* GitHub Actions
* Ruff
* MyPy
* ESLint
* Prettier
* Initial documentation

### Definition of Done

* Project runs locally with one command.
* CI passes.
* Repository structure finalized.

---

# Sprint 1

## Authentication & Core Infrastructure

### Goal

Allow users to securely access Preflight.

### Deliverables

* GitHub OAuth
* JWT authentication
* User database
* Protected routes
* Session management
* Landing page
* Dashboard shell
* Navigation
* Theme support

### Definition of Done

Users can log in and access their dashboard securely.

---

# Sprint 2

## Repository Integration

### Goal

Connect GitHub repositories.

### Deliverables

* GitHub repository listing
* Connect repository
* Repository metadata
* Framework detection
* Repository history
* Database persistence

### Definition of Done

Users can connect and manage repositories from GitHub.

---

# Sprint 3

## Analysis Engine

### Goal

Build the core analysis pipeline.

### Deliverables

* Job creation
* Celery workers
* Docker sandbox
* Plugin system
* Analyzer orchestrator
* Progress tracking (SSE)
* Initial analyzers:

  * Secret Analyzer
  * README Analyzer
  * Dependency Analyzer
  * TODO Analyzer
  * Docker Analyzer

### Definition of Done

A repository can be analyzed from start to finish.

---

# Sprint 4

## Findings & Scoring

### Goal

Transform raw analysis into actionable insights.

### Deliverables

* Findings engine
* Severity classification
* Categories
* Preflight Score™
* Educational recommendations
* Search & filtering
* Findings UI

### Definition of Done

Users understand what is wrong and how to fix it.

---

# Sprint 5

## Reports & Dashboard

### Goal

Present analysis results clearly.

### Deliverables

* Dashboard overview
* Repository history
* Report generation
* Report viewer
* Historical analyses
* Exportable JSON
* Downloadable reports

### Definition of Done

Users receive a complete engineering readiness report.

---

# Sprint 6

## One-Click Deployment (V2 Foundation)

### Goal

Introduce deployment capabilities after repositories pass analysis.

### Deliverables

* Deployment readiness checks
* Deployment configuration validation
* Deployment provider abstraction
* Initial deployment integration
* Deployment history
* Success/failure feedback

### Definition of Done

Users can deploy a passing repository through a unified deployment workflow.

---

# Sprint 7

## Testing, Security & Polish

### Goal

Prepare the platform for public release.

### Deliverables

* Performance optimization
* Accessibility improvements
* Security audit
* Dependency audit
* End-to-end testing
* UI polish
* Documentation review
* Bug fixes
* Release candidate

### Definition of Done

Application meets MVP quality standards.

---

# Launch Week

## MVP Release

### Deliverables

* Version 1.0.0
* Production deployment
* Documentation published
* Demo video
* Landing page
* Public announcement

### Success Criteria

Users can:

* Sign in
* Connect a repository
* Run an analysis
* Understand findings
* Fix issues
* Re-run analysis
* Deploy successfully

---

# 5. Product Epics

| Epic                    | Description                 |
| ----------------------- | --------------------------- |
| Authentication          | Secure user identity        |
| Repository Management   | GitHub integration          |
| Analysis Engine         | Core scanning pipeline      |
| Findings Engine         | Issue detection             |
| Scoring Engine          | Engineering readiness score |
| Report Engine           | Comprehensive reports       |
| Deployment Engine       | One-click deployment        |
| Platform Infrastructure | CI/CD, monitoring, DevOps   |

---

# 6. MVP Scope

### Included

* GitHub OAuth
* Repository connection
* Automated analysis
* Security scanning
* README checks
* Dependency analysis
* TODO detection
* Docker validation
* Preflight Score™
* Reports
* Dashboard
* One-click deployment
* Docker sandbox
* History

---

### Excluded

* AI code generation
* AI debugging
* Cloud IDE
* Git hosting
* Team collaboration
* Kubernetes
* Portfolio generation
* Resume generation
* Recruiter mode
* Chat assistant

---

# 7. Version Roadmap

## Version 1.0

Core engineering readiness platform.

---

## Version 1.5

* More analyzers
* Improved reports
* Additional deployment providers
* Better dashboard insights

---

## Version 2.0

* AI explanation assistant
* Team workspaces
* Organization support
* Advanced deployment workflows
* Deployment rollback
* Plugin marketplace

---

## Version 3.0

* Enterprise features
* Policy enforcement
* Custom analyzers
* Multi-cloud deployments
* Organization analytics

---

# 8. GitHub Project Structure

```text
Backlog
      │
      ▼
Ready
      │
      ▼
In Progress
      │
      ▼
Code Review
      │
      ▼
Testing
      │
      ▼
Done
```

Each issue belongs to:

* Epic
* Sprint
* Priority
* Assignee
* Milestone

---

# 9. Definition of Ready (DoR)

A task is ready when:

* Requirements are clear
* Acceptance criteria exist
* Dependencies identified
* Technical approach agreed
* Estimated effort assigned

---

# 10. Definition of Done (DoD)

A feature is complete only when:

* Code implemented
* Unit tests pass
* Integration tests pass
* CI passes
* Documentation updated
* Code reviewed
* No critical security issues
* Performance acceptable
* Deployed to staging

---

# 11. Quality Gates

Every merge must pass:

* Ruff
* MyPy
* ESLint
* Prettier
* Pytest
* Playwright
* Secret scanning
* Dependency scanning
* Docker build verification

No exceptions.

---

# 12. Engineering Metrics

Track:

* Sprint velocity
* Lead time
* Deployment frequency
* CI success rate
* Mean time to resolve bugs
* Test coverage
* Build time
* Analysis success rate

---

# 13. Risk Register

| Risk                     | Impact | Mitigation                             |
| ------------------------ | ------ | -------------------------------------- |
| GitHub API changes       | High   | Versioned API integration              |
| Docker compatibility     | Medium | Standardized container images          |
| Long analysis times      | High   | Background workers & progress updates  |
| Security vulnerabilities | High   | Automated audits & dependency scanning |
| Scope creep              | High   | Strict MVP boundaries                  |

---

# 14. Release Strategy

Releases follow Semantic Versioning.

```text
Development

↓

Staging

↓

Release Candidate

↓

Production

↓

Patch Releases
```

Production releases require:

* All quality gates passing
* Manual approval
* Smoke tests
* Rollback plan

---

# 15. Success Metrics

The MVP is considered successful when users can:

* Connect a GitHub repository in under 2 minutes.
* Receive a complete engineering readiness report in under 5 minutes.
* Understand every reported issue through actionable guidance.
* Re-run analysis after fixes.
* Deploy successfully from within Preflight.
* Trust the platform to catch common engineering mistakes before deployment.

---

# 16. Post-MVP Priorities

Immediately after launch:

1. Gather user feedback.
2. Expand analyzer coverage.
3. Improve deployment provider support.
4. Optimize performance.
5. Strengthen observability.
6. Begin AI-assisted explanations (V2).

---

# 17. Product Vision Alignment

Every sprint should reinforce the core mission:

> **Help developers confidently ship production-ready software by identifying problems before deployment, explaining why they matter, and guiding users toward high-quality engineering practices.**

Any feature that does not contribute to this mission should be deferred or rejected.

---

# 18. Roadmap Summary

The Preflight roadmap is structured to deliver value incrementally while preserving long-term architectural integrity. By progressing from authentication and repository integration to analysis, reporting, and deployment, each sprint builds directly upon the previous one. Strong quality gates, clear definitions of readiness and completion, and disciplined scope management ensure that the MVP remains focused, maintainable, and production-ready.
