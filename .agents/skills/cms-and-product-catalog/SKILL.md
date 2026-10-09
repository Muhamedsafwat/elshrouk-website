---
name: alshorouk-cms-and-product-catalog
description: Build and verify the Payload 3.90 CMS and the approval-gated poultry product catalogue — approvalStatus plus isPublished publication gates, server-side RBAC for admin, editor and sales, Arabic search normalisation, URL facet state, empty-catalogue and detail states, revalidation and fixture database isolation — use when touching collections, globals, access rules, seed scripts, catalogue or product pages, or the editor workflow.
---

# Skill: Alshorouk CMS & Product Catalogue

Role owner: CMS / Backend Engineer (spec §13.8). Done when an authorised editor can publish an approved product, a sales user can see a submitted inquiry, and the public can never see drafts.

## Activation
- Editing `src/payload.config.ts`, `src/payload/collections/*`, `src/payload/globals/*`, `src/payload/access.ts`, `src/payload/fields.ts`, `src/payload/hooks/*`, `src/scripts/seed.ts` (orchestrator-owned unless your task grants them).
- Building or changing `/[locale]/products`, `/[locale]/products/[slug]`, the home product preview (Scene 8), segment-page product blocks, or the server data layer (`src/lib/payload.ts`, `src/lib/catalog.ts`, `src/lib/catalog-params.ts`, `src/lib/content.ts`, `src/lib/cms.ts`).
- Writing RBAC/publication tests or `docs/cms-editor-guide.md`.

## Inputs
- Collections: `products`, `product-categories` (keys `feed | supplements | medicines | vaccines`), `poultry-segments` (`broilers | layers | breeders`), `articles`, `faqs`, `media`, `inquiries`, `content-approvals`, `users`; globals `homepage`, `metrics`, `site-settings`. REST at `/api/<slug>`; GraphQL disabled.
- Gates: `approvalFields()` (`approvalStatus` ∈ `approved | review_required | placeholder_internal | hidden`, `isPublished`, staff-only `approvalEvidence`, create-only + staff-read `isFixture`); `approvalGuard` (only admin or editor with `canApprove` may approve; leaving `approved` unpublishes); `publicContentWhere()` = approved AND published AND not fixture (the fixture clause is dropped when `DEMO_FIXTURES=true`).
- Search: `toWesternDigits`, `normalizeForSearch`, `searchTokens` (≤ 6 tokens, ≤ 80 chars), `buildSearchText` in `src/lib/search/normalize.ts`; the Products `computeSearchText` hook fills the staff-read `searchText` field.
- Catalogue URL contract `src/lib/catalog-params.ts`: `parseCatalogParams()` (Zod), `catalogHref()`, `hasActiveFilters()`, `PAGE_SIZE = 12`; params `category`, `segment`, `manufacturer` (verified manufacturers only), `q`, `page`.
- Database: `DATABASE_URL` scheme selects SQLite (`file:./data/alshorouk.db` for dev/CI/e2e) or PostgreSQL (`postgres://`, production, `push: false`, migrations in `src/migrations/postgres`). No PostgreSQL server exists in this environment.
- Spec §1.3, §6.4–6.5, §10, §16.1; dictionary `src/i18n/dictionaries/{ar,en}/products.ts` (catalogue states, availability labels, safety notes).

## Procedure
1. **Publication contract (server-side, never UI-only).** Public = `approvalStatus = 'approved'` AND `isPublished = true` AND not `isFixture`. Every public read ANDs `publicContentWhere()` and returns whitelisted DTOs (no `sourceEvidence`, `internalNotes`, `approvalEvidence`, `searchText`, unverified `manufacturer`, unapproved `labelPdf`) — never raw docs into client components or JSON-LD.
   - **Payload 3.90 query-validation trap:** with `overrideAccess: false`, `find`/`count` validate every path in *your* `where` against field read access (`validateQueryPaths` → `QueryError` "path cannot be queried"). An anonymous query that mentions a staff-read field — `isFixture` (inside `publicContentWhere()`) or `searchText` — therefore throws. Pick one consistent fix with the orchestrator: make those two fields publicly readable but never selected/returned, **or** run public reads with `overrideAccess: true` + explicit `publicContentWhere()` + a DTO whitelist (the Local API defaults to `overrideAccess: true`).
   - Always test the anonymous catalogue **without** `DEMO_FIXTURES` (that flag removes the `isFixture` clause and can hide this failure) and with a non-empty `q`.
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

   Also enforce (and test) — report any gap to the orchestrator, who owns these files:
   - Publishing (`isPublished` false → true) requires approval authority, not only approving.
   - An edit to an approved record by a non-approver returns it to `review_required` (auto-unpublished), so unapproved text never goes live.
   - Submitted inquiry fields are immutable server-side (field `access.update`), not just `admin.readOnly` in the UI.
   - Every collection using `approvalGuard` denies anonymous create/update/delete — the guard treats user-less Local API calls as trusted server code.
3. **Product data rules.** Only real, authorised records — nothing is seeded into `products` outside fixtures. Public card/detail fields: localized name (`nameAr`; `nameEn` if approved), category, segments, `packSize`, `form`, `availabilityStatus` label (`inquiry_only | on_request | confirmed`), images. `manufacturer` only when `manufacturerVerified`; `labelPdf` only when `labelPdfApproved`, the media is not `restricted` and its `license` is not `unknown`; `searchText` should not include an unverified manufacturer (otherwise search reveals the association). Medicines/vaccines show `safetyText` (or the default vet line) plus `detail.infoNote`. No prices, no "in stock" unless `confirmed`, no dosage fields.
4. **Arabic search.** Both sides go through the shared helpers: NFKC, Arabic-Indic → Western digits, strip tashkeel and tatweel, unify أ/إ/آ/ٱ → ا, ى → ي, ة → ه, lower-case Latin, collapse punctuation. ؤ/ئ and the article «ال» are deliberately kept and nothing is stemmed, so distinct medicine names do not over-match. Query = AND of `{ searchText: { contains: token } }` for each of `searchTokens(q)` (see the step 1 trap). Display text is never normalised. Unit tests: diacritic/alef/ya/ta-marbuta variants match; digits normalise; SKUs survive; output is idempotent; valid text never becomes empty.
5. **URL facet state** (`src/lib/catalog-params.ts`):
   - `?category=<feed|supplements|medicines|vaccines>&segment=<broilers|layers|breeders>&manufacturer=<verified name>&q=<text>&page=<n>`; invalid values `.catch()` to undefined, `q` trimmed ≤ 80, `page` 1–500 — never a 500.
   - Filters use relationship sub-paths (`'category.key'`, `'segments.key'`); `manufacturer` always pairs with `manufacturerVerified: true`.
   - Links come from `catalogHref(locale, current, changes)` — changing a filter resets `page`; "reset" = `catalogHref(locale, {})`.
   - Facet counts and totals are real counts over public records with the other active filters applied — never a hard-coded 150.
   - Filters and search work without JS (GET form); with JS, search debounces ~300 ms and uses `router.replace`, preserving the other params; fire `trackEvent('product_filter' | 'product_search')` with allow-listed props only.
   - Any active filter/search (`hasActiveFilters`) → `noindex, follow` with canonical `/[locale]/products`.
6. **States.** Loading skeleton (`loading.tsx`); error boundary with retry; filtered-empty (reset + inquiry CTA); **empty catalogue** (zero public products at all): category browser of the four pillars, explanation (`states.emptyCatalog*`) and a working `اطلب قائمة المنتجات` CTA to the product inquiry form — the page is complete and useful, never broken or padded with fake cards. Home Scene 8 follows the same rule.
7. **Detail page.** Fetch by slug through the gated layer; missing/unapproved/fixture → `notFound()` (404, never indexed, absent from the sitemap). `generateStaticParams` only from public records. JSON-LD `Product` only with factual fields (no `offers`, ratings or reviews). "استفسر عن المنتج" opens the inquiry drawer/route with the product **id**; the server re-reads the product and stores `productRef` + `productLabel` (lead-form-engineering skill).
8. **Revalidation.** Collection/global hooks call `revalidateSite()` (`revalidatePath('/[locale]', 'layout')` + sitemap). After publish/unpublish verify catalogue, detail, home preview and `sitemap.xml` update without a rebuild.
9. **Fixture database isolation.** Fixtures exist only for tests and local demos:
   - `DATABASE_URL=file:./data/e2e.db pnpm seed:fixtures` — the seed script refuses unless the URL contains `e2e`, `test` or `fixture`; `isFixture` is only creatable while `SEED_FIXTURES=true`. Never point it at `data/alshorouk.db` or any `postgres://` URL.
   - Fixture records are unmistakably fake (`[اختبار] …` / `[TEST] …`, `fixture-*` slugs), with no real drug, brand or active-ingredient names and no dosage text.
   - Public visibility of fixtures requires `DEMO_FIXTURES=true` (which also shows the demo banner) — local e2e/demo runs only, never in staging or production env files.
10. **Migrations and environments.** SQLite dev uses schema push; production PostgreSQL needs generated migrations (`pnpm payload migrate:create` with a Postgres `DATABASE_URL`, then `pnpm payload migrate` at deploy). They cannot be generated or verified here (no PostgreSQL) — keep OI-12 open and never claim Postgres readiness without a run log. After any schema change run `pnpm generate:types`.
11. **Editor guide.** Keep `docs/cms-editor-guide.md` current (Arabic-first): roles, adding a product with evidence, media rights fields, approval → publish flow, why edits need re-approval, inquiry statuses `new → contacted → qualified → closed / rejected`, what never to enter (dosage, prices, unverified claims, sample phone numbers).

## Checklists
**Publication and access**
- [ ] Anonymous REST: `GET /api/products?where[approvalStatus][equals]=review_required` → 0 docs or 403; `GET /api/inquiries` and `POST /api/inquiries` → 403; `GET /api/users` → 403.
- [ ] Anonymous catalogue renders with and without `q`, with `DEMO_FIXTURES` unset (no `QueryError` in the server log).
- [ ] Draft/unapproved/fixture product → 404 page, absent from sitemap and search results.
- [ ] Editor without `canApprove` cannot approve or publish (403); approver can; leaving approved unpublishes.
- [ ] Sales sees product context on an inquiry but cannot edit products or submitted inquiry data.

**Catalogue**
- [ ] Facets/total reflect real public counts; URL state shareable; reset works; malformed params safe.
- [ ] Search matches Arabic spelling variants and SKUs without over-matching.
- [ ] Empty-catalogue and filtered-empty states render with working CTAs at 390 and 1440.
- [ ] No staff-only field in HTML, RSC payload or JSON-LD (search the page source for `sourceEvidence`, `internalNotes`, `searchText`, `approvalEvidence`).

## Deliverables
- Collections/globals/access/hooks changes (or diff proposals), catalogue and detail routes, server data layer, seed guards.
- Integration tests (Vitest + Payload Local API on a temporary SQLite DB) for RBAC, the publication guard, anonymous query validation, search normalisation and facets; E2E journeys 2 and 6 (spec §16.1).
- `docs/cms-editor-guide.md`; evidence logs under `docs/evidence/gate-5/`.

## Acceptance criteria
- Authorised editor publishes an approved product → it appears in catalogue, detail, home preview and sitemap; unpublishing removes it everywhere (spec §13.8).
- Sales user reads a product-linked inquiry in `/admin`; the public cannot read drafts, fixtures, PII or staff fields through pages or APIs.
- Catalogue search, filters, pagination and empty states pass unit + E2E tests in both locales, as an anonymous visitor.

## Failure recovery & escalation
- **`QueryError: path cannot be queried`:** a staff-read field is in a public `where` with `overrideAccess: false` — apply the step 1 fix; do not silence the error.
- **Access test fails:** fix the rule server-side (collection/field access or hook) — never by hiding admin UI.
- **Search over-matches medicine names:** remove the offending folding rule and add a regression test; prefer missing a fuzzy match over a wrong product.
- **Postgres-only behaviour (migrations, case-insensitive matching, JSON columns) unverified:** record it in `docs/open-items.md`; plan verification on an approved staging database.
- **Real product data absent:** ship the empty-catalogue experience; never invent records to fill the grid.
- **Schema change needed by the UI:** agree it with the orchestrator first (spec §13.13: backend schema before product UI), then regenerate types.

## Spec references
§1.2–1.4, §5 Scene 8, §6.3–6.5, §9.1, §9.3, §10.1–10.4, §11.2, §12.1 (Product schema, filtered URLs), §13.8, §15 Phase 3.5 and Phase 5.2, §16.1 (unit, integration, E2E 2 and 6), §16.4, §21 Q9.
