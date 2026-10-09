---
name: alshorouk-visual-art-direction
description: Direct premium, brand-native page compositions for Alshorouk — Sunrise System motifs, documentary poultry photography, editorial Arabic hierarchy, colour ratio and accessible CTA treatments — and review screenshots against that intent; use when designing or changing any section or page layout, choosing or cropping images, or running a visual design review.
---

# Skill: Alshorouk Visual Art Direction

Role owners: Visual Product Designer with the Brand Guardian (spec §13.5, §13.3). There is no Figma step in this build: compositions are made directly in code and judged from real browser screenshots.

## Activation
- Designing or restyling any homepage scene (spec §5, scenes 0–11) or interior page family (spec §6).
- Choosing, cropping or replacing a photograph; adding a Sunrise System motif, icon or colour field.
- Visual review rounds (Gate 2, Gate 4, Gate 7) or any "looks generic / looks like a template" feedback.

## Inputs
- Art-direction sentence (spec §2): *the clarity of a scientific distribution partner, the energy of a modern technology company, and the optimism of sunrise — built around the poultry production ecosystem.*
- Brand facts and contrast matrix: `.agents/skills/brand-extraction/SKILL.md`, `docs/brand-audit.md`; tokens in `src/styles/globals.css` (`--color-vermilion`, `--color-amber`, tints, `--ease-sunrise` …).
- `docs/reference-audit.md` (adopt/reinterpret decisions), `docs/art-direction.md` (page-specific direction and review log), `docs/motion-storyboard.md`.
- Photography: registry `src/content/photos.ts` (src, size, focal point, segment, bilingual alt, licence) and `docs/image-provenance.md`. Current set = licensed stock; commissioned photography is an open item.

## Procedure
1. **Grid and rhythm.** 12 columns desktop (max ≈ 1440–1560 px, gutters `clamp(24px, 4vw, 88px)`), 8 tablet, 4 mobile. Section spacing 120–180 px desktop, 64–104 px mobile; spacing scale 4/8/12/16/20/24/32/40/48/64/80/96/128. Radii 0–12 px (pills only for tags/controls). No glassmorphism, purple glow, giant gradients, fake bevels or stock 3-card rows repeated down the page.
2. **One prominent motif per section — never all four, never over the logo.** Proposed homepage map (confirm in `docs/art-direction.md`):

   | Scene | Field | Prominent motif / device |
   |---|---|---|
   | 1 Hero | white canvas + documentary farm image | Signature Curve (sunrise line reveal) |
   | 2 Proof 300/15m/150 | black | Distribution Flow micro-underlines |
   | 3 Statement | white, masked vertical photo panel | none — typography + horizon line |
   | 4 Segments (sticky) | white / `#FAFAF9` | numbering 01/02/03 + photo crossfade; Crest pattern only in margins |
   | 5 Product pillars | white | asymmetric 2×2 editorial index 01–04 |
   | 6 Distribution journey | black | Distribution Flow, one amber destination node |
   | 7 Values | white | Veterinary Grid 4×4 (one vermilion, one black, ≤ 1 amber) |
   | 8 Product preview | `#FAFAF9` | none — CMS cards or polished empty state |
   | 9 Partner proof | black documentary | Crest pattern tone-on-tone (never behind text) |
   | 10 FAQ | white | none |
   | 11 Closing CTA | black | Signature Curve from the lower edge, different arc from the hero |

3. **Colour discipline.** Global guideline white ≈ 55%, black ≈ 25%, vermilion ≈ 15%, amber ≤ 5% (single destination node, single grid cell, small highlight). Amber is never a text background. Vermilion→amber gradient only on large abstract shapes or the curve. Measure, don't guess — run on a full-page screenshot at 1440 and 390:
   ```python
   # python color_ratio.py screenshot.png  (Pillow + numpy; photos count as "other")
   import sys, numpy as np; from PIL import Image
   BRAND = {"white": [(255,255,255),(250,250,249),(244,244,242),(229,229,227)], "black": [(0,0,0),(23,23,23)],
            "vermilion": [(254,51,0)], "amber": [(254,184,33)]}
   px = np.asarray(Image.open(sys.argv[1]).convert("RGB"), dtype=np.int16).reshape(-1, 3)
   best = np.full(len(px), 10**6); label = np.full(len(px), "other", dtype=object)
   for name, refs in BRAND.items():
       for ref in refs:
           d = np.abs(px - np.array(ref)).sum(axis=1); hit = (d < best) & (d <= 45)
           best = np.where(hit, d, best); label = np.where(hit, name, label)
   brand = max(1, int((label != "other").sum()))
   for name in BRAND: print(f"{name:9s} {100*(label == name).sum()/brand:5.1f}% of brand pixels")
   print(f"other     {100*(label == 'other').mean():5.1f}% of all pixels")
   ```
   Flag amber > 5% or vermilion > ~20% of brand pixels; the result is a guideline check, not a pixel quota.
4. **Accessible CTA and text treatments** (contrast matrix in the brand skill): primary CTA = black text on vermilion (5.69:1) or white text on black; white-on-vermilion only for display headings ≥ 24 px bold / ≥ 32 px regular. Vermilion is never small text on white (3.69:1) — eyebrows and inline links are black with a vermilion rule, dot or underline. Focus ring 2–3 px with contrast ≥ 3:1 against both the control and its background (black or white ring on vermilion buttons).
5. **Photography direction.** Documentary, natural warm light, honest framing, close on hands and real farm work; segment-correct subjects (see the poultry-content-integrity skill). Hero: wide commercial chicken farm with the birds clearly visible; mobile hero gets its own crop/focal point — never a centre-crop that loses the subject. Text over photos only with a black 40–60% overlay, otherwise separate copy from image. Every image comes through `next/image` with explicit `sizes`, a registry entry and provenance; the single LCP hero image uses `preload` (Next 16 deprecates `priority`) or `fetchPriority="high"`.
6. **Type hierarchy.** Oversized Arabic display headline (`clamp(2.3rem, 7vw, 5.8rem)`, bold, short authored lines), medium subheads, regular body; numerals and Latin in Montserrat. One display moment per viewport; editorial white space is a brand element, not leftover.
7. **Icons.** PDF p.15 style: 24-unit grid, 2-unit stroke, round caps/joins, no fills; black on light, white on dark, vermilion for one active state. Never the PDF "Livestock" icon; "Delivery"/"Warehouse" icons only where they do not imply owned fleets or warehouses.
8. **Page families** (spec §6): About — monochrome/dawn poultry image + logo, chapter markers, no fake timeline; Solutions and segment pages — distinct hero per segment, cross-category access, inquiry CTA; Catalogue — functional first, editorial header, unbranded category visuals as image fallback; Contact — conversion-first, minimal fields; 404/error — designed, on-brand, with a way home. Design empty, loading, error and success states for each (Gate 2).
9. **Review loop.** Capture 1440 and 390 screenshots (browser-visual-qa naming), open every image, score it against the checklist below, fix, re-capture. When issues are found, run at least two polish rounds (Gate 7). Log each round in `docs/art-direction.md` (date, pages, findings, before/after paths).
10. **Distinctness test.** Swap the logo mentally: if a section would fit any agricultural template or another company, redesign it around poultry production, distribution flow or the sunrise geometry.

## Checklists
**Composition (per section)**
- [ ] Exactly one prominent Sunrise motif or none; none touching the logo.
- [ ] Clear hierarchy: one display element, readable body measure, visible next action.
- [ ] Mobile is recomposed (stacking order, crops, titles 2–4 lines), not shrunk desktop.
- [ ] At least three distinct homepage compositions; no repeated identical card rows.

**Colour and contrast**
- [ ] Ratio script run at 1440 and 390; amber ≤ 5% of brand pixels.
- [ ] No small vermilion text on white; no white text on amber; CTA pairs from the matrix.

**Imagery**
- [ ] Poultry only, segment-correct, documentary, licensed, registered with provenance and bilingual alt.
- [ ] No composited, cartoon, AI-fantasy or "pedestal" chickens; no legible fake labels; no staged handshakes.
- [ ] Hero subject visible at 320, 390, 768 and 1440; overlay present under any white text on photos.

## Deliverables
- `docs/art-direction.md`: per-scene and per-page-family direction (field, motif, image, type, states), the motif map above as approved, and a review log with screenshot paths.
- Implemented section styling in files your task owns; token or global-style needs sent to the orchestrator as diffs.
- Ratio-script output for home at 1440 and 390 attached to the report.

## Acceptance criteria
- Screenshots at 390 and 1440 show a confident black/white/vermilion hierarchy, documentary poultry imagery, oversized Arabic display type and purposeful negative space.
- Brand rules hold: one motif per section, amber ≤ 5%, no inaccessible colour pairs, logo untouched.
- Every major state (empty/loading/error/success) has a designed treatment (Gate 2).
- Two documented polish rounds when the first review finds issues.

## Failure recovery & escalation
- **No suitable licensed photo for a segment:** use a typographic or motif-led composition and record the need in `docs/open-items.md`; never use non-poultry, AI-fantasy or unlicensed images.
- **Ratio out of range:** rebalance colour fields (swap a black section for white) before touching tokens.
- **Design conflicts with accessibility:** accessibility wins; propose an alternative that keeps the brand signal (e.g. vermilion rule + black text).
- **Too close to a reference site:** reinterpret with Sunrise geometry and poultry photography; ask the reference-research owner for a derivation check.

## Spec references
§2 (art direction), §3.2–3.6, §5 (all scenes and mobile direction), §6, §7.1–7.2, §8.4 (moment 5), §13.3, §13.5, §15 Phase 2, §16.3, §17; AGENTS.md "Brand system".
