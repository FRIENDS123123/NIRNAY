# Sequence Diagrams

Request/response detail for each step of the primary flow. Complements
[../docs/05_DATA_FLOW.md](../docs/05_DATA_FLOW.md), which explains the *why*;
this shows the *order of operations*.

## 1. Search Citizen

```
Officer      SPA        Gateway      ResolutionService     DB
  │           │            │                │              │
  │  types    │            │                │              │
  │  query    │            │                │              │
  │──────────▶│            │                │              │
  │           │ GET /search│                │              │
  │           │───────────▶│                │              │
  │           │            │ authorize()    │              │
  │           │            │───────┐        │              │
  │           │            │◀──────┘        │              │
  │           │            │ resolveSearch()│              │
  │           │            │───────────────▶│              │
  │           │            │                │ query dept_identity_record
  │           │            │                │─────────────▶│
  │           │            │                │◀─────────────│
  │           │            │◀───────────────│ ranked candidates
  │           │            │ log(audit: search)             │
  │           │            │────────────────────────────────▶│
  │           │◀───────────│ candidates                     │
  │◀──────────│            │                │              │
```

## 2. Unified Citizen Profile

```
Officer      SPA        Gateway      ResolutionService     DB
  │  selects  │            │                │              │
  │  citizen  │            │                │              │
  │──────────▶│ GET /citizens/{id}          │              │
  │           │───────────▶│ authorize()    │              │
  │           │            │ resolveProfile()               │
  │           │            │───────────────▶│              │
  │           │            │                │ read/refresh citizen_record_link
  │           │            │                │ across all dept_* tables
  │           │            │                │─────────────▶│
  │           │            │                │◀─────────────│
  │           │            │◀───────────────│ canonical profile
  │           │            │ log(audit: view_profile)       │
  │           │            │────────────────────────────────▶│
  │           │◀───────────│ profile                        │
  │◀──────────│            │                │              │
```

## 3. AI Investigation

```
Officer      SPA        Gateway        AIEngine          LLM API
  │  asks     │            │                │              │
  │  question │            │                │              │
  │──────────▶│ POST /citizens/{id}/investigate            │
  │           │───────────▶│ authorize()    │              │
  │           │            │ ask(question, profile)         │
  │           │            │───────────────▶│              │
  │           │            │                │ buildPrompt(profile, question)
  │           │            │                │───────┐      │
  │           │            │                │◀──────┘      │
  │           │            │                │ chat.completions
  │           │            │                │─────────────▶│
  │           │            │                │◀─────────────│
  │           │            │◀───────────────│ cited answer  │
  │           │            │ log(audit: ai_query)           │
  │           │            │────────────────────────────────▶ DB
  │           │◀───────────│ answer                          │
  │◀──────────│            │                │              │
```

## 4. Evidence

```
Officer      SPA        Gateway            DB
  │  clicks   │            │                │
  │  citation │            │                │
  │──────────▶│ GET /evidence/{link_id}     │
  │           │───────────▶│ authorize()    │
  │           │            │ fetch citizen_record_link → source record
  │           │            │───────────────▶│
  │           │            │◀───────────────│
  │           │            │ log(audit: view_evidence)
  │           │            │───────────────▶│
  │           │◀───────────│ record + match_confidence
  │◀──────────│            │                │
```

## 5. Risk Assessment

```
Officer      SPA        Gateway         RiskEngine         DB
  │  opens    │            │                │              │
  │  risk view│            │                │              │
  │──────────▶│ GET /citizens/{id}/risk     │              │
  │           │───────────▶│ authorize()    │              │
  │           │            │ evaluate(profile)               │
  │           │            │───────────────▶│              │
  │           │            │                │ run named rules against
  │           │            │                │ linked records
  │           │            │◀───────────────│ signals[] (rule, records, severity)
  │           │            │ log(audit: view_profile*)       │
  │           │            │────────────────────────────────▶│
  │           │◀───────────│ signals                         │
  │◀──────────│            │                │              │

  * risk view is logged under the profile-access action family; see
    docs/03_DATABASE_SCHEMA.md for the action taxonomy.
```

## 6. Generate Intelligence Report

```
Officer      SPA        Gateway       AIEngine        DB
  │  clicks   │            │              │            │
  │  generate │            │              │            │
  │──────────▶│ POST /citizens/{id}/report               │
  │           │───────────▶│ authorize()  │            │
  │           │            │ gather(profile, findings, risk signals)
  │           │            │─────────────────────────────▶│
  │           │            │◀─────────────────────────────│
  │           │            │ draft(gathered)              │
  │           │            │─────────────▶│               │
  │           │            │◀─────────────│ structured report
  │           │            │ persist(platform_intelligence_report)
  │           │            │─────────────────────────────▶│
  │           │            │ log(audit: generate_report)  │
  │           │            │─────────────────────────────▶│
  │           │◀───────────│ report                        │
  │◀──────────│            │              │            │
```

## Related Documents

- [../docs/05_DATA_FLOW.md](../docs/05_DATA_FLOW.md)
- [APPLICATION_FLOW.md](APPLICATION_FLOW.md)
- [COMPONENT_DIAGRAM.md](COMPONENT_DIAGRAM.md)
