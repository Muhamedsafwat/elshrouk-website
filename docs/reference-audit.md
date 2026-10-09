# Reference Audit: craft study of four reference websites

| | |
|---|---|
| Role | Research & Reference Analyst (spec §13.2, skill `reference-research`) |
| Date | 2026-10-09. All captures were made on this date; the sites are live and may change. |
| Status | `needs_review` for Gate G1.2 (`docs/quality-gates.md`) |
| Binding inputs | `AGENTS.md`; spec §2, §5 (scenes 0–11), §7, §8 (incl. §8.4); `docs/brand-audit.md` §4 (typography) and §7 (Sunrise System) |
| Evidence | `.reference/<site>/<desktop or mobile>/` (git-ignored, internal only, never deployed) |
| Rule | The references rank 6th in source precedence. They teach craft only. Nothing here permits copying their copy, colours, images, illustrations, icons, fonts, video, code or client logos. |

---

## Contents
1. [Summary](#1-summary)
2. [Method](#2-method)
3. [Access log](#3-access-log)
4. [Side-by-side comparison (measured)](#4-side-by-side-comparison-measured)
5. [byteforceinc.com](#5-byteforceinccom)
6. [bsystemseg.com](#6-bsystemsegcom)
7. [mindooco.com/en](#7-mindoocomen)
8. [imtyaze.com](#8-imtyazecom)
9. [Cross-site pattern matrix](#9-cross-site-pattern-matrix)
10. [Derivation guard](#10-derivation-guard)
11. [Craft principles with measurable targets](#11-craft-principles-with-measurable-targets)
12. [Six signature motion moments: one idea each](#12-six-signature-motion-moments-one-idea-each)
13. [Supporting motion notes](#13-supporting-motion-notes)
14. [Consolidated do-not-transfer list](#14-consolidated-do-not-transfer-list)
15. [Handoffs and open questions](#15-handoffs-and-open-questions)
16. [Deliverable status](#16-deliverable-status)

---

## 1. Summary

- **Access:** all four sites loaded (HTTP 200) on desktop and mobile. None showed a bot challenge or blocked automation (§3).
- **Stack:** all four are Next.js apps. None exposes GSAP, ScrollTrigger, Lenis, Locomotive Scroll or Three.js. None has a `<canvas>`, `<video>` or `<iframe>` on the homepage, and every script is a first-party bundle. Their motion is CSS keyframes and transitions plus Web Animations API calls, triggered by IntersectionObserver, on native scroll. byteforce, bsystems and mindoo all show Framer Motion's default opacity tween (300 ms `cubic-bezier(0.25, 0.1, 0.35, 1)`) in their WAAPI calls, and bsystems also uses `linear()` spring easings. That is consistent with the Motion (Framer Motion) library; it is inferred, not confirmed. imtyaze uses CSS only.
- **Who teaches what:**
  - **imtyaze.com** is the strongest teacher for our Arabic-first build. It has a native Arabic type system, motion that respects RTL, a disciplined motion-token and reduced-motion setup, zero idle JavaScript, a skip link with a designed focus ring, numbered process rows, and light/dark banding close to our 55/25 colour ratio.
  - **bsystemseg.com** shows the best diagram choreography: lines that converge into one destination, a centre-line timeline with large ghost numerals, and a statement that a drawn line carries down to an answer card. It also has a confident full-screen menu.
  - **mindooco.com** has the clearest narrative structure: one idea per section, CSS-sticky heading columns, a typographic "reset" chapter, a single CTA verb and a filter for who the service is not for.
  - **byteforceinc.com** shows good pacing and CTA cadence: a proof band paired with a chart, and a simple numbered process row. Its typewriter headline and overshooting counters are cautionary examples.
- **Faults observed on live sites (each becomes a rule for us):**
  - A placeholder-pattern phone number in a live footer (byteforce).
  - Counters that overshoot the real figure (byteforce).
  - A typewriter headline that shifts the layout: CLS 0.45 on desktop and 1.25 on mobile in our run (byteforce).
  - Cream text on a cream background (mindoo).
  - Arabic set with Latin tracking and leading, an unmirrored gradient and untranslated labels (mindoo `/ar`).
  - Art-direction placeholder text visible in public photo slots (imtyaze).
  - Perpetual animations that ignore `prefers-reduced-motion` (byteforce, bsystems, mindoo).
- **Deliverables:** 17 craft principles with numeric targets (§11), and one concrete motion idea for each of the six §8.4 moments, built on the Sunrise System (§12).

---

## 2. Method

### 2.1 Tooling
- Playwright **1.64.0**, installed in the analyst's scratch folder, never in the repo. Chromium Headless Shell **156.0.8078.4** (revision 1248). The cached revisions 1223, 1228 and 1234 did not match Playwright 1.64, so `npx playwright install chromium` was run as instructed. The GPU backend was ANGLE D3D11; WebGL was available, and H.264 and VP9 were both playable.
- Python 3.13 with Pillow and NumPy was used for contact sheets, frame-difference activity analysis and colour sampling.

### 2.2 Capture procedure (per site × device)
- **Contexts:**
  - Desktop: 1440 × 900, DPR 1, Windows Chrome UA.
  - Mobile: 390 × 844, DPR 1, `isMobile`, `hasTouch`, Android Chrome UA. The orchestrator's brief set DPR 1; the skill suggests DPR 2. The brief was followed, so mobile screenshots are 1× and fine text looks soft.
  - Both used `reducedMotion: 'no-preference'` and a light colour scheme.
- **Intro:** viewport screenshots at 300, 900, 1800 and 3500 ms after DOMContentLoaded. Alongside them, a CDP screencast ran for 0–5.5 s and was turned into a 15-frame timeline sheet.
- **Scroll:** the page was scrolled in steps of 0.75 viewport. Each step was made of 9 small `scrollBy` increments followed by a 700 ms settle, then a screenshot. Steps continued until the footer. At most 16 viewports per site and device were copied to `.reference`; all steps are shown in the `page-overview-sheet`.
- **Mobile menu:** the hamburger was found and tapped, with a screenshot at 180 ms, the open state, and a timeline sheet. Desktop menus were captured where navigation sits behind a button (bsystems, mindoo).
- **Desktop extras:** hover on the hero CTA; a click on a header link to time the page transition (screenshot at 350 ms plus a timeline sheet); 3 viewports of the interior page reached.
- **Extra pages:** byteforce `/about`; bsystems `/about` (reached through its menu); mindoo `/en/contact` and `/ar` (desktop and mobile); imtyaze `/about` and `/en`.
- **Extra passes:** `reducedMotion: 'reduce'` (desktop and mobile hero); six `Tab` presses with the focus style read on each; console errors and failed responses; and a wheel-scrolled `.webm` video per site and device.

### 2.3 Instrumentation (read-only, injected before page scripts)
- Hooks recorded `Element.animate` calls (WAAPI), `IntersectionObserver` options, `window.gsap` (none existed) and `requestAnimationFrame` calls per second at idle.
- `PerformanceObserver` recorded FCP, LCP and CLS.
- `document.getAnimations()` was sampled 130 ms after each scroll step.
- `getComputedStyle` was read for h1 to h4, `p`, the header, CTAs, gutters and section padding.
- Measurement JSON and scripts stay in the analyst's scratch folder and are not committed. The numbers that matter are reproduced in this document.

### 2.4 Limitations (stated so the numbers are not over-read)
- Scrolling was programmatic, which does not count as user input, so LCP kept updating while reveal-on-scroll content appeared. **LCP is therefore not compared**, except where noted. CLS is reported because it measures real shifts.
- Hover was probed on two elements per site, the hero CTA and one nav link. Card hovers were sampled only on imtyaze.
- Screencast timestamps are accurate to about one frame (16–33 ms). All durations in this document are estimates, ±50 ms.
- The mobile results come from Chromium emulation, not a real phone.
- The colour shares in §4 are pixel shares across all homepage viewport screenshots. They were computed by quantising and splitting on a saturation threshold of 0.28, so they are approximate.

### 2.5 Evidence file naming in `.reference/<site>/<device>/`
- **Screenshots:** `NN-intro-0300ms.png` … `-3500ms`; `NN-scrollKK-y<px>-<pct>pct.png` (the last one ends in `-footer`); `NN-menu-opening-180ms.png`; `NN-menu-open.png`; `NN-transition-350ms.png`; `NN-interior-*.png`; `NN-hover-*.png`; `NN-reduced-motion-hero.png`; `NN-keyboard-focus-tab2.png`.
- **Sheets:** `NN-intro-timeline-sheet.png`, `NN-page-overview-sheet.png`, `NN-menu-timeline-sheet.png` and `NN-transition-timeline-sheet.png`, plus three analysis sheets: `byteforce/desktop/29-counter-overshoot-sheet.png`, `mindoo/desktop/35-branch-and-timeline-reveal-sheet.png` and `bsystems/desktop/32-menu-to-about-transition-sheet.png`.
- **Video:** `NN-scroll-video.webm`.
- **Totals:** 239 files, about 86 MB including videos. Homepage viewports, desktop / mobile: byteforce 13 / 16, bsystems 16 / 16, mindoo 14 / 16, imtyaze 14 / 16.

---

## 3. Access log

| Site | URL | Desktop | Mobile | Blocked? | Notes |
|---|---|---|---|---|---|
| byteforce | https://www.byteforceinc.com/ | 200, OK | 200, OK | No | 0 console errors, 0 failed responses. Also visited `/about`. |
| bsystems | https://www.bsystemseg.com/ | 200, OK | 200, OK | No | 3 console errors from the site itself: invalid SVG `d` values that use percentages. 0 failed responses. Also visited `/about`. |
| mindoo | https://mindooco.com/en | 200, OK | 200, OK | No | 0 errors. Also visited `/en/contact` and `/ar` (200). The low-contrast hero was verified as a live-site state: identical under light, dark and no-preference schemes, with no failed CSS. |
| imtyaze | https://www.imtyaze.com/ | 200, OK | 200, OK | No | 0 errors. Also visited `/about` and `/en`. |

No logins, form submissions or aggressive crawling took place. Pages were loaded one at a time with pauses of several seconds. Nothing was downloaded into the repo or `public/`.

---

## 4. Side-by-side comparison (measured)

Desktop is 1440 × 900 and mobile is 390 × 844. "vh" here means multiples of the viewport height.

| Aspect | byteforce | bsystems | mindoo | imtyaze |
|---|---|---|---|---|
| Language / direction | English LTR only | English LTR only | English LTR; `/ar` RTL | **Arabic RTL**; `/en` LTR |
| Rendered webfont | none (browser default serif) | Raleway 400–800 | none (system UI; Montserrat declared but not rendered) | Alexandria variable (first family in the stack never loads) |
| Page length, desktop / mobile | 8,805 px (9.8 vh) / 11,132 (13.2 vh) | 12,564 (14.0) / 15,651 (**18.5**) | 9,596 (10.7) / 12,176 (14.4) | 9,165 (10.2) / 14,308 (17.0) |
| `<section>` count | 8 | 8 | 8 | 10 |
| h1, desktop | 72 px · 5.0 vw · 700 · lh 1.00 · −0.025 em | 80 · 5.6 vw · 900 · 1.05 · −0.05 em | 88 · 6.1 vw · 900 · 1.05 · −0.025 em | **56 · 3.9 vw · 700 · 1.28 · 0** |
| h1, mobile | 48 · 12.3 vw · 1.25 · 2 lines | 36 · 9.2 vw · 1.05 · 4 lines (centred) | 40 · 10.3 vw · 1.05 · 4 lines | **34 · 8.7 vw · 1.28 · 3 lines** |
| Section h2, desktop / mobile | 60 / 30 | 60 / 36 | 44–48 / 30 | 43.7 (lh 1.32) / 28 |
| Lead paragraph | 20 / 28 (1.4), 63–69 characters per line | 20 / 32.5 (1.63), 47–60 per line | 20 / 32.5 (1.63), 46–**80** per line | 20 / 32 (1.6), 41–66 per line; mobile 17.4 px, 31–33 per line |
| Desktop gutter at 1440 | ≈104 px | **52 px** | 112 px | 112 px |
| Mobile gutter | 16 | 16 | 16 (48 inner) | 20–24 |
| Section padding, desktop / mobile | 128 / 96 | 128–160 / 80–128 | 160 (192) / 96 (128) | 112 / 64 |
| Card radius | 24 | 24–48 | 24 | 18 (controls 10) |
| Colour share (desktop) | white 48 %, lavender-grey 34 %, orange 9 %, purple 6 % | white 54 %, lilac-grey 26 %, grey 9 %, violet 7 %, pink 2 % | cream/white 69 %, greys 29 %, purple 2 % | **white 48 %, navy/black ≈30 %, blue ≈16 %** |
| Header | Floating white pill that narrows from 1280 to 1024 px on scroll | Small centred floating pill; hamburger only at 1440 | Floating dark-glass pill; hamburger at 1440 | **Full-width sticky bar with inline nav**, transparent over the hero, solid afterwards |
| Mobile menu | Dropdown card, ≈0.28 s | Full-screen overlay, ≈1.0 s cascade | Full-screen overlay, ≈1.0 s cascade | **Dropdown panel, ≈0.16 s** |
| Intro settled at | ≈0.8 s, then a typewriter loop | ≈1.5 s | ≈2.2 s | **≈1.0 s** |
| Reveal timing | 300 ms `cubic-bezier(.25,.1,.35,1)`, 100 ms steps; 600–800 ms ease-out | springs, 600 ms (≈9 % overshoot); 1000 ms ease-out | 700–800 ms ease-out, 100–150 ms steps | **760 ms `cubic-bezier(.16,1,.3,1)`, ≈80 ms steps** |
| Counters | yes, spring **overshoot** | none | static KPI chips on a chart mock-up | none |
| Pin / sticky | none | none | CSS sticky in 3 sections | sticky header only |
| Page transition | fade or blur, ≈300–650 ms | none designed; new page fades in ≈0.4 s after load | none (instant) | none (instant) |
| Infinite animations under reduced motion, desktop / mobile | 14 / 14 | 45 / 43 | 8 / 7 | **0 / 0** |
| Idle `requestAnimationFrame` calls per second | ≈145 | 69–121 | ≈145 | **0** |
| `prefers-reduced-motion` rules | 0 | 0 | 0 | **4 (token zeroing)** |
| Skip link / focus style | none / browser-default ring tinted 50 % orange | none / browser default | none / browser default | **yes / 2 px solid, 3 px offset** |
| CLS, desktop / mobile (our run) | **0.45 / 1.25** | 0 / 0 | 0 / 0 | 0.005 / 0.015 |
| Primary CTA top (y), desktop / mobile | 682 / 532 | 671 / 584 | 622 / 474 | 589 / 460 |

---

## 5. byteforceinc.com

#### 5.1 Snapshot
An English-language marketing agency site for startups. The live identity differs from the spec's description, which called it black and red. On the capture date it was a lavender-grey gradient canvas with orange `rgb(241,92,36)` and purple `rgb(83,68,155)` accents, orange-to-purple gradients on CTAs and headings, and a dark purple footer. No webfont is loaded (`document.fonts` is empty), and everything renders in the browser's default serif. That points to a broken font variable rather than a deliberate choice.

#### 5.2 Desktop, scene by scene
| # | Scene (paraphrased) | Composition | Motion | Evidence |
|---|---|---|---|---|
| 1 | Hero | Floating pill header. Start column: a tilted label styled like a design-tool selection box, a typewriter h1 (72 px), a 20 px paragraph, an orange pill CTA (232 × 60) and a cyan round play button with a text label. End column: a huge orange disc cropped off the right edge, carrying a 3D isometric dashboard render. | Content fades in 300–800 ms; the disc slides and grows in from the edge; the typewriter cycles two phrases. | `desktop/01–04`, `23-intro-timeline-sheet.png` |
| 2 | Problem | A centred 60 px statement, three problem cards with warning icons, and a purple pill CTA. | Fades, 100 ms steps. | `07-scroll02` |
| 3 | Service system | A heading, then a **horizontal bar of three tabs** (the active one filled orange). Below it, a large orange card with a ghost "01" numeral and an icon tile at the start, and at the end a title, subtitle, three checklist rows and a tinted "learn more" button. A centred gradient CTA follows. | Tab swap, card fade. | `08-scroll03`, `09-scroll04` |
| 4 | Client logos | A 96 px heading, then a two-row logo marquee running in opposite directions (50 s and 55 s loops). | Infinite marquee. | `10-scroll05` |
| 5 | Proof | A centred heading, **three stat cards in a row** (percentages and a "+" count), and below them a full-width line chart of two trends over six months. | Counters with **spring overshoot**; the chart draws. | `11–12`, `29-counter-overshoot-sheet.png` |
| 6 | Process | Four steps in a row: gradient icon circles joined by one horizontal line, numerals 01–04 (two shown faded), titles and three-line descriptions. | Fades. | `14-scroll09` |
| 7 | Consultation offer | A gradient headline, a small badge, three benefit rows and a gradient CTA. The end column has floating glass cards and dots. | Fade, float loops. | `15-scroll10` |
| 8 | Positioning | A two-colour centred headline and two large solid cards (orange and purple) with bullet lists, then a centred gradient CTA. | Fades. | `16-scroll11`, `17` |
| 9 | Footer | Dark purple gradient: logo, short description, social icons, quick links, and contact details including a **placeholder-pattern phone number**. | none | `18-…-footer` |

A floating "back to top" circle appears once the user scrolls.

#### 5.3 Mobile, scene by scene
The scene order is the same, and the page grows to 13.2 viewports.
- **Hero:** the h1 drops to 48 px with leading 1.25. The CTA sits at y ≈ 532, above the fold, with the play button beside it. The disc and render move below the fold.
- **Problem and service:** problem cards stack, and the three horizontal service tabs become a vertical list.
- **Proof:** stat cards stack one per row. Mid-count frames show 322 % for a final 311 % and 89 % for a final 87 %. The chart goes full width.
- **Process:** becomes a vertical timeline, with icon nodes on a line at the start edge.
- **Rest:** the two positioning cards stack and the footer stacks.

Evidence: `mobile/24-page-overview-sheet.png`, `05–20`.

#### 5.4 Navigation
- **Desktop:** a floating rounded pill, 80–82 px tall and 8 px from the top. It is 1280 px wide at the top and **narrows to 1024 px and moves down 16 px once scrolling starts**, while its white opacity rises from 0.6 to 0.8 (300 ms). Inside are the logo, three text links and a gradient CTA with a phone icon. The active page shows an underline with a dot (seen on the About page).
- **Mobile:** the same pill, with a **40 × 40 hamburger (under the 44 px minimum)**. It opens a dropdown card inside the pill (3 links and a full-width gradient CTA) in about 280 ms, and page scroll is locked.

#### 5.5 Hero composition
A split hero: text in the start half, a huge filled shape bleeding off the end edge, and a render on top of it. The primary CTA sits at 682 px. The typewriter changes the h1's line count, which moves the paragraph and CTAs, giving the measured CLS of 0.45 on desktop and 1.25 on mobile.

#### 5.6 Typography
- **Scale:** h1 72 px (5.0 vw), weight 700, leading 1.0, tracking −1.8 px. h2 60 px (4.2 vw), leading 1.0. One 96 px label heading at weight 900. Lead paragraphs 20 / 28 at 63–69 characters per line. Body 16 / 24.
- **Mobile:** h1 48 px (12.3 vw) at leading 1.25; h2 30 px; lead 18 / 29 at 38–46 characters per line.
- **Weights:** two, 700 and 900, for display.
- **Arabic / RTL:** none.

#### 5.7 Grid, margins and whitespace
- Container max-width 1300 px, with text starting at x ≈ 104 (gutters about 7.2 vw).
- Section padding 128 px on desktop and 96 px on mobile; mobile gutters 16 px.
- Cards have a 24 px radius and buttons are full pills. Sections are roughly one viewport tall each.

#### 5.8 Colour
Pastel and gradient-led: about 48 % white and 34 % lavender-grey, with orange (9 %) and purple (6 %) used on headlines, CTAs, icons and two big cards. There is almost no black; the footer is dark purple.

#### 5.9 Motion
- **Intro:** a pale gradient paints at 0 ms. Hero content is at about 30 % opacity at 300 ms and fully in by about 800 ms, via WAAPI opacity at 300–800 ms ease-out with 100 ms steps from 200 to 900 ms. The disc enters from the edge between 300 and 800 ms.
- **Typewriter:** types at roughly 50–60 ms per character, holds about 2.5 s, deletes at roughly 30 ms per character (visible at 3.2–4.0 s), then types the next phrase. The caret blinks on an infinite 2 s loop.
- **Scroll reveals:** WAAPI opacity at 300 ms `cubic-bezier(.25,.1,.35,1)` with 100 ms steps, plus 600–800 ms ease-out blocks and utility "enter" animations of 700 and 1000 ms. Triggered by IntersectionObserver with a 200 px rootMargin and threshold 0.
- **Counters:** spring easing over about 1–1.5 s. Mid-count frames show **values above the final figure** on both devices: 312–322 % before settling at 311 %, 89 % before 87 %, and 138+ before 137+.
- **Ambient (infinite):** background grid drift (25 s), gradient shift (15 s), particles (≈2.5–3 s), a ping (1 s), floating cards (8 s) and the two marquees. About 145 rAF callbacks per second at idle.
- **Hover:** the CTA background drops to 90 % opacity and the arrow nudges, over 300 ms `cubic-bezier(.4,0,.2,1)`. There is no custom cursor.
- **Page transition (Home → About):** the page swaps at about 280 ms, and the new hero headline fades and unblurs until about 650 ms, settled by about 900 ms. Evidence: `25-transition-timeline-sheet.png`.
- **Pinning:** none. The CSS sets `scroll-behavior: smooth`.
- **Reduced motion:** there are no rules for it; 14 infinite animations keep running.

#### 5.10 CTA strategy
One action (book a free audit) is repeated about six times: header, hero, problem section, consultation block and closing pill. But it uses **four different verb phrasings** for the same action, which dilutes it. The secondary action is a play button. The header CTA is always visible.

#### Admirable
- The rhythm: problem, then system, then proof, then process, then offer, then positioning, then CTA, with a new idea every 1–1.5 viewports.
- A header CTA that never leaves, and a CTA within about two viewports anywhere on the page.
- Proof told as a story: counters next to a trend chart.
- A plain, readable four-step process row with a connecting line.
- A short, unobtrusive page transition (≈300 ms).
- The header condensing on scroll frees the hero.

#### Inappropriate for a poultry B2B distributor
- A rebellious startup-agency tone, 3D isometric renders, orange-purple gradients, glassmorphism and particles.
- The typewriter headline. It causes layout shift, and in Arabic it would need character splitting, which `AGENTS.md` forbids.
- Overshooting counters, which would display, say, about 316 for an approximate 300.
- A client-logo marquee; we have no authorised logos.
- A placeholder phone pattern in a live footer.
- A 40 px menu button, perpetual animation, no reduced-motion handling and no typographic control (the fallback serif).

#### Adopt (pattern → Alshorouk scene)
1. **Proof band paired with an explanation**, from scene 5 → **S2** as three metric blocks with one short sentence above them. No chart unless real data exists.
2. **CTA cadence**: a primary action reachable within about two viewports, always visible in the header → **header, S1, S5, S8 (empty state), S11**, all using one verb family.
3. **Numbered process row joined by a line**, from scene 6 → the static desktop state and mobile list for **S6**, and the **How we work** page.
4. **Header that condenses after the hero**: a 300 ms change of background and height → **Header (spec §7.3)**, as a full-width bar with crisp edges rather than a pill.
5. **Short route transition** (≈300 ms) → the global page transition (180–350 ms, spec §8.3).

#### Reinterpret (how it becomes Sunrise System / documentary poultry)
- **Shape cropped off the edge** (the orange disc) → the **Signature Curve**: 1–3 PDF arcs, stroked rather than filled, cropped by the media frame or viewport edge, drawn rather than slid in (S1, S11).
- **Stat cards with a chart** → **S9**: the approved figures retold through the three segments (تسمين / بياض / أمهات) with documentary photos. No invented trend lines.
- **Three problem cards** → **S3**: a single typographic statement chapter, not three alarm cards with warning icons.

#### Reject
The typewriter; spring-overshoot counters; the logo marquee; gradient text; 3D renders; particles; floating glass cards; tilted "welcome" stickers; a play button as the secondary CTA; "free audit" style offers; perpetual ambient loops; a 40 px touch target.

#### Do not transfer
All copy, slogans and offer names; the orange/purple palette, gradients and lavender canvas; the logo and wordmark; the isometric renders and illustrations; icons and icon tiles; client logos; stat values; the chart; the tilted label device; code, CSS and animation definitions.

#### Evidence (paths, URL, date, viewport)
https://www.byteforceinc.com/ and `/about`, 2026-10-09, desktop 1440 × 900 and mobile 390 × 844 (DPR 1).
- Desktop: `.reference/byteforce/desktop/01–29`. Key files: `23-intro-timeline-sheet.png`, `24-page-overview-sheet.png`, `29-counter-overshoot-sheet.png`, `25-transition-timeline-sheet.png`, `26-reduced-motion-hero.png`, `27-keyboard-focus-tab2.png`, `28-scroll-video.webm`.
- Mobile: `.reference/byteforce/mobile/01–27`. Key files: `22-menu-open.png`, `25-menu-timeline-sheet.png`.

---

## 6. bsystemseg.com

#### 6.1 Snapshot
An English-language consultancy for business systems (ERP, SaaS and custom software). The palette is a white canvas washed with pink-to-violet mesh glows (pink about `rgb(255,79,135)`, violet about `rgb(108,105,159)`), with navy text `rgb(30,30,56)` and a few navy statement cards. The typeface is Raleway, 400–800. Every section opens with a mono-style status pill used as a chapter label.

#### 6.2 Desktop, scene by scene
| # | Scene (paraphrased) | Composition | Motion | Evidence |
|---|---|---|---|---|
| 1 | Hero | Centred floating pill header. Start column: a status pill, an 80 px weight-900 two-line h1 with one gradient word and a short gradient bar under it, a four-line 20 px paragraph, a filled CTA and an outline CTA. End column: an isometric stack of glass layers with a rotating dial. | Background paints first; the h1 fades in at 600–800 ms; body and CTAs at 800–1250 ms; the header drops in with a spring. | `desktop/01–04`, `22-intro-timeline-sheet.png` |
| 2 | Challenge | A status pill and a two-line heading. Six problem cards **enter tilted and settle flat** into a 3 × 2 grid. Then a large statement, from which a **vertical line draws down** into a navy answer card. | Tilt-in springs and a line draw. | `07–09` |
| 3 | Differentiators | Start column: five checklist rows. End column: a **connector diagram** in which four dark category pills send orthogonal lines that **merge into one hub card** ringed by concentric circles, with two satellite chips. Then a violet summary card. | Lines and particles flow along the paths (infinite). | `09-scroll04`, `10-scroll05` |
| 4 | Methodology | A **vertical centre line with round nodes**. Four phase cards alternate end and start sides, each with a **huge ghost numeral** behind it and mono status tags. It closes with a navy statement card. | Nodes light up; cards fade and slide. | `11–14` |
| 5 | Solutions | A feature card with an orbiting icon graphic and CTA, a product-family pill, and two product cards. | Fades. | `15–16` |
| 6 | Industries | Icon cards placed along a large faint circle (an orbit), plus a pill naming the regions served. | Fades, pulse dots. | `17-scroll12` |
| 7 | Why us | An interactive **"dial"**: five reasons on a circle around the logo, one card shown at a time with pagination dots, auto-advancing. | Rotation and auto-advance. | `23-page-overview-sheet.png` (step 15), `19-scroll14` (pagination dots) |
| 8 | Closing CTA | A bento: a big white card with an 80 px three-line question, a side card with one sentence, and a **black card holding the single decisive CTA**. | Fades. | `19-scroll14` |
| 9 | Footer | Logo, a description with bold keywords, email, phone and location chips, a gradient hairline, and copyright with a tagline. | none | `21-…-footer` |

#### 6.3 Mobile, scene by scene
The order is the same, but the page grows to **18.5 viewports**, the longest of the four.
- **Hero:** centred, with a 36 px four-line h1 and two full-width stacked CTAs (358 × 48). The illustration is pushed to the bottom.
- **Challenge:** the cards fan in rotated before stacking.
- **Differentiators:** the connector diagram is scaled down.
- **Methodology:** single column with ghost numerals.
- **Industries and closing:** industries become one column, the dial stays, and the bento stacks.

Evidence: `mobile/24-page-overview-sheet.png`.

#### 6.4 Navigation
- **Desktop:** a small centred pill (about 500 × 66 px, 24 px from the top) holding a hamburger, the logo, a secondary pill link and a gradient phone button. **There is no inline nav at 1440.** The menu is a full-screen overlay with 54 px weight-900 links set at the start edge. The active link has a pink dash and the brand glyph, the rest are muted lavender, a giant faint wordmark watermark sits behind, a CTA row follows, and a micro footer row shows city and copyright.
- **Timing:** the page is covered at about 160 ms, links cascade from about 240 to 600 ms at about 80 ms apart, and the CTA row arrives at 600–900 ms. Evidence: `33-menu-desktop-timeline-sheet.png`.
- **Mobile:** the same overlay with 50 px links, a 48 × 48 toggle and scroll locked. The full sequence takes about 1.0 s (`mobile/25-menu-timeline-sheet.png`).

#### 6.5 Hero composition
Left-weighted text (start column 52 px from the edge), a big diagram-like render on the end side, and two CTAs at y = 671. The hero is 85 vh.

#### 6.6 Typography
- **Scale:** h1 80 px (5.6 vw), weight 900, leading 1.05, tracking −4 px (−0.05 em). h2 60 px, tracking −3 px. Lead 20 / 32.5 (1.63) at 47–60 characters per line.
- **Mobile:** h1 36 px (9.2 vw), centred.
- **Micro labels:** letter-spaced uppercase.
- **Arabic / RTL:** none. There is no language switch at all.

#### 6.7 Grid, margins and whitespace
- Max-width 1400 px in the hero and 1024 px for centred sections; a narrow **52 px** gutter.
- Section padding 128–160 px on desktop and 80–128 px on mobile.
- Very soft radii (24–48 px), pills everywhere, and a large amount of white space between beats.

#### 6.8 Colour
About 54 % white and 26 % lilac-grey glow, 9 % grey, 7 % violet and 2 % pink. Navy appears only in 2–3 statement cards, and the final CTA card is black. The large mesh glows make the white feel tinted everywhere.

#### 6.9 Motion
- **Intro:** blank for about 180 ms; the background and illustration appear at about 300 ms; the h1 fades in at 600–800 ms; body and CTAs at 800–1250 ms; the header pill drops with a spring of about 1.15 s (≈14 % overshoot). Everything settles by about 1.5 s, on both devices.
- **Scroll reveals:** WAAPI springs (`linear()` easing) of 600 ms with about 9 % overshoot, and 1000 ms ease-out with a 200 ms delay. IntersectionObserver rootMargin of −100 / −50 px. Problem cards rotate in. Lines draw: one from the statement to the answer card, and the methodology centre line with nodes.
- **Interactive:** the auto-advancing dial (5 states).
- **Ambient (infinite):** 21 ping loops (1 s), pulses (1.5–2 s), particles flowing along paths (3 s, staggered by 0.7 s), a 60 s dash rotation and a spinning dial. About 69–121 rAF callbacks per second.
- **Hover:** the CTA fill inverts to white, with pink text, a glow and a revealed arrow, over 300 ms `cubic-bezier(.4,0,.2,1)`. Evidence: `05-hover-hero-cta.png`.
- **Page transition (menu → About):** the menu closes at about 80 ms, the old page stays visible for about 700 ms, then the new hero fades in until about 1.1 s. Nothing is designed. Evidence: `32-menu-to-about-transition-sheet.png`.
- **Pinning:** none.
- **Reduced motion:** ignored; 43–45 infinite animations keep running.

#### 6.10 CTA strategy
One consistent consultation verb: in the hero, in the menu, and as the closing black card. The header carries a secondary "explore" pill and a phone button. One product card has an in-card CTA. The close is decisive: a single black card with one arrow button.

#### Admirable
- **A diagram that converges** on one hub: orthogonal lines from four sources into one destination. This is the closest reference to our Distribution Flow.
- **A centre-line timeline** with nodes that light up and big ghost numerals: a strong rhythm for a process.
- **Statement → drawn line → answer card**: a line that literally carries the eye from a claim to its answer.
- A confident full-screen menu with oversized type, a clear active state and a CTA row.
- Consistent chapter labels at the head of every section.
- A decisive closing bento with one dark CTA.

#### Inappropriate for a poultry B2B distributor
- A software / operating-system look: mono status labels, glass isometric renders, mesh gradients, pink and violet.
- Perpetual pings and pulses everywhere, with reduced motion ignored (spec §4.3, §8.6).
- **Hamburger-only navigation on desktop**, which hides the site structure from farm managers.
- Gradient text, and −0.05 em tracking, which cannot be transferred to Arabic.
- An "industries" orbit, when we serve one sector.
- An auto-advancing carousel.
- 18.5 mobile viewports.
- Invalid SVG markup in the console.

#### Adopt (pattern → Alshorouk scene)
1. **Lines converging on one destination** → **S6, the distribution journey** (five steps leading to a single amber destination node), and the "how we help you request products" block on **segment pages**. Use straight runs, true 45° turns and round nodes (brand audit §7.2).
2. **A process timeline whose nodes light as the line arrives** → the **How we work** page and **S6** on desktop. The line sits at the **start edge** (right in Arabic), not the centre, with cards on one side. That is easier to read in RTL and differs from the reference.
3. **A drawn line from a statement to its answer** → the bridge from **S3** into **S4**: a single short vertical rule that draws as S3 leaves. No motif; just a black hairline.
4. **Full-screen menu with oversized links and a CTA row** → the **MobileMenu** (spec §7.3). Black panel, Arabic links at 28–36 px, a vermilion bar marking the active item, and a static Crest Pattern band at the panel edge (allowed there by brand audit §7.2).
5. **Chapter labels** → a quiet eyebrow on every section: a two-digit index plus an Arabic label, such as «01 — الحلول». No pseudo-code.
6. **A closing card that holds one decisive CTA** → **S11** puts the primary CTA alone on black under the headline.

#### Reinterpret (how it becomes Sunrise System / documentary poultry)
- **Ghost numerals** → the registered numbers **01 / 02 / 03 of S4** (spec) and the category indexes **01–04 of S5**, set in Montserrat at 120–160 px in a black or white 8–12 % tone (outline or tint). They are static and never overlap body text.
- **The dial** → **S7 values** on the **4 × 4 Veterinary Grid**: four value modules revealed once, no rotation and no auto-play.
- **The industries orbit** → nothing. The three poultry segments are already covered in S4.

#### Reject
Mono "system" labels and fake status tags; glass isometric renders; mesh-gradient glows; spring overshoot in UI; perpetual pings and particles; an auto-rotating carousel; hamburger-only navigation on desktop; a narrow 52 px gutter with 80 px headlines; gradient text.

#### Do not transfer
All copy and taglines; the pink and violet palette and mesh backgrounds; the logo and its glyph; the illustrations, dial and orbit graphics; icons; product names and service lists; regional-coverage claims; contact details; code and SVG.

#### Evidence (paths, URL, date, viewport)
https://www.bsystemseg.com/ and `/about`, 2026-10-09, desktop and mobile as in §2.
- Desktop: `.reference/bsystems/desktop/01–33`. Key files: `09-scroll04` (converging diagram), `12-scroll07` and `13-scroll08` (timeline), `24-menu-open-desktop.png`, `33-menu-desktop-timeline-sheet.png`, `22-intro-timeline-sheet.png`, `31-scroll-video.webm`.
- Mobile: `.reference/bsystems/mobile/01–27`.

---

## 7. mindooco.com/en

#### 7.1 Snapshot
A management-consulting site in English, with Arabic at `/ar`. Its CSS tokens are cream `#FAFAEE` as the background, purple `#9044CA` and black.

**Live defect at capture time:** the body is a cream gradient, while hero and statement text is set in cream-to-lilac gradient or cream colour, so **large text is nearly invisible**. The cards are grey translucent black (60 %) on cream. This was verified as a site state, not a capture error: identical under all colour schemes, with no failed CSS and no console errors. This audit therefore weighs mindoo's **structure, grid, pacing and type scale**, not its colours. Montserrat is declared, but the system UI font renders.

#### 7.2 Desktop, scene by scene
| # | Scene (paraphrased) | Composition | Motion | Evidence |
|---|---|---|---|---|
| 1 | Hero | A floating dark-glass pill header (segmented EN / عربي switch, CTA, menu button). An 88 px weight-900 h1 across 1200 px in two lines. A tag pill, a 30 px light subtitle, a purple pill CTA (285 × 56) and a ghost secondary link. End column: a chart card tilted in 3D perspective with floating KPI chips. | Cascade from h1 to chips over about 2.2 s; the chart floats on an infinite loop. | `desktop/04`, `06`, `24-intro-timeline-sheet.png` |
| 2 | Positioning | A centred 60 px statement with a node dot below it; **curved branch lines spread to three node cards**. | The dot appears, then the cards and branches in sequence (≈150–200 ms apart). | `07–08`, `35-branch-and-timeline-reveal-sheet.png` |
| 3 | Problem | **Sticky start column with the heading**. End column: a vertical line with dots and three problem cards. | The line draws and dots light in sequence; the heading fades in. | `09`, `10`, `35-…sheet` |
| 4 | Model | A centred heading and three cards in a **stepped (staggered-height) row**. | Fades. | `11` |
| 5 | Ownership | A sticky start heading and a 2 × 2 card grid. | Fades. | `12` |
| 6 | Typographic triptych | Three giant single words (72 px), stacked with large gaps and small descriptors: a pure-type chapter. | Fades. | `13–14` |
| 7 | Who it is for | A sticky heading and stacked qualifier cards. | Fades. | `15` |
| 8 | Who it is not for | A negative qualification list. | Fades. | `16` |
| 9 | Close | A 72 px centred statement and one CTA (radius 16 px, 312 × 65). | Fade. | `17–18` |
| 10 | Footer | A large "let's talk" line with a circular arrow button, plus links. | none | `19-…-footer` |

#### 7.3 Mobile, scene by scene
- **Hero:** h1 40 px (10.3 vw) in four lines; two full-width stacked CTAs (358 × 56) at y ≈ 474; the chart card goes below.
- **Branches and sticky columns:** the branches become stacked cards, and the sticky columns become normal flow.
- **Length:** 14.4 viewports.

Evidence: `mobile/24-page-overview-sheet.png`, `05–20`.

**Arabic `/ar` (desktop and mobile):**
- **What works:** `dir="rtl"` and `lang="ar"` are set, the header and grid are mirrored, and CTA arrows flip to ←.
- **Faults:**
  1. Arabic renders in the system UI font; there is no Arabic webfont.
  2. It **inherits Latin display settings**: leading 1.05 and **−2.2 px tracking on Arabic**, which crowds marks and breaks letter joins.
  3. The text gradient is not mirrored, so **the end of the Arabic sentence fades into the background**.
  4. English labels are left untranslated: the hero tag, node labels and chart axes.
  5. **Signed numbers flip**: "−95 %" renders as "95 %−" because there is no bidi isolation.

Evidence: `desktop/28–31-ar-*`, `mobile/26–27-ar-*`.

#### 7.4 Navigation
- **Desktop and mobile:** a floating dark-glass pill (20 px from the top, 82 px tall, about 700 px wide on desktop) holding the language switch, the CTA and the menu button. **No inline nav at 1440.**
- **Menu:** a full-screen black overlay with a soft purple radial glow, six centred links at weight 700 (48 px on desktop, 30 px on mobile), and an outline "contact" button beside a filled CTA. Scroll is locked.
- **Timing:** the screen dims at 120–250 ms, links rise and fade about 60–70 ms apart (180–520 ms), and the CTAs arrive at 650–1000 ms. Evidence: `desktop/36-menu-desktop-timeline-sheet.png`, `mobile/25-menu-timeline-sheet.png`.

#### 7.5 Hero composition
A full-width headline on top (h1 top at 128 px), with the tag, subtitle and CTAs below it in the start column and the tilted chart card in the end column. The CTA sits at 622 px.

#### 7.6 Typography
- **Scale:** h1 88 px (6.1 vw), weight 900, leading 1.05, tracking −2.2 px. Statements 44–60 px. Triptych words 72 px. Subtitle 30 px at weight 300. Lead 20 / 32.5 (1.63) at **46–80 characters per line**; 80 is too long.
- **Mobile:** h1 40 px, h2 30 px, lead 18 / 29 at 37–40 characters per line.
- **Weight contrast:** strong, 900 for display against 300 for subtitles.

#### 7.7 Grid, margins and whitespace
- Max-width 1280 px; gutters 112 px on desktop and 16 px on mobile (48 px for inner text).
- **Section padding 160 px** (192 px for the close) on desktop and 96 px (128) on mobile, the most generous of the four.
- An asymmetric two-column layout: a sticky heading in about 5 / 12 and content in about 7 / 12. Cards have a 24 px radius.

#### 7.8 Colour
About 69 % cream and white, about 29 % greys (cards) and 2 % purple. As built on the capture date, it fails contrast for large text.

#### 7.9 Motion
- **Intro:** content paints at about 150 ms. The h1 fades in over 1000 ms ease-out; then the subtitle (+600 ms), CTA row (+800 ms) and chart chips (+1000 and +1200 ms) follow, each 800 ms ease-out. Settled by about 2.2 s, which is slow. The chart floats on infinite loops of 4 s and 10 s.
- **Scroll reveals:** 700–800 ms ease-out with 100–400 ms delays (some 150 ms steps), and IntersectionObserver rootMargins of −80 / −100 px. The **branch lines and the timeline line draw node by node** (≈150–200 ms per node).
- **Sticky:** CSS `position: sticky` for headings in three sections; no JS pinning.
- **Hover:** the CTA darkens from `#9044CA` to `#521E90` over 500 ms `cubic-bezier(.4,0,.2,1)`, and cards move over 500 ms.
- **Page transition:** none; the client-side swap is instant (≈100 ms).
- **Ambient:** 2 s pulses on small icons; about 145 rAF callbacks per second at idle.
- **Reduced motion:** ignored; 7–8 infinite animations keep running.

#### 7.10 CTA strategy
**One verb only** (book a diagnostic call) in the header, hero, menu and close. The "who it is not for" section qualifies leads before the CTA.

#### Admirable
- The clearest narrative: identity, then problem, then model, then ownership, then principles, then audience, then non-audience, then one CTA. **One idea per section.**
- **A sticky heading with a scrolling column** done in CSS: no hijack, robust and accessible.
- A **pure-type chapter** to reset the rhythm.
- The most generous spacing (160 px sections, 112 px gutters).
- A single CTA verb throughout.
- One node branching to three outcomes.
- An Arabic route exists with a mirrored grid.

#### Inappropriate for a poultry B2B distributor
- Consulting positioning.
- Text that fails contrast, and gradient headlines.
- **KPI chips on a chart mock-up** that look like evidence but are not.
- A dark-glass grey card style that dulls legibility.
- The Arabic faults above: Latin tracking and leading on Arabic, a system font, untranslated labels and bidi errors.
- A 2.2 s hero cascade.

#### Adopt (pattern → Alshorouk scene)
1. **Sticky heading + scrolling column (CSS sticky)** → **S4** on desktop. The media panel is the sticky column and the copy scrolls (spec). Also the **segment pages** (sticky segment summary beside the request flow) and the **About** story.
2. **A pure-type chapter** → **S3**: the statement «كل مزرعة لها احتياج مختلف.» set as display type on white or black. No cards.
3. **One source branching to several outcomes** → the introduction to **S4** and the **Poultry solutions** overview: one Alshorouk node to three segment routes, drawn as **Distribution Flow** (straight runs, 45° turns), not curves.
4. **One CTA verb, repeated** → the CTA system (§11 P9).
5. **Section spacing of 160 / 96 px for chapter openers** → S3 and S11.

#### Reinterpret (how it becomes Sunrise System / documentary poultry)
- **"Who we don't work with"** → a positive **scope statement** on About and Poultry solutions: «نخدم مزارع الدواجن فقط: التسمين والبياض والأمهات». This is factual (approved segments), qualifies leads, and keeps a polite tone. No exclusion list.
- **The giant-word triptych** → an About-page chapter for the four values (الأمانة · الدقة · الالتزام · الخبرة) as large type. The homepage version stays on the Veterinary Grid in S7, so the two don't repeat.
- **A floating chart card with chips** → nothing on the homepage. If real data is ever approved, it belongs in an article.

#### Reject
Gradient headlines; cream-on-cream text; KPI chips without a source; dark-glass cards; −0.025 em tracking or 1.05 leading on Arabic; a system font for Arabic; hamburger-only navigation on desktop; a hero cascade over 1.5 s.

#### Do not transfer
All copy, including the "second brain", "diagnostic call" and qualifier wording; the purple and cream palette; the logo; the chart illustration and KPI values; node labels; icons; code.

#### Evidence (paths, URL, date, viewport)
https://mindooco.com/en, `/en/contact` and `/ar`, 2026-10-09.
- Desktop: `.reference/mindoo/desktop/01–36`. Key files: `35-branch-and-timeline-reveal-sheet.png`, `27-menu-open-desktop.png`, `28-ar-hero.png`, `29-ar-scroll1.png`, `34-scroll-video.webm`.
- Mobile: `.reference/mindoo/mobile/01–29`.

---

## 8. imtyaze.com

#### 8.1 Snapshot
An Arabic-first education platform (`dir="rtl"`, `lang="ar"`), with an English mirror at `/en` and `hreflang` alternates for ar, en and x-default.
- **Palette:** deep navy (`rgb(9,29,58)`, `rgb(5,13,28)`), a blue CTA (`rgb(2,97,169)`), cyan accents, and white, "chalk" and "mist" light grounds.
- **Type:** Alexandria variable (100–900). The family listed first in the stack never loads.

#### 8.2 Desktop, scene by scene (reading right to left)
| # | Scene (paraphrased) | Composition | Motion | Evidence |
|---|---|---|---|---|
| 1 | Hero (dark navy, faint grid and circuit lines) | A sticky transparent header: logo at the start (right), six links, then at the end a globe with an "English" label, a sign-in link and a CTA pill. **The text column is on the start side, about 44 % wide**: eyebrow, then a **three-line h1 (56 px) with the third line in accent blue**, a two-line lead, a primary pill CTA (202 × 56) plus a **text link with ←**, and **four check chips**. The end side holds a glowing glass emblem with orbit rings. | The h1 rises line by line (640 ms, 90 ms stagger); the emblem fades in over 1300 ms; light-lines **wipe right to left** over 1.6 s. | `desktop/04`, `24-intro-timeline-sheet.png` |
| 2 | Problem (chalk) | An eyebrow and a two-line heading, then a **before/after pair**: a white card with a dash list beside a navy card with a check list, plus a one-line footnote. | Reveal 760 ms. | `07–08` |
| 3 | The system (white) | A heading, a lead and a **"بيانات تجريبية" (demo data) badge**. A 2 × 2 grid of feature cards, each with a **realistic mini-interface built in HTML** (lists, status badges, a result score). | Reveals; a "sheen" sweep (1.7 s, once). | `08–10`, `27-hover-card.png` |
| 4 | Branding (navy) | A heading, a check list and a text link. On the end side, a browser-frame mock-up of a site carrying the customer's name, labelled as demo data. **A large blue arc is cropped off the edge.** | Reveals. | `11` |
| 5 | Audiences (white) | Three cards (teacher, centres, students), each with an oval photo slot that **publicly shows art-direction placeholder text**, then a title, three checks and a **link to its own page**. | Reveals. | `12` |
| 6 | Process (chalk) | **Four steps in a row**: numbered circles 01–04 joined by hairlines, **running right to left**, each with a title and a two-line description. | Reveals. | `13` |
| 7 | Product (near-black) | A full dashboard mock-up: a set-up checklist with done states, a requests list, a bar chart whose **months run right to left**, and a top-lessons list. | Reveals. | `14–15` |
| 8 | Benefit statement (white) | A two-line heading with supporting points. | Reveals. | `16` |
| 9 | Getting started (mist) | Four numbered steps and an outline CTA. | Reveals. | `17` |
| 10 | Close (navy, faint emblem pattern) | A two-line statement, a one-line lead, a CTA pill and a text link to talk to the team. | Reveals. | `18` |
| 11 | Footer (navy) | Logo, tagline and city; **four link columns**; a real email and site; legal links; copyright. | none | `19-…-footer` |

A persistent **2 px scroll-progress bar runs along the top edge and grows from the right**, driven by a CSS scroll-driven animation.

#### 8.3 Mobile, scene by scene
- **Header:** 64 px, with the hamburger at the end (left) and the logo at the start (right).
- **Hero:** eyebrow; h1 34 px at leading 1.28 in three lines with the accent on the last; lead 17.4 px; a **start-aligned (not full-width) CTA pill**; a text link; the check chips stacked. The emblem goes below.
- **Sections:** they stack, and the feature cards keep their mini-interfaces.
- **Process:** becomes a **vertical list of numbered circles** with titles and descriptions (`mobile/13-scroll09`).
- **Length:** 17 viewports.

Evidence: `mobile/24-page-overview-sheet.png`, `05`, `13`, `22-menu-open.png`.

#### 8.4 Navigation
- **Desktop:** a full-width sticky bar (80 px), transparent over the navy hero and dark and solid once past it. It never hides. The **inline nav** has six links, a cyan underline for the active item, a language link and sign-in, and one CTA.
- **Mobile:** a 44 × 44 button opens a **dropdown panel under the header**, not full-screen. It has six links at 18 px weight 500 in **61 px rows with hairline separators**, a row with the language and sign-in links, and a **full-width 56 px CTA**. It opens in about **160 ms** (`mobile/25-menu-timeline-sheet.png`).
- **Keyboard:** a **skip link is the first Tab stop**, and the focus ring is **2 px solid with a 3 px offset**, cyan on navy (`desktop/30-keyboard-focus-tab2.png`).

#### 8.5 Hero composition
Text on the start side, 44 % wide; a brand emblem on the end side; the CTA at 589 px desktop and 460 px mobile; four proof chips under the CTAs. The first screen answers what it is, who it is for and what to do.

#### 8.6 Typography (Arabic / RTL)
- **Scale:** h1 56 px (3.9 vw), weight 700, **leading 1.28, tracking 0**. h2 43.7 px, weight 600, **leading 1.32**. h3 20–25 px, weight 600, leading 1.5. Lead 20 px at leading 1.6 (41–66 characters per line). Body 14–16 px.
- **Mobile:** h1 34 px (8.7 vw) at 1.28; h2 28 px at 1.32; lead 17.4 px at 1.6 (31–33 characters per line).
- **Heading formula:** a short declarative line plus an accent-coloured resolution line, each ending in a full stop. Line breaks are set per breakpoint: spans become blocks from the md breakpoint up.
- **Numbers and bidi:** Western digits throughout (step numbers, scores, counts); Latin runs such as the brand's "+" and the "English" label sit cleanly in RTL.
- **English page:** the same family at leading 1.15, so one face covers both scripts.

#### 8.7 Grid, margins and whitespace
- Container 1280 px, giving 1216 px of content at 1440; **gutters 112 px** on desktop and 20–24 px on mobile.
- Section padding **112 px** on desktop and **64 px** on mobile (80–128 for the close).
- Radii: 18 px for cards, 10 px for controls, pills for buttons and chips.

#### 8.8 Colour
About 48 % white or near-white and about 30 % navy or near-black, with blue accents around 16 % (partly mid-navy). The bands alternate light and dark every 2–3 sections (light, light, dark, light, light, dark …). Of the four sites, this ratio is **the closest to Alshorouk's 55 % white / 25 % black target**.

#### 8.9 Motion
- **Intro:** navy paints at about 300 ms. Hero lines rise and fade over 640 ms `cubic-bezier(0.16,1,0.3,1)` with a 90 ms stagger; the emblem enters over 1300 ms; circuit light-lines wipe **right to left** (`ll-wipe-rtl`, 1.6 s). Settled by about 1.0 s.
- **Scroll reveals:** CSS transitions on opacity and transform, **760 ms `cubic-bezier(0.16,1,0.3,1)`**, with delays of 0, 140 and 220 ms (≈80 ms steps). **One IntersectionObserver** (rootMargin `0 0 −8% 0`, threshold 0.06) drives 72 reveal elements. **No JS animation loop** (0 rAF callbacks per second at idle).
- **Scroll-linked, CSS only:** the top progress bar uses `animation-timeline: scroll(root)`; the hero emblem has a parallax with `animation-range: 0 900px`.
- **Ambient (slow CSS):** a 28 s blob drift, a 14 s grid scan, a 6 s glow, orbits of 30 and 46 s, a 7 s float, and a single 1.7 s sheen.
- **Hover:** buttons change colour over **120 ms `cubic-bezier(0.2,0,0,1)`**; **cards lift 3 px and gain a layered shadow over 260 ms**.
- **Page transition:** none (instant swap, ≈120 ms).
- **Pinning:** none.
- **Reduced motion:** **duration tokens are zeroed** (`--dur-*: 0s; --reveal-distance: 0px`), ambient classes are switched off, and a static light-line replaces the animated one. Only one non-infinite animation remains.

#### 8.10 CTA strategy
- **One primary verb** in the header, hero, mobile menu and close.
- The secondary action is **always a text link with a ← arrow**.
- A section-level outline CTA appears once.
- **Audience cards end in links to their dedicated pages**, matching our segment routing.

#### Admirable
- **Native Arabic typography:** zero tracking, heading leading of 1.28–1.32, body 1.6, deliberate line breaks, two-line headings, Western digits.
- **Motion that follows reading direction:** progress grows from the right, light-lines wipe right to left, arrows point ←, and chart months run right to left.
- **Motion engineering:** motion tokens, reduced motion done properly, and **zero idle JavaScript**.
- **Accessibility:** a skip link, a visible 2 px offset focus ring, 44 px targets, `hreflang` and canonical, and correct `lang` and `dir` on both locales.
- **Product UI built in HTML** (crisp and translatable) and **labelled as demo data**.
- Light and dark banding.
- Audience cards that route to their own pages.

#### Inappropriate for a poultry B2B distributor
- Education imagery and interfaces (courses, quizzes, students).
- The navy and cyan glow palette, and the glass emblem.
- **Placeholder text visible to the public** in photo slots. That is a "coming soon" stub, which `AGENTS.md` forbids.
- Demo dashboards with sample people and addresses. For a veterinary catalogue, sample products or prices would break the no-fabrication policy **even with a label**.

#### Adopt (pattern → Alshorouk scene)
1. **Arabic type settings:** tracking 0, display leading tested from 1.1 up to 1.28, body 1.7 per the brand audit, and line breaks chosen per breakpoint → **all headings**, especially **S1, S3 and S11**.
2. **Heading formula:** eyebrow, statement line, resolution line → every section. The accent line is **black or vermilion, with vermilion only at 32 px or larger** (brand audit §3: vermilion on white is 3.69:1).
3. **Hero structure:** start column of about 44–48 % holding the eyebrow, a 2–3-line h1, a lead, the primary CTA plus a text link, and chips → **S1**. The chips name the **three segments** (تسمين · بياض · أمهات), never claims.
4. **Numbered process row with hairlines, right to left, becoming a vertical list on mobile** → **S6** reduced-motion and mobile states, and the **How we work** page.
5. **Light and dark banding** → homepage rhythm: black bands at about S3 or S6 and at S11, landing near the 25 % black target.
6. **Mobile menu structure:** 48–56 px rows with hairlines, a language row and a full-width CTA at the foot, opening in under 250 ms → **MobileMenu**.
7. **Skip link and a 2 px focus ring with a 3 px offset** → global `Button` and link styles (vermilion or black ring by ground).
8. **Motion tokens:** 760 ms expo-out reveals, ≈80 ms steps, an observer that fires at 8 % into view, and reduced-motion token zeroing → our §8.3 tokens (see P10 and P12).
9. **Audience cards linking to dedicated pages** → **S4** on mobile and the **Poultry solutions** overview, linking to `/solutions/broilers`, `/layers` and `/breeders`.
10. **A scroll-progress bar growing from the right** → long **articles** and **segment pages** only (spec §8.5 optional), using a CSS scroll-driven animation with a no-op fallback.

#### Reinterpret (how it becomes Sunrise System / documentary poultry)
- **A blue arc cropped off the edge** → a **Signature Curve** group cropped by an edge, in a section that carries no other motif.
- **A light-line wipe running right to left** → the **draw direction for Distribution Flow** in Arabic: the route starts at the right and ends at the amber node on the left (brand audit §7.2).
- **A product interface built in HTML** → the **S8 product preview** and the **catalogue** use real approved records only. Where none exist, show the **category explainer with a "request the current list" CTA** (spec S8). Never sample SKUs, even labelled. The "demo data" label is acceptable only in internal staging fixtures.
- **The before/after card pair** → not on the homepage. A softer version, «ما تخبرنا به» beside «ما نؤكده لك», could explain the inquiry flow on **Contact** and **How we work**, with no performance claims.

#### Reject
Placeholder text visible in production; glow blobs, glass emblems and a navy-and-cyan palette; demo dashboards with sample people; mixing two typefaces where one is never loaded.

#### Do not transfer
All copy, slogans and section headlines; the emblem, logo and pattern; the navy, cyan and blue palette; the education interfaces, dashboards and sample data; icons; photography (none was live; slots only); code and CSS.

#### Evidence (paths, URL, date, viewport)
https://www.imtyaze.com/, `/about` and `/en`, 2026-10-09.
- Desktop: `.reference/imtyaze/desktop/01–31`. Key files: `04-intro-3500ms.png`, `13-scroll08` (process row), `12-scroll07` (placeholder slots), `17-scroll12`, `27-hover-card.png`, `28-en-hero.png`, `30-keyboard-focus-tab2.png`, `31-scroll-video.webm`.
- Mobile: `.reference/imtyaze/mobile/01–27`. Key files: `05-scroll01`, `13-scroll09`, `22-menu-open.png`, `25-menu-timeline-sheet.png`.

---

## 9. Cross-site pattern matrix

| # | Pattern (described in our words) | Seen on | Alshorouk destination | §8.4 moment | Brand-native form |
|---|---|---|---|---|---|
| 1 | A shape cropped by an edge as a hero accent | byteforce (filled disc), imtyaze (arc) | S1, S11; About, Contact and 404 heroes | M1, M6 | **Signature Curve**: 1–3 stroked PDF arcs (vermilion, then amber, then black or white at 50 %), butt caps, never filled |
| 2 | A line-by-line headline reveal | imtyaze (640 ms, 90 ms stagger) | S1, S3, S11; interior heroes | M1, M6 | Mask reveal per line, with block-axis padding; Arabic is never split below the word |
| 3 | A proof band with counters | byteforce | S2 | M2 | **Distribution Flow** underline with one amber node; counting in round steps; no overshoot |
| 4 | Lines converging on one destination | bsystems | S6; segment pages ("how we help") | M4 | Distribution Flow: straight runs, true 45° turns, five nodes, one amber destination |
| 5 | A timeline whose nodes light as the line arrives | bsystems, mindoo | How we work; S6 desktop | M4 | The route at the **start edge** with cards on one side, right to left |
| 6 | Large ghost numerals | bsystems, byteforce | S4 (01/02/03), S5 (01–04) | M3, M5 | Montserrat at 120–160 px in an 8–12 % tone; static |
| 7 | A sticky heading or media column in CSS | mindoo | S4 desktop, segment pages, About | M3 | A sticky media panel at 48–55 % width; ScrollTrigger only toggles the swap |
| 8 | One node branching to three | mindoo | S4 introduction; Poultry solutions overview | M3 | Distribution Flow (straight, 45°), never curves |
| 9 | A pure-type reset chapter | mindoo, bsystems | S3; an About values chapter | none | Display Arabic on white or black, no motif (brand audit §7.3) |
| 10 | A numbered process row, then a vertical list on mobile | imtyaze, byteforce | S6 static and mobile; How we work | M4 | Numbered nodes on hairlines, right to left |
| 11 | Audience cards linking to their own pages | imtyaze | S4 mobile; Poultry solutions | M3 | Three segment cards, each linking to its route with a documentary photo |
| 12 | Light and dark banding | imtyaze | the whole homepage | none | White and black bands near 55 / 25 % |
| 13 | Eyebrow plus a two-line heading | imtyaze, bsystems | every section | none | «01 — label» eyebrow; a vermilion line only at 32 px or larger |
| 14 | A full-screen or panel menu with large links and a CTA row | bsystems, mindoo, imtyaze | MobileMenu | none | Black panel, Arabic links at 28–36 px, Crest Pattern at the edge, open in ≤ 500 ms |
| 15 | A closing statement with one decisive CTA | bsystems, mindoo, imtyaze | S11 | M6 | Black field, display headline, curve leaving the frame |
| 16 | A card lift of −3 px with a shadow over 260 ms | imtyaze | S5, S8 and catalogue cards | M5 | Lift plus image scale 1.03–1.05 (spec S5) |
| 17 | A scroll-progress bar from the start edge | imtyaze | Articles, segment pages | none | A 2 px vermilion bar growing from the right |
| 18 | A skip link and a designed focus ring | imtyaze | Global | none | A 2–3 px ring in vermilion or black with a 2–3 px offset |
| 19 | A short route transition | byteforce | Global | none | 200–300 ms opacity on `main` only; the header persists |
| 20 | A header that condenses after the hero | byteforce, imtyaze | Header | none | Full-width bar that turns solid white with a hairline after S1 |

---

## 10. Derivation guard

The spec (§2) warned that Alshorouk's black, white and vermilion overlap byteforce's "black/red" identity. On the capture date byteforce was **orange-to-purple on lavender**, so the realistic risk is now **orange-family pill CTAs and gradient headings**. Alshorouk stays distinct through:
- vermilion `#FE3300` used solid and flat on a white or black base, with **no gradient on any UI, text or button** (the gradient is allowed only on large sunrise shapes);
- curve geometry measured from the logo (brand audit §7.2) instead of filled discs or blobs;
- **one amber destination node** per Distribution Flow;
- documentary poultry photography instead of 3D renders;
- Arabic-first display type;
- Veterinary Grid structure for the product and values chapters.

**Must not resemble:**
- **byteforce:** a floating rounded pill header with a gradient CTA; a lavender canvas; an isometric render on a cropped disc; a tilted "welcome" sticker; a row of three stat cards above a line chart; a horizontal tab bar driving one big orange card; a logo marquee; two big solid colour cards placed side by side.
- **bsystems:** a small centred pill header with a hamburger on desktop; mono "system" labels; a **centre-line** timeline with pink nodes and alternating cards (ours runs along the start edge); glass isometric renders; a bento close with a black card and a circular arrow button.
- **mindoo:** a dark-glass pill header with a segmented language switch; curved branch lines; a chart card with KPI chips; a giant-word triptych **on the homepage** (we keep it for an About chapter only); purple.
- **imtyaze:** a navy hero with a glowing emblem and circuit lines; blue-on-navy two-line headings with the same punctuation habit. **Typeface note:** Alexandria is on the brand audit's shortlist of free staging faces (§4.5). Choosing it would make our staging type match imtyaze exactly. Prefer IBM Plex Sans Arabic, Readex Pro or Noto Kufi Arabic, or accept the resemblance knowingly; this is the orchestrator's call in `src/styles/fonts.ts`.

---

## 11. Craft principles with measurable targets

There are 17 principles. Each gives the evidence from the references, then the target. Targets conform to `AGENTS.md`, the spec and `docs/brand-audit.md`. Where a reference suggests a value outside the spec, it is flagged as a proposal.

**P1 — First-screen contract.**
- *Evidence:* all four place the primary CTA at y = 589–682 px on desktop and 460–584 px on mobile.
- *Target:* at 1440 × 900 and 390 × 844, the first viewport shows the logo, the h1, the three segments, the four supply lines in the subhead, and the primary CTA. The CTA top edge sits at **≤ 680 px on desktop and ≤ 600 px on mobile**. The hero image's subject (chickens) stays visible at 390 px.

**P2 — Arabic hero scale.**
- *Evidence:* the Latin references run 72–88 px (5.0–6.1 vw). The Arabic reference uses 56 px (3.9 vw) and still reads as display.
- *Target:* the Arabic hero h1 is **64–80 px at 1440 (4.4–5.6 vw)**. This uses the spec's display extension, pending brand-owner decision O7. It runs **2–3 lines, ≤ 7 words per line**. On mobile it is **36–40 px (9–10 vw), ≤ 4 lines**. Every other heading stays on the brand token of 32–56 px. The hero h1 is 4–5× body size on desktop and about 2.3× on mobile.

**P3 — Arabic leading, tracking and masks.**
- *Evidence:* leading of 1.28–1.32 on imtyaze is clean; mindoo `/ar` at 1.05 with −2.2 px tracking crowds marks and breaks joins.
- *Target:*
  - **Letter-spacing is 0** for all Arabic, with no inherited Latin tracking.
  - Display leading starts at the brand's **1.1** and is raised (≤ 1.25) only if marks or descenders collide at 320, 390 or 1440 px with the staging face and then with Thmanyah. The Brand Guardian decides.
  - Body leading is 1.7.
  - Mask wrappers get **≥ 0.12 em** of block-axis padding.

**P4 — Measure.**
- *Evidence:* leads of 41–66 characters per line read well (imtyaze); up to 80 tires the eye (mindoo).
- *Target:* Arabic lead and subhead at **≤ 62 characters per line** on desktop (about 36 rem at 20 px); body 60–75 (spec); **30–40 on mobile**.

**P5 — Container and gutters.**
- *Evidence:* the calm references use **104–112 px** gutters at 1440 and 1216–1300 px of content. The 52 px gutter under 80 px headlines feels cramped.
- *Target:* container 1280–1360 px. The spec's `clamp(24px, 4vw, 88px)` gives only 58 px at 1440, so **propose `clamp(24px, 6vw, 88px)`** (86 px at 1440, still within the spec's maximum) for the Design Director. Mobile gutters are 24 px.

**P6 — Section rhythm and bands.**
- *Evidence:* section padding is 112–160 px on desktop and 64–96 px on mobile. Banding of about 30 % dark lands close to our 25 % black.
- *Target:*
  - Desktop padding is **128 px** by default, **160 px** for chapter openers (S3, S11) and 96 px for compact sections (S10).
  - Mobile padding is **80 px** by default and 64 px when compact.
  - Black bands fall every 2–3 scenes, for a homepage total of **≈25 % black pixels**.
  - **No more than two consecutive sections sit on the same ground** (white, warm grey `#F6F5F3` or black), except S11 running into the footer.

**P7 — Pacing and length.**
- *Evidence:* a new idea arrives every 1.0–1.4 viewports (byteforce 8 sections in 9.8 vh; imtyaze 10 in 10.2 vh). The 18.5-viewport mobile page drags.
- *Target:* the homepage is **≤ 12 desktop viewports (≈10,800 px at 900 px tall) and ≤ 16 mobile viewports**. No scene is taller than 1.6 viewports, except the S4 sticky chapter (≤ 3 viewports).

**P8 — Heading formula.**
- *Evidence:* a consistent eyebrow (bsystems, imtyaze) and two-line statement-plus-resolution headings (imtyaze).
- *Target:*
  - The eyebrow is 13–14 px, Medium (500), with an optional «01 —» index in Montserrat.
  - The h2 runs **two lines of ≤ 6 words each**, with **at most one accent line**. The accent is vermilion only at ≥ 32 px; otherwise it is black.
  - The heading never exceeds 4 lines on mobile.

**P9 — CTA system.**
- *Evidence:* all four repeat one primary action; byteforce dilutes it with four verbs; imtyaze pairs each button with a quieter text link and arrow.
- *Target:*
  - **One primary verb family** (اطلب / تواصل) in the header, S1, S5, the S8 empty state and S11.
  - The secondary action is a **text link with a direction-aware arrow** (← in Arabic).
  - A primary CTA is reachable within **≤ 2 viewports** from any point.
  - Button height is 48–56 px and touch targets are ≥ 44 px. No pulsing.

**P10 — Reveal tokens.**
- *Evidence:* 760 ms `cubic-bezier(0.16,1,0.3,1)` with ≈80 ms steps triggered at 8 % into view (imtyaze); 700–800 ms ease-out (mindoo); 300 ms fades that feel thin (byteforce).
- *Target:*
  - Component entrance takes **600–700 ms** with **16 px** of travel and `power3.out` (or the expo-out curve above).
  - The **stagger is 70–100 ms** across ≤ 5 items, so the whole **cascade is ≤ 500 ms**.
  - The trigger fires when the element's top passes **85–90 % of the viewport**.
  - Reveals are **one-shot** and never re-hide.
  - Headline lines stagger by **80–120 ms** (spec).

**P11 — Counters that never overstate.**
- *Evidence:* byteforce's spring shows numbers above the true value.
- *Target:* S2 counts **once**, in **≤ 1.2 s**, with ease-out and **no overshoot**, stepping in round increments from about 80 % of the value (240 → 300 in steps of 10; 12 → 15 in whole millions; 120 → 150 in steps of 10). The word «حوالي» and the labels are static from first paint. Figures use tabular numerals with reserved width (0 CLS), and the full sentence is in the DOM for screen readers.

**P12 — Zero perpetual motion.**
- *Evidence:* three of the four keep 7–45 infinite animations running even with reduced motion and run JavaScript loops of 69–145 rAF callbacks per second at idle. imtyaze runs none.
- *Target:* after the intro, **0 infinite animations and 0 rAF callbacks per second at idle** (measured as in §2.3). Any ambient effect is CSS-only, transform or opacity, has a period ≥ 6 s, is paused offscreen and is removed under reduced motion. Reduced motion **zeroes the duration tokens** and renders final states.

**P13 — Scroll discipline.**
- *Evidence:* none of the four hijacks scrolling or pins with JavaScript; mindoo gets its "pinned" feel from CSS sticky.
- *Target:*
  - Native scroll, with no Lenis by default (spec §8.2).
  - CSS `position: sticky` for S4 on desktop; ScrollTrigger only **toggles or scrubs** inside it.
  - Scrubbed SVG drawing only in S6 and S11.
  - Parallax **≤ 32 px on desktop, 0 on mobile**.
  - Total sticky distance **≤ 3 × 100 vh**.

**P14 — Navigation.**
- *Evidence:* two of the four hide the whole site structure behind a hamburger at 1440. Dropdown menus open in 0.16–0.28 s; full-screen cascades take about 1 s.
- *Target:*
  - **Inline desktop nav at ≥ 1024 px**: ≤ 7 links plus `EN` plus one CTA.
  - The header is 72–80 px on desktop and 64 px on mobile, sticky, and turns solid after S1.
  - The mobile panel is visible in **≤ 250 ms**, links stagger by 40–60 ms, and **the whole sequence takes ≤ 500 ms**.
  - Panel rows are ≥ 48 px, with a language row and a full-width CTA at the foot.
  - Focus is trapped, Esc closes, focus is restored and page scroll is locked.

**P15 — RTL directionality.**
- *Evidence:* imtyaze mirrors motion and data (progress bar, light-lines, arrows, chart months); mindoo `/ar` mirrors the layout but not its gradient, numbers or labels.
- *Target:*
  - Every directional element follows the reading direction: the Distribution Flow starts at the right, the process runs 01 → 05 from right to left, progress grows from the right, and chart axes run right to left.
  - Gradients use logical direction.
  - Signed numbers and Latin runs are wrapped in `<bdi>`.
  - The Arabic route has **0 untranslated UI labels**.
  - The Signature Curve is **never mirrored**; it keeps the PDF orientation (§12, M1).

**P16 — Honest content states.**
- *Evidence:* a placeholder phone pattern (byteforce), visible art-direction placeholder text (imtyaze), unsourced KPI chips (mindoo) and a logo marquee (byteforce).
- *Target:*
  - **0 placeholder strings in production.** Add a CI check for `example.com`, sequential digits in phone fields, lorem ipsum, and slot text such as «مكان مخصص».
  - Empty states use a brand-native graphic (Crest Pattern band or Veterinary Grid) plus a working CTA.
  - No chart, KPI, logo, testimonial or product appears without an approval record.

**P17 — Accessibility and stability baseline.**
- *Evidence:* only imtyaze has a skip link and a designed focus ring; the others rely on `outline: auto`. byteforce's typewriter produced CLS of 0.45 / 1.25. bsystems logs 3 SVG errors.
- *Target:*
  - A **skip link is the first Tab stop**, and the focus ring is **2–3 px solid with a 2–3 px offset and ≥ 3:1 contrast** on every ground.
  - **CLS ≤ 0.05.** No text animation may change the line count.
  - The hero LCP image is visible at first paint (no opacity-0 start), and the h1 reveal finishes by 1.2 s.
  - The console shows **0 errors**.

---

## 12. Six signature motion moments: one idea each

Every idea uses one Sunrise motif per section, following the motif map in brand audit §7.3. Every idea animates only `transform`, `opacity`, `clip-path` or `stroke-dashoffset`; leaves content visible without JavaScript; and has a reduced-motion state that is the final frame. Timings are starting points for `docs/motion-storyboard.md`.

### M1 — Sunrise Line Reveal (Scene 1, hero)
- **Motif:** **Signature Curve**, using the p.1 cover geometry (three cubic arcs: vermilion, amber, black; strokes in a 4 : 4 : 2 ratio; butt caps). The extra distribution line in the hero is dropped (brand audit D11).
- **Learned from:** byteforce's shape bleeding off the edge, now stroked and drawn rather than filled and slid. Also imtyaze's line-by-line hero reveal and its draw that follows reading direction.
- **Composition:** Arabic text in the start column (right). The documentary farm image fills the end column and bleeds to the left page edge. The curve group sits in the image's **lower third** (brand audit p.14 rule). It **keeps the PDF orientation (not mirrored)**, rising from its low point to its high end, where the image frame or viewport edge crops it. It never crosses the text column or the logo's clear space.
- **Timeline (desktop):**
  - **0–400 ms:** the image is visible at first paint as the LCP, with no fade. A `clip-path` horizon mask opens from 92 % to 100 % over 700 ms `power2.out`; the image stays readable throughout.
  - **150–850 ms:** the three arcs draw (`stroke-dashoffset`), vermilion first, then amber at +90 ms, then black at +180 ms, each over 700 ms `power3.out`.
  - **Settle:** the group eases 6 px back along its normal over 400 ms `power2.out`, then **stops**. No idle loop.
  - **350–1200 ms:** the h1 reveals line by line through padded masks, 640 ms each with a 100 ms stagger.
  - **650–1400 ms:** the subhead, CTAs and segment chips rise 16 px and fade in.
- **On scroll:** the image parallaxes ≤ 32 px. The curve stays fixed to the frame so the edge crop stays stable.
- **Mobile:** the image is recomposed with chickens visible above the text. The curve is scaled to 70 % and draws once over 600 ms. No parallax.
- **Reduced motion:** curves, text and image are static in their final state.
- **Budget:** one inline SVG (< 2 KB); no JavaScript loop after 1.4 s.
- **QA:** the three arcs end cropped at an edge; CLS stays 0; no text collision at 320, 390, 768 and 1440 px.

### M2 — Farm Network Stats (Scene 2)
- **Motif:** **Distribution Flow** as micro-underlines, with **exactly one amber node in the band**.
- **Learned from:** byteforce's proof band, corrected to remove overshoot; bsystems' nodes lighting as a line passes; imtyaze's one-shot observer trigger.
- **Composition:** a short sentence above three blocks. Each block reads «حوالي» + number + label, with the number in Montserrat at about 56–88 px on desktop. Anything above the 56 px headline token uses the display extension, pending O7. A single route runs beneath all three, from **right to left**: horizontal runs with true 45° jogs between blocks and a node under each block. **The last node (left) is amber with a 2 px black ring**; the others are black on white.
- **Timeline:** a one-shot trigger fires when the band's top passes 80 % of the viewport.
  - The route draws over 1.0 s `power2.inOut`.
  - Each count starts as the line nears its node (+0, +120 and +240 ms) and runs 900–1000 ms `power2.out`, **in round steps from about 80 %**: 240 → 300, 12 → 15 مليون, 120 → 150.
  - Each node fills when the line reaches it, over 150 ms.
  - The amber node scales from 0.6 to 1 once, over 250 ms. No pulse.
  - **Total ≤ 1.3 s.**
- **Mobile:** blocks stack; the route turns vertical along the start edge (right) with 45° jogs; the timings are the same.
- **Reduced motion:** final numbers, route and nodes, static.
- **Accessibility:** each block is one sentence in the DOM. Animated digits are `aria-hidden` and a stable label is exposed. No `aria-live`.
- **QA:** figures never show a value above the final one; CLS is 0 (tabular numerals with reserved width).

### M3 — Segment Scene Transitions (Scene 4)
- **Motif:** none; photography leads (brand audit §7.3). Registered numbers 01, 02 and 03 carry the system.
- **Learned from:** mindoo's CSS-sticky column, bsystems' ghost numerals, and imtyaze's audience cards linking to dedicated pages.
- **Desktop composition:** a sticky media panel (50 % width, end side, `position: sticky; top: header`) beside three chapters of copy (≥ 80 vh each) for التسمين, البياض and الأمهات, each with its own CTA to its route.
- **Swap:** when a chapter's heading crosses the middle of the viewport (a ScrollTrigger toggle, not a scrub), the incoming photo reveals with a **`clip-path` inset wipe from the start edge** (right to left in Arabic) over 800 ms `power3.out`, while its scale settles from 1.04 to 1.0. The outgoing photo holds underneath, so there is never a blank frame. The large number (Montserrat 140 px, 10 % tone) rolls 24 px and crossfades over 400 ms. A three-segment progress rule on the panel fills to the active chapter. Scrolling back reverses the swap.
- **Mobile:** no sticky. Each chapter is a photo (4 : 5) that reveals once with an inset from the bottom over 700 ms, followed by its text and CTA.
- **Reduced motion:** all three photos sit inline in the flow; nothing is pinned or swapped.
- **Accessibility and performance:** focus never moves to the hidden media; each photo has segment-specific poultry alt text; the next image preloads when its chapter is one viewport away; images use AVIF or WebP at `sizes="50vw"`.

### M4 — Distribution Node Journey (Scene 6)
- **Motif:** **Distribution Flow**: five step nodes on straight runs with **true 45° turns**, and the **fifth node as the single amber destination**.
- **Learned from:** bsystems' converging diagram and its node-lighting timeline, imtyaze's numbered process row running right to left, and byteforce's process line.
- **Desktop composition:** the route crosses the content width from the **right** (step 1) to the **left** (destination) on two levels, rising at 45° between steps 2 and 3 and again between 4 and 5. An ordered list of five step cards (number, title, one line) is aligned to the nodes.
- **Drawing:** the stroke draws **scrubbed** (`scrub: 0.5`) while the section moves from 20 % to 70 % of the viewport. Each node fills as the line reaches it (150 ms). The matching card rises 12 px and goes from 0.35 to 1 opacity over 450 ms, so text is never invisible.
- **Destination:** the amber node lights **once** (scale 0.6 to 1, 300 ms, 2 px black ring) and **stays lit** when scrolling back. No pulse and **no pin**; the user keeps scrolling normally.
- **Mobile:** a vertical route along the start edge with five nodes and the cards beside it. Each node draws once on entry (≤ 400 ms per node). The amber node is at the bottom.
- **Reduced motion:** the complete route, all nodes filled, the amber destination and all cards, static.
- **Accessibility:** the SVG is `aria-hidden`; the steps are an `<ol>` with headings; nothing implies geography.

### M5 — Product Pillar Reveal (Scene 5)
- **Motif:** **Veterinary Grid**, 4 × 4, with **one vermilion module (which may span 2 cells), one black module and at most one amber module**.
- **Learned from:** bsystems' card choreography (without springs or tilt), mindoo's stepped card row (as the source of the asymmetry), and imtyaze's card lift.
- **Composition:** four pillar panels (أعلاف الدواجن, مكملات الأعلاف, الأدوية البيطرية, اللقاحات البيطرية), with oversized indexes 01–04, laid out asymmetrically on the 4 × 4 module grid. **The vermilion module holds the real catalogue CTA**, for example «تصفح المنتجات» or «اطلب القائمة الحالية», with black text on vermilion (5.69 : 1). The black module holds the section index; the amber module, if used, is decorative with no text.
- **Timeline:** a one-shot trigger at 85 % of the viewport.
  - The hairlines draw from the start edge (scale 0 → 1, 500 ms, 40 ms per line).
  - The panels reveal their photos with a `clip-path` inset from the module edge over 800 ms `power3.out`, **staggered 90 ms in reading order** (right to left, top to bottom), while each index rises 16 px.
  - **Last**, the vermilion module fills from the start edge (scaleX 0 → 1, 500 ms) so the eye **ends on the catalogue CTA**.
- **Hover (fine pointer only):** photo scale 1.03–1.05 over 220 ms `ease-out`, a 3 px lift and a shadow; `:focus-visible` gives the same result.
- **Mobile:** a compact 4 × 4 graphic at the start of the section (brand audit rule), then four stacked cards (image 4 : 3) and the vermilion CTA module last, each revealed once over 600 ms.
- **Reduced motion:** the static grid and panels; no hover scaling.

### M6 — Closing Sunrise CTA (Scene 11)
- **Motif:** **Signature Curve** on a black field, rising from the **lower right** (spec), with the third line in white at 50 % (brand audit §7.2 on dark grounds).
- **Learned from:** the decisive close of bsystems, mindoo and imtyaze (one statement, one action), and byteforce's single centred closing CTA. The motion is deliberately **different from M1**.
- **Composition:** a black section of 80–100 svh. The headline «مزرعتك تستحق شريكًا يعرف احتياجاتها.» is set in white display type (72–88 px on desktop, within the spec's 5.8 rem display cap and pending O7; two lines). Below it, a subhead, then the primary CTA «ابدأ التواصل» (vermilion with black text) and a secondary text link «تصفح المنتجات ←».
- **Timeline:**
  - While the section scrolls in from 0 % to 100 % of entry, the three arcs **grow from the lower-right corner and sweep up and out through the far edge**: `stroke-dashoffset` scrubbed with `scrub: 0.6`, plus a ≤ 24 px drift of the group, so the light appears to rise and leave the frame. M1, by contrast, draws once and settles.
  - The headline reveals line by line (stagger 100 ms, 700 ms).
  - The CTAs rise 12 px at +300 ms.
- **Mobile:** curves at 60 % scale draw once on entry over 900 ms (no scrub); the CTA is full width at 56 px.
- **Reduced motion:** final curve position and static text.
- **QA:** the curve never touches the headline or CTA boxes; white on black passes for all sizes; the footer that follows sits on black with the white logo.

---

## 13. Supporting motion notes

These are optional, and they apply the principles above.
- **Mobile menu:** a black panel slides 24 px and fades in over 220 ms. Arabic links rise 12 px and fade, 40–60 ms apart. The CTA arrives at about 400 ms; the whole sequence takes ≤ 500 ms. A static Crest Pattern band sits at the panel edge. Closing is a 160 ms fade.
- **Route transition:** `main` only, 200–300 ms opacity out and in. The header persists. Focus moves to the new `h1`, and navigation is never blocked.
- **Article and segment-page progress:** a 2 px vermilion bar grows from the right, using `animation-timeline: scroll(root)` with an IntersectionObserver fallback. It is hidden under reduced motion.

---

## 14. Consolidated do-not-transfer list

None of the following may enter the repository, `public/`, the CMS seed data, the copy, the design files or the generated assets:

1. **Copy:** headlines, taglines, section titles, CTA labels, offer names and microcopy from any of the four sites, in English or Arabic. This includes imtyaze's Arabic phrasing and its two-line headline wording.
2. **Identity:** their logos, wordmarks, emblems and favicons; their palettes, namely byteforce's orange and purple with its lavender canvas, bsystems' pink and violet mesh, mindoo's purple and cream, and imtyaze's navy, blue and cyan; and their gradients.
3. **Imagery:** illustrations, 3D and isometric renders, chart graphics, dashboard and interface mock-ups, glass emblems, patterns, the dial and orbit graphics, and photo-slot art.
4. **Icons:** their icon sets and icon tiles. Ours follow brand audit §8.2 (24-unit grid, 2-unit stroke).
5. **Fonts:** the files they serve. Raleway, Montserrat and Alexandria are OFL fonts, but any font we use comes through `src/styles/fonts.ts` from its official source, never from their servers.
6. **Code:** HTML, CSS, JS, SVG paths, keyframes, easing curves copied verbatim, and component structure. This document records only measurements and generic techniques.
7. **Client and partner logos**, testimonials, case studies, stat values, KPIs and charts.
8. **Contact details** of any reference: phones, emails and addresses.
9. **Screenshots and video** from `.reference/`. They are internal research only, never under `public/` and never in deliverables.

---

## 15. Handoffs and open questions

| To | Item | Why |
|---|---|---|
| Brand Guardian / Design Director | Test Arabic display leading at the brand's **1.1** against 1.2–1.25 with the staging face, then with Thmanyah (P3). | The reference evidence favours 1.28 for clean Arabic; the brand token is 1.1. |
| Design Director | Consider a desktop gutter of `clamp(24px, 6vw, 88px)` (P5). | The spec's 4 vw gives 58 px at 1440; the calm references use 104–112 px. |
| Orchestrator (`fonts.ts` owner) | If Alexandria is chosen as the staging face, the site will share imtyaze's typeface (§10). | Derivation risk; the alternatives are on the same shortlist. |
| Motion Director | Adopt the M1–M6 timings above as the `docs/motion-storyboard.md` baseline. Confirm the **no-mirroring** rule for the Signature Curve and the **mirroring** rule for Distribution Flow (P15). | Consistency with brand audit §7.2. |
| Motion Director / QA | Add measurable checks: idle rAF = 0, infinite animations = 0 under reduced motion, CLS ≤ 0.05, and counters never above their final value (P11, P12, P17). | Three of the four references fail these. |
| UX / IA | Inline desktop nav at ≥ 1024 px (P14). | Two references hide the site structure behind a hamburger at 1440. |
| Copywriter | Use the two-line heading formula with our own approved copy; one CTA verb family (P8, P9). | Their wording must not be reused. |
| QA | Add a CI "placeholder string" check (P16). | Live faults were seen on two references. |

---

## 16. Deliverable status

| Deliverable | Status | Evidence |
|---|---|---|
| `docs/reference-audit.md` (this file) | **implemented**, `needs_review` (G1.2) | §1–§15 |
| Desktop and mobile capture of all four references | **verified** | 239 files (≈86 MB) in `.reference/` (§2.5). Homepage viewports, desktop / mobile: byteforce 13 / 16, bsystems 16 / 16, mindoo 14 / 16, imtyaze 14 / 16. |
| Intro, menu and transition timelines; reduced-motion pass; focus pass; scroll videos | **verified** | the sheets, `*-reduced-motion-hero.png`, `*-keyboard-focus-tab2.png` and `*-scroll-video.webm` files in each site folder |
| ≥ 6 motion ideas mapped to §8.4, with reduced-motion states | **implemented** | §12 (M1–M6) |
| 12–18 craft principles with measurable targets | **implemented** | §11 (P1–P17) |
| Access problems logged | **verified: none** | §3 |
| Asset reuse | **none** | No reference asset, font, code or copy was copied into the repo or `public/`. Scripts stay in the analyst's scratch folder. |
