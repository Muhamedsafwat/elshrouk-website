# Alshorouk — Art Direction Brief (binding for all build agents)

**Owner:** Creative Director / Orchestrator · **Status:** v1 — implementation brief
**Inputs:** master spec §2, §3, §5–§8 · brand PDF (docs/brand-audit.md) · reference audit (docs/reference-audit.md)

> *The clarity of a scientific distribution partner, the energy of a modern technology company, and the optimism of sunrise — built around the poultry production ecosystem.*

---

## 1. Concept — "From dawn to dawn"

**الشروق means sunrise.** The rooster announces the day; the brand curve is the horizon. The homepage is choreographed as one production day that ends with the next sunrise:

| Beat | Scene | Ground | Feeling |
|---|---|---|---|
| Dawn | 1 Hero | white | first light, clarity |
| Night-shift precision | 2 Proof | **black** | scale, seriousness |
| Morning | 3 Statement | white | calm conviction |
| Day | 4 Farm types | warm grey | detailed work |
| Noon | 5 Product pillars | **black** | depth, catalogue |
| Peak sun | 6 Journey | **vermilion** | energy, flow |
| Afternoon | 7 Values · 8 Preview | white | method |
| Field | 9 Partner proof | warm grey | relationships |
| Evening | 10 FAQ | white | answers |
| Next dawn | 11 Closing | **black** + rising sun | optimism, action |

The **Signature Curve** bookends the page (hero + closing). Each other section owns **one** Sunrise motif at most (§4).

## 2. What "premium" means here (non-negotiable craft rules)

1. **Typography leads.** Oversized Arabic display (Alexandria → Thmanyah) in black, short authored lines, generous whitespace. Never more than ~3 display lines per heading on desktop.
2. **Two-tone display headlines** (reinterpreting imtyaze): the key phrase of a headline may be **vermilion** — only at display sizes (≥ 32px; vermilion on white/black is 3.7:1 → large text only). Max one vermilion phrase per headline.
3. **Documentary photography, big.** Images are framed as editorial panels (full-bleed, tall portrait or **arch** windows), never as small thumbnails in identical cards. Black 40–60% gradient only where white text sits on photos.
4. **The arch window** is our signature photo mask: a rectangle with a fully-rounded top (`border-radius: 999px 999px 0 0` / `rounded-t-full`) — the sun on the horizon. Use it for hero-adjacent and statement images; never on every image.
5. **Hairlines over boxes.** Structure with 1px `border-line` rules, numbered indexes (Montserrat) and alignment — not with shadowed cards. Cards only where the content is a real object (product, article, category).
6. **Numbers are Montserrat** (`.num`), Western digits, tabular, tight tracking at display sizes.
7. **One accent per view.** Vermilion is the signal (CTA, active state, one phrase, one node). Amber appears at most once per view (the destination node, the rising sun). Amber is never a text background.
8. **No generic patterns:** no pastel gradients, glassmorphism, purple glows, floating 3D blobs, icon-in-circle feature grids repeated per section, stock handshake imagery, cartoon chickens, emoji.
9. **Motion is choreography, not decoration** (§6). Every animation reveals hierarchy, explains a process, or rewards progress.

## 3. Layout system

- Container: `container-site` (max 1536px, gutters clamp(20px, 6vw, 88px) → ≈86px at 1440, content ≤ 1360px). Full-bleed media may break out of it. Warm grey ground = PDF `#F6F5F3` (`data-theme="warm"`).
- Grid: `grid-site` (4 / 8 / 12 cols). Asymmetry is encouraged: 7/5, 5/7, 4/8 splits.
- Section rhythm: `section-y` (72px mobile → 176px desktop); `section-y-tight` for dense follow-ups.
- RTL: the **start** side is the right. Text columns start at the right; imagery usually sits at the inline-end (left). Use logical utilities only.
- Mobile is recomposed, not stacked blindly: headlines 2–4 lines, CTAs full-width, sticky/pinned scenes become natural flow, imagery keeps the subject visible (use focal points from `src/content/photos.ts`).

## 4. Sunrise System usage map

| Motif | Where | Rules |
|---|---|---|
| Signature Curve (`SunriseCurve`) | Hero, Closing (home) · `CtaBand` on interior pages · mobile menu | 1–3 arcs, cropped off an edge, never under body text, one group per layout |
| Distribution Flow | Proof underlines, Journey (home), How-we-work process line, solutions matrix nodes | straight lines, 45° turns, round nodes, exactly ONE amber destination node |
| Crest Pattern (`CrestPattern`) | empty areas only: 404, knowledge empty state, form asides | 10–20% opacity, never behind text |
| Veterinary Grid (`VetGrid`) | Values scene (home), about principles | 4×4, one vermilion, one black, ≤1 amber |

## 5. Homepage — scene compositions

### Scene 1 · Hero (white) — signature moment 1 "Sunrise Line Reveal"
- **Desktop ≥1024:** height `max(640px, calc(100svh - masthead))`. 12-col grid. Start (cols 1–7): eyebrow → H1 (`text-display-2xl font-extrabold`, 2 authored lines; "الدواجن" or second-line key phrase may be vermilion) → subhead (`text-lead`, ≤ 36ch) → CTA row (primary black "استكشف حلولنا" → `#farm-types`; outline "تواصل معنا" → contact) → **micro-proof strip** (three compact metrics with qualifiers, hairline-separated: proof in the first screen, spec §0.1).
- End (cols 8–12): tall **arch-window** photo (hero image, portrait 4:5 crop via focal point) revealed by a *sunrise mask* (circle growing from bottom-centre, starting large enough that the LCP image reads at first paint). Small caption chip "تسمين · بياض · أمهات" at its base.
- Signature Curve: three arcs over the photo's **lower third** (PDF p.15 "curve over the lower third"), in the **PDF orientation (never mirrored)**, cropped by the arch frame — it can never touch the copy.
- Scroll cue at the bottom start: small text + a short vertical line that loops once.
- **Mobile:** text first (H1 ~40px, 4 lines), CTAs full-width stacked, then the arch photo (aspect 4:5, subject visible), curve crossing its base. Part of the photo must be visible in the first viewport at 390×844.
- **Timeline:** 0–0.4s structure painted · 0.15–0.85s curve draws (DrawSVG, stagger 0.14) · 0.2–1.2s photo sunrise mask + scale 1.08→1 · 0.35–1.2s H1 lines rise (stagger 0.1) · 0.65–1.4s subhead/CTAs/micro-proof rise 16px · idle: one amber node travels the top arc once and rests · scroll: photo drifts ≤40px (desktop fine pointer only).

### Scene 2 · Proof (black) — signature moment 2 "Farm Network Stats"
- Title row: eyebrow + short title (display-md) at start, footnote aligned end.
- Three columns divided by vertical hairlines (stack on mobile with horizontal hairlines). Per item: qualifier **حوالي** (bold, ≥ 22px, vermilion — large text), number (`text-stat` Montserrat 800), unit (e.g. مليون, display-md), label (lead, fg-soft), a **flow underline** (line + start node + end node; the last item's end node is the single amber node).
- Motion: on entry items stagger 0.12s; each figure **counts once from ≈80% in round steps** (240→300, 12→15, 120→150; ≤1.2s, ease-out, never above the final value, width reserved → 0 CLS) via `MetricCounter`; underline draws; qualifiers are visible from the first frame. Screen readers get `srLabel`; digits are aria-hidden.

### Scene 3 · Statement (white)
- Two display lines (`text-display-xl`), second line's phrase "دعمًا متخصصًا" in vermilion. Caption below in fg-muted.
- Tall **arch-window** documentary close-up (statement photo) offset at the inline-end, overlapping the section's bottom edge slightly.
- Motion: lines rise on entry; then a scroll-linked micro-shift (line 1 x → −24px, line 2 x → +24px, scrub) and a horizon hairline that grows across the section width.

### Scene 4 · Farm types (warm grey) — signature moment 3 "Segment Scene Transitions"
- Section header (eyebrow, 2-line title, intro).
- **Desktop:** two columns. Start (≈45%): three chapters, each ≥ 80vh, with giant index (`text-index` Montserrat, vermilion), name + Latin label, title, body, three points with flow-node bullets, ArrowLink CTA to the segment route. End (≈55%): **sticky media frame** (top ≈ 96px, height ≈ calc(100vh − 140px)) stacking the three segment photos; the active chapter's photo wipes in with a clip-path from the bottom (expo.inOut ~0.9s) and the previous one scales back slightly; a 3-step progress indicator + current index overlay at the frame's base.
- **<1024:** no sticky — each chapter = photo (4:3) then text; image reveal on entry.
- Accessibility: chapters are real headings in reading order; the sticky frame never traps focus.

### Scene 5 · Product pillars (black) — signature moment 5 "Product Pillar Reveal"
- Header (eyebrow, 2-line title in white, intro) + accent CTA "تصفح كتالوج المنتجات".
- **Asymmetric 2×2** on desktop: row 1 = Feed (7 cols, tall) + Supplements (5 cols); row 2 = Medicines (5 cols) + Vaccines (7 cols). Each panel is a single link to `/products?category=<key>`: full-bleed category photo, bottom gradient, index 01–04 (Montserrat), category icon (brand grammar) in a hairline circle, name (display-md, white), body (small, white/80), "تصفح الفئة" + arrow. Hover/focus: image scale 1.04, a vermilion rule grows along the bottom, arrow nudges.
- Motion: panels reveal with clip-path inset from the bottom, staggered 0.12s; on scroll, panels drift at different rates (±20px) — subtle, desktop only. Optional pointer-follow "استكشف" badge inside panels (fine pointer only; real cursor stays visible).
- **Mobile:** single column, aspect 4:3, no parallax.

### Scene 6 · Distribution journey (vermilion) — signature moment 4 "Distribution Node Journey"
- Ground vermilion; ALL text black (5.7:1). Header at top.
- **Desktop:** an SVG flow path spanning the container, built from straight runs with **45° turns**, five white nodes at the step positions and the **amber destination node** labelled "مزرعتك" at the end (RTL: path runs right → left). Step blocks alternate above/below the line so text never sits on it.
- Motion: the path draws with scroll (scrub, start "top 70%", end "bottom 70%"), no pinning; each node fills and pops (scale 1→1.25→1) as the line reaches it, its step block rises in sync; the amber node lights last.
- **Mobile:** vertical path along the start edge with nodes; step blocks to the inline-end; draws downward with scroll.
- Note (journey.note) small at the bottom. Reduced motion: full path, all nodes lit.

### Scene 7 · Values — Veterinary Grid (white)
- Header occupies cols 1–4 (start); a **4×4 grid** occupies cols 5–12 with hairlines: four **value cells** each spanning 2 columns (index, name + Latin, one-sentence body — always visible, never hover-only), plus exactly one vermilion module, one black module, one amber module, the rest empty warm-grey modules.
- Motion: modules assemble with a diagonal stagger; accent modules land last. Hover/focus on a value cell inverts it to black/white.
- **Mobile:** values as a stacked list of bordered cells; a single row of 4 small accent modules as a divider.

### Scene 8 · Product preview (white)
- If approved products exist: header + 4–6 `ProductCard`s + "عرض كل المنتجات".
- **Zero approved products (current truth):** a designed "catalogue in preparation" panel — warm-grey block with title/body from `home.productPreview.empty*`, accent CTA "اطلب القائمة الحالية" → `/contact?type=product`, and four category chips linking to `/products?category=…`. Never fake cards.

### Scene 9 · Partner proof (warm grey)
- Editorial: the narrative paragraph set large (≈ text-display-md regular weight, measure 28–32ch on desktop) in which the three approved statements are emphasised (bold black + Montserrat numerals) and get a vermilion underline drawn as the reader scrolls past them.
- Documentary **triptych** (broilers / layers / breeders) with staggered vertical offsets and captions; subtle parallax on desktop. No people's names, no quotes, no logos.

### Scene 10 · FAQ (white)
- 5/7 split: start = eyebrow, title, "اسأل فريقنا" ArrowLink; end = `Accordion` (CMS FAQs, fallback dictionary).

### Scene 11 · Closing (black) — signature moment 6 "Closing Sunrise CTA"
- Giant headline (`text-display-2xl`, white; "احتياجاتها" in vermilion), subhead, CTAs (accent + outline white).
- Behind: a **rising sun** — a half-disc with the vermilion→amber gradient (the ONLY gradient on the page) that rises from the bottom edge as the section scrolls into view (scrub), plus the Signature Curve emerging from the lower-right and continuing off-canvas. Different from the hero: here the sun rises *behind* the line instead of the line drawing over white.

## 6. Motion system

> Measured targets from `docs/reference-audit.md` §11 are adopted where they refine this brief: reveal tokens (P10: 600–700ms, 16px travel, 70–100ms stagger, trigger at 85–90% of the viewport, one-shot), zero perpetual motion after intros (P12), native scroll with CSS sticky + ScrollTrigger toggles/scrubs only (P13, parallax ≤ 32px desktop / 0 mobile), RTL directionality (P15: flows and processes run right→left in Arabic, progress grows from the right; the Signature Curve keeps the PDF orientation), stability (P17: CLS ≤ 0.05, 0 console errors).

- Tokens: `src/lib/motion/tokens.ts`. Easings: `expo.out` for entrances (sunrise), `expo.inOut` for masks, `power3.out` for UI.
- Declarative reveals via `data-reveal="up|lines|image|fade"` (handled by `MotionRuntime`); complex scenes use their own client component with `useGSAP` (scope + automatic revert) and `data-reveal-manual`.
- Always `gsap.matchMedia()` with `mq.desktopMotion` / `mq.motion`; reduced motion ⇒ final states, no pin/parallax/count-up.
- Only transform / opacity / clip-path / stroke-dash. No layout properties. No perpetual loops; pause anything ambient off-screen.
- Never split Arabic text into characters. Lines are authored in dictionaries.

## 7. Interior page families (each must feel distinct)

| Page | Hero treatment | Signature idea |
|---|---|---|
| About | White hero: giant two-line title; full-width **monochrome→colour** dawn image (grayscale filter eases to colour on scroll) | Numbered editorial chapters 01–05 with offset reveals; "Why الشروق?" chapter presents the official logo large with clear space + the sunrise/rooster meaning; stats shown as typographic sentences (not the home counter); VetGrid for principles |
| Poultry solutions | White hero + chapter index (01/02/03 anchor list) | Three full-bleed cinematic chapters (dark overlay, giant numerals), sticky progress rail (desktop) with accessible list fallback; segments × categories matrix with flow nodes |
| Segment (×3) | Full-bleed segment photo (≈70vh) with dark gradient, label + title in white | Supply-needs 2×2, data-driven category tiles (with real counts), "how we help" steps, inquiry form prefilled with the segment, next-segment teaser with photo; reading progress bar |
| Products | Compact white hero with a prominent search field | Filter rail + results grid; designed empty catalogue (category browser + inquiry form) |
| Product detail | Clean two-column (gallery / facts) | Approved fields only, vet safety note, label PDF if approved, inquiry drawer |
| How we work | White hero, large title | Vertical precision-flow line with five big steps (distinct from the horizontal home journey); principles; compact form |
| Knowledge | Warm-grey hero | Four editorial topic tiles (crest pattern in empty area) + honest empty state |
| Contact | Short hero | Conversion-first: inquiry-type cards → fields; aside with "what happens next" and privacy note |
| Partner | Black hero with Signature Curve | Relationship types, fit criteria, three-step process, partner form |
| Privacy | Plain editorial | Sticky table of contents, comfortable measure |
| 404 / error | Giant "404" in Montserrat with crest pattern | Helpful links back home / to products |

## 8. Component usage

- Headings: `SectionHeading` (eyebrow/index + authored lines + intro). Display titles via `TextReveal`.
- Actions: `ButtonLink` (primary black · accent vermilion · outline · inverse on dark) and `ArrowLink` for tertiary links.
- Media: `Photo` (registry-driven, focal-point aware, arch/rect masks, optional reveal).
- States: `EmptyState`, `ErrorState`, `Skeleton`. Navigation helpers: `Breadcrumbs`. Closing: `CtaBand`.
- Forms: `src/components/forms/fields.tsx` primitives + `InquiryForm` (one implementation for every form on the site).

## 9. Copy & claims (reminders)

- Copy comes from `src/i18n/dictionaries`. Never hard-code Arabic/English strings in components.
- Approved metric statements verbatim with qualifiers; supplier/distributor framing; no SLAs, no medical advice; vet safety note near veterinary content.
