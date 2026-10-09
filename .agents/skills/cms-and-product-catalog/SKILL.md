---
name: alshorouk-cms-and-product-catalog
description: Build and verify the Payload 3.90 CMS and the approval-gated poultry product catalogue — approvalStatus plus isPublished publication gates, server-side RBAC for admin, editor and sales, Arabic search normalisation, URL facet state, empty-catalogue and detail states, revalidation and fixture database isolation — use when touching collections, globals, access rules, seed scripts, catalogue or product pages, or the editor workflow.
---

# Skill: Alshorouk CMS & Product Catalogue

Role owner: CMS / Backend Engineer (spec §13.8). Done when an authorised editor can publish an approved product, a sales user can see a submitted inquiry, and the public can never see drafts.

## Activation
- Editing `src/payload.config.ts`, `src/payload/collections/*`, `src/payload/globals/*`, `src/payload/access.ts`, `src/payload/fields.ts`, `src/payload/hooks/*`, `src/scripts/seed.ts` (orchestrator-owned unless your task grants them).
- Building `/[locale]/products`, `/[locale]/products/[slug]`, the home product preview (Scene 8), segment pages' category blocks, or the server data layer that reads CMS content.
- Writing RBAC/publication tests or `docs/cms-editor-guide.md`.

## Inputs
- Collections: `products`, `product-categories` (keys `feed | supplements | medicines | vaccines`), `poultry-segments` (`broilers | layers | breeders`), `articles`, `faqs`, `media`, `inquiries`, `content-approvals`, `users`; globals `homepage`, `metrics`, `site-settings`. REST at `/api/<slug>`; GraphQL disabled.
- Gates: `approvalFields()` (`approvalStatus` ∈ `approved | review_required | placeholder_internal | hidden`, `isPublished`, staff-only `approvalEvidence`, create-only `isFixture`); `approvalGuard` (only admin or editor with `canApprove` may approve; leaving `approved` unpublishes); `publicContentWhere()` = approved AND published AND not fixture (fixtures visible only when `DEMO_FIXTURES=true`).
- Search helpers `src/lib/search/normalize.ts`: `toWesternDigits`, `normalizeForSearch`, `searchTokens` (≤ 6 tokens, ≤ 80 chars), `buildSearchText`; Products' `computeSearchText` hook fills the staff-only `searchText` field.
- Database: `DATABASE_URL` scheme selects SQLite (`file:./data/alshorouk.db`, dev/CI/e2e) or PostgreSQL (`postgres://`, production, `push: false`, migrations in `src/migrations/postgres`). No local PostgreSQL server exists in this environment.
- Spec §1.3, §6.4–6.5, §10, §16.1; dictionary `src/i18n/dictionaries/{ar,en}/products.ts` (catalogue states, availability labels, safety notes).

## Procedure
1. **Publication contract (server-side, never UI-only).** Public = `approvalStatus = 'approved'` AND `isPublished = true` AND not `isFixture`. Every public read ANDs `publicContentWhere()`. Because the Local API defaults to `overrideAccess: true` (and `searchText` is staff-read), run catalogue queries server-side with the explicit where-clause and map results to a whitelisted DTO; never pass raw docs to client components or JSON-LD.
2. **RBAC matrix to keep true (test it):**

   | Area | admin | editor | editor + canApprove | sales | public |
   |---|---|---|---|---|---|
   | Products | CRUD, approve, publish | create/update drafts | + approve/publish | read (context) | approved+published only |
   | Categories / segments | CRUD | update | update | read | read |
   | Media | CRUD | create/update | create/update | read | non-restricted only |
   | Inquiries (PII) | read/update/delete | ✗ | ✗ | read, update status + notes | ✗ (REST `create: nobody`) |
   | Metrics global | update | ✗ | update | read | read |
   | Site settings | update | ✗ | ✗ | read | verified channels only |
   | Users | manage roles/`canApprove` | self | self | self | ✗ |

   Also enforce: publishing (`isPublished` false→true) requires approval authority; an edit to an approved record by a non-approver returns it to `review_required` (auto-unpublished) so unapproved text never goes live; submitted inquiry fields are immutable server-side (field `access.update`, not just `admin.readOnly`); every collection using `approvalGuard` denies anonymous create/update/delete (the guard treats user-less Local API calls as trusted server code). Report any gap you find to the orchestrator.
3. **Product data rules.** Only real, authorised records — nothing is ever seeded into `products` outside fixtures. Public card/detail fields: localized name (`nameAr`/`nameEn` if approved), category, segments, `packSize`, `form`, `availabilityStatus` label (`inquiry_only | on_request | confirmed`), images. `manufacturer` only when `manufacturerVerified`; `labelPdf` only when `labelPdfApproved` and the media is not `restricted` and its `license` is not `unknown`; `searchText` must not include an unverified manufacturer. Medicines/vaccines show `safetyText` (or the default vet line) plus `detail.infoNote`. No prices, no "in stock" unless `confirmed`, no dosage fields.
4. **Arabic search.** Normalise both sides with the shared helpers: NFKC, Arabic-Indic → Western digits, strip tashkeel and tatweel, unify أ/إ/آ/ٱ → ا, ى → ي, ة → ه, lower-case Latin, collapse punctuation. Deliberately keep ؤ/ئ and the article «ال», and never stem — medicine names must not over-match. Query: AND of `{ searchText: { contains: token } }` for each of `searchTokens(q)`; ignore `q` shorter than 2 characters after normalisation. Display text is never normalised. Unit tests: diacritics/alef/ya/ta-marbuta variants match; digits normalise; SKUs survive; output is idempotent; valid text never becomes empty.
5. **URL facet state** (spec names): `?category=<feed|supplements|medicines|vaccines>&type=<broilers|layers|breeders>&q=<text>&page=<n>`. Parse with Zod (`.catch(undefined)` for bad enums, `q` trimmed ≤ 80, `page` int 1–500 `.catch(1)`); unknown params are dropped, never a 500. Map keys to relationship ids via the public taxonomy read; filter with `category: { equals: id }` and `segments: { in: [id] }`. Changing a filter resets `page`; "reset" links to `href(locale, 'products')`. Facet counts and the total are real counts over published records with the other active filters applied — never a hard-coded 150. Filters and search work without JS (GET form); with JS, `ProductSearch` debounces ~300 ms and uses `router.replace` preserving other params. Filtered/search URLs are `noindex, follow` with canonical `/[locale]/products`.
6. **States.** Loading skeleton (`loading.tsx`); error boundary with retry; filtered-empty (reset + inquiry CTA); **empty catalogue** (zero public products at all): category browser of the four pillars, explanation (`states.emptyCatalog*`) and a working `اطلب قائمة المنتجات` CTA to the product inquiry form — the page is complete and useful, never broken or padded with fake cards. Home Scene 8 follows the same rule.
7. **Detail page.** Fetch by slug through the gated layer; missing/unapproved → `notFound()` (404, never indexed, absent from the sitemap). `generateStaticParams` only from public records. JSON-LD `Product` only with factual fields (no `offers`, ratings or reviews). "استفسر عن المنتج" opens the inquiry drawer/route with the product **id**; the server re-reads the product and stores `productRef` + `productLabel` (lead-form-engineering skill).
8. **Revalidation.** Collection/global hooks call `revalidateSite()`; after a publish/unpublish, verify the catalogue, detail, home preview and `sitemap.xml` update without a rebuild.
9. **Fixture database isolation.** Fixtures exist only for tests and local demos:
   - Run against a throwaway SQLite file: `DATABASE_URL=file:./data/e2e.db pnpm seed:fixtures` (sets `SEED_FIXTURES=true`; `isFixture` is only creatable then). Never point fixtures at `data/alshorouk.db` dev content or any `postgres://` URL; the seed script should refuse both (request the guard if missing).
   - Fixture records are unmistakably fake (`[اختبار] …` / `[TEST] …`, SKUs `TEST-0001`, manufacturer "Fixture (test)"), no real drug, brand or active-ingredient names, no dosage text.
   - Public visibility of fixtures requires `DEMO_FIXTURES=true` — set only in local e2e/demo runs, never in staging or production env files.
10. **Migrations and environments.** SQLite dev uses schema push; production PostgreSQL needs generated migrations (`pnpm payload migrate:create` with a Postgres `DATABASE_URL`, then `pnpm payload migrate` at deploy). That cannot be generated or verified here (no PostgreSQL) — keep the open item and do not claim Postgres readiness without a run log.
11. **Editor guide.** Keep `docs/cms-editor-guide.md` current (Arabic-first): roles, adding a product with evidence, media rights fields, approval → publish flow, why changes need re-approval, inquiry statuses `new → contacted → qualified → closed / rejected`, what never to enter (dosage, prices, unverified claims, sample phone numbers).

## Checklists
**Publication and access**
- [ ] Anonymous REST: `GET /api/products?where[approvalStatus][equals]=review_required` → 0 docs; `GET /api/inquiries` and `POST /api/inquiries` → 403; `GET /api/users` → 403.
- [ ] Draft/unapproved/fixture product → 404 page, absent from sitemap and search results.
- [ ] Editor without `canApprove` cannot approve or publish (403); approver can; leaving approved unpublishes.
- [ ] Sales sees product context on an inquiry but cannot edit products or submitted inquiry data.

**Catalogue**
- [ ] Facets/total reflect real published counts; URL state shareable; reset works; malformed params safe.
- [ ] Search matches Arabic spelling variants and SKUs without over-matching.
- [ ] Empty-catalogue and filtered-empty states render with working CTAs at 390 and 1440.
- [ ] No staff-only field in HTML, RSC payload or JSON-LD (`rg` the page source for `sourceEvidence`, `internalNotes`, `searchText`).

## Deliverables
- Collections/globals/access/hooks changes (or diff proposals), catalogue and detail routes, server data layer, seed guards.
- Integration tests (Vitest + Payload Local API on a temporary SQLite DB) for RBAC, publication guard, search normalisation and facets; e2e for journeys 2 and 6 (spec §16.1).
- `docs/cms-editor-guide.md`; evidence logs under `docs/evidence/gate-5/`.

## Acceptance criteria
- Authorised editor publishes an approved product → it appears in catalogue, detail, home preview and sitemap; unpublishing removes it everywhere (spec §13.8).
- Sales user reads a product-linked inquiry in `/admin`; the public cannot read drafts, fixtures, PII or staff fields through pages or APIs.
- Catalogue search, filters, pagination and empty states pass unit + e2e tests in both locales.

## Failure recovery & escalation
- **Access test fails:** fix the rule server-side (collection/field access or hook) — never by hiding admin UI.
- **Search over-matches medicine names:** remove the offending folding rule and add a regression test; prefer missing a fuzzy match over a wrong product.
- **Postgres-only behaviour (migrations, `ILIKE`, JSON columns) unverified:** record in `docs/open-items.md`; plan verification on an approved staging database.
- **Real product data absent:** ship the empty-catalogue experience; never invent records to fill the grid.
- **Schema change needed by the UI:** agree it with the orchestrator first (spec §13.13: backend schema before product UI), then regenerate types.

## Spec references
§1.2–1.4, §5 Scene 8, §6.3–6.5, §9.1, §9.3, §10.1–10.4, §11.2, §12.1 (Product schema, filtered URLs), §13.8, §15 Phase 3.5 and Phase 5.2, §16.1 (unit, integration, E2E 2 and 6), §16.4, §21 Q9.
