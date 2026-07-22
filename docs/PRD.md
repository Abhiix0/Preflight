# Preflight

## Product Requirements Document (PRD)

**Version:** 0.1
**Status:** Draft
**Owner:** Product & Engineering
**Last Updated:** July 2026

---

# 1. Overview

## Product Name

**Preflight**

## Product Category

Engineering Readiness Platform

## Summary

Preflight analyzes GitHub repositories and determines whether a software project is ready for production deployment.

The platform performs repository analysis, security audits, code quality checks, documentation validation, and production readiness verification. It aggregates findings into a unified **Preflight Score™**, explains every issue, prioritizes fixes, and guides developers toward production readiness.

Preflight does **not** replace deployment platforms or static analysis tools. Instead, it orchestrates them into a single educational workflow focused on helping developers understand and improve their projects before shipping.

---

# 2. Product Goals

The MVP must enable a developer to:

* Connect a GitHub repository.
* Analyze the repository automatically.
* Detect production and security issues.
* Explain findings in an understandable way.
* Prioritize issues by impact.
* Generate a Production Readiness Report.
* Calculate a **Preflight Score™**.
* Re-analyze after fixes.

---

# 2.1 MVP Scope

The MVP delivers exactly five product capabilities:

| Capability | Description |
| ---------- | ----------- |
| Repository ingestion | Connect, clone, and profile a GitHub repository |
| Static analysis | Detect code quality, documentation, testing, and configuration issues |
| Security analysis | Detect secrets, credential leaks, and dependency vulnerabilities |
| Engineering Readiness Score | Calculate the deterministic **Preflight Score™** |
| Recommendations | Convert findings into prioritized, educational guidance |

Supporting platform capabilities required to deliver the above (authentication, dashboard, reports, and job progress) are included as infrastructure, not as separate product pillars.

---

# 3. Non Goals

The MVP will NOT include:

* One-click deployment
* Architecture review (deferred to V2)
* API review (deferred to V2)
* Advanced deployment validation (deferred to V2)
* AI code generation
* Team collaboration
* Git hosting
* Cloud IDE
* Kubernetes support
* Continuous repository monitoring
* Organization workspaces
* Plugin marketplace

---

# 4. Primary User Story

> As a student developer,

> I want to connect my GitHub repository,

> so that I can understand whether my project is production-ready, learn how to improve it, and confidently deploy it after resolving the identified issues.

---

# 5. Product Modules

The MVP consists of seven engineering modules.

---

# Module 1

# Authentication Service

---

## Purpose

Securely authenticate users and connect GitHub repositories.

---

## Features

* User Registration
* Login
* JWT Authentication
* Refresh Tokens
* GitHub OAuth
* Repository Permissions

---

## Functional Requirements

The system shall:

* Allow users to authenticate using GitHub OAuth.
* Store user profile information.
* Store GitHub access tokens securely.
* Allow repository selection.
* Maintain authenticated sessions.

---

## Acceptance Criteria

✅ User can sign in with GitHub.

✅ User can view accessible repositories.

✅ User session persists after refresh.

---

## Out of Scope

* Teams
* Organizations
* Multiple providers

---

# Module 2

# Repository Service

---

## Purpose

Import and understand a GitHub repository.

---

## Features

* Clone Repository
* Branch Selection
* Commit Metadata
* File Discovery
* Ignore Patterns
* Framework Detection

---

## Functional Requirements

The system shall:

* Clone repositories into isolated workspaces.
* Detect programming language(s).
* Detect frameworks.
* Detect package managers.
* Detect dependency manifests.
* Detect Docker configuration.
* Detect CI configuration.

---

## Outputs

Repository Metadata

Example:

```
Framework

FastAPI

Language

Python

Package Manager

uv

Database

PostgreSQL

Container

Docker

CI

GitHub Actions
```

---

## Acceptance Criteria

Repository imports successfully.

Framework detected correctly.

Project structure generated.

---

# Module 3

# Analysis Engine

---

## Purpose

Run engineering analysis against the repository.

---

## Responsibilities

* Parse repository
* Execute scanners
* Aggregate findings
* Normalize results

---

## Functional Requirements

The engine shall:

* Execute repository scanners.
* Collect outputs.
* Remove duplicate findings.
* Categorize findings.
* Assign severity.

---

## Categories

* Security
* Maintainability
* Documentation
* Testing
* Production
* Performance

---

## Severity Levels

Critical

High

Medium

Low

Info

---

## Acceptance Criteria

Analysis completes successfully.

All findings categorized.

No duplicate issues displayed.

---

# Module 4

# Security Engine

---

## Purpose

Identify security risks before deployment.

---

## Functional Requirements

Detect:

* Exposed secrets
* Hardcoded credentials
* Dependency vulnerabilities
* Missing environment variables
* Dangerous configurations

---

## Output Example

```
Critical

AWS Secret Key detected

Location

.env.example

Recommendation

Move to environment variables immediately.
```

---

## Acceptance Criteria

Critical issues always appear first.

Recommendations generated.

False positives minimized.

---

# Module 5

# Engineering Scoring Engine

---

## Purpose

Generate the **Preflight Score™**.

---

## Score Categories (MVP)

Security

Documentation

Testing

Deployment Readiness

Maintainability

Configuration

### Deferred to V2

Architecture

API Quality

Advanced Deployment Validation

---

## Output

```
Preflight Score™

84 / 100

Security

92

Testing

61

Documentation

95

Deployment

80
```

---

## Functional Requirements

Score must:

* Be deterministic.
* Explain deductions.
* Update after every analysis.
* Never hide critical failures behind a high overall score.

---

## Acceptance Criteria

Scores remain consistent across identical analyses.

Category scores sum into overall score.

---

# Module 6

# Recommendation Engine

---

## Purpose

Convert technical findings into actionable guidance.

---

## Functional Requirements

Each recommendation must include:

* Issue summary
* Severity
* Why it matters
* How to fix it
* Estimated effort
* Related documentation

---

## Prioritization Rules

Critical

↓

High

↓

Medium

↓

Low

---

## Example

```
Issue

Missing Health Endpoint

Impact

High

Reason

Health endpoints allow deployment platforms
to verify application availability.

Recommendation

Implement GET /health

Estimated Time

5 minutes
```

---

## Acceptance Criteria

Every issue has an explanation.

Every issue has a recommendation.

---

# Module 7

# Dashboard

---

## Purpose

Provide a centralized interface for repository health.

---

## Features

Projects

Analysis History

Repository Details

Preflight Score™

Issues

Recommendations

Re-analyze Button

---

## Dashboard Overview

```
Projects

5

Average Score

81

Repositories Ready

2

Repositories Improving

3
```

---

## Acceptance Criteria

Dashboard loads user projects.

Latest analysis displayed.

Historical reports accessible.

---

# 6. User Flow

```
User Login

↓

Connect GitHub

↓

Select Repository

↓

Repository Import

↓

Analysis

↓

Preflight Score™

↓

Issue Report

↓

Recommendations

↓

Developer Fixes Issues

↓

Re-analyze

↓

Project Passes Preflight
```

---

# 6.1 Failure User Flows

The MVP must handle the following failure scenarios with clear user messaging and recoverable system state.

---

## Repository Access Revoked

```
User starts analysis

↓

GitHub returns 401/403

↓

Mark job FAILED

↓

Notify user: reconnect GitHub or re-authorize repository access

↓

Preserve prior successful analyses
```

---

## Analysis Timeout

```
Analysis exceeds configured time budget

↓

Cancel remaining tasks

↓

Mark job FAILED (timeout)

↓

Persist partial findings when available

↓

Notify user with retry option
```

---

## Repository Exceeds Size Limit

```
Repository size checked during ingestion

↓

Size exceeds platform limit

↓

Reject analysis before queueing

↓

Notify user of limit and suggested remediation
```

---

## Monorepo Detection

```
Ingestion detects multiple package roots / workspaces

↓

Surface monorepo warning

↓

Analyze default root when identifiable

↓

Ask user to select a target subdirectory (MVP: default root only; selection in V2)

↓

Continue analysis with documented scope
```

---

## Repository Deleted

```
User or GitHub deletes repository mid-analysis

↓

Clone or subsequent GitHub API calls fail

↓

Mark job FAILED

↓

Clean up temporary workspace

↓

Retain historical analyses already completed
```

---

## Analysis Cancelled

```
User cancels running analysis

↓

Orchestrator stops queued and in-flight tasks

↓

Mark job CANCELLED

↓

Destroy sandbox containers and temp files

↓

Do not publish incomplete scores as final
```

---

## Docker Build Failure

```
Sandbox image build fails

↓

Record Docker finding (CRITICAL/HIGH as appropriate)

↓

Continue remaining non-Docker analyzers

↓

Complete analysis with partial results

↓

Lower Deployment Readiness score accordingly
```

---

## Re-analysis of the Same Commit

```
User requests analysis for a commit already analyzed

↓

Detect matching commit_sha + analysis_version + ruleset_version

↓

Return existing completed job (idempotent)

↓

Or create a new job only when analyzer/ruleset versions changed
```

---

# 7. Success Metrics

Engineering Metrics

* Average analysis duration
* Repository import success rate
* Analysis completion rate

Product Metrics

* Projects analyzed
* Projects passing Preflight
* Repeat analyses per repository
* Average score improvement

Learning Metrics

* Issues resolved
* Recommendation adoption
* Time between analyses

---

# 8. Risks

Technical Risks

* Large repositories
* Unsupported frameworks
* Scanner compatibility
* GitHub API limits

Product Risks

* Information overload
* False positives
* Slow analysis
* Unclear recommendations

---

# 9. Open Questions

These items are intentionally deferred until later design phases:

* How should the Preflight Score™ weighting algorithm work?
* Which static analysis tools should be enabled by default?
* How should unsupported frameworks be handled?
* What is the maximum repository size for analysis?
* Should analyses be synchronous or background jobs?
* What historical data should be retained for each repository?

---

# 10. Definition of Done (MVP)

The MVP is considered complete when a user can:

* Authenticate with GitHub.
* Connect a repository.
* Run a complete engineering analysis.
* Receive categorized findings.
* View a Preflight Score™.
* Understand every issue through actionable recommendations.
* Fix issues and re-run the analysis.
* Achieve a passing Preflight status based on defined readiness criteria.
