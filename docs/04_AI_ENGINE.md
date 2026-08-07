# 04 — AI Engine

## Principle

The AI Engine is a **narrow, scoped tool operating on already-resolved,
already-attributable data** — not an open-ended agent with database access.
It never queries `dept_*` tables directly and never fabricates facts that
don't trace to a specific record in the resolved Citizen 360 profile.

## Integration Model

- Target: any **OpenAI-compatible chat completions API**. No vendor-specific
  SDK dependency in application code — one thin client wrapper in the backend
  isolates the integration point.
- Model choice (hosted or self-hosted) is a deployment-time configuration
  decision, not an architectural one. See open question in
  [../ENGINEERING_NOTES.md](../ENGINEERING_NOTES.md).
- All prompts are constructed server-side from the resolved profile shape.
  The frontend never constructs prompts or calls the LLM directly.

## The Three Scoped Functions

### 1. AI Citizen Summary
Input: a citizen's resolved profile (`citizen_profile` + all linked records
via `citizen_record_link`).
Output: a short, plain-language brief an officer can read in seconds —
who this citizen is, what departments have records on them, and anything
notably unusual (an open legal case, a lapsed license, an income/property
mismatch) — each claim tagged with the record it came from.
This is a **summarization** task, not a reasoning task: the model is not
asked to draw conclusions the underlying data doesn't already show.

### 2. AI Investigation Assistant
A conversational interface scoped to a single citizen's resolved profile for
the duration of the session. An officer can ask follow-up questions ("does
this person have any property outside their declared address?"). The
assistant:
- Only answers from the resolved profile + linked evidence passed into its
  context — it does not have open-ended tool access to the database
- Cites the specific record(s) behind every factual claim
- Explicitly declines to speculate beyond what the data supports

### 3. Intelligence Report Generation
Given the resolved profile, the AI investigation session's key findings, and
the risk assessment output, produces a structured report (summary, linked
records reviewed, risk signals with rationale, and space for officer notes)
suitable for export. The report generator does not introduce any new claims
beyond what was already surfaced in the summary, investigation, or risk
steps — its job is synthesis and formatting, not new analysis.

## What the AI Engine Explicitly Does Not Do

- Does not perform the citizen record correlation itself — that's the
  Resolution Service's job (deterministic, auditable, not model-dependent)
- Does not compute the Risk Assessment score — see below
- Does not have direct database or tool-call access to `dept_*` tables
- Does not persist conversation history beyond the officer's active session
  (session-scoped context, not a long-term memory store)

## Risk Assessment — Deliberately Not Pure-LLM

Risk Assessment (see [../PROJECT_BLUEPRINT.md](../PROJECT_BLUEPRINT.md) flow)
is implemented as **explainable rule-based signals** (e.g., "open legal case
+ lapsed license" → flagged combination), each with a named rule and the
record(s) that triggered it. The AI Engine may be used to *phrase* the
explanation in natural language, but the underlying signal is deterministic
and inspectable — never an opaque model-generated score. This is a hard
constraint: a government decision-support signal must be defensible on
request.

## Attribution Requirement

Every AI-generated sentence that states a fact about a citizen must be
traceable to a `citizen_record_link` entry. This is enforced structurally by
only ever passing the model already-attributed, already-resolved data plus a
system prompt requiring inline citation — not by trusting the model to
self-police.

## Related Documents

- [02_SYSTEM_ARCHITECTURE.md](02_SYSTEM_ARCHITECTURE.md)
- [03_DATABASE_SCHEMA.md](03_DATABASE_SCHEMA.md)
- [05_DATA_FLOW.md](05_DATA_FLOW.md)
