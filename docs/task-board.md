# Task board — Alshorouk website

Phases 0–8 follow spec §15; gates are defined in `docs/quality-gates.md`; human inputs live in `docs/open-items.md` (OI-xx); roles and execution model in `docs/agent-operating-model.md`.

_Last updated: 2026-10-09 (PM / technical-architect subagent). Maintained by the Orchestrator — subagents propose status changes in their reports; only the Orchestrator edits this board._

**Status values:** `done` (finished and evidenced) · `in_progress` (actively being worked or delivered and awaiting orchestrator review) · `pending` (not started) · `blocked` (cannot proceed without an external input — cites an OI).
**Owner roles** are the spec §13 roles; each is executed by a Claude Code workflow subagent or by the Orchestrator itself (Claude Code main session).

## Snapshot (2026-10-09)

| Phase | done | in_progress | pending | blocked | Gate |
|---|---|---|---|---|---|
| 0 Environment reconnaissance | 5 | 2 | 1 | 0 | G0 in review |
| 1 Research & blueprint | 0 | 4 | 3 | 0 | — |
| 2 Design + motion plan | 0 | 1 | 5 | 0 | — |
| 3 Foundation | 0 | 2 | 7 | 2 | — |
| 4 Hero + signature homepage | 0 | 0 | 13 | 0 | — |
| 5 Interior pages + conversion | 0 | 0 | 12 | 0 | — |
| 6 Content, SEO, a11y, performance | 0 | 0 | 9 | 0 | — |
| 7 Browser testing & iteration | 0 | 0 | 8 | 0 | — |
| 8 Release handoff | 0 | 0 | 7 | 1 | — |

**Now:** discovery workflow (reference audit, photography, brand audit, skills, copy) · app scaffolding · art-direction brief v1 (`docs/art-direction.md`) issued for build agents.
**Next:** Gate 0 review → site map + architecture docs → Gate 1 → motion storyboard → Gate 2.
**Blocked:** licensed Thmanyah integration (OI-01) · PostgreSQL migration verification (OI-12) · deployment (OI-12, OI-16).

---

## Phase 0 — Environment reconnaissance

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P0-01 | Read the full master spec (1,087 lines) | Orchestrator | done | — | spec §0–21 read; referenced throughout `AGENTS.md` |
| P0-02 | Read the brand PDF — all 21 pages as images and text | Orchestrator / Brand Guardian | done | — | page renders + text in the session scratchpad (not in repo) |
| P0-03 | Environment check: Node 22, pnpm 9, Python 3.13 (PyMuPDF, Pillow), Playwright 1.64 + Chromium, Chrome, Edge; no Docker, no PostgreSQL; Antigravity not used | Orchestrator | done | — | `docs/agent-operating-model.md` § Environment |
| P0-04 | Extract logo vectors from the PDF (p.3 full colour; p.9 white, black) and pixel-verify | Brand Guardian | done | P0-02 | `public/brand/*.svg`, `public/brand/extraction-meta.json` |
| P0-05 | Write `AGENTS.md` (+ `CLAUDE.md` import for Claude Code) | Orchestrator | done | P0-01, P0-02 | `AGENTS.md`, `CLAUDE.md` |
| P0-06 | 13 project skills in `.agents/skills/<name>/SKILL.md` | Orchestrator (PM/architect subagent) | in_progress | P0-01, P0-02, P0-05 | 13 files delivered; structure check 13/13 OK; awaiting orchestrator review |
| P0-07 | Process docs: task board, open items, quality gates, agent operating model | Orchestrator (PM/architect subagent) | in_progress | P0-01, P0-03 | `docs/task-board.md`, `docs/open-items.md`, `docs/quality-gates.md`, `docs/agent-operating-model.md` delivered; awaiting review |
| P0-08 | Gate 0 review | Orchestrator | pending | P0-06, P0-07 | `docs/quality-gates.md` G0.1–G0.9, `docs/evidence/gate-0/` |

## Phase 1 — Research & blueprint

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P1-01 | Reference audit: 4 sites × desktop + mobile, ≥ 6 motion ideas, do-not-transfer list | Research Analyst | in_progress | P0-03 | `docs/reference-audit.md`, `.reference/` (internal) |
| P1-02 | Brand audit: tokens, logo provenance + hashes, contrast matrix, banned PDF content, gaps | Brand Guardian | in_progress | P0-02, P0-04 | `docs/brand-audit.md` (delivered; awaiting orchestrator review) |
| P1-03 | Photography: licensed poultry stock, segment-correct, provenance recorded | Visual Designer + Brand Guardian | in_progress | P0-02 | `docs/image-provenance.md`, `src/content/photos.ts` |
| P1-04 | Arabic-first copy, English draft, glossary, claims matrix + approval register | Arabic Copywriter & Localizer | in_progress | P0-01 | `src/i18n/dictionaries/{ar,en}/*`, `docs/copy-glossary.md`, `content/approval-register.md` |
| P1-05 | Site map, route list, navigation, mobile nav plan, 3 customer journeys (≤ 3 actions to contact) | UX / Information Architect | pending | P0-01, P1-04 | `docs/site-map.md` |
| P1-06 | Architecture + CMS contract: versions, SQLite-dev/PostgreSQL-prod, collections, access model, deployment needs and costs | Frontend Architect + CMS Engineer | pending | P3-01 | `docs/architecture.md` |
| P1-07 | Gate 1 review (incl. content scans clean) | Orchestrator | pending | P1-01 … P1-06 | G1.1–G1.8 evidence |

## Phase 2 — High-fidelity design + motion plan

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P2-01 | Art direction per scene and page family; motif map; CTA/contrast treatments | Visual Product Designer / Orchestrator | in_progress | P1-01, P1-02, P1-03 | `docs/art-direction.md` v1 brief exists (binding for build agents); confirm at Gate 2 |
| P2-02 | Homepage coded prototype at 1440 and 390 with real copy and licensed imagery | Visual Designer + Frontend Architect | pending | P2-01, P3-05 | screenshots `screenshots/<date>/ar/home/*` |
| P2-03 | Interior page families: about, segment, catalogue + detail, contact | Visual Designer | pending | P2-01 | screenshots |
| P2-04 | Motion storyboard: scenes 0–11 + six signature moments with reduced-motion plans | Motion Director | pending | P2-01, P1-01 | `docs/motion-storyboard.md` |
| P2-05 | Major states: empty catalogue, filtered-empty, loading, error, form states, 404 | Visual Designer | pending | P2-01 | screenshots `…/states/*` |
| P2-06 | Gate 2 review: token sign-off before global CSS changes; storyboard approval | Orchestrator | pending | P2-01 … P2-05 | G2.1–G2.7 |

## Phase 3 — Foundation

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P3-01 | Scaffold Next.js 16 + React 19 + TS strict + Tailwind 4 + Payload 3.90 (SQLite dev, PostgreSQL by `DATABASE_URL`), tooling scripts | Orchestrator | in_progress | P0-03 | `package.json`, `src/payload.config.ts`, `src/app/(payload)/*` (started in parallel with discovery) |
| P3-02 | Payload schema: collections, globals, approval guard, RBAC (admin/editor/sales + `canApprove`), revalidation hooks | Orchestrator + CMS Engineer | in_progress | P3-01 | `src/payload/**` |
| P3-03 | Tokens (`@theme`), fonts (Montserrat + staging Arabic fallback), `<Logo>` — sign-off against the brand audit | Brand Guardian + Frontend Architect | pending | P1-02, P3-01 | `src/styles/*`, `src/components/brand/Logo.tsx`, review note |
| P3-04 | Licensed Thmanyah integration (`next/font/local`) + full AR re-test | Frontend Architect | blocked | OI-01 | — |
| P3-05 | i18n routing (`/ar`, `/en`), typed dictionaries, `html[lang][dir]`, locale switcher, metadata infrastructure | Frontend Architect | pending | P3-01 | `src/i18n/*`, `[locale]/layout.tsx` |
| P3-06 | Global layout: Header, MobileMenu (focus trap), Footer, Breadcrumbs, skip link, MotionRuntime + html.js gating | Frontend Architect | pending | P3-03, P3-05 | components + screenshots |
| P3-07 | Route skeletons with real layouts for all spec §4.2 routes, 404 and error pages | Frontend Architect | pending | P1-05, P3-06 | route health log |
| P3-08 | RBAC + publication-guard integration tests; fixture DB isolation (`seed:fixtures` on throwaway SQLite) | CMS / Backend Engineer | pending | P3-02 | `docs/evidence/gate-3/rbac.txt` |
| P3-09 | Test harness: Vitest, Playwright projects (e2e, screenshots), axe | QA / Browser Testing | pending | P3-01 | configs + first green run |
| P3-10 | PostgreSQL migrations generated and verified (`src/migrations/postgres`) | CMS Engineer + Release Engineer | blocked | OI-12 | — |
| P3-11 | Gate 3 review | Orchestrator | pending | P3-03, P3-05 … P3-09 | G3.1–G3.9 |

## Phase 4 — Hero + signature homepage

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P4-01 | Scene 1 hero + Sunrise Line Reveal (moment 1), preloaded LCP image | Frontend + Motion Director | pending | P2-04, P3-06 | video + frames |
| P4-02 | Scene 2 proof band 300 / 15m / 150 (moment 2) with qualifiers + SR labels | Frontend + Motion Director | pending | P2-04, P3-02 | unit test + video |
| P4-03 | Scene 3 statement transition | Frontend | pending | P2-04 | screenshots |
| P4-04 | Scene 4 segment chapters, CSS-sticky media (moment 3) + mobile stack | Frontend + Motion Director | pending | P2-04, P1-03 | video |
| P4-05 | Scene 5 product pillars (moment 5) | Frontend + Motion Director | pending | P2-04 | video |
| P4-06 | Scene 6 distribution journey (moment 4) | Frontend + Motion Director | pending | P2-04 | video |
| P4-07 | Scene 7 values Veterinary Grid + mobile accordion | Frontend | pending | P2-04 | screenshots |
| P4-08 | Scene 8 approved-only product preview / polished empty state | Frontend + CMS Engineer | pending | P3-02 | screenshots |
| P4-09 | Scene 9 partner proof without testimonials | Frontend | pending | P1-03 | screenshots |
| P4-10 | Scene 10 FAQ accordion (business/process only) | Frontend | pending | P1-04 | screenshots + keyboard check |
| P4-11 | Scene 11 closing CTA (moment 6) + real footer (verified contacts only) | Frontend + Motion Director | pending | P2-04 | video |
| P4-12 | Reduced-motion, no-JS and mobile fallbacks for every scene | Frontend + Motion Director | pending | P4-01 … P4-11 | screenshots |
| P4-13 | Gate 4 review (recordings, CLS, overflow, console) | Orchestrator + QA | pending | P4-01 … P4-12 | G4.1–G4.9 |

## Phase 5 — Interior pages + conversion

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P5-01 | About page | Frontend + Copywriter | pending | P3-07 | screenshots |
| P5-02 | Poultry solutions overview + broilers / layers / breeders pages (segment-prefilled forms) | Frontend + Copywriter | pending | P3-07, P5-06 | screenshots |
| P5-03 | How we work (process as review_required until OI-09) + small form | Frontend + Copywriter | pending | P3-07, P5-06 | screenshots |
| P5-04 | Catalogue: Arabic search, facets, pagination, URL state, loading/error/empty states | CMS Engineer + Frontend | pending | P3-02 | unit + e2e |
| P5-05 | Product detail: approved-only, 404 otherwise, safety text, JSON-LD without offers | CMS Engineer + Frontend | pending | P5-04 | e2e |
| P5-06 | Lead forms: shared Zod schema, phone normalisation, honeypot, rate limit, idempotency, Local API persistence | CMS Engineer + Frontend | pending | P3-02 | unit + integration |
| P5-07 | Sales workflow in admin (status transitions, product context); notifications behind SMTP config | CMS Engineer | pending | P5-06 | admin screenshot |
| P5-08 | Knowledge hub + article template (empty state or gated nav) | Frontend + CMS Engineer | pending | P3-02 | screenshots |
| P5-09 | Contact, partnership, privacy (draft pending legal), 404/error | Frontend + Copywriter | pending | P5-06 | screenshots |
| P5-10 | E2E journeys 1, 2, 6, 8 | QA | pending | P5-04 … P5-09 | Playwright report |
| P5-11 | CTA / internal link audit | QA | pending | P5-01 … P5-09 | link crawl log |
| P5-12 | Gate 5 review | Orchestrator | pending | P5-10, P5-11 | G5.1–G5.10 |

## Phase 6 — Content, SEO, accessibility, performance

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P6-01 | Populate approved copy/metrics/records; block fabricated data; scans clean | Copywriter + Orchestrator | pending | P5-12 | scan log, approval register |
| P6-02 | Bilingual QA (Arabic line breaks, digits, EN layout, `/en` noindex) | Copywriter + QA | pending | P6-01 | screenshots |
| P6-03 | Accessibility: axe sweep, manual keyboard pass, contrast, reflow | SEO & Accessibility | pending | P5-12 | axe log, test-report section |
| P6-04 | Metadata, canonical/hreflang policy, sitemap, robots, JSON-LD | SEO & Accessibility | pending | P5-12 | SEO log |
| P6-05 | Analytics adapter verification (no-op until OI-14) + consent component | SEO & Accessibility | pending | P5-12 | unit test |
| P6-06 | Performance: images, fonts, bundle split, lazy motion; Lighthouse baseline on a production build | Release Engineer | pending | P5-12 | `docs/performance-report.md` |
| P6-07 | Security review: secrets, RBAC, uploads, headers/CSP plan, dependency audit | Release Engineer | pending | P5-12 | `docs/security-review.md` |
| P6-08 | CMS editor guide + content approval queue | CMS Engineer + Copywriter | pending | P5-07 | `docs/cms-editor-guide.md` |
| P6-09 | Gate 6 review | Orchestrator | pending | P6-01 … P6-08 | G6.1–G6.9 |

## Phase 7 — Real browser testing & iteration

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P7-01 | Full unit + E2E suites (journeys 1–8) green | QA | pending | P6-09 | logs + Playwright report |
| P7-02 | Screenshot matrix: 9 viewports × AR/EN (home) + 390/1440 key pages, inspected | QA | pending | P6-09 | `screenshots/<date>/…` |
| P7-03 | Automated page checks (overflow, console, images, links, placeholders) | QA | pending | P7-02 | checks log |
| P7-04 | Polish round 1 (fixes + before/after) | Frontend + Visual Designer | pending | P7-02, P7-03 | test-report |
| P7-05 | Polish round 2 (fixes + before/after) | Frontend + Visual Designer | pending | P7-04 | test-report |
| P7-06 | Edge conditions: auth, publishing, empty states, reduced motion, slow network, validation errors | QA | pending | P7-04 | test-report |
| P7-07 | `docs/test-report.md` complete; verified local preview recorded | QA | pending | P7-05, P7-06 | `docs/test-report.md` |
| P7-08 | Gate 7 review | Orchestrator | pending | P7-07 | G7.1–G7.8 |

## Phase 8 — Release handoff

| ID | Task | Owner role | Status | Depends on | Output / evidence |
|---|---|---|---|---|---|
| P8-01 | `.env.example` with explanations; README with exact commands and architecture | Release Engineer | pending | P7-08 | files |
| P8-02 | `docs/deployment.md` (PostgreSQL, migrations, S3 storage, SMTP, first admin, backups, rollback) | Release Engineer | pending | P7-08 | file |
| P8-03 | Clean-checkout run (`pnpm install --frozen-lockfile`, build, start) + secret scan | Release Engineer | pending | P8-01 | `docs/evidence/gate-8/clean-run.txt` |
| P8-04 | Final docs pack (editor guide, test, performance, security reports, open items, screenshots) | Orchestrator | pending | P7-08 | files |
| P8-05 | Delivery matrix (spec §18) + self-audit (spec §21) with evidence | Orchestrator | pending | P8-01 … P8-04 | final report |
| P8-06 | Deployment to an approved destination and live verification | Release Engineer | blocked | OI-12, OI-16 + explicit user permission (OI-13 recommended, not blocking) | `docs/deployment.md` — label READY / BLOCKED until then |
| P8-07 | Gate 8 review and final handoff report | Orchestrator | pending | P8-05 | G8.1–G8.8 |
| P8-08 | Handoff of open approvals to the client (prioritised OI list) | Orchestrator | pending | P8-05 | `docs/open-items.md` |

## Change log
- 2026-10-09 — Board created. Phase 0 core done (spec, PDF, environment, logo vectors, AGENTS.md); skills and process docs delivered for review; discovery and scaffolding in progress; three items marked blocked on external inputs.
