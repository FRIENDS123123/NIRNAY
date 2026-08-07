# Component Diagram

Internal module breakdown within the frontend and backend. Complements
[SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md), which shows the layer view;
this shows what lives inside each layer.

## Frontend Components (`frontend/`)

```
App
├── SearchView                    — the default/landing screen
│   └── SearchResultList
├── CitizenProfileView
│   ├── ProfileHeader              — name, resolved ID, resolution confidence
│   ├── DepartmentRecordSection[]  — one per linked department
│   └── ProfileSummaryPanel        — AI Citizen Summary, cited
├── InvestigationPanel
│   ├── ConversationThread
│   └── CitationLink               — routes into EvidenceView
├── EvidenceView
│   └── SourceRecordDetail         — raw dept_* record + match_confidence
├── RiskAssessmentView
│   └── RiskSignalCard[]           — rule name, rationale, source records
└── ReportView
    ├── ReportPreview
    └── ReportExportAction

Shared:
├── AuditContextProvider           — tags outgoing requests with officer session
└── ApiClient                      — typed REST client (types from shared/)
```

Mapping back to the primary flow: `SearchView` → `CitizenProfileView` →
`InvestigationPanel` → `EvidenceView` → `RiskAssessmentView` → `ReportView`.
No component exists outside this chain except the shared cross-cutting pair.

## Backend Components (`backend/`)

```
api/
├── auth                           — officer session/auth
├── search_router                  — Search Citizen endpoint(s)
├── profile_router                 — Unified Citizen Profile endpoint(s)
├── investigation_router           — AI Investigation endpoint(s)
├── evidence_router                — Evidence lookup endpoint(s)
├── risk_router                    — Risk Assessment endpoint(s)
├── report_router                  — Report generation/retrieval endpoint(s)
└── audit_middleware                — single interceptor, all citizen-data routes

services/
├── resolution_service              — Citizen 360 correlation + profile assembly
├── ai_engine
│   ├── client                      — OpenAI-compatible API wrapper
│   ├── summary                     — AI Citizen Summary prompt/response handling
│   ├── investigation                — conversational Q&A handling
│   └── report_drafting              — report synthesis
└── risk_engine
    └── rules/                      — individually named, testable rule functions

data/
├── models                          — SQLAlchemy (or equivalent) table definitions
├── migrations                      — schema migrations
└── seed                            — synthetic data generators
```

## Dependency Direction

```
api/*_router  →  services/*  →  data/models
```

Routers depend on services; services depend on data models. No reverse
dependency — `services/` never imports from `api/`, and `data/` never imports
from `services/`. `services/ai_engine` depends only on the shape produced by
`services/resolution_service`, never on `data/models` directly (see
[../docs/04_AI_ENGINE.md](../docs/04_AI_ENGINE.md)).

## Shared (`shared/`)

Type/contract definitions used by both frontend and backend conceptually
(TypeScript interfaces mirroring the Pydantic response models) — e.g., the
canonical `CitizenProfile` shape, `RiskSignal` shape, `EvidenceRecord` shape.
Kept here so a change to the API contract is a single, visible diff rather
than two frontend/backend definitions silently drifting apart.

## Related Documents

- [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
- [SEQUENCE_DIAGRAM.md](SEQUENCE_DIAGRAM.md)
- [../docs/02_SYSTEM_ARCHITECTURE.md](../docs/02_SYSTEM_ARCHITECTURE.md)
