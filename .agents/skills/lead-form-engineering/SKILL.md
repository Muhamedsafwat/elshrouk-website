---
name: alshorouk-lead-form-engineering
description: Engineer the Alshorouk farm, product, partnership and general inquiry forms end to end — one shared Zod schema for client and server, Egyptian and international phone validation with Arabic-Indic digit normalisation, honeypot, per-IP rate limiting, idempotency key and duplicate protection, and persistence through the Payload Local API before any success is shown — use when building or changing any form, the inquiry server action, the inquiry drawer or the sales workflow.
---

# Skill: Alshorouk Lead Form Engineering

Role owner: CMS / Backend Engineer with the Frontend Architect (spec §13.7–13.8). Non-negotiable: **no success message unless the inquiry record is persisted.**

## Activation
- Contact page (`/[locale]/contact?type=farm|product|partner|general`), partnership page, segment-page and how-we-work forms, the product inquiry drawer (`ProductInquiryDrawer`), the empty-catalogue "request the list" CTA.
- The inquiry server action, validation schema, phone/digit utilities, rate limiter, notifications, or the `inquiries` collection.
- Tests for spec §16.1 (Zod rejects/accepts, persistence, rate limit, duplicates, E2E 1, 2, 4, 8).

## Inputs
- `inquiries` collection (`src/payload/collections/Inquiries.ts`): REST `create: nobody`; fields `reference` (unique), `type` (`farm | product | partner | general`), `status` (`new → contacted → qualified → closed / rejected`, enforced with `statusHistory`), `name`, `phone`, `email`, `organization`, `role`, `governorate`, `segment` (`broilers | layers | breeders | multiple`), `productCategory` (`feed | supplements | medicines | vaccines | unsure`), `productRef`, `productLabel`, `birdCapacity`, `quantity`, `productLine`, `requestDetails`, `locale`, `sourcePath`, `consentAt` (required), `idempotencyKey` (unique), `adminNotes`. `notifySales` e-mails only when `SMTP_HOST` + `INQUIRY_NOTIFY_EMAIL` are set (no PII in the body); otherwise logs "stored in CMS; notifications pending SMTP configuration".
- `toWesternDigits()` in `src/lib/search/normalize.ts`; `trackEvent()` in `src/lib/analytics.ts` (no-op without provider + consent; allow-listed keys only).
- Dictionaries `contact.ts`, `partner.ts`, `products.ts` (`drawer.*`), Zod 4.6.5, React 19 `useActionState`, Next 16 Server Actions (1 MB default body limit, Origin vs Host check).
- Spec §4.3, §6.8–6.9, §10.3, §11.1–11.4, §16.1.

## Procedure
1. **One shared schema** (e.g. `src/lib/forms/inquiry-schema.ts`; search for an existing module first). Pure Zod, no server-only imports, imported by the client form and the server action. `z.discriminatedUnion('type', [...])`:
   - common: `name` trimmed 2–80; `phone` (step 2); `email` optional `z.email()`; `organization` ≤ 120; `governorate` optional ≤ 60; `message` ≤ 2000; `consent: z.literal(true)`; `locale: z.enum(locales)`; `sourcePath` relative `/ar|/en…` ≤ 200; `idempotencyKey: z.uuid()`; honeypot `company_website: z.string().max(0)`.
   - `farm`: `segment` required (`broilers|layers|breeders|multiple`), optional `birdCapacity` ≤ 40, `productCategory` optional.
   - `product`: `productId` optional string (validated server-side), `productCategory` optional, `quantity` ≤ 60; message optional.
   - `partner`: `organization` + `role` required, `productLine` ≤ 120.
   - `general`: `message` required (≥ 10).
   Error messages are **codes** (`{ error: 'phone_invalid' }`); the UI maps codes to AR/EN dictionary strings, so the schema stays language-neutral. The server re-parses everything — client validation is UX only.
2. **Phone normalisation** (`normalizePhone(raw)` → E.164 or `null`): NFKC → `toWesternDigits` (U+0660–0669 and U+06F0–06F9) → strip bidi marks (U+200E, U+200F, U+202A–202E, U+2066–2069), spaces incl. NBSP, `-`, `.`, `(`, `)` → leading `00` becomes `+`. Egypt: `+20`/`20`/trunk `0` + mobile NSN `1[0125]\d{8}` → `+201…` (strict); landline NSN of 8–9 digits starting 2–9 or 13 accepted as `+20…` (permissive; sales verifies). Other countries: `+` followed by 8–15 digits, country code not starting with 0. Everything else → `phone_invalid`. Store only the E.164 value. (Use `libphonenumber-js` only if the orchestrator approves the dependency.) Test vectors — synthetic, never shown in UI or seeds:
   `01012345678`, `٠١٠١٢٣٤٥٦٧٨`, `۰۱۰۱۲۳۴۵۶۷۸`, `+20 101 234 5678`, `0020-10-1234-5678`, `201012345678`, `‏+20 10 1234 5678` → `+201012345678`; `0223456789` → `+20223456789`; `+44 20 7946 0958` → `+442079460958`; `+1 (202) 555-0143` → `+12025550143`; `0101234567`, `01312345678`, `12345`, `+0123456789` → invalid.
3. **Server action** (`'use server'`, e.g. `src/lib/forms/submit-inquiry.ts`, importing a `server-only` persistence module). Order of operations:
   1. Reject oversize payloads early (each field bounded by the schema; propose `experimental.serverActions.bodySizeLimit: '64kb'` to the orchestrator).
   2. Honeypot filled → return `{ ok: false, code: 'rejected' }` — a neutral error, **never** a fake success (autofill can hit honeypots; humans must not be told a lost message was sent). Name the field so browsers do not autofill it; wrapper `aria-hidden="true"`, input `tabIndex={-1}` `autoComplete="off"`.
   3. Rate limit per client IP: key = HMAC-SHA256(ip, `PAYLOAD_SECRET`) — raw IPs are never stored or logged; e.g. 5 submissions / 10 min and 20 / 24 h. IP from the platform's trusted header only (document which per host; `x-forwarded-for` first hop only behind a trusted proxy). Store: in-memory map for dev/test (single process), a DB-backed store for production (multi-instance safe) behind one `RateLimitStore` interface. Over limit → `{ ok: false, code: 'rate_limited', retryAfterMinutes }`.
   4. Zod parse → `{ ok: false, code: 'invalid', fieldErrors }` with codes only.
   5. Idempotency: look up `idempotencyKey`; if found, return that record's `reference` (`ok: true` — it really exists). Also treat same phone + type + normalised message within 10 minutes as the same lead. A unique-constraint race re-reads and returns the existing reference.
   6. Product context: re-read `productId` through the public gate (approved + published); store `productRef` and `productLabel` from the database, never from the client. Unknown id → store without `productRef`.
   7. Persist with the Local API: `await payload.create({ collection: 'inquiries', data: { …, consentAt: new Date().toISOString(), status: 'new' } })` (server code bypasses the closed REST access by design). Only after it resolves return `{ ok: true, reference }`. Any thrown error → `{ ok: false, code: 'server_error' }` without internals.
   8. Notifications run in the collection hook; their failure never flips a stored lead into an error and never blocks the response.
4. **Client form.** `useActionState(submitInquiry, initial)` + `<form action={formAction}>` so it works without JS; submit button disabled while pending (UX only — the key is the real guard). Generate `idempotencyKey` with `crypto.randomUUID()` once per form instance (render a fresh form after success). Labels always visible in Arabic; required markers; `aria-invalid` + `aria-describedby` per field; an error summary that receives focus; success panel focuses its heading and shows `drawer.successReference` with the reference in `<bdi>`; status text in one `aria-live="polite"` region. Phone input `type="tel"`, `dir="ltr"`, `inputMode="tel"`, `autoComplete="tel"`. Consent checkbox unchecked by default, linking to `/[locale]/privacy`. Prefill from `?type=` and segment pages (`segment`), product drawer (`productId`); unknown query values are ignored.
5. **Privacy and logging.** Never log or send to analytics names, phones, e-mails, messages or IPs. Log only `reference`, `type`, `locale`, outcome code. `trackEvent('form_submit_success', { kind: type })` after `ok: true`; `form_submit_error` with the code only.
6. **Copy rules.** Success = "سجلنا استفسارك…" (true after persistence). Never promise response times, call-backs within X hours or availability. Unknown contact channels stay hidden — the form is the channel.
7. **Sales workflow.** Sales users open `/admin/collections/inquiries`, see product context, change `status` through the allowed transitions and add `adminNotes`; submitted fields stay immutable server-side.

## Checklists
- [ ] Same schema module imported by client and server; server re-validates.
- [ ] All phone vectors pass; Arabic-Indic and pasted RTL numbers accepted.
- [ ] Honeypot and rate limit return errors, never success; raw IPs never stored.
- [ ] Double click, refresh-resubmit and two tabs produce one record.
- [ ] Success appears only after `payload.create` resolved; network/server failure shows a recoverable error.
- [ ] Record contains type, segment, category, `productRef`/`productLabel`, `sourcePath`, `locale`, `consentAt`.
- [ ] Works with JS disabled; keyboard-only flow passes; errors announced once.

## Deliverables
- Schema, phone utility, rate limiter, server action, form components (in files your task owns).
- Unit tests (schema per type, phone vectors, honeypot, rate limiter); integration test persisting through the Local API on a temporary SQLite DB (type/segment/product context, idempotency, duplicate window); Playwright E2E 1, 2, 4 and 8 — for 8, fail persistence deliberately with `page.route()` on the action POST (`route.fulfill({ status: 500 })`) and assert an error and no success text.
- Evidence (test output, admin screenshot of a product-linked inquiry) under `docs/evidence/gate-5/` and `screenshots/`.

## Acceptance criteria
- A real submission creates exactly one `inquiries` record with correct context, visible to a sales user in `/admin` (spec §13.8, Gate 5).
- Malformed input, spam signals, rate-limit overflow and server failures never show success and never leak internals.
- Rapid double submission and retries do not duplicate leads.
- No PII in logs, analytics or notification bodies.

## Failure recovery & escalation
- **Persistence fails in production-like runs:** keep the error UX; check DB connectivity/migrations; never fall back to "email only" or local files silently.
- **No SMTP/recipient configured:** expected — leads are stored; keep the open item for the notification channel.
- **IP header unknown on the target host:** rate-limit by the most trustworthy available signal, document it, and record a deployment open item.
- **Abuse beyond honeypot + rate limit:** propose a privacy-respecting challenge to the orchestrator (requires consent/legal review); do not add third-party scripts yourself.
- **Field or collection change needed:** agree with the orchestrator (schema owner), then regenerate types.

## Spec references
§0.2 (forms persisted, no fake success), §4.3, §6.3 (segment prefill), §6.8–6.9, §9.3, §10.1 (Inquiry), §10.3, §11.1–11.4, §12.4, §13.8, §16.1, §16.4, §21 Q6 and Q9.
