# AGENTS.md: POF OS — v2.0

Keep this file short. Detail lives in linked docs. If a request conflicts with this file, identify the conflict and stop the conflicting action. Continue safe, authorized work where separable. Never comply silently.

## 1. Mission
Build an independent, secure, resilient restaurant operating system owned and controlled by POF OS. Pilot: Plenty of Fish Seafood, Lancaster, CA. Clover, Menufy, and other external platforms are replaceable integrations, never core dependencies.

People: Technical lead Darryl Morning. Restaurant owner/partner Darren Cook. Engineering: AI-assisted development and Codex.

## 2. Priority order (when rules conflict)
1. Money correctness and payment safety
2. Security and customer/staff data protection
3. No loss or duplication of orders and tickets
4. Existing restaurant operations stay uninterrupted
5. Release gates and authority tiers
6. Accessibility and kitchen/counter usability
7. Test and evidence coverage
8. Schedule. Never bypass a gate to meet a date.

## 3. Source of truth
Read before consequential changes: this file, docs/POF_OS_MASTER.md, docs/ARCHITECTURE.md, docs/PILOT_GATE_MATRIX.md, docs/DECISION_LOG.md, current code and test evidence. Precedence: this file > DECISION_LOG > other docs. Mark superseded records; never delete audit history. Identify and create missing records within authorized scope; never invent prior decisions or evidence.

## 4. Authority tiers
| Tier | Scope | Rule |
|---|---|---|
| 1 Autonomous | Tests, docs, refactors inside one module, lint/type fixes, UI states, accessibility fixes, internal evidence | Do it; one-line entry in DEVELOPMENT_LEDGER |
| 2 Execute and report | Planned sprint scope, new endpoints/components inside approved architecture, migrations on dev/staging, sandbox payment work | Post a plan, implement, report |
| 3 Owner/lead approval | Production deploy, merge to main, production DB writes or migrations, live orders, real payments, live menu price changes, credential rotation, disabling Clover/Menufy, purchases or paid services, new dependencies, schema changes to money/order/payment tables, material architecture change, tax configuration changes | Stop and ask |

Exhaust Tier 1 and 2 options and document attempts before escalating. Never extend this authority to Tier 3.

## 5. Milestones (conditional on verified gates)
Dec 2, 2026 MacBook dev setup; Dec 18 functional software pilot; Dec 20 LA hardware install; Dec 23 on-site pilot; Jan 4–10, 2027 controlled production target. A date slips before a gate is skipped.

## 6. Stack
Existing: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma 6, PostgreSQL, Netlify, GitHub.
Target: Supabase Auth/Realtime, Ubuntu 24.04 edge server, IndexedDB offline storage, durable local order queue, ESC/POS printing service, certified payment processor adapter.
No new dependencies without Tier 3 approval and DECISION_LOG entry. Use existing lockfile; verify actual stack.
Known paths: app/, components/, lib/, prisma/schema.prisma, scripts/, public/. Confirm adapter, edge and test paths; read tree before creating files; no parallel implementations.

## 7. Architecture invariants
POF OS owns menu/pricing, orders/history, customers/consent, inventory/recipes, kitchen workflow, payment transaction records, delivery orchestration and financial reconciliation. External services connect only through adapters. Keep Clover and Menufy operational until separately approved cutover; preserve rollback and avoid duplicate fulfillment. Internal IDs are permanent and independent of provider IDs.
Modules: Order, POS, Kitchen, Menu, Edge, Dispatch, CRM, Finance, Inventory, Display, Intelligence (future).

## 8. Data, money, menu, payments
- Integer cents for all money. No floats or float-based libraries on money.
- Transactional financial writes; immutable order-price snapshots; auditable payments and refunds.
- Permanent internal IDs; external IDs as mappings; versioned migrations; non-destructive sync; explicit merchant/location boundaries; least privilege.
- One authoritative catalog feeds website, POS, kitchen and boards. Marketing fallback is display-only; never price checkout from it. Validate modifiers server-side and availability before payment. Record effective-dated tax configuration and preserve historical pricing.
- Never store raw card numbers or CVV. Use processor APIs and certified terminals. Idempotency on every financial operation; verify webhook authenticity; prevent duplicate charges; reconcile payments, refunds and settlements. Never mark paid without verified evidence. Offline card payments only where processor supports them.

## 9. Kitchen and offline operations
Persist orders durably before acknowledgment. Unique order and ticket IDs; no duplicate tickets. Track acceptance and completion. Recover from printer failure. Support local cash ordering during WAN outages and sync queued transactions after recovery. Use durable outbox/inbox records and reconcile ambiguous printer outcomes before reprinting; physical exactly-once delivery cannot be assumed. Never silently discard failures; surface them and retain retry/dead-letter records.

## 10. Security
RBAC with separate cashier, kitchen and manager privileges; server-side validation; secure sessions; rate limiting; audit logging; secrets only in secret management, never source or logs; encrypted transport; no public exposure of local infrastructure; VPN for remote admin.

## 11. UI and design governance
Applies to Order, POS, Kitchen, Menu, Display. Full rules: docs/design/DESIGN-GOVERNANCE.md (tokens, type scale, components).
- Tailwind design tokens only; no hardcoded colors, spacing or sizes.
- WCAG 2.2 AA minimum; keyboard operable, visible focus, labels, contrast, reduced motion.
- Counter/kitchen touch targets at least 44px (larger for POS actions), no hover-dependent actions, readable at distance, high contrast for glare, no accidental double-tap submissions.
- Every screen has loading, empty, error, success and offline states.
- Financial/destructive actions require confirmation and role gating.
- Reuse existing components; new components or deviations need a plan and DECISION_LOG entry.

## 12. Verification
Existing commands in order: npm ci; npm run lint; npx tsc --noEmit; npx prisma validate; npm run build.
Confirm exact unit, integration, e2e, payment sandbox, migration, offline recovery and security regression commands. A layer without a command is NOT TESTED.
1. Report only executed commands with output; never use mock data as production evidence. Isolated fixtures and sandbox credentials; never test production by default.
2. Type/lint/build passing does not establish readiness. UI changes require real browser runs; money/order/offline changes require executed failure-path tests.
3. CI success is not deployment success. Branch pushes may trigger previews; verify deployment policy before pushing. Deployment requires immutable provider ID, matching commit SHA, live endpoint and passing post-deploy checks. Skipped external steps are BLOCKED_EXTERNAL.
4. Validate external constraints locally before provider calls; add permanent regression tests.
5. Every bug gets a regression test before the fix is done.

## 13. Mechanical enforcement
Build checks for float arithmetic in money paths; checkout fallback exclusion; payment idempotency; duplicate tickets across retries/restarts; migration test and DECISION_LOG entry for money/order/payment table changes; CI secret scanning; accessibility checks (axe or Playwright). These are required, not presumed implemented.

## 14. Pilot acceptance gates
100% approved pilot items; 100 successful simulated orders; zero duplicate charges; zero lost or duplicate kitchen orders; exact pricing/tax reconciliation; 30 consecutive successful physical tickets; refunds/cancellations pass; WAN outage/recovery and server restart tested; zero unexplained financial variance; owner/staff approval. Track in docs/PILOT_GATE_MATRIX.md.

## 15. Sprints
00 Architecture/governance; 01 Menu; 02 Order; 03 Website checkout; 04 Payment; 05 Kitchen; 06 Counter POS; 07 Edge/printing; 08 On-site install/QA; 09 Controlled pilot.
Each sprint requires scope, acceptance criteria, evidence, tests, blockers, time/cost and GO/NO-GO. Record actual human hours, estimated engineering effort, cash paid and imputed labor separately; estimates are not invoices or verified time.

## 16. Production protection
Existing restaurant operations stay uninterrupted. Tier 3 actions require explicit approval; list is not exhaustive of security, privacy or financial safety restrictions. Implementation completion is not release approval.

## 17. Workflow
Restate task and applicable tier/rules. Post plan for Tier 2/3 or nontrivial work; wait for Tier 3 approval. Inspect existing code first. Use feature branches and small reviewable changes. Implement, run checks, self-review against section 19, report.

## 18. Reporting
Tier 1: one line (what, evidence) in DEVELOPMENT_LEDGER. Tier 2/sprint: GO/NO-GO, completed work, files changed, executed tests/results, blockers, effort estimate, next actions, owner actions. Report only remaining owner attention items; avoid repetitive status.

## 19. Definition of done
Acceptance criteria met; executed tests passed with output; money/order/offline failure-path tests; security review and no secrets in code/logs; accessibility and states checklist for UI; master records updated; evidence recorded; risks disclosed; required approvals obtained.

## 20. Status vocabulary
PASS: reproducible evidence. PARTIAL: some evidence. FAIL: failed test or directly demonstrated source defect (label runtime/static). BLOCKED: cannot proceed. BLOCKED_EXTERNAL: credentials/hardware/provider required. NOT TESTED: no evidence. UNKNOWN: cannot determine. No vague substitutes. Code existence alone is not readiness.

## 21. Master records
docs/POF_OS_MASTER.md, docs/ARCHITECTURE.md, docs/MASTER_SPRINT_PLAN.md, docs/PILOT_GATE_MATRIX.md, docs/HARDWARE_BOM.md, docs/DEVELOPMENT_LEDGER.md, docs/DECISION_LOG.md, docs/OWNER_ACTIONS.md, docs/engineering/EXAMPLES.md. Update relevant records on material decisions; preserve history.

## 22. Failure log
When an agent violates a standard, add the same day a rule, good/bad example in docs/engineering/EXAMPLES.md, and where possible an automated check.
