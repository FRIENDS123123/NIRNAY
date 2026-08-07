# System Architecture

Structural reference. For the narrative rationale behind each layer, see
[../docs/02_SYSTEM_ARCHITECTURE.md](../docs/02_SYSTEM_ARCHITECTURE.md).

## High-Level Diagram

```
                         ┌───────────────────────────────┐
                         │         React SPA               │
                         │  Vite · TypeScript · Tailwind   │
                         │  Search · Profile · AI ·         │
                         │  Evidence · Risk · Report        │
                         └───────────────┬─────────────────┘
                                         │ REST (JSON, HTTPS)
                                         ▼
                         ┌───────────────────────────────┐
                         │        FastAPI API Gateway      │
                         │  • Auth (officer identity)      │
                         │  • RBAC enforcement              │
                         │  • Audit log interceptor         │
                         │  • Request routing               │
                         └───────┬───────────────┬─────────┘
                                 │               │
                 ┌───────────────▼───┐   ┌───────▼─────────────┐
                 │ Citizen 360         │   │ AI Engine             │
                 │ Resolution Service  │──▶│ (OpenAI-compatible    │
                 │ • correlation       │   │  chat completions)    │
                 │ • profile assembly  │   │ • Summary              │
                 └───────┬─────────────┘   │ • Investigation Q&A    │
                         │                 │ • Report drafting      │
                         │                 └────────────────────────┘
                         ▼
                 ┌─────────────────────────────────┐
                 │            SQLite                 │
                 │  dept_*  (synthetic dept. data)   │
                 │  citizen_* (resolved profile)     │
                 │  platform_* (officers, audit,     │
                 │              reports)             │
                 └─────────────────────────────────┘
```

## Layer Responsibilities

| Layer | Owns | Never Does |
|---|---|---|
| React SPA | Presentation of the six-step flow | Business logic, direct DB/AI access |
| FastAPI Gateway | Auth, RBAC, routing, audit logging | Cross-department correlation logic |
| Citizen 360 Resolution Service | Correlating `dept_*` records into one profile | Talking to the LLM |
| AI Engine | Summary / investigation / report text generation | Deciding which records belong to which citizen; computing risk scores |
| Risk Rule Engine *(part of backend, see [COMPONENT_DIAGRAM.md](COMPONENT_DIAGRAM.md))* | Deterministic, explainable risk signals | Depending on the AI Engine being available |
| SQLite | Durable storage of synthetic + platform data | — |

## Deployment Shape (Demo)

Single-process FastAPI backend (Resolution Service, AI Engine client, Risk
Rule Engine as in-process modules — see
[../docs/02_SYSTEM_ARCHITECTURE.md](../docs/02_SYSTEM_ARCHITECTURE.md) for why
these aren't split into separate services at this stage), single SQLite file,
statically served or dev-served React SPA. No message queue, no cache layer,
no container orchestration — none of that complexity is warranted at this
scale.

## Trust Boundaries

```
[ Officer's browser ]  — untrusted input boundary
        │
[ API Gateway ]        — auth + RBAC enforced here; nothing past this point
        │                 trusts the client
[ Resolution Service /
  AI Engine / Risk     — trusted internal modules; operate only on data
  Rule Engine ]          already scoped by the Gateway to the requesting
        │                 officer's authorization
[ SQLite ]              — never queried directly by SPA or AI Engine
```

The AI Engine is inside the trust boundary but is still constrained to only
the resolved profile — this is a data-minimization boundary, not a trust
boundary, and it exists so the AI never has a wider blast radius than the
feature it's serving requires.

## Related Documents

- [COMPONENT_DIAGRAM.md](COMPONENT_DIAGRAM.md)
- [APPLICATION_FLOW.md](APPLICATION_FLOW.md)
- [SEQUENCE_DIAGRAM.md](SEQUENCE_DIAGRAM.md)
- [DATABASE_RELATIONS.md](DATABASE_RELATIONS.md)
