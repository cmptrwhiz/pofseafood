# Menu Mapping Gaps
Date: 2026-11-18
Status: NO-GO for production order-line creation

## Confirmed gaps
| Gap | Status | Evidence | Remediation |
|---|---|---|---|
| Synthetic category IDs | FAIL | `scripts/import_clover_export.mjs`: `makeImportedId("category",...)` | Capture real Clover category IDs; preserve separate internal IDs. |
| Synthetic modifier group IDs | FAIL | `makeImportedId("modifier-group",...)` | Map actual Clover modifier group IDs and item-group associations. |
| Synthetic modifier IDs | FAIL | `makeImportedId("modifier",...)` | Preserve real Clover modifier IDs and price deltas. |
| Missing item IDs | FAIL | `item.sourceId || makeImportedId("item",...)` | Mark unmapped items non-orderable until verified. |
| Destructive import | FAIL | Four `deleteMany` operations | Implement staged validation and merchant-scoped upserts with explicit retirement policy. |
| Name-based deduplication | PARTIAL | `app/api/menu/route.ts` dedupes by normalized name | Preserve distinct Clover variants using IDs. |
| Modifier selection data in API | FAIL | Display API returns name/desc/price/img, not modifier IDs or min/max | Provide separate authoritative checkout catalog endpoint. |
| Availability freshness | UNKNOWN | DB availability exists; live sync coverage not demonstrated | Verify inventory/availability policies and freshness TTL. |
| Taxes and fees | UNKNOWN | Export parser detects tax rows, importer reports counts; authoritative checkout tax rules not established | Map Clover tax assignments and validate jurisdiction/fulfillment rules. |
| Live merchant scope | UNKNOWN | API selects most recently synced/created merchant | Explicitly bind production checkout to approved merchant configuration. |

## Required menu-master fields
internal item ID, Clover merchant ID, real Clover item ID, real category ID(s), display category, name, price cents, active/available flags, tax assignment, modifier group IDs, option IDs, min/max constraints, price deltas, verified_at, source, owner approval and exception status.

## Fail-closed rules
- No synthetic `imported-*` ID in a paid order.
- No missing modifier mappings.
- No fallback price used to calculate checkout.
- No stale/unverified tax assignment or merchant ambiguity.
- No silent deletion or recreation of approved mappings.

## External evidence needed
Owner-approved Clover catalog export or read-only API snapshot, item/modifier ID reconciliation, actual POS pricing and tax configuration, and kitchen routing demonstration.
