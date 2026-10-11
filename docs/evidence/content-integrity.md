# Content-integrity review (rendered site) — 2026-10-11

> **Status 2026-10-11 (final):** this is the QA-round record. CI-01–06 are fixed; CI-03 and CI-06 were fixed in the final round (server-rendered 404s through the proxy). The content-integrity spec passes 11 / 11 on the final build. See `docs/test-report.md` § 5.

Scope: spec §16 and §17 reject list, AGENTS.md invariants, `.agents/skills/poultry-content-integrity`. This review checks
the **rendered** output, not the dictionaries. The review of the dictionary source is in `content/approval-register.md`.

Servers:
- `http://localhost:3100`: dev server, real dev DB, zero products and articles.
- `http://localhost:3200`: production build, fixture DB, `DEMO_FIXTURES=true`, three approved `[TEST]` products and one
  draft.

No copy or app code was changed.

**Verdict:**
- The public site keeps to the poultry-only scope.
- The three metric statements render verbatim with their qualifiers everywhere a figure appears, and 150 is always
  tied to veterinary medicines and vaccines.
- There are no manufacturer, certification, logistics, contact or testimonial claims, and no medical advice.
- Digits are Western throughout, and the status ribbons behave correctly.

Three defects need fixing:
- **CI-03:** 404 pages are blank without JavaScript.
- **CI-01:** untranslated Arabic CMS text on English product pages.
- **CI-02:** no safety sentence on veterinary catalogue views.

Three P3 items are housekeeping.

## Method and evidence

| Step | Detail | Evidence |
|---|---|---|
| Crawl | **80 pages**: 16 routes × AR/EN × both servers, plus 8 fixture-only routes × AR/EN (catalogue filters, empty search, 3 product pages, draft slug). Desktop 1440 × 900, `reducedMotion: reduce`. For each page the crawl extracted every text node (including visually hidden ones), `<title>`, meta description, `og:*` and `twitter:*` tags, JSON-LD, image `alt`, `aria-label`, `title`, `placeholder`, `role="note"` ribbons, `lang`/`dir` and `h1`. | `docs/evidence/content-integrity/crawl-summary.json` (per page: title, description, og, robots, h1, ribbons, vet-content flag, safety sentence, Arabic on `/en`, Latin on `/ar`, JSON-LD types) |
| Rule scan | Regex rules for non-poultry animals (EN, plus AR with Arabic-aware word boundaries), manufacturer claims, operations/certification/SLA/superlatives, medical and outcome language, dates and history, contact data, testimonials and partners, placeholders, Arabic-Indic digits. Each metric figure was checked in context. | `docs/evidence/content-integrity/crawl-rule-hits.json` (every hit with context; reviewed below) |
| Regression spec | `tests/e2e/content-integrity.spec.ts` (new). It works on either server and derives the expected ribbons and products from the public APIs. Tests named `CI-xx` encode the findings below. | `playwright-content-integrity-3200.log`: 6 passed, 5 failed (CI-01, CI-02 ×2, CI-03 ×2). `playwright-content-integrity-3100.log`: 7 passed, 4 failed (CI-02 ×2, CI-03 ×2). Final combined run with `security.spec.ts`: `playwright-final-security-and-content-3200.log` (security 14/14 passed; content 6 passed, 5 failed, all CI-xx). |
| No-JS check | Each 404 rendered with and without JavaScript, with screenshots. | `404-js-vs-nojs.jsonl`, `nojs-*.png`, `js-*.png` in `docs/evidence/content-integrity/` |
| Source scans | The six scans from the skill over `src/i18n src/content src/scripts content` (run under a UTF-8 locale). | Results under "Source scans" below |

How to re-run:
- Fixture build: `E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test tests/e2e/content-integrity.spec.ts --project=desktop`.
- Dev server: use `E2E_BASE_URL=http://localhost:3100`.

## Findings

| ID | Sev | Routes | Finding |
|---|---|---|---|
| CI-03 | **P2** | every 404: `/{ar,en}/<unknown>`, `/{ar,en}/products/<unpublished-slug>`. Both servers, all viewports. | The 404 page has no server-rendered body. It is blank without JS, and the ribbons, header and h1 exist only after client rendering |
| CI-01 | **P2** | `/en/products/<slug>` (`:3200`: all 3 fixtures) | Arabic fallback CMS text is shown on English pages without `lang="ar"` or `dir` |
| CI-02 | **P2** | `/{ar,en}/products?category=medicines\|vaccines` (both servers), `/{ar,en}/products` when veterinary cards are listed (`:3200`) | Veterinary catalogue views lack the exact veterinary safety sentence |
| CI-04 | P3 | `/ar`, `/en` | The home `<title>` is the unapproved tagline without the brand name |
| CI-05 | P3 | governance | The register and the site disagree in two places: "draft marker" for `review_required` copy, and the EN qualifier «~» |
| CI-06 | P3 | `/{ar,en}/<unknown>` (with JS) | After hydration the 404 `<title>` falls back to «الشروق» / «Alshorouk» (the SSR title was «الصفحة غير موجودة \| الشروق»). The cause is likely the same as CI-03 |

### CI-03 · P2 · 404 pages are not server-rendered
- **Evidence:**
  - `curl http://localhost:3200/ar/this-page-does-not-exist` returns status 404 with `<html id="__next_error__">` (no
    `lang`, no `dir`). The `<body>` holds only `<div hidden><!--$--><!--/$--></div>` and scripts.
  - The not-found UI travels only in the RSC payload (digest `NEXT_HTTP_ERROR_FALLBACK;404`).
  - Googlebot and Chrome user agents get the same result, and so does `/en/products/fixture-draft-delta`.
  - With JavaScript off, the page is blank: `textLength 0`, no header, h1, footer or ribbon. See
    `nojs-3200-ar_this-page-does-not-exist.png`, `nojs-3200-en_products_fixture-draft-delta.png` and
    `nojs-3100-ar_this-page-does-not-exist.png`.
  - With JS, the page renders correctly, including the ribbons (`js-*.png`).
  - By contrast, `/ar/privacy` renders fully without JS (`nojs-3200-ar_privacy.png`).
- **Why it matters:**
  - AGENTS.md requires that "content must be visible without JS".
  - The "demo data" ribbon is missing from the server HTML of 404s.
  - Until hydration the document has no `lang`/`dir`.
  - `navigation.spec.ts` checks 404s only with JS on, so it passes.
- **File guesses:** `src/app/(frontend)/[locale]/not-found.tsx`, `[locale]/[...rest]/page.tsx`, `[locale]/layout.tsx` (the
  root layout sits under the dynamic `[locale]` segment and there is no app-level not-found), and
  `products/[slug]/page.tsx` (`notFound()` in `generateMetadata`).
- **Suggested fix:**
  - Check the `:3200` server log for an SSR exception while rendering the not-found boundary.
  - Otherwise, give the multi-root-layout app a server-renderable not-found. In Next 16 that is `global-not-found.tsx`
    for multiple root layouts, or the not-found must render inside the `[locale]` layout without throwing.
  - Acceptance: test `CI-03` passes. `curl` of a 404 must contain `<header`, one `<h1` and, on fixture builds,
    `role="note"`.

### CI-01 · P2 · Untranslated Arabic CMS text on English product pages
- **Evidence:**
  - `/en/products/fixture-medicine-gamma` (and `-feed-alpha`, `-supplement-beta`): under "Product description" it shows
    `<p class="measure …">سجل اختبار آلي — ليس منتجًا حقيقيًا.</p>`.
  - That element has no `lang="ar"` and no `dir`, inside `<html lang="en" dir="ltr">`.
  - Test `CI-01` fails.
- **Cause:** `getProductBySlug` queries with `fallbackLocale: 'ar'` (`src/lib/catalog.ts:183-190`). Any localized field an
  editor leaves empty in English (`description`, `warnings`, `packSize`, `safetyText`) silently shows Arabic on `/en`.
  Screen readers then read it with the English voice, and the punctuation order is wrong.
- **Not affected:** bilingual product names are fine. Cards and the detail page put the alternate name in
  `<p lang="ar">` or `<p lang="en">`.
- **Suggested fix:** in `ProductDetailView` (and in the article body), choose one of:
  - render fallback values inside `<div lang="ar" dir="rtl">`, detected by Arabic script or by re-querying with
    `fallbackLocale: false`;
  - hide the block on `/en` with a short note that the information is available in Arabic.

  Then re-run `CI-01`.

### CI-02 · P2 · No exact safety sentence on veterinary catalogue views
- **Rule:** the skill and AGENTS.md require that "veterinary product pages and medicine/vaccine sections carry the
  safety line".
- **Where it is present:** the product detail page carries it (`ProductDetailView.tsx:50`, as "Veterinary note"), and so
  do the home, poultry-solutions, the three segment pages and how-we-work.
- **Where it is missing:**
  - The catalogue filtered to `الأدوية البيطرية` (`:3200`) lists the `[TEST]` veterinary card with no safety sentence on
    the page.
  - On the empty catalogue (`:3100`), the medicines and vaccines category cards carry only shortened clauses:
    - «أدوية بيطرية للدواجن نوزعها لتُستخدم تحت إشراف الطبيب البيطري.»
    - «… وفق برنامج يحدده الطبيب البيطري.»
  - Test `CI-02` fails on both servers.
- **File guesses:** `src/components/products/CatalogLiveView.tsx`, `CatalogEmpty.tsx`.
- **Suggested fix:** render `dict.common.vetSafetyNote` under the results header when `category ∈ {medicines,
  vaccines}`, when any visible card is veterinary, or under the medicines and vaccines cards of the empty-state grid.
- **Note:** the Knowledge topic «التعامل مع المنتجات البيطرية» uses its own disclaimer («…ولا تغني عن استشارة الطبيب
  البيطري»). That is acceptable while no article exists. When vet-product-handling articles are published, the article
  view should append the exact sentence. Today only `ProductDetailView` uses `vetSafetyNote`.

### CI-04 · P3 · The home title has no brand name and uses an unapproved tagline
- `/ar` `<title>` is «حلول إمداد متخصصة لمزارع الدواجن»; `/en` is «Specialised Supply Solutions for Poultry Farms».
- Every other page appends «| الشروق» / «| Alshorouk».
- The tagline is register row **T-01** (`review_required`), so this is acceptable on staging.
- **Suggestion:** once the tagline is approved, use «الشروق | …» / «Alshorouk | …» for the home page, which helps SEO
  and brand recall. `og:site_name` is already set.

### CI-05 · P3 · The register and the rendered site disagree in two places
1. The legend of `content/approval-register.md` says `review_required` copy renders "Staging only, **with a draft
   marker**". On `/ar` no marker exists; only the English notice and the fixture ribbon appear. Either add a staging
   ribbon whenever `siteStatus = staging` (for example «نسخة تجريبية — النصوص قيد المراجعة»), or reword the legend.
   Either way, launch must not happen before the register's `review_required` rows are approved. This is a Gate 6/8
   item: dictionary copy has no runtime gate.
2. Register row **EN-02** says the English display qualifier is «~». The site renders «Approx.» on hero and stat cards
   (`en/common.ts:117,125,133`, mirrored into the `metrics` global), «Approximately …» in screen-reader labels and
   «around …» in running text. All three carry a qualifier and the exact label, so this is not an integrity breach.
   Align the register or the copy when EN-01/EN-02 are approved.

Related observation, not counted as a finding: `/api/globals/metrics` publicly returns the internal `accuracyNote`
editor field. Its wording is harmless, but if it is meant to stay internal it should be staff-read only. See the
security review, SEC-04.

### CI-06 · P3 · The 404 title changes after hydration
- With JavaScript, `/ar/this-page-does-not-exist` ends with `<title>` «الشروق» and `/en/...` with «Alshorouk».
- The server-sent title was «الصفحة غير موجودة | الشروق».
- The product `notFound()` keeps «Page Not Found | Alshorouk».
- Source: `404-js-vs-nojs.jsonl`. This should disappear with the CI-03 fix.

## Checks that passed

| Rule | Result (80 pages, both servers, AR + EN) |
|---|---|
| **Poultry only** | 0 non-poultry animal terms in text (including hidden), alt, aria/title, meta, OG or JSON-LD. The first scan's 171 Arabic hits were false positives: substrings such as «روابط» and «تسويقية», plus «قطيع/قطعان» used for poultry flocks («قطعان الأمهات»). With Arabic-aware word boundaries the count is 0. All 10 distinct photo alts per locale describe poultry and the correct segment: broilers on litter with feeders and drinkers; layers in tiered cages with eggs; breeders with hens and roosters together; eggs on conveyors; setter trays; farm exterior; unlabelled amber bottles. The logo alt matches the official artwork. Decorative category and segment photos use `alt=""` next to visible labels (81 occurrences per locale). |
| **Metrics verbatim + qualifier** | 64 figure occurrences reviewed in context (`crawl-rule-hits.json`, rule `metric`). Every `300`, `15 مليون/million` and `150` belongs to the approved statement with its qualifier: hero counters, stat cards plus `srLabel`, the partner-proof narrative, the About scope block and the home FAQ (FAQ framing tracked in M-01). The spec checks that the count of bare figures equals the count of full statements on every page; this passes. |
| **150 never tied to feed or supplements** | Every `150` is followed by «منتجًا نوزعه من الأدوية واللقاحات البيطرية» or «veterinary medicine and vaccine products we distribute». Spec rule passes. |
| **No manufacturer claims** | 0 hits for «نصنع/ننتج/مصنعنا…» or "we manufacture / our factory / our formula". Distributor verbs only (نوفر / نوزع / نعمل على إتاحة; supply / distribute / make available). The partner page addresses manufacturers as prospective partners. |
| **No fabricated facts** | No founding year or history: the only year is «© 2026» in the footer. No phone, e-mail, WhatsApp, map or social links: no verified channel exists, and the only `@` and `01x…` strings are input placeholders (`name@example.com`, `01xxxxxxxxx`). No certifications, cold chain, fleet, warehouses, delivery times, partners, logos, testimonials, awards or staff counts. |
| **No medical advice or outcome promises** | The only medical-vocabulary hits are negating disclaimers: «لا تُعد توصية علاجية أو إرشادًا للاستخدام أو الجرعات», «لا نقدّم عبر هذا النموذج تشخيصًا أو توصيات علاجية», «دون تقديم تركيبات أو جرعات», and the EN equivalents. No dosage, schedule, efficacy, cure or prevention claims. |
| **Vet safety sentence** | The exact sentence is in `main` on home, poultry-solutions, broilers, layers, breeders, how-we-work and the veterinary product detail page (AR + EN). Exceptions are listed under CI-02. |
| **Untranslated strings** | `/ar`: Latin appears only as intentional labels (`EN` switch, «Broilers/Layers/Breeders» and «INTEGRITY/PRECISION/RELIABILITY/EXPERTISE» brand labels, `IP` in the privacy policy, placeholder formats, `[TEST]` fixture alternate names marked `lang="en"`). `/en`: Arabic appears only in the language switch (`lang="ar"`), fixture alternate names (`lang="ar"`) and the CI-01 fallback. Titles, descriptions and OG tags are in the page language throughout. |
| **No placeholders** | 0 instances of lorem, TODO, TBD, FIXME, `undefined`, `NaN`, `[object`, unresolved `{placeholder}` or «قريبًا». |
| **Western digits** | 0 Arabic-Indic or Extended Arabic-Indic digits on any page or attribute. |
| **Demo ribbon** | «بيئة تجريبية: …» / "Staging environment: …" on every `:3200` page (with JS) and on no `:3100` page. Exception: the 404 server HTML (CI-03). |
| **English review notice** | "English version — editorial review pending" on all 40 `/en` pages on both servers and on no `/ar` page. |
| **Document basics** | `lang`/`dir` correct on every page (`ar`/`rtl`, `en`/`ltr`); exactly one `h1` per page (with JS on); no `<img>` without an `alt` attribute; `robots` is `noindex` on every page (staging; `/en` unapproved); `og:locale` is `ar_EG`/`en_US`. |
| **JSON-LD** | `Organization` (name, alternate name, URL, logo; no contact data because none is verified) on every page, plus `BreadcrumbList` on interior pages. No `Product` markup for fixtures (by design). No `Offer`, ratings or reviews. |
| **Empty states (dev)** | Catalogue: «نضيف المنتجات إلى الكتالوج الرقمي … يمكنك طلب قائمة المنتجات الحالية». Knowledge: «No articles published yet». Home catalogue teaser: "Our digital catalogue is being prepared". No fake product cards. |
| **Fixtures (:3200)** | `[TEST]` / «[اختبار]» names, «سجل اختبار آلي — ليس منتجًا حقيقيًا», and a category photo captioned «صورة تعبيرية لفئة الأدوية البيطرية، وليست صورة المنتج» / "Illustrative image … not a photo of the product". The draft fixture returns 404 to the public. |

## Source scans (skill §2), 2026-10-11
- **Livestock:** only the comment in `ar/about.ts:5` documenting the ban, and the `cats` identifier (categories) in
  `src/scripts/seed.ts`. Both are false positives.
- **Manufacturing:** 0 hits.
- **Operations and superlatives:** comments documenting the bans (`ar/about.ts:6,9`, `ar/howWeWork.ts:5`), plus the
  source-URL slug `eggs-in-warehouse` in the photo registry (`src/content/photos.ts:188`; provenance only, never
  rendered).
- **Medical:** only the negating disclaimers (`ar|en/knowledge.ts`, `ar|en/products.ts:infoNote`), a comment, and the
  photo note "no … dosage visible".
- **Contact data:** only the `wa.me` builders that render verified `site-settings` channels (`Footer.tsx:88`,
  `ContactAside.tsx:28`) and a code-comment example in `schema.ts:66`.

## Not tested
- **Articles:** none exist on either database, so the article template's rendered copy and the article-level
  safety-sentence behaviour were not testable.
- **Real CMS product content:** only fixtures exist, so the label fields `warnings` and `packSize` and label PDFs were
  not exercised.
- **Viewports:** text was crawled at desktop width only. The DOM is the same at other widths; mobile-only menus were
  captured as hidden text nodes.
- **Brand-guideline wording:** checking the copy against the PDF and approving it is the client's call (see the
  register).
