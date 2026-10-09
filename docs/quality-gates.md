# Quality gates — Alshorouk website

Gate-by-gate pass/fail checks for spec §15 (Phases 0–8), with the evidence each check must produce.
A gate passes only when **every** check is PASS, or BLOCKED where the check explicitly allows an external blocker.
Process rules come from spec §13.13 and §16.5 and from `docs/agent-operating-model.md`.

_Last updated: 2026-10-09 by the PM / technical-architect subagent. Owner: Orchestrator (Claude Code main session)._

## How results are recorded

| Result | Meaning |
|---|---|
| PASS | The check ran after the last relevant change, by someone other than the implementer (QA subagent or orchestrator), and the evidence artefact exists at the stated path. |
| FAIL | The check ran and did not meet the pass condition. A task with an owner is added to `docs/task-board.md`. |
| BLOCKED | Cannot be satisfied without an external input; must cite an item in `docs/open-items.md`. Allowed only where the check says so. |
| N/A | Not applicable, with a one-line reason. |

**Evidence conventions**
- Command logs: `docs/evidence/gate-<n>/<check-id>.txt` — the command, date/time, exit code and the relevant output (tail). Never edited by hand after capture.
- Screenshots: `screenshots/<YYYY-MM-DD>/<locale>/<page>/<w>x<h>-<position>.png`; motion: `screenshots/motion/<moment>-<width>.webm` + frames.
- Index, defect log (route · viewport · steps · expected vs actual · P0–P3 · evidence · owner · patch · status) and polish rounds: `docs/test-report.md`.
- Results come from real execution only; a screenshot counts only after it has been opened and inspected. "Not run" is reported as not run.
- Severity: **P0** blocks a core journey, loses data, fakes success, alters the logo/metrics or shows non-poultry content · **P1** major function broken on a key viewport or locale · **P2** visible visual defect · **P3** polish.

## Summary

| Gate | Phase | Pass question (spec §15) | Sign-off | Status 2026-10-09 |
|---|---|---|---|---|
| 0 | Environment reconnaissance | Environment works, sources accessible, no unknown overwrites | Orchestrator | in review — Phase 0 work done; process docs and skills delivered, awaiting orchestrator verification |
| 1 | Research & blueprint | Site map and tokens consistent; no unsupported outward facts; 3 journeys specified | Orchestrator + Brand Guardian + UX | not started (discovery in progress) |
| 2 | Design + motion plan | Distinctive, responsive design plan; all major states designed; storyboard approved | Orchestrator + Design Director + Motion Director | not started |
| 3 | Foundation | Build/typecheck work; all routes responsive with working nav; CMS starts locally | Orchestrator + Frontend Architect | not started (scaffolding in progress) |
| 4 | Hero + signature homepage | Homepage premium on desktop and mobile; recordings; no serious CLS, overflow or broken motion | Orchestrator + QA | not started |
| 5 | Interior pages + conversion | Every critical customer flow works end-to-end; sales/admin sees the right record | Orchestrator + QA + CMS Engineer | not started |
| 6 | Content, SEO, a11y, performance | No critical a11y/security/SEO issue; mobile performance documented | Orchestrator + SEO/A11y + Release | not started |
| 7 | Browser testing & iteration | No P0/P1, no major P2, suites pass, verified local preview | Orchestrator + QA | not started |
| 8 | Release handoff | Truthful delivery matrix: implemented, tested, unresolved, approvals/credentials | Orchestrator | not started |

---

## Gate 0 — Environment & sources (Phase 0)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G0.1 | Repo path, state and ownership confirmed; nothing pre-existing overwritten | Orchestrator inspects the tree and git status before scaffolding | Only expected files changed; no unknown overwrites | `docs/agent-operating-model.md` § Environment; orchestrator checkpoint log |
| G0.2 | Toolchain and capabilities recorded truthfully | `node -v`, `pnpm -v`, `python --version`, Playwright version, browser and DB availability | Versions and gaps (no Docker, no PostgreSQL, Antigravity not used) recorded | `docs/agent-operating-model.md` § Environment |
| G0.3 | Master spec read in full (1,087 lines) | Orchestrator attestation in task board | P0-01 = done | `docs/task-board.md` |
| G0.4 | Brand PDF read: all 21 pages as images and text | Page renders exist; facts cited by PDF page index | P0-02 = done; brand facts recorded | `docs/brand-audit.md`; `.agents/skills/brand-extraction/SKILL.md` |
| G0.5 | Logo vectors extracted from the PDF and pixel-verified | Raster diff of PDF clip vs SVG at 6×, side-by-side inspected | Mean abs diff ≤ baseline (full colour 1.23; white 4.01; black 5.06) and visually identical | `public/brand/extraction-meta.json`, `docs/brand-audit.md` |
| G0.6 | `AGENTS.md` (+ `CLAUDE.md` import) present and authoritative | File review against spec §14.3 | Mandatory core present; file < 24,000 bytes (Antigravity rule-file cap) | `AGENTS.md`, `CLAUDE.md` |
| G0.7 | 13 substantive skills with valid frontmatter and required sections | Check script below | 13 OK, 0 failures; each skill project-specific (manual read) | `docs/evidence/gate-0/skills-check.txt` |
| G0.8 | Planning artefacts exist | File check | `docs/task-board.md`, `docs/open-items.md`, `docs/quality-gates.md`, `docs/agent-operating-model.md` present and current | the files |
| G0.9 | Poultry-only correction and approved metrics recorded | Compare AGENTS.md table with spec §1.1 | Exact statements, qualifiers, 150 = medicines + vaccines only | `AGENTS.md` § Approved business statements |

Skill check (run from the repo root; save the output as the G0.7 evidence):
```bash
python - <<'EOF'
import pathlib, re, sys
req = ['## Activation', '## Inputs', '## Procedure', '## Checklists', '## Deliverables',
       '## Acceptance criteria', '## Failure recovery & escalation', '## Spec references']
bad = 0
for d in sorted(p for p in pathlib.Path('.agents/skills').iterdir() if p.is_dir()):
    t = (d / 'SKILL.md').read_text(encoding='utf-8')
    fm = re.match(r'^---\nname: (.+)\ndescription: (.+)\n---\n', t)
    pos = [t.find(s) for s in req]
    ok = bool(fm) and fm.group(1) == f'alshorouk-{d.name}' and -1 not in pos and pos == sorted(pos)
    bad += not ok
    print('OK ' if ok else 'BAD', d.name, len(t.splitlines()), 'lines')
sys.exit(bad)
EOF
```

## Gate 1 — Research & blueprint (Phase 1)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G1.1 | Brand audit complete | Review against the brand-extraction checklists | Tokens (exact hex), logo provenance + hashes, contrast matrix, banned PDF content, gaps → open items | `docs/brand-audit.md` |
| G1.2 | Reference audit complete | Review against the reference-research checklists | 4 sites × desktop + mobile with evidence; ≥ 6 motion ideas mapped to §8.4; no asset reuse; access problems logged | `docs/reference-audit.md`, `.reference/` (internal) |
| G1.3 | Site map consistent with spec §4.2 and code routes | Compare `docs/site-map.md` with `src/i18n/routing.ts` | Every route, nav label, CTA and footer link mapped in AR and EN; no extra/irrelevant pages | `docs/site-map.md` |
| G1.4 | Three customer journeys specified | Review | Farm inquiry, product inquiry, partnership inquiry — each reaches contact in ≤ 3 meaningful actions (§13.4) | `docs/site-map.md` § Journeys |
| G1.5 | Tokens and site map mutually consistent | Cross-check brand audit, `globals.css` proposal, nav | No ad-hoc colours; ratio rules stated; nav matches routes | `docs/brand-audit.md`, token diff |
| G1.6 | No unsupported facts in outward-facing copy | All six poultry-content-integrity scans + manual read | Zero unjustified hits; every claim mapped in the register | `docs/evidence/gate-1/content-scan.txt`, `content/approval-register.md` |
| G1.7 | Architecture and CMS contract chosen | Review | Versions, SQLite-dev/PostgreSQL-prod strategy, collections and access model, deployment needs and cost approvals listed | `docs/architecture.md` |
| G1.8 | Human approval queue current | Review | Every missing fact/credential has owner, fallback, priority | `docs/open-items.md` |

## Gate 2 — High-fidelity design + motion plan (Phase 2)

Design is produced as coded prototypes and real browser screenshots (no separate design tool in this environment).

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G2.1 | Homepage prototype at 1440 and 390 with real copy and licensed poultry imagery | Screenshots inspected against visual-art-direction checklists | All 11 scenes composed; no placeholder text; images registered with provenance | `screenshots/<date>/ar/home/*`, `docs/image-provenance.md` |
| G2.2 | Interior page families designed | Screenshots at 1440 and 390 | About, segment, catalogue + detail, contact | `screenshots/<date>/ar/<page>/*` |
| G2.3 | All major states designed | Screenshots | Empty catalogue, filtered-empty, loading, error, form validation/success/server error, 404 | `screenshots/<date>/ar/states/*` |
| G2.4 | Motion storyboard complete | Review against motion-storyboarding checklists | 12 scene entries (0–11) + 6 signature moments, each with reduced-motion, no-JS and cost | `docs/motion-storyboard.md` |
| G2.5 | Brand and visual QA | Ratio script + manual review | Amber ≤ 5% of brand pixels; one motif per section; Arabic hierarchy and documentary imagery approved | ratio output + review notes in `docs/evidence/gate-2/visual-review.txt` and `docs/test-report.md` § Visual review |
| G2.6 | Distinctiveness | Review against spec §17 | ≥ 3 distinct homepage compositions; no repeated template card rows | `docs/art-direction.md` |
| G2.7 | Sign-offs recorded (spec §13.13-3) | Task board | Tokens signed before global CSS; storyboard approved before scene code | `docs/task-board.md` |

## Gate 3 — Foundation (Phase 3)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G3.1 | Type safety | `pnpm typecheck` | exit 0 | `docs/evidence/gate-3/typecheck.txt` |
| G3.2 | Lint | `pnpm lint` | exit 0 | `docs/evidence/gate-3/lint.txt` |
| G3.3 | Production build | `pnpm build` (when authorised) | exit 0, no type/route errors | `docs/evidence/gate-3/build.txt` |
| G3.4 | Route health | curl loop from the nextjs-architecture skill | 24 routes (12 × ar/en) → 200; bad slug/segment/locale → 404 designed page | `docs/evidence/gate-3/routes.txt` |
| G3.5 | Responsive skeletons | Playwright overflow check at the 9 viewports | No horizontal overflow on any route skeleton | `docs/evidence/gate-3/overflow.txt` |
| G3.6 | Navigation | E2E | Header, mobile menu, footer, breadcrumbs and locale switch work on every route | Playwright report |
| G3.7 | CMS starts locally | Open `/admin` on SQLite | Login/first-admin flow works; collections and globals listed; Arabic admin UI | `screenshots/<date>/admin/*` |
| G3.8 | Approval-aware schema and RBAC | Integration tests | Role matrix tests pass; no product seeds outside the fixture DB | `docs/evidence/gate-3/rbac.txt` |
| G3.9 | Brand primitives | Unit tests | `<Logo>` cannot stretch/recolour; tokens only; `html[lang][dir]`, skip link, metadata scaffold present | `docs/evidence/gate-3/unit.txt` |

## Gate 4 — Hero + signature homepage (Phase 4)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G4.1 | Scenes 1–11 implemented with real content | Screenshots + placeholder scan | No placeholders; copy from dictionaries/CMS | `screenshots/<date>/{ar,en}/home/*` |
| G4.2 | Six signature moments | Videos + clock-driven frames vs storyboard | All six behave as storyboarded at 1440 and 390 | `screenshots/motion/*` |
| G4.3 | Reduced motion | `reducedMotion: 'reduce'` run | All content visible; no pinning, parallax or count-up | screenshots + Playwright report |
| G4.4 | No-JS and runtime-failure fail-safe | JS-disabled context; runtime-failure simulation | Headline, metrics, CTAs, nav visible | screenshots |
| G4.5 | Layout stability and LCP | `PerformanceObserver` in Playwright | CLS < 0.1 during load + scroll; the hero image is the preloaded LCP element | `docs/evidence/gate-4/perf-lab.txt` |
| G4.6 | Overflow and console | Automated checks at 9 viewports | 0 overflow, 0 console errors/hydration warnings | `docs/evidence/gate-4/checks.txt` |
| G4.7 | Metrics integrity | Unit test + screenshots | Exact approved statements; qualifiers visible in every frame; full SR labels | test log + frames |
| G4.8 | Premium feel, desktop and mobile | Art-direction review | Checklist passed; ratio within guideline; mobile recomposed; matches `docs/art-direction.md` | `docs/test-report.md` § Visual review |
| G4.9 | Product preview honesty | Screenshot with zero approved products | Polished category intro + working "request list" CTA; no fake cards | screenshot |

## Gate 5 — Interior pages + conversion (Phase 5)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G5.1 | All interior pages built | Route matrix + screenshots | About, solutions, 3 segments, how-we-work, contact, partnership, knowledge (or gated hub), privacy (draft, flagged), 404/error | `docs/test-report.md` route matrix |
| G5.2 | Catalogue behaviour | Unit + E2E | Search (Arabic normalisation), facets, pagination, shareable URL state, reset, loading/error/empty states | Playwright report |
| G5.3 | Product detail gate | E2E | Approved+published renders; unapproved/fixture → 404, absent from sitemap | Playwright report |
| G5.4 | E2E journey 1 | Home → segment → contact → submit → record in admin | Inquiry stored with type, segment, sourcePath; visible to sales | report + admin screenshot |
| G5.5 | E2E journey 2 (fixture DB) | Catalogue filter → product → inquire → admin | Inquiry has `productRef` + `productLabel`; sales sees product context | report + admin screenshot |
| G5.6 | E2E journey 6 | Zero public products | Empty state + request-list CTA persists a real inquiry | report |
| G5.7 | E2E journey 8 | Forced persistence failure (`page.route` → 500) | Error shown; no success text anywhere | report |
| G5.8 | RBAC end-to-end | Integration + REST checks | Editor/approver/sales/anonymous matrix holds; anonymous cannot read drafts, inquiries, users | `docs/evidence/gate-5/rbac.txt` |
| G5.9 | Anti-spam and duplicates | Unit/integration | Honeypot → error; rate limit enforced; double submit → one record | `docs/evidence/gate-5/forms.txt` |
| G5.10 | Every CTA works | Internal link crawl | All internal links < 400 (except intentional 404 tests) | `docs/evidence/gate-5/links.txt` |

## Gate 6 — Content, SEO, accessibility, performance (Phase 6)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G6.1 | Content integrity | Six scans + register review | Only approved outward claims; fabricated data blocked | `docs/evidence/gate-6/content-scan.txt`, `content/approval-register.md` |
| G6.2 | Bilingual QA | AR/EN screenshots at 320/390/1440 | No broken Arabic lines or digits; EN layout intact; `/en` noindex until approved | screenshots |
| G6.3 | Automated accessibility | axe (`wcag2a/aa`, `wcag21a/aa`, `wcag22aa`) on routes × locales × 390/1440 + open states | 0 serious/critical violations | `docs/evidence/gate-6/axe.txt` |
| G6.4 | Manual accessibility | Keyboard pass, contrast spot-checks, focus-not-obscured, 320 px/400% reflow | All pass; screen-reader smoke test done or explicitly pending (human) | `docs/test-report.md` § Accessibility |
| G6.5 | SEO | Metadata/canonical/hreflang policy, sitemap, robots, JSON-LD checks | Valid and truthful; no offers/ratings/unverified contacts; staging noindex | `docs/evidence/gate-6/seo.txt` |
| G6.6 | Analytics privacy | Unit test of the adapter | No-op without provider + consent; allow-listed props; no PII | test log |
| G6.7 | Security review | security-performance-release procedure | Secret scan clean; RBAC/uploads/headers reviewed; dependency audit triaged or recorded as not run | `docs/security-review.md` |
| G6.8 | Mobile performance documented | Lighthouse mobile + lab metrics on a **production build** | Values recorded with date and environment; budget baseline set; regressions explained | `docs/performance-report.md` |
| G6.9 | Editor enablement | Review | Editor guide and content approval queue usable by a non-developer | `docs/cms-editor-guide.md` |

## Gate 7 — Real browser testing & iteration (Phase 7)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G7.1 | Test suites | `pnpm test:unit`, `pnpm test:e2e` | Both exit 0; E2E journeys 1–8 present and passing | logs + Playwright HTML report |
| G7.2 | Screenshot matrix | `pnpm screenshots` + manual inspection | 9 viewports (320×720 … 1920×1080) × AR/EN for home; 390/1440 for catalogue, detail, contact, menu, 404 | `screenshots/<date>/…`, `docs/test-report.md` |
| G7.3 | Automated page checks | browser-visual-qa step 4 | 0 overflow, console errors, failed requests, broken images, dead links, placeholders | `docs/evidence/gate-7/checks.txt` |
| G7.4 | Visual regression checklist (spec §16.3) | Manual review per page/viewport | Every item ticked | `docs/test-report.md` |
| G7.5 | Polish rounds | Before/after pairs | ≥ 2 documented rounds when the first review found issues | `docs/test-report.md` § Polish rounds |
| G7.6 | Edge conditions | Targeted runs | Auth, publishing, empty states, navigation, reduced motion, slow network + 4× CPU, validation errors | `docs/test-report.md` |
| G7.7 | Defect status | Defect log | 0 open P0/P1; no major P2 | `docs/test-report.md` |
| G7.8 | Verified local preview | Fresh run | URL, build type (dev vs production build) and date recorded | `docs/test-report.md` |

## Gate 8 — Release handoff (Phase 8)

| ID | Check | How verified | Pass condition | Evidence |
|---|---|---|---|---|
| G8.1 | Clean-checkout runnability | `pnpm install --frozen-lockfile`, `pnpm build`, start | Succeeds from a clean clone; lockfile present; secret scan clean | `docs/evidence/gate-8/clean-run.txt` |
| G8.2 | Configuration documented | Review | `.env.example` complete with explanations; README with exact commands and architecture overview | `.env.example`, `README.md` |
| G8.3 | Documentation pack | Review | `docs/cms-editor-guide.md`, `deployment.md`, `test-report.md`, `performance-report.md`, `security-review.md`, `open-items.md`, screenshots | the files |
| G8.4 | Production database migrations | `pnpm payload migrate:create` / `migrate` against PostgreSQL | Migrations generated and applied cleanly on PostgreSQL. **BLOCKED allowed** (no PostgreSQL server in this environment — see open items) | `docs/evidence/gate-8/postgres.txt` |
| G8.5 | Deployment status | Verified URL check or explicit label | DEPLOYED (URL verified, forms persist, admin login) or READY — not deployed, or BLOCKED with exact missing inputs. **BLOCKED allowed**; never implied live | `docs/deployment.md` |
| G8.6 | Delivery matrix (spec §18) | Final report table | Every row PASS/FAIL (or DEPLOYED/READY/BLOCKED) with verifier, evidence and remaining gap | final report |
| G8.7 | Self-audit (spec §21) | 12 questions | Each answered with evidence or explicit APPROVAL PENDING | final report |
| G8.8 | Handoff checklist (spec §18) | Checklist | Every box ticked or explicitly gated with an open item | final report |

## When a check fails
1. Record the failure (check id, evidence path) and create a task with an owner on `docs/task-board.md`.
2. Fix in a vertical slice; re-run **that** check and every check whose evidence the fix invalidates (e.g. any UI change re-opens G7.2–G7.4 for the affected pages).
3. A gate is never skipped or partially passed; BLOCKED is accepted only where the table says so, with the open item cited.
4. Only the orchestrator declares a gate passed and records it in the summary table above.
