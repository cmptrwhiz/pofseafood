# Sprint 01 — Proposed Execution Plan (Not Yet Implemented)
Date: 2026-11-18
Status: Awaiting owner/engineering review

## P0 — Safety and provenance
1. Add regression tests proving the existing importer is destructive; prohibit production execution pending replacement.
2. Build dry-run reconciliation report: added/changed/retired/unmapped records; no writes.
3. Replace synthetic Clover IDs with real source IDs or explicitly flagged unmapped records.
4. Separate internal database IDs from Clover external IDs and enforce orderability checks.

## P1 — Safe synchronization
5. Implement staged, transactional, idempotent merchant-scoped upserts; preserve record identity, curation and associations.
6. Handle pagination and Clover catalog entities including modifier groups/options, availability and tax assignments.
7. Verify two consecutive imports cause zero unnecessary writes, duplicates or deletions.
8. Document merchant OAuth permissions, token storage/refresh and access control.

## P1 — Checkout authority
9. Add server-only checkout catalog/quote contract keyed by Clover IDs, with modifier min/max validation, authoritative price and tax calculation.
10. Fail closed on unavailable/unmapped items, stale data or unresolved tax rules; keep marketing fallback separate.
11. Confirm order-write API and kitchen printer/KDS routing in sandbox before any production pilot.

## P2 — Test and sign-off
12. Inventory tests, migrations and CI; run lint, build, schema and import fixture tests.
13. Reconcile all catalog records against owner-approved Clover source.
14. Publish PASS/PARTIAL/FAIL/UNKNOWN/BLOCKED_EXTERNAL evidence and GO/NO-GO.
15. Request Darren's approval for pricing, menu exceptions, taxes, kitchen equipment and supervised test schedule.

## Proposed acceptance tests
- Real IDs for 100% of orderable items, groups and options.
- Repeat import yields no unintended deletes or identity churn.
- Checkout quote never uses curated/fallback pricing.
- Server rejects invalid item, modifier, quantity, merchant or tax context.
- No live order or production change until separate authorization.

## Work authorization boundary
This plan proposes changes only. No implementation, deployment, live order, database mutation or merge is authorized by this audit.
