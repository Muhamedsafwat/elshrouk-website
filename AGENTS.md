# ALSHOROUK WEBSITE — AGENT OPERATING RULES

This repo is a full commercial Arabic-first website for Alshorouk (الشروق), a B2B supplier/distributor serving **poultry farms ONLY**.
The root master specification is authoritative: `ALSHOROUK_ANTIGRAVITY_MASTER_BUILD_SPEC.md`.
Follow its source precedence, the brand PDF (`Alshorouk_Brand_Guidelines.pdf`), the user-provided approximate metrics and the no-fabrication policy.

## Source precedence (resolve every conflict in this order)
1. User's latest explicit instructions (poultry-only; the livestock imagery in the PDF is outdated).
2. Official logo artwork and palette from the PDF — never altered.
3. PDF brand strategy, where consistent with poultry-only positioning.
4. Verified business data supplied later / approved CMS data.
5. The master spec's proposed UX, copy, architecture and motion.
6. Reference sites (byteforceinc.com, bsystemseg.com, mindooco.com/en, imtyaze.com) — craft inspiration only, never copied.

## Project invariants
- No cows, sheep, goats, horses, dairy, generic livestock, pets — in copy, imagery, alt text, icons, SEO, CMS seed data or decoration. Chicken/poultry only. (The PDF's "Livestock" icon, "herds" wording and cow/goat storefront are banned.)
- Respect the original logo and tokens: `#FE3300` vermilion, `#FEB821` amber, `#000000` black, `#FFFFFF` white.
- Never invent phone, WhatsApp, email, address, map pins, founding year, farm/partner logos, testimonials, certifications (ISO/GMP/GSP…), cold-chain/fleet/warehouse claims, delivery times, staff counts, manufacturer status, product names/SKUs/prices/stock, or medical/dosage information.
- Alshorouk is a **supplier/distributor**, not a manufacturer. Use نوفر / نوزع / نعمل على إتاحة — never نصنع / ننتج.
- Product data and company claims are publishable only when `approvalStatus = approved`. No fake product cards to fill a layout.
- RTL Arabic works completely; English locale (`/en`) must not break and stays `noindex` until its copy is approved.
- Build fully functioning routes, forms, CMS, tests, responsive layouts and purposeful animations. No "coming soon" stubs presented as done.
- No unverified "done" claims. Browser-test changes at desktop, tablet and mobile.
- Honor `prefers-reduced-motion` and the WCAG 2.2 AA objective.
- Keep PII and keys safe; never deploy, publish, push or purchase resources without explicit user permission.

## Approved business statements (use EXACTLY; qualifiers always visible)
| Metric | Arabic (display) | Arabic label | English |
|---|---|---|---|
| Farms | حوالي 300 | مزرعة دواجن نتعامل معها بشكل مستمر | ~300 poultry farms we serve on an ongoing basis |
| Birds | حوالي 15 مليون | طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها | ~15 million birds within the production capacity of the farms we serve |
| Products | حوالي 150 | منتجًا نوزعه من الأدوية واللقاحات البيطرية | ~150 veterinary medicine and vaccine products we distribute |

- Segments: التسمين (Broilers) · البياض (Layers) · الأمهات (Breeders). No other subsectors.
- Business lines: أعلاف الدواجن (poultry feed) · مكملات الأعلاف (feed supplements) · الأدوية البيطرية (veterinary medicines) · اللقاحات البيطرية (veterinary vaccines).
- The 150 figure covers medicines + vaccines ONLY — never "150 feeds/supplements". Never "15 million birds vaccinated/sold/owned".
- Values (from PDF): الأمانة Integrity · الدقة Precision · الالتزام Reliability · الخبرة Expertise — no unverified SLAs behind them.
- Veterinary safety line where relevant: `تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.`
- Proposed taglines (website copy only, never inside the logo, approval pending): `شريكك في منظومة إنتاج الدواجن`, `حلول إمداد متخصصة لمزارع الدواجن`.

## Brand system (see docs/brand-audit.md and docs/art-direction.md)
- Logo files (extracted as true vectors from the PDF — do not edit, trace, recolor or re-space):
  - `public/brand/alshorouk-logo-full-color.svg` — white/light grounds only.
  - `public/brand/alshorouk-logo-white.svg` — black/dark/vermilion grounds.
  - `public/brand/alshorouk-logo-black.svg` — one-colour use.
  Use them only through the `<Logo>` component. Clear space = 15% of logo width on all sides. Minimum width 110px. No full-colour logo on vermilion/amber. No shadows, rotation, transparency, gradient, stretching.
- Colour ratio guideline: white ~55%, black ~25%, vermilion ~15%, amber ≤5%. Amber is never a text-block background.
- Contrast: black on vermilion 5.7:1 (OK for body). White on vermilion ≈3.7:1 → large headings (≥24px bold / ≥32px regular) ONLY. Black on amber OK at all sizes.
- Gradient vermilion→amber only on large abstract sunrise shapes/curves — never on text or the logo.
- Typography: Arabic brand face is **Thmanyah** (licensed; NOT in repo — do not download it). Staging fallback is set in `src/styles/fonts.ts`. Latin text **and all figures** use **Montserrat**. Western digits 0–9. Never justify short lines; no kashida stretching. English at ~90% of Arabic size in mixed lines. No third typeface.
- Sunrise System motifs — ONE prominent motif per major section, never all four together, never over the logo:
  Signature Curve (1–3 parallel arcs cropped off an edge) · Distribution Flow (straight lines, 45° turns, round nodes, ONE amber destination node) · Crest Pattern (three overlapping circles, 10–20% tone, never behind text) · Veterinary Grid (4×4, one vermilion, one black, ≤1 amber cell).
- Icons: 24-unit grid, 2-unit stroke, round caps/joins, no fills; black on light, white on dark, vermilion for one active state.
- Photography: documentary, natural warm light, honest framing, licensed only (see `docs/image-provenance.md`). Black 40–60% overlay under white text. No cartoon/composited/AI-fantasy chickens.

## Tech stack (pinned — do not upgrade casually)
Next.js 16 App Router · React 19 · TypeScript 5.9 strict · Payload CMS 3.90 (admin at `/admin`) · SQLite locally (`@payloadcms/db-sqlite`), PostgreSQL in production (`@payloadcms/db-postgres`, chosen by `DATABASE_URL` scheme) · Tailwind CSS 4 + CSS variables · GSAP 3 + ScrollTrigger (+ `@gsap/react` `useGSAP`) · Zod · Vitest · Playwright. Package manager: **pnpm**.

Commands: `pnpm dev` (http://localhost:3100) · `pnpm build` · `pnpm typecheck` · `pnpm lint` · `pnpm test:unit` · `pnpm test:e2e` (after `pnpm seed:e2e` + `pnpm build:e2e`) · `pnpm test:e2e:engines` · `pnpm seed` · `pnpm screenshots`.

## Code conventions
- Server Components by default; `'use client'` only for real interaction/animation. Never import GSAP in a server component.
- Routes live in `src/app/(frontend)/[locale]/…`; Payload lives in `src/app/(payload)/…` (generated files there must not be hand-edited).
- 404s are decided in `src/proxy.ts` before rendering (a `notFound()` thrown during render is only client-rendered in Next 16). A new public page must be added to `routes` in `src/i18n/routing.ts` (or as a slug rule in `src/lib/route-table.ts`), or the proxy serves it as a 404; `tests/unit/route-table.test.ts` fails when a page file is missing from the table.
- i18n: typed dictionaries in `src/i18n/dictionaries/{ar,en}/*.ts`; EN files are typed against the AR shape. Pass strings from server to client components as props. Build links with the helpers in `src/i18n/routing.ts`.
- RTL-safe styling: use logical utilities (`ms-/me-/ps-/pe-/start-/end-/text-start`) — never physical `left/right/ml/mr/pl/pr` unless the element is intentionally direction-locked (e.g. a numeral). Mirror directional icons/arrows with `rtl:-scale-x-100`.
- Bidi: wrap Latin/numeric runs inside Arabic text in `<bdi>` or `dir="ltr"` spans where order matters (phone numbers, SKUs, mixed units).
- Colours, spacing, type scale, radii and motion durations come from tokens (`src/styles/globals.css` `@theme`). No ad-hoc hex values in components.
- Images: `next/image` with explicit sizes; registry in `src/content/photos.ts`; alt text bilingual and poultry-specific.
- Motion: compositor-friendly properties only (transform, opacity, clip-path). Content must be visible without JS (reveal states are applied only under `html.js`), under `prefers-reduced-motion`, and if GSAP fails. Use `useGSAP` with scope + automatic revert; kill ScrollTriggers on unmount. No scroll hijacking, no permanent pulsing, no perpetual rAF loops. Never split Arabic text into characters (lines/words only).
- Accessibility: one `h1` per page, visible focus rings, 44px touch targets, labelled form controls, `aria-live` only for status messages, keyboard-operable menus/dialogs/accordions with focus trap + restore.
- Forms: Zod schema shared client/server; server is authoritative; honeypot + rate limit + idempotency key; success only after the record is persisted.
- Security: never log PII; never commit `.env`; validate/sanitize all query params and CMS rich text.

## Parallel-agent rules
- Only edit the files your task assigns to you. Shared foundations (`src/styles/*`, `src/components/{ui,layout,brand,motion}/*`, `src/i18n/{config,routing}.ts`, `src/payload/**`, `payload.config.ts`, `next.config.ts`, `package.json`) are owned by the orchestrator — report needed changes instead of editing them, unless your task explicitly grants ownership.
- Do not run `pnpm install`, `pnpm build`, `next dev` or git commands unless your task says so. A shared dev server normally runs on http://localhost:3100 — use it for screenshots.
- Never delete or overwrite files you did not create in this task.
- Report each deliverable as `implemented`, `verified`, `blocked` or `needs_review`, with evidence (file paths, command output, screenshot paths). Never self-approve unsupported facts.

## Project skills (`.agents/skills/<name>/SKILL.md`)
Read the relevant skill before working in its area: `brand-extraction`, `reference-research`, `poultry-content-integrity`, `arabic-rtl-design`, `visual-art-direction`, `motion-storyboarding`, `gsap-implementation`, `nextjs-architecture`, `cms-and-product-catalog`, `lead-form-engineering`, `seo-accessibility`, `browser-visual-qa`, `security-performance-release`.

## Work loop
1. Read the full master specification and brand PDF before major changes.
2. Inspect the repo and the actually available tools/skills.
3. Keep `docs/task-board.md` and `docs/open-items.md` current; surface only essential blockers.
4. Implement one cohesive vertical slice at a time, with tests.
5. Capture browser evidence (`screenshots/`), fix issues, document truthfully.
6. On completion, report the route matrix, tests, preview, deployment blockers and approvals.

## Source control
The orchestrator makes local checkpoint commits only. Subagents never commit, push, rebase or reset. Nothing is pushed or deployed without explicit user permission.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
