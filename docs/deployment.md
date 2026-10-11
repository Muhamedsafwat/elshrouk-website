# Deployment guide

**Status: NOT DEPLOYED.** No hosting account, domain, database, storage or SMTP credentials were provided, and nothing is published without explicit client permission (spec §9.1, §15 Phase 8). This guide makes the deployment reproducible once those are supplied.

## 1. What production needs

| Need | Recommended | Notes |
|---|---|---|
| Node host for Next.js + Payload | Any Node 20.18+ host that runs a long-lived `next start` (VPS/container, Render, Railway, Fly.io, AWS/GCP/Azure app services) or Vercel (serverless) | Payload runs inside the Next app. Serverless works but needs Postgres + S3 (no local disk). |
| PostgreSQL 15–17 | Managed Postgres (Neon, Supabase, RDS, Cloud SQL, DigitalOcean) | **Database encoding must be UTF8** (Arabic content). A WIN1252 database fails with `character … has no equivalent in encoding "WIN1252"` (verified, docs/evidence/database-verification.md). |
| Object storage for CMS uploads | S3-compatible bucket (AWS S3, Cloudflare R2, DigitalOcean Spaces, MinIO) | Enabled automatically when `S3_BUCKET` is set (`@payloadcms/storage-s3`). |
| SMTP (optional) | Transactional provider (SES, Postmark, Mailgun, company SMTP) | Only for "new inquiry" notifications (no PII in the mail). Without it, inquiries are still stored in the CMS. |
| Domain + TLS | Client-owned domain | Serve over HTTPS only. Production builds send HSTS, and the CSP adds `upgrade-insecure-requests` when `SITE_URL` is https (an http `SITE_URL` omits it, so Safari can still load assets on a plain-HTTP staging server). |

## 2. Environment variables (see `.env.example`)

Required: `DATABASE_URL` (postgres://… UTF8 DB), `PAYLOAD_SECRET` (≥ 32 random chars), `SITE_URL` + `NEXT_PUBLIC_SITE_URL` (the public https origin, identical), `NEXT_PUBLIC_SITE_ENV=production` (only at real launch; staging should use `staging`).
Required for abuse protection: `INQUIRY_IP_HEADER` — the client-IP header set by YOUR proxy/CDN (e.g. `x-real-ip` behind nginx, `cf-connecting-ip` only behind Cloudflare); without it a global fail-safe cap applies.
Optional: `S3_*`, `SMTP_*`, `INQUIRY_NOTIFY_EMAIL`, `NEXT_PUBLIC_ANALYTICS_PROVIDER` (keep unset until a provider and consent strategy are approved), `INTERNAL_SITE_ORIGIN` (loopback origin such as `http://127.0.0.1:3000` for the proxy's slug-existence check; defaults to `SITE_URL`, never to the request's Host header).

`NEXT_PUBLIC_*` values are inlined at **build** time — build with the production values. `SITE_URL` is read at runtime by the server.

## 3. First deployment (PostgreSQL)

```bash
pnpm install --frozen-lockfile
# 1) create the database (UTF8):  CREATE DATABASE alshorouk ENCODING 'UTF8' TEMPLATE template0;
# 2) apply schema migrations
DATABASE_URL=postgres://… pnpm payload migrate
# 3) seed approved site content (idempotent)
DATABASE_URL=postgres://… pnpm seed
# 4) build & start
pnpm build
pnpm start            # or the platform's start command; set PORT/--port as required
```

Then open `/admin`, create the first account (it becomes admin), create editor/sales accounts, and work through `docs/open-items.md` (verified contact channels, real products, approvals). Keep **Site settings → Site status = Staging** until the client approves launch; switch to **Production** together with `NEXT_PUBLIC_SITE_ENV=production` to allow indexing.

## 4. Schema changes later

```bash
# after editing src/payload/** collections/globals, against a dev Postgres:
DATABASE_URL=postgres://… pnpm payload migrate:create <name>    # writes src/migrations/postgres/*
DATABASE_URL=postgres://… pnpm payload migrate                  # apply (also run on deploy)
pnpm generate:types
```

Local development keeps using SQLite (`file:./data/alshorouk.db`), whose schema Payload syncs automatically in development.

## 5. Post-deploy verification checklist

- [ ] `/` redirects to `/ar`; `/ar`, `/en`, all routes in docs/site-map.md return 200; unknown paths return the designed 404.
- [ ] `/robots.txt` disallows `/admin` and `/api` (and everything while staging); `/sitemap.xml` lists only public routes.
- [ ] Response headers include CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- [ ] Submit each form type once → the record appears in `/admin` → Inquiries with reference, type, source page; delete the test records.
- [ ] Log in as sales → can see/update inquiries, cannot publish products; as an unauthorised editor → cannot approve.
- [ ] Lighthouse mobile run on `/ar` (record in docs/performance-report.md).
- [ ] Media uploads land in the S3 bucket (if configured); e-mail notification arrives (if configured).

## 6. Backups & data

- Enable automated daily Postgres backups with point-in-time recovery on the managed database.
- Inquiries contain personal data: restrict admin accounts, rotate `PAYLOAD_SECRET` only with a planned re-login, and implement the retention period the company sets in the privacy policy.
