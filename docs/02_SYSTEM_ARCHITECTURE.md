# 02 — System Architecture

Product-level architecture narrative. For diagrams and structural detail, see
[../architecture/SYSTEM_ARCHITECTURE.md](../architecture/SYSTEM_ARCHITECTURE.md)
and [../architecture/COMPONENT_DIAGRAM.md](../architecture/COMPONENT_DIAGRAM.md).

## Layers

### 1. Client — React SPA

TypeScript + Vite + TailwindCSS single-page application. Owns exactly the
primary flow's screens: Search, Citizen Profile, AI Investigation, Evidence,
Risk Assessment, Report. No routing depth beyond what that flow requires.

### 2. API Gateway — FastAPI

Single FastAPI service exposing a REST API. Responsibilities:
- Authentication (officer identity) and role-based authorization
- Request routing to internal services
- Audit log emission for every citizen-data-touching request
- Input validation and response shaping (Pydantic models shared conceptually
  with the frontend's TypeScript types — see
  [../shared](../shared) once implemented)

The gateway does **not** contain correlation logic itself — it delegates to
the Citizen 360 Resolution Service.

### 3. Citizen 360 Resolution Service

The architectural centerpiece of NIRNAY. A backend service (module-level in
the demo, not a separate deployable) with one job: given a citizen identifier
or search query, resolve and merge records from every synthetic department
table into **one canonical citizen profile shape**.

Why this exists as its own layer rather than ad hoc joins in each endpoint:
- **Single source of truth** — the AI engine, the profile UI, the risk
  engine, and the report generator all read the *same* resolved shape. There
  is exactly one code path that decides "this record belongs to this
  citizen."
- **Auditability** — correlation decisions (e.g., matching a property record
  to a citizen by ID + name + DOB confidence) happen in one place, so they can
  be logged and explained.
- **Extensibility** — see [09_FUTURE_SCOPE.md](09_FUTURE_SCOPE.md); onboarding
  a new department means adding an adapter here, not touching every consumer.

### 4. AI Engine

A thin service layer over an OpenAI-compatible chat completions API. Consumes
*only* the resolved Citizen 360 profile (never raw department tables) and
serves three scoped functions: citizen summary generation, conversational
investigation assistance, and report drafting. Detail in
[04_AI_ENGINE.md](04_AI_ENGINE.md).

### 5. Data Layer — SQLite

Synthetic department tables plus platform tables (officers, audit log, saved
reports). See [03_DATABASE_SCHEMA.md](03_DATABASE_SCHEMA.md) and
[../architecture/DATABASE_RELATIONS.md](../architecture/DATABASE_RELATIONS.md).

## Cross-Cutting Concerns

- **RBAC** — enforced at the API Gateway; every route declares the minimum
  officer role required. See [07_SECURITY.md](07_SECURITY.md).
- **Audit logging** — every read of citizen data is logged with officer
  identity, timestamp, citizen ID, and the reason/context (search query or
  case reference) at the gateway layer, not scattered per-endpoint.
- **Explainability** — any AI- or rule-derived output (summary, risk signal)
  carries a reference back to the source record(s) it was derived from.

## Why Not Microservices

At this scale (single demo deployment, one team, synthetic data), splitting
the Resolution Service and AI Engine into separately deployed services would
add operational overhead with no corresponding benefit. Both are structured
as clearly bounded modules within the FastAPI backend so they *could* be
extracted later without a redesign — see
[09_FUTURE_SCOPE.md](09_FUTURE_SCOPE.md) — but they are not extracted
prematurely.

## Related Documents

- [../architecture/SYSTEM_ARCHITECTURE.md](../architecture/SYSTEM_ARCHITECTURE.md)
- [../architecture/COMPONENT_DIAGRAM.md](../architecture/COMPONENT_DIAGRAM.md)
- [05_DATA_FLOW.md](05_DATA_FLOW.md)
