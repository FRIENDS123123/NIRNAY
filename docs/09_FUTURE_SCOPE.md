# 09 — Future Scope

Items in this document are explicitly **out of scope** for the current
repository and its planned phases (see
[08_DEVELOPMENT_PLAN.md](08_DEVELOPMENT_PLAN.md)). They're recorded here so
the current architecture can be evaluated against where it would need to
extend — without pulling any of this work forward prematurely.

## Real Departmental Data Integration

Replacing synthetic `dept_*` tables with authenticated connectors to real
departmental systems, behind the same Citizen 360 Resolution Service
contract. This is the single largest future effort and is deliberately
designed for by keeping the resolution layer's input contract
(department-adapter → common record shape) stable regardless of whether the
source is a synthetic table or a live system.

This would require, at minimum: a formal data-sharing agreement per
department, a real identity-matching strategy beyond the demo's
name/DOB heuristics, a security review, and a compliance review — none of
which apply to a synthetic-data demonstration.

## Pluggable Department Adapters

Formalizing "add a department" into a defined adapter interface (source
connection, field mapping to the common record shape, identity-matching
strategy) so onboarding a new department doesn't require touching the
resolution or AI layers — only adding a new adapter implementation.

## Enterprise Identity & Access

- SSO / government IAM integration in place of the demo's seeded local
  accounts
- Finer-grained RBAC (e.g., department-scoped access, case-based access
  grants) beyond the demo's flat role model

## Audit & Compliance Export

- Formal audit export pipeline (e.g., to a SIEM or compliance archive)
- Retention policy enforcement on `platform_audit_log`
- Tamper-evidence (e.g., hash-chaining) on the audit log beyond
  application-level append-only enforcement

## Multi-Tenant Deployment

Supporting multiple departments/jurisdictions as isolated tenants against a
shared platform, with tenant-scoped data isolation — relevant only once this
moves beyond a single-deployment demo.

## Scale-Driven Architectural Changes

If real deployment scale ever warrants it: extracting the Citizen 360
Resolution Service and AI Engine (currently in-process modules, see
[02_SYSTEM_ARCHITECTURE.md](02_SYSTEM_ARCHITECTURE.md)) into independently
deployed services, and moving off SQLite to a production RDBMS. The schema
and module boundaries are written to make this a migration, not a rewrite —
but neither is undertaken until an actual scale requirement exists.

## Explicit Non-Goals (even long-term)

- NIRNAY does not aim to become a general-purpose BI/analytics platform —
  see [06_UI_GUIDELINES.md](06_UI_GUIDELINES.md). Future scope expands
  *integration depth* for the existing citizen-investigation flow, not the
  product's surface area into dashboards or graph exploration tooling.

## Related Documents

- [08_DEVELOPMENT_PLAN.md](08_DEVELOPMENT_PLAN.md)
- [02_SYSTEM_ARCHITECTURE.md](02_SYSTEM_ARCHITECTURE.md)
- [07_SECURITY.md](07_SECURITY.md)
