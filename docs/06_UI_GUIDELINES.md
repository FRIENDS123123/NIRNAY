# 06 — UI Guidelines

## The One Rule

> Search First. Intelligence Second. Everything Else Last.

Every screen must justify its existence by which step of the primary flow it
serves:

```
Search Citizen → Unified Citizen Profile → AI Investigation → Evidence → Risk Assessment → Generate Intelligence Report
```

If a proposed screen or component doesn't map to one of these six steps, it
does not get built without an explicit separate decision to expand scope
(see [../CLAUDE.md-equivalent rule in root instructions] — scope discipline
applies to this project as much as the product it documents).

## Explicitly Rejected Patterns

These are not "avoid when possible" — they are **not part of this product**:

- **Chart-heavy dashboards.** No grid of KPI tiles, no analytics landing
  page. If a number matters, it appears inline, in context, next to the
  record it describes — not on a chart.
- **Palantir-style graph/ontology workbenches.** No free-form node-link
  graph explorer as a primary interaction model. Relationships are shown
  as structured lists and profile sections, not as a graph canvas to
  navigate.
- **General enterprise analytics pages.** No "reports & analytics" section
  for exploring aggregate trends across citizens. This is an
  investigation tool for one citizen at a time, not a population-level BI
  tool.

## What Each Flow Step Should Feel Like

- **Search Citizen** — a single, prominent search input, available from
  anywhere, always the default landing state. Results appear fast, ranked,
  minimal metadata per row (name, DOB, match confidence).
- **Unified Citizen Profile** — one page, sectioned by department, not by
  UI widget type. An officer should be able to scan it top to bottom like a
  case file, not hunt across tabs.
- **AI Investigation** — a conversational panel, not a chatbot bolted onto
  the side as an afterthought. It's a first-class way to interrogate the
  profile, and every answer shows its citations inline.
- **Evidence** — a focused, single-record view reachable by clicking any
  citation anywhere in the product. Never a separate "browse all evidence"
  index — evidence is always arrived at *from* a claim.
- **Risk Assessment** — a short, named list of signals with severity and
  rationale, not a score gauge or chart. Every signal is a sentence, not a
  number in isolation.
- **Generate Intelligence Report** — one action, one resulting document,
  reviewable and exportable. No report-builder UI with configurable
  sections in this phase.

## Visual Tone

- Dense, legible, fast — this is a working tool for someone under time
  pressure, not a marketing site.
- Information hierarchy over decoration: typography and spacing do the
  work; illustration and color are used sparingly, primarily to carry
  meaning (e.g., risk severity), not to decorate.
- No onboarding tours, no empty-state illustrations that don't lead
  somewhere actionable.

## Accessibility & Clarity

- Every AI-generated or risk-derived statement must be visually
  distinguishable from a raw factual record (e.g., consistent labeling of
  "AI summary" vs. "source record"), so an officer never mistakes inference
  for fact.
- Color is never the sole carrier of risk severity — always paired with
  text/label.

## Related Documents

- [01_PROJECT_OVERVIEW.md](01_PROJECT_OVERVIEW.md)
- [../architecture/APPLICATION_FLOW.md](../architecture/APPLICATION_FLOW.md)
