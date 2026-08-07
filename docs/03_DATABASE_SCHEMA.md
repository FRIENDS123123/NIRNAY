# 03 — Database Schema

SQLite, single file, synthetic data only. This document defines the schema
**shape** as the contract for implementation; exact column types will be
finalized as SQL migrations in `backend/` during the implementation phase.

Entity relationships are diagrammed in
[../architecture/DATABASE_RELATIONS.md](../architecture/DATABASE_RELATIONS.md).

## Naming Convention

- `dept_<department>_<entity>` — raw synthetic department source tables.
  These are the "fragmented" data NIRNAY unifies. Never read directly by the
  AI engine or the frontend.
- `citizen_*` — platform-owned resolved/aggregate tables, built from
  department tables by the Citizen 360 Resolution Service.
- `platform_*` — application concerns unrelated to citizen data (officers,
  audit log, sessions, reports).

## Department Source Tables (synthetic)

### `dept_identity_record`
The base identity registry. Every citizen originates here.
| Column | Notes |
|---|---|
| `identity_id` | PK |
| `full_name` | |
| `date_of_birth` | |
| `gender` | |
| `national_id_number` | synthetic, format-valid, not a real ID scheme |
| `address_line` | |
| `photo_ref` | pointer to synthetic mock asset |

### `dept_property_record`
Registered property/asset declarations.
| Column | Notes |
|---|---|
| `property_id` | PK |
| `identity_id` | FK → `dept_identity_record`, nullable (unresolved records allowed — reflects real-world data quality) |
| `owner_name_raw` | as recorded by the department, may not exactly match identity name |
| `property_type` | land / residential / commercial / vehicle |
| `declared_value` | |
| `registration_date` | |

### `dept_tax_record`
Tax filing history.
| Column | Notes |
|---|---|
| `tax_record_id` | PK |
| `identity_id` | FK, nullable |
| `filing_year` | |
| `declared_income` | |
| `filing_status` | filed / overdue / under_review |

### `dept_legal_record`
Legal case references.
| Column | Notes |
|---|---|
| `legal_case_id` | PK |
| `identity_id` | FK, nullable |
| `case_type` | civil / criminal / regulatory |
| `case_status` | open / closed / dismissed |
| `filed_date` | |
| `summary` | short synthetic case description |

### `dept_license_record`
Licenses and permits.
| Column | Notes |
|---|---|
| `license_id` | PK |
| `identity_id` | FK, nullable |
| `license_type` | driving / professional / business |
| `issue_date` | |
| `expiry_date` | |
| `status` | active / expired / revoked |

### `dept_welfare_record`
Welfare/benefit enrollment.
| Column | Notes |
|---|---|
| `welfare_id` | PK |
| `identity_id` | FK, nullable |
| `scheme_name` | synthetic scheme name |
| `enrollment_date` | |
| `status` | active / inactive |

### `dept_document_record`
Issued government documents (reference metadata only — synthetic, no real
document content).
| Column | Notes |
|---|---|
| `document_id` | PK |
| `identity_id` | FK, nullable |
| `document_type` | e.g. passport, address proof, income certificate |
| `issuing_authority` | synthetic authority name |
| `issue_date` | |
| `verification_status` | verified / unverified |

## Resolved / Platform Tables

### `citizen_profile`
The canonical, resolved output of the Citizen 360 Resolution Service. One row
per resolved citizen.
| Column | Notes |
|---|---|
| `citizen_id` | PK, platform-generated, stable identifier |
| `identity_id` | FK → `dept_identity_record` |
| `resolved_at` | last resolution timestamp |
| `resolution_confidence` | aggregate match confidence across linked records |

### `citizen_record_link`
Explicit, auditable mapping from a resolved citizen to every department
record attributed to them — this table *is* the correlation, made
inspectable.
| Column | Notes |
|---|---|
| `link_id` | PK |
| `citizen_id` | FK → `citizen_profile` |
| `source_table` | e.g. `dept_property_record` |
| `source_record_id` | |
| `match_confidence` | how the link was established (exact ID / name+DOB match / etc.) |
| `match_basis` | short human-readable explanation |

### `platform_officer`
Authorized officer accounts (demo auth — see
[07_SECURITY.md](07_SECURITY.md)).
| Column | Notes |
|---|---|
| `officer_id` | PK |
| `full_name` | |
| `role` | RBAC role, see 07_SECURITY.md |
| `department` | officer's home department, for context only |

### `platform_audit_log`
Immutable append-only log of every citizen-data access.
| Column | Notes |
|---|---|
| `audit_id` | PK |
| `officer_id` | FK |
| `citizen_id` | FK, nullable (null for search-only events with no match) |
| `action` | search / view_profile / ai_query / view_evidence / generate_report |
| `timestamp` | |
| `context` | free-text reason/query, for traceability |

### `platform_intelligence_report`
Generated reports, stored for retrieval/export.
| Column | Notes |
|---|---|
| `report_id` | PK |
| `citizen_id` | FK |
| `generated_by` | FK → `platform_officer` |
| `generated_at` | |
| `content` | structured report body (see [04_AI_ENGINE.md](04_AI_ENGINE.md)) |
| `risk_summary` | denormalized snapshot of risk assessment at generation time |

## Design Notes

- **Nullable FKs on department tables are intentional.** Real departmental
  data is often only partially linkable; NIRNAY's resolution layer must
  reflect that honestly rather than assuming perfect joins.
- **`citizen_record_link` is the audit trail for correlation itself** — this
  is what makes "why does the system think this property belongs to this
  person" an answerable question, not a black box.
- **No table is ever deleted from, only appended to**, for `platform_audit_log`
  — audit integrity requires this even in the demo.

## Related Documents

- [../architecture/DATABASE_RELATIONS.md](../architecture/DATABASE_RELATIONS.md)
- [05_DATA_FLOW.md](05_DATA_FLOW.md)
- [07_SECURITY.md](07_SECURITY.md)
