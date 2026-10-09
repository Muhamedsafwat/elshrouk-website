---
name: alshorouk-gsap-implementation
description: Implement and debug GSAP 3 + ScrollTrigger scenes in the Next.js 16 / React 19 Alshorouk app — useGSAP scope and automatic revert, gsap.matchMedia for breakpoints and reduced motion, ScrollTrigger refresh after fonts, images and layout changes, html.js gating so content is visible without JavaScript, and line/word-only Arabic text reveals; use whenever you write or change animation code.
---

# Skill: Alshorouk GSAP Implementation

Role owners: Frontend Architect + Motion Director (spec §13.6–13.7). Build exactly what `docs/motion-storyboard.md` specifies; motion never decides content visibility.

## Activation
- Writing or editing any client component that imports `gsap`, `ScrollTrigger`, `DrawSVGPlugin` or `useGSAP`.
- Adding `data-reveal` attributes, a scene timeline, a counter, a path draw, a sticky chapter or a menu animation.
- Debugging jank, layout shift, invisible content, duplicate triggers after navigation, or wrong positions after fonts/images load.

## Inputs
- Installed: `gsap@3.15.0` (all plugins in the public package, incl. DrawSVG and SplitText), `@gsap/react@2.1.2`, `next@16.3.5`, `react@19.2.8`.
- `src/lib/motion/gsap.ts` (`'use client'`; registers `ScrollTrigger`, `DrawSVGPlugin`, `useGSAP` once; `ignoreMobileResize: true`) — import GSAP **only** from here.
- `src/lib/motion/tokens.ts` — `motion` durations/eases, `mq.motion | desktopMotion | mobileMotion | reduced`, `motionDisabled()`.
- `src/components/motion/MotionRuntime.tsx` — global controller for `data-reveal="up|lines|image|fade"` via `ScrollTrigger.batch` (`top 90%`, once), refreshes after `document.fonts.ready` and `load`, re-scans on route change. `data-reveal-manual` opts a scene out.
- `src/components/motion/TextReveal.tsx` — authored lines (`.mask-line > span`).
- Gating CSS in `src/styles/globals.css`: hidden start states only under `@media (prefers-reduced-motion: no-preference)` **and** `html.js:not(.motion-off)`; `[data-revealed]` marks completion; `html.motion-off` is the fail-safe.
- `docs/motion-storyboard.md` (the contract), spec §8.

## Procedure
1. **Boundary.** Animation code lives in `'use client'` components that receive all text as props from server components. Never import GSAP in a server component. Check: `rg -l "from ['\"](gsap|@gsap/react)" src` — every hit is a client module (only `src/lib/motion/gsap.ts` may import the packages directly).
2. **Prefer the declarative contract.** Simple entrances use `data-reveal` on server-rendered markup; headlines use `TextReveal` with authored lines. Write a manual timeline only for storyboarded scenes, and mark their root `data-reveal-manual`.
3. **Manual scene skeleton** — scope, automatic revert, matchMedia inside the hook:
   ```tsx
   'use client'
   import { useRef } from 'react'
   import { gsap, useGSAP } from '@/lib/motion/gsap'
   import { motion, mq } from '@/lib/motion/tokens'

   export function JourneyScene(props: JourneySceneProps) {
     const root = useRef<HTMLElement>(null)
     useGSAP(() => {
       const mm = gsap.matchMedia() // created in the useGSAP context → reverted with it
       mm.add({ desktop: mq.desktopMotion, mobile: mq.mobileMotion }, (ctx) => {
         const { desktop } = ctx.conditions as { desktop: boolean; mobile: boolean }
         gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom 60%', scrub: desktop ? 0.6 : true } })
           .fromTo('[data-flow-path]', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none' })
           .fromTo('[data-flow-node]', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: motion.itemStagger }, '<0.1')
       })
       // Reduced motion matches neither query → nothing runs and the CSS final state stays visible.
     }, { scope: root })
     return <section ref={root} data-reveal-manual>{/* server-provided content */}</section>
   }
   ```
   - Selector strings are scoped to `root`; ScrollTriggers, tweens and the matchMedia created in the callback are reverted on unmount.
   - Event-driven animations (hover, click, menu open) are wrapped with `contextSafe` from `useGSAP()` so they are reverted too.
   - If props change what is animated, pass `dependencies` and `revertOnUpdate: true`.
4. **Visibility rules (no-JS, reduced motion, failure).** Server HTML is always the final state. Above-the-fold elements may be pre-hidden only through the `data-reveal` CSS contract (covered by `html.js` and the `motion-off` fail-safe). Below-the-fold manual scenes set start states inside `useGSAP` (before the reader gets there) instead of CSS. When CSS pre-hides an element, animate **to** the visible state with `gsap.to`/`fromTo` — `gsap.from({ opacity: 0 })` would animate to the CSS-hidden value and stay invisible. Finish with `clearProps` for transforms that could break sticky/fixed children, and set `data-revealed` if your scene uses `data-reveal` markup.
5. **Breakpoints.** Desktop-only behaviour (sticky storytelling, parallax ≤ `motion.parallax`, scrubbed paths) under `mq.desktopMotion`; simplified one-shots under `mq.mobileMotion`; never pin on touch/mobile. Note the gap: a ≥ 64rem screen with a coarse pointer (e.g. a 1024×768 tablet) matches neither query and therefore gets the static final state — acceptable, but decide it explicitly per scene and record it in the storyboard. Prefer CSS `position: sticky` + ScrollTrigger `onToggle` for the segment chapters over GSAP `pin` (no pin-spacer jumps, keyboard-friendly).
6. **Refresh correctly.** `MotionRuntime` already refreshes after `document.fonts.ready` and `load`. You must call a debounced `ScrollTrigger.refresh()` when layout changes later: accordion open/close (after the transition), filter results replacing content, late images without reserved size, client navigation into a page whose scene mounts after data loads. A `ResizeObserver` on the scene root that triggers a debounced refresh is the robust default. Create triggers in page order (or set `refreshPriority`); use `invalidateOnRefresh: true` for function-based values.
7. **Arabic text.** Never split Arabic into characters — it destroys contextual letter joining. Use authored lines (`TextReveal`) or, at most, words. If SplitText is ever needed (English only by default): `type: 'lines'` or `'words'`, `mask: 'lines'`, `autoSplit: true` with `onSplit()` returning the tween so it re-splits after font load/resize. Leave vertical room in masks so diacritics and descenders are not clipped.
8. **RTL.** Horizontal travel sign comes from `document.documentElement.dir` (`x: 20 * (rtl ? -1 : 1)`). Paths draw from the inline start: mirror the SVG with `rtl:-scale-x-100`, or animate `drawSVG` from `'100% 100%'` to `'0% 100%'`.
9. **Counters.** Animate a plain object, snap to integers, format with `formatNumber()` (Western digits), start at ~80% of the target, `duration: motion.counter`, `once: true`; qualifier (`حوالي`/`~`) and unit are static text outside the animated span; the animated span is `aria-hidden="true"` and the full `srLabel` is rendered as static text.
10. **Performance hygiene.** Animate only transform, opacity, clip-path (and stroke-dash for small SVGs). No `filter`, `box-shadow`, width/height/top/left tweens. No `repeat: -1` without off-screen pause; pause idle effects on `visibilitychange`. No `markers: true`, Lenis or `normalizeScroll` in committed code. GSAP and any other animation library never animate the same property on the same node; remove CSS `transition` from properties GSAP animates.
11. **Tests and evidence.**
    - Vitest: `renderToString(<Scene …/>)` contains every text string and no inline `opacity:0`/`transform` styles.
    - Playwright: `page.emulateMedia({ reducedMotion: 'reduce' })` → every `[data-reveal]` visible with computed opacity 1; `browser.newContext({ javaScriptEnabled: false })` → headline, metrics and CTAs visible; navigate home → about → home and confirm the ScrollTrigger count does not grow (request a dev-only counter hook in `src/lib/motion/gsap.ts` from the orchestrator); zero console errors; layout-shift sum < 0.1 while scrolling (`PerformanceObserver` type `layout-shift`).
    - Deterministic frames with `page.clock.install()` + `page.clock.runFor()`; videos via `recordVideo` → `screenshots/motion/`.

## Checklists
- [ ] Imports from `@/lib/motion/gsap` only; file is `'use client'`.
- [ ] `useGSAP` with `scope`; matchMedia created inside; event handlers via `contextSafe`.
- [ ] Final state = SSR state; reduced motion and JS-disabled show everything.
- [ ] No character splitting of Arabic; masks do not clip marks.
- [ ] Refresh after any post-mount layout change; no duplicate triggers after navigation.
- [ ] Compositor-friendly properties only; no infinite loops; no markers.
- [ ] Storyboard timings and tokens respected; deviations documented in the storyboard.

## Deliverables
- Scene components and hooks in the files your task owns; requests for changes to `src/lib/motion/*`, `src/components/motion/*` or `globals.css` sent to the orchestrator.
- Unit + e2e tests listed in step 11; frames and videos under `screenshots/motion/`.
- Storyboard updated with the evidence paths.

## Acceptance criteria
- Working, smooth scenes matching the storyboard at 1440 and 390 in Chromium, with no console errors or hydration warnings.
- Content visible without JS, under reduced motion and when the runtime fails (fail-safe).
- No layout shift from motion (CLS contribution ≈ 0), no leaked ScrollTriggers, no focusable element left hidden.

## Failure recovery & escalation
- **Content stuck invisible:** check `html.js`/`motion-off`, whether the element still lacks `data-revealed`, and whether `gsap.from` was used on a CSS-hidden element.
- **Positions wrong after load:** missing refresh (fonts, images, accordion) or triggers created out of order.
- **Jumps/gaps with pinning:** replace `pin` with CSS sticky; never pin on mobile.
- **Jank under 4× CPU throttle:** reduce element count, switch scrub to one-shot, drop the beat on `mq.mobileMotion`; record the change in the storyboard.
- **Need a new plugin or global change:** report to the orchestrator; do not add dependencies yourself.

## Spec references
§5 (hero timeline, Scenes 2, 4, 6, 11), §7.1 (Arabic line-height in reveals), §7.2 (animation wrappers must not hide content), §8.2–8.6, §12.2, §12.3, §13.7, §16.1 (E2E 5), §16.3 (sticky release, refresh jumps); AGENTS.md "Motion".
