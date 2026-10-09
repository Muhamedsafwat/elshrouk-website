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
- **`docs/art-direction.md` — the binding brief** (concept, ground sequence, Sunrise usage map, scene compositions, page families, component usage); `docs/reference-audit.md` (adopt/reinterpret decisions); `docs/motion-storyboard.md`.
- Photography: registry `src/content/photos.ts` (src, size, focal point, segment, bilingual alt, licence) and `docs/image-provenance.md`. Current set = licensed stock; commissioned photography is an open item.

## Procedure
1. **Work from the binding brief.** `docs/art-direction.md` (concept "From dawn to dawn") fixes the homepage ground sequence — 1 white · 2 black · 3 white · 4 warm grey · 5 black · 6 vermilion · 7–8 white · 9 warm grey · 10 white · 11 black — plus the scene compositions (§5), interior page families (§7), the arch-window photo mask and the component vocabulary (§8). Use the layout utilities it defines (`container-site`, `grid-site` 4/8/12 columns, `section-y`); spacing, radii and type sizes come from tokens. Change the brief (through the orchestrator) before changing a scene's concept in code.
2. **Sunrise motifs — one prominent motif per section, never all four together, never over or touching the logo.** Usage map from the brief §4: Signature Curve bookends the page (hero + closing) and appears on interior `CtaBand`s and the mobile menu; Distribution Flow for the proof underlines, the home journey, the how-we-work process line and the solutions matrix (exactly one amber destination node); Crest Pattern only in empty areas (404, knowledge empty state, form asides) at 10–20% tone, never behind text; Veterinary Grid for the values scene and the About principles (one vermilion, one black, ≤ 1 amber module). No glassmorphism, purple glow, pastel or giant gradients, fake bevels, floating blobs or repeated icon-in-circle card rows.
3. **Colour discipline.** Global guideline white ≈ 55%, black ≈ 25%, vermilion ≈ 15%, amber ≤ 5% (destination node, rising sun, one grid module). Amber is never a text background; the vermilion→amber gradient appears only on large abstract shapes or the curve (the brief allows it once on the home page: the closing rising sun). Measure, don't guess — run on full-page screenshots at 1440 and 390:
   ```python
   # python color_ratio.py screenshot.png  (Pillow + numpy; photos count as "other")
   import sys, numpy as np; from PIL import Image
   BRAND = {"white": [(255,255,255),(246,245,243)], "black": [(0,0,0),(51,51,51)],  # warm grey / #333 per brand audit
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
4. **Accessible CTA and text treatments** (contrast matrix in the brand skill and `docs/brand-audit.md` §3.6): `ButtonLink` variants — primary black (white label), accent vermilion with a **black** label (5.69:1), outline, inverse on dark; white-on-vermilion only for display headings ≥ 24 px bold / ≥ 32 px regular. Two-tone headlines may set one key phrase in vermilion, display sizes only (≥ 32 px), one phrase per headline. Vermilion is never small text on white (3.69:1) — eyebrows and inline links are black with a vermilion rule, dot or underline; small vermilion-family text uses the 50 % shade token. Focus ring 2–3 px with ≥ 3:1 contrast against both the control and its background (black or white ring on vermilion buttons).
5. **Photography direction.** Documentary, natural warm light, honest framing, close on hands and real farm work; segment-correct subjects (see the poultry-content-integrity skill). Hero: wide commercial chicken farm with the birds clearly visible; mobile hero gets its own crop/focal point — never a centre-crop that loses the subject. Text over photos only with a black 40–60% overlay, otherwise separate copy from image. Every image comes through `next/image` with explicit `sizes`, a registry entry and provenance; the single LCP hero image uses `preload` (Next 16 deprecates `priority`) or `fetchPriority="high"`. Local sources must match `images.localPatterns` in `next.config.ts` (static imports, `/brand/**`, CMS media) and `quality` must be one of the configured `images.qualities`, otherwise images fail or are coerced.
6. **Type hierarchy.** Oversized Arabic display headline (short authored lines, ~3 display lines max on desktop), medium subheads, regular body; numerals and Latin in Montserrat. Display sizes above the PDF's 56 px (the spec's `clamp(2.3rem, 7vw, 5.8rem)` hero) are staging-only until brand-audit item O7 is approved. One display moment per viewport; editorial white space is a brand element, not leftover.
7. **Icons.** PDF p.15 grammar: 24-unit grid, 2-unit stroke, round caps/joins, no fills; black on light, white on dark, vermilion for one active state. Never the PDF "Livestock" icon; "Delivery"/"Warehouse" icons only where they imply no owned fleet or warehouse. New icons drawn to this grammar (poultry, feed, segments) need brand approval (brand-audit O8) — until then use text labels and photography.
8. **Page families** follow the brief §7 (About chapters + monochrome→colour dawn image; solutions chapters with progress rail; segment heroes; functional catalogue with designed empty state; two-column product detail; vertical how-we-work flow; conversion-first contact; black partner hero; plain privacy; designed 404). Design empty, loading, error and success states for each (Gate 2).
9. **Review loop.** Capture 1440 and 390 screenshots (browser-visual-qa naming), open every image, score it against the checklist below, fix, re-capture. When issues are found, run at least two polish rounds (Gate 7). Log each round in `docs/test-report.md` § Polish rounds (date, pages, findings, before/after paths); propose brief changes to the orchestrator, who owns `docs/art-direction.md`.
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
- Section and page implementations that match `docs/art-direction.md`; proposed brief changes (with screenshots) sent to its owner, the orchestrator.
- Review-round entries with screenshot paths in `docs/test-report.md`.
- Implemented section styling in files your task owns; token or global-style needs sent to the orchestrator as diffs.
- Ratio-script output for home at 1440 and 390 attached to the report.

## Acceptance criteria
- Screenshots at 390 and 1440 show a confident black/white/vermilion hierarchy, documentary poultry imagery, oversized Arabic display type and purposeful negative space.
- Brand rules hold: one motif per section, amber ≤ 5%, no inaccessible colour pairs, logo untouched.
- Every major state (empty/loading/error/success) has a designed treatment (Gate 2).
- Two documented polish rounds when the first review finds issues.

## Failure recovery & escalation
- **No suitable licensed photo for a segment:** use a typographic or motif-led composition and record the need in `docs/open-items.md`; never use non-poultry, AI-fantasy or unlicensed images.
- **Ratio out of range:** reduce accent area inside sections first (oversized vermilion panels, extra amber); if the ground sequence itself is the cause, propose a change to the brief rather than editing tokens.
- **Design conflicts with accessibility:** accessibility wins; propose an alternative that keeps the brand signal (e.g. vermilion rule + black text).
- **Too close to a reference site:** reinterpret with Sunrise geometry and poultry photography; ask the reference-research owner for a derivation check.

## Spec references
§2 (art direction), §3.2–3.6, §5 (all scenes and mobile direction), §6, §7.1–7.2, §8.4 (moment 5), §13.3, §13.5, §15 Phase 2, §16.3, §17; AGENTS.md "Brand system".
