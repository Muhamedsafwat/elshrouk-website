# ALSHOROUK — COMPLETE WEBSITE MASTER BUILD SPECIFICATION

**Version:** 1.0 | **Date:** 09 October 2026 | **Status:** Execution-ready master brief  
**Primary executor:** Claude, working inside / in coordination with Google Antigravity  
**Required source of brand truth:** `Alshorouk_Brand_Guidelines.pdf` (21-page supplied PDF)  
**Business:** Alshorouk / الشروق — Egyptian B2B supplier/distributor serving the **poultry sector only**.

> **PRIMARY EXECUTION DIRECTIVE — READ THIS FIRST:** Build an exceptional, genuine, fully implemented, visually distinctive, conversion-oriented, bilingual-capable, production-quality website. This document is a binding project specification, not inspiration-only text. Plan, design, implement, populate with approved content, test in a real browser, iterate visually, and deliver a working application. Do **not** stop at a wireframe, moodboard, isolated hero section, landing-page mockup, design description, or code skeleton. Do not claim completion if routes, mobile layouts, forms, product CMS, critical animations, or QA are missing. Where business inputs or credentials are unavailable, implement the real integration boundary and record a precise, honest blocker; do not fabricate content or pretend an external action succeeded.

---

## 0. MISSION, DEFINITION OF DONE, AND PRIORITY

### 0.1 Desired outcome
Create a sophisticated **corporate B2B poultry-industry website** that feels as polished and art-directed as a top contemporary creative/technology agency site, while retaining the credibility expected from a professional agricultural/veterinary supplier. The experience must be unmistakably **Alshorouk**, not an agricultural template with orange buttons. Deliver striking but relevant animation, an unusually strong home-page narrative, an easy-to-use product browsing/request system, realistic industry imagery, and frictionless conversion on Arabic desktop and mobile.

The website must communicate within the first screen:
1. **Who:** الشروق / Alshorouk.
2. **Who for:** Poultry farms / production operations — **broilers, layers, and breeders**.
3. **What:** Poultry feed, feed supplements, and veterinary supply, including medicines and vaccines, **as a distributor/supplier, not an unverified manufacturer**.
4. **Proof:** Approximately **300** regularly served poultry farms, approximately **15 million birds** within the production capacity of farms served, approximately **150** distributed product items **across veterinary medicines and vaccines**.
5. **Next action:** Request products / contact the sales team / discuss a poultry farm's needs.

### 0.2 Non-negotiable acceptance conditions
- Actual runnable application with all planned routes, not a static screenshot.
- High-quality visual design and purposeful animation on **all major pages**, not only the hero.
- **Arabic-first RTL** UX. Architect for English LTR; implement English content/route for approved content or visibly label editorial translation as a pre-launch review requirement. Never silently replace Arabic with English-only UI.
- Responsive: 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920 widths; touch-first navigation and no horizontal overflow.
- Exact authorized Alshorouk logo assets and palette from the PDF; proper padding, version, and contrast.
- No cows, sheep, goats, horses, dairy, generic livestock or pet positioning anywhere in public-facing content. **Chicken/poultry only**, including image alt text, CMS sample data, iconography, SEO, and decorative 3D elements.
- Animated metrics must represent the three supplied qualified numbers accurately and accessibly.
- Product catalogue and detail pages must support real data, filtering, searching, and inquiry actions; no fictitious product inventory published.
- Contact and quotation/inquiry forms are validated, rate-limited, safely persisted, and lead to an actual usable inbox or CMS record. No fake toast saying a message was sent when not persisted.
- Fast enough on representative mid-range mobile hardware; motion gracefully scales down on slow/reduced-motion devices.
- Explicit security, SEO, accessibility, analytics, automated tests, screenshots, documentation, and deploy instructions.
- Supply a checklist, evidence artifacts, and a truthful final report of completed versus blocked items.

### 0.3 Priority hierarchy (resolve all conflicts in this order)
1. **User's latest explicit instructions**: company/site strictly poultry-focused, livestock pictures in guidelines are outdated; user-supplied business metrics and service scope.
2. **Authorized brand assets and unchanged official logo**: `Alshorouk_Brand_Guidelines.pdf` establishes visual standards; changing business scope does **not** grant permission to alter the logo/descriptor on the logo.
3. **Brand strategy from PDF** where consistent with poultry-only positioning.
4. Verified business data supplied later by stakeholder / approved CMS data.
5. This document's proposed UX, copy, architecture, and motion.
6. External reference sites are inspiration for craft, **never source content to duplicate**.

**Known tension to handle intelligently:** The PDF describes a general veterinary medicines/vaccines distributor and explicitly says the old positioning is not poultry-only (PDF brand strategy, pages 4–5); the **current client correction takes precedence for audience, imagery and service pages**. The original Arabic logo subtitle `لتوزيع الأدوية واللقاحات البيطرية` is part of the logo and **must remain intact** unless the client supplies an authorized, officially revised logo. The client also describes poultry feed and feed supplements: present these as business lines while avoiding unverified ownership/manufacturing claims. The supplied 150-product number concerns medicines/vaccines; **do not claim 150 feeds or supplements**.

---

## 1. BUSINESS TRUTHS, CLAIMS POLICY, AND CONTENT GOVERNANCE

### 1.1 Approved data table

| Field | Approved statement | Implementation rule |
|---|---|---|
| Brand name | الشروق / Alshorouk | Keep Arabic logo artwork unchanged |
| Sector | Poultry only | No other livestock |
| Farm relationships | **حوالي 300 مزرعة دواجن** served on an ongoing basis | Say approximate / حوالي, do not present as mathematically exact |
| Production types | Broilers / تسمين; Layers / بياض; Breeders / أمهات | Mention all three, no additional subsectors presumed |
| Birds / farm capacity | **حوالي 15 مليون طائر** within farms served | Do not claim annual output, company-owned birds, birds vaccinated, or birds sold |
| Product portfolio | **حوالي 150 منتجًا** distributed across **medicines and vaccines** | Do not mislabel as 150 feed products; do not invent catalogue items |
| Commercial activities | Poultry feeds and feed supplements; poultry veterinary medicines/vaccines distribution | Present as supply/distribution until manufacturing is explicitly verified |
| Original brand descriptor | `لتوزيع الأدوية واللقاحات البيطرية` | Preserve inside the existing logo |
| Quality values | Integrity, precision, reliability, expertise | Use as positioning, avoid unsupported certifications |
| Contact details | Not supplied | Must remain an approval gate; never invent phone, email, HQ or coordinates |

### 1.2 Strict no-fabrication policy
**Never fabricate:** company year of founding, factory ownership, warehouses, branches, certifications (ISO, GMP, GSP etc.), cold-chain capacity or monitoring technology, logistics footprint, authorized agencies, importing licenses, customer logos or testimonials, exact delivery time, services provided by staff, vet count, brand partners, supplier logos, registered drug labels, product brands, ingredient lists, prices, stock, address, map position, numbers of deliveries, success rates, sector results, awards. The brand book describes aspirations and design examples; they are **not** proof of real certifications or operational SLAs. Always use approval flags where needed.

### 1.3 Mandatory content-status system
Any content object has editorial status: `approved`, `review_required`, `placeholder_internal`, or `hidden`. Only `approved` content can be published. Build a seeded internal demo for development (with a clearly isolated fixture environment), but NEVER show believable fake medicinal products or testimonials as real inventory in production. Public catalogue empty state must be elegant and contain a working `اطلب قائمة المنتجات` CTA. Provide `content/approval-register.md` tracking claim, evidence, owner, and approval state.

### 1.4 Regulated-category safety
- Present product information as a **B2B commercial catalog**, not individualized treatment recommendations or dosing instructions.
- Never auto-generate dosage, vaccination schedules, withdrawal periods, medicine compatibility, disease efficacy, or feed formulas.
- Product detail pages may show only **manufacturer-approved and locally appropriate label information** entered by an authorized editor.
- Where appropriate, include: `تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.`
- No consumer checkout/prescription purchasing flow unless future legal/commercial requirements are validated. Default to quote/request.
- Never imply all 150 products are stored in our system unless data are supplied and entered.

---

## 2. VISUAL REFERENCE RESEARCH — LEARN THE CRAFT, DO NOT CLONE

Study these sites on desktop AND mobile inside Antigravity's browser, collecting section breakdowns, interaction notes, and screenshots **for internal reference only**:

1. `https://www.byteforceinc.com/` — high-impact opening statement, full-page storytelling rhythm, structured service narrative, trust/proof, repeated elegant CTAs, animated counter/portfolio-inspired pacing. **Transfer:** drama, hierarchy, distinctive transitions. **Do not transfer:** its marketing language, black/red identity, unrelated client logos, or structure verbatim.
2. `https://www.bsystemseg.com/` — technical/motion-driven hero, structured multi-stage narrative, interactive systems feel, strong composition, premium layouts. **Transfer:** carefully directed interactive diagrams and scroll choreography. **Do not transfer:** software visuals, systems copy, icons, or code.
3. `https://mindooco.com/en` — typographic confidence, editorial whitespace, crisp modular grids, thoughtful section sequence, positioning story. **Transfer:** readability, modularity, narrative clarity. **Do not transfer:** business-consulting positioning.
4. `https://www.imtyaze.com/` — Arabic UX, RTL navigation and copy hierarchy, product storytelling through believable UI structures, layered CTA flows, practical mobile readability. **Transfer:** Arabic craft and clear service explanation. **Do not transfer:** education imagery and interfaces.

**Research output required:** `docs/reference-audit.md` containing a side-by-side analysis of what is admirable, what is inappropriate for agriculture, which pattern is adopted/reinterpreted, and screenshots or URLs when permitted. Follow applicable copyright constraints. Reference the experience, **never scrape/reuse images, icons, video or code without permission**.

**Art direction in one sentence:** *The clarity of a scientific distribution partner, the energy of a modern technology company, and the optimism of sunrise — built around the poultry production ecosystem.*

---

## 3. BRAND SYSTEM — TRANSLATE THE PDF INTO PRODUCTION TOKENS

### 3.1 PDF audit checklist and source pages
Read every page of `Alshorouk_Brand_Guidelines.pdf`, particularly:
- PDF pages **1, 3–6**: logo/brand story, mission, values, voice.
- PDF pages **8–10**: logo configuration, safety zone and prohibited effects.
- PDF page **11**: exact colors and usage ratio.
- PDF page **12**: typography.
- PDF page **13**: 'Sunrise System' visual language.
- PDF page **14**: photography direction.
- PDF page **15**: icons.
- PDF page **21**: website/digital identity direction.

**Important:** The PDF contains old mixed-livestock photo examples, including storefront imagery. **Do not treat these as approved subject matter for this poultry-only site**. Do not put non-poultry silhouettes into the design.

### 3.2 Canonical colors

```css
:root {
  --brand-vermilion: #FE3300; /* signal / links / CTAs */
  --brand-amber: #FEB821;      /* occasional highlight, max ~5% usage */
  --brand-black: #000000;      /* copy / high-contrast backgrounds */
  --brand-white: #FFFFFF;      /* primary canvas */
  /* Derived neutral UI helpers, verify against identity */
  --neutral-050: #FAFAF9;
  --neutral-100: #F4F4F2;
  --neutral-200: #E5E5E3;
  --neutral-500: #707070;
  --neutral-900: #171717;
}
```

Global color proportions: white about **55%**, black **25%**, vermilion **15%**, amber **5% or less** (guideline, not mathematical pixel-count for each viewport). No full-page gaudy orange, no excessive gradients, no generic green/agri palette. Use black-on-amber for text; **white-on-vermilion has insufficient regular-body contrast according to the book** and is reserved for large headings only unless contrast has been independently verified. Accent gradients vermilion→amber only on major abstract sunrise shapes/curves, never within text or the original logo.

### 3.3 Typography
- Arabic master font: **Thmanyah** (`خط ثمانية`) as the brand book specifies. It is licensed; **do not download or distribute an unauthorized font file**. Check user's supplied brand package/authorized workspace font assets; request official licensed WOFF2 if absent. Provide a robust temporary local/system Arabic fallback for staging, documented as a typography blocker.
- Latin typeface: **Montserrat**, using permitted package/font source and local optimization.
- No arbitrary third display font, decorative Arabic scripts, or random weights.
- Arabic proper RTL; English LTR; dates/numeric groups and phone numbers handled with appropriate bidi isolation.
- Headlines mobile responsive `clamp(2.3rem, 7vw, 5.8rem)` *tuned for the selected font*; hero optionally larger on desktop with short lines; body 16–18px, leading 1.6–1.75 Arabic. Long editorial text max 60–75 characters equivalent / suitable `ch` measure.
- Distinct weight system: bold headlines, medium subtitles, regular body. Avoid unjustified giant uppercase English; preserve accessible line breaks.

### 3.4 Logo — immutable official asset
Logo configuration: rooster head, Arabic wordmark, swooping curve and descriptor as **one lockup**. It is NOT permission to recreate the logo in SVG by tracing an AI approximation or redrawing the chicken. Use a **provided official SVG/PNG** where available. If logo exists only embedded inside PDF: attempt a clean extraction of **true original vector artwork** using a PDF/vector extraction workflow with visual QA and source provenance; if extraction cannot be proved faithful, request the original approved logo files. Do not extract a low-quality screenshot and pass it off as a production logo.

Logo clear space: **15% of logo width** on all sides. Minimum full logo: **110 px digital**; brand mark without descriptor **72 px** only if that official approved variation exists. Do not rotate, stretch, recolor, apply effects, transparency, gradient fills, shadows or overlays. Use full-colour original on white; original white version on black or suitable dark content if supplied; no full-colour logo on vermilion/amber. Header desktop width 125–155px if legible and clear zone allows; mobile 112–128px; verify visually. Add correct favicon from approved logo emblem only, not invented art.

### 3.5 Brand-native visual language (critical differentiation)
Use deliberate restrained combinations from the PDF's **Sunrise System**:
- **Signature Curve:** 1–3 curved parallel lines, cropped from edge. Interactive animated path in hero or between chapters; only one curve asset group in a layout. Avoid treating it as random orange swooshes.
- **Distribution Flow:** straight segments, 45-degree turns, round nodes, a single amber destination node. Repurpose as tasteful, technical visualization of verified supplier-to-poultry-farm network and inventory flow; not a false geographic map.
- **Crest Pattern:** three overlapping circles inspired by rooster crest at 10–20% opacity/tone on tone; never behind text.
- **Veterinary Grid:** 4×4 modular grid with disciplined vermilion/black and at most one amber cell. Adapt for stat and product chapter transitions.
- Never combine all four motifs in one panel; one prominent system per major section.

### 3.6 Photography / art asset requirements
- Hero: licensed/commissioned **authentic poultry farm** imagery or premium, documentary video of healthy chickens in a real commercial setting, with humane, natural portrayal.
- Gallery diversity: broilers, layers, breeders (correct visual context); poultry producer handling farm operations, veterinarian observing poultry, safe handling of approved veterinary packs without legible fake labels, responsible logistics / storage / transport IF proven applicable.
- Warm daylight, clean contrast, restrained blacks, crisp subject, subtle camera movement; no fake oversized chicken on glowing pedestal; no smiling staged handshakes; no cartoon chickens, no generic AI-rendered fantasy farm.
- If generated images used: obtain licensing/use approval; depict biologically plausible chickens, realistic farm safety and biosecurity, no faux brands, no inaccurate veterinary practices. Record image provenance.
- Prefer source AVIF/WebP, responsive `srcset`, art-directed crops and focal points. Images must load; no hotlink dependence on volatile stock URLs. Keep images appropriate to the type of operation; a broiler is not an egg-laying mascot.

---

## 4. BRAND NARRATIVE, SITE INFORMATION ARCHITECTURE AND CTAs

### 4.1 Positioning (proposed, editorially editable)
**Corporate idea (not an official logo tagline):** `شريكك في منظومة إنتاج الدواجن`  
Alternative descriptive line: `حلول إمداد متخصصة لمزارع الدواجن`.

These lines are website copy proposals only. Do **not** rewrite or add them within the existing logo; send high-visibility marketing headlines for approval before publication.

**Messaging pillars:**
1. Focused knowledge of poultry farm requirements.
2. Access to a broad and relevant set of distribution/supply categories, subject to approved product data.
3. Reliable long-term relationships (described qualitatively; do not promise specific unverified SLAs).
4. Proven scale through 300 farms / 15m birds capacity / 150 veterinary product items.
5. Human support and clear ordering discussions.

### 4.2 Primary navigation structure
Arabic desktop: `الرئيسية` · `عن الشروق` · `حلول الدواجن` · `المنتجات` · `كيف نعمل` · `المعرفة` · `تواصل معنا` · language switcher `EN`. Persistent prominent CTA: `اطلب منتجاتك` or `تواصل مع الفريق`. Consider simplifying top nav to 5 labels with dropdowns only after testing.

Arabic-first canonical routes (use clean localized route architecture; examples below are conceptual, actual route design must be consistent):

| Route | Page | Primary action |
|---|---|---|
| `/ar` | Homepage / الرئيسية | `تواصل مع فريق الشروق` |
| `/ar/about` | About / عن الشروق | `ابدأ شراكة مع الشروق` |
| `/ar/poultry-solutions` | Poultry solutions / حلول الدواجن | `ناقش احتياج مزرعتك` |
| `/ar/solutions/broilers` | Broilers / تسمين | `اطلب استشارة منتجات` |
| `/ar/solutions/layers` | Layers / بياض | `تواصل مع الفريق` |
| `/ar/solutions/breeders` | Breeders / أمهات | `استفسر عن الحلول` |
| `/ar/products` | Product catalogue / المنتجات | Filter + inquire |
| `/ar/products/[slug]` | Product detail, only approved records | `استفسر عن المنتج` |
| `/ar/how-we-work` | Supply/service process / كيف نعمل | `ابدأ طلبك` |
| `/ar/knowledge` | Knowledge/resources / المعرفة | Browse articles |
| `/ar/knowledge/[slug]` | Article page | Share / related content |
| `/ar/contact` | Contact / تواصل معنا | Submit a real inquiry |
| `/ar/partner-with-us` | Partnership / كن شريكًا | Business inquiry |
| `/ar/privacy` | Privacy policy | Transparent use of submitted data |
| `/en/...` | Equivalent international English architecture | Language switching |
| `not-found` | Designed 404 page | Navigate back home |

No irrelevant jobs page, ecommerce checkout, clinic/pet content, cow/dairy, fake investor page or unsupported global branches. Navigation, footer links, breadcrumbs, and language toggle must function for every route. If a full English translation is unapproved, complete it in staging and block publish until reviewed rather than running a half-translated public site.

### 4.3 Conversion architecture
Lead goals:
- **Product request:** specify category, optional product selection, requested quantity where meaningful, farm production type, contact and message.
- **Farm inquiry:** farm type, rough bird capacity (optional), name, phone, governorate (optional), challenge expressed as free text without medical treatment promises.
- **Partnership/supplier inquiry:** company and role, product category, contact and inquiry.
- Contact via verified phone / WhatsApp only AFTER official number confirmation. Hide unknown shortcuts rather than create dead links.

CTAs should be contextual and clear, never permanently pulsating or competing for attention. On mobile, a minimal sticky CTA may appear after hero scroll but must not obscure content or create duplicate focus targets.

---

## 5. HOMEPAGE — COMPLETE SCENE-BY-SCENE EXPERIENCE

**Recommended total structure:** 11 carefully sequenced cinematic chapters. Each should feel unique yet visually consistent. Prefer progressive reveal and purposeful section transitions to a long parade of identical cards.

### Scene 0: Startup / loading behavior
- No artificial 5-second loader or forced introduction.
- Real content appears immediately; lightweight branded line/rooster-outline loading state only if real asset or critical hero media is loading.
- No whole-page animation blocking clicks. Set hero LCP asset priority.

### Scene 1: Hero — “Sunrise / poultry production network”
**Layout:** full viewport-height **max(680px, 100svh)** desktop, slightly reduced on mobile; content lower/center-right in Arabic with clear safe margins. White/near-white editorial canvas and a cinematic image/video region; alternate dark split screen is acceptable if brand proportions preserved globally. Logo/nav crisp.

**Headline proposal (Arabic):**
> `من قلب صناعة الدواجن،`  
> `نساند كل مرحلة من الإنتاج.`

**Subhead proposal:**
> `الشروق شريك متخصص لمزارع التسمين والبياض والأمهات، يوفر حلول الإمداد من الأعلاف ومكملاتها إلى الأدوية واللقاحات البيطرية.`

**CTAs:** `استكشف حلولنا` (scroll to solutions) and `تواصل معنا` (contact route).

**Art direction:** real commercial chicken farm wide-shot; luminous sunrise-colored edge or dawn light only if photorealistic, with official curved arcs animated very subtly. Add a precise abstract supply/distribution line drifting behind/in separate column, **not** an improbable map of 300 nodes. Optional small eyebrow `الشروق | منظومة متكاملة لقطاع الدواجن` (requires copy approval). A tasteful animated mask reveals the farm image, then the headline, CTA, micro-stat, and scroll cue.

**Motion timeline (desktop):**
- `0–0.4s` immediate structural paint and image visibility.
- `0.15–0.85s` sunrise curve line-draw / abstract horizon mask. Animate only transforms/clip-path that performs well.
- `0.35–1.2s` headline line reveals with stagger about `80–120ms` between short lines.
- `0.65–1.4s` supporting copy and CTA translate 12–20px + fade.
- Idle: extremely subtle non-continuous line/particle pulse, never heavy infinite motion.
- `scroll` image slight parallax `max 24–48px` desktop; disable/limit mobile and prefers-reduced-motion.

Do not build an oversized 3D spinning rooster or recreate logo as sculpture. The hero must make the company immediately recognizable as poultry-specific.

### Scene 2: Trust proof — 300 / 15m / 150
**Layout:** dramatic typographic 3-column proof band with a clear short sentence above. Desktop white/black alternating sections; mobile single-column or stacked editorial cards, not microscopic numbers.

**Exactly as displayed:**
- `حوالي 300` — `مزرعة دواجن نتعامل معها بشكل مستمر`.
- `حوالي 15 مليون` — `طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها`.
- `حوالي 150` — `منتجًا نوزعه من الأدوية واللقاحات البيطرية`.

**Motion:** count-up only when section enters; duration <=1.3 seconds, once per page view; use locale-aware digit formatting and make qualifiers (`حوالي`) always visible; no counting from 0 that implies precise measurements. For screen readers, include a stable full label; use accessible text not aria-live spam. Each proof item has tiny distribution-flow underline and subtle stagger. Metric footnote: `الأرقام تقريبية وتعكس نطاق تعاملاتنا الحالي.` if approved.

### Scene 3: Statement / visual narrative transition
A single confident, memorable typography chapter to reset rhythm. Example:
> `كل مزرعة لها احتياج مختلف.`  
> `وكل مرحلة تستحق دعمًا متخصصًا.`

Background black with large off-center documentary poultry image masked into vertical panel, or pure white with orange curve. Very subtle scroll-linked headline shift and horizon line transition. **Avoid stock motivational writing and claims of guaranteed outcomes.**

### Scene 4: “Three poultry farm types” — interactive vertical storytelling
**Three major chapters** as a high-end interactive editorial section:
1. **التسمين | Broilers** — supply coordination for poultry meat production operations.
2. **البياض | Layers** — products relevant to egg production operations.
3. **الأمهات | Breeders** — products for breeder flock operations.

**Desktop interaction:** sticky left visual area 48–55% viewport with three genuine poultry photos; right side vertically scrolls through detailed Arabic copy and feature clusters. Crossfade/clip visual on active item, each with a distinct registered number 01/02/03. An accessible tab-like alternate is acceptable if sticky storytelling hurts usability. Mobile: non-sticky stacked chapters with simple image reveal and direct CTA.

Do not present business outcomes (weight gain, egg production, hatchability) as guarantees; no efficacy claims. Each card CTA links to its own route.

### Scene 5: Product universe — four clear commercial pillars
This is not a 150-product visual dump. Show a premium interactive 2×2 editorial product grid / asymmetrical layout with 4 categories:

A. **أعلاف الدواجن** — poultry feed offerings subject to verified catalog.
B. **مكملات الأعلاف** — poultry feed supplements, under approved label descriptions.
C. **الأدوية البيطرية** — veterinary medicines for poultry.
D. **اللقاحات البيطرية** — veterinary vaccines for poultry.

**Design:** oversized elegant category index (01–04), documentary close-ups/approved packaging where available, category color accents respecting identity: neutral predominantly; vermilion for primary brand signal; amber sparingly. Use a category-aware filter CTA. Hover: gentle photo scale 1.03–1.05; focus-visible equivalent; mobile tap no hover-only detail.

**Copy rule:** avoid suggesting the company manufactures these; use `نوفر / نوزع / نعمل على إتاحة` after factual approval. For unknown specific feed categories, keep descriptions high-level rather than fabricate formulas.

### Scene 6: Distribution journey — interactive network / process
**Concept:** `من احتياج المزرعة إلى متابعة الطلب` with an architectural but credible visual representation of the commercial service journey.

5 conceptual steps (must be confirmed against actual operations; if not confirmed mark review-required and phrase as a suggested process):
1. `فهم احتياج المزرعة` — discuss poultry farm, flock segment, product requirement.
2. `تحديد المنتجات المناسبة` — share available approved catalogue / qualified information.
3. `تأكيد الطلب والتوافر` — commercial confirmation before any SLA.
4. `تنسيق التوريد` — plan delivery per agreed terms, no false 24h promise.
5. `استمرار التواصل` — commercial follow-up / ongoing relationship.

**Motion:** distribution line draws node by node as user scrolls; amber destination marker lights once; step cards appear in sync. Line-drawing must not obscure text or force users to scroll through animation. Map-like abstract distribution flow is NOT a real geo network. On reduced motion show final line and numbered steps statically.

### Scene 7: What makes Alshorouk different — values
Set four principles from official brand strategy, translated into credible B2B language:
- `الأمانة` — clarity and authenticity.
- `الدقة` — product details / order precision.
- `الالتزام` — sustained professional relationships, WITHOUT promising unverified delivery time.
- `الخبرة` — specialized product knowledge and sector context, not fabricated staff credentials.

Design as minimal elegant modular **4×4 Veterinary Grid** animation: black / vermilion cell / white, with one amber tile. No 3D gimmick; hover reveals thoughtful one-sentence description. Mobile accordion/cards.

### Scene 8: Selected product preview — real CMS-backed
Display 4–6 **approved** published products only, if content exists. Useful properties: product image, approved brand, type, poultry segment, approved pack size, downloadable approved label, `استفسر عن المنتج`. Zero approved items: replace gallery with a polished product-category intro and `اطلب القائمة الحالية`; absolutely **do not generate fictitious product cards just to fill the layout**. Build functional filtering link to full `/products`.

Motion: restrained stagger reveal; subtle thumbnail zoom and background border animation.

### Scene 9: Long-term partner proof without fake testimonials
A strong abstract/commercial documentary section. Reuse **real stats** in a new explanatory visual narrative, NOT another stat-counter clone. Optionally show authenticated farm/partner logos or real testimonials when provided. Until then render a credible section showing serving **تسمين / بياض / أمهات** with documentary photos and no invented people/quotes. If approved quotes are unavailable, omit a testimonial carousel entirely.

### Scene 10: FAQ / knowledge teaser
Useful practical Q&A, limited to business/process (not medical recommendations):
- `هل تتعامل الشروق مع مزارع التسمين والبياض والأمهات؟` — yes, confirmed.
- `كيف أستفسر عن توافر منتج؟` — through products or contact request.
- `هل أقدر أطلب قائمة المنتجات الحالية؟` — yes through contact CTA, once workflow exists.
- `هل الأسعار والتوافر ثابتة؟` — availability/pricing requires direct confirmation; no fixed online stock claims.

Accessible accordion with sensible schema only if content is publicly visible and eligibility is met; four to six items max. Add 2–3 **real approved** articles if supplied, otherwise show useful subject-level educational sections clearly marked for editorial review or hide.

### Scene 11: Final CTA / closing scene
**Distinctive close:** luxurious high-contrast black field with sunrise curve emerging from lower-right, huge Arabic headline:
> `مزرعتك تستحق شريكًا يعرف احتياجاتها.`

Subhead: `تواصل مع فريق الشروق لمناقشة احتياجات مزرعتك من المنتجات والحلول المتاحة.`

CTA: `ابدأ التواصل` / secondary: `تصفح المنتجات`.

Real footer beneath: official logo variation, nav, categories, verified contact only, English toggle, privacy, copyright current year. No invented HQ address, telephone, email, social icon links.

### Homepage mobile art-direction (not just stacking)
- Recompose hero with chicken clearly visible, readable text overlay or separated copy; NOT desktop center-crop hiding subject.
- Section titles 2–4 lines maximum where practicable; avoid orphan single words.
- Swap sticky layouts to native scroll, collapse excessive network visualization, keep visual hierarchy.
- Carousel optional; never enforce horizontal swipe for crucial content or hide CTA.
- No autoplay audio. Hero video muted, playsInline, poster, disabled on save-data/reduced-motion.
- Target meaningful first-paint and functional nav before animation finishes.

---

## 6. INTERNAL PAGE REQUIREMENTS — COMPLETE AND DISTINCT

### 6.1 About / من نحن
**Hero:** striking monochrome/dawn poultry image + official logo + `نعرف قيمة كل يوم في دورة الإنتاج.` Proposed copy, approval needed. 
**Sections:** Who Alshorouk is / poultry-only mission; timeline/story **without fabricated founding dates**; large stats with precise qualifiers; values / vision/mission adapted to poultry, original brand document acknowledged internally; production segments served; brand heritage / rooster mark (meaning of Alshorouk/sunrise); natural CTA. 
**Animation:** elegant chapter marker and offset reveal; avoid repeating home animation exactly.

### 6.2 Poultry solutions overview
Hero `حلول تخدم مراحل إنتاج الدواجن المختلفة` + 3 giant cinematic chapters for broilers/layers/breeders; short, credible context; cross-category access (feed, supplement, medication, vaccine) via data-driven taxonomy; inquiry CTA per segment; no generic agronomy content for other species. Strong comparison/navigation not medical advice. Interactive progress UI with accessible list fallback.

### 6.3 Segment detail templates (Broilers / Layers / Breeders)
Each page must contain:
- Unique top hero with relevant photo, sector label and tailored typography.
- Short overview of **the operation's supply needs**, in safe descriptive terms (never disease protocol/technical dosage).
- Common **product categories**, NOT fictitious SKUs, dynamically from approved catalog.
- `كيف نساعدك في طلب المنتجات` flow.
- Relevant published resources if available.
- Inquiry form prefilled with `productionType` = current segment.
- Breadcrumbs, next segment CTA, metadata and schema without fake claims.

### 6.4 Product catalogue
This is a **real data experience**, NOT fake e-commerce.

**Functional requirements:**
- Server-driven pagination (or accessible load-more) with stable URLs.
- Search by Arabic and English approved titles, manufacturer and verified SKUs; debounced and keyboard accessible. Normalization for Arabic forms where suitable; no accidental overaggressive matching of medicine names.
- Facets: category (feed / feed supplements / medicines / vaccines), poultry segment (broiler/layer/breeder), verified manufacturer/brand only when provided, product form if data supports.
- URL query state (`?category=...&type=...&q=...&page=...`) shareable; reset filters; empty state; skeleton state; loading/error state.
- Image with fallback only to an **unbranded editorial category visual**, never a forged medicine pack.
- Cards with safe fields; product status and availability phrasing controlled by CMS.
- `استفسر عن المنتج` opens product-specific inquiry route/dialog with contextual product ID, not cart.
- No price or `in stock` assertions unless verified.
- Facets reflect only published approved records; show total actual number, not hardcoded 150.
- When catalog database is empty, show category browser plus functional inquiry form with explanatory message, not broken page.

### 6.5 Product detail
Schema only for approved entries: gallery, exact product label, category, manufacturer if verified, target species poultry, approved form/pack size, description, official technical label PDF download if legally approved, warnings as supplied, related products (approved), enquiry CTA. For veterinary products, include caution that treatment/use is under veterinarian guidance as locally applicable; **NO AI-generated treatment guidance**. Data should be schema-validated; invalid products 404, unpublished products never indexed.

### 6.6 How we work / كيف نعمل
Credible 4–5 step service process; interactive precision-flow line; discuss qualification / request / confirmation / supply coordination / follow-up **only if confirmed**. Since logistics capacity/SLA are not supplied, do not claim nationwide 24h shipping or owned cold-chain fleet. Include lead CTA and a small contact form.

### 6.7 Knowledge hub + article page
- Editorial categories: poultry farm business, feed supplements awareness, poultry veterinary product handling **subject to qualified professional review**, company news.
- Article grid; server-side route and metadata; authentic author/date only after approval; reading time derived from body; headings, content, linked sources where applicable; related content.
- Structured authoring as CMS rich-text blocks, image alt texts and reusable quote/callout sections.
- No uncited original veterinary medical advice; never write disease treatment as though endorsed.
- If no approved articles, no fabricated dates, a thoughtful hub empty state and contact CTA, or hide hub nav until approved.

### 6.8 Contact
Dedicated conversion-first page; as few fields as necessary, full Arabic labels. Sections: inquiry type selector (farm / product / partnership / general), name, phone, farm/business name optional, production type, governorate optional, product/category, message, explicit privacy consent, spam protection, success/error/validation. Verifiable contact links shown only when real. Map only when confirmed physical office address; no fake pinned location. Don't expose public database internals or PII.

### 6.9 Partnership
Explain what type of relationship: poultry product supply partnership / agency discussion; no claim of exclusivity or global distribution. Form stores lead kind and company details separately. Confirm no public partner logos unless authorized.

### 6.10 Utility pages
Custom on-brand 404 and error page; legal Privacy policy with details agreed to actual hosting/data flows (must be finalized by stakeholder); if cookie tracking is enabled implement appropriate informed consent. Sitemap.xml, robots.txt, image SEO, accessible loading and error UI.

---

## 7. DESIGN SYSTEM — PRODUCTION UI SPEC

### 7.1 Layout and sizing
- Desktop grid: 12 columns, width max ~1440–1560px, edge gutters clamp(24px, 4vw, 88px).
- Tablet 8 columns, mobile 4 columns. Cards not arbitrarily narrow. Negative space is an intentional brand element.
- Section vertical spacing: 120–180px premium desktop as content permits; mobile 64–104px. Large storytelling chapters may be 100svh but must not trap touch scroll.
- Spacing scale 4/8/12/16/20/24/32/40/48/64/80/96/128.
- Radius: usually 0–12px / crisp architectural edges; reserve pill for tags and controls where appropriate. Avoid generic SaaS glassmorphism, giant gradients, fake 3D bevels, purple glow.
- Buttons: solid black or vermilion accessible treatment, hover invert / understated sweep, keyboard outline 2–3px, comfortably >=44px touch height.
- Motion typography: Arabic line-height carefully tested so mask reveals don't clip diacritics, descenders or word shapes.

### 7.2 Components to implement
Global: `Header`, `MobileMenu`, `Logo`, `LocaleSwitcher`, `Footer`, `PrimaryCTA`, `Button`, `Badge`, `Breadcrumbs`, `SectionHeading`, `TextReveal`, `ImageReveal`, `ScrollProgress`, `SunriseCurve`, `DistributionFlow`, `MetricCounter`, `StatCard`, `FarmTypeScene`, `ProductCategoryCard`, `ProductCard`, `ProductFilters`, `ProductSearch`, `ProductInquiryDrawer`, `ContactForm`, `InquirySuccess`, `ContentApprovalGuard`, `FAQAccordion`, `NewsCard`, `CookieConsent`, `AccessibleDialog`, `Skeleton`, `EmptyState`, `ErrorState`, `ResponsiveMedia`, `ReducedMotionProvider`.

No ornamental component without purpose. Shared primitives must maintain a consistent visual language. Animation wrappers should not hide content while JS is unavailable.

### 7.3 Header / navigation interactions
- Desktop: transparent or white header over light hero; transition to readable elevated/sticky appearance after first section. Logo maintains legal clear space.
- Hide-on-scroll-down/reveal-on-scroll-up optional **only if** user testing shows no discoverability issues. Contact CTA always easily findable.
- Full-screen mobile menu: strong editorial navigation with animated line reveals; background brand black/white; close via Esc, backdrop and nav; trap focus; restore focus on dismissal; prevent document body scroll only while drawer open.
- Locale switcher preserves equivalent route and slug mapping if translation exists, else proper fallbacks, never 404.
- Nav active state and anchor scroll correctly offset sticky header.

### 7.4 Editorial writing standards
- Arabic natural Egyptian professional MSA tone: confident, direct, not inflated; B2B and agriculture knowledgeable.
- English polished, not stiff literal translation, consistent terminology.
- No exclamation overload or filler copy such as "world-leading", "revolutionary", "unmatched", "guaranteed profitability".
- CTA verbs action-oriented; nouns precise; `مزرعة` / `قطيع` used appropriately.
- All copy is editable in CMS; show draft vs approved status in project tracker.

---

## 8. ANIMATION DIRECTION — MOTION SYSTEM, NOT RANDOM EFFECTS

### 8.1 Motion philosophy
Animations should express **sunrise, flow, precision, reliable connectivity and scale**. The site should feel directed by a senior motion designer. A responsive and accessible site is more impressive than 60fps particle soup. The hero and 2–3 special scenes receive cinematic attention; ordinary reading sections receive restrained micro-interactions.

### 8.2 Approved technical animation stack
- **GSAP + ScrollTrigger** for major scroll-linked timelines, reveals, SVG path drawing, pinning when appropriate. Follow GSAP React context/revert cleanup practices.
- **Motion** (React animation library) **optionally** for localized component entrances/menu states; ensure GSAP and Motion never animate the same transform property on the same DOM node concurrently.
- **CSS transforms / opacity / custom properties** for trivial hover/focus; default native scrolling. **Lenis** only if tested with scroll triggers, pointer and accessibility, otherwise skip. No mandatory scroll hijacking.
- **Canvas/WebGL/Three.js** only if a specific scene delivers meaningful brand impact after first two phases and fits performance budget; it is optional, not a badge of quality. Provide static fallback.
- SVG paths and mask reveals often outperform 3D for this brand. Never load an enormous animation library bundle into all pages unnecessarily.

### 8.3 Motion token system

| Motion | Suggested values | Accessibility / performance |
|---|---|---|
| Small hover | 140–220ms ease-out | Also focus-visible |
| Component entrance | 450–700ms with 12–24px travel | No critical text invisible by default |
| Large image reveal | 700–1100ms | Clip/mask transform optimized |
| Headline stagger | 80–130ms per line | Text readable without JS |
| Metric counter | 900–1300ms | Static screen-reader text |
| Scroll-linked section | Scroll-triggered with realistic scrub and bounded transform | disable/present final state for reduced motion |
| Page transition | 180–350ms and subtle | navigation never blocked, preserve focus |
| Continuous hero embellishment | Very low amplitude; pause offscreen | no perpetual expensive rAF loop |

Suggested motion easing: `power2.out`, `power3.out`, custom cubic-bezier for brand-specific entrance. Apply stable animation frame to every key viewport in browser test. No inconsistent effects per page.

### 8.4 Six signature motion moments (mandatory)
1. **Sunrise Line Reveal:** viewport-safe path arc draws into hero, stops, then settles. Must track brand official curve shape, not invented logo imagery.
2. **Farm Network Stats:** 3 approximate metrics enter in a single controlled timeline; exact qualifiers persist.
3. **Segment Scene Transitions:** sticky media swaps between broiler/layer/breeder imagery with gentle clip/crossfade, connected to meaningful content; mobile natural flow.
4. **Distribution Node Journey:** abstract path animates 5 supply steps and end destination amber node, with scroll updates and readable focus targets.
5. **Product Pillar Reveal:** asymmetrical product category panels shift/reveal gently, eye drawn toward real catalog CTA.
6. **Closing Sunrise CTA:** memorable large-scale typography with a curved accent exiting viewport, not a direct duplicate of hero.

### 8.5 Three optional advanced interactions (only after tests pass)
- Cursor-adjacent hover affordance on visual category tiles (desktop pointer only), but real cursor stays intact.
- Subtle parallax on editorial image collage (max limited motion; no layout shifting).
- Scroll progress indicator on long articles and segment pages (not decorative meter everywhere).

### 8.6 Motion safeguards
- Honor `prefers-reduced-motion: reduce` immediately; show all content, remove parallax/pinning and animated count-up. Avoid relying solely on CSS if JS controls timelines.
- Handle `visibilitychange`, tab backgrounding, resize and unmount cleanup; kill/rebuild ScrollTrigger instances safely; avoid duplicate triggers on route transitions.
- No JS-induced layout shift; reserve image dimensions and apply animation to compositor-friendly properties.
- No looped first-load explosion of all assets. Detect coarse pointers, low memory/save-data signals when practical. Degrade visually rather than technically break.
- Keyboard users must never navigate to visually off-screen pinned elements; test focus order throughout timelines.

### 8.7 Storyboard deliverable
Create `docs/motion-storyboard.md` containing for **each homepage scene**: scroll entry/exit; start/final visual state; headline content; dominant image; exact animation triggers and duration; interaction; mobile treatment; reduced-motion behavior; potential performance cost; QA evidence link.

---

## 9. ENGINEERING ARCHITECTURE — RECOMMENDED STACK

### 9.1 Tech decision, to be validated in workspace
**Preferred:** Current mutually compatible stable versions of **Next.js App Router + React + TypeScript (strict) + Tailwind CSS + CSS variables + GSAP/ScrollTrigger**, optionally Motion for simple UI animations. Server components default; client components only for actual interaction. Next Image and modern font handling. Zod for validation. `next-intl` or equivalent maintainable i18n for Arabic/English. Use ESLint, Prettier, Vitest/Testing Library and Playwright.

**CMS:** Preferred **Payload CMS (current stable compatible version) integrated with Next.js**, PostgreSQL adapter, rich-text editor and admin panel, localized content fields as applicable. If compatibility/testing shows a hard blocker, document reason and substitute one capable CMS (e.g., Sanity) with an actual working integration. Do not leave a "CMS coming soon" link or a JSON-only fake admin and claim the site is fully content-managed.

**Database:** PostgreSQL via properly configured environment; local developer mode using Docker Compose only if available. Query/public APIs must never expose draft data. Secure file storage in production object storage (S3-compatible or supported provider), local filesystem only for dev. No invented service credentials.

**Deployment:** deployable on a provider compatible with selected CMS/database, with env sample and documented deployment steps. Request permission before creating paid resources, domains or public deployment. Never commit secrets. A successful local preview is not equivalent to a published site.

### 9.2 Suggested project structure

```text
alshorouk-web/
├── AGENTS.md
├── ALSHOROUK_ANTIGRAVITY_MASTER_BUILD_SPEC.md
├── Alshorouk_Brand_Guidelines.pdf      # local brand source; handle license/rights
├── .agents/
│   ├── skills/                          # generate task-specific SKILL.md packages
│   └── rules/                           # optional compact, scoped rules
├── src/
│   ├── app/
│   │   ├── (payload)/admin/             # as needed by Payload version
│   │   └── [locale]/
│   │       ├── page.tsx
│   │       ├── about/page.tsx
│   │       ├── poultry-solutions/page.tsx
│   │       ├── solutions/[segment]/page.tsx
│   │       ├── products/page.tsx
│   │       ├── products/[slug]/page.tsx
│   │       ├── how-we-work/page.tsx
│   │       ├── knowledge/page.tsx
│   │       ├── knowledge/[slug]/page.tsx
│   │       ├── contact/page.tsx
│   │       ├── partner-with-us/page.tsx
│   │       └── privacy/page.tsx
│   ├── components/
│   │   ├── layout/ ui/ motion/ sections/ products/ forms/ content/
│   ├── lib/ i18n/ styles/ config/ types/ hooks/
│   ├── payload/
│   │   ├── collections/ globals/ access/ hooks/
│   └── tests/
├── public/
│   ├── brand/                           # approved logo variants only
│   ├── images/                          # licensed imagery
│   └── media/                           # optimized hero files
├── content/
│   └── approval-register.md
├── docs/
│   ├── reference-audit.md
│   ├── brand-audit.md
│   ├── architecture.md
│   ├── site-map.md
│   ├── motion-storyboard.md
│   ├── test-report.md
│   ├── performance-report.md
│   ├── cms-editor-guide.md
│   ├── deployment.md
│   └── open-items.md
├── e2e/
├── screenshots/
├── .env.example
├── README.md
└── package.json
```

Adapt paths to real framework version and actual CMS rather than blindly producing broken boilerplate. Keep design, CMS, and content concerns cleanly separated.

### 9.3 Type discipline and route integrity
- Types for locale, production segment, product categories, CMS statuses, inquiry kinds and sources.
- Product route must use approved locale-specific slug or ID mapping; generate static params only from published records where appropriate; correct dynamic metadata.
- Treat query params, form inputs, CMS markdown/rich text, and asset URLs as untrusted input; sanitize/validate.
- Server-side business logic handles lead submission; front end handles client validation/UX.
- Use API caching/revalidation thoughtfully; content editor can publish/update and site reflects changes predictably.
- Set error/loading boundaries; never swallow errors or show success on failure.

---

## 10. CMS AND REAL BUSINESS DATA STRUCTURE

### 10.1 Collections / globals (minimum)

**Global `SiteSettings`:** locales; current site status; verified company display names; metadata; approved logo asset refs; social URL links; consent info; contact channels; verified physical address if supplied; footer notice; navigation configuration; feature flags; original brand source reference.

**Global `Homepage`:** localized headline, description, media, editorial order, approved evidence metrics, scene-specific copy, CTA labels, enabled/disabled sections.

**`ProductCategory`:** enum/slugs for feed, feed-supplement, veterinary-medicine, veterinary-vaccine; i18n label; approved description; illustration/image; ordering.

**`PoultrySegment`:** broilers / layers / breeders; names/translations, approved media, public intro, category linkage, meta.

**`Product`:** real `nameAr`, `nameEn` if approved, `slugAr/slugEn` or normalized slug, `sku` optional, `categoryId`, `segments[]`, `manufacturer` optional, official description, approved packaging label, image assets with alt, approved PDF label optional, `availabilityStatus` from limited safe values (`inquiry_only`, `on_request`, `confirmed` if actually confirmed), `isPublished`, `approvalStatus`, `sourceEvidence`, `updatedAt`, safety text, SEO fields, internal admin notes. Do NOT populate with imaginary brands or drug properties.

**`Article`:** approved headline/body, author attribution only if real, publish date, category, gallery media, sources, slug, locale, SEO, publication status.

**`Inquiry`:** `id`, `type` (farm/product/partner/general), `name`, `phone`, `email?`, `organization?`, `governorate?`, `segment?`, `productRef?`, `requestDetails`, `locale`, `consentAt`, `sourcePath`, `status`, `createdAt`, `adminNotes`. Secure PII; avoid unnecessary medical/private info.

**`FAQ`:** question/answer locale and publication status.

**`Asset`:** media owner/license, alt, width/height, rights evidence, optional expiration, association.

**`Metric` or global proof data:** three pre-approved stat records with qualifier and plain-language accuracy notes. Restrict updates to editors with authorization.

**`ContentApproval`:** state, approvedBy, approvedAt, underlying evidence file URL or note; not public.

### 10.2 CMS permission tiers
- `Admin`: user management, security settings, full content control.
- `Editor`: draft, publish/approve content **only if business authorization assigned**; no account/security settings.
- `Sales`: read/update inquiry status, no access to product publishing or sensitive settings.
- Public users: read published approved content only, submit protected lead.

Enforce RBAC server-side, not by hiding admin UI buttons. MFA if supported; strong credential policy; no development admin account publicly deployed; test unauthorized access.

### 10.3 Inquiry lifecycle
State machine: `new` → `contacted` → `qualified` → `closed` / `rejected`. Accept a submission only after schema validation and safe persistence; record origin route and relevant product/category. On successful persistence show a confirmation with a real reference (optional), not unverified send-email language. Configure email notifications only with real provider credentials, retry handling and no exposed secrets; otherwise document `stored in CMS; notifications pending SMTP configuration`.

### 10.4 Content integrity and UX
- Use rich text safely and preserve RTL direction per locale.
- Image CMS input requires alt text and cropping/focal point data.
- Landing-page field count manageable for editors; custom blocks strongly typed.
- Product forms prefill verified product ID; no unapproved price list publishing.
- Export leads from admin securely if supported; access logged appropriately.
- Content preview must visibly indicate DRAFT, noindex, access controlled.

---

## 11. CONTACT FORMS — DEFINITIVE USER JOURNEYS

### 11.1 Farm inquiry
Visitor clicks hero CTA → `/contact?type=farm` → form recognizes source; visible categories include broilers/layers/breeders. Form fields: full name, valid local/international telephone, organization/farm optional, production type, product category optional, message, consent. On submit validate Zod server-side, anti-bot controls, store in CMS, show actual success state and clear/reset as appropriate. Handle server/network errors with visible recovery, no duplicate write on rapid double click.

### 11.2 Product inquiry
Visitor filters product → opens approved detail → selects `استفسر عن المنتج` → product identity passed as stable trusted ID; modal or contact page includes safe product label → message optional, name and phone required → persists inquiry with `productRef` and `sourcePath` → sales sees product context in admin.

### 11.3 Partnership inquiry
Visitor opens `/partner-with-us` → company, role, contact, product line, message; spam defense and consent → store with `type=partner` distinct from retail/farm inquiries; optional email notification when configured.

### 11.4 Spam & privacy
Honeypot + per-IP rate limiting with appropriate store, request size limits, CSRF/origin protections appropriate to framework, normalization, server-side validation, idempotency/de-duplication on submission, safe logs (no raw PII in analytics), clear retention policy once decided. Validate phone internationally; for Egyptian numbers accept natural local formats but preserve valid international numbers. Never promise the company responds within X hours unless approved.

---

## 12. SEO, ANALYTICS, ACCESSIBILITY, AND PERFORMANCE

### 12.1 SEO
- Server-rendered meaningful HTML content; semantic heading hierarchy (one meaningful H1 per page), real link structure.
- Per-locale metadata, OG images with authorized logos/images, canonical URLs, sitemap only published routes, `hreflang ar-EG/en` when real English pages exist, default locale redirect policy, robots and noindex for admin, staging, draft products/articles.
- Structured data `Organization` (with **only verified** name, website, phone/address if known), `BreadcrumbList` for interior pages, `Article` for approved content, `Product` only for approved products with factual attributes. Avoid fake review ratings or `Offer` without real price/stock.
- Intent phrases may include `منتجات مزارع دواجن`, `أدوية دواجن`, `لقاحات دواجن`, `مكملات أعلاف الدواجن`, `أعلاف الدواجن`, integrated naturally, not stuffed. Regional targeting to Egypt only when accurate; don't invent service geography.
- Search input crawl/index decisions explicit; avoid infinite filter route indexing.

### 12.2 Accessibility (WCAG 2.2 AA goal)
- Proper `<html lang="ar" dir="rtl">` and English counterpart.
- Visible focus, keyboard-accessible menus/tabs/accordions/forms/modals, skip link, alt texts, labels and clear form errors, appropriate aria-live only for status.
- Text contrast 4.5:1 for normal, 3:1 for large/UI where applicable; brand guideline says white on vermilion can fail normal copy, test.
- Reduced-motion alternate for ALL cinematic scenes. No autoplay audio, no flashing, no content only revealed by hover, no loss of focus after client-side navigation.
- Logical reading order with sticky scenes and pinned animation; product filters usable with screen reader and touch.
- Auto-generated audit does not replace real keyboard/manual accessibility tests.

### 12.3 Core Web Vitals and budgets
Target under realistic mobile network and CPU (not guarantees independent of host):
- LCP <2.5s for key pages where infrastructure allows; CLS <0.1; INP <200ms.
- JS footprint lean: set actual bundle budget after baseline measured; avoid 3D unless justified and opt-in lazy loaded.
- Hero image <~250–400KB when acceptable visual quality; hero video optional, modern codec + poster + lazy conditional strategy; never ship multi-megabyte autoplay above-the-fold on mobile without meaningful fallback.
- Fonts subset/preload appropriately, never block rendering while licensed Arabic font absent.
- Use responsive images, dimension reservation, critical CSS, server rendering, route splits, optimized third-party trackers, edge/CDN caching.
- `npm run build` passes; Lighthouse representative desktop/mobile runs documented; track image loading and hydration errors.

### 12.4 Analytics
Plan for privacy-appropriate GA4/Plausible/etc **only after actual IDs and consent strategy are provided**. Instrument typed events: `hero_cta_click`, `contact_open`, `form_submit_success`, `product_filter`, `product_view`, `product_inquiry_start`, `language_toggle`. Never send medical notes or PII as analytics properties. If tracking absent, implement event adapter that safely no-ops and document credentials needed; do not invent a configured dashboard.

---

## 13. MULTI-AGENT OPERATING MODEL (CLAUDE + ANTIGRAVITY)

> **Operational truth:** These are required **responsibilities**, not a claim that every named role already exists as an independently callable built-in Antigravity agent. Antigravity supports agent conversations/subagents depending on installed surface and permissions. Use parallel delegated work where supported. Otherwise perform these roles sequentially, preserving explicit handoffs and acceptance reports. Do not silently claim agents ran if there is no mechanism.

### 13.1 Orchestrator / Executive Agent (Claude)
**Owner:** overall plan, conflict resolution, project checkpointing, orchestration, reviewing QA evidence, stakeholder clarification only for truly blocking approvals. Must continuously track `docs/task-board.md` and `docs/open-items.md`, delegate independent tasks when possible, prevent incompatible changes and prevent fake-complete reporting. Write no production implementation until brand and architecture are audited, then lead phased execution.

### 13.2 Research & Reference Analyst
**Input:** 4 references + PDF. **Output:** screenshots/notes in `docs/reference-audit.md`, verified brand/business facts, proper inspiration mapping. Browser access only when enabled; log inaccessible pages. **Done when:** every reference has at least desktop/mobile analysis and no unauthorized asset reuse.

### 13.3 Brand Guardian / Design Director
**Input:** PDF and user updates. **Output:** `docs/brand-audit.md`, extracted approved logo assets, colors, type variables, photo treatment and red-flag list. Reject cows/sheep, mismatched logo, excess amber, unlicensed Arabic fonts. **Done when:** design tokens and image direction pass brand audit.

### 13.4 UX / Information Architect
**Input:** approved business model and user paths. **Output:** sitemap, user flows, mobile nav plan, page wireframes and responsive states. **Done when:** farm manager finds products and contacts business within <=3 meaningful actions.

### 13.5 Visual Product Designer
**Input:** brand system and UX wireframes. **Output:** high-fidelity art direction, tokens, desktop/mobile page compositions, distinctive sections; can generate previews/screenshot references with appropriate tooling if available. **Done when:** designs have visual variety and strong readability, avoiding generic cards.

### 13.6 Motion Director / Creative Technologist
**Input:** approved page designs. **Output:** `docs/motion-storyboard.md`, timeline implementation proposals, reduced motion alternatives and performance budgets. **Done when:** six signature moments storyboarded and all have low-motion plan.

### 13.7 Frontend Architect / Senior Engineer
**Input:** sitemap, design, content schema. **Output:** TypeScript app, reusable UI, responsive pages, localization, motion integration. **Done when:** all routes work with typecheck/build and clean browser console.

### 13.8 CMS / Backend Engineer
**Input:** domain model, conversion journeys. **Output:** migrations, secure CMS, RBAC, approved-only publishing, lead storage, emails integration behind config. **Done when:** authorized editor can publish an approved product and sales user can see a submitted inquiry; public cannot see drafts.

### 13.9 Arabic Copywriter & Localizer
**Input:** business truth and approved claims. **Output:** draft Arabic-first page copy, English translation, glossary and approval register. **Done when:** no unsupported claims and both RTL/LTR copy coherent.

### 13.10 SEO & Accessibility Specialist
**Input:** routes and content. **Output:** canonical/hreflang, schema data, audits and fixes. **Done when:** page titles/metadata valid and keyboard/reduced-motion paths pass.

### 13.11 QA / Browser Testing Agent
**Input:** functional build. **Output:** Playwright screenshots/flows, `docs/test-report.md`, logged bugs, regression list; test desktop/mobile/tablet in real browser. **Done when:** no blocker/critical bugs, no horizontal scrolling or broken forms; annotated visual evidence.

### 13.12 Performance / DevOps & Release Engineer
**Input:** tested site. **Output:** bundle/image review, Lighthouse evidence, environment docs, secure staging/deploy plan. **Done when:** real production build healthy, metrics documented, secrets absent and deployment requirements explicit.

### 13.13 Delegation & coordination protocol
1. Orchestrator creates a task with exact input files, measurable done condition and output artifacts.
2. Independent research/brand/content efforts may run in parallel; avoid two agents editing same source file simultaneously.
3. Design Director signs off tokens before global CSS; UX lead signs off site map before route expansion; backend schema is agreed before product UI integration.
4. Every task reports `implemented`, `verified`, `blocked`, or `needs_review`, with evidence; **never self-approve unsupported facts**.
5. Review code changes using diffs; run relevant tests. Orchestrator integrates and records follow-up.
6. Browser QA is a **separate pass after implementation**; screenshot and patch until acceptable; not just checking that website loads.
7. Only final orchestrator communicates completion with explicit feature inventory and honest limitations.

---

## 14. ANTIGRAVITY CONFIGURATION — REAL FILES, RULES AND SKILLS

### 14.1 Required generated artifacts inside the actual project
At initiation, Antigravity must generate and maintain:
- Root `AGENTS.md` describing project mission, fact hierarchy, prohibited content, route rules, coding/QA gates, commit permissions, source control behavior and how to invoke project skills.
- `.agents/skills/<skill-name>/SKILL.md` containing YAML frontmatter (`name`, `description`) and complete task-specific instructions, inputs, outputs, checklists and failure recovery.
- Optional `.agents/rules/*.md` with **valid current Antigravity frontmatter triggers** for specialized coding rules; use root `AGENTS.md` for always-on simple rules.
- `docs/task-board.md` with statuses and dependencies; `docs/open-items.md` with a short human-approval queue.
- `docs/quality-gates.md` defining gate-by-gate pass/fail checks.

**Important implementation detail:** Official Antigravity documentation identifies workspace skills under `.agents/skills/<folder>/SKILL.md` and recognizes root `AGENTS.md`. Use **actual installed Antigravity capabilities**, not imaginary slash commands or plugin names. Check docs in environment before writing advanced triggers. Do not rely on legacy `workflows` that are being sunset/migrated; durable `AGENTS.md` + skills are the primary mechanism.

### 14.2 Mandatory skill packages to create (minimum 13)
For each, write a substantive `SKILL.md`, not a stub; list when to invoke, stepwise instructions, tools needed if available, required deliverables, checks and escalation conditions.

| Skill folder | Responsibility | Required quality output |
|---|---|---|
| `brand-extraction` | Audit source PDF, extract legitimate logo variants, tokens, identify outdated livestock references | brand audit, official assets or blocker |
| `reference-research` | Browser-analyze 4 URLs and evaluate patterns | evidence-based reference audit |
| `poultry-content-integrity` | Enforce poultry-only claims, metrics qualifiers, safe veterinary wording, approval states | claims matrix, editorial flags |
| `arabic-rtl-design` | Arabic typography, RTL, mixed-script bidi, responsive layouts | RTL screenshots, language tests |
| `visual-art-direction` | Premium visual design, section compositions, editorial hierarchy | page-specific art direction + visual review |
| `motion-storyboarding` | Narrative motion scenes, timelines, reduced-motion | approved scene storyboard |
| `gsap-implementation` | ScrollTrigger setup/cleanup, path drawing, sticky chapters | working performant GSAP scenes |
| `nextjs-architecture` | Maintainable App Router, TypeScript strict, server/client boundaries | typecheck/build/route health |
| `cms-and-product-catalog` | CMS schemas, approved publishing, data-driven product filters/detail | working publishing + catalog |
| `lead-form-engineering` | Product/farm/partner forms, persistence, validation and anti-spam | real stored inquiry + tests |
| `seo-accessibility` | metadata, schema, keyboard, contrast, reduced-motion | scan + manual QA evidence |
| `browser-visual-qa` | Multi-viewport screenshots, contrast, broken interactions, iteration | screenshots and defect log |
| `security-performance-release` | Hardening, metrics, env/README/deploy readiness | build, audits, release checklist |

If the target Antigravity version has built-in relevant skills/tools already installed, inspect and use those with the same expectations rather than duplicating conflicting files; project-specific additions must still express these requirements.

### 14.3 Author a complete `AGENTS.md` using this mandatory core

```markdown
# ALSHOROUK WEBSITE — AGENT OPERATING RULES

This repo is a full commercial Arabic-first website for Alshorouk, serving poultry farms ONLY.
The root master specification is authoritative: ALSHOROUK_ANTIGRAVITY_MASTER_BUILD_SPEC.md.
Follow its source precedence, brand PDF, user-provided approximate metrics and no-fabrication policy.

## Project invariants
- No cows, sheep, dairy, generic livestock, pets or fake poultry product records.
- Respect original brand logo and visual tokens (#FE3300, #FEB821, #000000, #FFFFFF).
- Never invent phone, address, farm logos, certifications, delivery times, manufacturer status or medical information.
- Treat product data and company claims as publishable only after approval.
- RTL Arabic works completely; English locale must not break.
- Build fully functioning routes, forms, CMS, tests, responsive layouts and purposeful animations.
- No unverified 'done' claims. Browser-test changes at desktop, tablet and mobile.
- Honor prefers-reduced-motion and WCAG 2.2 AA objective.
- Keep PII and keys safe; never deploy or purchase resources without explicit permission.

## Work loop
1. Read full master specification and brand PDF before major changes.
2. Inspect repo and available actual Antigravity tools/skills.
3. Create/refresh task board and plan, surface only essential blockers.
4. Implement one cohesive vertical slice at a time, with tests.
5. Capture browser evidence, fix issues, document truthfully.
6. On completion, report route matrix, tests, preview, deployment blockers and approvals.
```

### 14.4 `SKILL.md` schema template to generate for EACH package

```markdown
---
name: alshorouk-brand-extraction
description: Audit Alshorouk's supplied brand guidelines, derive verified tokens and approved visual assets; use before UI implementation or logo changes.
---

# Skill: Alshorouk Brand Extraction

## Activation
Use when initializing design tokens, touching logo files, changing typography or auditing visual output.

## Inputs
- Alshorouk_Brand_Guidelines.pdf
- ALSHOROUK_ANTIGRAVITY_MASTER_BUILD_SPEC.md

## Procedure
1. Read source page images as well as extracted text.
2. Validate palette, typography, clear-space, logo variants and photography prohibitions.
3. Verify any exported logo matches the approved drawing pixel-for-pixel/visually.
4. Record any gap (unlicensed font, missing original logo asset) in docs/open-items.md.
5. Write concrete tokens/assets and a self-check report.

## Acceptance
- Approved logo unaffected; no cow/sheep imagery; correct exact colors; clear-space verified.
- Evidence in docs/brand-audit.md.
```

The above is **one example**, not a substitute for creating all 13 complete skill modules. Customize frontmatter `name` per skill. If permissions prevent file creation, disclose exact failure rather than implying skill installation.

### 14.5 Recommended orchestration handoffs

```text
Claude / Orchestrator
   ├─ Research Analyst ──────────┐
   ├─ Brand Guardian ────────────┼──> Brand + Evidence Gate
   └─ UX Architect ──────────────┘
                 ↓
         Visual Design / Arabic Copy
                 ↓
        Motion Director + Schema Lead
                 ↓
     Frontend <──interface contract──> Backend/CMS
                 ↓
        SEO + Accessibility audit
                 ↓
       Browser QA / Performance QA
                 ↓
       Fix / retest / final report
```

**Do not:** assume Claude and Antigravity have a magical live shared filesystem unless the integration visibly provides it. Confirm actual workspace path and permission first. Store generated documents in the real project, maintain version control and avoid background work claims unsupported by tooling.

---

## 15. IMPLEMENTATION PHASES — STEP-BY-STEP EXECUTION PLAN

### PHASE 0 — Environment reconnaissance (required)
1. Confirm actual repository directory, project state, package manager, Node version, Git status, installed fonts/assets and PDF path. If pre-existing project, inspect and preserve it; do not overwrite uncommitted changes.
2. Confirm which Antigravity surface/capabilities are available: editor, terminal, browser, subagents, installed skills, optional MCP. Never assume access to nonexistent tools.
3. Load supplied PDF and inspect images + parsed pages; read four reference URLs in browser; do not copy assets.
4. Create task board, open-items and this master file in repo; root `AGENTS.md`; skill packages.
5. Record verification of key metrics and poultry-only correction. **Gate 0:** environment works, source documents accessible, no unknown overwrites.

### PHASE 1 — Research & blueprint
1. Brand audit, copy/claims matrix and content taxonomy.
2. Reference audit desktop/mobile and six motion ideas.
3. Complete IA, route list, nav, user journeys and visual section layouts.
4. Choose working tech versions and CMS contract; identify deployment needs and cost approvals.
5. Deliver `docs/architecture.md`, `docs/site-map.md`, `docs/brand-audit.md`, `docs/reference-audit.md`.
6. **Gate 1:** sitemap and tokens consistent; no unsupported facts in outward-facing copy; 3 customer journeys specified.

### PHASE 2 — High-fidelity design + motion plan
1. Prototype full home page sections at 1440 and 390px using real content and suitable images.
2. Design 3 representative interior page families: about, category/segment, product catalog/detail, contact.
3. Create an annotated storyboard for all six signature motion moments.
4. Run manual visual QA for brand ratio, authentic imagery, typographic quality and Arabic hierarchy.
5. **Gate 2:** visually distinctive, responsive mock execution plan, all major states designed (empty/loading/error).

### PHASE 3 — Foundation
1. Initialize strict TypeScript Next.js codebase; lint/format/tooling.
2. Integrate typography, palette and approved logo. CSS variables and reusable design components.
3. Implement i18n route system, navigation/footer, metadata infrastructure, global accessibility.
4. Build static versions of all route skeletons with real layouts, not placeholder pages.
5. Start CMS, DB and actual approval-aware schema/migrations; no imaginary product seeds.
6. **Gate 3:** build/typecheck works, all routes responsive/nav functional, CMS starts locally.

### PHASE 4 — Hero + signature homepage
1. Implement scene 1 and ensure real LCP image, brand curve and first-load CTA.
2. Implement stats scene with qualifiers and screen-reader fallback.
3. Implement segment chapters and distribution journey as real animated interactions.
4. Implement product category grid, values section, approved-only product preview, FAQ and CTA/footer.
5. Add reduced-motion mode and mobile fallbacks per scene now, not at final day.
6. **Gate 4:** homepage feels premium on desktop/mobile; browser recordings; no serious CLS, overflow or broken motion.

### PHASE 5 — Interior pages + conversion
1. Build About, solutions, 3 segment pages, process, contact, partnership, knowledge, legal.
2. Build real dynamic catalogue and product details with CMS, approved-only visibility, filters and search.
3. Build lead forms, safe server-side persistence, admin inquiry workflow and verification tests.
4. Link every CTA to a meaningful working destination.
5. **Gate 5:** every critical customer flow works end-to-end and a sales/admin role can access the correct record.

### PHASE 6 — Content, SEO, accessibility, performance
1. Populate approved website copy, exact metrics and available real product/article records. Block fabricated data.
2. QA bilingual routes and Arabic copy breaks; accessibility audit, keyboard pass, contrast.
3. Metadata, sitemap, schema and analytics adapter. Compress visuals, bundle split, lazy-load expensive motion.
4. Create editor guide and content approval queue.
5. **Gate 6:** no critical accessibility/security/SEO issues; mobile perf documented.

### PHASE 7 — Real browser testing & iteration
1. Playwright route/function tests and snapshots at 8 screen widths / key viewports.
2. Real browser screenshot review **against self-produced design intent**, not reference-site pixel clones.
3. Fix minimum 2 rounds of visible polish if issues identified (alignment, composition, motion timing, image crops, text wrapping, footer, CTA contrast).
4. Test forms, auth, data publishing, empty states, navigation, reduced motion, slow network and validation errors.
5. **Gate 7:** no P0/P1, no major P2 visual issues, test suite passes, verified local preview.

### PHASE 8 — Release handoff
1. Provide deployment-ready app, migrations, `.env.example` with explanations, secure build and DB setup.
2. `README.md` with exact start/build/test commands and architecture overview.
3. `docs/cms-editor-guide.md`, `docs/deployment.md`, `docs/test-report.md`, `docs/performance-report.md`, `docs/open-items.md`, captured screenshots and browser proof.
4. If deploy permission and credentials are available, deploy to **explicitly approved** staging/production destination, verify published URL and forms. If not, provide tested local preview and exact steps, label it *not deployed*.
5. **Gate 8:** truthful delivery matrix: implemented, tested, unresolved, approvals/credentials required.

---

## 16. AUTOMATED TESTS, VISUAL QA AND EVIDENCE

### 16.1 Required automated tests

**Unit / component:**
- Business metrics render with qualifier, correct descriptions, locale handling.
- Product data publication guard hides `draft` / `review_required` entries.
- Arabic search normalization does not destroy valid text.
- Category/segment facets compose and reset correctly; query pagination stable.
- Server Zod validation rejects malformed inputs and accepts valid inquiry.
- Logo component class/layout does not stretch or introduce fake recoloring.

**Integration:**
- CMS admin authorized login, role permissions and CRUD on approved product.
- Unapproved product 404/noindex and missing image safe fallback.
- Real contact submission persisted with correct source, type, segment and product context.
- Rate limit behaves; duplicate submissions do not create duplicate leads unintentionally.
- English route maps to valid page; Arabic RTL remains correct.

**E2E browser journeys:**
1. Open Arabic home → scroll complete page → open poultry segment → contact → submit → see recorded inquiry.
2. Open catalogue → filter by category/type → select published product → inquire → admin reads product-linked inquiry.
3. Open nav on mobile → select About → switch EN → return AR → nav still works.
4. Keyboard-only menu + dialog + accordion + contact form, errors and success.
5. `prefers-reduced-motion` reveals all text and removes pinned/nonessential motion.
6. Zero published products → polished empty state → request catalogue CTA works.
7. Direct reload of every route, missing slug 404, malformed query safe handling.
8. Fail form persistence deliberately → show error, never fake success.

### 16.2 Viewport matrix
Mandatory screenshots at **320×720, 360×800, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080**. Browser screenshots at top, middle and footer for home; full-page screenshot at least 390 and 1440. Additional product catalogue, product detail, contact, mobile menu and 404 screenshots at 390 and 1440. Test a real/touch-capable mobile context if available. Verify Arabic + English layout.

### 16.3 Visual regression checklist
- Hero subject not cropped incorrectly, headline no overlaps and CTA visible without scrolling excessively.
- Arabic joins and line breaks correct; no text outside viewport; no weird justified short lines.
- Logo preserves source shape/clear-space/contrast; header uses proper version.
- Color balance credible (white 55%, black 25%, red 15%, amber <=5%) and no template gradients.
- Each section has intentional rhythm; mobile has no ghost columns, cropped buttons or fixed elements covering form fields.
- Sticky animations release at correct scroll position; no pin gaps or jumping on refresh.
- Footer/legal/nav and forms function; all images have proper aspect ratio and license/provenance.
- Reduced motion and low-network experiences still feel designed.
- No `console.error`, hydration mismatch, broken images, dead links or unresolved placeholders.

### 16.4 Security checks
- No secrets hardcoded or committed.
- Forms server validated + rate-limited + content-length bounded; error details do not leak internals.
- CMS RBAC server-side, public drafts rejected; admin route not indexed; auth/session protections.
- Uploads type/size validated and preferably provider-secured; CSP/headers used where compatible.
- Dependency vulnerability check and documented mitigations; respect framework compatibility.

### 16.5 QA reporting format
For each failing test record: exact route; viewport; steps; expected vs actual; severity (P0–P3); screenshot/video; owner; patch reference; verification status. Attach proof for every signature animation. Do not claim 100 Lighthouse scores unless measured. Build reports from actual execution output, not fabricated test results.

---

## 17. CREATIVE QUALITY BAR — WHAT AN EXCELLENT RESULT SHOULD FEEL LIKE

This site must **not** resemble a generic enterprise landing page assembled from stock Tailwind components. The brand must be memorable through typography, composition, photography and meaningful kinetic storytelling, not noisy effects.

**Expect:**
- Above-the-fold design with precise photographic crop, oversized beautiful Arabic display type, strong negative space and a confident black/white/red hierarchy.
- At least 3 distinct homepage scene compositions (not same background/3 cards repeated).
- At least 6 working signature motion beats whose transitions feel coherent.
- Real industry logic: chicken production, distribution and product access are central.
- A product catalogue that would actually help commercial teams receive qualified inquiries.
- Editorial-level Arabic typography and thoughtful mobile layout.
- Fully functioning navigation, SEO, forms, CMS, secure data and tests.

**Reject and redo if any:**
- Random 3D chicken or unrelated factory imagery dominates.
- General farm animals appear even once.
- Scrolling yields meaningless scaling/glitch/morphing of text.
- All content is generic marketing fluff or fake numbers.
- Hero only is developed, lower pages left as placeholders.
- 150 products are invented or the company is falsely called a manufacturer.
- Default English LTR frontend with a superficial Arabic translation.
- Logo is recreated incorrectly, cropped or altered.
- Contact forms don't persist, buttons don't work or pages aren't responsive.
- No browser testing evidence or fake deployment claims.

---

## 18. REQUIRED HANDOFF PACK AND REPORT

Final workspace must contain, at minimum:

```text
[ ] Fully runnable website repository + lockfile + no embedded secrets
[ ] Root AGENTS.md
[ ] At least 13 substantive .agents/skills/*/SKILL.md modules
[ ] Approved assets / brand audit and explicit missing-assets blockers
[ ] Arabic routes and international localization foundation
[ ] Complete homepage with six signature motion moments
[ ] All internal pages in sitemap (or explicit editorial publish gating)
[ ] Product catalogue, filter/search, individual details with approved-only CMS data
[ ] Real forms and functioning lead persistence/admin view
[ ] Accessible mobile menu, locale switch, error/empty states
[ ] SEO, sitemap, robots, metadata and schema
[ ] Reduced-motion and mobile-safe animation
[ ] Automated tests + browser screenshot evidence
[ ] Security & performance review
[ ] README / CMS guide / deployment guide / QA report
[ ] Approval register and human business-content blocker list
```

**Report table:**

| Deliverable | Implementation | Verified by | Evidence | Remaining gap |
|---|---|---|---|---|
| Brand and typography | PASS/FAIL | Visual source audit | path | e.g. licensed font pending |
| All pages | PASS/FAIL | E2E + manual | screenshots | ... |
| Motion scenes | PASS/FAIL | Browser recording | path | ... |
| CMS and products | PASS/FAIL | Admin CRUD test | record link/log | ... |
| Forms/lead storage | PASS/FAIL | End-to-end test | screenshot/log | ... |
| Arabic and English | PASS/FAIL | i18n checks | screenshots | ... |
| Accessibility | PASS/FAIL | audit/manual | report | ... |
| Performance | PASS/FAIL | measurements | report | ... |
| Deployment | DEPLOYED / READY / BLOCKED | production check | URL or steps | ... |

Never mark PASS without evidence. Distinguish **working local app** from public live deployment.

---

## 19. HUMAN APPROVALS / MISSING INFORMATION — DO NOT BLOCK UNNECESSARILY

The team can complete design, local application, CMS, forms and test fixtures before having these items; just avoid publishing unapproved fields.

**Critical pre-production approvals to collect later:**
1. Official **logo files** (prefer vector) if clean sanctioned original is unavailable from PDF; licensed Thmanyah font asset.
2. Verified phone, WhatsApp, email, legal entity name, office address/governorates if to be displayed; official domain ownership and social profiles.
3. Exact product list (real company-distributed SKUs, approved category, pack size, labels, manufacturer and licensing) and confirmation of which feed/feed supplements are offered. Confirm 150 count's specific scope and whether catalogue coverage should aim for all or selected entries.
4. Approved original farm/warehouse/medicine imagery, photo rights, real farm/partner testimonials/logos if desired.
5. Verify exact commercial process and service claims (including whether owned warehouses/vehicles, storage standards and delivery time can be stated).
6. Product and veterinary copy legal/compliance sign-off, privacy/consent terms.
7. CMS admin owner credentials, PostgreSQL/storage/hosting credentials, SMTP/notification channel, analytics consent and IDs.
8. Final approval of high-visibility slogan/headline and any English public marketing copy.

**Do not stop waiting for noncritical approvals:** Implement with clear content gates and working generic imagery **licensed and true to poultry sector**, not deceptive placeholders. Build admin so approved content can be added later. An unapproved content area can be hidden from public while still tested in a secure staging environment.

---

## 20. THE EXACT START COMMAND FOR CLAUDE / ANTIGRAVITY

> **Copy the block below into Claude (within the connected Antigravity workspace), with this Markdown file and `Alshorouk_Brand_Guidelines.pdf` available in the same project context.**

```text
You are the EXECUTIVE BUILD ORCHESTRATOR for the ALSHOROUK website.

Read the ENTIRE file ALSHOROUK_ANTIGRAVITY_MASTER_BUILD_SPEC.md and the supplied Alshorouk_Brand_Guidelines.pdf (including PDF images) before implementation. The user has overridden the old mixed-livestock positioning: the website serves POULTRY ONLY. The approved commercial proof is approximately 300 continuously served farms (broiler/layer/breeder), approximately 15 million birds within their production capacity, and approximately 150 distributed veterinary medicines/vaccines products. Poultry feed and feed supplements are also in requested service scope; do not invent a manufacturing claim, SKUs or additional figures.

Use Antigravity's real editor, terminal and browser capabilities where available. Check what agent/subagent facilities and installed skills exist; don't assume tools or make up results. Create root AGENTS.md, at least 13 substantive task skills in .agents/skills/<name>/SKILL.md, and all phase planning/QA artifacts detailed in the master document. Orchestrate real independent subagents when supported, otherwise execute the roles sequentially with explicit handoffs.

Build the REAL COMPLETE WEB APP: Arabic-first responsive premium corporate design; brand-correct logo/colors/fonts; all routes; cinematic GSAP-driven scroll animations; CMS with approval-gated poultry-only product catalogue; actual secure inquiry persistence; English localization foundation; accessibility; SEO; analytics adapter; automated and browser tests. Reference the four listed websites for quality and interaction inspiration, never copy their protected assets or text.

Begin with Phase 0 repository/environment + brand/source audit, then Phase 1 and follow all quality gates through Phase 8. Do not stop at a plan, mockup or hero. After each meaningful phase, report actual files changed, demo URL if available, tests performed, screenshots and blockers. On every important viewport, inspect screenshot evidence and iterate on visual quality. Do not fabricate farm imagery, numbers, product data, contact details, staff, certifications or claims. Never secretly use chargeable services or publish publicly without permission.

If information needed only for publishing is missing, record it in docs/open-items.md and build the rest. If a genuine project-level blocker occurs, explain the exact blocker and the smallest required user decision. End only when implementation is done and honestly verified, or when a hard blocker prevents further work. Be a rigorous, original design/engineering team rather than a landing-page generator.
```

---

## 21. FINAL ORCHESTRATOR SELF-AUDIT BEFORE CLAIMING SUCCESS

Answer **with evidence**, not intuition:

1. Can an Arabic-speaking poultry farm manager understand the company, 3 production types and 4 product pillars in under ~30 seconds?
2. Are 300 farms / 15 million birds capacity / 150 veterinary products displayed with **correct qualifiers and no misleading implication**?
3. Does every public photograph/illustration relate to poultry, never cows/sheep/other livestock?
4. Does the official logo precisely match the PDF; is its attached subtitle unchanged? Does site copy distinguish feeds from medicines/vaccines correctly?
5. Does the homepage feel as premium and dynamic as the *quality level* of references while being original and aligned to Alshorouk?
6. Are all nav items, product filters, inquiries, CTAs and contact pages actually working in live browser tests?
7. Does reduced-motion reveal all content? Can a keyboard/screen reader user use the menu, forms and filters?
8. Do 320px and 390px screens feel deliberately designed rather than broken desktop layouts?
9. Can an admin add/approve a real product, and can a sales role inspect an inquiry, without leaking drafts/private data?
10. Are SEO, security, page load and console logs reviewed with recorded measurements?
11. Are missing real credentials/assets/approvals explicitly disclosed rather than guessed?
12. Is the website actually deployed? If not, do not imply it is — distinguish production-ready code vs production deployment.

**Only a fully honest, evidence-backed YES (or an explicit APPROVAL PENDING for fact-specific fields) qualifies as a professional handoff.**

---

### Source documentation used to inform this specification
- Supplied: **Alshorouk Brand Guidelines v1.0 (October 2026), 21-page PDF** — original corporate visual identity and existing positioning; revised to poultry-only for this site as instructed by client.
- Reference sites: https://www.byteforceinc.com/ | https://www.bsystemseg.com/ | https://mindooco.com/en | https://www.imtyaze.com/
- Official Antigravity documentation (confirm installed/current behavior): https://www.antigravity.google/docs/skills?tab=ide | https://www.antigravity.google/docs/rules/ | https://www.antigravity.google/docs/agent/ | https://www.antigravity.google/docs/browser

**END OF EXECUTION MASTER SPECIFICATION.**
