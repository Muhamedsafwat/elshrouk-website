---
name: alshorouk-reference-research
description: Analyse the four reference websites on desktop and mobile with Playwright and turn them into an evidence-based craft audit (adopt, reinterpret, reject) without copying any asset, text or code — use when creating or updating docs/reference-audit.md or when a design or motion decision needs a reference rationale.
---

# Skill: Alshorouk Reference Research

Role owner: Research & Reference Analyst (spec §13.2). Output feeds Gate 1 and the art-direction and motion skills.

## Activation
- Phase 1 reference audit, or any refresh of `docs/reference-audit.md`.
- A design or motion agent wants to justify a pattern "like site X" — verify the pattern here first.
- A reviewer suspects a section is too close to a reference (derivation check).

## Inputs
- References (spec §2): `https://www.byteforceinc.com/` · `https://www.bsystemseg.com/` · `https://mindooco.com/en` · `https://www.imtyaze.com/`.
- Art-direction sentence (spec §2), homepage scenes 0–11 (spec §5), the six signature motion moments (spec §8.4).
- Tools: Playwright 1.64 with the cached Chromium build; Chrome and Edge channels (`channel: 'chrome' | 'msedge'`); Python + Pillow for contact sheets. Run research scripts from your own scratch folder (e.g. `<scratch>/ref-research/` with `npm i playwright@1.64.0`) — never add research dependencies to the repo.
- Storage: analysis text in `docs/reference-audit.md` (committed); screenshots and videos in `.reference/<site>/` (git-ignored, internal only — never under `public/`, never deployed).

## Procedure
1. **Capture (per site × viewport).** Desktop 1440×900 (`deviceScaleFactor: 1`) and mobile 390×844 (`isMobile: true, hasTouch: true, deviceScaleFactor: 2`). Use one context at a time with `recordVideo: { dir }`. `page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })`, then scroll in steps of 0.8 × viewport height with ~600 ms pauses, taking a viewport screenshot at every step (`.reference/<site>/<viewport>/NN.png`). Prefer stepped viewport shots over `fullPage` — full-page capture breaks pinned/sticky scenes. Repeat one pass with `reducedMotion: 'reduce'` to see how each site degrades.
2. **Section inventory.** For each site list sections in order: purpose, layout (columns/grid), colour field, headline scale (`getComputedStyle(h1|h2).fontSize`, `lineHeight`), CTA placement, proof devices, how the narrative moves from claim to proof to action.
3. **Motion inventory.** For every motion beat record trigger (load/scroll/hover), properties, approximate duration (from video frame timestamps), easing feel, scrub vs one-shot, pinning, mobile behaviour, reduced-motion behaviour. Detect stacks as facts only: `window.gsap?.version`, `window.ScrollTrigger`, `window.Lenis`, `document.querySelectorAll('canvas').length`.
4. **Performance and accessibility notes.** Transferred bytes (`performance.getEntriesByType('resource')` → `transferSize`), LCP via an in-page `PerformanceObserver`, console errors, `html[lang][dir]`, whether focus is visible after a few `Tab` presses (screenshot it).
5. **Arabic / RTL craft** (mainly imtyaze.com): navigation order, numeral system, bidi handling of Latin runs and phone numbers, Arabic line-height and measure, how CTAs are phrased (describe the pattern, do not quote copy).
6. **Write the per-site analysis** with exactly these headings: Admirable · Inappropriate for a poultry B2B distributor · Adopt (pattern → Alshorouk scene) · Reinterpret (how it becomes Sunrise System / documentary poultry) · Reject · Evidence (paths, URL, date, viewport).
7. **Map to Alshorouk.** A cross-site matrix: pattern → homepage scene (1–11) or page family → signature moment (1–6) → brand-native reinterpretation. Propose at least six motion ideas tied to §8.4 moments (required by Phase 1.2).
8. **Derivation guard.** Alshorouk's black/white/vermilion palette overlaps byteforce's black/red identity. State explicitly how we differ: sunrise-curve geometry from the logo, one amber destination node, documentary poultry photography, Arabic-first display type, Veterinary Grid structure. List "must not resemble" items for each site.
9. **Log access problems honestly.** For any page that fails: status/error, date, viewport, retries (other channel, headed mode). Never write observations for a page you could not load.

## Checklists
**Per site**
- [ ] Desktop and mobile captured; at least one scroll video; reduced-motion pass noted.
- [ ] Section inventory and motion inventory complete.
- [ ] Admirable / inappropriate / adopt / reinterpret / reject / evidence filled.
- [ ] "Do not transfer" list (spec §2): byteforce marketing language, black/red identity, client logos; bsystems software visuals, systems copy, icons, code; mindoo consulting positioning; imtyaze education imagery and interfaces.

**Intellectual property and conduct**
- [ ] No images, fonts, icons, Lottie/video files, CSS or JS from a reference copied into the repo or `public/`.
- [ ] Copy is paraphrased; short labels quoted only when needed for analysis.
- [ ] Screenshots stay in `.reference/` (internal); none appear in deliverables shipped to the client site.
- [ ] No logins, no form submissions, no aggressive crawling (one page at a time, polite pauses, respect robots/ToS).

**Mapping quality**
- [ ] Every "adopt" item names its Alshorouk destination and its brand-native form — never "same as X".
- [ ] At least six motion ideas, each linked to a §8.4 moment with a reduced-motion alternative.
- [ ] Nothing proposed contradicts poultry-only, no-fabrication or the Sunrise System rules.

## Deliverables
- `docs/reference-audit.md`: method (tool versions, date, viewports), per-site analysis, cross-site pattern matrix, six or more motion ideas, do-not-transfer list, access log, evidence index (relative paths into `.reference/`).
- Evidence files in `.reference/<site>/` (screenshots, `.webm` videos).
- Report to the orchestrator with deliverable statuses and any blocked pages.

## Acceptance criteria
- Each of the four references has a desktop **and** mobile analysis backed by evidence paths (spec §13.2 done condition).
- Six or more motion ideas mapped to the signature moments.
- Zero unauthorised asset reuse; all inaccessible pages logged with the real error.
- A reader can trace every adopted pattern to a specific Alshorouk scene and see how it is made original.

## Failure recovery & escalation
- **Bot challenge / blocked:** retry once with `channel: 'chrome'` or `'msedge'` and `headless: false`, wait for the challenge to clear, keep pacing slow. Still blocked → log it and analyse only what loaded. Do not use cached copies or third-party mirrors without recording that the evidence is indirect.
- **Heavy WebGL/video pages time out:** raise timeouts, capture what renders, note the limitation.
- **Reference changed since the spec was written:** analyse the current live state and date-stamp it.
- **A proposed Alshorouk design is too close to a reference:** escalate to the visual-art-direction owner with side-by-side evidence and a reinterpretation proposal.
- **Research needs a tool or dependency not available:** report to the orchestrator; do not install into the repo.

## Spec references
§2 (references, do/don't transfer, research output), §8.4, §13.2, §14.2, §15 Phase 0.3 and Phase 1.2, §17 (quality bar).
