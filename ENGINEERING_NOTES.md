# Engineering Notes

Internal engineering log for NIRNAY. This file records **decisions and the
reasoning behind them**, not a changelog of file edits — git history already
covers that. Read this before proposing an architectural change; if a past
decision looks wrong, raise it explicitly rather than silently reversing it.

---

## Foundational Decisions

### 1. Documentation before code

This repository was deliberately bootstrapped documentation-first. Every
architectural surface — data model, AI boundary, security posture, UI
philosophy — is written down before a single application file exists. The
reason: NIRNAY's core risk is not technical (React + FastAPI + SQLite is a
well-understood stack), it's **conceptual creep**. It is very easy for a
"unified citizen intelligence platform" to slowly turn into a generic
enterprise dashboard. Writing the philosophy down first, and pointing back to
it, is the guardrail.

### 2. Synthetic data only, by construction

There is no code path anywhere in this project that is permitted to read real
government or citizen data. Synthetic data isn't a placeholder we'll swap out
later — it's a permanent constraint of this repository. Real integrations, if
they ever happen, happen in a deployment this repository does not contain.
See [docs/07_SECURITY.md](docs/07_SECURITY.md).

### 3. One canonical citizen record, resolved server-side

The AI assistant, the profile UI, the risk engine, and the report generator
must never independently join department tables. A single **Citizen 360
Resolution Service** performs correlation once and exposes one canonical
shape. This avoids four subtly different versions of "the truth" about a
citizen existing across the codebase. See
[architecture/SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md).

### 4. Explainable risk, not opaque scoring

Risk Assessment surfaces *why* a signal fired (rule name, contributing
record, weight), not just a number. A black-box risk score is not defensible
in a government decision-support context. This constrains model choice for
that specific feature — see [docs/04_AI_ENGINE.md](docs/04_AI_ENGINE.md).

### 5. Provider-agnostic AI integration

The AI Engine targets an **OpenAI-compatible chat completions API**, not a
specific vendor SDK. This is a deliberate abstraction boundary so the backing
model can be swapped (hosted or self-hosted) without touching application
code. See [docs/04_AI_ENGINE.md](docs/04_AI_ENGINE.md).

### 6. SQLite for the demo, by choice not default

SQLite is not "we'll upgrade this later" — it's the right tool for a
single-node synthetic-data demo: zero operational overhead, trivially
resettable, and the schema constraints it enforces are the same relational
constraints a production RDBMS would enforce. The schema is written to be
migration-friendly (see [docs/03_DATABASE_SCHEMA.md](docs/03_DATABASE_SCHEMA.md))
so a future move to Postgres is a driver swap, not a redesign.

## Conventions

- **Naming**: department source tables are prefixed by department
  (`dept_identity_*`, `dept_property_*`, `dept_tax_*`, …); the resolved,
  cross-department view lives under `citizen_*`.
- **Every doc cross-references its neighbors.** If you add a concept, link it
  from the doc that owns it and reference it (don't restate it) elsewhere.
- **No feature ships without a corresponding entry in
  [docs/08_DEVELOPMENT_PLAN.md](docs/08_DEVELOPMENT_PLAN.md).** If it's not
  planned, it's out of scope until it is.

## Open Questions

Tracked here until resolved; move to the relevant doc once decided.

- Exact LLM provider/model for the demo deployment (any OpenAI-compatible
  endpoint works — final pick is a deployment-time decision, not an
  architectural one).
- Whether officer authentication in the demo phase is a static seeded
  account set or a minimal real auth flow (leaning: seeded accounts, since
  Phase 1 has no real identity provider — see
  [docs/08_DEVELOPMENT_PLAN.md](docs/08_DEVELOPMENT_PLAN.md)).

## Status

Foundation phase complete: repository structure and documentation set are in
place. No application code has been written. Next step requires explicit
instruction — see [docs/08_DEVELOPMENT_PLAN.md](docs/08_DEVELOPMENT_PLAN.md)
for the proposed phase breakdown awaiting approval.
