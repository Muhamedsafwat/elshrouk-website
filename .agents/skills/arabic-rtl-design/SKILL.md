---
name: alshorouk-arabic-rtl-design
description: Build and review Arabic-first RTL typography, layout mirroring, bidi isolation of Latin and numeric runs, Western-digit formatting and the English LTR counterpart for the Alshorouk site — use when creating any component or page, changing fonts or the type scale, wiring locale switching, or reviewing Arabic and English screenshots.
---

# Skill: Alshorouk Arabic & RTL Design

Role owners: Frontend Architect + Arabic Copywriter & Localizer (spec §13.7, §13.9). Arabic is the primary experience; English must never break it.

## Activation
- Any new or changed component, page, form, motion text reveal or SVG motif that has a direction.
- Font, line-height, measure or type-scale changes (`src/styles/fonts.ts`, `src/styles/globals.css` — orchestrator-owned; propose diffs).
- Locale plumbing: `src/i18n/config.ts`, `src/i18n/routing.ts`, `src/i18n/format.ts`, dictionaries in `src/i18n/dictionaries/{ar,en}/*.ts`.
- Reviewing AR/EN screenshots, or any report of "broken Arabic", wrong digits, flipped numbers or clipped diacritics.

## Inputs
- PDF p.12 typography rules (index, not folio): Thmanyah + Montserrat, Western digits 0–9, Arabic right-aligned, never justify short lines, English at 90% in mixed lines, no kashida.
- Current font setup: `arabicFont` = Alexandria (OFL, staging fallback for the licensed Thmanyah, variable `--font-arabic`); `latinFont` = Montserrat (`--font-latin`, Latin unicode-ranges, leads the stack so Latin letters and digits render in Montserrat and Arabic glyphs fall through).
- Locale helpers: `locales`, `localeDirection`, `hrefLang`, `otherLocale` (config); `href`, `switchLocalePath`, `productHref`, `isActiveRoute` (routing); `formatNumber`, `formatDate`, `interpolate` (format).
- Spec §3.3, §7.1, §7.3, §7.4, §12.2; AGENTS.md "Code conventions".

## Procedure
1. **Document direction.** `src/app/(frontend)/[locale]/layout.tsx` renders `<html lang={locale} dir={localeDirection(locale)}>`; unknown locales `notFound()`. Inline foreign runs carry their own `lang` (`<span lang="en">Broilers</span>`, `<span lang="ar">` inside English pages).
2. **Logical layout only.** Tailwind 4 logical utilities: `ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e rounded-s-* rounded-e-* scroll-ms-*`. Physical `left/right/ml/mr/pl/pr` only for intentionally direction-locked elements (numerals, phone fields, media controls). Flex/grid follow the writing direction automatically — do not "fix" them with `flex-row-reverse`.
3. **Things that do not mirror by themselves:** `translateX` (negate in RTL: `const dir = document.documentElement.dir === 'rtl' ? -1 : 1`), `background-position`, `box-shadow` offsets, `transform-origin` (`rtl:origin-right` / `ltr:origin-left` for progress fills), SVG coordinates. Mirror direction-bearing SVG motifs (Distribution Flow, progress lines) with `rtl:-scale-x-100` and keep their text labels in HTML outside the mirrored SVG.
4. **Icons.** Mirror arrows, chevrons, "next/back", breadcrumb separators and progress direction with `rtl:-scale-x-100`. Never mirror the logo, rooster emblem, check marks, play/pause, phone handset, clocks or numerals.
5. **Digits and numbers.** Western digits in both locales. Use `formatNumber()` (en-US digits) and `formatDate()` (`ar-EG-u-nu-latn`). Never `Intl.NumberFormat('ar-EG')` without `-u-nu-latn` — it outputs Arabic-Indic digits (٣٠٠). Approved metric strings come from the `metrics` global / dictionary as authored (`حوالي 15 مليون`), never computed with compact notation.
6. **Inputs accept every digit form.** Forms and search accept Arabic-Indic (U+0660–0669) and Extended Arabic-Indic (U+06F0–06F9) digits and normalise with `toWesternDigits()` (`src/lib/search/normalize.ts`); phone parsing also strips bidi marks (U+200E/200F, U+202A–202E, U+2066–2069) pasted from RTL text.
7. **Bidi isolation.** Wrap Latin/numeric runs inside Arabic sentences in `<bdi>` when order matters: SKUs, inquiry references (`{reference}`), product names in Latin, units with symbols. Phone numbers, emails and URLs render with `dir="ltr"` (and `unicode-bidi: isolate` via the element). Tel/email inputs: `dir="ltr"`, `inputMode="tel"`/`"email"`, `autoComplete`, aligned with the RTL column (`rtl:text-right`).
8. **Typography.** Font stack `var(--font-latin), var(--font-arabic), system-ui, sans-serif`. Arabic body 16–18 px with line-height 1.6–1.75, measure ≈ 60–70ch (`max-inline-size`); headings 1.1–1.25 line-height but never clipped. Mixed lines: English at `0.9em`. Never apply `letter-spacing`/`tracking-*` or `uppercase` to Arabic (breaks joining) — scope them with `ltr:` or to Latin-only elements. No `text-align: justify`, no kashida, no hyphenation. Headings `text-wrap: balance`; paragraphs `text-wrap: pretty` to avoid one-word orphans; long Latin tokens (URLs, SKUs) get `overflow-wrap: anywhere`.
9. **Headlines are authored lines.** Dictionaries store display headlines as arrays (`title: ['كتالوج منتجات', 'مزارع الدواجن']`) rendered by `TextReveal` (`.mask-line > span`). Never split Arabic into characters; words or authored lines only. Mask wrappers need vertical breathing room so ascenders (ا ل ك ط), descenders (ي ق ج ع م) and marks (ُ ً ّ أ إ ؤ ئ) are not clipped — test at the heaviest weight and both font faces.
10. **Plurals and interpolation.** Use `Intl.PluralRules('ar')` categories (zero/one/two/few/many/other) with the dictionary keys (`countZero`, `countOne`, `countTwo`, `countFew`, `countMany`, `count`); fill placeholders with `interpolate()`. EN dictionaries are typed against the AR shape — a missing key is a type error, not a runtime fallback.
11. **Arabic punctuation and tone.** Use ، ؛ ؟ and «» in Arabic copy; professional Egyptian MSA (spec §7.4); no English-style exclamation marks.
12. **Locale switching.** `LocaleSwitcher` uses `switchLocalePath(pathname, otherLocale(locale), search)` so `/ar/products?category=vaccines` ↔ `/en/products?category=vaccines`; product slugs are Latin and identical in both locales. Missing English content never 404s — the page renders, and Arabic fallback values (Payload `localization.fallback: true`) are wrapped with `lang="ar" dir="rtl"`. `/en` stays `noindex` until `site-settings.englishApproved`.
13. **Mobile Arabic.** Section titles 2–4 lines at 320–390 px; no orphan words; CTAs keep full Arabic labels (no truncation); tap targets ≥ 44 px.

## Checklists
**Every component**
- [ ] No physical spacing/position utilities unless direction-locked and commented.
- [ ] Directional icons mirror; non-directional ones do not.
- [ ] GSAP/CSS horizontal travel derives its sign from `dir`.
- [ ] Mixed-script strings wrapped in `<bdi>`/`dir="ltr"` where order matters.
- [ ] No `letter-spacing`, uppercase or justify on Arabic.

**Every page (AR and EN, 320 / 390 / 1440)**
- [ ] `html[lang][dir]` correct; one `h1`; reading order matches visual order.
- [ ] Digits are Western everywhere (scan the DOM: `/[٠-٩۰-۹]/` must not match rendered text).
- [ ] Diacritics and descenders intact in reveals; no text outside the viewport; no horizontal scroll.
- [ ] Locale switch lands on the equivalent route with query preserved.
- [ ] English layout intact (longer strings, LTR icons) and labelled `noindex` until approved.

## Deliverables
- RTL-correct components/pages in the files your task owns; proposed diffs for orchestrator-owned files.
- Tests: Vitest for number/date formatting (Western digits in `ar`), dictionary parity (EN keys = AR keys) and digit normalisation; Playwright checks for `lang/dir`, overflow and Arabic-Indic digits in rendered text.
- AR + EN screenshots at 390 and 1440 for the pages you touched (`pnpm screenshots` / browser-visual-qa naming), referenced in your report.

## Acceptance criteria
- Arabic pages read naturally right-to-left with no flipped numbers, broken joins, clipped marks or orphaned words at 320–1920 px.
- Digits render in Montserrat with Western numerals. Verify on a metric or SKU node in Chromium via CDP: `DOM.querySelector` → `CSS.getPlatformFontsForNode` lists Montserrat for the digits and the Arabic face for Arabic glyphs.
- Locale switching preserves route and query; English never breaks layout and never replaces Arabic silently.
- Inputs accept Arabic-Indic digits and pasted RTL phone numbers.

## Failure recovery & escalation
- **Clipped diacritics in mask reveals:** add block padding with an equal negative margin on `.mask-line`, or reveal with `clip-path` insets that extend beyond the line box; re-test both fonts.
- **Digits render in the Arabic face:** check that `--font-latin` leads the stack and that Montserrat's subset includes digits; escalate font-stack changes to the orchestrator (owner of `fonts.ts`).
- **Licensed Thmanyah arrives:** follow the `next/font/local` swap documented in `src/styles/fonts.ts`, then re-run the full AR screenshot matrix (metrics differ from Alexandria).
- **A design only works in LTR** (e.g. a horizontal scroller or chart): redesign the RTL version first; do not ship a mirrored afterthought.
- **English copy missing or unapproved:** keep the Arabic-structured English page in staging with `noindex`; record in `docs/open-items.md`.

## Spec references
§0.2 (Arabic-first, responsive widths), §3.3, §4.2, §7.1, §7.3, §7.4, §8.4 (line reveals), §12.2 (`lang`/`dir`), §13.9, §16.3 (Arabic joins and breaks), §17 (no superficial Arabic); AGENTS.md "Code conventions".
