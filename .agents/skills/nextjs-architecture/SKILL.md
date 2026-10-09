---
name: alshorouk-nextjs-architecture
description: Build and maintain the Alshorouk Next.js 16 App Router architecture with React 19 and strict TypeScript — locale routes under src/app/(frontend)/[locale], server/client boundaries, typed dictionaries, safe CMS data access, metadata, error and 404 handling, environment and route health — use when adding or changing routes, layouts, data fetching, i18n plumbing, server actions, or when fixing type, lint or build failures.
---

# Skill: Alshorouk Next.js Architecture

Role owner: Frontend Architect / Senior Engineer (spec §13.7). Shared foundations are orchestrator-owned (AGENTS.md "Parallel-agent rules"): propose changes to them instead of editing.

## Activation
- New route, layout, `loading`/`error`/`not-found` boundary, metadata, sitemap/robots, server action or route handler.
- Data fetching from Payload, URL/query-param handling, locale switching, environment variables.
- `pnpm typecheck`, `pnpm lint` or `pnpm build` failures; hydration warnings; wrong status codes.

## Inputs
- Pinned stack (`package.json`): `next@16.3.5`, `react@19.2.8`, TypeScript 5.9.3 (`strict`, `noUncheckedIndexedAccess`), Tailwind 4.3.3, Payload 3.90.2, Zod 4.6.5, Vitest 4.0.18, Playwright 1.64.0, pnpm 9. Aliases: `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`.
- **Next 16 docs ship in `node_modules/next/dist/docs/`** — read them instead of relying on memory. Changes that matter here: `middleware.ts` is now `proxy.ts`; `params`/`searchParams`/`cookies()`/`headers()` are async; `next/image` `priority` is deprecated → `preload` (or `fetchPriority="high"`); `images.qualities` defaults to `[75]`; `revalidateTag(tag, profile)` and Server-Action-only `updateTag`; `next lint` removed (we run ESLint CLI); dev output in `.next/dev` with a lockfile against a second `next dev`; `next build` no longer prints First Load JS; Turbopack is the default; `global-not-found.js` (experimental) for apps with several root layouts.
- Route map `src/i18n/routing.ts` (`routes`, `href`, `productHref`, `articleHref`, `switchLocalePath`, `absoluteUrl`), locale config `src/i18n/config.ts`, dictionaries `src/i18n/dictionaries/{ar,en}/*.ts`.
- CMS: `src/payload.config.ts`, collections in `src/payload/collections/*`, access helpers `src/payload/access.ts` (`publicContentWhere`, `readPublishedOrStaff`), generated types `src/payload-types.ts`.

## Procedure
1. **Route files** (`src/app/(frontend)/[locale]/…`, spec §4.2):

   | URL | File | Params / rendering |
   |---|---|---|
   | `/ar`, `/en` | `page.tsx` | static per locale |
   | `/[locale]/about`, `/poultry-solutions`, `/how-we-work`, `/contact`, `/partner-with-us`, `/privacy`, `/knowledge` | `<route>/page.tsx` | static; CMS-driven parts revalidated on publish |
   | `/[locale]/solutions/[segment]` | `solutions/[segment]/page.tsx` | `generateStaticParams` from `SEGMENT_KEYS`; `dynamicParams = false` |
   | `/[locale]/products` | `products/page.tsx` | dynamic (reads `searchParams`) |
   | `/[locale]/products/[slug]`, `/[locale]/knowledge/[slug]` | `[slug]/page.tsx` | params from approved+published records only; unknown/unapproved → `notFound()` |
   | `/` | redirect → `/ar` (`next.config.ts` `redirects()` or `src/proxy.ts`) | default-locale policy |
   | unknown paths | `[locale]/not-found.tsx` + a catch-all `[...rest]/page.tsx` calling `notFound()`; unmatched non-locale URLs via `global-not-found` if adopted | must return HTTP 404 with the designed page |

   `[locale]/layout.tsx` validates with `isLocale()` (else `notFound()`), exports `generateStaticParams` for `ar`/`en`, renders `<html lang dir>` and mounts `MotionRuntime`. `src/app/(payload)/…` and `importMap.js` are generated — never hand-edit; regenerate with `pnpm generate:importmap`.
2. **Server by default.** `'use client'` only for real interaction or animation (menu, locale switcher, filters/search, forms, motion scenes). Client components receive plain props (dictionary slices, DTOs) — never Payload docs, never functions from server modules. Modules that touch Payload, secrets or PII start with `import 'server-only'`.
3. **CMS data access** goes through the server-only data layer — `src/lib/payload.ts` (request-cached `getPayload()`), `src/lib/catalog.ts`, `src/lib/content.ts`, `src/lib/cms.ts` — never ad-hoc `getPayload` calls in pages. That layer:
   - ANDs `publicContentWhere()` into every public query (approved + published + not fixture). The Local API defaults to `overrideAccess: true`, so access rules alone do not protect you.
   - Knows the Payload 3.90 rule that, with `overrideAccess: false`, every path in your `where` is validated against field read access — staff-read fields (`isFixture`, `searchText`) in an anonymous query throw `QueryError` (details and fixes in the cms-and-product-catalog skill).
   - Maps results to whitelisted DTOs before rendering (drops `sourceEvidence`, `internalNotes`, `approvalEvidence`, `searchText`, unverified `manufacturer`, unapproved `labelPdf`).
   - Passes `locale` explicitly; when you must know whether English really exists, query with `fallbackLocale: false` (config uses `fallback: true`).
   - Degrades gracefully: if the database is unreachable, dictionary copy renders and the failure is logged — never a fake "success" or a blank page.
4. **Validate untrusted input with Zod** at the boundary: `params`, `searchParams` (catalogue via `parseCatalogParams()`: `category`, `segment`, `manufacturer`, `q`, `page`), form data (`inquirySchema`), CMS rich-text rendering, redirect targets. Invalid values are dropped or produce `notFound()` — never a 500.
5. **Single-source domain types.** Reuse the `as const` arrays (`locales`, `SEGMENT_KEYS`, `PRODUCT_CATEGORY_KEYS`, `AVAILABILITY`, `INQUIRY_TYPES`, `INQUIRY_STATUSES`, `APPROVAL_STATES`, `ROLES`, `METRIC_KEYS`) for Zod enums, select options and route params. Some exist twice so that client-safe modules avoid Payload imports (`CATEGORY_KEYS`/`SEGMENT_KEYS` in `src/lib/catalog-params.ts`, `INQUIRY_KINDS` in `src/lib/inquiries/schema.ts`) — keep a unit test asserting each copy equals its collection counterpart. Run `pnpm generate:types` after any schema change and keep `src/payload-types.ts` in the same change (the orchestrator commits).
6. **Mutations.** Lead forms use Server Actions (`'use server'`) with `useActionState`; they work without JS through `<form action>`. Server Actions get Next's built-in Origin/Host check; any route handler you add must verify `Origin` itself. Never expose Payload REST creation for public writes (Inquiries `create: nobody`).
7. **Caching and revalidation.** CMS hooks call `revalidateSite()` (`revalidatePath('/[locale]', 'layout')` + sitemap) on publish changes. Do not sprinkle `force-dynamic`; only the catalogue (search params) and nonce-based CSP (if adopted) require dynamic rendering. Use the Next 16 cache APIs from the bundled docs when adding finer tags.
8. **Metadata.** Every route's `generateMetadata` uses `buildMetadata()` from `src/lib/seo.ts`: indexable only when `NEXT_PUBLIC_SITE_ENV=production` **and** `site-settings.siteStatus = production`; `/en` stays `noindex` without `hreflang` pairing until `englishApproved`; filtered catalogue URLs pass `noindex`. Canonicals via `absoluteUrl`. See the seo-accessibility skill.
9. **Errors and loading.** `error.tsx` (client, with `reset()`) per meaningful segment, `loading.tsx` skeletons for the catalogue, designed `not-found.tsx`. Never swallow errors or render success on failure.
10. **Environment.** Read env only on the server except `NEXT_PUBLIC_*`. Variables in use: `DATABASE_URL` (`file:./data/alshorouk.db` default; `postgres://` selects the Postgres adapter, `push: false`, migrations in `src/migrations/postgres`), `PAYLOAD_SECRET` (required in production), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_ENV`, `S3_*`, `SMTP_*`, `INQUIRY_NOTIFY_EMAIL`, `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `SEED_FIXTURES`, `DEMO_FIXTURES`. Every new variable goes into `.env.example` with an explanation; never commit `.env`.
11. **Health checks** (when your task allows commands):
    ```bash
    pnpm typecheck && pnpm lint && pnpm test:unit
    for l in ar en; do for p in "" /about /poultry-solutions /solutions/broilers /solutions/layers /solutions/breeders /products /how-we-work /knowledge /contact /partner-with-us /privacy; do
      printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:3000/$l$p")" "/$l$p"; done; done
    for p in /ar/products/does-not-exist /ar/solutions/not-a-segment /xx /ar/unknown; do printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:3000$p")" "$p"; done  # expect 404
    ```
    Use the shared dev server on :3000; never start a second `next dev`. `pnpm build` runs only when the task authorises it (it can run alongside dev in Next 16).

## Checklists
- [ ] Every route in the table returns 200 in both locales; bad slugs, segments and locales return 404 with the designed page.
- [ ] No `'use client'` file imports Payload, `server-only` modules or secrets; no GSAP in server components.
- [ ] Public queries AND `publicContentWhere()` and return whitelisted DTOs.
- [ ] Params and search params validated with Zod; malformed queries render safely.
- [ ] `generateMetadata` present on every page; `/en` noindex while unapproved.
- [ ] Links built with `href()`/`productHref()`; no hard-coded `/ar/...` strings in components.
- [ ] Typecheck, lint, unit tests and build pass; browser console clean on each route.

## Deliverables
- Route, layout and data-layer code in the files your task owns; diff proposals for orchestrator-owned files.
- `docs/architecture.md` sections you changed (route table, data flow, rendering/caching decisions, env table).
- Command output (typecheck, lint, build, route health) saved to `docs/evidence/gate-3/` or the gate you are serving.

## Acceptance criteria
- All routes work with typecheck, lint and build passing and a clean browser console (spec §13.7 done condition, Gate 3).
- No draft, fixture or staff-only field reachable through a public page, RSC payload or API.
- Correct HTTP status for every route class (200 / 404 / redirect).
- Locale switching lands on the equivalent page with the query preserved.

## Failure recovery & escalation
- **Type errors from generated Payload types:** regenerate (`pnpm generate:types`) before patching types by hand.
- **Hydration mismatch:** look for time/locale/random values rendered on both sides, browser-only APIs in render, or invalid nesting; fix the source, never suppress the warning globally.
- **Build-only failures:** read the bundled Next 16 docs for the API in question; check for server-only imports leaking into client bundles.
- **A change needs `next.config.ts`, `payload.config.ts`, `package.json` or a new dependency:** report the exact diff to the orchestrator.
- **Postgres-specific behaviour cannot be verified locally** (no PostgreSQL server here): record it in `docs/open-items.md`; do not claim it works.

## Spec references
§4.2 (routes), §7.3, §9.1–9.3, §10.4, §11, §12.1, §12.3, §13.7, §13.13, §15 Phase 3, §16.1 (E2E 7 direct reload / 404 / malformed query), §18; AGENTS.md "Tech stack", "Code conventions".
