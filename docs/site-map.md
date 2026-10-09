# Site map, journeys & navigation

## Routes (Arabic canonical `/ar/…`, English `/en/…` with identical slugs)

| Route | Page | Primary action | Data |
|---|---|---|---|
| `/` | → 307 `/ar` | — | proxy |
| `/ar` | Home — 11 scenes | تواصل مع فريق الشروق / استكشف حلولنا | homepage + metrics globals, FAQs, featured approved products |
| `/ar/about` | عن الشروق | ابدأ شراكة مع الشروق | metrics global |
| `/ar/poultry-solutions` | حلول الدواجن | ناقش احتياج مزرعتك | taxonomy |
| `/ar/solutions/broilers` · `/layers` · `/breeders` | Segment pages | اطلب استشارة منتجات · تواصل مع الفريق · استفسر عن الحلول | facets, segment products, articles |
| `/ar/products` | Catalogue (search, facets, pagination) | استفسر عن المنتج / اطلب قائمة المنتجات | products (approved only) |
| `/ar/products/[slug]` | Product detail (approved only; editor preview with DRAFT banner) | استفسر عن المنتج | product |
| `/ar/how-we-work` | كيف نعمل | ابدأ طلبك | — |
| `/ar/knowledge` | المعرفة | browse / contact | articles (approved only) |
| `/ar/knowledge/[slug]` | Article | share / related | article |
| `/ar/contact` | تواصل معنا (`?type=farm|product|partner|general`, `?product=<id>`) | submit inquiry | inquiries (write) |
| `/ar/partner-with-us` | كن شريكًا | partnership inquiry | inquiries (write) |
| `/ar/privacy` | سياسة الخصوصية | — | — |
| `/ar/<unknown>` | Designed 404 | home / products | — |
| `/admin` | Payload CMS (noindex) | — | — |
| `/sitemap.xml`, `/robots.txt` | SEO | — | public slugs |

## Navigation

- **Masthead (desktop):** logo (home) · عن الشروق · حلول الدواجن ▾ (نظرة عامة / التسمين / البياض / الأمهات) · المنتجات · كيف نعمل · المعرفة · EN · **تواصل مع الفريق**.
- **Sticky compact bar** (after the masthead scrolls away): الرئيسية + the same items + EN + CTA. (The official stacked lockup cannot shrink below 110px wide + 15% clear space, so it stays in the masthead.)
- **Mobile:** masthead logo + menu button → full-screen menu (numbered links, segment sub-links, CTA, language switch).
- **Footer:** quick links, solutions, product categories (→ filtered catalogue), contact invitation (verified channels only), privacy, language, back-to-top.

## Customer journeys (≤ 3 meaningful actions — spec §13.4)

1. **Farm manager (broilers) wants supplies:** Home hero → "استكشف حلولنا" → التسمين chapter CTA → segment page form (production type prefilled) → submit → reference shown. *(3 actions)*
2. **Buyer looking for a product:** Header المنتجات → filter by category/segment or search → product → "استفسر عن المنتج" (drawer, product id attached) → submit. *(3–4 actions)*; with the catalogue empty today: المنتجات → "اطلب قائمة المنتجات" inline form → submit.
3. **Supplier/manufacturer:** Footer كن شريكًا (or contact type "شراكة وتوريد") → partner form → submit. *(2 actions)*
4. **Sales team:** `/admin` → Inquiries (filter by status/type) → open record (product/segment/source context) → update status (lifecycle enforced) + notes.
5. **Editor:** `/admin` → Products → create with real label data → (authorised) approve + publish → appears in catalogue/sitemap after revalidation.
