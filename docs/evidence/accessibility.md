# Accessibility evidence (WCAG 2.2 AA, spec §12.2)

> **Status 2026-10-11 (final):** this is the QA-round record. A11Y-1–7 and BP-1 are fixed. PERF-1's image-priority fix is in, but the mobile LCP budget is still missed (`docs/performance-report.md`). PERF-2 and PERF-3 are open (`docs/open-items.md`). Final axe result: 0 violations in all 78 scans on the final build. See `docs/test-report.md` § 3.3.

Measured 2026-10-11 against the production fixture build. Every number here comes from a run listed below.
Automated scans do not replace a screen-reader pass (spec §12.2); that pass has not been done (see "Not covered").

## Method

- **Target:** production build on `http://localhost:3200` (`pnpm start:e2e`, `.next-e2e`) with the isolated fixture DB
  `data/e2e.db` (`DEMO_FIXTURES=true`: three approved `[TEST]` products, one unapproved draft, demo banner, no articles).
- **Automated:** `tests/e2e/a11y.spec.ts` uses axe-core 4.13.0 through `@axe-core/playwright` with the tags
  `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`. Before each scan the page is loaded, scrolled top to bottom so every
  scroll-triggered reveal runs, scrolled back to the top and left 1.4 s to settle. The suite fails on any violation.
- **Coverage (78 scans):** all 15 public routes/states in `docs/site-map.md` in AR and EN at 1440×900 and 390×844 (60),
  plus these states: `/ar` sticky compact bar (scan limited to the bar), `/ar` solutions dropdown open, `/ar` and `/en` with
  `prefers-reduced-motion: reduce` at both widths, product inquiry drawer open on `/ar|en/products/fixture-feed-alpha`
  at both widths, contact form after an empty submit (errors shown) at both widths, mobile menu open (`/ar`, `/en`),
  mobile filter drawer open (`/ar|en/products`).
- **Run:** `E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test tests/e2e/a11y.spec.ts --project=desktop --reporter=list`
  and then `node scripts/axe-summary.mjs`. Final run: **74 passed, 2 failed (3.4 min)**. Both failures are the real defect A1 below.
- **Evidence:** per-scan JSON in `docs/evidence/axe/<locale>-<page>-<viewport>[-state].json`, aggregate in
  `docs/evidence/axe/summary.json`.

## axe results

| Route | AR 1440 | AR 390 | EN 1440 | EN 390 |
|---|---|---|---|---|
| `/` (home) | 0/25 | 0/21 | 0/55 | 0/40 |
| `/about` | 0/6 | 0/6 | 0/20 | 0/19 |
| `/poultry-solutions` | 0/19 | 0/15 | 0/41 | 0/34 |
| `/solutions/broilers` | 0/11 | 0/11 | 0/34 | 0/33 |
| `/solutions/layers` | 0/12 | 0/12 | 0/34 | 0/33 |
| `/solutions/breeders` | 0/13 | 0/13 | 0/33 | 0/32 |
| `/products` | 0/9 | 0/0 | 0/25 | 0/24 |
| `/products?q=zzzz-no-match` (empty result) | 0/8 | 0/0 | 0/21 | 0/20 |
| `/products/fixture-feed-alpha` | 0/7 | 0/0 | 0/24 | 0/23 |
| `/how-we-work` | 0/7 | 0/0 | 0/23 | 0/22 |
| `/knowledge` | 0/7 | **1**/10 | 0/20 | **1**/28 |
| `/contact` | 0/6 | 0/0 | 0/21 | 0/20 |
| `/partner-with-us` | 0/7 | 0/0 | 0/22 | 0/21 |
| `/privacy` | 0/6 | 0/0 | 0/19 | 0/18 |
| designed 404 | 0/7 | 0/0 | 0/19 | 0/18 |

Cells are *violating nodes / incomplete nodes* (incomplete means axe needs a human to check it; see "Manual contrast" below).
All 18 state scans (dropdown, sticky bar, reduced motion, drawers, menus, form errors) had **0 violations**.

### Violations

| # | Rule (WCAG) | Impact | Nodes | Route / viewport | Fix |
|---|---|---|---|---|---|
| A1 | `scrollable-region-focusable` (2.1.1 Keyboard) | serious | 1 | `/ar/knowledge` and `/en/knowledge` @390 | Below 640px the topic list `ul.snap-x … overflow-x-auto` (`src/components/sections/knowledge/TopicTiles.tsx:42`) scrolls sideways, but when there are no articles (`linkable` is false, which is the real state today) none of its tiles is focusable. Keyboard users cannot reach tiles 2–4. Wrap the scroller in `<div role="region" aria-label={t.title} tabIndex={0}>` with a visible focus style, or stack the tiles vertically when they are not links. |

## Manual and scripted checks

### Keyboard focus visibility (2.4.7, 1.4.11, 2.4.11)

Real <kbd>Tab</kbd> traversal of 8 page/viewport pairs (345 tab stops). At each stop the script took a crop with the
element focused and another with it blurred, then pixel-diffed the two. It also checked whether a fixed or sticky
element covered the focused element, on a forward pass and on a <kbd>Shift</kbd>+<kbd>Tab</kbd> pass.
Data: `docs/evidence/focus/focus-audit.json`. Images: `focus-grounds-ar-1440.png` (light, warm and dark grounds) and
`focus-spotcheck.png` (vermilion ground, the failures, dialogs).

| Page @ viewport | Tab stops | Visible indicator | No visible change | Obscured (fwd / Shift+Tab) |
|---|---|---|---|---|
| `/ar` @1440 | 50 | 47 | 3 product-card links | 0 / 0 |
| `/ar/products` @1440 | 46 | 43 | 3 product-card links | 0 / 0 |
| `/ar/products/fixture-feed-alpha` @1440 | 35 | 35 | – | 0 / 0 |
| `/ar/contact` @1440 | 42 | 42 | – (see note on radios) | 0 / 0 |
| `/ar/knowledge` @1440 | 31 | 31 | – | 0 / 0 |
| `/ar/solutions/broilers` @1440 | 48 | 42 | 4 category-tile links, 2 product-card links | 0 / 0 |
| `/en` @1440 | 50 | 47 | 3 product-card links | 0 / 0 |
| `/ar` @390 | 43 | 40 | 3 product-card links | 0 / 0 |

- **Grounds:** the indicator was measured against the colour it replaces. Light: `#fe3300` ring on white, 3.69:1.
  Warm: `#fe3300` on `#f6f5f3`, 3.39:1. Dark: amber `#feb821` on black, 12.09:1. Vermilion: black ring on `#fe3300`, 5.69:1.
  The vermilion ground was checked with a probe link injected into the Journey section, because that section has no
  focusable element of its own. All four pass 3:1.
- **Radios (`/ar/contact`):** the diff flagged the radio inputs, but that is a false positive. The input is `sr-only` and
  the ring is drawn on the label card (`has-[:focus-visible]:outline-3`). It renders correctly (`focus-spotcheck.png`, row 4).
- **A2 — product cards have no focus indicator (fails 2.4.7).** `src/components/products/ProductCard.tsx:76`: the title
  link uses `focus-visible:outline-none` with no replacement, and the `<article>` has no `:focus-within` / `:has()` style.
  Focused and unfocused crops are pixel-identical. Seen on home featured products, `/products`, segment pages and `/en`.
  Fix: give the card a ring when its title link is focused, for example
  `has-[h3_a:focus-visible]:outline-3 has-[h3_a:focus-visible]:outline-offset-2 has-[h3_a:focus-visible]:outline-(--focus)`
  on the `<article>`, or an inset `after:` outline on the link.
- **A3 — category tile focus ring is clipped (fails 2.4.7).** `src/components/sections/solutions/CategoryTiles.tsx:81`:
  the link's `::after` gets `outline: 2px solid #fe3300; outline-offset: 2px`, but the `::after` covers the whole `<li>`
  and the `<li>` has `overflow: hidden`. The outline is therefore drawn entirely outside the clip and never shows (measured:
  `li overflow hidden`, crops identical). Fix: use a negative offset (`focus-visible:after:-outline-offset-4`), or remove
  `overflow-hidden` from the `<li>` (the image wrapper already clips the zoom).
- **A4 — the intended form-field focus ring never renders (weak indicator).** `src/components/forms/fields.tsx:49`.
  In the built CSS, `.focus\:outline-none:focus{--tw-outline-style:none;outline-style:none}` comes first, then
  `.focus-visible\:outline-3:focus-visible{outline-style:var(--tw-outline-style)…}`, so the 3px vermilion ring resolves to
  `outline-style: none`. Fields show only the 1.5px border change from stone-300 to ink. That is visible, so 2.4.7 passes,
  but it is weak. The same pattern is on the error summary (`InquiryFormClient.tsx:420`). Fix: add `focus-visible:outline-solid`,
  or drop `focus:outline-none`.
- No focused element was covered by the sticky bar on either pass (`scroll-padding-top: 6.5rem` works).

### Lighthouse accessibility audits (rules axe skips by default)

- **A5 — `label-content-name-mismatch` (2.5.3 Label in Name, Level A)** on every AR page. Lighthouse flags the footer link;
  the same markup appears in the header, the sticky bar and the mobile menu. The language link shows **"EN"** but its
  accessible name is `aria-label="اللغة: English"`. The Arabic word also sits inside a `lang="en"` element, so a screen reader
  voices it with the English voice. Fix: drop the `aria-label` and use visible text plus hidden text, e.g.
  `EN<span class="sr-only"> — English</span>`, and put any Arabic prefix outside the `lang="en"` element.
  The EN pages' link (visible "ع", name "Language: العربية") is not flagged.
- **A6 — `heading-order`** on `/ar/products` at mobile width: H1 is followed directly by the product-card H3s. On mobile the
  filter heading is inside the closed drawer. Outline: `H1 كتالوج… | H3 [اختبار]… ×3 | H2 لم تجد المنتج…`. This is a best
  practice, not a WCAG failure. Fix: add an H2 (it can be visually hidden) before the results grid.

### Manual contrast (axe "incomplete": 1,286 nodes it could not resolve)

axe could not judge these nodes because of `link-sweep` underline gradients, the button sweep pseudo-elements, or overlap.
To cover them, every visible text element on 12 routes × AR/EN × 1440/390 was compared against its effective solid
background, under reduced motion. Data: `docs/evidence/axe/manual-contrast-scan.json`.

- **No real failures on solid grounds.** Everything the heuristic flagged is exempt:
  - the zero-count facet (`span aria-disabled="true"`, 2.71:1) is an inactive component;
  - the giant `01/02/03` numerals on `/poultry-solutions` are `aria-hidden`, decorative, and outlined with text-stroke.
- **Text over photos** (segment heroes) was measured on the real pixels. The script hid the text, screenshotted the hero,
  and took the 5th-percentile worst background pixel under each text box. broilers, layers, breeders and `/en` broilers all
  pass at 1440 and 390 (min 5.14:1), except:
  - **A7 —** the `/ar/solutions/breeders` @390 breadcrumb link «حلول الدواجن» (15px, `text-stone-300`) measures
    **4.46:1** at the 5th percentile and 3.8:1 at the worst pixel, against 4.5:1 required. It is marginal and comes from
    the bright ceiling lights in the photo (`docs/evidence/axe/manual-breeders-breadcrumb-390.png`). Fix: use `text-paper`
    for breadcrumb links on photo heroes, or deepen the top of the overlay gradient.
- The scroll-linked hero fade on `/ar` is not a problem. axe's 2.43:1 hit in an early "scrolled" scan came from the hero
  fading *after* it had left the viewport. A probe (`docs/evidence/lighthouse/idle-animations.json`, `heroScrollFade`)
  shows the H1 opacity stays 1.0 while any of it is visible. The sticky-bar scan is now limited to the bar.

### Reflow, zoom, motion

- **200% zoom at 1280** (emulated as a 640×400 CSS viewport at DPR 2) on `/ar` and `/ar/contact`: no horizontal overflow
  (`scrollWidth − innerWidth = 0`), and a script found **0** text boxes clipped by an `overflow:hidden|clip` ancestor,
  ellipsis or line-clamp. A visual review of the contact sheets (`docs/evidence/zoom/zoom200-*.jpg`) agrees: the layout
  reflows to the single-column mobile layout with nothing clipped. Data: `docs/evidence/zoom/zoom200-scan.json`.
- **320px reflow** is covered by `tests/e2e/navigation.spec.ts` ("no horizontal overflow at 320px"), which passes.
- **Reduced motion and no-JS:** on 9 key routes at 1440 and 390, both under `prefers-reduced-motion: reduce` and with
  JavaScript disabled, **no text in `<main>` was left invisible** (opacity < 0.5). The reduced-motion axe scans are clean.
- **Idle animation:** 0 running CSS/Web Animations on `/ar` after 6 s idle (1440, 390, reduced, after a full scroll).
  GSAP ScrollTrigger keeps a 60 Hz `requestAnimationFrame` loop running, even under reduced motion (see performance report).

### Navigation spec

`tests/e2e/navigation.spec.ts` (routing, locale switch, skip link, keyboard dropdown, mobile menu dialog, 320px overflow):
**72 passed, 2 skipped** (the desktop-only keyboard tests skip on the mobile project) on desktop and mobile. No test bugs.

## Not covered (cannot be tested here)

- Article detail `/knowledge/[slug]`: the fixture DB has no approved article.
- A screen-reader pass (NVDA/VoiceOver) and real speech-control testing were not run.
- Payload admin (`/admin`) is third-party UI and was not scanned.
- Draft-preview banner states (they need an editor session).

## Re-run after fixes

```bash
E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test tests/e2e/a11y.spec.ts --project=desktop --reporter=list
node scripts/axe-summary.mjs
```

Note: concurrent Playwright runs share `test-results/`. In the first full run, three scans failed with
`ENOENT …/.playwright-artifacts-N/traces` because another run had cleared the directory. Pass `--output <own dir>` when
several agents run tests at once.
