# NIRNAY — Project Blueprint

This is the single top-level reference tying together vision, product scope,
and technical shape. Detailed treatment of each area lives in `docs/` and
`architecture/`; this document is the map, not the territory.

---

## 1. What NIRNAY Is

An AI-powered workspace that lets an authorized government officer search for
a citizen once and receive a unified, correlated view of that citizen's
records across multiple (synthetic, in this demo) government departments —
followed by AI-assisted investigation, evidence review, explainable risk
assessment, and a generated intelligence report.

## 2. What NIRNAY Is Not

- Not a BI/analytics dashboard product
- Not a general-purpose data warehouse UI
- Not a Palantir-style graph/ontology workbench
- Not a system that stores or processes real citizen data at this stage

## 3. The Primary Flow (the entire product)

```
Officer opens application
        ↓
Search Citizen
        ↓
Unified Citizen Profile
        ↓
AI Investigation
        ↓
Evidence
        ↓
Risk Assessment
        ↓
Generate Intelligence Report
```

Every screen, API, and table in this system exists to serve one step of this
flow. A feature that doesn't map to a step in this flow does not belong in
the product without an explicit, separate decision to expand scope.

| Step | Officer's Question | Primary Surface |
|---|---|---|
| Search Citizen | "Who is this person, in the system?" | Global search |
| Unified Citizen Profile | "What do we know about them, all in one place?" | Profile workspace |
| AI Investigation | "What does this mean, and what should I look at next?" | AI assistant panel |
| Evidence | "What's the underlying record backing that claim?" | Evidence viewer |
| Risk Assessment | "Is there something here I need to flag?" | Risk panel (explainable) |
| Generate Intelligence Report | "How do I hand this off / act on it?" | Report generator |

Full narrative in [docs/01_PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md)
and [architecture/APPLICATION_FLOW.md](architecture/APPLICATION_FLOW.md).

## 4. System Shape

```
┌─────────────────────┐      ┌──────────────────────────┐      ┌──────────────────────┐
│   React SPA          │ ──▶ │   FastAPI API Gateway     │ ──▶ │   SQLite (synthetic)  │
│   (Vite, TS, Tailwind)│     │   (auth, routing, RBAC)   │     │   department tables   │
└─────────────────────┘      └──────────────────────────┘      └──────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────────────┐
                              │ Citizen 360 Resolution    │
                              │ Service (correlation)     │
                              └──────────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────────────┐
                              │ AI Engine                 │
                              │ (OpenAI-compatible LLM)    │
                              └──────────────────────────┘
```

Full detail: [architecture/SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md).

## 5. Data Model Shape

Department data lives in isolated, department-prefixed synthetic tables. A
resolution layer maps every department record to a shared `citizen_id`,
producing the single canonical profile every other layer reads from. Full
schema: [docs/03_DATABASE_SCHEMA.md](docs/03_DATABASE_SCHEMA.md); entity
relationships: [architecture/DATABASE_RELATIONS.md](architecture/DATABASE_RELATIONS.md).

## 6. AI Boundary

The AI Engine only ever reads the resolved Citizen 360 profile — never raw
department tables directly. It performs three distinct jobs, each scoped
narrowly (summary generation, conversational investigation assistance, report
drafting) rather than one unbounded "ask anything" agent. Full detail:
[docs/04_AI_ENGINE.md](docs/04_AI_ENGINE.md).

## 7. Security Posture

Synthetic data only; designed from day one for RBAC, immutable audit logging
of every citizen record access, and secure credentialed integration points
for a future real-data deployment. Full detail:
[docs/07_SECURITY.md](docs/07_SECURITY.md).

## 8. Current Phase

**Phase 0 — Foundation.** Repository structure and documentation only. No
business logic, no application code. See
[docs/08_DEVELOPMENT_PLAN.md](docs/08_DEVELOPMENT_PLAN.md) for the proposed
phase sequence, pending explicit sign-off before Phase 1 begins.

## 9. Document Index

**Product & Platform**
- [docs/01_PROJECT_OVERVIEW.md](docs/01_PROJECT_OVERVIEW.md)
- [docs/02_SYSTEM_ARCHITECTURE.md](docs/02_SYSTEM_ARCHITECTURE.md)
- [docs/03_DATABASE_SCHEMA.md](docs/03_DATABASE_SCHEMA.md)
- [docs/04_AI_ENGINE.md](docs/04_AI_ENGINE.md)
- [docs/05_DATA_FLOW.md](docs/05_DATA_FLOW.md)
- [docs/06_UI_GUIDELINES.md](docs/06_UI_GUIDELINES.md)
- [docs/07_SECURITY.md](docs/07_SECURITY.md)
- [docs/08_DEVELOPMENT_PLAN.md](docs/08_DEVELOPMENT_PLAN.md)
- [docs/09_FUTURE_SCOPE.md](docs/09_FUTURE_SCOPE.md)

**Architecture**
- [architecture/SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md)
- [architecture/COMPONENT_DIAGRAM.md](architecture/COMPONENT_DIAGRAM.md)
- [architecture/APPLICATION_FLOW.md](architecture/APPLICATION_FLOW.md)
- [architecture/SEQUENCE_DIAGRAM.md](architecture/SEQUENCE_DIAGRAM.md)
- [architecture/DATABASE_RELATIONS.md](architecture/DATABASE_RELATIONS.md)

**Engineering**
- [ENGINEERING_NOTES.md](ENGINEERING_NOTES.md)
