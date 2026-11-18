# Clover Menu Readiness — Read-only source audit
Date: 2026-11-18
Repository: cmptrwhiz/pofseafood
Method: GitHub source inspection only. No runtime tests, credentials, database reads, Clover API calls or live orders performed.

| Component | Status | Evidence and finding |
|---|---|---|
| Prisma schema | PASS | `prisma/schema.prisma` defines MerchantConnection, MenuCategory, MenuItem, ModifierGroup, ModifierOption and SyncEvent with merchant-scoped uniqueness for several Clover IDs. Schema existence only; migration/runtime health unverified. |
| Clover OAuth implementation | PARTIAL | `lib/clover.ts` builds install URL and exchanges code for tokens; live OAuth/permissions and refresh lifecycle not tested. |
| Merchant profile fetch | PARTIAL | `lib/clover.ts` implements authenticated GET merchant profile; live connection unverified. |
| Menu snapshot fetch | PARTIAL | `lib/clover.ts` fetches categories and items with limited 429 retries; full pagination, modifiers, tax rates and availability completeness not established from inspected function. |
| Import safety | FAIL | `scripts/import_clover_export.mjs` calls deleteMany on modifiers, groups, items and categories before upserting. Can destroy references and manual curation. |
| Identifier fidelity | FAIL | `makeImportedId()` creates synthetic category, modifier-group and modifier IDs, and fallback item IDs. Not valid for direct Clover order-line mapping. |
| Modifier associations | PARTIAL | Importer matches group by name, creates groups/options, and uses imported IDs; identity and ordering constraints require reconciliation. |
| Menu API | PARTIAL | `app/api/menu/route.ts` reads Prisma records, but falls back to curated/static menu and inserts promotional categories; output loses Clover item IDs and modifier structures. |
| Checkout price/tax authority | FAIL | Inspected menu response provides formatted display prices, not a verified checkout quote with authoritative tax and modifiers. |
| Merchant token storage | PARTIAL | `MerchantConnection.accessToken` stored as String; encryption, rotation, access restrictions and log redaction require audit. |
| Order-write and kitchen routing | UNKNOWN | Not proven by inspected source; requires repository-wide search, sandbox tests and restaurant hardware confirmation. |
| Database migration health | UNKNOWN | No migration application or live database validation performed. |
| Automated test coverage | UNKNOWN | No test execution performed; repository-wide test inventory still required. |
| Netlify deployment config | PASS | `netlify.toml` invokes npm run build, publish .next and Next.js plugin. Not a successful build certification. |

## Key risks
1. Existing catalog rows are deleted on import.
2. Synthetic IDs may be mistaken for Clover IDs.
3. Menu source labeled `clover` can represent imported data rather than a fresh verified live snapshot.
4. Static fallback/curated promotional prices are unsuitable for paid checkout.
5. Name-based deduplication may collapse legitimately distinct Clover items.
6. Tax and delivery fee treatment require independently verified checkout rules.
7. Clover order write, kitchen printing and payment reconciliation have no verified end-to-end evidence in this audit.

## Restrictions
Do not run the importer against production. Do not enable paid checkout from the fallback API. Do not modify production credentials, data, pricing or orders.

## Audit limitations
This is a preliminary code-based audit, not exhaustive repository/test coverage. PASS means the stated source feature exists, not that a live service passed a test.
