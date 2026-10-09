# Open items — human approvals & missing information

The queue of decisions, assets, facts and credentials that only people (client, legal, brand, IT) can provide — spec §19.
Development continues without them (spec §19: "do not block unnecessarily"): each item has a working, honest fallback, and nothing unapproved is published.

_Last updated: 2026-10-09 (PM / technical-architect subagent). Maintained by the Orchestrator. All items raised 2026-10-09 and currently **open**._

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
| OI-07 | Confirm feed / supplement lines and the scope of "~150" | client | High | Category copy depth, catalogue coverage |
| OI-08 | Commissioned / approved photography (current: licensed stock) [O11] | client / brand | High | Authenticity of imagery |
| OI-09 | Confirm the 5-step commercial process and any service claims [O12] | client | High | "How we work" copy, Scene 6 wording |
| OI-10 | Legal / compliance sign-off: veterinary copy, label downloads, privacy policy, consent, retention | legal | Critical | Public launch, label PDFs, privacy page |
| OI-11 | CMS ownership: production admin owner, approvers, sales users | client | High | Production accounts and approval workflow |
| OI-12 | PostgreSQL (staging/production) + object storage credentials; PostgreSQL verification environment | IT / client | Critical | Production DB migrations, media storage, deployment |
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
- **Questions:** which feed and feed-supplement lines are offered (supply/distribution — is any of it own manufacturing?); is "~150" still accurate and still medicines + vaccines only; should the online catalogue list every item or a selection?
- **Blocked / degraded meanwhile:** feed and supplement pages stay high-level (no formulas, brands or claims).
- **Current fallback:** distributor wording (نوفر / نوزع / نعمل على إتاحة) and the metric statement verbatim.
- **Owner / priority:** client · High.

### OI-08 — Commissioned / approved photography
- **Why needed:** spec §3.6 and PDF p.14 call for authentic, licensed or commissioned documentary photography of real operations.
- **Current state:** licensed stock poultry photography — sources and licences in `docs/image-provenance.md`.
- **Blocked / degraded meanwhile:** imagery is credible and segment-correct but not Alshorouk's own farms, team or operations; no testimonial or partner-logo section (spec §5 Scene 9).
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
- **Why needed:** production uses PostgreSQL (`postgres://` `DATABASE_URL`, schema push disabled, migrations in `src/migrations/postgres`) and S3-compatible storage for media. This environment has no PostgreSQL server and no Docker, so Postgres migrations cannot be generated or verified here.
- **What we need:** PostgreSQL connection details for staging and production (or permission to use a temporary approved instance / install PostgreSQL locally), an S3-compatible bucket with region/endpoint and access keys, and a backup policy.
- **Blocked meanwhile:** P3-10 (Postgres migrations), P8-06 (deployment); quality-gate G8.4.
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
