# 07 — Security

## Synthetic Data Guarantee

This is the single most important security property of this repository:

> **No real citizen, officer, or government data is used, stored, or
> referenced anywhere in this project.** All department records, identities,
> documents, and case data are synthetically generated for demonstration
> purposes only.

This is enforced structurally, not just by policy:
- `dept_*` tables are seeded exclusively from generated/mock fixtures
  (planned location: `backend/`, seed scripts — see
  [08_DEVELOPMENT_PLAN.md](08_DEVELOPMENT_PLAN.md))
- No code path in this repository connects to any external government API or
  data source
- Any future connection to real data sources is explicitly out of scope for
  this repository — see [09_FUTURE_SCOPE.md](09_FUTURE_SCOPE.md), which
  describes that as a separate, later, and explicitly-approved effort

## Role-Based Access Control (RBAC)

Designed from the outset, even though the demo may seed a small fixed set of
accounts:

- Every officer account (`platform_officer`) carries a `role`
- Every API route declares the minimum role required to call it
- Citizen-data-reading routes require, at minimum, the `officer` role;
  administrative/config routes (out of primary scope per
  [06_UI_GUIDELINES.md](06_UI_GUIDELINES.md)) would require an elevated role
  if they exist at all
- Authorization is enforced at the API Gateway, not left to the frontend to
  hide/show UI — the frontend hiding a button is a UX convenience, not a
  security boundary

## Audit Logging

- Every citizen-data-touching action (search, profile view, AI query,
  evidence view, report generation) is written to `platform_audit_log`
- Audit entries are append-only — no update or delete path exists for this
  table
- Each entry captures **who** (officer), **what** (action + citizen), **when**
  (timestamp), and **why** (query/context) — sufficient to answer "who looked
  at this citizen's data, and on what basis" after the fact
- See [03_DATABASE_SCHEMA.md](03_DATABASE_SCHEMA.md) for the table shape and
  [05_DATA_FLOW.md](05_DATA_FLOW.md) for where logging is enforced (a single
  gateway-level interceptor, not per-endpoint code)

## Secrets & Configuration

- LLM API keys and any credentials live only in server-side environment
  configuration, never in frontend code or committed to the repository
- A `.env.example` (added when the backend is implemented) documents required
  configuration keys without real values
- No secrets are ever logged, including in the audit log's `context` field

## Data Handling Principles (carried forward from demo into any future phase)

- **Least privilege** — a component only ever has access to the data it
  needs for its specific job (e.g., the AI Engine reads resolved profiles,
  never raw department tables — see [04_AI_ENGINE.md](04_AI_ENGINE.md))
- **Attribution over inference** — no system output presents an unattributed
  claim as fact (see [04_AI_ENGINE.md](04_AI_ENGINE.md))
- **Secure by construction for future integration** — the resolution and
  gateway layers are structured so that a future real-data integration adds
  authenticated, credentialed connectors behind the existing boundary rather
  than requiring new trust decisions to be threaded through the whole system

## Explicitly Out of Scope (This Phase)

- Real authentication provider integration (SSO / government IAM) — demo
  uses a seeded local account set (see
  [08_DEVELOPMENT_PLAN.md](08_DEVELOPMENT_PLAN.md))
- Encryption-at-rest configuration for SQLite (not meaningful for a local
  synthetic-data demo; revisit if/when real data is ever considered)
- Penetration testing / formal security audit — appropriate before any real
  deployment, not applicable to a synthetic-data demo

## Related Documents

- [03_DATABASE_SCHEMA.md](03_DATABASE_SCHEMA.md)
- [04_AI_ENGINE.md](04_AI_ENGINE.md)
- [09_FUTURE_SCOPE.md](09_FUTURE_SCOPE.md)
