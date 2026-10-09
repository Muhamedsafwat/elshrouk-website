# Architecture — Alshorouk website

**Status:** implemented foundation (Phase 3) · **Owner:** orchestrator / technical architect

## 1. Stack (pinned in package.json)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.3.5 App Router (Turbopack), React 19.2 | Server Components by default; client components only for interaction/motion |
| Language | TypeScript 5.9 strict (+ `noUncheckedIndexedAccess`) | TS 7 (native) deliberately not used — Next/Payload tooling expects the JS compiler API |
| CMS | Payload 3.90.2 embedded in the Next app | Admin at `/admin`, REST at `/api/*` (GraphQL disabled), Local API for server rendering |
| Database | SQLite (`@payloadcms/db-sqlite`) locally / CI / e2e · PostgreSQL (`@payloadcms/db-postgres`) in production | Selected by `DATABASE_URL` scheme in `src/payload.config.ts`. No Docker/Postgres on the build machine. |
| Media storage | Local `media/` in development · S3-compatible via `@payloadcms/storage-s3` when `S3_BUCKET` is set | |
| Email | `@payloadcms/email-nodemailer` only when `SMTP_HOST` is set | Otherwise inquiries are stored and a log line records "notifications pending SMTP configuration" |
| Styling | Tailwind CSS 4 (CSS-first `@theme` tokens in `src/styles/globals.css`) | Semantic section themes via `data-theme` |
| Fonts | Self-hosted OFL Alexandria (Arabic, staging stand-in for licensed Thmanyah) + Montserrat (Latin & figures) via `next/font/local` with explicit unicode-ranges | `src/styles/fonts.ts` documents the swap to Thmanyah |
| Motion | GSAP 3.15 + ScrollTrigger + DrawSVG (`@gsap/react` `useGSAP`); CSS keyframes for first-paint intros | No Lenis, no WebGL (not justified by the brief) |
| Validation | Zod 4 (shared client/server inquiry schema) | |
| Tests | Vitest (unit), Playwright (e2e + screenshots), axe-core | |

## 2. Request flow

```
Browser ─► src/proxy.ts  (unprefixed path → 307 /ar…; skips /admin, /api, _next, files)
        ─► app/(frontend)/[locale]/layout.tsx   (<html lang dir>, fonts, header, footer, MotionRuntime)
             └─ page.tsx (Server Component) ─► src/lib/{catalog,content,cms}.ts ─► Payload Local API ─► SQLite/Postgres
        ─► app/(payload)/admin/…  (Payload admin UI, its own root layout)
        ─► app/(payload)/api/[...slug]  (Payload REST: auth, admin data; public reads obey collection access)
Forms ─► Server Action (src/lib/inquiries/action.ts) ─► zod ─► honeypot/rate-limit/origin ─► payload.create(inquiries)
```

## 3. Routing & i18n

- Locales `ar` (default, RTL) and `en` (LTR). Identical slugs across locales → lossless locale switching (`switchLocalePath`).
- Typed dictionaries `src/i18n/dictionaries/{ar,en}/*.ts`; EN files are typed against the AR shape (compile-time parity).
- Unknown paths under a locale hit `[locale]/[...rest]` → `notFound()` → designed localized 404.
- English pages are `noindex` and excluded from hreflang/sitemap until `site-settings.englishApproved`.

## 4. Content model (Payload)

| Slug | Type | Public read | Write | Purpose |
|---|---|---|---|---|
| products | collection | approved ∧ published ∧ ¬fixture | admin, editor (approve: admin / editor+canApprove) | Real catalogue records only |
| product-categories | collection | all | admin/editor | 4 business lines |
| poultry-segments | collection | all | admin/editor | broilers / layers / breeders |
| articles | collection | approved ∧ published | admin/editor | Knowledge hub (none approved yet) |
| faqs | collection | approved ∧ published | admin/editor | Business/process Q&A |
| media | collection | non-restricted | admin/editor | Rights metadata, alt text, focal point |
| inquiries | collection | **none** | create: server action only · read/update: admin, sales · delete: admin | Leads with lifecycle new→contacted→qualified→closed/rejected |
| content-approvals | collection | none | admin/editor | Mirrors content/approval-register.md |
| users | auth collection | self/admin | admin | Roles admin/editor/sales, lockout after 5 attempts |
| homepage | global | all | admin/editor | Editable hero/statement/closing copy + section toggles |
| metrics | global | all | admin or editor with canApprove | The three approved figures with mandatory qualifiers |
| site-settings | global | all (contact values only when verified) | admin | Verified channels, staging/production status, feature flags |

Server-side guarantees: `approvalGuard` (only authorised users approve; unapproved ⇒ unpublished), field-level access for internal fields, `overrideAccess:false` + explicit `publicContentWhere()` on every public query (defence in depth), inquiry lifecycle enforced in a hook.

## 5. Rendering & caching

- Pages are statically generated per locale and revalidated on demand: every collection/global `afterChange/afterDelete` hook calls `revalidatePath('/[locale]', 'layout')` (+ sitemap). Home has `revalidate = 3600` as a safety net.
- Catalogue listing with query params renders dynamically (filters/search/pagination are URL state).
- CMS read helpers degrade to the versioned dictionary copy if the database is unreachable (logged, never presented as success).

## 6. Motion architecture

- `MotionRuntime` (one client component in the layout) animates every declarative `data-reveal` element with ScrollTrigger batches; re-scans after navigation and for late DOM nodes; marks elements revealed for CSS.
- Content is hidden only under `html.js` + `prefers-reduced-motion: no-preference`; a 3.5 s fail-safe (`motion-off`) reveals everything if motion never boots.
- Hero intros are pure CSS keyframes (start at first paint → fast LCP, no JS dependency); scroll-linked work uses GSAP with `gsap.matchMedia` breakpoints and automatic revert.

## 7. Security

- CSP + security headers in `next.config.ts` (no third-party origins), HSTS in production, `poweredByHeader:false`.
- Payload CSRF/CORS limited to `NEXT_PUBLIC_SITE_URL`; admin `noindex`; GraphQL disabled; login lockout.
- Forms: Zod server validation, honeypot, per-IP (hashed) rate limit, size bounds, origin check, idempotency key, success only after persistence, no PII in logs or analytics.
- Secrets only via environment (`.env.example` documents every variable); `.env*`, databases and uploads are git-ignored.

## 8. Directory map

```
src/app/(frontend)/[locale]/…   public routes (see docs/site-map.md)
src/app/(payload)/…             Payload admin + REST (generated files — do not hand-edit)
src/components/{layout,brand,motion,ui,media,forms,products,sections/*,seo,content}
src/content/photos.ts           licensed photo registry (provenance: docs/image-provenance.md)
src/i18n/                       config, routing, format, dictionaries
src/lib/                        catalog, content, cms, seo, analytics, inquiries, search, motion
src/payload/                    collections, globals, access, fields, hooks, admin components
src/scripts/seed.ts             idempotent CMS seed (+ isolated e2e fixtures)
tests/unit, tests/e2e           Vitest + Playwright
docs/, content/                 governance, QA and handoff documents
```
