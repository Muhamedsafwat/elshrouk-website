# Alshorouk (الشروق): Brand Audit, PDF to Website Production Rules

| | |
|---|---|
| Source | `Alshorouk_Brand_Guidelines.pdf`: "Brand Guidelines · دليل الهوية البصرية", v1.0 · October 2026. 21 landscape pages (841.9 × 595.9 pt). Producer: Chromium (Skia/PDF m141). Created 2026-10-02. |
| Role | Brand Guardian / Design Director (spec §13.3) |
| Date | 2026-10-09 |
| Status | `needs_review`. All measurements in this file are verified and reproducible (Appendix A). The brand-owner decisions in §10.2 are still open. |
| Binding inputs | `AGENTS.md`; `ALSHOROUK_ANTIGRAVITY_MASTER_BUILD_SPEC.md` §0.3, §1, §3 |
| Related files | `public/brand/*.svg`, `public/brand/extraction-meta.json`, `docs/art-direction.md`, `docs/image-provenance.md`, `docs/open-items.md` |

---

## Quick reference (the rules most often needed)

1. **Poultry (chickens) only.** The PDF's mixed-livestock positioning, audience, imagery and its "Livestock" icon are outdated. They are banned on the website (§9).
2. **Colours:** vermilion `#FE3300`, amber `#FEB821`, black `#000000`, white `#FFFFFF`, warm grey `#F6F5F3`. The tints, shades and greys are listed in §2. Target page share: white ~55%, black ~25%, vermilion ~15%, amber ≤5%. Amber is never a text-block background.
3. **Contrast:** white on vermilion measures **3.69:1**, so it is allowed only for display headings ≥24 px bold or ≥32 px regular. Black on vermilion is **5.69:1** and black on amber is **12.09:1**; both pass at every size. Vermilion text on white is 3.69:1, so the same large-only rule applies. Vermilion text on black is 5.69:1 and passes. Amber with white or light grey fails at every size (§3).
4. **Gradient:** two stops only, `#FE3300` → `#FEB821`, linear, in sRGB. Use it only on Sunrise curves or large abstract shapes. Never on text, the logo or any UI control.
5. **Typography:** Thmanyah for Arabic. It is licensed and not in the repo, so it is a **blocker**; staging uses one OFL face. Montserrat is used for Latin text **and every figure**. Digits are Western 0–9 (`nu-latn`). The scale is headline 32–56 px / 1.1, subhead 20–28 px / 1.2, body 16 px / 1.7 for Arabic and 1.6 for English (the PDF allows 150–170%), and caption 12 px / 1.4. Never justify text, never use kashida, and set English at 90% inside Arabic text.
6. **Logo:** use the three extracted SVGs, and only through `<Logo>`. Clear space is 15% of the rendered width on every side. Minimum width is 110 px. The full-colour version goes on white or warm grey only. No version may be redrawn, recoloured, re-spaced, split, shadowed, made transparent or given a gradient. The descriptor-less mark and a favicon are **not supplied** (§5).
7. **Sunrise System:** one motif per major section. The four motifs are never used together and never over the logo. The hero uses the Signature Curve only (§7).
8. **Photography:** documentary, warm natural light, licensed or commissioned only, poultry subjects only. White text sits on a 60% black overlay by default; a lighter overlay needs a measured contrast pass (§3.5, §8.1).
9. **Icons:** 24-unit grid, 2-unit stroke, round caps and joins, no fills. They are black on light grounds, white on dark grounds, and vermilion only for the one active state (§8.2).
10. **Digital rule from the PDF (p.21 / f.22):** "white pages, black text, vermilion for actions, amber for single highlights, curve in hero areas".

---

## 0. How to use this document

### 0.1 Precedence (`AGENTS.md`, spec §0.3)
1. The user's latest explicit instructions: poultry only. The livestock imagery and positioning in the PDF are outdated.
2. The official logo artwork and palette from the PDF. These are never altered.
3. The PDF's brand strategy, wherever it is consistent with poultry-only positioning.
4. Verified business data and approved CMS data.
5. The master spec's proposed UX, copy, architecture and motion.
6. The reference sites, which are a guide to craft only.

Where this audit and the master spec disagree on a visual standard, the PDF (ranks 2–3) wins. Each such conflict is recorded in §10.

### 0.2 Page references
- `p.N` is **physical page N of the PDF file** (1–21). The spec §3.1, the renders `page-NN.png` and `extraction-meta.json` all use this numbering.
- `f.NN` is the **folio printed in the page footer**. It always equals p.N + 1, and the cover has no folio. For example, the Colour system page is p.11 / f.12 and Social & digital is p.21 / f.22. The orchestrator brief and some notes quote folios, so this file gives both numbers everywhere.
- The Contents page (p.2) lists chapters at "03 / 07 / 16". Those are the *physical* page numbers of the chapter dividers (p.3, p.7, p.16), not their folios (f.04, f.08, f.17). This is a quirk of the document only and has no effect on design.

### 0.3 Labels used below
- **PDF rule:** stated in the PDF, quoted or closely paraphrased.
- **Measured:** read from the PDF's vector content (PyMuPDF) or from its rasters (Pillow). Every measured value is reproducible (Appendix A).
- **Web rule:** this audit's binding translation for the website.
- **Interpretation:** a reasoned application where the PDF is silent. The brand owner may overrule it.

---

## 1. Page-by-page audit (all 21 pages)

| p. / f. | Section | Content | Applies to the website | Outdated, banned or caution |
|---|---|---|---|---|
| 1 / — | Cover | Full-colour lockup. Three Signature Curves (vermilion, amber, black) cropped off the right edge. "Brand Guidelines / دليل الهوية البصرية". Subtitle: "Identity system for Alshorouk, veterinary medicines and vaccines distribution." Top strip: black (30% width), then vermilion. | Reference geometry for the Signature Curve (§7.2). Logo on white. | The subtitle reflects the old general-veterinary positioning and is not website copy. |
| 2 / 03 | Contents | Three chapters, numbered 03 / 07 / 16. | Nothing. | The TOC numbers are physical pages, not folios (§0.2). |
| 3 / 04 | Ch.1 divider | "01 Brand Strategy / الاستراتيجية: Who Alshorouk is, what it stands for and how it speaks." Large full-colour lockup (255.2 × 237.1 pt). | **Source of the master logo extraction** (58 vector paths, §6). | None. |
| 4 / 05 | 1.1–1.2 Story, vision, mission | Headline: "Alshorouk means sunrise. Every morning, healthy herds and flocks depend on medicines arriving on time." Rooster story: "first to announce the day … alert, upright, early." Arabic line: «الشروق شريك موثوق لتوزيع الأدوية واللقاحات البيطرية، يصل في موعده ويحفظ الجودة في كل خطوة.» Vision and mission. | The meaning of the name (sunrise) and the rooster story for the About page's heritage section. The personality cues "alert, upright, early". | **"herds"** is banned. "Arriving on time", «يصل في موعده ويحفظ الجودة» and the mission's "correctly stored … on schedule" are unverified operational claims. The vision's "the distributor vets call first" must be reinterpreted. "Vets, farms and clinics" becomes poultry farms (§9). |
| 5 / 06 | 1.3–1.5 Values, positioning, audience, personality | Values: Integrity · الأمانة, Precision · الدقة, Reliability · الالتزام, Expertise · الخبرة, each with a one-line definition. Positioning. Audience. Personality: "Professional, steady, alert, direct. Strong without aggression. Confident without exaggeration." | The four value **names**. The personality line. The comparative structure of the positioning statement. | The value *definitions* contain unverified claims: cold chain, batch and dose; deliveries arriving when promised; veterinary knowledge behind every order. "Not … a poultry-only brand" is overridden by the user. The audience list includes **dairy and livestock** (banned) and clinics or pharmacies (unconfirmed) (§9). |
| 6 / 07 | 1.6–1.9 Tone of voice & messaging | A "We are / We are not / In action" table. "Primary line: لتوزيع الأدوية واللقاحات البيطرية". "The descriptor is part of the logo and is never rewritten. No English slogan exists in the source identity; any new line requires approval. Example figures in sample copy are illustrative only." | Voice: clear and factual, knowledgeable, respectful of vets. It is never hype, jargon-heavy, salesy or folksy. The descriptor is immutable. Any new line needs approval. | The sample lines are **illustrative only** and are never published: "Delivered within 24 hours to registered clinics.", "Store between 2–8 °C on receipt." and «نوفر لك اللقاح الأصلي في موعده.» |
| 7 / 08 | Ch.2 divider | "02 Visual Identity", with the same lockup as p.3. | None. | None. |
| 8 / 09 | 2.1–2.3 The logo | "One lockup: rooster head, Arabic wordmark, signature curve, descriptor." The crest is the most recognisable shape. The dashes echo the horizon. "Never redraw, re-space or separate the parts." Clear space x = 15% of the logo's width. Minimum size 28 mm / 110 px. Mark without descriptor 18 mm / 72 px. Embroidery 45 mm. | All of it (§5). | The 72 px mark without descriptor is described but **its artwork is not supplied**. |
| 9 / 10 | 2.4 Logo variations | Eight cards plus a legend (§5.4). | The white and black one-colour variants, which are extracted. The usage legend. | The amber and vermilion "on black only" versions are for special use only. An eighth, **unlabelled card** shows a black logo on `#555555`, which is not approved. The bottom-row drawings are scaled +0.88% vertically (§6). |
| 10 / 11 | 2.5 Logo misuse | Eight prohibitions (§5.5). | All of it. | None. |
| 11 / 12 | 2.6–2.8 Colour system | Four core colours with their roles. Tints and shades. The warm grey. The usage ratio. Contrast notes. The gradient. | All of it (§2–§3). | The PDF's "3.4:1" understates the computed **3.69:1**. Its "60" swatches differ from true 60% mixes (§2.2). |
| 12 / 13 | 2.9–2.12 Typography | Thmanyah plus Montserrat. "No third family." "This PDF previews with substitute fonts." The type scale. Alignment, numbers, mixed text, kashida. | All of it (§4). | The specimen is set in DejaVu Sans substitutes, **not Thmanyah**. |
| 13 / 14 | 2.13–2.17 Sunrise System | Signature curve, distribution flow, crest pattern and veterinary grid, plus Why / Where / How much / Never. | All of it (§7). | The samples drift from their own rules: the flow's diagonals run at ≈54–58° and the crest pattern is drawn at 25%. Follow the rule text. |
| 14 / 15 | 2.18–2.19 Photography | Subjects, style, things to avoid, treatment, overlay ("Black 40–60% under white text"), cropping ("Curve over the lower third") and rights. A note about **cow, sheep and chicken cut-outs**. | Style, treatment, cropping and rights. The subjects, adapted to poultry (§8.1). | Cold-chain storage, warehouse picking, loading and delivery may appear only if they show real, verified operations. Composited and cut-out animals are banned. A 40% overlay can fail WCAG (§3.5). |
| 15 / 16 | 2.20 Iconography | The icon spec and eight icons: Medicine, Vaccination, Delivery, Warehouse, Quality, Poultry, **Livestock**, Veterinary. | The spec. Medicine, Vaccination and Veterinary. Delivery, Warehouse and Quality with care (§8.2). | **The Livestock icon is banned.** It also reads as a cat, which would make it pet imagery. The "Poultry" glyph reads as a tulip. |
| 16 / 17 | Ch.3 divider | "03 Applications", with the lockup. | None. | None. |
| 17 / 18 | 3.1–3.5 Stationery & stamp | Photographic mockups. Business card (90 × 50 mm, logo top-right). Letterhead (A4, 20 mm margins, black footer rule). Vermilion folder with white logo. Black ID card with white logo and vermilion bar. Stamp: one-colour black logo in an oval. | These confirm the pairings white logo on vermilion and white logo on black. Print logic. | The mockups are renders in which the **descriptor is re-typeset** (§6 F5). Do not use them as imagery or as a logo source. |
| 18 / 19 | 3.6–3.9 Environment & signage | Reception: metal logo on a black wall. Exterior: halo-lit full-colour logo. Warehouse: zone bands. Directional: black panel, white text, vermilion arrow. Event: vermilion backdrop with a curve across the base. "One logo per surface; 3× clear space." | "One logo per surface", interpreted as one per viewport (§5.6). The directional pattern can inspire wayfinding UI. | The mockups do not prove that offices or warehouses exist. The 3× clear space applies to signage only. |
| 19 / 20 | 3.8–3.9 Storefront & outdoor | A storefront window with **cow, goat and hen cut-outs** over a red filled wave, inside a retail-pharmacy setting. An outdoor flag banner. Rules: logo at eye level in the upper third; "Documentary photography only"; "Curve: Crops off one edge"; "Text: Max five lines". | "Documentary photography only." The curve crops off one edge. | **The storefront imagery is banned** (non-poultry animals, composited cut-outs, retail setting). The red wave is not the Signature Curve. |
| 20 / 21 | 3.10–3.16 Packaging, shipping & fleet | Carton, label roll and a truck labelled "Delivery vehicle: current livery". Brand zone. **Category band "Vermilion: vaccines · Black: antibiotics · Amber: supplements."** Product info with a "species icon". Fleet: "curve and phone in lower third". | Nothing directly. | The category-band colours are for **packaging only** and are not website colour coding. The species icon is not used. The fleet imagery is no evidence of a fleet. The page is no source for a phone number. |
| 21 / 22 | 3.17–3.22 Social media & digital | Tiles: Announcement «لقاحات في موعدها»; Data post "**24h**" (marked sample); a Corporate logo tile; Recruitment «نوظف». Rules for posts, stories, carousels and post types. **"Website, email and presentations follow the same rules: white pages, black text, vermilion for actions, amber for single highlights, curve in hero areas."** | The digital rule (§8.3). The post rules, which shape OG and share images. | "24h" and «لقاحات في موعدها» are illustrative only. Recruitment is out of scope because the site has no jobs page. |

---

## 2. Colour

### 2.1 Core palette (PDF rule, p.11 / f.12; exact values)

| Token (proposed) | PDF name | Hex | RGB | PDF role |
|---|---|---|---|---|
| `vermilion` | Vibrant Vermilion | `#FE3300` | 254 51 0 | Action, brand signal |
| `amber` | Golden Amber | `#FEB821` | 254 184 33 | Highlight, warmth |
| `black` | Deep Black | `#000000` | 0 0 0 | Text, structure |
| `white` | Pure White | `#FFFFFF` | 255 255 255 | Space, clarity |

Measured: the vector fills on p.11 match exactly. The content stream holds `.9961 .2 0` = `#FE3300` and `.9961 .7216 .1294` = `#FEB821`. The PDF also calls vermilion "Red": "Red 15%" on the usage bar, "Amber / red" in the variations legend, "No full colour on amber / red" on the misuse page. These are the same colour, and the website always calls it *vermilion*.

### 2.2 Tints and shades of vermilion and amber

Formula: a tint at strength *p* = colour·p + white·(1−p) per sRGB channel. The 50% shade = colour·0.5 + black·0.5. Values are rounded half-up.

| Step | Computed (formula) | PDF swatch (vector fill) | Match | Value to use |
|---|---|---|---|---|
| Vermilion 50% shade | `#7F1A00` (127, 25.5, 0) | `#7F1900` | ±1 rounding | `#7F1900` |
| Vermilion 100 | `#FE3300` | `#FE3300` | exact | `#FE3300` |
| Vermilion 60 | `#FE8566` | `#FE7A55` | **differs** | `#FE7A55` (PDF), pending O5 |
| Vermilion 40 | `#FFAD99` | `#FFAD99` | exact | `#FFAD99` |
| Vermilion 20 | `#FFD6CC` | `#FFD6CC` | exact | `#FFD6CC` |
| Amber 50% shade | `#7F5C11` (127, 92, 16.5) | `#7F5C10` | ±1 rounding | `#7F5C10` |
| Amber 100 | `#FEB821` | `#FEB821` | exact | `#FEB821` |
| Amber 60 | `#FED47A` | `#FED168` | **differs** | `#FED168` (PDF), pending O5 |
| Amber 40 | `#FFE3A6` | `#FFE3A6` | exact | `#FFE3A6` |
| Amber 20 | `#FFF1D3` | `#FFF1D3` | exact | `#FFF1D3` |

The PDF's "60" swatches are not a single-strength sRGB mix. Solving each channel gives a different *p* (≈0.65–0.68). The 40, 20 and shade swatches do match the formula. **Decision D2:** the PDF swatch values are canonical, because the palette is never altered (precedence rank 2). The formula values are kept here only for reference. Open item O5 asks the brand owner which value is intended.

### 2.3 Black and grey ramp, plus warm grey

| PDF label | Computed (black at *p* over white) | PDF swatch | Match | Value to use |
|---|---|---|---|---|
| 100 | `#000000` | `#000000` | exact | `#000000` |
| 80 | `#333333` | `#333333` | exact | `#333333` |
| 60 | `#666666` | `#767676` | **differs** | `#767676` (PDF), pending O5 |
| 20 | `#CCCCCC` | `#CCCCCC` | exact | `#CCCCCC` |
| Warm grey | (a named swatch, no formula) | `#F6F5F3` | n/a | **`#F6F5F3`** |

**The warm grey sampled with Pillow, as requested.** The sample comes from `page-11.png` (p.11 / f.12, 110 dpi). Inside the swatch, the pixel box (551, 634)–(626, 656) holds 1,650 pixels, all with one value: **`#F5F5F2`** (245, 245, 242). The vector fill of the same swatch is `0.9647 0.9608 0.9529 rg`, which is **`#F6F5F3`** (246, 245, 243). The one-step difference comes from rasteriser truncation: every swatch reads 0–1 lower in the PNG (the vermilion shade `#7F1900`, for example, renders as `#7E1800`). **The canonical value is `#F6F5F3`.** The PDF also uses this fill for its cards on p.4, p.5, p.8, p.12, p.14 and p.15, and for the Veterinary Grid's ground on p.13. Pillow reads `#F5F5F2` on each of them.

The grey 60 swatch `#767676` is the lightest grey that still reaches 4.5:1 on white (4.54:1). It fails on warm grey (4.17:1), so it must never be used for text on warm grey (§3).

**Inks observed in the PDF's own layout.** These are not palette swatches and must not be added as brand colours. Headings use `#111111`, body text `#444444`, photo captions `#666666`, running headers and meta text `#777777`, and hairlines `#DDDDDD`.

### 2.4 Verifying the derived neutrals in spec §3.2

The spec asked for these to be "verified against identity". None of them appears in the PDF.

| Spec token | Spec value | In the PDF? | Replace with |
|---|---|---|---|
| `--neutral-050` | `#FAFAF9` | no | drop it and use white |
| `--neutral-100` | `#F4F4F2` | no (close to warm grey) | `#F6F5F3` |
| `--neutral-200` | `#E5E5E3` | no | `#DDDDDD` (hairline, decorative only) or `#CCCCCC` (grey 20) |
| `--neutral-500` | `#707070` | no | `#767676` (grey 60) |
| `--neutral-900` | `#171717` | no | `#000000` for text; `#333333` (grey 80) for secondary dark elements |

### 2.5 Usage ratio (PDF rule)

The PDF states: "White leads. Amber is 5% or less and never a text-block background." The usage bar reads White 55% · Black 25% · Red 15%, with an unlabelled amber remainder. Measured widths of the bar's segments are 54.1% white, 24.8% black, 15.3% vermilion and 5.8% amber.

Web rules:
- The ratio applies to each page as a whole, not to every viewport (spec §3.2). Photography is excluded from the count.
- White and warm grey form the canvas. Black carries text, structure and full-bleed dark chapters. Vermilion is for actions and brand signal. Amber is for **single highlights** only.
- Amber is never a text-block background, and neither are amber tints (an interpretation of the rule's intent). It is never a large field. Use at most one amber accent per view: a destination node, one grid module or one highlighted figure.
- Review heuristic (not a gate): take a full-page screenshot without photographs. If amber exceeds about 5% or vermilion about 20%, send the page for design review.

### 2.6 Gradient

PDF rule: "The sunrise: vermilion to amber. Large abstract areas and the curve only; never on text or the logo."

Measured on p.11: the bar is an axial shading (PDF ShadingType 2) with function type 2 and N = 1, meaning a linear blend with exactly two stops. It runs from C0 `#FE3300` to C1 `#FEB821` in DeviceRGB, left to right. Its midpoint renders as `#FE7510`, which matches the sRGB midpoint `#FE7611`.

Web rules:
- `linear-gradient(<any angle>, #FE3300, #FEB821)`: exactly two stops with the default sRGB interpolation.
- It is allowed on Signature Curve strokes and on large abstract sunrise shapes, such as the hero or the closing CTA.
- It is never allowed on text (including `background-clip: text`), the logo, buttons or other controls, icons, borders, photo overlays, or areas behind body copy. Never add a third stop or another hue. Radial, conic and fade-to-transparent versions are not defined, so they need approval first (O15).
- Gradient areas count against the amber budget of ≤5%.
- If a heading must sit on a gradient, it is black only (5.69:1 at the vermilion end). White fails there (it ranges from 3.69:1 down to 1.74:1).

### 2.7 Proposed tokens for `src/styles/globals.css`

The orchestrator owns that file; these are proposals. Every value is a vector fill taken from p.11.

```css
@theme {
  --color-*: initial;               /* remove Tailwind's default palette so no off-brand colour (e.g. amber-500) can slip in */

  --color-vermilion: #FE3300;
  --color-amber: #FEB821;
  --color-black: #000000;
  --color-white: #FFFFFF;

  --color-vermilion-shade: #7F1900; /* PDF "50% shade"; also the ink for small vermilion-family text (10.29:1 on white) */
  --color-vermilion-60: #FE7A55;    /* PDF swatch; the formula gives #FE8566 (O5) */
  --color-vermilion-40: #FFAD99;
  --color-vermilion-20: #FFD6CC;

  --color-amber-shade: #7F5C10;
  --color-amber-60: #FED168;        /* PDF swatch; the formula gives #FED47A (O5) */
  --color-amber-40: #FFE3A6;
  --color-amber-20: #FFF1D3;

  --color-grey-80: #333333;
  --color-grey-60: #767676;         /* PDF swatch; the formula gives #666666 (O5). Never for text on warm grey */
  --color-grey-20: #CCCCCC;
  --color-warm-grey: #F6F5F3;
  --color-hairline: #DDDDDD;        /* rule colour observed in the PDF; decorative only */
}
:root {
  --gradient-sunrise: linear-gradient(90deg, #FE3300, #FEB821);
  --overlay-photo: rgb(0 0 0 / 0.6);  /* §3.5 */
  --logo-clearspace-ratio: 0.15;      /* §5.2 */
  --logo-min-width: 110px;            /* §5.3 */
}
```

---

## 3. Contrast (WCAG 2.x, computed exactly)

### 3.1 Method
- Relative luminance: L = 0.2126 R + 0.7152 G + 0.0722 B. Each channel *c* = value/255 is linearised as c/12.92 when c ≤ 0.04045, otherwise as ((c + 0.055)/1.055)^2.4.
- Contrast ratio = (L_lighter + 0.05) / (L_darker + 0.05).
- Thresholds are the same in WCAG 2.1 and 2.2:
  - Normal text: AA 4.5:1, AAA 7:1.
  - Large text: AA 3:1, AAA 4.5:1. Large means ≥ 24 px regular or ≥ 18.66 px bold.
  - UI components and meaningful graphics (1.4.11): 3:1.
- Logotypes are exempt from 1.4.3, so placement of the logo is governed by the brand rules in §5 rather than by a ratio.
- Luminance values: `#000000` 0; `#FFFFFF` 1; `#FE3300` 0.23438; `#FEB821` 0.55462; `#F6F5F3` 0.91369; `#333333` 0.03310; `#767676` 0.18116; `#CCCCCC` 0.60383; `#7F1900` 0.05207.

### 3.2 Full matrix (the ratio is symmetric)

| | Black `#000000` | White `#FFFFFF` | Vermilion `#FE3300` | Amber `#FEB821` | Warm grey `#F6F5F3` | Grey 80 `#333333` | Grey 60 `#767676` | Grey 20 `#CCCCCC` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **Black** | n/a | 21.00 | 5.69 | 12.09 | 19.27 | 1.66 | 4.62 | 13.08 |
| **White** | 21.00 | n/a | 3.69 | 1.74 | 1.09 | 12.63 | 4.54 | 1.61 |
| **Vermilion** | 5.69 | 3.69 | n/a | 2.13 | 3.39 | 3.42 | 1.23 | 2.30 |
| **Amber** | 12.09 | 1.74 | 2.13 | n/a | 1.59 | 7.28 | 2.62 | 1.08 |
| **Warm grey** | 19.27 | 1.09 | 3.39 | 1.59 | n/a | 11.60 | 4.17 | 1.47 |
| **Grey 80** | 1.66 | 12.63 | 3.42 | 7.28 | 11.60 | n/a | 2.78 | 7.87 |
| **Grey 60** | 4.62 | 4.54 | 1.23 | 2.62 | 4.17 | 2.78 | n/a | 2.83 |
| **Grey 20** | 13.08 | 1.61 | 2.30 | 1.08 | 1.47 | 7.87 | 2.83 | n/a |

### 3.3 Pass or fail for the pairs that matter

Columns: normal text AA ≥ 4.5; large text AA ≥ 3.0; UI and graphics ≥ 3.0; normal text AAA ≥ 7.0.

| Foreground on background | Ratio | Normal | Large | UI | AAA | Web rule |
|---|---:|:-:|:-:|:-:|:-:|---|
| Black on white | 21.00 | pass | pass | pass | pass | Default text. |
| White on black | 21.00 | pass | pass | pass | pass | Default text in dark sections. |
| **White on vermilion** | **3.69** | **fail** | pass | pass | fail | **Display headings only: ≥24 px bold or ≥32 px regular.** |
| **Black on vermilion** | **5.69** | **pass** | pass | pass | fail | Default label colour on vermilion buttons and panels. |
| **Black on amber** | **12.09** | **pass** | pass | pass | pass | The only text colour allowed on amber. |
| **Vermilion on white** | **3.69** | **fail** | pass | pass | fail | Large text and graphics only (same threshold as white on vermilion). |
| **Vermilion on black** | **5.69** | **pass** | pass | pass | fail | Allowed at every size. |
| Vermilion on warm grey | 3.39 | fail | pass | pass | fail | Large text and graphics only. |
| Amber on black | 12.09 | pass | pass | pass | pass | Allowed for a single highlight on black. |
| Amber on white | 1.74 | fail | fail | fail | fail | Never text, icons or meaningful marks; decorative fills only. |
| White on amber | 1.74 | fail | fail | fail | fail | Never. |
| Vermilion on amber, or amber on vermilion | 2.13 | fail | fail | fail | fail | Never text. The amber node on vermilion is decorative or must be ringed (§7.2). |
| Amber on warm grey | 1.59 | fail | fail | fail | fail | Decorative only. |
| Black on warm grey | 19.27 | pass | pass | pass | pass | Default text on cards. |
| Grey 80 `#333333` on white | 12.63 | pass | pass | pass | pass | Secondary text. |
| Grey 80 `#333333` on warm grey | 11.60 | pass | pass | pass | pass | Secondary text on cards. |
| Grey 60 `#767676` on white | 4.54 | pass | pass | pass | fail | Muted text and input borders, on white only. |
| Grey 60 `#767676` on warm grey | 4.17 | **fail** | pass | pass | fail | Never text on warm grey; borders are fine. |
| Grey 60 `#767676` on black | 4.62 | pass | pass | pass | fail | Muted text on black. Avoid it for long passages. |
| Grey 20 `#CCCCCC` on black | 13.08 | pass | pass | pass | pass | Secondary text on black. |
| Grey 20 `#CCCCCC` on white | 1.61 | fail | fail | fail | fail | Decorative dividers only, never a control's only boundary. |
| Hairline `#DDDDDD` on white | 1.36 | fail | fail | fail | fail | Decorative only. |
| White on grey 80 `#333333` | 12.63 | pass | pass | pass | pass | Allowed. |
| Vermilion on grey 80 `#333333` | 3.42 | fail | pass | pass | fail | Large text and graphics only. |
| Amber on grey 80 `#333333` | 7.28 | pass | pass | pass | pass | Allowed. |
| Vermilion shade `#7F1900` on white | 10.29 | pass | pass | pass | pass | Small vermilion-family text: errors and link hover. |
| Vermilion shade `#7F1900` on warm grey | 9.44 | pass | pass | pass | pass | Allowed. |
| Black on vermilion 20 `#FFD6CC` | 15.74 | pass | pass | pass | pass | Allowed for tags and alerts. |
| Black on amber 20 `#FFF1D3` | 18.77 | pass | pass | pass | pass | A single-word highlight (`<mark>`) only, never a block. |
| PDF meta ink `#777777` on white | 4.48 | **fail** | pass | pass | fail | Do not copy the PDF's meta grey; use `#767676` or darker. |
| `#666666` (formula grey 60) on white / warm grey | 5.74 / 5.27 | pass | pass | pass | fail | Reference only (O5). |
| PDF body ink `#444444` on white / warm grey | 9.74 / 8.94 | pass | pass | pass | pass | Not a palette colour (§2.3). |
| `#030303` on `#555555` (unlabelled p.9 card) | 2.77 | fail | fail | fail | fail | Confirms why that card is not an approved variation (§5.4). |

### 3.4 The five pairs flagged in the brief
1. **White on vermilion: 3.69:1.** It fails for normal text and passes for large text and UI. The project rule in `AGENTS.md` is stricter than WCAG's large-text definition: use it for display headings ≥ 24 px bold or ≥ 32 px regular only. Never use it for body copy, captions, button labels, form text or small links. The PDF prints this ratio as "3.4:1"; the computed value is 3.69:1, and the restriction holds either way.
2. **Black on vermilion: 5.69:1.** It passes AA at every size, though not AAA for normal text. This is the accessible label colour for vermilion actions.
3. **Black on amber: 12.09:1.** It passes AAA, which agrees with the PDF's "Black on amber passes at all sizes."
4. **Vermilion text on white: 3.69:1** (3.39:1 on warm grey). It is allowed for large text only, under the same threshold as point 1. Inline links in body copy are black text with a vermilion underline. Small vermilion-family text uses the vermilion shade `#7F1900` (10.29:1). The PDF itself sets 6.8–9 pt vermilion labels and running headers on white; do not copy that at small sizes.
5. **Vermilion text on black: 5.69:1.** It passes AA at every size.

### 3.5 Photo overlay: what "Black 40–60% under white text" guarantees

In the worst case, the pixel under the text is pure white. A black overlay at opacity *a* turns that pixel into the grey (1−a)·255:

| Overlay | Worst-case ground | White text | Verdict |
|---|---|---:|---|
| 40% | `#999999` | 2.85:1 | fails even large text |
| 50% | `#808080` | 3.95:1 | large text only |
| 60% | `#666666` | 5.74:1 | AA for normal text |
| 70% | `#4D4D4D` | 8.45:1 | AAA |

The minimum worst-case overlay is 41.7% to reach 3:1, 53.5% to reach 4.5:1 and 65.1% to reach 7:1.
**Web rule (D5):** the default is **60%** black under white text, which is the top of the PDF's range. Use 40–50% only when the measured luminance of the actual image region under the text gives ≥ 4.5:1 (or ≥ 3:1 for large-only text), and record that measurement in QA. A gradient overlay is fine as long as it reaches ≥ 60% under the text block.

### 3.6 Contrast-safe component recipes (web rules)
- **Primary action, on a light or black ground:** vermilion fill with a **black** label (5.69:1). On hover, switch to a black fill with a white label (21:1). Never put a white label on vermilion below 24 px bold.
- **Primary action, on a vermilion ground:** a black fill with a white label, or a white fill with a black label.
- **Secondary action:** a black fill or a black outline. **Never** an amber or gradient button.
- **Links in body copy:** black text with a 2 px vermilion underline offset below the text. Hover adds a thicker underline or switches to `#7F1900` text. On black, links may be vermilion text (5.69:1) or white text.
- **Focus:** a 3 px solid ring offset by 2 px. It is black on white, warm-grey, amber and vermilion grounds, and white on black and photo grounds. A vermilion ring passes on white (3.69:1) and black (5.69:1) but must never be the only ring on a vermilion ground.
- **Form fields:** the border is `#767676` (4.54:1 on white and 4.17:1 on warm grey, both ≥ 3:1). Text is black. Placeholders use `#767676` on white only. Errors use `#7F1900` text plus an icon; a vermilion border is fine because it counts as a graphic (3.69:1).
- **Dark sections:** body text is white. Secondary text is `#CCCCCC` (13.08:1). Accents may be vermilion or amber.
- **Warm-grey cards:** text is black or `#333333`. Never use `#767676` text on them. Vermilion appears only as a decorative rule or in headings ≥ 24 px bold.
- **Hairlines `#DDDDDD` and `#CCCCCC`:** decorative only, and never the sole boundary of a control.

---

## 4. Typography

### 4.1 Families (PDF p.12 / f.13)
- **Arabic: Thmanyah (خط ثمانية).** The PDF says: "its geometric, open forms match the wordmark." The font is licensed and is **not in the repo**; do not download it. This is a **BLOCKER (O1)** for production typography.
- **Latin text and all figures: Montserrat**, "a geometric sans with matching proportions". It is OFL-licensed and may be self-hosted, for example through `next/font`.
- **"No third family."** This rules out decorative Arabic scripts and any extra display face.
- Measured: the PDF previews its type with substitutes. DejaVu Sans Bold sets the «خط ثمانية» specimen. DejaVu Sans sets the Arabic alphabet, the digits and the weight names. Unnamed Type 3 fonts set the Latin text. Neither Thmanyah nor Montserrat is embedded, so the specimen is **not** a reference for how Thmanyah looks. The PDF itself says: "install licensed Thmanyah for production."
- Weights shown in the PDF: خفيف · عادي · متوسط · ثقيل · ثقيل جداً (light, regular, medium, heavy, extra heavy). Roles: headlines use Heavy/bold = **700**, subheads use Medium = **500**, and body and captions use Regular = **400**. Light and extra-heavy have no assigned role, so they stay unused unless the brand owner approves a role for them.

### 4.2 Scale: PDF values and web tokens

| Level | PDF weight | PDF print / digital | PDF leading | Web token (fluid from 360 to 1440 px viewport) | Line-height |
|---|---|---|---|---|---|
| Headline · عنوان رئيسي | Heavy / bold (700) | 36–60 pt / **32–56 px** | 110% | `clamp(2rem, 1.5rem + 2.2222vw, 3.5rem)` | 1.1 |
| Subhead · عنوان فرعي | Medium (500) | 18–24 pt / **20–28 px** | 120% | `clamp(1.25rem, 1.0833rem + 0.7407vw, 1.75rem)` | 1.2 |
| Body · نص أساسي | Regular (400) | 9–11 pt / **16 px** | 150–170% | `1rem` | Arabic 1.7 · English 1.6 |
| Caption · تعليق | Regular (400) | 7–8 pt / **12 px** | 140% | `0.75rem` | 1.4 |

Resolved sizes for headline / subhead: 32/20 px at ≤ 360 px, 32.7/20.2 at 390, 41.1/23.0 at 768, 46.8/24.9 at 1024, 52.4/26.8 at 1280, and 56/28 at ≥ 1440.

Conflicts with the spec, each resolved by precedence:
- The spec's §3.3 headline `clamp(2.3rem, 7vw, 5.8rem)` (36.8 to 92.8 px) goes past the PDF's 56 px ceiling. Keep it as a **`display` extension for the homepage hero only**, in staging, until the brand owner approves it (O7). Every other headline stays within 32–56 px.
- The spec allows body text of 16–18 px. The PDF says 16 px, so use 16 px. Set intro paragraphs as **subhead** (20 px Medium) rather than inventing an 18 px level.
- For leading, the spec gives 1.6–1.75 for Arabic and the PDF gives 1.5–1.7. The values chosen (1.7 for Arabic, 1.6 for English) sit inside both ranges.

### 4.3 Rules (PDF rule, then web rule)
- **Alignment.** PDF: "Arabic right (RTL), English left." Web: use `text-align: start` with the correct `dir` and `lang` attributes.
- **Justification and kashida.** PDF: "Never justify short lines"; "Avoid letter stretching in running text." Web: **no `text-align: justify` anywhere.** Browsers justify either by widening word gaps or by stretching letters, and the PDF rules out both. Never insert tatweel (U+0640) to stretch text, and never use `text-justify: kashida`.
- **Numbers.** PDF: "Western digits 0–9", set in Montserrat. Web: `Intl` formatting must force Latin digits. Use `new Intl.NumberFormat('ar-EG', { numberingSystem: 'latn' })` or the locale tag `ar-EG-u-nu-latn`, and do the same for dates. Plain `ar-EG` outputs Arabic-Indic digits (٠١٢٣), which are forbidden. This resolves the spec's call for "locale-aware digit formatting" in Scene 2: keep locale-aware grouping, but always with Latin digits.
- **Mixed text.** PDF: "English at 90% of Arabic size." Web: Latin runs inside Arabic text are set at `0.9em` in Montserrat. Display figures, such as the 300 / 15 / 150 statistics, are set directly in Montserrat at their token size.
- **Arabic letter-spacing is always 0,** because tracking breaks the joins between letters. Set `font-synthesis: none` so no faux bold or italic appears, and never italicise Arabic.
- **Line length:** 60–75 characters per line (spec §3.3).
- **Mask reveals:** keep the 1.1 headline leading. Add padding on the block axis inside `overflow: hidden` wrappers so dots, descenders and marks are not clipped (spec §7.1).

### 4.4 Font-stack sketch (for the orchestrator-owned `src/styles/fonts.ts`)
- Arabic contexts: first a Montserrat `@font-face` limited by `unicode-range` to Latin letters and digits, with `size-adjust: 90%`; then Thmanyah; then the OFL staging face; then system Arabic fallbacks. The result is that Latin letters and digits come from Montserrat at 90%, and Arabic letters come from Thmanyah or the staging face.
- English contexts: Montserrat at 100%.
- Use `font-display: swap`. Subset each font. Preload the body weight only. Never block rendering while waiting for Thmanyah (spec §12.3). Use metric overrides (`ascent-override`, `size-adjust`) to keep layout shift low when fonts swap.

### 4.5 Staging fallback plan (until O1 is resolved)
- Use **one** OFL-licensed Arabic face. The orchestrator chooses it and documents it in `src/styles/fonts.ts`, with its licence file kept in the repo.
- Selection criteria: geometric construction with low stroke contrast and open counters, to echo the wordmark; weights 400, 500 and 700 available; clear at 12–16 px; subsettable.
- Candidates that fit, all OFL on Google Fonts (check the licence file at selection time): IBM Plex Sans Arabic, Readex Pro, Alexandria, Noto Kufi Arabic.
- Never present the staging face as the brand font. `docs/open-items.md` keeps the entry "Typography blocker: licensed Thmanyah (WOFF2) plus web-embedding rights".
- Swap procedure when Thmanyah arrives:
  1. Change the family in the stack.
  2. Re-test the 1.1 headline leading and the mask padding.
  3. Re-test line breaks at 320 and 390 px.
  4. Re-test layout shift (CLS).
  5. Re-shoot the screenshot set.

---

## 5. Logo

### 5.1 Anatomy (PDF p.8 / f.09)
The PDF says: "One lockup: rooster head, Arabic wordmark, signature curve, descriptor." "The crest is the most recognisable shape. The short dashes either side of the head echo the horizon. Never redraw, re-space or separate the parts."

Measured parts of the master SVG, numbered in document order from 0:
- **Rooster head:** crest outline 51; vermilion crest fill 52; the head, beak and wattle contour plus the neck and feather strokes 46–50; vermilion wattle 53; amber beak 54–55, with its nostril 57; eye 56.
- **Horizon dashes:** 0 and 38.
- **Wordmark «الشروق»:** 39–45.
- **Signature curve** (the arc under the wordmark): 2.
- **Descriptor:** 1 and 3–37.

Three further facts about the artwork:
- **The face and neck have no fill;** they are transparent. This is why the full-colour master works only on white or light grounds.
- **The descriptor is drawn as «لتوزيع الادوية واللقاحات البيطرية»,** with no hamza on the alif of «الادوية». The PDF's typeset "Primary line" (p.6) spells it «الأدوية». Never "correct" the artwork. In live text such as alt text and metadata, use «الأدوية».
- **The descriptor stays in place** even though the website also covers feed and feed supplements (spec §0.3). Feed lines are presented in page copy and are never added to the lockup.

### 5.2 Clear space
PDF rule: "Clear space x = 15% of logo width, on every side." "No text, edges or imagery enter this zone."
- **Web rule:** the padding equals 0.15 × the rendered logo width on all four sides. That zone must stay free of the header's bottom edge, border or shadow, of nav items and CTAs, of curves and of photo edges.
- Measured: the dashed frame on p.8 is wider than x. Its margins are 74.1 pt left, 74.2 pt right, 41.5 pt top and 43.5 pt bottom, around a lockup 214.7 pt wide, where x = 32.2 pt. The frame is illustrative; the rule text governs.
- Signage uses 3× clear space (p.18 / f.19). That applies to physical environments only.

### 5.3 Minimum sizes

| Lockup | Print | Digital | Status |
|---|---|---|---|
| Full lockup | 28 mm | **110 px wide** | Available in three SVGs. |
| Mark without descriptor | 18 mm | **72 px** | **Artwork not supplied.** Deleting the descriptor ourselves would be "separating the parts", so it cannot be derived (O3). |
| Embroidery | 45 mm | n/a | Not relevant to the website. |

**Web rule:** the full lockup is never narrower than 110 CSS px, in any variant, at any breakpoint. This includes the footer, email and OG images.

### 5.4 Variations (PDF p.9 / f.10)
The legend reads: Full colour, "Preferred on white or light grey". White, "On black, vermilion or dark photo areas". Black, "Single-colour print, stamps, tape, forms". Amber / red, "Only on black, special use".

| Card (PDF caption) | Ground | Fill (measured) | Extracted file | Website use |
|---|---|---|---|---|
| Full colour · light | white | master colours (58 paths) | `alshorouk-logo-full-color.svg` (taken from p.3) | **Allowed on white and warm grey `#F6F5F3` only.** Never on black, vermilion, amber, photographs or patterns, because the transparent face would show through. |
| White · dark | black | `#FFFFFF` | `alshorouk-logo-white.svg` | **Allowed** on black sections, the footer, and calm dark photo areas under the overlay. |
| White · vermilion | vermilion | `#FFFFFF` (same drawing) | same white file | **Allowed** on vermilion panels. |
| Black · amber | amber | `#030303` | same drawing as the black file (§6 F2) | **Caution.** Amber panels are not a website surface because amber is capped at 5%. Use only in a small approved amber tile. |
| Black · one colour | white | `#030303`, normalised to `#000000` | `alshorouk-logo-black.svg` | **Allowed** for the print stylesheet and other monochrome contexts. It does not replace the full-colour logo on white screens. |
| Amber · on black only | black | `#FFB724` | not extracted | **Not used** without approval. It is for special use only, and its fill differs from `#FEB821`. |
| Vermilion · on black only | black | `#FE3300` | not extracted | **Not used** without approval. It is for special use only. |
| *(unlabelled 8th card)* | `#555555` | `#030303` | not extracted | **Not an approved variation.** It contradicts "No black on dark" and measures 2.77:1 (O6). |

All one-colour cards share **one official 54-path drawing** in which the crest, beak and wattle are outlines. That drawing is not a recolour of the 58-path full-colour master.

### 5.5 Misuse: never do any of the following
From p.10 / f.11:
1. Stretch.
2. Rotate.
3. Recolour.
4. Add shadows or effects.
5. Place the full-colour logo on amber or red.
6. Place the black logo on a dark ground.
7. Apply transparency.
8. Place it on a busy background.

From elsewhere in the PDF:
9. Redraw, re-space or separate the parts (p.8).
10. Put the gradient on the logo (p.11).
11. Place a Sunrise motif over the logo, or let a motif dominate it (p.13).
12. Rewrite the descriptor, or add a slogan or English line to the lockup (p.6).

From the spec (§3.4, §5) and the web translation:
13. Trace it, approximate it with AI, or rebuild it as 3D, a sculpture or a spinning rooster.
14. Apply CSS filters such as `drop-shadow`, `invert`, `hue-rotate` or `grayscale`.
15. Leave `opacity < 1` at rest.
16. Animate individual parts, for example drawing the rooster on, revealing it with a mask, or splitting it into pieces. On entrance, the whole lockup may fade or translate as one unit, within 300 ms.
17. Change its colour on hover.
18. Crop it, for example with `overflow: hidden` or inside a circular avatar.
19. Add an outline or stroke.
20. Set it inside a line of text or a headline.
21. Put the full-colour version on a photograph.
22. Distort its aspect ratio (§5.6).

### 5.6 Header sizing (spec §3.4), computed
The spec asks for a desktop width of 125–155 px "if legible and clear zone allows", 112–128 px on mobile, and visual verification. The lockup is almost square: 255.192 × 237.145, so width ÷ height = 1.0761. Its width therefore drives a tall header.

| Logo width (px) | Logo height | Clear space x | Footprint including clear space (W × H) |
|---|---:|---:|---|
| 110 (minimum) | 102.2 | 16.5 | 143.0 × 135.2 |
| 112 | 104.1 | 16.8 | 145.6 × 137.7 |
| 120 | 111.5 | 18.0 | 156.0 × 147.5 |
| 125 | 116.2 | 18.75 | 162.5 × 153.7 |
| 128 | 118.9 | 19.2 | 166.4 × 157.3 |
| 140 | 130.1 | 21.0 | 182.0 × 172.1 |
| 155 | 144.0 | 23.25 | 201.5 × 190.5 |

The white file's heights at 110 / 140 / 155 px are 102.0 / 129.8 / 143.7, and the black file's are 102.9 / 131.0 / 145.0. Each file has its own viewBox (§6).

Consequences for UX and visual design (interpretation, recorded as decision D9):
- At the top of the page, the header zone is about 154–191 px tall on desktop (logo 125–155 px) and 138–157 px on mobile (logo 112–128 px).
- A sticky bar that keeps the logo must stay at least 135 px tall, which is too heavy on phones. Recommended instead:
  - **Desktop:** after the hero, use a compact sticky bar *without* the logo (navigation and CTA only).
  - **Mobile:** use a non-sticky header plus the spec's minimal sticky CTA.
- The lockup is never shrunk below 110 px to fit a bar. If the brand owner supplies the descriptor-less mark (O3), a compact sticky header with the 72 px mark becomes possible.
- Size the logo by **width only** and let the height follow each file's viewBox (`height: auto`). Never set `preserveAspectRatio="none"` or `object-fit: fill`.
- Place the logo at the start edge: top-right in Arabic, which matches the PDF's "logo top-right" on business cards and social posts. In English it goes top-left (interpretation).
- **One logo per viewport,** interpreting p.18's "One logo per surface". Do not repeat the lockup in the hero while the header logo is visible. A feature-size logo lower down the About page ("brand heritage") is fine.
- Accessible name: `alt="الشروق"` in Arabic and "Alshorouk" in English when the logo is the home link. Do not repeat the descriptor in the alt text.

### 5.7 Other digital placements (interpretation)
- **Footer on black:** the white variant, at 110 px or wider.
- **Print stylesheet:** the black one-colour variant.
- **Emails:** the full-colour logo on white, as a PNG exported from the official SVG at 2× (a format conversion only).
- **OG and social share images:** follow the post rules on p.21 (logo top-right, headline right-aligned, curve at the base, 8% margin). Use the full-colour logo on white, or the white logo on black or vermilion.
- **Forced colours (Windows contrast themes):** keep the logo legible. Either set `forced-color-adjust: none` and put it on a white backplate, or swap to the black one-colour file.
- **No automatic dark theme.** The identity is white-led, and the full-colour master is defined for light grounds only (D15).

### 5.8 Favicon and app icon: needs brand-owner approval (O4)
- The PDF supplies no favicon, no app icon and no square mark.
- The full lockup cannot work at 16–48 px, because its minimum is 110 px.
- The only allowed route is **a subset of the official vector paths: the rooster head**, which is paths 46–57 of the master SVG. These are the crest outline and its vermilion fill, the head contour with the neck and feather strokes, the vermilion wattle, the amber beak with its nostril, and the eye. In master units the subset spans x 72.29–175.18 and y 0–142.74, a portrait shape of about 0.72:1. Place these paths **unmodified** on a square canvas: no redrawing, no simplification and no new strokes.
- The face is unfilled, so a browser-tab icon needs a backplate: either a white tile, or a black tile behind the head from the one-colour drawing. That container is a further decision that also needs approval.
- Status: a candidate may be prepared for review, but nothing ships as final until it is approved. The same applies to `apple-touch-icon`, the manifest icons and any loader. The spec's Scene 0 "rooster-outline loading state" is **not allowed**, because it would animate or separate parts of the logo. If a loader is ever needed, use a Signature Curve line (D10).

---

## 6. Extraction provenance

**Method (orchestrator).** PyMuPDF's `page.get_drawings()` converts each filled path to SVG path data. There is no tracing and no redrawing; coordinates are only translated into a tight viewBox, with PDF points kept at 1:1 as user units. The metadata is in `public/brand/extraction-meta.json`.

| File | Source | Paths | Colours | viewBox | Bounding box on the page (pt) |
|---|---|---|---|---|---|
| `alshorouk-logo-full-color.svg` | p.3 / f.04, drawings #3–#60 | 58 | `#000000`×54, `#FE3300`×2, `#FEB821`×2 | 255.192 × 237.145 | 515.837, 153.607 – 771.029, 390.752 |
| `alshorouk-logo-white.svg` | p.9 / f.10, card "White · dark" | 54 | `#FFFFFF`×54 | 92.319 × 85.615 | 280.441, 130.386 – 372.760, 216.001 |
| `alshorouk-logo-black.svg` | p.9 / f.10, card "Black · one colour" | 54 | `#000000`×54 (source `#030303`, normalised to Deep Black) | 92.319 × 86.372 | 92.191, 263.128 – 184.510, 349.501 |

- The face and neck of the master have no fill, so it is **for white or light grounds only**.
- The one-colour files come from a **different official 54-path drawing**, in which the crest, beak and wattle are outlines. They are not a recolour of the master.

**Verification (orchestrator).** Each SVG was rendered against its PDF clip at 6× zoom, composited on the source ground. The mean absolute difference was **1.229/255** for the full-colour file, **4.011** for the white and **5.063** for the black. The remaining differences are anti-aliasing along edges, and a side-by-side inspection showed them identical.

**Independent re-check (Brand Guardian, 2026-10-09).**
- Each SVG was rendered with MuPDF and compared with its PDF clip at 6×, without sub-pixel alignment. The mean absolute differences were **1.40 / 4.73 / 5.29** (out of 255), which is consistent with the orchestrator's figures: the residuals are edge pixels from a one-pixel grid offset.
- A side-by-side visual check found all three identical.
- Path counts and fills were re-counted from the files: 58 paths for full colour, 54 white, 54 black. The colours match the table above.
- The master contains no white path, which confirms the transparent face.
- **Result: the extraction is faithful to the PDF.**

Findings that matter for production:
- **F1. The aspect ratio differs between PDF instances.** The most likely cause is that the HTML-to-PDF layout (Chromium) placed the same artwork at slightly different non-uniform scales. Measured width ÷ height of the full-colour lockup:
  - 1.0723 on the p.1 cover;
  - 1.0761 on p.3, p.7 and p.16 (the extracted master);
  - 1.0814 on p.8;
  - 1.0783 on the p.9 top row and p.21;
  - 1.0689 on the p.9 bottom row.

  The total spread is about 1.2%. The artwork's native ratio cannot be proven from the PDF alone (O2). The effect on screen is no more than about 2 px of height at 155 px width, which is visually negligible.
- **F2. The bottom row of p.9 is stretched vertically.** That row ("Black · one colour", "Amber · on black only", "Vermilion · on black only" and the unlabelled card) is scaled by **+0.884%** on the vertical axis compared with the top row. A point-by-point check over every path found the x coordinates identical (maximum difference 0.0001 pt) and every y coordinate multiplied by 1.00884–1.00885. The top-row "Black · amber" card contains the **identical black drawing at top-row scale**, with a maximum point difference of 0.0001 pt from "White · dark".

  *Optional, low priority:* re-extract `alshorouk-logo-black.svg` from the "Black · amber" card, which also uses `#030303`. The white and black files would then share identical geometry (viewBox 92.319 × 85.615).
- **F3.** "Amber · on black only" is filled `#FFB724`, not `#FEB821`. It was not extracted. If it is ever needed, the brand owner must approve it and confirm the colour.
- **F4.** The unlabelled eighth card (a `#030303` logo on `#555555`, 2.77:1) was not extracted and is not approved (O6).
- **F5. Mockups are not sources.** The application pages (p.17–p.20) are JPEG mockups (1120 × 1500 and 1500 × 837 px). The stamp, storefront, outdoor banner, carton and truck all re-typeset the descriptor in another typeface, with a hamza on «الأدوية». The storefront and exterior signs also fill the face. These mockups are never a logo source.
- **F6.** Every correct-usage logo instance in the PDF is vector. Raster renderings of the logo appear only in two places: the misuse examples on p.10 (the "Do not recolour" and "No shadows or effects" cards, both PNG) and the photographic mockups on p.17–p.20.
- **F7. Not available from the PDF:** the mark without descriptor (O3), a favicon or app icon (O4), and the original design files in AI, EPS or SVG (O2).

---

## 7. Sunrise System (PDF p.13 / f.14)

### 7.1 System rules
- PDF rules:
  - **Why:** "Replaces stock decoration with shapes from the logo."
  - **Where:** "Vehicles, packaging, social, signage, print."
  - **How much:** "One asset per layout; the logo stays dominant."
  - **Never:** "Combine all four, or place over the logo."
- **Web rule:** a "layout" is one major section, meaning one viewport-scale composition. Each major section uses **one motif at most**. Two motifs never share a section, and all four never appear in a single page view. No motif enters the logo's clear space or animates across the logo.

### 7.2 The four motifs

#### Signature Curve
**PDF rule:** "The arc under the wordmark, extended as 1–3 parallel lines, cropped off the edge. Vehicles, covers, banners. One group per layout." Related rules elsewhere:
- "Cropping: Curve over the lower third" (p.14).
- "curve in hero areas" (p.21).
- "Curve: Crops off one edge" (p.19).
- "curve across base" for events (p.18).
- "curve at base" for posts (p.21).

**Measured reference geometry,** recovered as SVG path data from the PDF content streams:
- **p.13 sample:** viewBox `0 0 200 130`, black ground, stroke 2 (1% of the width).
  - `M0 110 C70 85 140 55 200 15`: vermilion.
  - `M0 120 C80 98 150 72 200 38`: amber.
  - `M0 128 C90 110 160 92 200 60`: white at 50% opacity (renders as `#7E7E7E`).
- **p.1 cover:** a drawing 400 units wide, anchored top-right and cropped by the page edge, on a white ground.
  - `M0 280 C120 230 260 140 400 20`: vermilion, stroke 4.
  - `M0 295 C130 250 270 180 400 70`: amber, stroke 4.
  - `M0 310 C140 270 280 220 400 120`: black, stroke 2.
- **p.21 "Announcement" tile:** a tile 200 units wide, black ground. `M0 50 C60 40 130 25 200 0`: vermilion, stroke 3.
- The order is always vermilion, then amber, then a third line that is black on light grounds and white at 50% on dark grounds. The lines fan slightly apart toward the cropped edge rather than being strict offsets. They use butt caps.

**Web rules:**
- Use 1–3 smooth single-arc lines: one cubic Bézier each, with no S-bends, no waves and no filled swooshes. They enter or leave through one edge, which crops them. Only one group per section.
- The `SunriseCurve` component should be built from the geometry above. Scale it uniformly and keep the PDF's order and colours.
- The stroke is about 1–1.5% of the drawing's width (0.5% for the black line on the cover), and never thinner than 1.5 px on screen. The gradient (§2.6) is allowed on a single curve.
- Over a photograph, the curve runs across the lower third (p.14). It never passes through text blocks or the logo's clear space.
- Motion follows spec §8.4: the line draws on along its path and settles. Under reduced motion, show the final state.
- The red filled wave on the p.19 storefront is **not** this motif.

#### Distribution Flow
**PDF rule:** "Straight lines, 45° turns, round nodes. One amber node marks the destination. Data posts, maps, wayfinding."

**Measured** on the p.13 sample (vermilion ground):
- **Main route:** `M10 105 L60 105 L85 65 L130 65 L155 30 L190 30`, white, stroke 1.5.
- **Nodes:** white, r = 4, at (10, 105), (85, 65) and (155, 30). The **destination node** is amber, r = 4, at (190, 30).
- **Secondary route:** `M10 88 L45 88 L70 52 L115 52 L140 18 L190 18`, white at 50%, with no nodes.
- The sample's diagonals are about 54–58°, **not 45°**.

**Web rules:**
- Horizontal and vertical runs are joined by **true 45° diagonals** (Δx = Δy). Follow the rule text, not the sample.
- Nodes are round, about 5× the stroke width as in the sample. **Exactly one amber node per section**, marking the destination at the end of the main route. All other nodes are white on dark or vermilion grounds, and black on light grounds.
- In the Scene 2 proof band, this means the three metric underlines carry at most **one** amber node between them.
- A faded secondary route without nodes (50%) is optional, as in the sample.
- This is an **abstract process diagram** only. It is never a geographic map and never implies branches, coverage or 300 nodes (spec Scene 6).
- Amber fails 3:1 next to white (1.74:1), warm grey (1.59:1) and vermilion (2.13:1). Wherever the destination node signals state, give it a 2 px black ring. The step labels carry the meaning.
- Direction (interpretation): in Arabic the journey starts at the right and ends at the left. Mirror the drawing, never the text.

#### Crest Pattern
**PDF rule:** "Three overlapping circles from the crest. 10–20% opacity or tone on tone. Inside flaps, tape, wall bands. Never behind text."

**Measured:** the p.13 sample is a tiled raster. Each motif is one larger circle centred above two smaller ones; the larger circle's diameter is about 1.3× theirs. Each lower circle overlaps the upper one, but the two lower circles do not touch each other. The tile repeats about every 30 units in the 200-unit panel. It is drawn in black at **25%** opacity, rendering as `#C1C1C1` on white, which is stronger than the stated 10–20%.

**Web rules:**
- Draw stroke-only circles at **10–20%**: black over white or warm grey (about `#E6E6E6`–`#CCCCCC` on white), or tone on tone over vermilion or black (for example, black at 10–20% over vermilion, or white at 10–20% over black).
- Use it only in text-free bands and edges: section bands, the edge of the menu panel, and decoration on empty states or the 404 page.
- **Never behind text, form fields or the logo.** It is static; no animation is needed.

#### Veterinary Grid
**PDF rule:** "A modular 4×4 layout grid. One module vermilion, one black, at most one amber."

**Measured** on the p.13 sample (viewBox 200 × 130, warm grey `#F6F5F3` ground):
- **Grid lines:** at x = 50, 100, 150 and y = 32, 65, 97. Black at 25%, stroke 1, rendering as `#B8B8B6`.
- **Modules:** the **vermilion module covers two adjacent cells** (x 50–150, row 2). The black module is one cell (column 3, row 3). The amber module is one cell (column 2, row 4).
- **Cells:** need not be square.

**Web rules:**
- The grid is always 4 × 4 when shown.
- It has exactly one vermilion module, which may span two cells, one black module, and at most one amber module. All other cells are white or warm grey with hairlines.
- Text inside modules is black on vermilion, amber, warm grey or white, and white on black.
- The amber module is decorative (1.74:1 against light cells).
- On mobile, keep the 4 × 4 as a compact graphic and stack the content as cards.

### 7.3 Motif map: one per major section

| Homepage scene (spec §5) | Motif | Notes |
|---|---|---|
| 0 Startup / loading | none | No rooster loader (D10). |
| 1 Hero | **Signature Curve** | The spec's extra "abstract supply/distribution line" in the hero is **dropped**, because one asset is allowed per layout (D11). |
| 2 Trust proof 300 / 15m / 150 | **Distribution Flow** (micro underlines) | At most one amber node in the band. The Veterinary Grid is an alternative, but never both. |
| 3 Statement | none | Typography and a documentary photo. Avoid a third curve on the page. |
| 4 Three farm types | none | Photography leads. |
| 5 Product pillars | **Veterinary Grid** | The 2 × 2 pillars are built from the 4 × 4 modules, so the colour rule applies. |
| 6 Distribution journey | **Distribution Flow** | One amber destination node, which lights once. |
| 7 Values | **Veterinary Grid** (4 × 4) | Black, vermilion and white cells with one amber tile (spec). |
| 8 Product preview | none | Content comes first. |
| 9 Partner proof | **Crest Pattern** band, or none | Only in a text-free band. |
| 10 FAQ | none | |
| 11 Closing CTA | **Signature Curve** | On a black field, emerging from the lower right. |
| Footer | none | White logo on black. |

| Interior page | Section and motif |
|---|---|
| About | Hero: Signature Curve. Brand heritage (rooster, meaning of the name): Crest Pattern band. Values: Veterinary Grid. |
| Poultry solutions and segment pages | Hero: Signature Curve, or none. «كيف نساعدك في طلب المنتجات»: Distribution Flow. |
| Products (catalogue) | Category index or empty state: Veterinary Grid. |
| Product detail, Privacy | none |
| How we work | Process: Distribution Flow. |
| Knowledge hub | Empty state: Crest Pattern band. |
| Contact, Partnership | Hero: Signature Curve, or none. Form areas stay clean. |
| 404 and error pages | One of Signature Curve or Crest Pattern. |

---

## 8. Photography, iconography and applications

### 8.1 Photography (PDF p.14 / f.15, adapted to poultry only)
PDF rules:
- **Subjects:** "Veterinarians at work, farm managers, vaccine handling, cold-chain storage, warehouse picking, loading and delivery. Real people doing the task."
- **Style:** "Documentary, natural light, honest framing, close on hands and product. Warm daylight, neutral shadows. Clean, never staged."
- **Avoid:** "Smiling stock poses, cartoon animals, composited animals on white, pet imagery, heavy filters."
- **Treatment:** "Natural colour, slight contrast lift."
- **Overlay:** "Black 40–60% under white text."
- **Cropping:** "Curve over the lower third."
- **Rights:** "Licensed or commissioned only."
- **Note:** "existing banner and window graphics use composited cow, sheep and chicken cut-outs; replace with documentary photographs on the next print run."

Web rules:
- **Allowed subjects:**
  - Commercial broiler houses, layer houses and breeder flocks, each shown in its correct context. A broiler is never presented as a laying hen.
  - Farm owners, managers and workers in plausible biosecurity gear doing real tasks, such as checking feeders, drinkers or the flock.
  - Veterinarians observing poultry.
  - Hands handling vaccine or medicine packs with **no legible fake labels or brands**.
  - Feed and supplement sacks or feed lines without invented brands.
- **Conditional subjects:** cold-chain storage, warehouse picking, loading, delivery and vehicles may appear **only when they show Alshorouk's real, verified operations** (O12). Otherwise they imply infrastructure claims, which spec §1.2 forbids.
- **Banned:**
  - Cows, sheep, goats, horses, dairy, generic livestock and pets.
  - Cartoon chickens; composited or cut-out animals, including chicken cut-outs.
  - Oversized "hero chickens" on pedestals, and fantasy farms made with AI.
  - Smiling handshakes.
  - Heavy filters.
  - Distressed birds or unsafe practices.
  - Competitor branding.
  - The PDF's mockup images from p.17–p.20.
- **Treatment:** natural colour with a slight contrast lift, warm daylight and neutral shadows. When the curve overlays a photograph, it runs across the lower third.
- **Overlay:** the default is a 60% black overlay under white text (§3.5).
- **Rights:** licensed or commissioned only, each logged in `docs/image-provenance.md`. Alt text is bilingual and specific to poultry.

### 8.2 Iconography (PDF p.15 / f.16)
PDF rule: "24-unit grid · 2-unit stroke · round caps and joins · 2-unit radius · no fills. Black on light, white on dark; vermilion for one active state only."

Measured: the eight icons are true vectors in the PDF, drawn in 24-unit coordinates. Their graphics state sets line width 2 with round caps and joins (LC 1, LJ 1, LW 2). They could be extracted the same way as the logo, except Livestock, which is excluded.

| PDF icon | Website status |
|---|---|
| Medicine (flask) | Allowed. |
| Vaccination (syringe) | Allowed, but never next to dosing content. |
| Delivery (truck) | **Caution.** Use it as a process step only. It must never imply an owned fleet or delivery times. |
| Warehouse | **Caution.** It must never imply owned warehouses or storage capacity. |
| Quality (shield and tick) | **Caution.** It must never imply a certification. |
| Poultry | **Caution.** The glyph reads as a tulip. Do not rely on it as the poultry signifier; an approved replacement is needed (O8). |
| **Livestock** | **BANNED.** The site is poultry only, and the glyph also reads as a cat (pet imagery). Never extract or use it. |
| Veterinary (cross in a circle) | Allowed with a label. |

Web rules:
- Icons use `currentColor`. Draw them at 24 px or multiples of it, inside touch targets of at least 44 px.
- Vermilion marks only the **one** active item in a set.
- New icons (feed, supplements, the three segments, UI controls) must follow the same specification and be approved.
- No filled, duotone or emoji icons, and no animal icons other than poultry.

### 8.3 Applications and digital (PDF p.17–p.21 / f.18–f.22)
**Digital rule (p.21 / f.22):** "Website, email and presentations follow the same rules: white pages, black text, vermilion for actions, amber for single highlights, curve in hero areas."

| PDF clause | Website translation |
|---|---|
| White pages | White and warm-grey canvas (§2.5). Black chapters are deliberate exceptions. |
| Black text | `#000000` for primary text and `#333333` for secondary text (§3.6). |
| Vermilion for actions | Buttons, link underlines and active states. Vermilion is not decoration. |
| Amber for single highlights | One amber accent per view (§2.5). |
| Curve in hero areas | Signature Curve in heroes (§7.3). |
| Post 1:1 / 4:5: "Logo top-right, headline right-aligned, curve at base, 8% margin" | OG and share images, 1200 × 630, follow the same layout. |
| Story 9:16: "Keep top 14% and bottom 20% clear" | Applies to social only. |
| Carousel: "Cover black or vermilion, inner slides white, one idea per slide" | Applies to social only; spec §5 marks website carousels optional and never required. |
| Types: "Product, education, event, data, recruitment, corporate" | Recruitment is out of scope (no jobs page). Data posts must use approved figures only. |

Print and physical rules that carry over as references only:
- A vermilion folder with a white logo, and a black ID card with a white logo and vermilion bar. Both confirm the approved logo-on-ground pairings.
- The directional sign (black panel, white text, vermilion arrow) is a usable pattern for wayfinding UI.
- "Max five lines" on banners is consistent with the spec's limit of 2–4 lines for section titles.
- **The packaging category bands (vermilion for vaccines, black for antibiotics, amber for supplements) are packaging-only** (D14). Website product categories are not colour-coded with them. The website's taxonomy is poultry feed, feed supplements, veterinary medicines and veterinary vaccines, with no "antibiotics" band.

**Layout grammar observed in the PDF.** These patterns may be reused, with the contrast fixes from §3:
- Warm-grey cards topped by a 1.5 pt (≈ 2 px) vermilion rule.
- Tables with `#DDDDDD` hairlines.
- A top strip that is black for about 22% of its width and vermilion for the rest.
- Section numbers in vermilion.
- Bilingual section titles, with Latin on the left and Arabic on the right.

The PDF's own 6.8–9 pt vermilion labels and its `#777777` meta text fail WCAG at those sizes. On the website, enlarge them or use black.

---

## 9. Red flags

### 9.1 Register

| # | p. / f. | Source text or visual | Risk | Website rule |
|---|---|---|---|---|
| RF-01 | 4 / 05 | "Every morning, healthy **herds** and flocks depend on medicines arriving on time." | Non-poultry wording, plus a timing claim. | Never say "herds". Use poultry wording only. |
| RF-02 | 4 / 05 | «يصل في موعده ويحفظ الجودة في كل خطوة»; the mission's "correctly stored … on schedule" | Unverified claims about delivery timing, storage and cold chain. | Treat these as aspirations. Never publish them as fact (spec §1.2). |
| RF-03 | 4 / 05 | Vision: "the most dependable name in veterinary supply: **the distributor vets call first**"; "to vets, farms and **clinics**" | Positioning around vets and clinics, with a superlative. | **Reinterpret for poultry farms** (§9.2, O9). Drop "clinics". |
| RF-04 | 5 / 06 | Audience: "Veterinarians and clinics · poultry, **dairy and livestock** farm managers · pharmacies and sub-distributors · institutional buyers" | Banned sectors, plus unconfirmed audiences. | The audience is poultry farms only (§9.2). The other groups need confirmation (O10). |
| RF-05 | 5 / 06 | Positioning: "Not a pet brand **or a poultry-only brand**." | Contradicts the user's instruction. | Overridden: the site is poultry only. Keep "not a pet brand". |
| RF-06 | 5 / 06 | Precision: "**Cold chain, batch and dose handled correctly.**" | An aspiration, not a verified claim. "Dose" invites dosing content. | The value name stays. Use the claims-safe definition (§9.2). No dosing content anywhere (spec §1.4). |
| RF-07 | 5 / 06 | Reliability: "Deliveries arrive when promised."; Expertise: "Veterinary knowledge behind every order." | An unverified SLA and implied veterinary staff. | Use the claims-safe definitions (§9.2). |
| RF-08 | 6 / 07 | "Delivered within **24 hours** to registered clinics." | A fake SLA, plus clinics. | **Illustrative only** ("Example figures in sample copy are illustrative only"). Never publish it. |
| RF-09 | 6 / 07 | "Store between **2–8 °C** on receipt." | A storage instruction and implied cold-chain capability. | Illustrative only. Storage and handling text comes only from approved product labels (spec §1.4, §6.5). |
| RF-10 | 6 / 07 | «نوفر لك اللقاح الأصلي في موعده.» | Authenticity and timing claims. | Illustrative only. |
| RF-11 | 9 / 10 | Unlabelled card: black logo on `#555555` | An unapproved variant (2.77:1). | Never use it (O6). |
| RF-12 | 11 / 12 | "White on vermilion (**3.4:1**)" | Misstates the ratio. | The computed value is **3.69:1**. The large-only rule stands. |
| RF-13 | 12 / 13 | The specimen is set in substitute fonts | It is no reference for Thmanyah. | Licence blocker (O1). |
| RF-14 | 13 / 14 | The samples drift from their rules: flow diagonals of about 54–58°, crest pattern at 25% | Copying the sample rather than the rule. | Follow the rule text: 45° diagonals, 10–20% crest pattern. |
| RF-15 | 14 / 15 | Subjects: "cold-chain storage, warehouse picking, loading and delivery" | Implies infrastructure. | Only real, verified operations (O12). |
| RF-16 | 14 / 15 | Note: "composited **cow, sheep** and chicken cut-outs" | Non-poultry and composited imagery. | Banned. Never reuse it. |
| RF-17 | 15 / 16 | "**Livestock**" icon | Non-poultry, and it reads as a cat (pet). | **Banned.** |
| RF-18 | 15 / 16 | The "Poultry" glyph; the Delivery, Warehouse and Quality icons | An ambiguous glyph; capability and certification connotations. | Replace the Poultry glyph (O8). Use the other three only where they make no claim. |
| RF-19 | 17–20 / 18–21 | Photorealistic mockups, re-typeset descriptor, filled face | Not faithful artwork. | Never use them as imagery or a logo source (§6 F5). |
| RF-20 | 18 / 19 | Reception, exterior and warehouse signage mockups | Imply offices and warehouses. | No facility claims or imagery without verification (O12). |
| RF-21 | 19 / 20 | Storefront with **cow, goat and hen** cut-outs, a retail-pharmacy setting and a red filled wave | Banned animals, composited imagery, wrong positioning. | **Banned.** The wave is not the Signature Curve. |
| RF-22 | 20 / 21 | "Delivery vehicle: current livery"; fleet with "phone in lower third" | Implies a fleet and a phone number. | No fleet claims or imagery, and no invented phone number (AGENTS.md). |
| RF-23 | 20 / 21 | Category bands "Vermilion: vaccines · Black: antibiotics · Amber: supplements"; "species icon" | Packaging system that conflicts with the amber cap and implies multiple species. | **Packaging only** (D14). No species icons. |
| RF-24 | 21 / 22 | "**24h**" data post (sample) | A fake SLA. | **Illustrative only.** Never publish it. |
| RF-25 | 21 / 22 | «لقاحات في موعدها» (announcement) | A timing claim. | Illustrative only. |
| RF-26 | 21 / 22 | «نوظف» (recruitment) | Out of scope. | No jobs page (spec §4.2). |
| RF-27 | 1 / — and the logo | "veterinary medicines and vaccines distribution"; descriptor «لتوزيع الادوية واللقاحات البيطرية» | Scope tension with feed and supplements. | The descriptor stays unchanged. Feed and supplements appear in page copy as supply lines, never as manufacturing. Never claim "150 feeds". |
| RF-28 | 2–21 | The PDF's small vermilion labels and `#777777` meta text | They fail WCAG at small sizes. | Do not copy them at small sizes (§3.3). |

### 9.2 Strategy reinterpreted for poultry only
These are proposals only. They need approval from the copywriter and the brand owner (O9). The value **names** come from the PDF and do not change. The definitions remove every unverified SLA (`AGENTS.md`).

| Item | PDF original | Poultry-only, claims-safe proposal |
|---|---|---|
| Vision | "To be the most dependable name in veterinary supply: the distributor vets call first." | EN: "To be the supply partner poultry farms rely on." AR: «أن نكون شريك الإمداد الذي تعتمد عليه مزارع الدواجن.» |
| Mission | "Deliver authentic, correctly stored veterinary medicines and vaccines on schedule, backed by product knowledge and clear service." | EN: "We supply broiler, layer and breeder farms with poultry feed, feed supplements and veterinary medicines and vaccines, backed by product knowledge and clear service." AR: «نوفر لمزارع التسمين والبياض والأمهات الأعلاف ومكملات الأعلاف والأدوية واللقاحات البيطرية، مع معرفة بالمنتجات وخدمة واضحة.» |
| Positioning | "A professional veterinary distributor: more specialised than a general pharmacy, more corporate than a farm-supply shop. Not a pet brand or a poultry-only brand." | "A specialised supply and distribution partner for poultry farms, more specialised than a general farm-supply shop. Not a pet brand." AR: «شريك إمداد وتوزيع متخصص لمزارع الدواجن.» |
| Audience | Vets and clinics; poultry, dairy and livestock farm managers; pharmacies and sub-distributors; institutional buyers | Owners and managers of broiler, layer and breeder farms; veterinarians who serve poultry farms; companies exploring a poultry-supply partnership (O10). |
| Integrity · الأمانة | "Authentic products, honest information." | «معلومات واضحة وصادقة عن المنتجات التي نوزعها.» "Clear, honest information about the products we distribute." |
| Precision · الدقة | "Cold chain, batch and dose handled correctly." | «دقة في تفاصيل المنتجات والطلبات.» "Precision in product details and orders." |
| Reliability · الالتزام | "Deliveries arrive when promised." | «علاقات عمل مستمرة وتواصل واضح.» "Lasting working relationships and clear communication." |
| Expertise · الخبرة | "Veterinary knowledge behind every order." | «معرفة متخصصة بمنتجات قطاع الدواجن.» "Specialised knowledge of poultry-sector products." |
| Story hook | "Alshorouk means sunrise. Every morning, healthy herds and flocks depend on medicines arriving on time." | Keep "Alshorouk means sunrise" and the rooster, "first to announce the day". Drop "herds" and "on time". AR, for example: «اسمنا "الشروق"، والديك، أول من يعلن بداية اليوم، هو علامتنا.» |

The PDF's personality ("Professional, steady, alert, direct. Strong without aggression. Confident without exaggeration.") and its voice ("clear and factual, knowledgeable, respectful"; never "hype, jargon-heavy, salesy or folksy") carry over unchanged. On a poultry-only site, "respectful of vets" extends to farm managers.

---

## 10. Decisions and open items

### 10.1 Decisions taken (Brand Guardian)

| ID | Decision | Section |
|---|---|---|
| D1 | Page references use `p.N` for the physical page and `f.NN` for the printed folio. | §0.2 |
| D2 | Colour values are the PDF's vector fills, covering the four core colours, tints, shades, grey ramp and warm grey `#F6F5F3`. Where the formula differs (vermilion-60, amber-60, grey-60), the PDF value is used pending O5. The spec's derived neutrals are replaced. | §2 |
| D3 | Text roles: black for primary text; `#333333` for secondary; `#767676` for muted text on white only; white and `#CCCCCC` on black; `#7F1900` for small vermilion-family text. | §3.6 |
| D4 | White text on vermilion, and vermilion text on light grounds, appear only at ≥24 px bold or ≥32 px regular. Primary buttons are vermilion with a black label. | §3.4 |
| D5 | Photo overlays default to 60% black under white text. A lighter overlay needs a measured pass. | §3.5 |
| D6 | The gradient is two-stop, linear and sRGB (`#FE3300` → `#FEB821`), used only on curves and large abstract shapes. | §2.6 |
| D7 | The type tokens follow §4.2. Display sizes above 56 px are staging-only until O7. Latin digits are enforced through `nu-latn`. No justification, no kashida and no Arabic letter-spacing. English is set at 90% inside Arabic. | §4 |
| D8 | Three logo files are in use: full colour on white or warm grey, white on black, vermilion or dark photos, and black for print and monochrome. The amber and vermilion "on black" variants and the grey card are not used. | §5.4 |
| D9 | The logo is never narrower than 110 px. A compact sticky bar carries no logo until a descriptor-less mark is approved. One logo per viewport. | §5.6 |
| D10 | No favicon, app icon or loader derived from the rooster ships without approval. No rooster-outline loader. | §5.8 |
| D11 | The Sunrise motif map follows §7.3. The hero uses the Signature Curve only, and the spec's extra hero distribution line is dropped. | §7 |
| D12 | No PDF mockup or storefront imagery appears on the site. Photography is documentary and shows poultry only. | §8.1 |
| D13 | The Livestock icon is never used. The PDF's Poultry glyph is not the poultry signifier until O8. Icons that suggest capabilities are used without claims. | §8.2 |
| D14 | The packaging category-band colours are not used as website colour coding. | §8.3 |
| D15 | No automatic dark theme. Forced-colours mode is handled. Print uses the black logo. | §5.7 |
| D16 | Strategy copy from p.4–p.6 is rewritten for poultry only and made claims-safe (§9.2), pending O9. The four value names stay. | §9.2 |
| D17 | The logo artwork, including the descriptor spelled «الادوية», stays exactly as drawn. | §5.1 |

### 10.2 Open items for the brand owner

| ID | Item | Needed | Interim behaviour |
|---|---|---|---|
| **O1** | **Thmanyah font. BLOCKER for production typography.** | Licensed WOFF2 files for weights 400, 500 and 700 at least, plus written web-embedding rights. | One OFL staging face (§4.5), documented in `src/styles/fonts.ts`. |
| O2 | Original logo source files (AI, EPS, PDF or SVG) | To confirm the native aspect ratio (§6 F1) and supply official variants. | Use the PDF-extracted SVGs, which are verified faithful. |
| **O3** | **Mark without descriptor (72 px)** | Official artwork. | Not used. The compact sticky bar carries no logo. |
| **O4** | **Favicon and app icons** | Approval of the head-path subset (paths 46–57), its crop and its backplate colour. | A candidate for review only. Production waits on approval. |
| O5 | The "60" swatches | Are `#FE7A55`, `#FED168` and `#767676` intended, or true 60% mixes (`#FE8566`, `#FED47A`, `#666666`)? | Use the PDF swatch values. |
| O6 | The unlabelled 8th card on p.9 (black on `#555555`) | Confirm it is not an approved variation. | Treated as not approved. |
| O7 | Hero display size above the PDF's 56 px | Approve the spec's `clamp(2.3rem, 7vw, 5.8rem)` for the homepage hero, or cap it at 56 px. | Staging only. |
| O8 | A poultry icon, plus icons for feed, supplements and the three segments | Approval of new icons drawn to the PDF spec. | Text labels plus photography. |
| O9 | Vision, mission, values and story reinterpreted for poultry only | Approval of the copy in §9.2. | Content status stays `review_required`. |
| O10 | Audience scope | Confirm whether pharmacies, sub-distributors and institutional buyers are site audiences (partnership page) or out of scope. | Poultry farms and their veterinarians only. |
| O11 | Photography | Commissioned or licensed documentary poultry imagery covering broilers, layers and breeders. | Licensed stock that is true to the poultry sector, logged in `docs/image-provenance.md`. |
| O12 | Logistics claims: cold chain, delivery timing, fleet, warehouses | Verification before any copy or imagery mentions them. | None of them is mentioned. |
| O13 | Descriptor spelling in the artwork («الادوية» without hamza) | For awareness only. Any change would need an officially revised logo. | Artwork unchanged. |
| O14 | Fill of the amber "on black" variant (`#FFB724` vs `#FEB821`) | Only if that variant is ever requested. | Not used. |
| O15 | Gradient forms beyond the two-stop linear (radial, glow, fade) | Approve them, or confirm they are not part of the identity. | Not used. |
| O16 | Optional re-extraction of the black SVG from the "Black · amber" card | Orchestrator decision (§6 F2). | The current file is acceptable (+0.88% vertical difference). |

### 10.3 Deliverable status (per `AGENTS.md`)

| Deliverable | Status | Evidence |
|---|---|---|
| `docs/brand-audit.md` (this file) | implemented | This file |
| Colour values, tints, warm grey, gradient definition | verified | PDF vector fills, content-stream operators and Pillow samples (Appendix A) |
| WCAG contrast matrix and overlay maths | verified | Computed with the WCAG 2.x formula (Appendix A) |
| Logo extraction fidelity | verified | Orchestrator metrics plus the independent re-check (§6) |
| Sunrise geometry and icon specification | verified | PDF content streams on p.1, p.13, p.15 and p.21 (§7.2, §8.2) |
| Thmanyah, descriptor-less mark, favicon | blocked on brand owner | O1, O3, O4 |
| Strategy reinterpretation, display size, tint intent, poultry icon | needs_review | O5, O7, O8, O9 |

---

## Appendix A: How the numbers were obtained (reproducible)
- **Tools.** Python 3.13 with PyMuPDF 1.27.2.2, Pillow 12.1.1 and NumPy.
- **Vector colours and geometry.** PyMuPDF `page.get_drawings()` reads fills, strokes, widths and bounding boxes. Raw content-stream operators supplied the `rg`/`RG` colour values, the Bézier and polyline path data, the ExtGState opacities (`ca .5`, `ca .25`, `CA .25`) and the line caps, joins and widths (`LC 1`, `LJ 1`, `LW 2` for the icons). Shading pattern P57 on p.11 holds the gradient.
- **Raster samples.** Pillow modal colour inside the swatch interiors of `page-11.png` (110 dpi), and inside the warm-grey areas of `page-04.png`, `page-05.png`, `page-08.png`, `page-12.png`, `page-13.png`, `page-14.png` and `page-15.png`; all of them read `#F5F5F2`. MuPDF renders at 4–8× were used to read the motif colours.
- **Contrast.** WCAG 2.x relative luminance and contrast ratio, computed from 8-bit sRGB values (§3.1). The overlay thresholds come from solving the worst case, a white photo pixel under the overlay.
- **Logo checks.** Path-by-path geometry comparison across the p.9 cards, after normalising each card to its own bounding box. Aspect ratios of the full-colour lockup were measured on p.1, p.3, p.7, p.8, p.9, p.16 and p.21. The SVG and PDF renders were compared by mean absolute difference at 6×.
- The scripts lived in the session scratchpad and are not part of the repo. Every figure above can be regenerated from `Alshorouk_Brand_Guidelines.pdf` with the steps listed here.
