# Preflight

# Security Architecture Document (SAD)

**Version:** 1.0
**Status:** Approved
**Owner:** Security Engineering
**Security Model:** Zero Trust
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the security architecture of **Preflight**.

It specifies how the platform protects:

* User accounts
* GitHub repositories
* OAuth credentials
* Analysis environments
* Infrastructure
* APIs
* Reports
* Sensitive data

The objective is to make Preflight secure **by design**, not secure as an afterthought.

---

# 2. Security Philosophy

Preflight follows five core principles.

### Zero Trust

Every request is authenticated and authorized.

Nothing is trusted automatically.

---

### Least Privilege

Every service receives only the permissions it absolutely requires.

---

### Defense in Depth

Multiple security layers protect every critical operation.

If one layer fails, another still protects the system.

---

### Ephemeral Everything

Temporary data should disappear automatically.

Repositories.

Containers.

Secrets.

Logs.

---

### Secure by Default

Unsafe behavior should require explicit developer action.

---

# 3. Security Layers

```text
                    Internet
                        │
                        ▼
               HTTPS / TLS 1.3
                        │
                        ▼
                  API Gateway
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
 Authentication   Authorization   Rate Limiter
        │
        ▼
 Request Validation
        │
        ▼
 Business Logic
        │
        ▼
 Docker Sandbox
        │
        ▼
 Database
```

---

# 4. Authentication

Authentication uses GitHub OAuth.

Flow

```text
User

↓

GitHub OAuth

↓

Authorization Code

↓

FastAPI Backend

↓

JWT Generation

↓

Authenticated Session
```

Authentication methods:

* GitHub OAuth
* JWT Access Token
* Refresh Token

Future:

* Google Login
* SSO
* Enterprise SAML

---

# 5. Authorization

Role-Based Access Control (RBAC)

Initial Roles

```text
Guest

↓

User

↓

Admin
```

Permissions are checked on every protected endpoint.

Users can only access:

* Their repositories
* Their reports
* Their analysis history

---

# 6. Session Management

JWT Lifetime

```text
Access Token

15 minutes
```

Refresh Token

```text
7 days
```

Sessions are invalidated:

* Logout
* Password change (future)
* Token compromise
* Refresh expiration

---

# 7. API Security

Every API request is protected by:

* HTTPS
* JWT Validation
* Authorization
* Request Validation
* Rate Limiting
* Audit Logging

Protected endpoints reject:

* Invalid tokens
* Expired tokens
* Missing authentication
* Unauthorized access

---

# 8. Input Validation

All incoming data is validated.

Validation layers

```text
HTTP Request

↓

Pydantic Schema

↓

Business Rules

↓

Database Constraints
```

No raw request reaches business logic.

---

# 9. Repository Security

Repositories are never trusted.

Workflow

```text
Clone Repository

↓

Temporary Storage

↓

Docker Sandbox

↓

Analysis

↓

Delete Repository
```

Repositories never execute directly on the host machine.

---

# 10. Docker Sandbox

Every analysis executes inside an isolated container.

Container Rules

* Rootless containers where supported by the host
* Non-root execution inside the container
* Read-only filesystem (writable temp mounts only where required)
* Disabled networking by default
* CPU limits
* Memory limits
* PID limits
* Seccomp profile
* AppArmor or SELinux confinement when available
* Temporary volumes
* Automatic deletion

### Outbound Network Restrictions

* Analysis containers have networking disabled by default.
* No arbitrary egress to the public internet during analysis.
* If a specific analyzer requires limited egress (future), allowlists are explicit, minimal, and audited.
* Host metadata endpoints and internal service networks are unreachable from sandboxes.

### Blast-Radius Assumptions

If container isolation fails, the architecture assumes:

* Compromise is limited to the analysis host / worker node, not the primary database or secrets store by default network policy.
* OAuth tokens and production secrets are never mounted into analysis containers.
* Repository workspaces are ephemeral and job-scoped.
* A compromised sandbox must not gain write access to other jobs' workspaces.
* Worker hosts are replaceable; rebuild and rotate credentials if isolation failure is suspected.

Container Lifecycle

```text
Create

↓

Build

↓

Run

↓

Analyze

↓

Destroy
```

Containers are never reused.

---

# 11. Secret Handling

### OAuth Token Storage

GitHub OAuth tokens are encrypted at rest before persistence.

Encryption

* Algorithm: AES-256-GCM (or equivalent authenticated encryption)
* Ciphertext stored in `oauth_accounts.access_token` / `refresh_token`
* Tokens decrypted only in memory for GitHub API calls

Key Management

* Encryption keys live in the production secrets manager, not in application source or `.env` committed files
* Development may use a local key via environment configuration
* Application processes receive keys at runtime through the secrets manager or sealed environment injection

Rotation Strategy

* Support key version identifiers alongside ciphertext
* Rotate encryption keys on a defined schedule and on suspected compromise
* Re-encrypt stored tokens with the new key during controlled rotation jobs
* Invalidate and force re-authorization if decryption fails after rotation incidents

Lifecycle

```text
GitHub Tokens

↓

Encrypted Storage

↓

Temporary Memory

↓

Automatic Cleanup
```

Never logged.

Never exposed to clients.

Never written to reports.

Never mounted into analysis containers.

---

# 12. Secret Detection

Preflight automatically scans for:

* AWS Keys
* GitHub Tokens
* OpenAI Keys
* Supabase Keys
* MongoDB URIs
* PostgreSQL URLs
* Stripe Keys
* Firebase Credentials
* Environment Variables
* SSH Keys

Detected secrets are:

* Flagged
* Reported
* Never stored in plaintext

---

# 13. File System Security

Temporary directories:

```text
/tmp/preflight/jobs/{job_id}
```

Deleted immediately after analysis.

Repository archives are never permanently stored.

---

# 14. Network Security

Production requirements

* HTTPS only
* TLS 1.3
* HSTS
* Secure Cookies
* CSP Headers
* X-Frame-Options
* X-Content-Type-Options
* Referrer Policy

No HTTP traffic allowed.

---

# 15. Database Security

Database protections

* Parameterized queries
* SQLAlchemy ORM
* Prepared statements
* Least-privilege database user
* Connection encryption
* Regular backups

Application never constructs SQL manually.

---

# 16. Encryption

Data in Transit

TLS 1.3

Data at Rest

AES-256

Encrypted:

* OAuth Tokens
* Refresh Tokens
* Secrets
* Object Storage

Passwords are never stored because authentication uses OAuth.

Production encryption keys and application secrets are sourced from a **secrets manager**, not from long-lived plaintext environment variables alone. See Secret Handling (§11) and DevOps Secrets Management for key management and rotation.

---

# 17. Rate Limiting

Authentication

```text
10 requests/minute
```

Repository Analysis

```text
10 analyses/hour
```

General API

```text
120 requests/minute
```

Limits prevent abuse and resource exhaustion.

---

# 18. Logging & Audit

Every sensitive action generates an audit event.

Examples

* Login
* Logout
* Repository Connected
* Analysis Started
* Analysis Completed
* Report Downloaded
* Repository Deleted

Each log contains:

* User ID
* Timestamp
* IP Address
* Request ID
* Action
* Result

Sensitive values are masked before logging.

---

# 19. Security Monitoring

Monitor

* Failed logins
* Repeated API failures
* Excessive rate limiting
* Docker failures
* Scanner failures
* Suspicious traffic
* Unexpected exceptions

Future

Security dashboard.

---

# 20. Threat Model

Potential Threats

| Threat            | Mitigation                                  |
| ----------------- | ------------------------------------------- |
| SQL Injection     | SQLAlchemy ORM + validation                 |
| XSS               | Output escaping + CSP                       |
| CSRF              | SameSite cookies + CSRF tokens where needed |
| SSRF              | Network restrictions in containers          |
| Command Injection | No shell execution with user input          |
| Secret Leakage    | Secret scanning + encrypted storage         |
| Path Traversal    | Canonical path validation                   |
| DoS               | Rate limiting + worker queues               |
| Token Theft       | Short-lived JWTs + refresh rotation         |

---

# 21. Secure Development Practices

Every Pull Request must pass:

* Ruff
* MyPy
* Pytest
* Secret Scanning
* Dependency Scanning
* Code Review

No direct commits to the main branch.

---

# 22. Dependency Security

Every build runs:

* `pip-audit`
* `npm audit`
* Dependency version checks
* License validation (future)

Critical vulnerabilities block deployment.

### Supply-Chain Security

* Generate an SBOM (Software Bill of Materials) for application images and releases (CycloneDX or SPDX).
* Record dependency provenance for locked packages (`uv.lock`, `pnpm-lock.yaml`) and verify integrity in CI.
* Prefer pinned, hashed dependencies where tooling supports them.
* Block builds on critical advisory findings before promotion to production.
* Store SBOMs as release artifacts for future audit and incident response.

---

# 23. Secure Headers

Every response includes:

```text
Content-Security-Policy

Strict-Transport-Security

X-Frame-Options

X-Content-Type-Options

Permissions-Policy

Referrer-Policy
```

---

# 24. Incident Response

If a security event occurs:

```text
Detect

↓

Log

↓

Alert

↓

Isolate

↓

Investigate

↓

Mitigate

↓

Recover

↓

Review
```

Future

Automated alerting.

---

# 25. Backup & Recovery

Daily database backups.

Encrypted storage.

Recovery objectives

| Metric | Target   |
| ------ | -------- |
| RPO    | 24 hours |
| RTO    | 1 hour   |

---

# 26. Compliance Goals

Although not initially certified, the architecture aligns with:

* OWASP Top 10
* OWASP ASVS
* OAuth 2.1 Best Practices
* Principle of Least Privilege

Future:

* SOC 2
* ISO 27001

---

# 27. Secure Repository Lifecycle

```text
Connect Repository

↓

Authenticate

↓

Clone

↓

Isolated Docker

↓

Run Analysis

↓

Generate Report

↓

Delete Repository

↓

Store Findings Only
```

Only analysis results persist.

---

# 28. Security Principles

The security architecture follows:

* Zero Trust
* Least Privilege
* Defense in Depth
* Fail Secure
* Secure Defaults
* Principle of Minimal Exposure
* Immutable Audit Trails
* Ephemeral Execution

---

# 29. Future Security Enhancements

Planned improvements:

* Multi-Factor Authentication (MFA)
* Passkeys (WebAuthn)
* Hardware Security Keys
* Secret Rotation
* Organization RBAC
* IP Allow Lists
* Single Sign-On (SSO)
* Security Center Dashboard
* Security Score History
* Signed Reports

---

# 30. Architectural Summary

Preflight's security architecture is built around **isolation, validation, and least privilege**. Every repository is treated as untrusted code and analyzed inside disposable Docker containers. Authentication is handled through GitHub OAuth, authorization through role-based access control, and all communication is encrypted. Combined with layered validation, audit logging, and automated secret detection, this architecture provides a strong security foundation while remaining practical for an MVP.
