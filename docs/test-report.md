# Test report — Alshorouk website

_Final verification on 2026-10-11, against production builds of the final code. The site is **not deployed**: everything below ran on a local machine._

## 1. Verdict

- **Every automated suite passes on the final code:**
  - typecheck and lint: 0 errors;
  - unit tests: 140 / 140;
  - end-to-end (Chromium desktop + mobile): 243 passed, 0 failed, 40 skipped by design (7.6 min);
  - cross-engine smoke (WebKit + Firefox): 109 passed, 0 failed, 2 desktop-only tests skipped on the iPhone profile;
  - screenshot matrix: 143 / 143 captures and checks passed;
  - axe WCAG 2.2 AA: 0 violations in all 78 scans;
  - internal link crawl: every link answers 200.
- **No P0 or P1 defect is open.** 54 distinct findings were logged (42 in the QA round, 12 in the final round), and 46 are fixed. Still open: 2 P2 (zod in the client form bundle, and the mobile LCP lab budget) and 7 P3, each with an owner in `docs/open-items.md`.
- **Not tested:** real phones and tablets, screen readers, a production host or CDN, SMTP, and load (§ 8).

## 2. What was tested

| Item | Value |
|---|---|
| Machine | Windows 11 Pro, AMD Ryzen 7 5700G (8 cores / 16 threads), 31.4 GB RAM |
| Runtime | Node 22.14.0, pnpm 9.15.4 |
| Stack | Next.js 16.3.8, React 19.2.8, Payload 3.90.2, Tailwind CSS 4.3.3, GSAP 3.15.0, zod 4.6.5, TypeScript 5.9.3 |
| Test tools | Vitest 4.1.11; Playwright 1.64.0 with Chromium, WebKit and Firefox 157; @axe-core/playwright 4.13.0; Lighthouse 12 (see the performance report) |
| Main build under test | `pnpm build:e2e` → `.next-e2e`, served by `pnpm start:e2e` on **http://localhost:3200**. Isolated fixture database `data/e2e.db`, created fresh with `pnpm seed:e2e`: 3 approved `[TEST]` products plus 1 draft, 3 staff test accounts, a "demo data" ribbon on every page. `INQUIRY_IP_HEADER=x-real-ip`. |
| Deliverable build | `pnpm build` → `.next` against the real local database `data/alshorouk.db` (approved site content, no products or articles). Built successfully: 29 static pages (`docs/evidence/final/build-production.txt`). Smoke-tested with `next start` on :3300: every route 200 with one `h1`, no demo ribbon, the designed empty catalogue, `robots.txt` `Disallow: /` (staging), and every 404 server-rendered (`docs/evidence/final/route-matrix-production-build.json`). The very first slug lookup timed out, because its configured origin was the dev server, which compiles API routes on demand; it fell back to the page's own 404 (still status 404), as designed. |
| Dev server | `pnpm dev` on http://localhost:3100 (real empty database). Used by journey 6 (empty catalogue) and for checks during fixing. |

## 3. Results by suite

| Suite | Command | Result | Evidence |
|---|---|---|---|
| Typecheck | `pnpm exec tsc --noEmit --incremental false` | 0 errors | `docs/evidence/final/static-checks.txt` |
| Lint | `pnpm exec eslint .` | 0 problems | same file |
| Unit | `pnpm exec vitest run` | **140 passed / 140** in 13 files | `docs/evidence/final/unit-results.json` |
| Production build | `pnpm build` | OK, 29 static pages | `docs/evidence/final/build-production.txt` |
| E2E (Chromium) | `E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test --project=desktop --project=mobile` | **243 passed**, 0 failed, 40 skipped (by design), 7.6 min | `docs/evidence/final/e2e-run.txt` |
| Cross-engine smoke | `pnpm test:e2e:engines` (WebKit 1440, iPhone 14 WebKit, Firefox 1440) | **109 passed**, 0 failed, 2 skipped (desktop-only tests on the iPhone profile): WebKit 37 / 37, iPhone 14 35 + 2 skipped, Firefox 37 / 37 | `docs/evidence/final/e2e-engines-run.txt` |
| Screenshot matrix | `pnpm screenshots` | **143 passed** (5.4 min): 12 routes at 9 viewports, full pages at 390 and 1440, home scroll film strips, overlays, and glyph-integrity pixel tests at 390 and 1440 | `screenshots/**`, `screenshots/_sheets/*` |
| Route matrix | HTTP probe of every route in both locales | every route as expected (table in § 3.6) | `docs/evidence/final/route-matrix-3200.json` |
| Accessibility, best practice | axe `best-practice` rules on six key pages at 390 and 1440 | clean | this report, § 3.3 |
| Performance | Lighthouse 12, mobile + desktop, 3 runs per page | see `docs/performance-report.md` | `docs/evidence/lighthouse/after-fixes/*` |
| Dependency audit | `pnpm audit` | 7 advisories, none reachable (0 critical) | `docs/evidence/security-review.md` addendum |

### 3.1 End-to-end specs

| Spec | Desktop (Chromium 1440×900) | Mobile (Pixel 7, 390×844) | Covers |
|---|---|---|---|
| `a11y.spec.ts` | 76 | 38 (+ 38 skipped: 1440-only scans) | axe WCAG 2.2 AA on every route in both locales at 1440 and 390, plus open states and reduced motion |
| `cms.spec.ts` | 7 | — | Drafts invisible; approval guard; role matrix; inquiry lifecycle; REST access for anonymous users |
| `content-integrity.spec.ts` | 11 | — | Status ribbons; Arabic text marked `lang="ar"` on English pages; veterinary safety sentence; 404s server-rendered and readable without JS |
| `forms.spec.ts` | 7 | 7 | Error summary and field links; per-kind required fields; phone and Arabic-Indic digits; consent; honeypot; double submit; rate limit |
| `journeys.spec.ts` | 5 | — | Journeys 1, 2, 6, 7 and 8 (spec § 16.1) |
| `keyboard-motion.spec.ts` | 4 | — | Skip link; FAQ accordion; product drawer focus trap; reduced motion reveals everything |
| `links.spec.ts` | 1 | — | Every internal link from every route in both locales answers 200; fragments exist |
| `navigation.spec.ts` | 37 | 35 (+ 2 desktop-only skipped) | Redirects; 404s; direct load of every route (one `h1`, no console errors); locale switch; dropdown; mobile dialog; journey 3; 320 px overflow |
| `security.spec.ts` | 15 | — | Security headers; CSP scheme rule; CORS; GraphQL off; draft and staff-field leaks; oversized and foreign-origin actions; login lockout |
| **Total** | **163** | **80** | **243 passed, 0 failed, 40 skipped** |

**Cross-engine smoke** (`pnpm test:e2e:engines`, `navigation.spec.ts` in each engine): WebKit desktop 37 / 37, iPhone 14 (WebKit) 35 passed + 2 desktop-only skipped, Firefox 37 / 37. The first run failed 59 tests and exposed FR-9: no CSS or JS loaded in WebKit over plain HTTP. It also exposed two harness issues: Firefox hangs on `setViewportSize` (FR-10), and the desktop-only skips were keyed on one project name. In WebKit the skip-link test focuses the link directly, because WebKit tabs only to buttons and form fields by default (Safari's "Press Tab to highlight each item" setting is off).

Skips are by design. The `mobile` project skips the 1440 px axe cases, and two keyboard tests run on desktop only.

### 3.2 Unit tests (140)

| File | Tests | Covers |
|---|---|---|
| `inquiries.test.ts` | 52 | Shared inquiry schema: per-kind required fields, phone normalisation (Arabic-Indic digits, E.164), consent, honeypot, limits |
| `publication-guard.test.ts` | 19 | Approval guard: non-approvers cannot publish or approve; edits demote approved content; duplicates start as drafts |
| `inquiries-rate-limit.test.ts` | 14 | Per-client windows, pinned client-IP header, global fail-safe cap |
| `proxy.test.ts` | 9 | Locale redirect; server-rendered 404 rewrites; slug lookup; lookup origin never taken from the Host header (SSRF) |
| `catalog-ui.test.ts` | 7 | Arabic plural forms of the result count; pagination ranges |
| `search-normalize.test.ts` | 7 | Arabic search normalisation keeps valid text |
| `catalog-params.test.ts` | 6 | Facet/search/page parsing, malformed query safety, URL building |
| `route-table.test.ts` | 6 | The proxy's route table matches the page files (drift check) |
| `inquiries-lifecycle.test.ts` | 5 | Inquiry status history cannot be forged |
| `inquiries-action.test.ts` | 4 | Validation before rate limiting; honeypot spends no slot |
| `metrics-copy.test.ts` | 4 | The three approved figures with qualifiers and full screen-reader sentences |
| `logo.test.tsx` | 4 | Official files only, own aspect ratio, 110 px minimum, cannot be stretched or recoloured, 15 % clear space |
| `analytics.test.ts` | 3 | No-op without a provider and consent; allow-listed properties only (no personal data) |

### 3.3 Accessibility

- **axe-core 4.13, WCAG 2.0/2.1/2.2 A and AA: 0 violations.** `tests/e2e/a11y.spec.ts` runs 78 scans: every route in both locales at 1440 and 390, plus open states (dropdown, sticky bar, mobile menu, product drawer, filter drawer, form errors) and reduced motion. JSON per scan is in `docs/evidence/axe/`.
- **axe best-practice rules:** clean on `/ar`, `/en`, `/en/about`, `/ar/products`, `/en/contact` and the 404 at 390 and 1440 (final round; the status ribbon is now a labelled region).
- **Keyboard (manual QA round):** 345 tab stops on 8 page/viewport pairs. Each stop was pixel-compared focused vs. unfocused, and the focus ring passes 3:1 on all four grounds. The three components without a visible ring (A11Y-2, A11Y-3, A11Y-4) were fixed and re-checked by computed style. Automated: skip link, dropdown, mobile dialog (focus trap, Esc, focus return), FAQ accordion, product drawer.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, all 47 `[data-reveal]` elements are in their final state at load. Without it, 33 of 47 start hidden, which shows the check is real.
- **Reflow and zoom:** 0 px horizontal overflow at 320 px on every key page (`navigation.spec.ts`). Evidence for 400 % zoom is in `docs/evidence/zoom/`.
- **Not done:** a screen-reader pass (NVDA / VoiceOver / TalkBack). This needs a person; see § 8.

### 3.4 Visual

The final capture ran on the final build: `pnpm screenshots`, 143 / 143 in 5.4 min. It covers:

- 12 routes at all 9 viewports (320×720 … 1920×1080);
- full pages of every route at 390 and 1440;
- the home page middle and footer, and its scroll film strips (AR and EN at 1440, AR at 390);
- the open mobile menu and desktop dropdown in both locales;
- the contact form scrolled into view.

Each capture records horizontal overflow, console errors, broken images, and fixed elements covering form fields; all were clean. Two pixel tests check that the reveal masks clip no Arabic glyph ink at 390 and 1440 (VQA-01).

The 60 contact sheets were rebuilt with `scripts/visual-qa-sheets.py` into `screenshots/_sheets/`; the pre-fix QA sheets are in `screenshots/_sheets-qa-before/`. I reviewed:

- **Home on phones:** the headline breaks into 4 balanced rows at 320–430 with no single-word rows. At 320×720 the primary CTA sits just below the fold on this fixture build, which adds a two-line ribbon.
- **Desktop scroll strips:** hero to footer. The hero photo drift is now visible.
- **Mobile menus and the contact form.**

Colour balance, measured from full-page pixels (`docs/evidence/final/visual-sheets-output.txt`): home 8.1–9.1 % vermilion, amber ≤ 0.2 %. Inner pages are at 0.3–2.5 % vermilion (VQA-12, an open brand decision).

**Spec § 16.3 checklist:**

| Item | Result |
|---|---|
| Hero subject not mis-cropped; headline does not overlap; CTA visible without excessive scrolling | Pass (CTA just below the fold only at 320×720 with the fixture ribbon) |
| Arabic joins and line breaks; no text outside the viewport | Pass; some display headings still end on a single word at 320–430 (VQA-07, open P3) |
| Logo shape, clear space, contrast; correct version per ground | Pass (`logo.test.tsx`; extracted vectors) |
| Colour balance 55 / 25 / 15 / ≤ 5 | Partly: amber within limit; vermilion low on inner pages (VQA-12) |
| Section rhythm; no ghost columns, cropped buttons or fixed bars over form fields | Pass (asserted in the screenshot spec) |
| Sticky scenes release correctly; no pin gaps | Pass (no GSAP pins; CSS sticky releases) |
| Footer, legal links, navigation and forms work; image ratios and provenance | Pass (link crawl, forms spec; `docs/image-provenance.md`) |
| Reduced motion and low network still feel designed | Pass (§ 3.3, § 7) |
| No console errors, hydration mismatches, broken images, dead links or placeholders | Pass |

### 3.5 Performance

See `docs/performance-report.md`. The table there has the baseline and the re-measurement after the fixes, with the method. CLS was 0 in every run. Summary: Accessibility and Best Practices are 100 on every page (up from 98 / 96). CLS is 0 everywhere. Desktop LCP is 0.73–0.96 s (Performance 99–100). **Mobile LCP is 2.71–4.36 s, above the 2.5 s budget on all five pages** (open P2). Against the baseline: contact 3.19 → 2.71 s, catalogue 3.47 → 3.14 s, and the photo-hero pages are within run-to-run noise.

### 3.6 Route matrix (production build, fixture data)

Every route returned the expected status with one `h1`. The `lang`/`dir` pair is `ar`/`rtl` or `en`/`ltr`, and every page is `noindex` on this staging build. Product fixtures are `noindex, nofollow`. JSON-LD is `Organization` everywhere, plus `BreadcrumbList` on inner pages. There are no `Product`, `Offer` or rating markups. Both 404 cases (unknown path, unknown or draft slug) return status 404 with the full localized page in the HTML.

| Route | `/ar` | `/en` |
|---|---|---|
| Home, About, Poultry solutions, Broilers, Layers, Breeders, How we work, Products (plain, filtered, no-match), Knowledge, Contact (plain, `?type=farm`), Partner, Privacy | 200 | 200 |
| Product detail (approved fixture) | 200 | 200 |
| Product draft `fixture-draft-delta` | 404, server-rendered | 404, server-rendered |
| Unknown path / unknown slug | 404, server-rendered | 404, server-rendered |

Titles, robots, JSON-LD types and response sizes for each URL are in `docs/evidence/final/route-matrix-3200.json`.

## 4. Coverage of the tests the spec requires (§ 16.1)

| Spec § 16.1 requirement | Where |
|---|---|
| Metrics render with qualifiers, descriptions, locale handling | `metrics-copy.test.ts`; content-integrity spec |
| Publication guard hides draft / review-required entries | `publication-guard.test.ts`; `cms.spec.ts`; journey 7 |
| Arabic search normalisation does not destroy valid text | `search-normalize.test.ts` |
| Facets compose and reset; pagination stable | `catalog-params.test.ts`, `catalog-ui.test.ts`; journey 2 |
| Server validation rejects malformed input and accepts a valid inquiry | `inquiries.test.ts`, `inquiries-action.test.ts`; `forms.spec.ts` |
| Logo component does not stretch or recolour | `logo.test.tsx` |
| CMS login, role permissions, CRUD on an approved product | `cms.spec.ts`, `security.spec.ts` (through the REST API) |
| Unapproved product 404 / noindex; missing image safe | Journey 7; content-integrity CI-03. A product without an approved image shows its category's editorial photo, never a fake pack shot (`ProductCard.tsx`). The fixture products have no images, so every fixture card and detail page in the e2e and screenshot runs uses this path. |
| Real submission persisted with source, type, segment, product context | journeys 1 and 2 (read back through the sales REST API) |
| Rate limit; duplicates do not create duplicate leads | `forms.spec.ts`; `inquiries-rate-limit.test.ts` |
| English route maps to a valid page; Arabic RTL stays correct | `navigation.spec.ts`; route matrix |
| Journey 1: home → scroll → segment → contact → submit → recorded | `journeys.spec.ts` J1 |
| Journey 2: catalogue → filter → product → inquire → admin reads product-linked inquiry | `journeys.spec.ts` J2 |
| Journey 3: mobile nav → About → EN → AR | `navigation.spec.ts` (journey 3) |
| Journey 4: keyboard-only menu, dialog, accordion, form errors and success | `keyboard-motion.spec.ts`, `navigation.spec.ts`, `forms.spec.ts` |
| Journey 5: reduced motion reveals all text | `keyboard-motion.spec.ts` |
| Journey 6: zero products → empty state → request CTA | `journeys.spec.ts` J6 (dev server, real empty database) |
| Journey 7: direct reload of every route, missing slug 404, malformed query | `navigation.spec.ts`, `journeys.spec.ts` J7, `links.spec.ts` |
| Journey 8: forced persistence failure → error, never fake success | `journeys.spec.ts` J8 |

## 5. Defect log (spec § 16.5 format)

Sources: the QA round (`docs/evidence/visual-qa.md`, `accessibility.md`, `security-review.md`, `content-integrity.md`, `e2e-summary.md`, `docs/performance-report.md`) and the final round, whose IDs start with FR. Owner for every fix: Claude Code (fix-round agents, then the orchestrator).

### Fixed

| ID | Sev | Where (route · viewport) | Expected → actual (before the fix) | Fix | Verified by |
|---|---|---|---|---|---|
| E2E-F1 | **P0** | Inquiry forms with cross-field rules (contact farm/general/product, partner, segment pages, catalogue compact forms) · all | An incomplete submit should list every missing field and keep focus on the summary → the errors flashed and vanished, focus dropped to `<body>`, nothing was sent and nothing was said | `kindRequirements` + `validateInquiry` shared by the client and the server action | `forms.spec.ts` (desktop + mobile); `inquiries.test.ts` |
| SEC-01 / E2E-F4 | P1 | Inquiry server action | 5 per 10 min per client → rotating a client-sent IP header gave a new bucket each time | Only `INQUIRY_IP_HEADER` is trusted; global cap in production when unset | `inquiries-rate-limit.test.ts`; `forms.spec.ts` |
| SEC-03 | P1 | CMS approval workflow | Only approvers publish; edits need re-approval → a non-approver's edit stayed live; a duplicate copied the approval | `approvalGuard`, `resetOnDuplicate` | `publication-guard.test.ts`; `cms.spec.ts` |
| SEC-05 | P1 | Dependencies | No reachable advisories → next 16.3.5 had cache-poisoning advisories reachable with self-hosted ISR | next 16.3.8, sharp 0.35.5, undici / dompurify overrides | `pnpm audit` |
| VQA-01 | P1 | Display headings · all | Full Arabic glyphs → the reveal mask clipped dots and diacritics («في» read as «فى») | Mask padding measured from real glyph ink; hidden offset 170 % | glyph-ink test in `screenshots.spec.ts` |
| VQA-02 | P1 | Masthead · 1024–1239 px | One-line nav → labels wrapped; the active underline struck through them | No-wrap labels, compact spacing between lg and xl | measured 1024–1440, AR and EN |
| PERF-1 | P1 | Key pages · mobile | Hero image fetched first → requested at Low priority while the logo got high | `fetchPriority="high"` + eager on priority photos; logo no longer high | CDP request priorities; Lighthouse re-run |
| A11Y-1 / E2E-F3 | P1 | `/ar` and `/en/knowledge` · < 640 px | Scrollable by keyboard → axe `scrollable-region-focusable` | Labelled region, `tabIndex=0`, focus ring | `a11y.spec.ts` |
| A11Y-2 | P1 | Product cards | Visible focus (WCAG 2.4.7) → none | 3 px ring via `:has()` | computed style, screenshots |
| A11Y-3 | P1 | Category tiles on segment pages | Visible focus → ring clipped by `overflow: hidden` | Ring moved to the list item | `/ar/solutions/broilers` check |
| FR-5 | P1 | New proxy code (found in review before release) | Server-side lookup origin from configuration → it came from the request's Host header (blind SSRF) | Origin from `INTERNAL_SITE_ORIGIN` / `SITE_URL` only | `proxy.test.ts` (forged Host case) |
| FR-11 | **P0** | Repository (release) | A fresh clone builds → `pnpm build` failed: `src/components/media/Photo.tsx`, used by every page, had never been committed, because the unanchored `media/` ignore rule matched it. The working copy was unaffected, so no other run had shown it. | Ignore rules anchored to the root; component committed (78d9a02) | Clean-checkout run: install, typecheck, lint, unit, seed, build, serve (`docs/evidence/final/clean-checkout.txt`) |
| CI-03 | P2 | Every 404 · all | Server-rendered, readable without JS → blank `<html id="__next_error__">`. Root cause: in Next 16 a `notFound()` thrown during render is caught only on the client | Proxy rewrites unknown paths and missing slugs to a server-rendered `page-not-found` route with status 404 | content-integrity CI-03 (no-JS, ar + en); `proxy.test.ts`; `route-table.test.ts`; route matrix |
| E2E-F2 | P2 | Product inquiries | A field labelled optional is optional → it was required without a product or category | Rule removed | dev check |
| SEC-02 | P2 | Inquiry REST API | Status history is an audit trail → it could be overwritten | Rebuilt server-side on every update | `inquiries-lifecycle.test.ts`; REST probe |
| SEC-04 | P2 | Public REST API | Hidden data stays hidden → unverified manufacturer, unapproved label PDF / author and the internal metrics note were readable | `revealWhen` hooks, filter guard | REST probes; `security.spec.ts` |
| CI-01 | P2 | `/en` product pages | Arabic fallback text marked `lang="ar"` → unmarked | `fallbackLang` helper | content-integrity CI-01 |
| CI-02 | P2 | Veterinary catalogue views | The exact safety sentence → missing | Note shown on medicine / vaccine views | content-integrity CI-02 |
| VQA-03 | P2 | 404 · 1024 / 1280 | Numerals inside the page → the left "4" was cut | Container-query sizing | measured 320–1920 |
| VQA-04 | P2 | Home section headings | Heading before body copy → headings revealed last | Reveal tween resets `y` | measured |
| VQA-05 | P2 | About, How we work, Partner heroes | CTA above the laptop fold → below it | Spacing; partner hero composition | measured |
| VQA-06 | P2 | Home hero · 320–390 | Balanced headline, CTA in view → 6 lines with single-word rows, CTA cut | Phone-only headline sizes | measured (EN at 360 is 6 px past the ideal because of the EN review ribbon) |
| A11Y-4 | P2 | Form fields | The designed 3 px focus ring → never rendered | `focus:outline-none` removed | computed style |
| A11Y-5 | P2 | Language switch · all `/ar` pages | Name contains the visible label (2.5.3) → mismatch | Name in the target language containing "EN" / «ع» | axe, Lighthouse |
| FR-2 | P2 | Home hero · desktop | Photo parallax 24–48 px (spec § 5) → measured 0 px; the CSS intro animation owned the transform | Drift on its own layer, 6 % of the frame (≈ 27 px at 1440) | browser measurement 0.8 / 7.1 / 13.4 px at scrollY 200 / 400 / 600 |
| FR-4 | P2 | Inner pages with reveals in the first viewport (contact, knowledge, how-we-work, 404) · mobile | Content shown once → visible, then hidden, then animated, because the boot class landed 250–800 ms after first paint (Next runs `beforeInteractive` at bootstrap) | The reveal states (`html.reveal`) are switched on by the motion runtime after hydration, once first-screen content is marked revealed. `html.js` stays a pre-paint inline script for the About hero. The language switch is a full load. An intermediate fix (reveal states on before paint) removed the flash but hid first-screen reveals until hydration, which raised contact mobile LCP from 3.19 to 3.90 s; the final design avoids both. | Per-frame opacity sampling (the headline is visible from the first frame and never dips); Lighthouse contact mobile LCP (§ 3.5) |
| VQA-08 | P3 | Catalogue search · 390 | Placeholder fits → truncated | Shorter placeholder, trimmed padding | measured (320 still truncates; not required) |
| VQA-09 | P3 | Footer · < 1024 px | Compact footer → one column 1,689 px tall | Two-column grid (1,336 px at 390) | measured |
| VQA-10 | P3 | Header · < 1024 px | Menu button stays put → it swapped sides when the sticky bar appeared | Same inline-end group in both bars | measured |
| VQA-11 | P3 | Product detail · 320–768 | Inquiry action early → below the gallery | Actions before the gallery on phones | measured |
| SEC-08 | P3 | Inquiry server action | Invalid posts spend no rate-limit slot → they did | Validation first | `inquiries-action.test.ts` |
| SEC-09 | P3 | Media | Unknown-licence media private → public | Read access requires a known licence | unit-tested |
| CI-04 | P3 | Home `<title>` | Includes the brand → tagline only | Absolute title with the brand | route matrix |
| CI-05 | P3 | Approval register | Matches the site → two disagreements | Register updated | content-integrity re-check |
| CI-06 | P3 | 404 `<title>` | Stable → changed after hydration | Fixed with CI-03 | route matrix: «الصفحة غير موجودة \| الشروق» |
| BP-1 | P3 | Form pages | No CSP violations → zod's JIT probe was blocked (DevTools issue) | `z.config({ jitless: true })` in both schema modules | browser check: 0 `Function` probes |
| A11Y-6 | P3 | Catalogue · 390 | H1 → H2 → H3 → H1 then the card H3s | Visually hidden results H2 | outline check |
| A11Y-7 | P3 | Segment hero breadcrumb over photo | ≥ 4.5:1 → 3.8:1 at the worst pixel | Lighter link colour + top scrim | ≥ 7.9:1 measured |
| FR-1 | P3 | Every page with a status ribbon | Content inside landmarks → ribbon outside (axe best practice `region`) | Labelled region | axe best-practice sweep |
| FR-3 | P3 | Segment pages, articles | Reading-progress bar visible → always 0 px wide (Tailwind 4 `scale` × inline transform) | Inline start transform | browser measurement: 720 px at 50 % of 1440 |
| FR-6 | P3 | Logo component | Cannot be stretched → a caller's height class could override `h-auto` | Inline `height: auto` | `logo.test.tsx` |
| FR-7 | P3 | Dev tooling | No critical advisories → Vitest 4.0.18 (UI server, path traversal) | Vitest 4.1.11 | `pnpm audit` |
| FR-9 | P2 | Any production build served over plain HTTP · Safari / WebKit (desktop and iPhone) | The site loads → no CSS or JS. The CSP's `upgrade-insecure-requests` made WebKit request every asset over https; Chromium exempts localhost, so only the new cross-engine run caught it. HTTPS production is unaffected, but an HTTP staging server would be broken in Safari. | Directive sent only when `SITE_URL` is https (HSTS stays; browsers ignore it over HTTP) | WebKit run; regression test in `security.spec.ts` |
| FR-10 | P3 | Test harness · Firefox | The 320 px overflow test runs → `page.setViewportSize` hung 90 s in Playwright's Firefox driver before any navigation | The test creates a 320 px context instead | passes in Chromium, Firefox and WebKit |
| FR-12 | P3 | Fresh clone | `pnpm typecheck` passes → image imports failed TS2307 until a dev or build run had generated `next-env.d.ts` | `typecheck` runs `next typegen` first | clean-checkout run |
| FR-8 | P3 | README | Working e2e instructions → would fail (wrong build) | Correct commands; engine projects documented | followed in this run |

### Open (all P2/P3; owners and next steps in `docs/open-items.md`)

| ID | Sev | Item | Why it is open |
|---|---|---|---|
| PERF-2 | P2 | zod (≈ 97 KB transferred) in the client bundle of form pages | Needs a refactor of the shared schema (`zod/mini` or server-only validation) |
| LCP | P2 | Mobile LCP above the 2.5 s lab budget (simulated 4× CPU) | Render delay from main-thread work; see the performance report |
| VQA-07 | P3 | Some display headings end on a single word at 320–430 px | Best done after the licensed Thmanyah font changes the line breaks (OI-01) |
| VQA-12 | P3 | Vermilion share on inner pages below the 15 % brand guideline | Brand / art-direction decision (OI-19) |
| VQA-13 | P3 | Small licensed photo library reused across pages | Needs commissioned or approved photography (OI-08) |
| SEC-06 | P3 | CSP allows inline scripts | A nonce CSP forces dynamic rendering; decide with the host |
| SEC-07 | P3 | Staff login lockout can reveal and lock known accounts | Payload default; WAF throttling or SSO / MFA |
| SEC-10 | P3 | `Critical-CH` header from `withPayload` | Strip at the proxy / CDN |
| PERF-3 | P3 | ScrollTrigger's 60 Hz keep-alive on every page | Register ScrollTrigger lazily |

## 6. Polish rounds

1. **QA round (4 agents).** They wrote the a11y, security, content-integrity, journeys, forms, CMS, keyboard and screenshot specs. Results: 270 e2e tests, 224 passed / 6 failed / 40 skipped (`docs/evidence/e2e-run.txt`); 13 visual findings, 16 security and content findings, 11 accessibility / performance findings and 4 e2e findings, with before-state evidence in `screenshots/_sheets-qa-before/`.
2. **Fix round (2 agents).** 30 findings fixed and verified on the dev server. Their after-state captures are in `screenshots/dev/fe-fixes/`.
3. **Final round (orchestrator).**
   - Follow-ups from the fix agents, and the dependency upgrades (SEC-05, FR-7).
   - The server-rendered 404s (CI-03, CI-06).
   - The status ribbon landmark (FR-1).
   - New tests: the link crawl, analytics, logo, proxy and route table.
   - Three motion defects found while building the storyboard from the code (FR-2, FR-3, FR-4).
   - A security review of the new proxy code (FR-5).
   - A first cross-engine run in WebKit and Firefox (FR-9, FR-10).
   - A clean-checkout run from git (FR-11, FR-12).

   Every suite was re-run on the final build.

## 7. Edge conditions (gate G7.6)

| Condition | How it was tested | Result |
|---|---|---|
| Authentication and roles | `cms.spec.ts`, `security.spec.ts`: admin, approving editor, plain editor, sales, anonymous | pass |
| Publishing | Draft invisible; approve + publish → listed and 200; delete → 404 | pass |
| Empty states | Journey 6 on the real empty database: designed empty catalogue, request-list CTA; knowledge empty state | pass |
| Reduced motion | `keyboard-motion.spec.ts`; reduced-motion axe scans | pass |
| No JavaScript | CI-03 test in a JS-disabled browser (404s readable, ribbons present); no-JS captures in `docs/evidence/content-integrity/` | pass |
| Slow network + 4× CPU | Lighthouse mobile (simulated). Reveal check on the final production build with 4× CPU throttling at 390 px: the contact headline (a first-screen reveal) is visible from the first sampled frame and never dips; everything below reveals on scroll; client navigation still animates (`docs/evidence/final/reveal-contract-check.txt`) | measured |
| Validation errors | `forms.spec.ts`: empty submit, invalid phone, Arabic-Indic digits, missing consent, honeypot, double click, rate limit | pass |
| Forced server failure | Journey 8: server action forced to 500 → failure panel, retry, live-region message, no success, no record | pass |
| Malformed input | Journey 7: `<script>` and `page=-1` queries render safely; draft and unknown slugs return 404 | pass |
| Other browser engines | WebKit (desktop and iPhone 14) and Firefox: the navigation suite passes in all three (109 passed, 2 desktop-only skips) | pass |

## 8. Not covered

- **Real devices.** Phones and tablets were emulated (Pixel 7 and iPhone 14 profiles); no physical device was used.
- **Screen readers.** No NVDA, JAWS, VoiceOver or TalkBack pass. Recommended before launch with a native Arabic speaker.
- **Production hosting.** No hosting, CDN, TLS, real proxy headers (`INQUIRY_IP_HEADER`) or load tests; nothing is deployed.
- **Services not configured:** SMTP notifications and S3 uploads. PostgreSQL was verified separately (`docs/evidence/database-verification.md`); the e2e suite runs on SQLite.
- **The admin UI** was exercised through its REST API, not by clicking through the screens.
- **The licensed Thmanyah font is not installed** (OI-01). Arabic line breaks and the reveal masks must be re-checked after the swap.

## 9. How to reproduce

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium webkit firefox
cp .env.example .env            # set PAYLOAD_SECRET; SITE_URL=http://localhost:3100
pnpm typecheck && pnpm lint && pnpm test:unit
rm -f data/e2e.db && pnpm seed:e2e && pnpm build:e2e
pnpm start:e2e                  # in another terminal: http://localhost:3200
E2E_BASE_URL=http://localhost:3200 pnpm test:e2e
E2E_BASE_URL=http://localhost:3200 pnpm test:e2e:engines
E2E_BASE_URL=http://localhost:3200 pnpm screenshots
```
