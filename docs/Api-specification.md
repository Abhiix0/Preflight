# Preflight

# API Specification Document

**Version:** 1.0
**Status:** Approved
**Protocol:** REST API
**Architecture Style:** Resource-Oriented REST
**Format:** JSON
**Authentication:** JWT Bearer + GitHub OAuth

---

# 1. API Philosophy

The Preflight API is designed around the following principles:

* RESTful resource-oriented design
* Predictable endpoints
* Consistent request/response formats
* Stateless authentication
* Idempotent operations where applicable
* Explicit error reporting
* Versioned APIs
* OpenAPI 3.1 compliant

---

# 2. Base URL

```http
Production
https://api.preflight.dev/v1

Development
http://localhost:8000/api/v1
```

---

# 3. Authentication

Authentication uses **GitHub OAuth** followed by **JWT access tokens**.

```
Client
↓

GitHub OAuth

↓

Backend

↓

JWT Access Token

↓

API Requests
```

Authorization Header

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 4. API Versioning

```
/api/v1/...
```

Future versions:

```
/api/v2
/api/v3
```

No breaking changes inside a version.

---

# 5. Standard Response Format

## Success

```json
{
  "success": true,
  "message": "Repository analyzed successfully.",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "error": {
    "code": "REPOSITORY_NOT_FOUND",
    "message": "Repository could not be located."
  }
}
```

---

# 6. Authentication Endpoints

## Login with GitHub

```
GET /auth/github
```

Redirects user to GitHub OAuth.

---

## OAuth Callback

```
GET /auth/github/callback
```

Returns JWT token.

---

## Current User

```
GET /users/me
```

Returns

```json
{
  "id": "...",
  "username": "abhi",
  "email": "...",
  "avatar_url": "..."
}
```

---

## Logout

```
POST /auth/logout
```

Invalidates current session.

---

# 7. Repository Endpoints

## List Repositories

```
GET /repositories
```

Response

```json
[
  {
    "id": "...",
    "name": "Preflight",
    "framework": "FastAPI",
    "language": "Python"
  }
]
```

---

## Connect Repository

```
POST /repositories
```

Request

```json
{
  "github_repo_id": 123456789
}
```

---

## Repository Details

```
GET /repositories/{repositoryId}
```

---

## Delete Repository

```
DELETE /repositories/{repositoryId}
```

---

# 8. Analysis Endpoints

## Start Analysis

```
POST /repositories/{repositoryId}/analysis
```

Response

```json
{
  "job_id": "...",
  "status": "QUEUED"
}
```

Returns **202 Accepted**.

---

## Analysis Status

```
GET /analysis/{jobId}
```

Response

```json
{
  "status": "RUNNING",
  "progress": 68,
  "current_step": "Docker Validation"
}
```

---

## Cancel Analysis

```
DELETE /analysis/{jobId}
```

---

## Analysis History

```
GET /repositories/{repositoryId}/analysis
```

---

# 9. Findings Endpoints

## List Findings

```
GET /analysis/{jobId}/findings
```

Filters

```
?severity=HIGH

?category=SECURITY

?page=1

?limit=20
```

---

## Finding Details

```
GET /findings/{findingId}
```

Response

```json
{
  "severity": "HIGH",
  "title": "Hardcoded Secret",
  "description": "...",
  "recommendation": "...",
  "estimated_minutes": 5
}
```

---

# 10. Recommendations

## Repository Recommendations

```
GET /analysis/{jobId}/recommendations
```

---

## Recommendation Details

```
GET /recommendations/{recommendationId}
```

---

# 11. Reports

## Engineering Report

```
GET /analysis/{jobId}/report
```

---

## Download Report (Future)

```
GET /analysis/{jobId}/report/pdf
```

---

## Historical Reports

```
GET /repositories/{repositoryId}/reports
```

---

# 12. Scores

## Latest Score

```
GET /analysis/{jobId}/score
```

Response

```json
{
  "overall": 86,
  "security": 95,
  "testing": 70,
  "documentation": 90,
  "deployment": 88
}
```

---

## Score History

```
GET /repositories/{repositoryId}/scores
```

---

# 13. Dashboard

## Dashboard Summary

```
GET /dashboard
```

Returns

```json
{
  "repositories": 5,
  "analyses": 24,
  "average_score": 82,
  "ready_projects": 3
}
```

---

# 14. Health

## API Health

```
GET /health
```

---

## Readiness

```
GET /ready
```

---

# 15. Pagination

All list endpoints support:

```
?page=1

?limit=20
```

Response

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "pages": 8
  }
}
```

---

# 16. Filtering

Supported filters

```
severity

category

framework

status

language

date

repository
```

Example

```
GET /findings?severity=CRITICAL&category=SECURITY
```

---

# 17. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 202  | Analysis Accepted     |
| 204  | Deleted Successfully  |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Resource Not Found    |
| 409  | Conflict              |
| 422  | Validation Error      |
| 429  | Rate Limited          |
| 500  | Internal Server Error |

---

# 18. Error Codes

Examples

```
INVALID_TOKEN

UNAUTHORIZED

REPOSITORY_NOT_FOUND

ANALYSIS_RUNNING

ANALYSIS_FAILED

INVALID_REQUEST

RATE_LIMITED

SERVER_ERROR
```

---

# 19. Rate Limiting

Authenticated users

```
120 requests/minute
```

Analysis creation

```
10 analyses/hour
```

Future premium plans may adjust limits.

---

# 20. Security

* HTTPS only
* JWT authentication
* OAuth 2.0
* Input validation using Pydantic
* SQL injection protection through ORM
* CSRF protection (where applicable)
* Rate limiting
* Request logging

---

# 21. Idempotency

The following endpoints are idempotent:

* `GET`
* `DELETE`

`POST /repositories/{id}/analysis`

If an analysis is already running, the API returns:

```http
409 CONFLICT
```

```json
{
  "error": "Analysis already running."
}
```

---

# 22. API Naming Standards

Resources use plural nouns.

Examples:

```
/repositories
/findings
/reports
/recommendations
```

Actions are expressed through HTTP verbs, not endpoint names.

Good:

```
POST /repositories/{id}/analysis
```

Avoid:

```
POST /startAnalysis
```

---

# 23. OpenAPI & Documentation

The backend will automatically expose:

```
/docs
```

Swagger UI

and

```
/openapi.json
```

OpenAPI specification generated from FastAPI.

---

# 24. Future API Extensions

Reserved for future versions:

* Deployment API
* Team API
* Organization API
* Notifications API
* Plugin API
* Webhooks
* GraphQL Gateway (optional)

---

# 25. Endpoint Summary

| Domain          | Endpoints |
| --------------- | --------- |
| Authentication  | 4         |
| Users           | 1         |
| Repositories    | 4         |
| Analysis        | 4         |
| Findings        | 2         |
| Recommendations | 2         |
| Reports         | 3         |
| Scores          | 2         |
| Dashboard       | 1         |
| Health          | 2         |

**Total MVP Endpoints:** **25**
