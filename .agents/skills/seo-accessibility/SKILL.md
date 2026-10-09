---
name: alshorouk-seo-accessibility
description: Deliver honest SEO and WCAG 2.2 AA accessibility for the Alshorouk site — per-locale metadata, canonical and hreflang policy, sitemap and robots, truthful JSON-LD, the privacy-safe analytics adapter, keyboard and screen-reader paths, contrast and reduced motion — use when adding a page or component, changing metadata or structured data, enabling English indexing or analytics, and before Gates 6 to 8.
---

# Skill: Alshorouk SEO & Accessibility

Role owner: SEO & Accessibility Specialist (spec §13.10). Done when titles/metadata are valid and keyboard and reduced-motion paths pass — proven by scans **and** manual checks.

## Activation
- New route or component; changes to `generateMetadata`, `src/app/sitemap.ts`, `src/app/robots.ts`, JSON-LD helpers, headings, navigation, dialogs, forms or motion.
- Turning on English indexing (`site-settings.englishApproved`), production indexing (`siteStatus`), or an analytics provider.
- Gate 6 (no critical a11y/SEO issues), Gate 7 (keyboard and reduced-motion journeys), Gate 8 (final matrix).

## Inputs
- `src/i18n/config.ts` (`hrefLang`: `ar-EG`, `en`; `ogLocale`), `src/i18n/routing.ts` (`href`, `absoluteUrl` from `NEXT_PUBLIC_SITE_URL`).
- `site-settings` global: `siteStatus` (`staging` = noindex), `englishApproved`, `showKnowledgeHub`, verified contact channels; Payload admin already sends `noindex, nofollow`.
- `src/lib/analytics.ts`: typed events (`hero_cta_click`, `contact_open`, `form_submit_success`, `form_submit_error`, `product_filter`, `product_search`, `product_view`, `product_inquiry_start`, `language_toggle`), allow-listed props, no-op without `NEXT_PUBLIC_ANALYTICS_PROVIDER` and consent (`alshorouk-consent`).
- Dev dependency `@axe-core/playwright@4.13.0`; Playwright 1.64; contrast matrix from the brand-extraction skill.
- Spec §12.1–12.4, §16.1 (E2E 4–5), §16.3, §21 Q7 and Q10.

## Procedure
1. **Metadata per route** (`generateMetadata`): title template `%s | الشروق` (EN `%s | Alshorouk`), unique description from the dictionary/CMS (no stuffing; weave in intent phrases naturally where true: `منتجات مزارع دواجن`, `أدوية دواجن`, `لقاحات دواجن`, `مكملات أعلاف الدواجن`, `أعلاف الدواجن`), `alternates.canonical` = `absoluteUrl(path)` without query, Open Graph with an approved image and the official logo only, `openGraph.locale` from `ogLocale`.
2. **Indexing policy** (implemented by `buildMetadata()` in `src/lib/seo.ts` — extend it, do not bypass it).
   - Indexable only when `NEXT_PUBLIC_SITE_ENV=production` **and** `site-settings.siteStatus = production`; otherwise every page is `noindex` and `robots.txt` disallows everything. No approved domain (OI-16) means not indexable.
   - `/en` → `noindex` and omitted from the sitemap and `hreflang` until `englishApproved`; afterwards `alternates.languages = { 'ar-EG': …, en: …, 'x-default': /ar… }` on pages that exist in both.
   - Catalogue URLs with any active filter or search (`hasActiveFilters()`: `category`, `segment`, `manufacturer`, `q`) → `noindex, follow`, canonical `/[locale]/products`.
   - Drafts, fixtures, previews, `/admin`, `/api` → never indexed; ask the orchestrator for `X-Robots-Tag: noindex` headers on `/admin` and `/api` in `next.config.ts`.
3. **Sitemap and robots.** `src/app/sitemap.ts` lists only public routes per indexable locale plus approved+published products and articles (`lastModified` from `updatedAt`), with absolute URLs; no filter URLs, no fixtures. `src/app/robots.ts` allows `/` and disallows `/admin` and `/api` in production; staging disallows all.
4. **Truthful JSON-LD** (one helper, `JSON.stringify(data).replace(/</g, '\\u003c')` inside `<script type="application/ld+json">`):
   - `Organization`: name `الشروق` / `Alshorouk`, url (approved domain), logo (official file). `telephone`, `email`, `address`, `sameAs` only from `site-settings` values marked verified.
   - `BreadcrumbList` on interior pages, mirroring visible breadcrumbs.
   - `Article` only for approved articles; `author`/`datePublished` only when real.
   - `Product` only for approved+published products with factual fields (name, description, image, category; `manufacturer` only if verified). **No** `offers`, `price`, `availability`, `aggregateRating` or `review`.
   - `FAQPage` only for visible, approved Q&A (Google shows FAQ rich results only for a narrow set of sites — it is not a growth lever). No `LocalBusiness`/`geo` until an address is verified.
5. **Semantics.** One `h1` per page; no skipped heading levels in content; landmarks (`header`, `nav` with `aria-label`, `main#main`, `footer`); skip link first in tab order (`تخطَّ إلى المحتوى`); `lang`/`dir` on `<html>` and on foreign-language runs; decorative motifs `aria-hidden="true"`; images with meaningful bilingual alt, decorative ones `alt=""`.
6. **Keyboard and focus (manual pass on every template, AR and EN).**
   - Tab order follows the visual RTL order; visible 2–3 px focus ring with ≥ 3:1 contrast; nothing focusable is hidden, invisible or off-screen (pinned scenes included).
   - Sticky header/CTA never covers the focused element: `scroll-padding-top` equals the header height (WCAG 2.4.11).
   - Mobile menu and inquiry drawer: open on Enter/Space, focus moves inside, Tab is trapped, Esc and backdrop close, focus returns to the trigger, body scroll locked only while open, background `inert`.
   - Accordions: real buttons with `aria-expanded`/`aria-controls`. Tabs (if used for segments): roving tabindex; arrow keys follow the reading direction (in RTL, ArrowLeft moves to the next tab).
   - Filters: `fieldset`/`legend`; the results count is announced politely once, not on every keystroke.
   - Client-side navigation keeps focus sensible (focus lands on the new page's `h1` or main region, never lost on `body`).
7. **Forms.** Visible labels, required state, `autocomplete` tokens, `aria-invalid` + `aria-describedby`, error summary focused on submit failure, success focus management, no placeholder-as-label, targets ≥ 44 px (WCAG 2.5.8 minimum 24 px).
8. **Contrast.** Use the matrix: white on vermilion only ≥ 24 px bold / ≥ 32 px; vermilion text never small on white (3.69:1); black on vermilion 5.69:1; never white on amber. Text over photos needs the black 40–60% overlay — verify manually (automated tools cannot judge text on images).
9. **Motion and media.** `prefers-reduced-motion: reduce` shows all content with no pinning, parallax or count-up; nothing flashes; no autoplay audio; hero video (if any) muted, `playsInline`, poster, disabled on Save-Data/reduced motion. Reflow at 320 CSS px and 400% zoom without horizontal scrolling.
10. **Automated scans** (Playwright, both locales, 390 and 1440, plus open states: menu, drawer, accordion, form errors):
    ```ts
    import AxeBuilder from '@axe-core/playwright'
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    expect(r.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))).toEqual([])
    ```
    Add `expect(page.locator('h1')).toHaveCount(1)`, `toHaveAttribute('lang'/'dir')`, and `locator.ariaSnapshot()` assertions for nav, dialogs and forms. Lighthouse SEO/accessibility runs are supplementary evidence, never a substitute for the manual pass.
11. **Screen-reader smoke test.** A human (or the orchestrator with the user) runs Windows Narrator — or NVDA if installed — with Edge/Chrome over home, catalogue, product detail and contact in Arabic. Agents cannot claim this was done; record it as pending until it is.
12. **Analytics.** Keep the adapter no-op until a provider ID and consent strategy are approved (open item). When enabled: consent first (`CookieConsent`), only typed events, only allow-listed props, no PII, no medical notes, no message text.

## Checklists
- [ ] Unique title + description per route and locale; canonical without query; OG image approved.
- [ ] Staging and `/en` noindex as per policy; sitemap and robots match the policy.
- [ ] JSON-LD validated (schema.org validator or Rich Results Test when online) and contains no unverified field.
- [ ] axe: zero serious/critical violations on every route × locale × width and open state.
- [ ] Keyboard pass complete for menu, drawer, accordion, filters, forms; focus never obscured.
- [ ] Reduced motion and 320 px / 400% zoom reflow pass.
- [ ] Analytics no-op (or consented and allow-listed).

## Deliverables
- Metadata, sitemap, robots, JSON-LD helpers and a11y fixes in the files your task owns.
- Playwright a11y/SEO spec(s) and their output; manual keyboard checklist results in `docs/test-report.md` (accessibility section) with screenshot paths.
- An accessibility statement of known gaps (font pending, SR test pending) for the final report.

## Acceptance criteria
- Every page has valid metadata and the correct index/noindex state; sitemap lists only public, approved URLs (spec §13.10 done condition).
- No serious/critical automated violations; manual keyboard and reduced-motion journeys pass (E2E 4 and 5).
- Structured data never states anything unverified (no offers, ratings, phone or address without verification).

## Failure recovery & escalation
- **Violation in a shared component** (header, menu, Button, Logo): report the exact fix to the orchestrator (owner) with the failing selector and axe rule id.
- **Brand colour pair fails:** switch to an accessible pair from the matrix; never lower the contrast requirement.
- **English approval or domain missing:** keep noindex and record the open item; do not publish hreflang for unapproved pages.
- **Rich-result validators unreachable offline:** validate JSON shape in tests and record the external validation as pending.

## Spec references
§0.2, §4.2–4.3, §6.4 (filters with screen readers), §6.10, §7.3, §8.6, §10.4 (preview noindex), §12.1–12.4, §13.10, §15 Phase 6, §16.1 (E2E 4–5), §16.3, §16.5, §21 Q7 and Q10.
