# Security review — 2026-10-11

Scope: spec §11.4 (spam & privacy) and §16.4 (security checks), run against the **production build** on
`http://localhost:3200` (`.next-e2e`, isolated fixture DB `data/e2e.db`, `DEMO_FIXTURES=true`), plus a code review of
`src/lib/inquiries/*`, `src/payload/access.ts`, `src/payload/collections/*`, `src/payload/hooks/*`, `next.config.ts`,
`src/proxy.ts`, `src/i18n/routing.ts` and `src/lib/seo.ts`. No app code was changed. Every record the tests created was
deleted afterwards: the probe script's 19 inquiries and its throwaway editor, plus each spec run's `SECTEST-…`
inquiries and throwaway lockout user. A post-run check found 0 `SECTEST` inquiries and only the 4 original users. The one fixture field that was
touched (`internalNotes` on `fixture-feed-alpha`) was restored to its previous value, and the restore was verified.

**Verdict:** The perimeter is sound. Leads, staff data and drafts are closed to anonymous REST. CSRF and origin checks
work, and inquiry input is stored as inert text. Open issues:

- one control can be bypassed (**SEC-01**: the inquiry rate limit trusts client-supplied IP headers);
- two workflow gaps (**SEC-02**: the inquiry audit trail can be rewritten; **SEC-03**: editors without approval rights can
  change approved, live records);
- framework dependencies that need a patch release (**SEC-05**);
- some minor hardening items.

## Evidence files

| File | What it shows |
|---|---|
| `tests/e2e/security.spec.ts` | Repeatable Playwright suite (14 tests): headers, CORS, GraphQL, anonymous REST, staff-only fields, server-action abuse, XSS, lockout. |
| `docs/evidence/security/playwright-security-navigation.log` | Run of `security.spec.ts` + `navigation.spec.ts` (desktop + mobile) against :3200. **86 passed, 2 skipped** (the 2 skips are desktop-only navigation tests on mobile, skipped by design). |
| `docs/evidence/security/headers.txt` | Raw response headers for HTML, API, admin, robots and a static chunk; foreign-Origin CORS probe; admin robots meta. |
| `docs/evidence/security/probes.jsonl` | Exploratory probes: rate-limit behaviour, Origin handling, size limits, role matrix, audit-trail overwrite, non-approver editor, password-reset and lockout responses, clean-up. |
| `docs/evidence/security/api-access-anonymous.json` | Anonymous field-permission snapshot from `/api/access` (SEC-04). |
| `docs/evidence/security/pnpm-audit-prod.txt` · `pnpm-audit-all.txt` | `pnpm audit --prod` / `pnpm audit` summaries (advisory, version, fix version, path). |

How to re-run: `E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test tests/e2e/security.spec.ts --project=desktop`.

## Findings

| ID | Sev | Area | Finding |
|---|---|---|---|
| SEC-01 | **P1** | Inquiry spam control | The rate limit is keyed on client-supplied headers and can be bypassed |
| SEC-03 | **P1** | CMS approval workflow | An editor without `canApprove` can edit approved, published records (and toggle `isPublished`) without re-approval |
| SEC-05 | **P1** | Dependencies | `next@16.3.5` has critical/high/moderate advisories, some reachable (self-hosted ISR, image optimizer); `sharp@0.35.4` high |
| SEC-02 | P2 | Lead audit trail | Sales or admin can overwrite an inquiry's `statusHistory` through REST |
| SEC-04 | P2 | Data exposure | The public REST API returns unverified `manufacturer`, unapproved `labelPdf` and unverified article `author`, which the site itself hides |
| SEC-06 | P3 | CSP | `script-src 'unsafe-inline'` with no nonce or hash, so the CSP gives no XSS defence in depth |
| SEC-07 | P3 | Staff login | Lockout reveals whether an account exists and lets anyone lock a known staff e-mail for 15 min; no per-IP login throttle |
| SEC-08 | P3 | Inquiry UX/security | A rate-limit slot is spent before validation, so 5 invalid no-JS submissions lock out a real visitor for 10 min |
| SEC-09 | P3 | Media | Media with `license = unknown` is publicly readable unless it is also marked `restricted` |
| SEC-10 | P3 | Headers (perf) | `Critical-CH: Sec-CH-Prefers-Color-Scheme` (added by `withPayload`) is sent on every public response |

### SEC-01 · P1 · The inquiry rate limit can be bypassed by rotating a request header
- **Where:** `src/lib/inquiries/rate-limit.ts:100-108` (`clientIpFrom`) and `src/lib/inquiries/action.ts:63-64`. It affects the
  server action behind every inquiry form (contact, partner, segment, product and catalogue forms).
- **Evidence:** `probes.jsonl`:
  - `ratelimit_same_key`: the limiter itself works. With a fixed key, the 6th request is refused (`ok×5, rateLimited`).
  - `ratelimit_rotating_cf_connecting_ip`: 6 of 6 accepted.
  - `ratelimit_rotating_x_forwarded_for`: 6 of 6 accepted.
- **Cause:** With `INQUIRY_IP_HEADER` unset, the key is the first of `cf-connecting-ip`, `x-real-ip` and
  `x-forwarded-for` that the request carries. `next start` keeps a client-sent `X-Forwarded-For` (it only fills the
  header when it is missing). `cf-connecting-ip` is checked first, so even behind Vercel, nginx or another proxy that
  rewrites `X-Forwarded-For`, a client can choose its own bucket unless Cloudflare is really in front.
- **Impact:**
  - Any script can flood `inquiries` with unlimited leads. The honeypot only stops naive bots, and the action id is
    public.
  - This fills the sales queue and grows the database. The privacy policy's "protecting our forms against spam and
    repeated submissions" is only partly true.
- **Suggested fix:**
  - Trust exactly one header, chosen per deployment. Make `INQUIRY_IP_HEADER` required when
    `NODE_ENV=production`, and log a warning or fail closed if it is unset.
  - Read `X-Forwarded-For` from the right-hand end (the hop your own proxy appends), not the first entry.
  - Accept `cf-connecting-ip` only when it is configured.
  - Optionally add a global (not per-IP) ceiling, such as N leads per minute across all clients, and Turnstile if
    abuse appears.
  - After the fix, `security.spec.ts` will use the localhost bucket for its one stored submission (noted in the file
    header).

### SEC-03 · P1 · Approval gate covers only the *transition* to `approved`
- **Where:** `src/payload/hooks/approval-guard.ts:10-27` and `src/payload/fields.ts:31-39` (`isPublished` update access
  `isAdminOrEditorField`). It applies to products, articles and FAQs.
- **Evidence:** `probes.jsonl`. A throwaway editor with `canApprove=false` was created, then deleted:
  - `non_approver_approves_draft`: refused, 403 (correct).
  - `non_approver_edits_approved_published_record`: 200, and the record stayed `approved` and published.
  - The test changed a staff-only field so nothing public moved. The hook does not tell fields apart, so the same
    applies to `description`, `warnings`, `nameAr` or the SEO fields.
- **Impact:** Unapproved wording (claims, label text) can go live on an approved product or article without anyone
  with approval rights seeing it. That conflicts with "publishable only when `approvalStatus = approved`". The same
  editor can also publish or unpublish approved records.
- **Suggested fix:** When `originalDoc.approvalStatus === 'approved'` and `!canApproveContent(req)`, do one of the
  following:
  - (a) reject changes to public fields with a 403;
  - (b) set `approvalStatus = 'review_required'` and `isPublished = false` automatically;
  - (c) enable Payload drafts (`versions.drafts`) so non-approvers only ever save drafts.

  Also allow changes to `isPublished` only when `canApproveContent(req)`.

### SEC-05 · P1 · Vulnerable dependencies (pnpm audit, 2026-10-11)
- `--prod`: 1 critical, 7 high, 13 moderate, 6 low. Full: 2 critical, 7 high, 15 moderate, 6 low. Details are in
  `docs/evidence/security/pnpm-audit-*.txt`.
- Reachability (checked against the code):

  | Package | Advisory | Reachable here? |
  |---|---|---|
  | `next@16.3.5` | GHSA-vcvr-r3jv-pc5j, **critical** RCE in `next/og` `ImageResponse` | **No**: there is no `next/og` or `ImageResponse` import and no `opengraph-image` route. OG images are static PNGs. Patched ≥16.3.6. |
  | `next@16.3.5` | GHSA-cjq9-62q9-8jv4, high SSRF in Image Optimization | **Possibly**: `/_next/image` is enabled. There are only `localPatterns` and no `remotePatterns`, which reduces exposure. Patched ≥16.3.8. |
  | `next@16.3.5` | GHSA-4jqv-mc3x-m676, GHSA-mcj8-r9mp-w47p, moderate SSG/ISR cache poisoning in self-hosted apps | **Yes**: self-hosted with `revalidate = 3600` on home, about, poultry-solutions, segments and how-we-work. Patched ≥16.3.8. |
  | `next@16.3.5` | GHSA-3w37 (`use cache` + draft mode), GHSA-f87g (metadata image routes), GHSA-39w2 (dev MCP endpoint) | No: those features are not used, or the issue is dev only. |
  | `sharp@0.35.4` (direct dependency) | GHSA-wq5f-xc86-pv6w, high, librsvg | Low: only staff upload images, SVG is not an allowed upload type, and `next/image` does not rasterise SVG. Patched ≥0.35.5. |
  | `undici@7.29.0` (via `payload`) | 9 advisories, mostly WebSocket and interceptors | Low: no WebSocket client is used. Comes with a Payload patch. |
  | `nodemailer@9.1.1` (via `@payloadcms/email-nodemailer`) | DoS and parser advisories | Only when SMTP is configured, and recipients are never visitor-controlled. Upgrade with Payload. |
  | `dompurify@3.4.15` (admin Monaco editor) | low | Staff-only admin. |
  | `braces` (sass/chokidar), `esbuild@0.18` (drizzle-kit), `vitest@4.0.18` (dev) | various | Build and dev tooling only. Upgrade vitest to ≥4.1.11 anyway; there is no `--ui` server in use. |

- **Suggested fix:**
  - Bump `next` (and `eslint-config-next`) to ≥16.3.8 within the range `@payloadcms/next@3.90.x` supports, and `sharp`
    to ≥0.35.5.
  - Move to the latest Payload 3.x patch that pulls `undici` ≥7.29.1.
  - Re-run `pnpm audit --prod`, the build and the e2e suite.
  - This needs an install and a build, which only the orchestrator may do.

### SEC-02 · P2 · The inquiry status history can be rewritten
- **Where:** `src/payload/collections/Inquiries.ts:22-41` (`enforceLifecycle`) and the field at `:215-225`.
- **Evidence:** `probes.jsonl` → `sales_patch_immutable_and_history`.
  - The sales user PATCHed `{ name, requestDetails, statusHistory: [...] }`.
  - `name` and `requestDetails` were correctly ignored (they are immutable).
  - `statusHistory` was replaced by a single forged entry, `["closed","2020-01-01T00:00:00.000Z","forged-by-sales"]`.
    The record's status stayed `new` and the original `system` entry was lost.
- **Suggested fix:** On `update`, always rebuild the history from `originalDoc.statusHistory`: append one entry when the
  status changes, and copy it unchanged otherwise. Never accept a client value.

### SEC-04 · P2 · The REST API exposes data that the site deliberately hides
- **Where:**
  - `src/payload/collections/Products.ts:118-127` (`manufacturer`), `:154-167` (`labelPdf`) and `:210-214`
    (`searchText` includes the manufacturer).
  - `src/payload/collections/Articles.ts:57-64` (`author`).
- **Evidence:**
  - Anonymous `GET /api/access` reports `read: true` for `manufacturer`, `labelPdf`, `searchText` and article `author`.
    Staff-only fields (`sourceEvidence`, `internalNotes`, `approvalEvidence`, `reviewer`) are omitted. Snapshot:
    `docs/evidence/security/api-access-anonymous.json`.
  - The site gates these fields in `src/lib/catalog.ts:76,201` and `src/lib/content.ts:197`. The REST API does not.
- **Impact:** None today: the fixtures carry no manufacturer, label or author. Once real data is entered, an
  unverified manufacturer name or an unapproved label PDF becomes readable at `/api/products?depth=1` (and the PDF file
  URL with it).
- **Suggested fix:**
  - Use field-level `read` access, for example `({ req, siblingData }) => Boolean(getUser(req)) || siblingData?.manufacturerVerified === true`.
    Apply the same to `labelPdf` with `labelPdfApproved`, and to `author` with `authorVerified`.
  - Leave `manufacturer` out of `searchText` unless it is verified.
- **Related:** the `metrics` global returns its internal editor field `accuracyNote` to anonymous
  `GET /api/globals/metrics`. The wording is harmless, but if it is meant to stay internal, make it staff-read only.

### SEC-06 · P3 · CSP permits inline script
- `next.config.ts:14-27`: `script-src 'self' 'unsafe-inline'`. Everything else is tight: `default-src 'self'`,
  `object-src 'none'`, `base-uri`, `form-action`, `frame-ancestors 'self'`, and no third-party origins.
- This is acceptable while pages are static or ISR, but an injected inline script would run.
- **Option:** a nonce-based CSP issued from `src/proxy.ts` for dynamic routes, or hashes. The cost is that a nonce makes
  the affected routes dynamic. Record the trade-off in `docs/deployment.md`.

### SEC-07 · P3 · Staff-login lockout reveals accounts and can be used to lock staff out
- **Evidence:** `probes.jsonl` → `login_error_locked_vs_unknown`. A locked account returns «تمّ قفل هذا المستخدم…», while an
  unknown e-mail returns «البريد الإلكتروني أو كلمة المرور المقدمة غير صحيحة.».
- Anyone who knows a staff e-mail can lock it for 15 min with 5 requests, and repeat. Payload 3.90 behaves this way by
  default.
- Password reset is **not** an enumeration oracle: known and unknown e-mails get the same `200 {"message":"النجاح"}`.
- **Fix:** throttle `/api/users/login` per IP at the edge or in the proxy, alert on lockouts, and consider a generic
  error message.

### SEC-08 · P3 · Rate-limit budget is spent before validation
- `action.ts:63-77`: the limiter records a hit before `inquirySchema.safeParse`. The JS path validates on the client, but
  a no-JS visitor who makes 5 mistakes in 10 minutes is told «أُرسلت عدة طلبات…».
- **Fix:** count a hit only after validation passes, or give invalid attempts their own larger budget.

### SEC-09 · P3 · Unlicensed media is readable by the public
- `src/payload/collections/Media.ts:13-16`: anonymous read is `{ restricted: { not_equals: true } }`.
  `license = 'unknown'` ("do not publish") is still served by `/api/media` and `/api/media/file/*`.
- The library is empty today (0 media docs).
- **Fix:** anonymous read `{ and: [{ restricted: { not_equals: true } }, { license: { not_equals: 'unknown' } }] }`.

### SEC-10 · P3 · Colour-scheme client hints on every public response (performance note)
- `withPayload` adds `Accept-CH`, `Vary` and `Critical-CH: Sec-CH-Prefers-Color-Scheme` to `/:path*` (see
  `headers.txt`).
- `Critical-CH` makes Chromium retry the first navigation to include the hint, and `Vary` on static assets splits
  caches. The public site does not use the hint.
- **Fix:** scope these headers to `/admin` (filter them out of the `withPayload` header list for other paths).
  Hand this to the performance owner.

## Checks that passed (with evidence)

| Check | Result | Evidence |
|---|---|---|
| Security headers on HTML, API, admin, robots and a static chunk | CSP, HSTS (`max-age=63072000; includeSubDomains`), `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `COOP: same-origin`; no `X-Powered-By` | `headers.txt`; `security.spec.ts` › response headers |
| CORS | No `Access-Control-Allow-Origin` returned to `Origin: https://evil.example` | `headers.txt`; spec |
| `/admin` not indexed | `<meta name="robots" content="noindex, nofollow">`; staging `robots.txt` is `Disallow: /`; production rules disallow `/admin` and `/api` (`src/app/robots.ts`) | spec; `headers.txt` |
| GraphQL disabled | `GET`/`POST /api/graphql` and `/api/graphql-playground` all return **404** | spec |
| Anonymous REST | `inquiries`, `users`, `content-approvals` and all `*/versions` return **403**; `users/me` returns `user:null` | spec; `probes.jsonl` |
| Unapproved products | `where[approvalStatus][equals]=review_required`, `[not_equals]=approved`, `isPublished=false`, the draft slug, `draft=true` and an `or` query all return `totalDocs 0`; the draft by id returns 404/403 | spec |
| Staff-only fields | `sourceEvidence`, `internalNotes`, `approvalEvidence` absent from `/api/products?depth=2`; filtering or sorting on them returns **400** ("cannot be queried"), so they cannot be used as an oracle | spec |
| Unverified contact channels | `/api/globals/site-settings` omits `value` for every unverified channel | spec |
| Role matrix | Editors cannot read inquiries (403); sales cannot read the approval register (403); non-admins see only their own user (`totalDocs 1`); only admins create users; `first-register` is closed | `probes.jsonl`; spec |
| Inquiry lifecycle | `new → qualified` returns 400 "Invalid status change"; submitted fields are immutable for sales | `probes.jsonl` |
| Server action: honeypot | Recoverable «تعذّر إرسال طلبك…» error; nothing stored | spec |
| Server action: foreign `Origin` | Next rejects it: HTTP 500, digest `E80` ("Invalid Server Actions request"); UI shows «لم يُرسَل طلبك»; nothing stored. A request with no `Origin` header is allowed by Next by design (non-browser client, which cannot carry a victim's cookies) | spec; `probes.jsonl` |
| Server action: oversized body | 70 KB returns HTTP 500, digest `E394` (body > 64 KB, `serverActions.bodySizeLimit`); 20 KB inside the action's FormData gets the app-level refusal (`spam`). No success shown, nothing stored | spec; `probes.jsonl` |
| Stored XSS | Name `<img onerror=…>` and message `<script>…</script><svg onload=…>` stored verbatim (not stripped, not encoded). The success panel echoes only the reference. Inquiries are never read by public code (only `persist.ts` and the admin dashboard count). The admin edit and list views render them as text: no script ran, no dialog opened | spec › script tags… |
| Login lockout | After 5 wrong passwords the correct password is refused; other staff are unaffected; the throwaway account was deleted | spec › five failed logins…; `probes.jsonl` |
| Draft preview | Editor cookie with `Sec-Fetch-Site: same-origin`: 200, `noindex, nofollow`, `Cache-Control: private, no-store`. Sales or anonymous: 404 | curl, this review |
| Cookie-auth CSRF | Payload ignores the session cookie for `Origin: https://evil.example` or `Sec-Fetch-Site: cross-site` (`users/me` returns null) | curl, this review |
| Session cookie | `HttpOnly`, `Secure`, `SameSite=Lax`, 8 h expiry | curl, this review |
| Open redirect | `//evil.com`, `/\evil.com`, `/ar/..//evil.com` and `/https://evil.com` all stay on the same origin (308 to `/evil.com…`). `switchLocalePath`, `catalogHref`, `href`, `productHref` and `articleHref` only ever build `/${locale}/…` paths. Catalogue params are Zod-bounded; slugs are `^[a-z0-9]+(?:-[a-z0-9]+)*$`; `productId` is digits only; the `sourcePath` regex blocks `//` | curl; code |
| JSON-LD | `jsonLdScript` escapes `<` as `<`, so `</script>` cannot break out. Organization carries only verified facts. `Product` JSON-LD is emitted only for public non-fixture products | `src/lib/seo.ts:106`; `ProductDetailView.tsx:84` |
| Secrets | `.env` is git-ignored; no hard-coded keys in `src`, `scripts` or config; `PAYLOAD_SECRET` is mandatory in production; fixture accounts are only created when `DATABASE_URL` names an e2e/test/fixture database | `src/payload.config.ts:34-37`; `src/scripts/seed.ts:193` |
| Logging | Server-action logs carry the outcome, reference, type and locale only (no PII). Without SMTP, Payload's console adapter logs only To and Subject (no reset token) | `action.ts:38-44`; `node_modules/payload/dist/email/consoleEmailAdapter.js` |

## Not tested
- **Production proxy topology:** there is no CDN or reverse proxy here, so the "right" IP header could not be validated
  (see SEC-01).
- **Postgres-specific behaviour:** everything above ran on SQLite.
- **Uploads:** staff upload validation (MIME sniffing versus extension) was not exercised, because no media upload
  path is open to the public.
- **SMTP notifications:** not configured.

## Addendum — final round (2026-10-11, orchestrator)

### Status of the findings above

| ID | Status | What changed | Verified by |
|---|---|---|---|
| SEC-01 | Fixed | `clientIpFrom` reads only `INQUIRY_IP_HEADER` when set; unset, it uses `x-real-ip`, then the right-most `x-forwarded-for`, never `cf-connecting-ip`. In production with the header unset, a global cap (30 per 10 min, all visitors) applies with one warning. | `tests/unit/inquiries-rate-limit.test.ts`; e2e rate-limit test against a server with `INQUIRY_IP_HEADER=x-real-ip` |
| SEC-02 | Fixed | `enforceLifecycle` rebuilds `statusHistory` from the stored record; request-supplied history is ignored. | `tests/unit/inquiries-lifecycle.test.ts`; REST probe; `cms.spec.ts` |
| SEC-03 | Fixed | Non-approvers get 403 for publishing/approving; any edit they make to approved content demotes it to `review_required` and unpublishes it; duplicates of approved records start as drafts. | `tests/unit/publication-guard.test.ts`; `cms.spec.ts` (plain editor 403) |
| SEC-04 | Fixed | `revealWhen` hides unverified manufacturer, unapproved label PDF and unapproved author from anonymous readers; filters/sorts on them only match verified records; `searchText` excludes unverified manufacturers; metrics `accuracyNote` is staff-only. | REST probes; `security.spec.ts` |
| SEC-05 | Fixed | next 16.3.5 → 16.3.8, sharp 0.35.5, overrides `undici ^7.29.1`, `dompurify ^3.4.16`; dev tooling vitest 4.0.18 → 4.1.11 (fixes the new Vitest advisories, one rated critical). | `pnpm audit` below |
| SEC-06 | Open (P3) | — | Deferred: a nonce CSP forces dynamic rendering of every page; decide with the host/CDN (`docs/open-items.md`). |
| SEC-07 | Open (P3) | — | Deferred: Payload's default lockout; mitigations listed in `docs/open-items.md`. |
| SEC-08 | Fixed | Validation runs before the rate-limit check; honeypot hits spend no slot. | `tests/unit/inquiries-action.test.ts` |
| SEC-09 | Fixed | Public media read requires `restricted != true` and `license != 'unknown'`. | unit-tested; dev media library is empty |
| SEC-10 | Open (P3) | — | Deferred: upstream header from `withPayload`; strip at the proxy/CDN. |

### New code reviewed in this round: server-rendered 404s (CI-03)

`src/proxy.ts` now rewrites unknown paths and missing product/article slugs to a server-rendered 404 page with status 404. For slugs it asks the public REST API whether the slug is visible to anonymous visitors.

- **Found and fixed during this review (would have been P1):** the first version built the lookup URL from `request.nextUrl.origin`, which comes from the client's `Host` header. A forged Host could have made the server send blind GET requests to arbitrary hosts, including internal addresses (SSRF). The origin now comes only from server configuration (`INTERNAL_SITE_ORIGIN`, else `SITE_URL`); with neither set, the lookup is skipped. Regression tests: `tests/unit/proxy.test.ts` ("never takes the lookup origin from the request Host header", "prefers INTERNAL_SITE_ORIGIN and skips the lookup when no origin is configured").
- The slug is validated against `^[a-z0-9]+(?:-[a-z0-9]+)*$` before any request, so no other user input reaches the query.
- The lookup sends no cookies or credentials, so it sees exactly the anonymous view (same read access as the pages).
- Staff sessions (`payload-token`), non-GET requests (server actions) and router prefetches skip the lookup, so previews and form posts behave as before.
- The 404 page is a dynamic route: 404 responses carry `Cache-Control: private, no-cache, no-store`, so a CDN cannot keep serving a 404 for a slug that is published later (checked with curl on the production build).
- The lookup fails open (1.5 s timeout, any error): the page's own `notFound()` still returns 404, rendered in the browser.

### CSP: `upgrade-insecure-requests` now follows the site scheme

The first WebKit run failed on every page: the production CSP always contained `upgrade-insecure-requests`, so on a plain-HTTP origin Safari/WebKit rewrote every asset request to https and loaded no CSS or JS (Chromium exempts localhost, which hid it). The directive is now emitted only when `SITE_URL` is https (`next.config.ts`), so HTTPS production keeps it and an HTTP staging server still works in Safari. HSTS stays on all production builds; browsers ignore it over plain HTTP (RFC 6797 §8.1). Regression test: `security.spec.ts` ("upgrade-insecure-requests only on an https origin").

### Dependency audit after the upgrades (`pnpm audit`, 2026-10-11)

7 advisories remain (0 critical, 3 high, 4 moderate). None is reachable in this deployment:

| Package (installed) | Severity | Path | Reachable? |
|---|---|---|---|
| esbuild 0.18.20 | moderate | `@payloadcms/db-postgres` → `drizzle-kit` → `@esbuild-kit/*` → esbuild | No: the advisory concerns esbuild's dev server; here it is only migration tooling and never serves requests. |
| braces 3.0.3 | high | `next` → `sass` (optional) → `chokidar` → braces | No: build-time file watching; no untrusted input. |
| nodemailer 9.1.1 (5 advisories: 2 high, 3 moderate) | high / moderate | `@payloadcms/email-nodemailer` → nodemailer | No in the current configuration: SMTP is not configured. Once it is, recipients come from configuration (`INQUIRY_NOTIFY_EMAIL`) and the notification contains no visitor input. Upgrade to nodemailer 10 when Payload's adapter supports it. |

### Still not tested
- Production proxy topology and the right `INQUIRY_IP_HEADER` (no host chosen).
- Security probes on PostgreSQL. Migrations, seed and public queries were verified on PostgreSQL 17 (`docs/evidence/database-verification.md`), but the probes above ran on SQLite.
- Staff upload validation, SMTP notifications (not configured).
