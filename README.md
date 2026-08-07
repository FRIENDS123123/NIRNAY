# NIRNAY

**AI Unified Citizen Intelligence Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-foundation-blue.svg)](ENGINEERING_NOTES.md)
[![Data](https://img.shields.io/badge/data-synthetic--only-critical.svg)](docs/07_SECURITY.md)

> Search first. Intelligence second. Everything else last.

---

## Vision

A modern AI-powered intelligence platform that enables authorized government
officers to view a **unified citizen profile** by securely correlating
information from multiple government departments — without stitching together
a dozen portals, logins, and PDFs by hand.

NIRNAY demonstrates this concept end-to-end using **synthetic datasets only**.
No real citizen data is used, stored, or referenced anywhere in this
repository.

## Problem Statement

Government information about a single citizen is fragmented across many
independent departmental systems — identity, property, tax, legal, licensing,
welfare — each with its own database, its own login, and its own format.

When an authorized officer needs to make a decision — verify an identity,
assess a claim, investigate a case — they spend hours manually visiting
separate systems, copying data into notes, and reconciling inconsistencies
before they can even begin the actual investigation.

**NIRNAY provides a unified citizen intelligence workspace** that collapses
this fragmented lookup process into a single search, so officers spend their
time on judgment, not data collection.

## Design Philosophy

```
Search First.
Intelligence Second.
Everything Else Last.
```

NIRNAY is deliberately **not** an analytics dashboard. There are no chart
walls, no vanity KPIs, no "enterprise BI" screens. Every screen exists to
answer one question an officer actually asks during an investigation. If a
feature doesn't shorten the path from *search* to *decision*, it doesn't
belong in the product. See [docs/06_UI_GUIDELINES.md](docs/06_UI_GUIDELINES.md)
for the full rationale.

## Key Features

- **Unified Citizen Search** — one search box, one identity, every linked record
- **AI Citizen Summary** — a plain-language brief generated from correlated records
- **Linked Government Records** — records grouped by issuing department, not by table
- **Timeline View** — chronological reconstruction of a citizen's recorded history
- **Property & Asset Overview** — declared and registered assets in one view
- **Government Documents** — verified document references in one place
- **Risk Assessment** — explainable, rule-and-model-based risk signals (no black-box scores)
- **AI Investigation Assistant** — a conversational layer over the citizen's unified record
- **Intelligence Report Generation** — a exportable, attributable report an officer can act on

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- TailwindCSS

**Backend**
- FastAPI
- Python

**Database**
- SQLite

**AI**
- OpenAI-compatible LLM (provider-agnostic via a compatible chat completions API)

## Project Structure

```
NIRNAY/
├── README.md                      # You are here
├── ENGINEERING_NOTES.md           # Engineering decisions, conventions, rationale
├── PROJECT_BLUEPRINT.md           # Full product + technical blueprint
├── docs/                          # Product & platform documentation
│   ├── 01_PROJECT_OVERVIEW.md
│   ├── 02_SYSTEM_ARCHITECTURE.md
│   ├── 03_DATABASE_SCHEMA.md
│   ├── 04_AI_ENGINE.md
│   ├── 05_DATA_FLOW.md
│   ├── 06_UI_GUIDELINES.md
│   ├── 07_SECURITY.md
│   ├── 08_DEVELOPMENT_PLAN.md
│   └── 09_FUTURE_SCOPE.md
├── architecture/                  # Diagrams and structural references
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── COMPONENT_DIAGRAM.md
│   ├── APPLICATION_FLOW.md
│   ├── SEQUENCE_DIAGRAM.md
│   └── DATABASE_RELATIONS.md
├── frontend/                      # React + TypeScript + Vite application (Phase 2+)
├── backend/                       # FastAPI service (Phase 2+)
└── shared/                        # Cross-cutting types, contracts, fixtures (Phase 2+)
```

`frontend/`, `backend/`, and `shared/` are currently placeholders. This
repository is in its **documentation-first foundation phase** — see
[docs/08_DEVELOPMENT_PLAN.md](docs/08_DEVELOPMENT_PLAN.md) for what gets built,
in what order, and why.

## Architecture Overview

NIRNAY is a conventional three-tier application with one deliberate twist: the
AI layer never talks to raw departmental data directly. A **Citizen 360
Resolution Service** in the backend correlates records across synthetic
department tables into a single canonical `citizen_id`-scoped profile *before*
anything — UI, AI assistant, or report generator — reads it. This keeps every
consumer of citizen data working from one consistent, auditable source of
truth.

```
React SPA  →  FastAPI API Gateway  →  Citizen 360 Resolution Service  →  SQLite (synthetic dept. data)
                                                    ↓
                                        AI Engine (OpenAI-compatible LLM)
```

Full detail in [architecture/SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md).

## Screenshots

> Interface has not been built yet — this repository is currently in its
> documentation-first foundation phase. Screenshots will be added once the
> frontend exists.

| Search | Citizen Profile | Investigation | Report |
|---|---|---|---|
| _placeholder_ | _placeholder_ | _placeholder_ | _placeholder_ |

## Future Scope

NIRNAY's demo architecture is intentionally shaped to make real integrations
additive, not a rewrite:

- Replacing synthetic department tables with authenticated connectors to real
  departmental systems (identity, land records, tax, legal, welfare) behind
  the same Citizen 360 resolution contract
- Pluggable data-source adapters so new departments are onboarded without
  touching the resolution or AI layers
- Enterprise identity integration (SSO / government IAM) in place of the
  demo's local auth
- Formal audit and compliance export pipeline
- Multi-tenant deployment across departments/jurisdictions

See [docs/09_FUTURE_SCOPE.md](docs/09_FUTURE_SCOPE.md) for the full roadmap.

## Security

- **All data in this repository and demo is synthetic.** No real citizen,
  officer, or government records are used at any point.
- The architecture is designed from the outset for **role-based access
  control**, **immutable audit logs** of every citizen record access, and
  **secure, credentialed integrations** with upstream data sources.
- Full detail in [docs/07_SECURITY.md](docs/07_SECURITY.md).

## License

[MIT](LICENSE)
