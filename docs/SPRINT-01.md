# POF OS — Sprint 01: Clover Menu Readiness

Date: 2026-11-18
Branch: `feature/sprint-01-clover-menu`
Status: AUDIT COMPLETE / NO-GO for production direct checkout

## Objective
Establish a verified, non-destructive Clover menu foundation for direct ordering. No production mutations, live orders, deployment or merge authorized.

## Scope
Clover OAuth and merchant connection; catalog fetch/import; real item/category/modifier IDs; database integrity; pricing, availability and tax; menu API provenance; checkout mapping and kitchen handoff readiness.

## Status vocabulary
PASS = demonstrated source feature or test evidence; PARTIAL = implementation exists but unverified; FAIL = confirmed unsafe or incorrect behavior; UNKNOWN = insufficient evidence; BLOCKED_EXTERNAL = requires merchant/provider/restaurant access.

## Initial decision
NO-GO: importer deletes existing menu data, synthetic IDs are used, the public menu can fall back to curated content, and no end-to-end paid Clover-to-kitchen transaction is verified.

## Deliverables
- `docs/CLOVER_READINESS_AUDIT.md`
- `docs/MENU_MAPPING_GAPS.md`
- `docs/SPRINT-01_EXECUTION_PLAN.md`

## Owner evidence required
Approved Clover merchant and catalog snapshot; item/modifier/tax reconciliation; kitchen printer/KDS configuration; supervised sandbox test access. Never exchange secrets over email.

## Exit criteria
All orderable items and modifiers mapped to real Clover IDs; importer idempotent and non-destructive; authoritative checkout pricing and tax; tests and live merchant evidence; explicit GO/NO-GO approval.

## Audit limitations
GitHub source review only. No runtime tests, Clover API calls, production database reads, migrations or deployments performed.