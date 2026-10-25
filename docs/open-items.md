# Open items — human approvals & missing information

The queue of decisions, assets, facts and credentials that only people (client, legal, brand, IT) can provide — spec §19.
Development continues without them (spec §19: "do not block unnecessarily"): each item has a working, honest fallback, and nothing unapproved is published.

_Last updated: 2026-10-11 (Orchestrator, final handoff). Items were raised 2026-10-09. All remain **open** except where a row says otherwise: OI-07 is partly answered and OI-12 is partly closed (PostgreSQL verified locally)._

**Priority:** **Critical** — blocks public launch (not development) · **High** — needed before launch; launching without it visibly degrades credibility or quality · **Medium** — completeness; can follow launch · **Low** — optional.
**Owners:** client (business/commercial) · legal (compliance, privacy) · brand (identity owner / designer) · IT (hosting, credentials).
**Cross-references:** brand-owner details are itemised in `docs/brand-audit.md` §10.2 (O1–O16); the matching O-number is given in brackets. This file is the single master queue.

## Summary

| ID | Item | Owner | Priority | Blocks / degrades |
|---|---|---|---|---|
| OI-01 | Licensed Thmanyah web fonts (WOFF2) [O1] | brand / client | High | Brand Arabic typography (staging fallback in use) |
| OI-02 | Confirm PDF-extracted logo vs original source files [O2] | brand | High | Logo provenance sign-off |
| OI-03 | Missing "mark without descriptor" artwork [O3] | brand | Medium | Compact logo placements |
| OI-04 | Favicon / app icon from the emblem — approval [O4] | brand | Medium | Browser and admin icons |
| OI-05 | Verified contact & identity data (phone, WhatsApp, email, address, legal entity, domain, social) | client | Critical | Contact shortcuts, footer, Organization schema |
| OI-06 | Real product list (names, SKUs, categories, pack sizes, labels, manufacturers, registrations) | client + legal | Critical | Public catalogue content, product pages |
| OI-07 | Confirm feed / supplement lines and the scope of "~150" — **partly answered** (business lines confirmed) | client | High | Category copy depth, catalogue coverage |
| OI-08 | Commissioned / approved photography (current: licensed stock) [O11] | client / brand | High | Authenticity of imagery |
| OI-09 | Confirm the 5-step commercial process and any service claims [O12] | client | High | "How we work" copy, Scene 6 wording |
| OI-10 | Legal / compliance sign-off: veterinary copy, label downloads, privacy policy, consent, retention | legal | Critical | Public launch, label PDFs, privacy page |
| OI-11 | CMS ownership: production admin owner, approvers, sales users | client | High | Production accounts and approval workflow |
| OI-12 | PostgreSQL (staging/production) + object storage credentials — **local PostgreSQL verification done** | IT / client | Critical | Production database, media storage, deployment |
| OI-13 | SMTP / notification channel and recipient inbox for inquiries | IT / client | High | E-mail notifications (leads still stored) |
| OI-14 | Analytics provider IDs + consent strategy | client + legal | Medium | Analytics (adapter is a no-op) |
| OI-15 | Approval of taglines, hero headline, metric footnote, poultry-only vision/mission/values copy and English copy [O9] | client / brand | High | Publishing high-visibility copy; English indexing |
| OI-16 | Hosting / deployment destination, domain and permission to deploy | client / IT | Critical | Deployment, canonical URLs, sitemap host |
| OI-17 | Knowledge-hub articles (or decision to hide the hub) | client | Medium | Knowledge section content |
| OI-18 | Optional officially revised logo/descriptor covering feed lines [O13] | brand / client | Low | None functionally (strategy tension only) |
| OI-19 | Brand-owner detail decisions: "60" tint values, unlabelled p.9 card, hero display size above 56 px, new icons, amber-on-black fill, extra gradient forms, optional black-SVG re-extraction [O5–O8, O14–O16] | brand | Medium | Minor token/size choices stay on documented interim values |
| OI-20 | Audience scope: are pharmacies, sub-distributors and institutional buyers site audiences (partnership page)? [O10] | client | Medium | Partnership page copy and form options |

---

### OI-01 — Licensed Thmanyah web fonts
- **Why needed:** PDF p.12 names Thmanyah (خط ثمانية) as the Arabic brand face. It is licensed; it is not in the repository and must not be downloaded from unofficial sources (AGENTS.md, spec §3.3).
- **Blocked / degraded meanwhile:** Arabic text renders in the staging fallback. Line-heights, mask reveals, headline line breaks and Arabic screenshots must all be re-verified after the swap.
- **Current fallback:** Alexandria (SIL OFL, self-hosted via `next/font`) for Arabic; Montserrat for Latin and all figures. The swap procedure is documented in `src/styles/fonts.ts` (`next/font/local`, files under `src/styles/fonts/thmanyah/`).
- **What we need:** official WOFF2 files for the licensed weights (e.g. Regular, Medium, Bold, Heavy/Black) and licence terms that cover web embedding on the production domain(s).
- **Owner / priority:** brand / client · High.

### OI-02 — Logo: confirm the PDF-extracted files against original source artwork
- **Why needed:** spec §3.4 requires the official logo. The current SVGs are true vectors extracted from the brand PDF (full colour from p.3; white and black one-colour from p.9) and pixel-verified, but the PDF is not the designer's master file.
- **Blocked / degraded meanwhile:** nothing visible; residual provenance risk. Note: the PDF's black one-colour card is drawn in `#030303`; the extracted file normalises it to the palette black `#000000`.
- **Current fallback:** verified files in `public/brand/` with provenance in `public/brand/extraction-meta.json` and `docs/brand-audit.md`; never redrawn, traced or recoloured.
- **What we need:** original approved logo files (AI/EPS/SVG/PDF) for full colour, white and black (and the amber/vermilion special-use versions if wanted), **or** written confirmation that the extracted files are approved for web use.
- **Owner / priority:** brand · High.

### OI-03 — "Mark without descriptor" artwork
- **Why needed:** PDF p.8 sets a 72 px minimum for the mark without the descriptor, but no such artwork exists in the PDF. Removing the descriptor ourselves would alter the official lockup.
- **Blocked / degraded meanwhile:** compact placements (very small headers, avatars) must use the full lockup at ≥ 110 px or omit the logo.
- **Current fallback:** full lockup everywhere at ≥ 110 px (mobile header 112–128 px).
- **What we need:** the official mark-only vector, or confirmation that it does not exist.
- **Owner / priority:** brand · Medium.

### OI-04 — Favicon / app icon from the emblem
- **Why needed:** spec §3.4 allows a favicon only from the approved emblem; the full lockup is illegible at 16–48 px. The CMS admin also references `/favicon.svg`.
- **Blocked / degraded meanwhile:** browser tab, bookmark and admin icons are absent or show an unapproved candidate.
- **Current fallback:** candidate icons cropped from the official vector paths (no redraw), marked `review_required`, used in local/staging only.
- **What we need:** approval of a candidate, or an official icon file.
- **Owner / priority:** brand · Medium.

### OI-05 — Verified contact & identity data
- **Why needed:** contact details are "not supplied" (spec §1.1) and must never be invented (AGENTS.md).
- **Items:** phone, WhatsApp number, e-mail address, office address and governorate(s) (and whether to show a map), legal entity name, confirmation of official domain ownership, official social-media profile URLs.
- **Blocked / degraded meanwhile:** no click-to-call or WhatsApp shortcut, no address or map, footer without contact lines, `Organization` JSON-LD without `contactPoint`/`address`/`sameAs`, copyright line uses the brand name instead of the legal name.
- **Current fallback:** the contact form (persisted to the CMS) is the channel; `site-settings` channels stay hidden until an admin ticks "verified".
- **What we need:** the values plus who verified them — entered by an admin in CMS → Site settings, or sent to the orchestrator.
- **Owner / priority:** client · Critical.

### OI-06 — Real product list
- **Why needed:** the catalogue may only publish approved, real records (spec §1.2–1.4, §6.4–6.5); nothing is seeded.
- **Fields per product:** Arabic name (English if approved), SKU, category (feed / feed supplements / veterinary medicines / veterinary vaccines), poultry segments, pack size, approved label text and label PDF, manufacturer and whether it may be shown, registration/licensing status, product or approved packaging images (with rights), availability wording.
- **Blocked / degraded meanwhile:** public catalogue shows the designed empty state with a working "اطلب قائمة المنتجات" request; the home product preview shows the category intro; no `Product` structured data.
- **Current fallback:** empty-state experience; obviously-fake fixtures exist only in an isolated test database.
- **What we need:** a spreadsheet or export with the fields above, plus the name of the person who approves product data (see OI-11).
- **Owner / priority:** client (commercial) + legal/regulatory · Critical.

### OI-07 — Feed / supplement lines and the scope of "~150"
- **Why needed:** the client named poultry feed and feed supplements as business lines; the approved "~150" covers veterinary medicines and vaccines only; catalogue coverage is undefined.
- **Answered (2026-10-09 build instruction):** the company focuses on poultry feed, feed supplements and related poultry veterinary supply, so supplier wording (نوفر / نوزع) is used for feed and supplements (`content/approval-register.md` C-01). The approved metric stays exactly as given: about 150 distributed products, stated as veterinary medicines and vaccines and never attached to feed or supplements (M-03).
- **Still open:** which feed and feed-supplement lines are offered (and whether any of it is own manufacturing); whether "~150" is still accurate and still covers medicines + vaccines only; whether the online catalogue should list every item or a selection.
- **Blocked / degraded meanwhile:** feed and supplement pages stay high-level (no formulas, brands or claims).
- **Current fallback:** distributor wording (نوفر / نوزع / نعمل على إتاحة) and the metric statement verbatim.
- **Owner / priority:** client · High.

### OI-08 — Commissioned / approved photography
- **Why needed:** spec §3.6 and PDF p.14 call for authentic, licensed or commissioned documentary photography of real operations.
- **Current state:** licensed stock poultry photography — sources and licences in `docs/image-provenance.md`.
- **Blocked / degraded meanwhile:** imagery is credible and segment-correct but not Alshorouk's own farms, team or operations; no testimonial section (spec §5 Scene 9). A partner-logo section now exists with the client-supplied partners (2026-10-25, register PT-01); the supplied logos are small PNGs (71–150 px) and the Menon file is a low-resolution wordmark on black, so SVG or transparent PNG logos (≥ 300 px wide) are needed for sharp display.
- **What we need:** a commissioned shoot or approved company photos with usage rights, consent from identifiable people and farm permissions; optionally real testimonials and partner logos with written permission.
- **Owner / priority:** client / brand · High.

### OI-09 — Commercial process and service claims
- **Why needed:** the 5-step journey (فهم احتياج المزرعة → تحديد المنتجات المناسبة → تأكيد الطلب والتوافر → تنسيق التوريد → استمرار التواصل) must be confirmed against real operations (spec §5 Scene 6, §6.6, §19 item 5).
- **Questions:** are the steps accurate? Owned warehouses or vehicles? Storage standards (e.g. cold chain)? Delivery times, coverage areas/governorates, minimum orders? Who follows up after delivery?
- **Blocked / degraded meanwhile:** process copy is shown as a suggested process (`review_required`); no delivery-time, fleet, warehouse, cold-chain or coverage statements; no geographic network map.
- **Current fallback:** neutral process wording; the Distribution Flow is an abstract journey, not a map.
- **Owner / priority:** client · High.

### OI-10 — Legal / compliance sign-off
- **Scope:** veterinary product presentation (commercial catalogue framing, the safety line `تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.`, label display and PDF downloads), product-page disclaimers, the privacy policy (data collected through forms, purpose, hosting location, retention period, access and deletion), consent wording, cookie/analytics consent, inquiry-data retention and deletion process.
- **Blocked / degraded meanwhile:** privacy page is a draft marked pending; label PDFs are not downloadable (`labelPdfApproved` stays false); the site cannot be made public.
- **Current fallback:** a draft privacy text that describes the actual data flow (CMS storage, no analytics); staging stays `noindex`.
- **Owner / priority:** legal · Critical.

### OI-11 — CMS ownership and roles
- **Why needed:** the production admin must belong to the company; editors may approve/publish only with business authorisation (`canApprove`); sales users handle inquiries (spec §10.2).
- **What we need:** the named admin owner (who creates the first admin account immediately after deployment), editors with and without approval authority, sales users, and any MFA/SSO requirement.
- **Blocked / degraded meanwhile:** no production accounts or approval workflow; local development accounts are never deployed.
- **Current fallback:** local SQLite admin for development and tests only.
- **Owner / priority:** client · High.

### OI-12 — Production database, object storage and a PostgreSQL verification environment
- **Why needed:** production uses PostgreSQL (`postgres://` `DATABASE_URL`, schema push disabled, migrations in `src/migrations/postgres`) and S3-compatible storage for media.
- **Done locally (2026-10-09/10):** with no PostgreSQL server or Docker on this machine, a real PostgreSQL 17 binary was run from a scratch folder (`embedded-postgres`, not a project dependency). The initial migration was generated (`src/migrations/postgres/20261009_183146_initial.ts`), applied, seeded and queried with the same results as SQLite. A WIN1252 database fails on Arabic text, so the production database must be UTF8. Evidence: `docs/evidence/database-verification.md`.
- **What we still need:** PostgreSQL connection details for staging and production, an S3-compatible bucket with region/endpoint and access keys, and a backup policy.
- **Blocked meanwhile:** P8-06 (deployment). P3-10 and gate G8.4 are done with local evidence.
- **Current fallback:** SQLite (`data/alshorouk.db`) and local `media/` uploads for development and tests only.
- **Owner / priority:** IT / client · Critical.

### OI-13 — Notification channel for new inquiries
- **Why needed:** sales should be notified of new leads (spec §10.3) with real provider credentials only.
- **What we need:** SMTP host/port/user/password (or a provider account), a from-address on the company domain, and the recipient inbox(es) (`INQUIRY_NOTIFY_EMAIL`).
- **Blocked / degraded meanwhile:** leads are stored in the CMS, but no e-mail is sent ("stored in CMS; notifications pending SMTP configuration"); sales must check `/admin`.
- **Current fallback:** admin inquiry list with the status workflow.
- **Owner / priority:** IT / client · High.

### OI-14 — Analytics provider and consent strategy
- **Why needed:** analytics may run only after IDs and a consent strategy are provided (spec §12.4).
- **What we need:** provider (e.g. GA4 or Plausible), property/site ID, consent banner wording and categories, retention settings.
- **Blocked / degraded meanwhile:** no traffic or conversion analytics; no field Web Vitals.
- **Current fallback:** typed no-op adapter (`src/lib/analytics.ts`); no analytics cookies.
- **Owner / priority:** client + legal · Medium.

### OI-15 — Approval of high-visibility copy and English copy
- **Items:** taglines `شريكك في منظومة إنتاج الدواجن` and `حلول إمداد متخصصة لمزارع الدواجن` (website copy only, never inside the logo); hero headline `من قلب صناعة الدواجن، نساند كل مرحلة من الإنتاج.`; metric footnote `الأرقام تقريبية وتعكس نطاق تعاملاتنا الحالي.`; adapted vision/mission lines; all English copy.
- **Blocked / degraded meanwhile:** these strings are `review_required` in `content/approval-register.md`; English pages are reachable but `noindex` until `site-settings.englishApproved`.
- **Current fallback:** proposed copy visible in local/staging only.
- **Owner / priority:** client / brand · High.

### OI-16 — Hosting, deployment destination, domain and permission to deploy
- **Why needed:** nothing is deployed, no DNS is changed and nothing is purchased without explicit permission (AGENTS.md, spec §9.1).
- **What we need:** the chosen host (Node 22 runtime compatible with Next.js 16 + Payload + PostgreSQL), account access or a named person to deploy, the production domain and DNS access, and an explicit go-ahead for staging and production.
- **Blocked meanwhile:** P8-06 deployment; absolute URLs for canonical tags, sitemap and Open Graph (`NEXT_PUBLIC_SITE_URL`).
- **Current fallback:** local preview (dev server / local production build) clearly labelled "not deployed"; `siteStatus = staging` keeps everything `noindex`.
- **Owner / priority:** client / IT · Critical.

### OI-17 — Knowledge-hub content
- **Why needed:** articles need approved authors, real dates and qualified review for veterinary topics (spec §6.7).
- **What we need:** approved articles, or a decision to hide the hub from navigation (`site-settings.showKnowledgeHub`).
- **Blocked / degraded meanwhile:** the hub shows a designed empty state with a contact CTA.
- **Current fallback:** empty state; no fabricated dates or authors.
- **Owner / priority:** client · Medium.

### OI-18 — Optional revised logo/descriptor
- **Why needed:** the official descriptor `لتوزيع الأدوية واللقاحات البيطرية` mentions medicines and vaccines only, while the site also presents feed and supplement lines. The descriptor stays unchanged unless the client supplies an officially revised logo (spec §0.3).
- **Blocked / degraded meanwhile:** nothing functional; a strategy tension remains.
- **Current fallback:** original logo unchanged; feed lines explained in website copy only. The artwork also spells «الادوية» without hamza (brand-audit O13); it stays exactly as drawn, and any correction would come only with the same official revision.
- **Owner / priority:** brand / client · Low.

### OI-19 — Brand-owner detail decisions
- **Why needed:** the brand audit found small ambiguities the brand owner should settle: whether the PDF's "60" swatches are intended or true 60 % mixes (O5), that the unlabelled 8th card on p.9 is not an approved variation (O6), whether the hero may exceed the PDF's 56 px headline size (O7), approval of new icons drawn to the PDF grammar for poultry, feed, supplements and the three segments (O8), the amber-on-black logo fill (O14), any gradient forms beyond the two-stop linear (O15), and an optional re-extraction of the black SVG (O16).
- **Blocked / degraded meanwhile:** nothing launch-critical; display sizes above 56 px stay staging-only, new icons are replaced by text labels and photography.
- **Current fallback:** the interim behaviour recorded for each item in `docs/brand-audit.md` §10.2.
- **Owner / priority:** brand · Medium.

### OI-20 — Audience scope for the partnership page
- **Why needed:** the old PDF audience listed pharmacies, sub-distributors and institutional buyers; the poultry-only site currently addresses poultry farms and their veterinarians (brand-audit O10). The partnership page and its form options depend on the answer.
- **Blocked / degraded meanwhile:** partnership copy stays generic ("supply partnership / agency discussion") with no audience promises.
- **Current fallback:** poultry farms and their veterinarians as the primary audience; partnership inquiries accepted without segment-specific claims.
- **Owner / priority:** client · Medium.

## How an item is closed
1. The owner supplies the asset, fact or decision (files to the orchestrator; contact values directly in CMS → Site settings by an admin; copy approvals as a dated note).
2. The orchestrator records the evidence (approval register row, `docs/brand-audit.md`, or the relevant doc), updates dependent tasks on `docs/task-board.md`, and marks the item **closed** here with the date.
3. Anything that changes public content is re-checked with the poultry-content-integrity scans and the relevant browser QA before it is published.

## Added after the build — engineering items for deployment and later rounds

Deployment settings (decide when the host is chosen; documented in `docs/deployment.md` and `.env.example`):

| Item | Why needed | Blocked/degraded meanwhile | Current fallback | Owner | Priority |
|---|---|---|---|---|---|
| Trusted client-IP header per host (`INQUIRY_IP_HEADER`) | Rate limiting keys on the client IP. Only the hosting proxy knows which header visitors cannot forge (e.g. `x-real-ip` behind nginx, `cf-connecting-ip` only behind Cloudflare). | With it unset in production, client headers are not trusted and a global fail-safe cap applies (30 inquiries / 10 min across all visitors), so heavy legitimate traffic could be throttled. | Implemented: pinned header when set, otherwise the global cap and one warning in the log (SEC-01, unit-tested). | IT / hosting | High (at deployment) |
| Shared rate-limit store for inquiries (Redis/DB) | The limiter is in-memory per process (5 / 10 min and 20 / 24 h per hashed IP). Multi-instance or serverless hosting needs a shared store behind the `RateLimitStore` interface (`src/lib/inquiries/rate-limit.ts`). | Nothing on a single Node instance; limits become per-instance on scaled hosting. | In-memory store (documented). | IT / hosting | High (at deployment) |
| `INTERNAL_SITE_ORIGIN` (optional) | The proxy asks the public API whether a product/article slug exists, so missing slugs get a server-rendered 404 (CI-03). A loopback origin keeps that check on the machine. | Without it the check uses `SITE_URL` (works, one extra hop through the public address); the request's Host header is never used (SSRF). If the check fails, the page still returns 404, rendered in the browser. | Request origin. | IT / hosting | Medium |
| Commissioned dawn/sunrise farm photograph | The About hero uses a daylight aerial (licensed stock) with a monochrome→colour treatment to evoke dawn. | None functionally. | `farmExterior` stock image. | Client brand | Medium |

Deferred findings from the QA rounds (all P2/P3, none blocks launch; details in `docs/test-report.md` § Defect log):

| ID | Sev | Item | Why deferred / what it needs |
|---|---|---|---|
| PERF-2 | P2 | zod (≈ 97 KB transferred) ships in the client bundle of every page with an inquiry form | Needs `zod/mini` or a server-only validation split: a refactor of the shared form schema, best done with the form owner. |
| — | P2 | Mobile LCP above the 2.5 s lab budget on key pages (simulated 4× CPU) | The time is render delay from main-thread work, not image loading; next steps are in `docs/performance-report.md`. |
| SEC-06 | P3 | CSP allows `'unsafe-inline'` scripts (no nonce/hash) | A nonce-based CSP forces dynamic rendering of every page; decide together with hosting/CDN caching. |
| SEC-07 | P3 | Staff login lockout reveals whether an account exists and lets anyone lock out a known address | Payload default behaviour; options are a generic error plus IP-based throttling at the proxy/WAF, or SSO/MFA (OI-11). |
| SEC-10 | P3 | `Critical-CH`/`Accept-CH` headers added by `withPayload` cost an extra round trip on first visits in Chromium | Upstream (Payload) behaviour; strip at the proxy or CDN once the host is known. |
| PERF-3 | P3 | GSAP ScrollTrigger keeps a ~60 Hz `requestAnimationFrame` keep-alive on every page, even under reduced motion | Register ScrollTrigger lazily, only when motion is on and the page has scroll scenes. |
| VQA-07 | P3 | Some display headings still end on a single word at 320–430 px | Copy/typography polish; best done after the licensed Thmanyah font (OI-01) changes the line breaks. |
| VQA-12 | P3 | Vermilion share on inner pages (0.3–2.3 % of pixels) is far below the brand guideline's 15 % | Brand / art-direction decision (OI-19), not a defect. |
| VQA-13 | P3 | A small licensed photo library is reused across pages | Needs commissioned or approved photography (OI-08). |
| — | — | nodemailer 9.1.1 (via `@payloadcms/email-nodemailer`) has address-parser advisories fixed only in 10.x | Not reachable here: mail is sent only when SMTP is configured, to the configured inbox, and contains no visitor input. Upgrade when Payload's adapter supports nodemailer 10. |
