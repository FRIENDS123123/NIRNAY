# Application Flow

Screen-by-screen walkthrough of the primary user flow, mapped to the
components in [COMPONENT_DIAGRAM.md](COMPONENT_DIAGRAM.md).

## Flow Diagram

```
┌────────────┐   search query    ┌──────────────────────┐
│ SearchView │ ─────────────────▶│ SearchResultList       │
└────────────┘                   └───────────┬───────────┘
                                              │ officer selects a candidate
                                              ▼
                                  ┌──────────────────────────┐
                                  │ CitizenProfileView          │
                                  │ (resolved, correlated)      │
                                  └───────────┬──────────────────┘
                                              │ officer opens AI panel
                                              ▼
                                  ┌──────────────────────────┐
                                  │ InvestigationPanel          │
                                  │ (cited Q&A)                 │
                                  └───────────┬──────────────────┘
                                              │ officer clicks a citation
                                              ▼
                                  ┌──────────────────────────┐
                                  │ EvidenceView                │
                                  │ (raw source record)         │
                                  └───────────┬──────────────────┘
                                              │ officer returns to profile,
                                              │ reviews risk
                                              ▼
                                  ┌──────────────────────────┐
                                  │ RiskAssessmentView           │
                                  │ (explainable signals)        │
                                  └───────────┬──────────────────┘
                                              │ officer generates report
                                              ▼
                                  ┌──────────────────────────┐
                                  │ ReportView                   │
                                  │ (generated, exportable)      │
                                  └───────────────────────────────┘
```

## Entry & Exit Points

- **Entry**: the application always opens on `SearchView`. There is no other
  landing page, dashboard, or home screen.
- **Exit / loop-back**: from any screen, an officer can return to
  `SearchView` to begin investigating a different citizen. `EvidenceView`
  always returns to the screen the citation was clicked from (profile or
  investigation panel) — it is never a dead end.

## Non-Linearity, By Design

While the flow above is the primary path, it is not a rigid wizard:
- An officer can jump from `CitizenProfileView` straight to
  `RiskAssessmentView` without opening `InvestigationPanel` first, if they
  don't need AI assistance for a straightforward case.
- `EvidenceView` is reachable from *any* citation, in the profile, the AI
  panel, or the risk panel — it's a shared drill-down, not a flow step you
  must pass through in sequence.
- `ReportView` generation pulls from whatever state exists (profile + any
  investigation findings + risk signals) at the time it's triggered — an
  officer is never forced to "complete" every step before generating a
  report.

What's fixed is the *set* of screens and their relationships — not a forced
linear wizard.

## Related Documents

- [COMPONENT_DIAGRAM.md](COMPONENT_DIAGRAM.md)
- [SEQUENCE_DIAGRAM.md](SEQUENCE_DIAGRAM.md)
- [../docs/06_UI_GUIDELINES.md](../docs/06_UI_GUIDELINES.md)
