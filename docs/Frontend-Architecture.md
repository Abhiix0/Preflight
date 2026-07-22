# Preflight

# Frontend Architecture Document (FAD)

**Version:** 1.0
**Status:** Approved
**Owner:** Frontend Engineering Team
**Framework:** Next.js 15 (App Router)
**Language:** TypeScript
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the frontend architecture of **Preflight**.

It specifies:

* Application structure
* Routing
* Component hierarchy
* State management
* UI architecture
* Design system
* Performance strategy
* Frontend engineering standards

The goal is to create a frontend that is:

* Fast
* Accessible
* Maintainable
* Modular
* Scalable
* Developer-friendly

---

# 2. Frontend Philosophy

The frontend follows five principles.

### Server First

Use React Server Components whenever possible.

Only make components client-side when interactivity is required.

---

### Component Driven

Everything is a reusable component.

Pages assemble components.

Components never assemble pages.

---

### Feature-Based Organization

Files are grouped by business domains rather than file types.

---

### Consistent UX

Every page follows the same layout rules, spacing, typography, colors, loading states, and interaction patterns.

---

### Type Safety

Every API response, component prop, and state object is fully typed using TypeScript.

---

# 3. Technology Stack

| Layer         | Technology      |
| ------------- | --------------- |
| Framework     | Next.js 15      |
| Language      | TypeScript      |
| UI Library    | React 19        |
| Styling       | Tailwind CSS    |
| Components    | shadcn/ui       |
| Icons         | Lucide React    |
| Animations    | Motion          |
| Forms         | React Hook Form |
| Validation    | Zod             |
| State         | Zustand         |
| Server State  | TanStack Query  |
| Charts        | Recharts        |
| Tables        | TanStack Table  |
| Theme         | next-themes     |
| Notifications | Sonner          |

---

# 4. Folder Structure

```text
frontend/

src/

├── app/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── analysis/
│   ├── reports/
│   ├── findings/
│   ├── repository/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── repositories/
│   ├── analysis/
│   ├── reports/
│   └── dashboard/
│
├── hooks/
│
├── lib/
│
├── services/
│
├── store/
│
├── types/
│
├── utils/
│
├── styles/
│
└── middleware.ts
```

---

# 5. Application Routing

```text
/

├── login

├── dashboard

├── repositories

│      └── [repositoryId]

│               ├── overview

│               ├── analysis

│               ├── findings

│               ├── reports

│               └── settings

├── profile

├── settings

└── docs
```

Protected routes require authentication.

---

# 6. Layout Hierarchy

```text
Root Layout

↓

Authenticated Layout

↓

Sidebar

↓

Header

↓

Page Layout

↓

Feature Components
```

Every authenticated page shares:

* Sidebar
* Navigation
* User profile
* Theme switcher
* Notifications

---

# 7. Component Architecture

```text
Pages

↓

Feature Components

↓

Shared Components

↓

UI Components
```

---

### UI Components

Pure presentation.

Examples:

```text
Button

Card

Badge

Dialog

Input

Avatar

Table
```

---

### Shared Components

Reusable across multiple features.

Examples:

```text
Navbar

Sidebar

PageHeader

EmptyState

ErrorBoundary

LoadingSpinner

SearchBar
```

---

### Feature Components

Business-specific.

Examples:

```text
RepositoryCard

FindingTable

AnalysisTimeline

ScoreGauge

ReportViewer

RecommendationCard
```

---

### Pages

Only responsible for:

* Fetching data
* Composing layouts
* Rendering feature components

---

# 8. State Management

## Local UI State

Managed with React hooks.

Examples:

* Dialog open
* Active tab
* Search input

---

## Global State

Managed with Zustand.

Stores:

* Current user
* Theme
* Authentication
* Sidebar state
* Notification preferences

---

## Server State

Managed with TanStack Query.

Responsible for:

* API caching
* Revalidation
* Background refetching
* Loading state
* Error handling

---

# 9. API Layer

Frontend never calls fetch directly.

Instead:

```text
Page

↓

Hook

↓

API Service

↓

Backend
```

Example:

```text
Dashboard

↓

useDashboard()

↓

DashboardService

↓

GET /dashboard
```

---

# 10. Design System

Design follows a consistent token-based system.

Typography

* Heading XL
* Heading L
* Heading M
* Body
* Caption

Spacing

```text
4

8

12

16

24

32

48

64
```

Border Radius

```text
sm

md

lg

xl
```

Every component uses design tokens.

No arbitrary values.

---

# 11. Color System

Primary

Blue

Success

Green

Warning

Amber

Danger

Red

Neutral

Slate

Dark mode supported from day one.

---

# 12. Dashboard Architecture

Dashboard contains:

```text
Overview Cards

↓

Repository List

↓

Recent Analyses

↓

Recent Findings

↓

Average Score

↓

Quick Actions
```

Dashboard should load in under one second.

---

# 13. Repository Page

Sections

```text
Repository Overview

↓

Analysis History

↓

Findings

↓

Reports

↓

Settings
```

Each section uses nested routing.

---

# 14. Analysis UI

Analysis is displayed as a timeline.

```text
Queued

↓

Cloning

↓

Detecting Stack

↓

Security Scan

↓

Docker Validation

↓

Generating Score

↓

Generating Report

↓

Completed
```

Progress updates use Server-Sent Events (SSE).

---

# 15. Findings Interface

Users can:

* Search
* Filter
* Sort
* Expand
* Copy recommendations
* Jump to documentation

Grouping options:

* Severity
* Category
* File
* Analyzer

---

# 16. Report Viewer

Sections:

```text
Overall Score

↓

Summary

↓

Category Scores

↓

Findings

↓

Recommendations

↓

Next Steps
```

Future:

* PDF export
* Shareable links

---

# 17. Forms

All forms use:

* React Hook Form
* Zod validation

Validation occurs:

* On submit
* On blur (critical fields)

Errors are displayed inline.

---

# 18. Loading Strategy

Every async page has:

* Skeleton loaders
* Progress indicators
* Empty states

Never show a blank screen.

---

# 19. Error Handling

Every feature has:

* Error boundaries
* Retry button
* Helpful messages
* Recovery actions

Unexpected errors are logged automatically.

---

# 20. Accessibility

WCAG AA compliance target.

Requirements:

* Keyboard navigation
* Screen reader labels
* Focus indicators
* Color contrast
* Semantic HTML

Accessibility is part of the definition of done.

---

# 21. Performance Strategy

Goals:

* First Contentful Paint < 2s
* Largest Contentful Paint < 2.5s
* Interaction to Next Paint < 200ms

Techniques:

* React Server Components
* Route-based code splitting
* Image optimization
* Lazy loading
* API caching
* Dynamic imports

---

# 22. Responsive Design

Supported devices:

Desktop (Primary)

Tablet

Mobile

Breakpoints

```text
sm

md

lg

xl

2xl
```

The MVP is desktop-first, but all pages remain functional on mobile.

---

# 23. Security

* HttpOnly authentication cookies (preferred over storing JWTs in localStorage)
* CSP headers
* XSS protection
* CSRF protection where applicable
* Secure API communication
* No secrets in frontend code

---

# 24. Testing Strategy

Testing levels:

Component Tests

Integration Tests

End-to-End Tests

Tools:

* Vitest
* React Testing Library
* Playwright

Critical flows:

* Login
* Repository connection
* Analysis lifecycle
* Report viewing

---

# 25. Coding Standards

Formatting:

* Prettier

Linting:

* ESLint

Typing:

* Strict TypeScript

Components:

* Functional only

Naming:

* PascalCase components
* camelCase functions
* kebab-case routes

---

# 26. UI Principles

Every screen should answer three questions immediately:

1. What is happening?
2. What should the user do next?
3. Is the system working?

No screen should overwhelm users with information.

Progressive disclosure is preferred over dense interfaces.

---

# 27. Future Frontend Modules

Planned additions:

* Deployment Dashboard
* AI Engineering Assistant
* Team Workspace
* Organization Dashboard
* Plugin Marketplace
* Notification Center
* Settings Expansion

The architecture allows these features to be added without restructuring existing modules.

---

# 28. Frontend Request Lifecycle

```text
User Action

↓

React Component

↓

TanStack Query Hook

↓

API Service

↓

Backend API

↓

Response Validation

↓

Cache Update

↓

UI Re-render
```

---

# 29. Design Principles

The frontend adheres to these principles:

* **Single Responsibility:** Components have one purpose.
* **Composition over Inheritance:** Build complex UIs from small reusable pieces.
* **Server-First Rendering:** Reduce client-side JavaScript where possible.
* **Consistency:** Shared patterns for navigation, feedback, and interactions.
* **Performance by Default:** Optimize before adding complexity.
* **Accessibility by Design:** Inclusive experiences are part of the architecture, not an afterthought.

---

# 30. Architectural Summary

The Preflight frontend is designed as a **component-driven, server-first application** built on Next.js with a strong emphasis on modularity, performance, and usability. Feature-based organization, typed API interactions, centralized state management, and a reusable design system ensure that the interface can evolve alongside the backend without becoming difficult to maintain.
