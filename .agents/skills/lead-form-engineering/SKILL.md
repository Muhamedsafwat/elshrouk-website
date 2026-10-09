---
name: alshorouk-lead-form-engineering
description: Engineer the Alshorouk farm, product, partnership and general inquiry forms end to end — one shared Zod schema for client and server, Egyptian and international phone validation with Arabic-Indic digit normalisation, honeypot, per-IP rate limiting, idempotency key and duplicate protection, and persistence through the Payload Local API before any success is shown — use when building or changing any form, the inquiry server action, the inquiry drawer or the sales workflow.
---

# Skill: Alshorouk Lead Form Engineering

Role owner: CMS / Backend Engineer with the Frontend Architect (spec §13.7–13.8). Non-negotiable: **no success message unless the inquiry record is persisted.**

## Activation
- Contact page (`/[locale]/contact?type=farm|product|partner|general`), partnership page, segment-page and how-we-work forms, the product inquiry drawer, the empty-catalogue "request the list" CTA.
- The inquiry server action, the shared schema, phone/digit utilities, the rate limiter, notifications, or the `inquiries` collection.
- Tests for spec §16.1 (Zod rejects/accepts, persistence, rate limit, duplicates; E2E 1, 2, 4, 8).

## Inputs
- **Shared contract `src/lib/inquiries/schema.ts`** (pure Zod 4, imported by client and server): `inquirySchema`, `INQUIRY_KINDS` (`farm | product | partner | general`), `PRODUCTION_TYPES` (`broilers | layers | breeders | multiple`), `PRODUCT_CATEGORY_OPTIONS` (`feed | supplements | medicines | vaccines | unsure`), `normalizePhone()`, `isValidPhone()`, `fieldErrors()`, error codes `required | invalidPhone | invalidEmail | tooShort | tooLong | consentRequired`, honeypot field `website`, `idempotencyKey: z.uuid()`, `productId` (number), `consent: z.literal(true)`, and `InquiryResult` = `{ ok: true, reference }` | `{ ok: false, error: 'validation', fields }` | `{ ok: false, error: 'rateLimited' | 'server' | 'spam' }`.
- **`inquiries` collection** (`src/payload/collections/Inquiries.ts`): REST `create: nobody`; unique `reference` and `idempotencyKey`; lifecycle `new → contacted → qualified → closed / rejected` enforced with `statusHistory`; fields `name`, `phone`, `email`, `organization`, `role`, `governorate`, `segment`, `productCategory`, `productRef`, `productLabel`, `birdCapacity`, `quantity`, `productLine`, `requestDetails`, `locale`, `sourcePath`, `consentAt` (required), `adminNotes`. The `notifySales` hook e-mails only when `SMTP_HOST` + `INQUIRY_NOTIFY_EMAIL` are set (no PII in the body); otherwise it logs "stored in CMS; notifications pending SMTP configuration".
- Error copy: `common.forms.errors.*` in `src/i18n/dictionaries/{ar,en}/common.ts`; drawer copy `products.drawer.*`.
- `toWesternDigits()` (`src/lib/search/normalize.ts`), `trackEvent()` (`src/lib/analytics.ts`), React 19 `useActionState`, Next 16 Server Actions (1 MB default body limit; Origin vs Host check).
- Spec §4.3, §6.8–6.9, §10.3, §11.1–11.4, §16.1.

## Procedure
1. **One schema, two sides.** Extend `inquirySchema` rather than creating a second schema. Per-type rules live in its `superRefine` (partner → organization; general/partner → message; product → product, category or message). Bounds stay explicit (name 2–120, message ≤ 2000, `sourcePath` relative ≤ 300). The client parses for UX; the server action re-parses everything and is authoritative. Error messages are codes; the UI maps them to dictionary strings.
2. **Phone handling.** `normalizePhone()` converts Arabic-Indic (U+0660–0669) and Extended Arabic-Indic (U+06F0–06F9) digits, strips spaces, dashes, brackets, dots and LRM/RLM marks, and turns a leading `00` into `+`. `isValidPhone()` accepts Egyptian mobiles (`01[0125]` + 8 digits, or `+20` form), Egyptian landlines and international E.164 (`+` and 8–15 digits). Keep these behaviours (spec §11.4) and these vectors green (synthetic numbers — never shown in the UI or seeded as contacts):

   | Input | Expected |
   |---|---|
   | `01012345678` · `٠١٠١٢٣٤٥٦٧٨` · `۰۱۰۱۲۳۴۵۶۷۸` | valid (Egyptian mobile) |
   | `+20 101 234 5678` · `0020-10-1234-5678` · `+20 10 1234 5678` pasted with a leading RLM mark (U+200F) | valid |
   | `0223456789` (Cairo landline) | valid |
   | `+44 20 7946 0958` · `+1 (202) 555-0143` | valid (international) |
   | `12345` · `+0123456789` · empty | invalid |
   | `0101234567` (truncated 010 mobile) · `01312345678` (11 digits, not an 010/011/012/015 mobile) | should be invalid — the current landline pattern `^0(2\|3\|[1-9]\d)\d{6,8}$` accepts both; tighten it (report to the orchestrator) |

   Also strip Unicode isolates (U+202A–202E, U+2066–2069) that RTL copy/paste can add, and prefer storing one canonical form (E.164, e.g. `+201012345678`) so duplicate detection and sales follow-up are reliable — propose the change if the helper still stores the local form.
3. **Server action** (`'use server'`, importing a `server-only` persistence module; one action shared by every form). Order:
   1. Bound the payload (schema maxima; propose `experimental.serverActions.bodySizeLimit: '64kb'` to the orchestrator).
   2. Honeypot (`website`) non-empty → `{ ok: false, error: 'spam' }` — a neutral, recoverable error, **never** a fake success (autofill can hit honeypots; a human must not be told a lost message was sent). Render the field inside an `aria-hidden="true"` off-screen wrapper with `tabIndex={-1}` and `autoComplete="off"`.
   3. Rate limit per client IP: key = HMAC-SHA256(ip, `PAYLOAD_SECRET`) — raw IPs are never stored or logged; e.g. 5 submissions / 10 min and 20 / 24 h. Take the IP only from the platform's trusted header (document which per host; first `x-forwarded-for` hop only behind a trusted proxy). In-memory store for dev/test (single process) and a DB-backed store for production (multi-instance safe) behind one interface. Over the limit → `{ ok: false, error: 'rateLimited' }`.
   4. `inquirySchema.safeParse` → `{ ok: false, error: 'validation', fields: fieldErrors(error) }`.
   5. Idempotency: look up `idempotencyKey`; if found, return that record's `reference` (`ok: true` — it really exists). Treat the same phone + type + normalised message within 10 minutes as the same lead. A unique-constraint race re-reads and returns the existing reference.
   6. Product context: re-read `productId` through the public gate (approved + published + not fixture); store `productRef` and `productLabel` from the database, never the client's label. Unknown id → store without `productRef`.
   7. Persist: `await payload.create({ collection: 'inquiries', data: { …, consentAt: new Date().toISOString() } })` — server code bypasses the closed REST create by design; the collection hook sets `status: 'new'`. Only after it resolves return `{ ok: true, reference }`. Any thrown error → `{ ok: false, error: 'server' }` without internals.
   8. Notifications run in the collection hook; a notification failure never turns a stored lead into an error.
4. **Client form.**
   - `useActionState(submitInquiry, initial)` + `<form action={formAction}>` so it also works without JS; the button is disabled while pending (UX only — the idempotency key is the real guard).
   - Generate `idempotencyKey` with `crypto.randomUUID()` once per form instance; after success show the success panel and mount a fresh form instance.
   - Visible Arabic labels and required markers; `aria-invalid` + `aria-describedby` per field; an error summary that receives focus; the success panel focuses its heading and shows `drawer.successReference` with the reference in `<bdi>`; status text in one `aria-live="polite"` region.
   - Phone input `type="tel"`, `dir="ltr"`, `inputMode="tel"`, `autoComplete="tel"`; consent checkbox unchecked by default and linked to `/[locale]/privacy`.
   - Prefill from `?type=`, segment pages (`segment`) and the product drawer (`productId`); unknown query values are ignored, never echoed.
5. **Privacy and logging.** Never log or send to analytics names, phones, e-mails, messages or IPs. Log only `reference`, `type`, `locale` and the outcome code. `trackEvent('form_submit_success', { kind: type })` after `ok: true`; `trackEvent('form_submit_error', { kind: type, source: error })` otherwise.
6. **Copy rules.** Success = "سجلنا استفسارك…" (true after persistence). Never promise response times, call-backs within X hours or availability. Unknown contact channels stay hidden — the form is the channel.
7. **Sales workflow.** Sales users open `/admin/collections/inquiries`, see product context, move `status` through the allowed transitions and add `adminNotes`; submitted fields must stay immutable server-side (field `access.update`, not only `admin.readOnly`).

## Checklists
- [ ] Client and server import the same `inquirySchema`; the server re-validates.
- [ ] Phone vectors pass; Arabic-Indic digits and pasted RTL numbers accepted; truncated/invalid prefixes rejected.
- [ ] Honeypot and rate limit return errors, never success; raw IPs never stored.
- [ ] Double click, refresh-resubmit and two tabs produce one record.
- [ ] Success appears only after `payload.create` resolved; network/server failure shows a recoverable error.
- [ ] The record contains type, segment, category, `productRef`/`productLabel`, `sourcePath`, `locale`, `consentAt`.
- [ ] Works with JS disabled; keyboard-only flow passes; errors are announced once.

## Deliverables
- Server action, persistence module, rate limiter and form components in the files your task owns; schema/phone changes proposed or made where granted.
- Unit tests (schema per type, phone vectors, honeypot, rate limiter); an integration test persisting through the Local API on a temporary SQLite DB (type/segment/product context, idempotency, duplicate window); Playwright E2E 1, 2, 4 and 8 — for 8, fail persistence deliberately with `page.route()` on the action POST (`route.fulfill({ status: 500 })`) and assert an error and no success text.
- Evidence (test output, an admin screenshot of a product-linked inquiry) under `docs/evidence/gate-5/` and `screenshots/`.

## Acceptance criteria
- A real submission creates exactly one `inquiries` record with correct context, visible to a sales user in `/admin` (spec §13.8, Gate 5).
- Malformed input, spam signals, rate-limit overflow and server failures never show success and never leak internals.
- Rapid double submission and retries do not duplicate leads.
- No PII in logs, analytics or notification bodies.

## Failure recovery & escalation
- **Persistence fails in production-like runs:** keep the error UX; check DB connectivity/migrations; never fall back silently to "e-mail only" or local files.
- **No SMTP/recipient configured:** expected — leads are stored; OI-13 stays open.
- **IP header unknown on the target host:** rate-limit on the most trustworthy available signal, document it, record a deployment open item.
- **Abuse beyond honeypot + rate limit:** propose a privacy-respecting challenge to the orchestrator (needs consent/legal review); do not add third-party scripts yourself.
- **Field or collection change needed:** agree it with the orchestrator (schema owner), then run `pnpm generate:types`.

## Spec references
§0.2 (forms persisted, no fake success), §4.3, §6.3 (segment prefill), §6.8–6.9, §9.3, §10.1 (Inquiry), §10.3, §11.1–11.4, §12.4, §13.8, §16.1, §16.4, §21 Q6 and Q9.
