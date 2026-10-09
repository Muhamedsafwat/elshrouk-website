---
name: alshorouk-motion-storyboarding
description: Storyboard every homepage scene and the six signature motion moments for Alshorouk — triggers, timelines, durations, mobile, reduced-motion and no-JS states, performance cost and QA evidence — in docs/motion-storyboard.md before any GSAP code is written; use when planning, changing or reviewing motion on any page.
---

# Skill: Alshorouk Motion Storyboarding

Role owner: Motion Director / Creative Technologist (spec §13.6). The storyboard is the contract that the gsap-implementation skill builds and browser-visual-qa verifies.

## Activation
- Before implementing or changing any animated scene, page transition, header/menu motion or scroll-linked effect.
- When a scene is added to the homepage or an interior page family gets its motion signature.
- When QA reports jank, layout shift, hidden content, motion sickness risk or a mismatch with the storyboard.

## Inputs
- Spec §5 (scenes 0–11 with copy and motion notes), §8.1–8.7 (philosophy, stack, tokens, six moments, safeguards, deliverable), §12.2–12.3.
- Motion tokens in code: `src/lib/motion/tokens.ts` — `motion.hover 0.18s`, `enter 0.65s`, `imageReveal 1.0s`, `lineStagger 0.1s`, `itemStagger 0.08s`, `counter 1.2s`, `travel 20px`, `parallax 40px`; eases `sunrise expo.out`, `out power3.out`, `soft power2.out`, `flow power2.inOut`; queries `mq.motion`, `mq.desktopMotion` (no-preference + ≥ 64rem + fine pointer), `mq.mobileMotion`, `mq.reduced`; `motionDisabled()` (reduced motion, `html.motion-off`, Save-Data).
- Declarative reveal contract: `data-reveal="up|lines|image|fade|draw"` handled by `MotionRuntime`; scenes with their own timeline add `data-reveal-manual`. Hidden start states exist only under `html.js:not(.motion-off)` and `prefers-reduced-motion: no-preference` (`src/styles/globals.css`).
- `docs/art-direction.md` (one motif per section), `docs/reference-audit.md` (motion ideas).

## Procedure
1. **Write one storyboard entry per homepage scene (0–11)** in `docs/motion-storyboard.md` using this template (all fields are required by spec §8.7):

   | Field | Content |
   |---|---|
   | Scroll entry / exit | ScrollTrigger `start`/`end` in words and values (e.g. `top 75%` → `bottom 40%`) |
   | Start → final visual state | what is visible before, what is visible after (final state = no-JS state) |
   | Headline | dictionary key + authored lines |
   | Dominant image | registry id from `src/content/photos.ts` + focal point per breakpoint |
   | Trigger & duration | load / scroll one-shot / scrub; tokens used; stagger; ease |
   | Interaction | hover/focus/tap behaviour, keyboard path |
   | Mobile (< 1024 px) | simplified behaviour; no pinning; parallax off |
   | Reduced motion | exact static final state shown immediately |
   | No-JS / GSAP failure | what renders (must equal the final state) |
   | Performance cost | low / medium / high + why (properties, element count, ScrollTriggers) |
   | QA evidence | screenshot frames + video paths under `screenshots/motion/` |

2. **Specify the six signature moments precisely** (spec §8.4) — each needs its reduced-motion plan:
   1. *Sunrise Line Reveal* (hero): 1–3 parallel arcs echoing the logo's signature curve (not the logo itself) draw in `0.15–0.85s` (DrawSVG), headline lines `0.35–1.2s` with 80–120 ms stagger, copy + CTA `0.65–1.4s` with 12–20 px travel; image visible from first paint (LCP is never delayed by motion). Idle: one barely perceptible non-looping settle; parallax ≤ 24–48 px desktop only. Reduced: arcs drawn, everything static.
   2. *Farm Network Stats*: one timeline when the band enters (once per page view); items stagger ~100–120 ms; numbers count ≤ 1.3 s from ~80% of the target, never from 0; `حوالي` and the unit stay visible in every frame; Distribution-flow underline draws under each item. Reduced: final text immediately. Screen readers get the static `srLabel`; animated digits are `aria-hidden`.
   3. *Segment Scene Transitions*: desktop ≥ 1024 px — CSS `position: sticky` media column (48–55% width) while chapters 01/02/03 scroll; active chapter toggles a clip/crossfade (600–800 ms). Mobile — stacked chapters with image reveal and direct CTA. Reduced — no crossfade; each chapter shows its own image inline.
   4. *Distribution Node Journey*: path draws node-by-node, scrubbed to natural scroll (no pin, no forced scroll-through); the single amber destination node lights once; step cards appear in sync and are readable at all times. Mobile: vertical path along the inline-start edge. Reduced: full path + numbered steps static.
   5. *Product Pillar Reveal*: asymmetric 2×2 panels rise/clip in with 80–100 ms stagger; hover/focus image scale 1.03–1.05 (CSS, ~180 ms); the catalogue CTA receives the final emphasis. Reduced: static, hover scale off.
   6. *Closing Sunrise CTA*: large authored headline lines reveal (80–130 ms stagger); a curve exits the viewport from the lower edge as the footer approaches (scrubbed, transform/DrawSVG only) — a different arc and direction from the hero. Reduced: static curve.
3. **Restrained scenes:** 3 (statement — headline shift ≤ 24 px scrubbed + horizon line), 7 (values grid — cells settle with stagger, one vermilion cell emphasised; hover **and** focus reveal the sentence; mobile accordion), 8 (product preview — stagger + thumbnail zoom), 9 (documentary images, parallax ≤ 24 px desktop), 10 (FAQ accordion height via CSS grid rows 0fr→1fr ~250 ms, then ScrollTrigger refresh), header (elevate after first section; hide-on-scroll only if tested), mobile menu (line reveals 450–600 ms, focus trap). Interior pages: one motion signature per family (About chapter markers + offset reveals; solutions progress UI; catalogue near-static; contact micro-interactions only) — never a copy of the home timeline.
4. **Respect the safeguards (spec §8.6).** Compositor-friendly properties only (transform, opacity, clip-path; stroke-dashoffset for small SVG paths). No scroll hijacking, no Lenis, no perpetual rAF loops, nothing pulsing forever, no animation blocking clicks, no layout shift. Keyboard focus never lands on off-screen or invisible pinned content. Pause idle effects off-screen and on `visibilitychange`.
5. **Set the budget per page:** ≤ 1 pinned/sticky storytelling block, a counted list of ScrollTriggers, no WebGL/Three.js unless a later phase proves value (then lazy, opt-in, with static fallback). Note expected long-task risk under 4× CPU throttle.
6. **Plan the evidence** for each moment: deterministic frames via Playwright's clock (`await page.clock.install()` before `goto`, then `page.clock.runFor(n)` in ≤ 100 ms steps, screenshot at 0 / mid / end), and a `recordVideo` capture at 1440×900 and 390×844 (`screenshots/motion/<moment>-<width>.webm`). Reduced-motion and JS-disabled screenshots of the same viewport prove the static states.
7. **Get sign-off:** the orchestrator records storyboard approval on `docs/task-board.md` (Phase 2) before implementation; changes after sign-off update the storyboard first.

## Checklists
**Per storyboard entry**
- [ ] All template fields filled, including reduced motion, no-JS and performance cost.
- [ ] Final state equals the server-rendered, no-JS state.
- [ ] Durations and eases come from the motion tokens (or a documented exception).
- [ ] Mobile behaviour is a deliberate design, not "same but smaller".

**Six moments**
- [ ] Each has a reduced-motion plan, an evidence plan and a QA owner.
- [ ] Metric qualifiers visible in every frame; no count from 0.
- [ ] No moment duplicates another's composition (hero vs closing curve differ).
- [ ] No pinned section traps touch scrolling or keyboard focus.

## Deliverables
- `docs/motion-storyboard.md`: twelve scene entries (0–11), the six-moment specification, interior page-family signatures, per-page budget, evidence index.
- Evidence paths (frames, videos) added after implementation by browser-visual-qa.

## Acceptance criteria
- Six signature moments storyboarded, each with a low-motion plan (spec §13.6 done condition; Gate 2).
- Every scene's final state is readable without JS and under `prefers-reduced-motion: reduce`.
- Performance cost assessed for every scene; nothing relies on properties that trigger layout.
- Implementation and QA can be traced line-by-line to the storyboard.

## Failure recovery & escalation
- **A beat cannot meet budget on mid-range mobile:** simplify (shorter path, fewer elements, one-shot instead of scrub) or remove it on `mq.mobileMotion`; record the decision.
- **Sticky/pinned scene hurts usability or focus order:** switch to the accessible tab-like alternative allowed by spec §5 Scene 4.
- **Copy or imagery changes alter timing:** update the storyboard first, then code.
- **Conflict with art direction or accessibility:** accessibility wins; escalate to the orchestrator with options.

## Spec references
§5 (scenes 0–11, mobile direction), §8.1–8.7, §12.2 (reduced motion for all cinematic scenes), §12.3, §13.6, §15 Phase 2.3 and Phase 4.5, §16.1 E2E 5, §16.3, §17 (six motion beats).
