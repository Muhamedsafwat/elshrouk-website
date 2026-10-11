# Task board — Alshorouk website

Phases 0–8 follow spec §15; gates are defined in `docs/quality-gates.md`; human inputs live in `docs/open-items.md` (OI-xx); roles and execution model in `docs/agent-operating-model.md`. Test results and the defect log are in `docs/test-report.md`.

_Last updated: 2026-10-11 by the Orchestrator (final handoff). Replaces the 2026-10-09 opening snapshot._

**Status values:** `done` (finished and evidenced) · `done*` (finished with a stated deviation from the planned method) · `pending` (not started) · `blocked` (cannot proceed without an external input — cites an OI).

## Snapshot (2026-10-11)

| Phase | done | done* | pending | blocked | Gate |
|---|---|---|---|---|---|
| 0 Environment reconnaissance | 8 | 0 | 0 | 0 | G0 passed |
| 1 Research & blueprint | 7 | 0 | 0 | 0 | G1 passed |
| 2 Design + motion plan | 4 | 2 | 0 | 0 | G2 passed with deviations (P2-04, P2-06) |
| 3 Foundation | 10 | 0 | 0 | 1 | G3 passed (Thmanyah font blocked, OI-01) |
| 4 Hero + signature homepage | 12 | 1 | 0 | 0 | G4 passed with one deviation (frames instead of video) |
| 5 Interior pages + conversion | 12 | 0 | 0 | 0 | G5 passed |
| 6 Content, SEO, a11y, performance | 9 | 0 | 0 | 0 | G6 passed; mobile LCP budget missed and documented |
| 7 Browser testing & iteration | 8 | 0 | 0 | 0 | G7 passed (0 open P0/P1) |
| 8 Release handoff | 7 | 0 | 0 | 1 | Deployment blocked (OI-12, OI-16, permission) |

**Not deployed.** Nothing was published, pushed or purchased. The build runs locally (see `README.md`); deployment waits for hosting, credentials and explicit permission (OI-12, OI-16).

---

## Phase 0 — Environment reconnaissance

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P0-01 | Read the full master spec | done | referenced throughout `AGENTS.md` and the docs |
| P0-02 | Read the brand PDF (21 pages, images and text) | done | `docs/brand-audit.md` |
| P0-03 | Environment check (Node 22, pnpm 9, Python, Playwright + Chromium; no Docker/PostgreSQL) | done | `docs/agent-operating-model.md` § Environment |
| P0-04 | Extract logo vectors from the PDF and pixel-verify | done | `public/brand/*.svg`, `public/brand/extraction-meta.json` |
| P0-05 | `AGENTS.md` (+ `CLAUDE.md` import) | done | 11.9 KB, under the 24 KB cap |
| P0-06 | 13 project skills (`.agents/skills/<name>/SKILL.md`) | done | structure check 13/13: `docs/evidence/gates/g0.7-skills-check.txt` |
| P0-07 | Process docs (task board, open items, quality gates, operating model) | done | the four files |
| P0-08 | Gate 0 review | done | `docs/quality-gates.md` § Final status |

## Phase 1 — Research & blueprint

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P1-01 | Reference audit (4 sites, desktop + mobile, motion ideas, do-not-transfer list) | done | `docs/reference-audit.md` |
| P1-02 | Brand audit (tokens, logo provenance, contrast, banned content, gaps) | done | `docs/brand-audit.md` |
| P1-03 | Photography: licensed poultry stock, segment-correct, provenance | done | `docs/image-provenance.md`, `src/content/photos.ts` (commissioned photography: OI-08) |
| P1-04 | Arabic-first copy, English draft, glossary, claims register | done | `src/i18n/dictionaries/{ar,en}/*`, `docs/copy-glossary.md`, `content/approval-register.md` |
| P1-05 | Site map, navigation, journeys | done | `docs/site-map.md` |
| P1-06 | Architecture + CMS contract | done | `docs/architecture.md` |
| P1-07 | Gate 1 review incl. content scans | done | `docs/evidence/content-integrity.md` (source scans clean) |

## Phase 2 — High-fidelity design + motion plan

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P2-01 | Art direction per scene and page family | done | `docs/art-direction.md` |
| P2-02 | Homepage at 1440 and 390 with real copy and licensed imagery | done | built directly as production code; `screenshots/ar/home/*`, `screenshots/en/home/*` |
| P2-03 | Interior page families | done | `screenshots/ar/<page>/*` |
| P2-04 | Motion storyboard: scenes 0–11 + six signature moments | done* | `docs/motion-storyboard.md`. **Deviation:** written as an as-built record from the code (extracted and adversarially verified against the source), not as a plan approved before the scenes were coded. |
| P2-05 | Major states: empty catalogue, filtered-empty, loading, error, form states, 404 | done | `screenshots/dev-empty/*`, `screenshots/_sheets/dev-empty-states.jpg`, form-state tests in `tests/e2e/forms.spec.ts` |
| P2-06 | Gate 2 review | done* | **Deviation:** no separate client design sign-off; tokens follow the brand audit, and the client approvals that remain are listed in `docs/open-items.md` (OI-15, OI-19). |

## Phase 3 — Foundation

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P3-01 | Scaffold: Next.js 16.3.8, React 19.2, TS strict, Tailwind 4, Payload 3.90 (SQLite dev / PostgreSQL by `DATABASE_URL`) | done | `package.json`, `src/payload.config.ts` |
| P3-02 | Payload schema, approval guard, RBAC (admin/editor/sales + `canApprove`), revalidation hooks | done | `src/payload/**`; unit `tests/unit/publication-guard.test.ts` |
| P3-03 | Tokens, fonts (Montserrat + Alexandria staging stand-in), `<Logo>` | done | `src/styles/*`, `src/components/brand/Logo.tsx` |
| P3-04 | Licensed Thmanyah integration + full Arabic re-test | blocked | OI-01 (swap procedure in `src/styles/fonts.ts`) |
| P3-05 | i18n routing (`/ar`, `/en`), dictionaries, `html[lang][dir]`, locale switcher, metadata | done | `src/i18n/*`, `src/proxy.ts` |
| P3-06 | Global layout: header, mobile menu (focus trap), footer, breadcrumbs, skip link, motion runtime | done | `tests/e2e/navigation.spec.ts`, `tests/e2e/keyboard-motion.spec.ts` |
| P3-07 | All spec §4.2 routes, 404 and error pages | done | route matrix in `docs/test-report.md`; 404s server-rendered since CI-03 |
| P3-08 | RBAC + publication-guard tests; isolated fixture DB | done | `tests/e2e/cms.spec.ts`, `data/e2e.db` via `pnpm seed:e2e` |
| P3-09 | Test harness: Vitest, Playwright projects, axe | done | `vitest.config.ts`, `playwright.config.ts` |
| P3-10 | PostgreSQL migrations generated and verified | done | `src/migrations/postgres/*`, `docs/evidence/database-verification.md` (embedded PostgreSQL 17) |
| P3-11 | Gate 3 review | done | typecheck, lint and builds green (see test report) |

## Phase 4 — Hero + signature homepage

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P4-01 | Scene 1 hero + Sunrise Line Reveal, prioritised LCP image | done | `docs/motion-storyboard.md`; PERF-1 fix |
| P4-02 | Scene 2 proof band 300 / 15m / 150 with qualifiers + SR labels | done | `tests/unit/metrics-copy.test.ts`; content-integrity checks |
| P4-03 | Scene 3 statement transition | done | scroll frames `screenshots/ar/home/scroll-1440/*` |
| P4-04 | Scene 4 segment chapters, CSS-sticky media + mobile stack | done | scroll frames; storyboard |
| P4-05 | Scene 5 product pillars | done | storyboard; screenshots |
| P4-06 | Scene 6 distribution journey | done | storyboard; screenshots |
| P4-07 | Scene 7 values / Veterinary Grid + mobile treatment | done | screenshots |
| P4-08 | Scene 8 approved-only product preview / empty state | done | `screenshots/_sheets/dev-empty-states.jpg` (no fake cards) |
| P4-09 | Scene 9 partner proof without testimonials | done | screenshots |
| P4-10 | Scene 10 FAQ accordion (business/process only) | done | keyboard test in `tests/e2e/keyboard-motion.spec.ts` |
| P4-11 | Scene 11 closing CTA + real footer (verified contacts only) | done | screenshots; no contact data shown until verified (OI-05) |
| P4-12 | Reduced-motion, no-JS and mobile fallbacks | done | reduced-motion axe scans and reveal checks; no-JS 404 test (CI-03) |
| P4-13 | Gate 4 review (recordings, CLS, overflow, console) | done* | **Deviation:** scroll film strips (sequential frames) instead of video recordings. CLS 0 in every Lighthouse run; 0 px overflow; 0 console errors in the screenshot runs. |

## Phase 5 — Interior pages + conversion

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P5-01 | About page | done | screenshots, axe |
| P5-02 | Poultry solutions overview + broilers / layers / breeders | done | screenshots, axe, journey 1 |
| P5-03 | How we work (process marked for client review, OI-09) | done | screenshots |
| P5-04 | Catalogue: Arabic search, facets, pagination, URL state, loading/error/empty states | done | `tests/unit/catalog-params.test.ts`, `search-normalize.test.ts`, journey 2 |
| P5-05 | Product detail: approved-only, 404 otherwise, safety text, JSON-LD without offers | done | journey 7, content-integrity CI-02/CI-03 |
| P5-06 | Lead forms: shared Zod schema, phone normalisation, honeypot, rate limit, idempotency | done | `tests/unit/inquiries*.test.ts`, `tests/e2e/forms.spec.ts` |
| P5-07 | Sales workflow in admin (status lifecycle, product context); notifications behind SMTP config | done | `tests/e2e/cms.spec.ts`; SMTP not configured (OI-13) |
| P5-08 | Knowledge hub + article template (designed empty state) | done | screenshots (OI-17 for content) |
| P5-09 | Contact, partnership, privacy (draft, legal review pending), 404/error | done | screenshots; OI-10 |
| P5-10 | E2E journeys 1, 2, 6, 7, 8 | done | `tests/e2e/journeys.spec.ts` |
| P5-11 | CTA / internal link audit | done | `tests/e2e/links.spec.ts` (every internal link from every route, both locales) |
| P5-12 | Gate 5 review | done | `docs/test-report.md` |

## Phase 6 — Content, SEO, accessibility, performance

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P6-01 | Approved copy/metrics; fabricated data blocked; scans clean | done | `docs/evidence/content-integrity.md`, `content/approval-register.md` |
| P6-02 | Bilingual QA (Arabic line breaks, digits, EN layout, `/en` noindex) | done | visual QA + content-integrity tests |
| P6-03 | Accessibility: axe sweep, keyboard pass, contrast, reflow | done | `tests/e2e/a11y.spec.ts`, `docs/evidence/accessibility.md`, `docs/evidence/axe/*` |
| P6-04 | Metadata, canonical/hreflang policy, sitemap, robots, JSON-LD | done | route matrix; `tests/e2e/security.spec.ts`, content-integrity |
| P6-05 | Analytics adapter (no-op until OI-14) | done | `tests/unit/analytics.test.ts` |
| P6-06 | Performance: Lighthouse on a production build | done | `docs/performance-report.md` (mobile LCP budget missed; documented) |
| P6-07 | Security review | done | `docs/evidence/security-review.md` (+ final addendum) |
| P6-08 | CMS editor guide + approval queue | done | `docs/cms-editor-guide.md` |
| P6-09 | Gate 6 review | done | `docs/quality-gates.md` § Final status |

## Phase 7 — Real browser testing & iteration

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P7-01 | Full unit + E2E suites green | done | `docs/evidence/final/e2e-run.txt`, test report |
| P7-02 | Screenshot matrix: 9 viewports × AR/EN (home) + 390/1440 key pages, inspected | done | `screenshots/**`, `screenshots/_sheets/*` |
| P7-03 | Automated page checks (overflow, console, images, links, placeholders) | done | screenshot spec soft checks; `tests/e2e/links.spec.ts` |
| P7-04 | Polish round 1: 4-agent QA → 30 findings fixed by 2 fix agents | done | test report § Polish rounds |
| P7-05 | Polish round 2: orchestrator follow-ups, CI-03/CI-06 fix, landmark, dependency updates | done | test report § Polish rounds |
| P7-06 | Edge conditions: auth, publishing, empty states, reduced motion, slow network, validation, no JS, forced 500 | done | test report § Edge conditions |
| P7-07 | `docs/test-report.md` complete; local preview recorded | done | `docs/test-report.md` |
| P7-08 | Gate 7 review | done | 0 open P0/P1; deferred P2/P3 listed in `docs/open-items.md` |

## Phase 8 — Release handoff

| ID | Task | Status | Output / evidence |
|---|---|---|---|
| P8-01 | `.env.example` with explanations; README with exact commands and architecture | done | `.env.example`, `README.md` |
| P8-02 | `docs/deployment.md` (PostgreSQL, migrations, S3, SMTP, first admin, backups) | done | file |
| P8-03 | Clean-checkout run (`pnpm install --frozen-lockfile`, build) + secret scan | done | `docs/evidence/final/clean-checkout.txt`. The first attempt found Photo.tsx missing from git (FR-11), fixed in 78d9a02; the second attempt passed. |
| P8-04 | Final docs pack | done | `docs/*` |
| P8-05 | Delivery matrix + self-audit | done | final handoff report (conversation) + `docs/test-report.md` |
| P8-06 | Deployment to an approved destination and live verification | blocked | OI-12, OI-16 and explicit permission |
| P8-07 | Gate 8 review and final handoff | done | `docs/quality-gates.md` § Final status |
| P8-08 | Handoff of open approvals to the client (prioritised OI list) | done | `docs/open-items.md` |

## Change log
- 2026-10-09 — Board created (Phase 0 core done; discovery and scaffolding in progress).
- 2026-10-10 — Build workflow: all pages and scenes built by 7 parallel builders; integration fixes; isolated e2e build.
- 2026-10-11 — QA round (4 agents, 4 evidence docs), fix round (30 findings), orchestrator follow-ups, CI-03 server-rendered 404s, final verification. Board rewritten to the delivered state.
