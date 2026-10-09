# الشروق · Alshorouk — corporate website & CMS

Arabic-first (RTL) corporate website for **Alshorouk**, a B2B supplier/distributor serving **poultry farms only** (broilers · layers · breeders): poultry feed, feed supplements, and veterinary medicines & vaccines.

- Public site: Next.js 16 App Router, `/ar` (default) and `/en`.
- CMS: Payload 3 embedded at `/admin` (products, articles, FAQs, inquiries, media, approvals, settings).
- Source of truth: `ALSHOROUK_ANTIGRAVITY_MASTER_BUILD_SPEC.md` + `Alshorouk_Brand_Guidelines.pdf`. Agent rules: `AGENTS.md`; skills: `.agents/skills/*/SKILL.md`.

> **Status:** working local application. **Not deployed.** Publishing requires the approvals listed in `docs/open-items.md` (licensed Thmanyah font, verified contact data, real product list, legal review, commissioned photography, English approval, hosting credentials).

## Requirements

- Node.js ≥ 20.18 (tested on 22.14) · pnpm 9+
- No Docker or database server needed for local work (SQLite file). Production uses PostgreSQL.

## Quick start

```bash
pnpm install
cp .env.example .env          # then set PAYLOAD_SECRET to a long random string
pnpm seed                     # taxonomy, approved metrics, homepage copy, FAQs, settings, approval records
pnpm dev                      # http://localhost:3100  (admin: http://localhost:3100/admin)
```

The first visit to `/admin` asks you to create the first user — it automatically becomes **admin**. (Alternatively set `SEED_ADMIN_EMAIL` + `SEED_ADMIN_PASSWORD` before `pnpm seed`.)

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server on :3100 (Turbopack) |
| `pnpm build` / `pnpm start` | Production build / serve on :3100 |
| `pnpm typecheck` | `tsc --noEmit` (strict) |
| `pnpm lint` | ESLint |
| `pnpm test:unit` | Vitest unit tests (`tests/unit`) |
| `pnpm test:e2e` | Playwright journeys against a production build on :3200 with the isolated fixture DB (see below) |
| `pnpm screenshots` | Viewport-matrix screenshots into `screenshots/` |
| `pnpm seed` / `pnpm seed:fixtures` | Seed CMS content / + isolated test fixtures |
| `pnpm generate:types` · `pnpm generate:importmap` | Regenerate Payload types / admin import map after schema or admin-component changes |

### End-to-end tests (isolated data)

```bash
pnpm build
DATABASE_URL=file:./data/e2e.db pnpm seed:fixtures   # creates [TEST] products + test staff accounts
pnpm test:e2e                                        # starts `next start -p 3200` against data/e2e.db
```

Fixture products are flagged `isFixture`, labelled `[اختبار]/[TEST]`, refused unless the database name contains `e2e|test|fixture`, and are never visible on the public site unless `DEMO_FIXTURES=true` (which also shows a "demo data" banner).

## Project map

```
src/app/(frontend)/[locale]/   public routes  ·  src/app/(payload)/  CMS admin + REST (generated)
src/components/                layout, brand (logo, Sunrise System), motion, ui, media, forms, products, sections
src/i18n/                      locales, routing, typed AR/EN dictionaries
src/lib/                       catalog, content, cms, seo, inquiries (schema, server action), search, motion, analytics
src/payload/                   collections, globals, access control, hooks
src/content/photos.ts          licensed photography registry (provenance in docs/image-provenance.md)
public/brand/                  official logo vectors extracted from the brand PDF
docs/                          architecture, site map, art direction, brand audit, QA, deployment, open items …
content/approval-register.md   claim-by-claim approval tracking
```

## Key guarantees

- **No fabricated content:** no invented products, contacts, testimonials, certifications or SLAs. Products/articles/FAQs render only when `approved` **and** published; contact channels only when verified.
- **Brand fidelity:** logo files are the original vectors extracted from the PDF (pixel-verified); palette `#FE3300 #FEB821 #000 #FFF`; Montserrat for Latin/figures; Thmanyah pending licence (Alexandria OFL stand-in).
- **Leads are real:** inquiries are validated (shared Zod schema), rate-limited, de-duplicated and **persisted in the CMS before** success is shown; sales staff manage them in `/admin`.
- **Accessibility & motion:** WCAG 2.2 AA target, full keyboard support, `prefers-reduced-motion` honoured everywhere, content visible without JavaScript.

## Documentation

`docs/architecture.md` · `docs/site-map.md` · `docs/art-direction.md` · `docs/brand-audit.md` · `docs/motion-storyboard.md` · `docs/reference-audit.md` · `docs/image-provenance.md` · `docs/cms-editor-guide.md` · `docs/deployment.md` · `docs/test-report.md` · `docs/performance-report.md` · `docs/quality-gates.md` · `docs/task-board.md` · `docs/open-items.md` · `content/approval-register.md`
