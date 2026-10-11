# E2E summary (spec §16.1), 2026-10-11

> **Status 2026-10-11 (final):** this is the QA-round record. All four findings are fixed (F1–F4). The final run on the final build: 243 passed, 0 failed, 40 skipped by design (`docs/evidence/final/e2e-run.txt`). See `docs/test-report.md`.

**Target:** production build `http://localhost:3200` (isolated fixture DB `data/e2e.db`, `DEMO_FIXTURES=true`). Journey 6 also reads from the dev server `:3100`, which has the real empty DB, and writes nothing to it.
**Command:** `E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test --project=desktop --project=mobile --reporter=list`
**Full output:** [`e2e-run.txt`](./e2e-run.txt)

**Result:** 270 tests ran. 224 passed, 6 failed, 40 skipped, in 7.3 min.
- 2 failures come from a real app defect, F1 below: `forms.spec.ts › production type is required…`, which fails on desktop and on mobile.
- 4 failures come from `a11y.spec.ts`, which another agent wrote: axe `scrollable-region-focusable` on `/ar|en/knowledge` @390 (`.snap-x` in `TopicTiles.tsx`).
- 40 skips are intentional. 38 are a11y @1440 cases that the mobile project skips, and 2 are desktop-only keyboard tests in `navigation.spec.ts`.

| Spec (new unless noted) | Projects | Result | Covers |
|---|---|---|---|
| `journeys.spec.ts` | desktop | 5/5 | J1: home → scroll to the footer → broilers page → farm inquiry. Sales REST confirms `type=farm`, `segment=broilers`, `sourcePath=/ar/solutions/broilers`, and the phone stored in E.164. J2: filter rail category + segment kept in the URL and after a reload → `fixture-supplement-beta` → inquiry drawer. The stored inquiry has `type=product` and `productRef` = the product's id. J6: dev empty catalogue shows the designed empty state; its CTA leads to `#catalog-inquiry`; client validation works and the server-action round trip completes (honeypot rejected, nothing persisted). J7: a `<script>`/`page=-1` query returns 200 and is not reflected in the page; the draft and unknown slugs return 404 (ar and en). J8: the server-action POST is forced to 500 → the failure panel and "try again" appear, the live region announces it, no success is shown, and no record is created. |
| `forms.spec.ts` | desktop + mobile | 6/7 each | Empty submit: focused error summary, links to each field, `aria-invalid`, `aria-describedby` → message. Production type required (**fails: F1**). Invalid phone is rejected; Arabic-Indic digits are accepted. Missing consent is rejected. A filled honeypot gives a neutral error and no record. A double-click stores exactly one record. Rate limit: the 6th submission shows the rate-limited message, and the first 5 duplicates map to one reference and one record. |
| `cms.spec.ts` | desktop | 7/7 | A draft is invisible. Setting `isPublished` without approval is reverted by the guard. After approve + publish, the product appears in `/ar/products` and its detail page returns 200; after delete, it returns 404. An editor with `canApprove` can approve; a plain editor gets 403. Sales cannot create, update or delete products. Sales can move an inquiry new→contacted→closed; closed→new returns 400; the submitted fields cannot be changed; sales cannot delete. REST create on inquiries returns 403 even for admin. Anonymous requests to inquiries and users return 401/403. The public products endpoint returns only approved and published records, never the draft and never staff-only fields. |
| `keyboard-motion.spec.ts` | desktop | 4/4 | The first Tab reaches the skip link, which becomes visible and jumps to `#main`. The FAQ accordion works with Enter and Space, keeps `aria-expanded` in sync, makes the closed panel `inert`, and keeps only one item open. The drawer opens from the keyboard, moves focus inside, keeps Tab inside, locks scroll, and Esc closes it and returns focus. With reduced motion, all 47 rendered `[data-reveal]` elements are in their final state at load. Without reduced motion, 33 of 47 are hidden at load, so the check does catch hidden reveals. |
| `navigation.spec.ts` (existing) | desktop + mobile | 72 pass, 2 skip | No test changes were needed. |

**Isolation and cleanup:** every inquiry name carries a per-worker run tag, and `afterAll` deletes these records through admin REST and asserts that none remain. Temporary products use the slug `e2e-tmp-<ts>`, and the temporary user is deleted. After the run the DB held 0 inquiries, the 4 fixture products and the 4 seeded users. Each submitting test sends its own `x-real-ip` from 198.18/198.19.x.x, so tests never share the per-IP limiter. This only works because `INQUIRY_IP_HEADER` is unset (see F4).

## Findings (app; not patched)
- **F1 · P0:** cross-field required errors vanish on blur, which leaves a silent dead end. `currentErrors()` in `InquiryFormClient.tsx` (onBlur/onChange) validates `new FormData(form)` without `idempotencyKey`. In Zod 4 the base-field failure then skips `superRefine`, so the error summary that just got focus is cleared and focus drops to `<body>`. Nothing is sent and no message is shown. This affects farm (production type), general (message), partner (company, role, product line, message) and product without a product or category (message). Related: an empty submit never lists these fields. Evidence: `forms.spec.ts:77` (desktop and mobile), plus manual checks of `/ar/contact?type=general` and `/ar/partner-with-us`.
- **F2 · P2:** for the product type, the message field is labelled "(اختياري)" but is required when no product or category is chosen (`REQUIRED.product` vs the schema's `superRefine`). This affects `/ar/contact?type=product` and the catalogue's compact forms.
- **F3 · P1** (found by `a11y.spec.ts`): the topic scroller on `/ar|en/knowledge` @390 cannot be focused with the keyboard (axe `scrollable-region-focusable`, `TopicTiles.tsx:42`).
- **F4 · P2** (already logged in `docs/open-items.md`): with `INQUIRY_IP_HEADER` unset, the limiter trusts client-sent `cf-connecting-ip`/`x-real-ip`. Rotating the header bypasses the 5 per 10 min limit, as this suite shows.

## Not covered
- The no-JS form fallback.
- SMTP notifications (not configured).
- Lighthouse (not part of this role).
- The admin UI itself: the CMS was tested through REST.
- Journeys, CMS and keyboard tests run on desktop only, as set in `playwright.config.ts`.
