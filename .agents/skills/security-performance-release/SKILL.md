---
name: alshorouk-security-performance-release
description: Harden, measure and hand over the Alshorouk app — secrets and dependency checks, Payload and HTTP header hardening, upload and PII safeguards, Core Web Vitals and bundle measurements on a production build, environment and deployment documentation, and an honest release matrix that separates a working local build from a real deployment — use before Gates 6 and 8, before any deployment request, and whenever performance or security is questioned.
---

# Skill: Alshorouk Security, Performance & Release

Role owner: Performance / DevOps & Release Engineer (spec §13.12). Done when a real production build is healthy, measurements are documented, secrets are absent and every deployment requirement is explicit. Nothing is deployed, pushed or purchased without the user's explicit permission.

## Activation
- Gate 6 (security/perf review), Gate 8 (release handoff), any deployment or credential discussion.
- Changes to env handling, headers, auth, uploads, dependencies, images, fonts or motion weight.
- A performance regression, a suspicious dependency advisory, or a request to "go live".

## Inputs
- `src/payload.config.ts`: adapter by `DATABASE_URL` scheme (SQLite `file:./data/alshorouk.db` / PostgreSQL with `push: false`, migrations `src/migrations/postgres`), `PAYLOAD_SECRET` required in production (dev fallback secret must never reach production), `csrf`/`cors` = `NEXT_PUBLIC_SITE_URL`, GraphQL disabled, uploads ≤ 10 MB, S3 storage when `S3_BUCKET` is set, SMTP when `SMTP_HOST` is set, admin `noindex`, telemetry off.
- `users` auth: 5 failed logins → 15-minute lock, 8 h token, `SameSite=Lax`, `secure` cookies in production; the **first account created becomes admin**.
- `media`: jpeg/png/webp/avif/pdf only (no SVG uploads), `restricted` flag, `license` (`unknown` = never publish).
- Next 16 bundled docs: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md` (nonces force dynamic rendering; "without nonces"; experimental SRI) and `…/package-bundling.md` (`next experimental-analyze`).
- Spec §9.1, §12.3, §16.4, §18, §21; open items for credentials, hosting and domain.

## Procedure
1. **Secrets.** `.env` and `.env.*` are git-ignored (except `.env.example`); verify nothing secret is tracked (orchestrator runs the git check — subagents do not run git). Scan the tree:
   ```bash
   rg -n --hidden -g '!node_modules' -g '!.next' -g '!pnpm-lock.yaml' -g '!.env' -g '!.env.local' \
     -e '(PAYLOAD_SECRET|SMTP_PASS|S3_SECRET_ACCESS_KEY|S3_ACCESS_KEY_ID)\s*[=:]\s*["'\'']?[A-Za-z0-9/+_-]{12,}' \
     -e 'AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|postgres(ql)?://[^:\s/]+:[^@\s]+@' .
   ```
   Every variable in use is documented in `.env.example` with purpose, example format (never a real value) and whether it is required in production: `DATABASE_URL`, `PAYLOAD_SECRET` (≥ 32 random bytes), `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_ENV` (`production` only on the approved live host — it gates indexing), `S3_BUCKET`/`S3_REGION`/`S3_ENDPOINT`/`S3_ACCESS_KEY_ID`/`S3_SECRET_ACCESS_KEY`, `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM_ADDRESS`/`SMTP_FROM_NAME`, `INQUIRY_NOTIFY_EMAIL`, `NEXT_PUBLIC_ANALYTICS_PROVIDER`; `SEED_FIXTURES` and `DEMO_FIXTURES` documented as **never set in staging/production**.
2. **Application security review** (record findings in `docs/security-review.md`):
   - Forms: server-validated, size-bounded, honeypot, per-IP rate limit, idempotency, generic error bodies (lead-form-engineering skill).
   - CMS: RBAC enforced server-side; anonymous REST cannot read drafts, inquiries, users or staff fields, cannot create inquiries; approval guard tested (cms-and-product-catalog skill).
   - Admin: first-user onboarding is a takeover risk on an empty production DB — the owner creates the admin account immediately after the first deploy, before the URL is shared or indexed; no development accounts or default passwords in production; consider MFA/SSO when the host supports it.
   - Uploads: allowed types/size enforced server-side; test a renamed executable and an oversize file; PDFs downloadable only when approved and not restricted.
   - Output: CMS rich text rendered through the Lexical renderer (no `dangerouslySetInnerHTML` of raw HTML); JSON-LD escaped; redirects only to internal paths.
   - Logs and analytics: no PII (names, phones, e-mails, messages, IPs). Inquiry retention policy is an open item until legal decides.
3. **HTTP headers** (`next.config.ts` `headers()` — orchestrator-owned; review and propose diffs). Current baseline applied to every path: CSP without nonces (`script-src 'self' 'unsafe-inline'`, plus `'unsafe-eval'` in dev only; `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy: same-origin`, HSTS in production only.
   - Verify with a production build: headers present on `/ar`, `/en`, `/admin`, `/api/*`; zero CSP violations in the console on public pages **and** the admin.
   - Decide and document the CSP trade-off from the bundled Next 16 guide: keep "without nonces" (static pages, weaker `script-src`), move to nonces via `src/proxy.ts` (forces dynamic rendering), or experimental SRI. Any change must still allow the inline `html.js` bootstrap.
   - Propose `X-Robots-Tag: noindex` for `/admin` and `/api` (the admin already sends `noindex` meta).
4. **Dependencies.** `pnpm audit --prod` (needs network) → triage each advisory (reachable? fixed version compatible with the pinned stack?); document mitigations; no casual major upgrades (AGENTS.md pins). Licence check for fonts and images: only OFL/licensed assets in the repo; Thmanyah absent until licensed.
5. **Performance measurement — production build only** (never `next dev`). When authorised: `pnpm build`, then `pnpm exec next start --port 3100` (the dev server keeps :3000). Measure home, `/ar/products`, one product detail (or its empty/404 state), `/ar/contact`, `/ar/solutions/broilers`:
   - Lighthouse mobile (default throttling) and desktop — DevTools Lighthouse panel or `pnpm dlx lighthouse@<pinned version>` run from a scratch folder; record exact values, date, environment ("local production build, not a deployed host").
   - Playwright lab metrics: LCP and CLS via `PerformanceObserver`; interaction latency via Event Timing on menu open, filter change and form submit; per-route JS transfer by summing `script` responses.
   - Bundle composition: `pnpm next experimental-analyze --output` (Next 16 no longer prints First Load JS). Set budgets after the first baseline (spec §12.3) and treat > 10% growth as a regression.
   - Targets (not guarantees): LCP < 2.5 s, CLS < 0.1, INP < 200 ms on mid-range mobile.
6. **Performance hygiene.** Hero image ≈ 250–400 KB at its largest served width (AVIF/WebP via `next/image`, correct `sizes`, one `preload`ed LCP image); `quality` props must be one of the configured `images.qualities` (`60, 72, 80, 90` in `next.config.ts`; anything else is coerced); local sources must match `images.localPatterns` (`/api/media/file/**`, `/brand/**`, `/_next/static/media/**` — statically imported photos land in the last); no hot-linking; `next/font` self-hosted with `display: swap`, no render-blocking font; GSAP only in client chunks of pages that animate, heavy below-the-fold scenes lazy-loaded; no WebGL; no third-party scripts until analytics is approved.
7. **Release documentation.** `README.md` (exact install/dev/build/test/seed commands, architecture overview), `.env.example`, `docs/deployment.md` (provider-agnostic: Node 22 runtime, PostgreSQL provisioning, `pnpm payload migrate` before start, S3-compatible storage, SMTP, env matrix, build/start, health checks, first-admin step, backups and restore, rollback), `docs/cms-editor-guide.md`, `docs/test-report.md`, `docs/performance-report.md`, `docs/security-review.md`, current `docs/open-items.md`, screenshots.
8. **PostgreSQL readiness.** Production migrations must be generated and applied with the Postgres adapter. There is no PostgreSQL server in this environment, so `migrate:create`/`migrate` against Postgres is **unverified** until an approved staging database (or an explicitly approved local install) exists — keep it as a release blocker, never as a pass.
9. **Deployment gate.** Deploy only to a destination the user explicitly approved, with credentials the user supplied, after explicit permission. After deploying, verify the public URL: pages, `/admin` login, a real test inquiry persisted and visible to sales (then deleted per policy), `robots`/noindex state, HTTPS headers. Without that, label the result **READY — not deployed** or **BLOCKED** with the exact missing inputs.
10. **Final delivery matrix** (spec §18): Brand & typography · All pages · Motion scenes · CMS & products · Forms/lead storage · Arabic & English · Accessibility · Performance · Deployment — each with PASS/FAIL (or DEPLOYED/READY/BLOCKED), verified-by, evidence path, remaining gap. Answer the spec §21 self-audit with evidence links.

## Checklists
- [ ] Secret scan clean; `.env.example` complete; fixtures flags absent from production config.
- [ ] Security review written with findings, fixes and accepted risks.
- [ ] Headers/CSP verified on public pages and `/admin` with zero violations.
- [ ] `pnpm audit --prod` triaged (or recorded as not run, with reason).
- [ ] Lighthouse + Playwright metrics recorded from a production build with date and environment.
- [ ] README, deployment, editor, test, performance and security docs present and consistent.
- [ ] Deployment status stated truthfully; open items list every missing credential/approval.

## Deliverables
- `docs/security-review.md`, `docs/performance-report.md`, `docs/deployment.md`, `README.md`, `.env.example` (or diff proposals when orchestrator-owned).
- Command logs under `docs/evidence/gate-6/` and `docs/evidence/gate-8/`; Lighthouse reports (HTML/JSON) referenced by path.
- The final delivery matrix and §21 answers for the orchestrator's report.

## Acceptance criteria
- Production build healthy; measurements documented from real runs; no secrets in the tree; deployment requirements explicit (spec §13.12 done condition, Gates 6 and 8).
- No unauthorised deployment, push or purchase; a local preview is never described as "live".
- Every FAIL/BLOCKED item maps to an open item with owner and next step.

## Failure recovery & escalation
- **Secret found in the tree:** stop, tell the orchestrator immediately (rotation is the user's decision); never paste the value into reports.
- **Advisory without a compatible fix:** document reachability and mitigation; escalate if a public surface is exposed.
- **Budget missed:** fix the biggest contributor first (hero image, font, motion chunk), re-measure, record before/after.
- **Missing credentials, domain or hosting decision:** produce the READY package and the precise request list; do not create accounts or resources.
- **CSP breaks `/admin` or Next scripts:** keep report-only, document violations and the chosen remedy; never ship a policy that was not browser-tested.

## Spec references
§0.2, §9.1 (deployment, permissions), §10.2 (MFA, no dev admin publicly deployed), §11.4, §12.3, §12.4, §13.12, §15 Phase 6 and Phase 8, §16.4, §16.5, §18, §19 item 7, §21 Q10–Q12.
