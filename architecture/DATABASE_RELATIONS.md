# Database Relations

Entity-relationship reference for the schema defined in
[../docs/03_DATABASE_SCHEMA.md](../docs/03_DATABASE_SCHEMA.md).

## Entity-Relationship Diagram

```
dept_identity_record ──┐
                        │ 1
dept_property_record ───┤
                        │
dept_tax_record ────────┤
                        │ 0..1 (nullable FK, resolved via)
dept_legal_record ──────┼──────────────▶ citizen_record_link ──────▶ citizen_profile
                        │                  (source_table,               │ 1
dept_license_record ────┤                   source_record_id,           │
                        │                   match_confidence,           │ 1
dept_welfare_record ────┤                   match_basis)                │
                        │                                                ▼
dept_document_record ───┘                                        platform_audit_log
                                                                          ▲
                                                                          │ many
                                                                   platform_officer
                                                                          │
                                                                          │ 1
                                                                          ▼
                                                          platform_intelligence_report
                                                             (citizen_id, generated_by)
```

## Relationship Detail

| From | To | Cardinality | Notes |
|---|---|---|---|
| `dept_identity_record` | `citizen_profile` | 1 → 0..1 | An identity record may not yet be resolved into a citizen profile (e.g., newly seeded, unprocessed) |
| `dept_property_record` | `citizen_record_link` | 0..n → 0..1 | A property record links to at most one citizen; a citizen may have many linked property records |
| `dept_tax_record` | `citizen_record_link` | 0..n → 0..1 | Same pattern as property |
| `dept_legal_record` | `citizen_record_link` | 0..n → 0..1 | Same pattern |
| `dept_license_record` | `citizen_record_link` | 0..n → 0..1 | Same pattern |
| `dept_welfare_record` | `citizen_record_link` | 0..n → 0..1 | Same pattern |
| `dept_document_record` | `citizen_record_link` | 0..n → 0..1 | Same pattern |
| `citizen_record_link` | `citizen_profile` | n → 1 | Every link belongs to exactly one resolved citizen |
| `citizen_profile` | `platform_intelligence_report` | 1 → 0..n | A citizen may have multiple reports generated over time |
| `platform_officer` | `platform_audit_log` | 1 → 0..n | Every audit entry is attributed to exactly one officer |
| `platform_officer` | `platform_intelligence_report` | 1 → 0..n | Every report records who generated it |
| `citizen_profile` | `platform_audit_log` | 0..1 → 0..n | Audit entries reference a citizen when applicable (search-only events may have none) |

## Why `citizen_record_link` Is Its Own Table

This is the one modeling decision worth calling out explicitly: department
tables do **not** carry a direct, unconditional `citizen_id` foreign key.
Instead, every department-to-citizen relationship is mediated through
`citizen_record_link`, which also carries *how confidently* and *on what
basis* that link was established.

This matters because real-world department data (and this schema's synthetic
data deliberately mirrors that reality) is not always cleanly resolvable —
name variants, missing IDs, and partial matches are the norm, not the
exception. Modeling the link as its own first-class, evidence-bearing entity
means:

- A record can exist in the system before it's ever successfully linked to a
  citizen (nullable FK on the department table itself, as a fallback/legacy
  path — see [../docs/03_DATABASE_SCHEMA.md](../docs/03_DATABASE_SCHEMA.md))
- The confidence and basis of every correlation is queryable and can be shown
  to the officer (this is what powers the Evidence step's
  "match_confidence" display — see
  [../docs/05_DATA_FLOW.md](../docs/05_DATA_FLOW.md))
- Re-resolution (if source data changes) updates `citizen_record_link`
  without mutating department source tables

## Related Documents

- [../docs/03_DATABASE_SCHEMA.md](../docs/03_DATABASE_SCHEMA.md)
- [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md)
