# Visual QA evidence — 2026-10-11 (spec §16.2 viewport matrix, §16.3 visual regression checklist)

> **Status 2026-10-11 (final):** this is the QA-round record. VQA-01–06 and VQA-08–11 are fixed; VQA-07, VQA-12 and VQA-13 are open P3 items (`docs/open-items.md`). The final screenshot matrix (143 / 143) and its review are in `docs/test-report.md` § 3.4. The pre-fix contact sheets cited below are kept in `screenshots/_sheets-qa-before/`.

**Target:** production build on `http://localhost:3200` (isolated fixture DB `data/e2e.db`, `DEMO_FIXTURES=true`: three
approved `[TEST]` products, no articles, black "demo data" banner at the top of every page). Empty states were
checked separately on the dev server `http://localhost:3100` (real dev DB: zero products, zero articles).
**Browser:** Chromium via `@playwright/test` 1.64. Phones (≤ 430 px) use a touch/mobile context (`isMobile`, `hasTouch`);
768 px and up use a desktop context; device scale factor 1. No physical device, Firefox or WebKit run.

## Reproduce

```bash
E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test --project=screenshots   # captures + checks
python scripts/visual-qa-sheets.py                                                   # contact sheets + colour table
```

## Run results (actual output)

| Run | Result |
|---|---|
| `--project=screenshots` (141 capture tests, final evidence run) | **141 passed** (5.3 min) |
| `--project=screenshots --grep "glyph ink"` (glyph-integrity check, added after the run above) | **2 failed**: real defect VQA-01 (see below). These 2 tests should pass once VQA-01 is fixed |
| `tests/e2e/navigation.spec.ts`, projects desktop + mobile | **72 passed, 2 skipped** (keyboard-only tests skip on mobile by design), 1.1 min. No test changes needed |

Objective checks recorded on all 141 captures (`docs/evidence/visual-qa-metrics.json`, one entry per capture):
horizontal overflow **0 px at every viewport, including 320** · console errors / page errors **0** (the expected 404
document response on `/ar/missing-page` is excluded) · broken images **0** · `/ar/missing-page` returns **404** ·
sticky compact bar shown mid-page and released back at the top (ar + en, 390 + 1440) · first contact-form field
**not covered** by fixed elements at 390 or 1440 (`elementFromPoint` at three points after `scrollIntoView`).

Captures: 146 viewport, full-page and overlay PNGs under `screenshots/ar|en/<route>/`, 79 film-strip frames
(`screenshots/<locale>/home/scroll-<vp>/NN.png`), 4 dev empty-state captures in `screenshots/dev-empty/`.
Disk use is about 80 MB (ar 49 MB, en 19 MB, sheets 12 MB). Decide before committing whether to keep only `_sheets/`.

## Findings (most severe first)

| ID | Sev | Route(s) | Viewport | Problem | Evidence | File (best guess) |
|---|---|---|---|---|---|---|
| VQA-01 | **P1** | /ar/about, /ar/how-we-work, /ar/solutions/broilers, /ar/products/[slug], /ar (closing band) | all | The line-reveal mask cuts Arabic dots and diacritics, so «في» renders as «فى», «تجريبي» as «تجريبى», and the tanween in «شريكًا» loses a stroke | `screenshots/_sheets/mask-line-clipping.jpg`; failing test `display line masks keep glyphs intact` | `src/styles/globals.css` `@utility mask-line` (l.313–322) |
| VQA-02 | **P1** | every page (masthead) | 1024–1179 (ar), 1024–1239 (en) | Desktop nav labels wrap onto 2–3 lines. On the active page the vermilion underline runs through the second line, so it looks struck through | `screenshots/_sheets/nav-wrap-1024.jpg`, `screenshots/ar/about/1024.png`, `screenshots/en/home/1024.png` | `src/components/layout/Header.tsx` (`DesktopNav`, `NavDropdown`) |
| VQA-03 | P2 | /ar/missing-page (404) | 1024, 1280 | The left "4" of the giant 404 numerals is cut off by the left viewport edge | `screenshots/_sheets/404-numerals-clipped.jpg` | `src/app/(frontend)/[locale]/not-found.tsx:29` |
| VQA-04 | P2 | /ar, /en (all section headings) | all | Section h2s reveal last. The eyebrow and body copy are already visible while the heading is still hidden about 1 s after the section is in view, which inverts the hierarchy during fast scrolling or anchor jumps | `screenshots/_sheets/reveal-latency.jpg` (frames taken 950 ms after each jump) | `src/components/motion/MotionRuntime.tsx` (lines reveal / late-node delay) |
| VQA-05 | P2 | /ar/about, /ar/how-we-work (also /ar/partner-with-us) | 1024–1440 desktop, phones | Inner-page heroes carry 112–160 px of empty space above the breadcrumb, while the other inner pages use 32–56 px. The hero CTA falls below the fold at 1024×768 and 1280×800 and is cut at 1440×900 | `screenshots/_sheets/inner-hero-spacing.jpg`, `screenshots/ar/how-we-work/{1024,1280,1440}.png`, `screenshots/ar/partner-with-us/{1024,1280,1440}.png` | `src/components/sections/about/AboutHero.tsx:29`, `src/components/sections/how-we-work/ProcessHero.tsx:22` |
| VQA-06 | P2 | /ar, /en (home hero) | 320–390; en 1280×800 | At 320 the h1 breaks into 6 lines, three of them a single word (صناعة / الدواجن، / مرحلة), and both CTAs sit below the 720 px fold (ar + en). At 360–390 the primary CTA is cut by the fold (with the demo banner). In en at 1280×800 the 3-line headline pushes the CTAs onto the fold edge | `screenshots/_sheets/hero-cta-fold.jpg` | `src/components/sections/home/Hero.tsx`, display clamp in `src/styles/globals.css` |
| VQA-07 | P3 | several | mostly 320–430 | Display headings end on a single word, e.g. partner h1 «لنناقش توزيع / منتجاتك» (320–430), about h1 «في دورة / الإنتاج.» (320–360), «نطاق عملنا / بالأرقام» (about h2 at 1024/1280/1920), privacy h1 (320–360), segment h1 «كل دورة / تسمين» (320) | `orphans` field in `docs/evidence/visual-qa-metrics.json` (53 of 141 captures have at least one) | `TextReveal` / `SectionHeading` |
| VQA-08 | P3 | /ar/products | 320–430 | The search placeholder «ابحث بالاسم أو الشركة المصنعة أو كود المنتج» is truncated mid-word («…الشركة المد» at 390) | `screenshots/_sheets/search-placeholder.jpg` | `src/i18n/dictionaries/ar/products.ts:26` (+ en) |
| VQA-09 | P3 | every page (footer) | < 1024 | The footer stays a single column below `lg`: 1689 px tall at 390 (2.0 screens) and 1581 px at 768 (1.5 screens; 591 px at 1440). Short mobile pages end in about two screens of black (the 404 at 390 is 64 % black) | `screenshots/ar/missing-page/390-full.png`, colour table below | `src/components/layout/Footer.tsx:41` |
| VQA-10 | P3 | every page | < 1024 | The menu button changes sides when the sticky bar takes over: far left in the masthead (ar) but far right in the sticky bar, and mirrored in en | `screenshots/ar/home/390.png` vs `screenshots/ar/home/390-middle.png` | `src/components/layout/Header.tsx:90` vs `:107` |
| VQA-11 | P3 | /ar/products/[slug] | 320–768 | The primary action «استفسر عن المنتج» sits below the arch image, so it is not visible in the first viewport on phones or at 768 | `screenshots/ar/products-fixture-feed-alpha/{390,768}.png` | `src/components/products/ProductDetailView.tsx` |
| VQA-12 | P3 | inner pages | all | Vermilion share is far below the brand ratio (15 %): 0.3–2.3 % of pixels on inner pages and about 8 % on home. Amber stays ≤ 0.2 % (within ≤ 5 %). Flag for brand / art-direction review, not necessarily a defect | colour table below | — |
| VQA-13 | P3 | home, partner, knowledge, solutions, product cards | all | A small photo library is reused heavily: the amber-bottle photo appears on at least five surfaces and the feeder photo on four | `screenshots/_sheets/ar-home-1440-full.jpg`, `ar-partner-with-us-full.jpg`, `ar-knowledge-full.jpg`, `ar-solutions-broilers-full.jpg` | `src/content/photos.ts` usage |

No P0 found: no broken page, unsafe content or false claim was visible in any capture. Fixture content is clearly
labelled `[TEST]` / `[اختبار]` and the demo banner is present.

### Details and suggested fixes

**VQA-01: mask clips Arabic glyphs (P1).** `.mask-line { overflow: clip; overflow-clip-margin: .12em; padding-block: .06em }`
allows only about 0.18 em below and above the line box. Display-size Arabic needs more for the dots under ي/ب and
for tanween and hamza. Measured with masks at rest (reduced motion: final state, no scroll-linked motion) by
capturing each visible `.mask-line` as rendered and again with `overflow: visible`, counting pixels that differ by
more than 40/255:

| Viewport | Lines checked (11 routes) | Lines with lost ink |
|---|---|---|
| 390 | 63 | about «في دورة الإنتاج.» 84 px · broilers «احتياجات الإمداد في مزارع التسمين» 46 px · product «[اختبار] منتج أعلاف تجريبي» 45 px · how-we-work «ثلاثة مبادئ في كل طلب» 46 px |
| 1440 | 63 | home «مزرعتك تستحق شريكًا» 248 px (tanween) · about «في دورة الإنتاج.» 420 px · broilers «كيف نساعدك في طلب المنتجات» 132 px · product h1 114 px · how-we-work 113 px |

Fix: release the clip once a line has revealed, for example
`[data-revealed] .mask-line, html.motion-off .mask-line { overflow: visible }` (and the same for manual timelines
when they complete). Alternatively, enlarge the allowance for Arabic (`padding-block: .15em .35em; margin-block: -.15em -.35em`).
Then re-run `--grep "glyph ink"`; it must pass at 390 and 1440.

**VQA-02: nav wrap (P1).** Text-line probe of the masthead nav. ar: 1024 and 1100 wrap «عن الشروق», «حلول الدواجن»
and «كيف نعمل»; one line from 1180. en: 1024 «How we work» on 3 lines and «Poultry solutions» on 2; still wrapping
at 1180; one line from 1240. Fix: add `whitespace-nowrap` to nav links and buttons, and either switch to the menu
button below `xl` (1280) or tighten the `lg` gaps and type size so all items fit at 1024 in both locales.

**VQA-03: 404 numerals (P2).** `text-[clamp(7.5rem,3rem+20vw,19rem)]` gives about 253 px at 1024, which is wider than
the 6-column span. RTL `justify-end` pushes the overflow past the left edge, where the section's `overflow-hidden` crops it.
Cap the `lg` size (for example `lg:text-[clamp(9rem,1rem+13vw,19rem)]`) or give the numerals 7 columns.

**VQA-04: heading reveal latency (P2).** Probe after an instant jump that puts the closing h2 mid-viewport: inner span
`translateY` 248 px at +157 ms, 242 px at +606 ms, 125 px at +1218 ms, `data-revealed` at +2004 ms. Body copy
(`data-reveal="up"`) is already visible. In the 950 ms film strip, headings were missing in ar 1440 frames 05/09/21,
en 1440 frames 04/05/10/13/18 and ar 390 frames 05/06/11/18/20/23/26/27. The final spec waits 2.2 s per frame, so
the committed strips show the settled state. Fix: start `lines` reveals earlier (for example `top 92%`), skip the
late-node delay for elements already in view, keep the line duration ≤ 0.8 s, or reveal headings before body copy.

**VQA-05: inner hero spacing (P2).** About and How-we-work use `pt-28 sm:pt-32 lg:pt-40`. Catalogue, product, contact,
knowledge and privacy use `pt-8 … lg:pt-14`. Align them to the shorter rhythm. Partner (`pt-10 lg:pt-14`) has the same
CTA-below-fold symptom at 1024–1440 because of its large h1 and long intro, so tighten its type step or intro length.

**VQA-06: home hero at small widths (P2).** Lower the display clamp minimum for ≤ 360 px (for example about 2.25 rem) or
let the two authored lines balance (`text-wrap: balance` on each line) so that 320 shows 2 words per line and the CTA
fits in the first 720 px. In production the `DEMO_FIXTURES` banner line (about 58 px on phones) is absent, which makes
ar 360–390 borderline rather than failing. In en the «English version — editorial review pending» line stays until
`englishApproved` is set (`EditorialBanner.tsx`). 320 still fails without any banner.

**VQA-07 to VQA-13:** fixes are listed in the table. For orphans, `text-wrap: pretty` on `.mask-line > span` and on
`h1–h3` is the cheapest first step.

## §16.3 checklist

| Item | Result | Evidence |
|---|---|---|
| Hero subject not cropped incorrectly, headline no overlaps, CTA visible without excessive scrolling | **Partly.** Subjects are well cropped (home arch, segment, about aerial, product arch); no headline overlaps; CTA below fold at 320 home, laptop heights on how-we-work/partner (VQA-05/06) | `*-phones.jpg`, `*-large.jpg` |
| Arabic joins and line breaks; no text outside viewport; no weird short lines | **Fail.** Joins correct, nothing outside the viewport (overflow 0; off-viewport hints are only intentional scrollers or clipped parallax images), but dots and diacritics are clipped (VQA-01) and headings end on a single word (VQA-07) | `mask-line-clipping.jpg`, metrics JSON |
| Logo shape, clear space, contrast; header uses the proper version | **Pass.** Colour lockup on the white masthead (112 px phones / 140 px desktop, never shrunk in the sticky bar); white lockup on the black menu and footer; no stretching seen | `overlays-mobile.jpg`, any masthead |
| Colour balance credible (white 55 / black 25 / red 15 / amber ≤ 5); no template gradients | **Partly.** Home ≈ 41–51 % white + warm grey, 26–28 % black, 8 % vermilion, ≤ 0.2 % amber; inner pages are low on red (VQA-12). The sunrise disc in the closing band uses a vermilion→amber gradient that reads as a brand device; flagged for art direction only | table below, `ar-home-scroll-1440-2.jpg` frame 22 |
| Section rhythm; no ghost columns, cropped buttons or fixed elements covering form fields (mobile) | **Partly.** No ghost columns or cropped buttons; contact field clear of the sticky bar (`scroll-padding-top` works); inconsistent hero top padding (VQA-05) and a very tall mobile footer (VQA-09) | `*-full.jpg`, `overlays-*.jpg` |
| Sticky behaviour releases correctly; no pin gaps or jumps | **Pass.** No GSAP pins in the codebase. The FarmTypes CSS-sticky media frame swaps 01→02→03 and releases at section end; the Values heading stays sticky at xl; the compact bar shows and releases (asserted) | `ar-home-scroll-1440-1.jpg` frames 06–09, `en-home-scroll-1440-2.jpg` frames 15–16 |
| Footer, legal, nav and forms function; images have proper aspect ratio and licence/provenance | **Pass (visual).** Footer, privacy, language and back-to-top are present on every page; images are cover-cropped and none are stretched. Provenance is documented in `docs/image-provenance.md` and was not re-verified here | `*-full.jpg` |
| Reduced-motion and low-network experiences | **Not tested here** (reduced motion is used only for the glyph check) | — |
| No console.error, hydration mismatch, broken images, dead links, unresolved placeholders | **Pass** for console and page errors and broken images on 141 captures; no unresolved placeholders seen. Dead links not tested here | metrics JSON |
| EN LTR mirroring | **Pass.** Masthead, nav order, dropdown alignment, menu layout, journey flow (en ends at the right with «Your farm»; ar ends at the left with «مزرعتك») and footer all mirror | `en-*.jpg`, `overlays-*.jpg` |
| Empty states | **Pass.** dev :3100: catalogue «نضيف المنتجات إلى الكتالوج الرقمي» with a request-list CTA, category browse and form; home «الكتالوج الرقمي قيد الإعداد»; segment resources empty state; knowledge «لا توجد مقالات منشورة بعد» (also on :3200) | `screenshots/_sheets/dev-empty-states.jpg`, `ar-knowledge-full.jpg` |
| Horizontal overflow at 320 | **Pass:** 0 px on all 12 routes | metrics JSON |

## Colour balance (measured)

Pixel classes on full-page captures downsampled ×4: white ≥ 252, warm/light grey (neutral 225–251), black ≤ 45,
vermilion (#FE3300 family), amber (#FEB821 family), and photo/other. Produced by `scripts/visual-qa-sheets.py`.

| Capture | White | Warm/light grey | Black | Vermilion | Amber | Photo/other |
|---|---|---|---|---|---|---|
| ar/home 1440 | 25.3 | 25.5 | 26.8 | 8.1 | 0.0 | 14.3 |
| ar/home 390 | 21.0 | 19.2 | 28.0 | 8.1 | 0.1 | 23.6 |
| en/home 1440 | 23.7 | 27.4 | 25.5 | 8.4 | 0.2 | 14.8 |
| en/home 390 | 20.8 | 20.1 | 27.4 | 8.9 | 0.1 | 22.7 |
| ar/about 1440 / 390 | 42.1 / 34.2 | 17.7 / 15.1 | 28.3 / 33.2 | 0.3 / 0.6 | 0 / 0 | 11.5 / 17.0 |
| ar/solutions/broilers 1440 / 390 | 31.3 / 19.7 | 30.2 / 31.4 | 26.7 / 28.8 | 0.4 / 0.9 | 0 / 0.1 | 11.4 / 19.1 |
| ar/products 1440 / 390 | 50.6 / 31.4 | 3.0 / 5.1 | 33.9 / 43.1 | 0.5 / 0.7 | 0.1 / 0.1 | 11.9 / 19.5 |
| ar/products/[slug] 1440 / 390 | 38.6 / 26.5 | 2.0 / 2.6 | 44.9 / 54.4 | 1.3 / 2.3 | 0 / 0.1 | 13.0 / 14.2 |
| ar/contact 1440 / 390 | 38.8 / 35.9 | 35.9 / 24.5 | 18.9 / 29.1 | 0.7 / 0.9 | 0 / 0 | 5.6 / 9.6 |
| ar/partner-with-us 1440 / 390 | 40.3 / 36.4 | 24.7 / 19.0 | 28.1 / 30.1 | 0.6 / 1.3 | 0.1 / 0.2 | 6.1 / 13.0 |
| ar/how-we-work 1440 / 390 | 58.4 / 43.3 | 16.8 / 16.0 | 19.1 / 27.9 | 0.7 / 2.0 | 0 / 0 | 4.8 / 10.7 |
| ar/knowledge 1440 / 390 | 23.4 / 17.3 | 41.1 / 27.1 | 19.8 / 39.0 | 0.8 / 1.3 | 0.1 / 0 | 14.8 / 15.3 |
| ar/privacy 1440 / 390 | 76.5 / 53.0 | 5.0 / 8.8 | 11.5 / 22.1 | 0.3 / 0.4 | 0 / 0 | 6.8 / 15.6 |
| ar/missing-page 1440 / 390 | 49.6 / 24.3 | 1.3 / 1.8 | 42.7 / 63.9 | 1.0 / 2.0 | 0 / 0 | 5.3 / 8.1 |

## Contact sheets (`screenshots/_sheets/`)

- **Viewport matrix**, per route: `<locale>-<route>-phones.jpg` (320/360/390/430 at native size) and
  `<locale>-<route>-large.jpg` (768–1920 scaled), for ar `home, about, solutions-broilers, products,
  products-fixture-feed-alpha, contact, partner-with-us, how-we-work, knowledge, privacy, missing-page` and en `home`.
- **Full pages:** `ar-home-390-full.jpg`, `ar-home-1440-full.jpg`, `en-home-390-full.jpg`, `en-home-1440-full.jpg`,
  and `ar-<route>-full.jpg` (390 and 1440 side by side) for every other route.
- **Home middle, footer and sticky bar:** `ar-home-middle-footer.jpg`, `en-home-middle-footer.jpg`, `ar-home-1440-footer.jpg`, `en-home-1440-footer.jpg`.
- **Film strips for scrubbed or sticky scenes:** `ar-home-scroll-1440-{1,2}.jpg`, `en-home-scroll-1440-{1,2,3}.jpg`, `ar-home-scroll-390-{1,2,3}.jpg`.
- **Overlays:** `overlays-mobile.jpg` (open menu ar/en, contact form in view 390), `overlays-desktop.jpg` (open dropdown ar/en, form 1440).
- **Finding evidence:** `mask-line-clipping.jpg`, `nav-wrap-1024.jpg`, `404-numerals-clipped.jpg`, `reveal-latency.jpg`,
  `inner-hero-spacing.jpg`, `hero-cta-fold.jpg`, `search-placeholder.jpg`, `dev-empty-states.jpg`.

## Method notes and limitations

- Full-page captures are taken at scroll position 0 after walking the page. Scroll-scrubbed scenes (journey flow,
  values grid, closing sunrise) therefore show their scroll-0 state in full-page images, and the FarmTypes sticky
  frame shows a single photo. The film strips are the evidence for those scenes. This is a capture artefact, not a defect.
- One early run captured the compact sticky bar over the masthead in `ar/home/1440-full.png`. It did not reproduce
  in a dedicated probe (the bar was `aria-hidden` and at `top: -73px` before and after capture) or in two later runs.
  The spec now asserts that the bar has released before each full-page capture.
- The orphan and off-viewport lists are heuristics recorded for review and are not asserted. Every finding above was
  confirmed by looking at the screenshots.
- Out of scope here: Firefox/WebKit, real devices, reduced-motion and low-network passes, dead-link crawl, Lighthouse.
