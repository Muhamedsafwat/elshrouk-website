---
name: alshorouk-brand-extraction
description: Audit the Alshorouk brand PDF and the extracted vector logo files to derive verified tokens, logo-usage rules and red flags for the poultry-only site — use before creating or changing design tokens, logo files or placements, favicons, OG images, fonts or photo treatment, and whenever output looks off-brand.
---

# Skill: Alshorouk Brand Extraction

Role owner: Brand Guardian / Design Director (spec §13.3). Tokens and logo files feed every other skill.

## Activation
Use this skill when you:
- create or edit colour, type, spacing or radius tokens (`src/styles/globals.css` `@theme`) or fonts (`src/styles/fonts.ts`) — both are orchestrator-owned: you propose the diff, you do not edit them unless your task grants it;
- add, replace, crop or place a logo (`public/brand/*`, the `<Logo>` component, header, footer, favicon, OG image, admin graphics);
- choose photo treatment, icons or a Sunrise System motif for a section;
- review a screenshot that "does not look like Alshorouk", or meet an asset that is not in `public/brand/`.

## Inputs
- `Alshorouk_Brand_Guidelines.pdf` — 21 pages, v1.0 October 2026. Always cite the 1-based **PDF page index**. The folio printed on each page is index + 1 (PDF page 8 prints "09"); never cite the folio.
- Page images rendered with PyMuPDF into your scratch folder (`fitz.open(pdf)[i].get_pixmap(dpi=110)`), plus `page.get_text()`. Never paste Arabic from the extracted text: lam-alef is broken there (`األدوية`, `اللتزام`). Retype Arabic and compare it with the page image.
- `public/brand/alshorouk-logo-{full-color,white,black}.svg` and `public/brand/extraction-meta.json` (page, bbox in pt, path count, colours).
- AGENTS.md (Brand system), spec §3, `docs/brand-audit.md`, `docs/art-direction.md`, `docs/open-items.md`.

### Verified source facts (read from the page images)
| PDF p. | Topic | Binding facts for the website |
|---|---|---|
| 3, 8 | Logo | One lockup: rooster head + wordmark `الشروق` + signature curve + descriptor `لتوزيع الأدوية واللقاحات البيطرية`. Never redraw, re-space or separate parts. Clear space x = 15% of logo width on every side. Minimum 110 px (full lockup). "Mark without descriptor" 72 px exists as a rule only — **no such artwork is supplied**. |
| 9 | Variations | Full colour on white/light grey · white on black, vermilion or dark photo · black one-colour (also shown on amber) · amber or vermilion logo on black only (special use). |
| 10 | Misuse | No stretching, rotation, recolouring, shadows/effects, transparency, busy backgrounds; no full colour on amber/red; no black on dark. |
| 11 | Colour | `#FE3300` vermilion (action, brand signal) · `#FEB821` amber (highlight) · `#000000` · `#FFFFFF`; tints 60/40/20 + 50% shade; black 80/60/20 + warm grey. Ratio white 55 / black 25 / vermilion 15 / amber ≤ 5. Amber is never a text-block background. Vermilion→amber gradient only on large abstract areas and the curve. |
| 12 | Type | Thmanyah (Arabic) + Montserrat (Latin **and all figures**); no third family. Headline heavy/bold 32–56 px, 110%; subhead medium 20–28 px, 120%; body 16 px, 150–170%; caption 12 px, 140%. Arabic right-aligned, never justify short lines, Western digits 0–9, English at 90% in mixed lines, no kashida. |
| 13 | Sunrise System | Signature curve (1–3 parallel arcs, cropped off an edge, one group per layout) · Distribution flow (straight lines, 45° turns, round nodes, one amber destination) · Crest pattern (three overlapping circles, 10–20% tone, never behind text) · Veterinary grid (4×4; one vermilion, one black, ≤ 1 amber). Never all four together; never over the logo. |
| 14 | Photography | Documentary, natural warm light, honest framing; avoid stock smiles, cartoons, composited animals on white, pets, heavy filters; black 40–60% overlay under white text; licensed or commissioned only. |
| 15 | Icons | 24-unit grid, 2-unit stroke, round caps/joins, 2-unit radius, no fills; black on light, white on dark, vermilion for one active state only. |
| 21 | Digital | White pages, black text, vermilion for actions, amber for single highlights, curve in hero areas. |

**Banned PDF content (outdated or unverified):** the "Livestock" icon (p.15); cow/sheep/goat imagery and composited storefront cut-outs (p.14 note, p.19); "herds", "dairy and livestock farm managers", "not a poultry-only brand" (pp.4–5); sample claims "Delivered within 24 hours…" and "Store between 2–8 °C…" (p.6), the "24h" data post and `لقاحات في موعدها` (p.21); value lines promising cold chain or on-time delivery (p.5). Packaging category bands (p.20) are a print system, not web category colours.

## Procedure
1. **Render and read.** Render all 21 pages into `<scratch>/pdf/`, open every page you rely on as an image, and list the pages consulted in your report.
2. **Verify the logo files before using or replacing them.** They are true vectors taken from the PDF drawing list (`page.get_drawings()` → filled paths offset to the bbox): full colour from p.3 (58 paths: 54 `#000000`, 2 `#FE3300`, 2 `#FEB821`), white and black one-colour from p.9 (54 paths each). The p.9 black card is drawn in `#030303`; the file normalises it to the palette's `#000000` — keep that note in `docs/brand-audit.md`.
   - Raster check: render the PDF clip (`page.get_pixmap(matrix=fitz.Matrix(6, 6), clip=fitz.Rect(*bbox_pt))`) and the SVG at the same pixel size (PyMuPDF opens SVG), composite on the card background, `PIL.ImageChops.difference` → mean absolute difference and the share of pixels differing by > 32 and > 96 levels; save a side-by-side PNG and actually look at it.
   - Baseline measured 2026-10-09 at 6×: full colour mean 1.23, > 96: 0.41%; white 4.01 / 1.70%; black 5.06 / 2.10% (small 92 pt cards — the residue is edge anti-aliasing; side-by-side is visually identical). A re-extraction must not exceed these and must look identical.
   - Record the SHA-256 of each SVG in `docs/brand-audit.md`. A hash change without a new audit entry is a regression.
3. **Never manufacture logo artwork.** No tracing, AI redraw, re-typesetting the descriptor, deleting the descriptor to fake a "mark only", recolouring paths (other than the documented `#030303` normalisation) or re-spacing. If a variant is needed (e.g. amber on black), extract it from p.9 with step 2 or record a request in `docs/open-items.md`.
4. **Placement rules for `<Logo>`** (verify the component, do not fork it):
   - Variant by ground: white/light → full colour; black, dark photo or vermilion → white; amber → black. Never full colour on vermilion or amber.
   - Width: header desktop 125–155 px, mobile 112–128 px, never < 110 px. Clear space = 15% of rendered width on all sides (140 px logo → 21 px).
   - Keep the intrinsic aspect ratio from `extraction-meta.json` (full colour 255.192 × 237.145): `height: auto`, no `object-fit: cover`, no filters, opacity, blend modes, shadows, rotation or CSS recolouring. Accessible name `الشروق` / `Alshorouk`, not repeated as visible text.
5. **Favicon / app icon.** Only a crop of the official emblem paths (rooster head) — never new art. The full lockup is illegible at 16–48 px. Produce candidates from the vector paths, mark them `review_required`, keep the favicon item open in `docs/open-items.md` until the client approves. Note: the Payload admin references `/favicon.svg` (`src/payload.config.ts`) — it must also come from this approved source.
6. **Tokens.** Derive only from pp.11–12: four brand colours, documented tints, the spec §3.2 neutrals flagged as derived (`#FAFAF9 #F4F4F2 #E5E5E3 #707070 #171717`), headline `clamp(2.3rem, 7vw, 5.8rem)` tuned to the face actually loaded, body 16–18 px with 1.6–1.75 Arabic leading. Propose the `@theme` diff to the orchestrator; components never contain raw hex values.
7. **Contrast matrix** (computed with the WCAG formula): white on vermilion **3.69:1** (the PDF prints 3.4:1) → large headings only (house rule ≥ 24 px bold / ≥ 32 px regular); vermilion text on white 3.69:1 → large text, icons, underlines and borders only, never body links or small eyebrows; black on vermilion 5.69:1 ✓; black on amber 12.09:1 ✓; white on amber 1.74:1 ✗ never; vermilion on black 5.69:1 ✓; `#707070` on white 4.95:1 ✓ but on `#F4F4F2` only 4.50:1 (avoid for small text).
8. **Fonts.** Thmanyah is licensed and absent: never download, mirror, subset or commit it from an unofficial source. Use the staging fallback in `src/styles/fonts.ts` and keep the Thmanyah item open. Montserrat (OFL) through `next/font` covers Latin text and Western digits.
9. **Write it down.** Update `docs/brand-audit.md`: pages consulted, token table, logo provenance (page, bbox, path count, colours, hashes, diff metrics, compare-image path), contrast matrix, banned-content list, gaps (→ `docs/open-items.md`).

## Checklists
**Logo QA (each placement, at 390 and 1440 px)**
- [ ] File served from `public/brand/` unchanged (hash matches `docs/brand-audit.md`).
- [ ] Correct variant for the ground; no full colour on vermilion/amber; no black on dark.
- [ ] Rendered width ≥ 110 px; bounding-box ratio equals the source ratio (± 1%).
- [ ] 15% clear space free of text, edges, images, neighbouring focus rings and sticky bars.
- [ ] No shadow, filter, opacity < 1, blend mode, rotation, gradient or animation applied to the lockup.
- [ ] No Sunrise motif over or touching the logo.

**Token QA**
- [ ] `@theme` contains only the four brand colours, documented tints and the flagged neutrals.
- [ ] `rg -n "#[0-9a-fA-F]{3,8}\b" src --glob '!src/styles/**' --glob '!src/payload/**'` finds no ad-hoc colours in components.
- [ ] Amber never a text-block background; gradients only on large abstract shapes or the curve.
- [ ] Every text/background pair in use appears in the contrast matrix and passes for its size.
- [ ] Figures render in Montserrat with Western digits; no third family is loaded.

**Red-flag sweep**
- [ ] No livestock icon or imagery, no "herds"/dairy wording carried over from the PDF.
- [ ] No PDF sample claims (24 h delivery, 2–8 °C storage, "on time", cold-chain promises).

## Deliverables
- `docs/brand-audit.md` (sections listed in step 9) with evidence paths.
- Approved logo files only in `public/brand/` with `extraction-meta.json` provenance.
- A token proposal (diff text) for `src/styles/globals.css` / `src/styles/fonts.ts`, sent to the orchestrator.
- New or updated entries in `docs/open-items.md` (Thmanyah, original logo files, mark-only artwork, favicon approval).
- A report marking each deliverable `implemented` / `verified` / `blocked` / `needs_review`.

## Acceptance criteria
- Logo SVGs byte-identical to the audited versions, or re-audited with diff metrics ≤ baseline and a visually identical side-by-side.
- No cow/sheep/goat/livestock imagery or wording anywhere in brand assets.
- Exact hex values; contrast matrix covers every pair used; clear space verified in header and footer screenshots at 390 and 1440.
- Every gap is recorded as an open item with owner and fallback — nothing is silently invented.

## Failure recovery & escalation
- **Diff above baseline or visible mismatch:** do not ship. Re-extract from the same page and check the path selection (the short horizon dashes either side of the head are separate paths — missing them means an incomplete lockup). If it still fails, keep the last verified files and escalate the "original logo files" open item (owner: brand/client).
- **Variant or size not available** (mark-only, small favicon, amber-on-black): do not create one. Use the full lockup at ≥ 110 px or omit, and record the request.
- **Font licence unknown:** stay on the staging fallback; never load Thmanyah from a CDN mirror or a font-sharing site.
- **PDF vs user instruction** (livestock, "not poultry-only"): the user's poultry-only instruction wins (precedence 1); the logo and its descriptor stay unchanged (precedence 2).
- **PDF contrast figure vs computed value:** apply the stricter result.

## Spec references
§0.3 (precedence and known tension), §3.1–3.6, §13.3, §14.4 (template), §15 Phase 0–1, §16.3 (logo bullet), §19 item 1, §21 Q4; AGENTS.md "Brand system".
