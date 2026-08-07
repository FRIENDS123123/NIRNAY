# 08 — Development Plan

This is a **proposed** phase breakdown. Per project ground rules, no phase
beyond Phase 0 begins without explicit sign-off — this document exists so
that sign-off is an informed decision, not a blank check.

## Phase 0 — Foundation (this delivery)

- Repository structure (`docs/`, `architecture/`, `frontend/`, `backend/`,
  `shared/`)
- Full documentation set (this file and its siblings)
- No application code, no business logic

**Status: complete.**

## Phase 1 — Synthetic Data Foundation (proposed)

- Define final SQLite schema as migrations (from
  [03_DATABASE_SCHEMA.md](03_DATABASE_SCHEMA.md))
- Build synthetic data generators for each `dept_*` table — small, clearly
  fictitious dataset (a handful of synthetic citizens, obviously fake names/
  IDs, no resemblance to real records)
- Stand up bare FastAPI backend skeleton with health check, no business
  endpoints yet
- Stand up bare Vite + React + TypeScript + Tailwind frontend skeleton

**Exit criteria:** backend serves seeded synthetic data from SQLite; frontend
builds and runs; nothing user-facing yet.

## Phase 2 — Search & Unified Citizen Profile (proposed)

- Implement Citizen 360 Resolution Service (correlation logic +
  `citizen_record_link` population)
- Search Citizen screen + API
- Unified Citizen Profile screen + API
- Audit logging interceptor at the gateway

**Exit criteria:** an officer can search a synthetic citizen and view a
correlated profile assembled from multiple synthetic department tables.

## Phase 3 — AI Investigation & Evidence (proposed)

- AI Engine integration (OpenAI-compatible client wrapper)
- AI Citizen Summary
- AI Investigation Assistant (session-scoped, cited)
- Evidence viewer (click-through from any citation)

**Exit criteria:** an officer can read an AI summary, ask follow-up
questions, and click through to the underlying synthetic record for any
claim.

## Phase 4 — Risk Assessment & Reporting (proposed)

- Risk Rule Engine (deterministic, explainable signals)
- Risk Assessment screen
- Intelligence Report generation + persistence + export

**Exit criteria:** the full primary flow — search through report generation —
works end-to-end on synthetic data.

## Phase 5 — Hardening & Polish (proposed)

- RBAC role enforcement across all routes
- UI guideline compliance pass against
  [06_UI_GUIDELINES.md](06_UI_GUIDELINES.md)
- Demo seed data review for realism and obvious-synthetic labeling

## Explicitly Not Scheduled

Real data source integration, enterprise auth/SSO, multi-tenant deployment —
these are [09_FUTURE_SCOPE.md](09_FUTURE_SCOPE.md) items, not phases of this
repository's roadmap.

## Related Documents

- [09_FUTURE_SCOPE.md](09_FUTURE_SCOPE.md)
- [../ENGINEERING_NOTES.md](../ENGINEERING_NOTES.md)
