# 05 — Data Flow

How data moves through NIRNAY for each step of the primary flow. Sequence
diagrams with full request/response detail live in
[../architecture/SEQUENCE_DIAGRAM.md](../architecture/SEQUENCE_DIAGRAM.md);
this document explains the *why* behind each hop.

## 1. Search Citizen

```
Officer input → API Gateway (auth check) → Citizen 360 Resolution Service
    → fuzzy match against dept_identity_record (+ already-resolved citizen_profile)
    → ranked candidate list → API Gateway → SPA
```

Search matches on name, partial national ID, and date of birth against the
identity registry — the anchor table every other department record is
eventually linked back to. A search event is logged to `platform_audit_log`
regardless of whether it produces a match.

## 2. Unified Citizen Profile

```
Officer selects a candidate → API Gateway → Citizen 360 Resolution Service
    → resolve/refresh citizen_record_link across all dept_* tables
    → assemble canonical profile shape → API Gateway → SPA
```

This is the one point in the system where cross-department correlation
happens. The resolution service checks for existing `citizen_record_link`
rows before re-deriving them, so profile assembly is fast and consistent on
repeat views. Every profile view is audit-logged.

## 3. AI Investigation

```
Officer opens AI panel / asks a question
    → API Gateway → AI Engine
    → AI Engine reads resolved profile (never dept_* directly)
    → OpenAI-compatible completion request (server-side only)
    → cited, attributed response → API Gateway → SPA
```

The AI Engine receives the *resolved* profile as context, not raw table
access. Every AI query is audit-logged with the question asked, for
accountability.

## 4. Evidence

```
Officer clicks a citation in a summary/AI response
    → API Gateway → fetch source dept_* record by citizen_record_link reference
    → return raw record with its match_confidence/match_basis → SPA
```

This is the "show your work" step: any claim made anywhere in the product
must resolve to a real underlying record, viewable in full, including *how
confidently* it was linked to this citizen.

## 5. Risk Assessment

```
Resolved profile → Risk Rule Engine (deterministic, backend)
    → evaluates named rules against linked records
    → [optional] AI Engine used only to phrase rule output in natural language
    → risk signal list (rule name, triggering record(s), severity) → SPA
```

The Risk Rule Engine runs independently of the AI Engine's availability — the
platform's risk signals must not depend on an external LLM being reachable.

## 6. Generate Intelligence Report

```
Officer triggers report generation
    → API Gateway gathers: resolved profile + AI investigation session findings
      + risk assessment output
    → AI Engine synthesizes into structured report (no new claims)
    → stored in platform_intelligence_report → returned to SPA for export/print
```

Report generation is audit-logged and the report itself is persisted, so it
can be retrieved later without re-running AI generation.

## Cross-Cutting: Audit Logging

Every arrow that crosses from "officer action" into "citizen data read" in
the flows above writes one `platform_audit_log` row. This is not optional per
endpoint — it's enforced at the API Gateway layer as a single interceptor, so
no new endpoint can accidentally skip it.

## Related Documents

- [../architecture/SEQUENCE_DIAGRAM.md](../architecture/SEQUENCE_DIAGRAM.md)
- [02_SYSTEM_ARCHITECTURE.md](02_SYSTEM_ARCHITECTURE.md)
- [07_SECURITY.md](07_SECURITY.md)
