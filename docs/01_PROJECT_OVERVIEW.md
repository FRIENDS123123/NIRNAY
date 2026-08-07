# 01 — Project Overview

## Purpose

NIRNAY is a demonstration platform showing how an AI-assisted, unified
citizen intelligence workspace can reduce the time an authorized government
officer spends gathering information before making a decision — from hours of
manual cross-department lookup to a single search.

All data used is **synthetic**. This is a capability demonstration, not a
connection to any real government system.

## Who This Is For

A single persona drives every design decision in this repository: the
**Authorized Officer**.

- Has legitimate, role-scoped authority to investigate a citizen
- Is not a data analyst — has no patience for dashboards, filters, or query
  builders
- Needs an answer, a source for that answer, and a way to act on it
- Operates under audit — every action they take must be attributable

There is no secondary "admin" or "analyst" persona in this phase. If a screen
doesn't serve the Authorized Officer's investigation flow, it's out of scope.

## The Core Problem

Citizen-relevant information sits in independent departmental systems:
identity records, property/land records, tax filings, legal case history,
licensing, and welfare enrollment (all synthetic here, modeled on how such
systems are typically siloed in practice). Each has its own schema, its own
access path, and no shared "citizen view."

An officer investigating a citizen today must:
1. Know which departments are even relevant to check
2. Access each system separately (often with separate credentials)
3. Manually identify the *same* citizen across systems (name/DOB/ID matching)
4. Manually reconcile inconsistent or partial records
5. Synthesize all of it into a judgment, from memory or handwritten notes

Steps 1–4 are pure overhead — no judgment happens until step 5. NIRNAY
collapses steps 1–4 into one search and one resolved profile.

## The Solution Shape

```
Search Citizen → Unified Citizen Profile → AI Investigation → Evidence → Risk Assessment → Generate Intelligence Report
```

See [08_DEVELOPMENT_PLAN.md](08_DEVELOPMENT_PLAN.md) for how this is built up
in phases, and [../architecture/APPLICATION_FLOW.md](../architecture/APPLICATION_FLOW.md)
for the screen-by-screen flow.

## Design Philosophy

> Search First. Intelligence Second. Everything Else Last.

- **Search First** — the application's default, always-available state is a
  search box. Nothing is buried behind navigation.
- **Intelligence Second** — once a citizen is found, the system's job is to
  produce understanding (summary, correlated records, risk signals, AI
  investigation), not raw data dumps.
- **Everything Else Last** — settings, admin, configuration, and any
  non-investigative surface is deliberately secondary, minimal, and out of
  the primary flow's way.

Explicitly rejected: chart-heavy dashboards, general analytics/BI screens,
and Palantir-style graph/ontology exploration workbenches. See
[06_UI_GUIDELINES.md](06_UI_GUIDELINES.md) for what this means concretely for
every screen.

## Success Criteria (Demo)

- An officer can go from an empty search box to a generated intelligence
  report for a synthetic citizen in well under a minute of interaction time.
- Every fact shown in the AI summary, risk assessment, or report is traceable
  to a specific underlying synthetic record (no unattributed AI claims).
- The system remains legible to someone who has never seen it before within
  the first screen — no onboarding tour required.

## Related Documents

- [02_SYSTEM_ARCHITECTURE.md](02_SYSTEM_ARCHITECTURE.md) — how it's built
- [03_DATABASE_SCHEMA.md](03_DATABASE_SCHEMA.md) — what data looks like
- [04_AI_ENGINE.md](04_AI_ENGINE.md) — how AI is scoped and used
- [07_SECURITY.md](07_SECURITY.md) — synthetic data guarantee and access model
