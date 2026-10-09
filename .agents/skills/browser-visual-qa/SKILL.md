---
name: alshorouk-browser-visual-qa
description: Run the separate, evidence-producing browser QA pass for Alshorouk — the nine-viewport screenshot matrix in Arabic and English, automated overflow, console, image, link and placeholder checks, the spec §16.3 visual regression checklist, motion and reduced-motion evidence, a P0–P3 defect log and at least two polish rounds — use after any implementation slice, before every gate from Gate 4 onwards, and whenever someone claims a page is done.
---

# Skill: Alshorouk Browser & Visual QA

Role owner: QA / Browser Testing Agent (spec §13.11). QA is a **separate pass after implementation** (spec §13.13-6): the agent that built a slice does not verify it alone, and a screenshot only counts as evidence after someone has opened and inspected it.

## Activation
- After each vertical slice; before Gates 4, 5, 6, 7 and 8; after visual polish rounds.
- Any "done" claim, any layout/motion bug report, any dependency or token change with visual impact.

## Inputs
- Running app: the shared dev server `http://localhost:3000` (do not start another `next dev`); a production build on another port only when the task authorises `pnpm build` (`pnpm start` is pinned to :3000 — use `pnpm exec next start --port 3100`, coordinated with the orchestrator).
- Playwright 1.64 with the cached Chromium; Chrome and Edge channels also available. WebKit and Firefox are **not installed** — Safari/iOS behaviour is untested unless a human checks a real device.
- `pnpm screenshots` (= `playwright test --project=screenshots`), `pnpm test:e2e`, `docs/motion-storyboard.md`, `docs/art-direction.md`, the colour-ratio script in the visual-art-direction skill, `docs/test-report.md`.

## Procedure
1. **Viewport matrix (spec §16.2 — all nine, mandatory):**

   | # | Size | Context |
   |---|---|---|
   | 1 | 320×720 | mobile, `isMobile`, `hasTouch`, DPR 2 |
   | 2 | 360×800 | mobile, touch, DPR 2 |
   | 3 | 390×844 | mobile, touch, DPR 3 |
   | 4 | 430×932 | mobile, touch, DPR 3 |
   | 5 | 768×1024 | tablet portrait, touch, DPR 2 |
   | 6 | 1024×768 | tablet landscape, touch, DPR 2 |
   | 7 | 1280×800 | laptop, DPR 1 |
   | 8 | 1440×900 | desktop, DPR 1 |
   | 9 | 1920×1080 | large desktop, DPR 1 |

2. **Required captures, Arabic and English:** home at top, middle and footer for all nine sizes; full-page home at 390 and 1440; catalogue, product detail (or its empty/404 state while no product is approved), contact, mobile menu open, and 404 at 390 and 1440. Name files `screenshots/<YYYY-MM-DD>/<locale>/<page>/<w>x<h>-<position>.png` (e.g. `screenshots/2026-10-12/ar/home/390x844-top.png`).
3. **Stabilise before each capture.** `goto(url, { waitUntil: 'networkidle' })`; `await page.evaluate(() => document.fonts.ready)`; scroll the whole page in viewport steps (triggers reveals and lazy images), then return to the position; decode images (`Promise.all([...document.images].map((i) => i.decode().catch(() => {})))`); `page.screenshot({ animations: 'disabled', caret: 'hide' })`. Capture static-state shots with `reducedMotion: 'reduce'` as a second set, and motion evidence separately (step 6).
4. **Automated checks on every page × viewport × locale** (fail the run on any hit):
   - Horizontal overflow: `document.documentElement.scrollWidth > innerWidth + 1`; list offenders whose `getBoundingClientRect()` exceeds the viewport.
   - Console: zero `console.error`, `pageerror`, hydration warnings (`/hydrat|did not match/i`).
   - Network: no failed same-origin requests, no responses ≥ 400 except deliberate 404 pages; no broken images (`complete && naturalWidth === 0`).
   - Links: request every internal `a[href^="/"]` once per run → status < 400 (404 page links excepted).
   - Placeholders: `document.body.innerText` must not match `/\{\w+\}|\bTODO\b|\b[Ll]orem\b|\bundefined\b|\bNaN\b|\[object Object\]|\bPLACEHOLDER\b/` (case-sensitive, so English words such as "maintenance" do not trip it).
   - Structure: exactly one `h1`; `html[lang][dir]` correct; no Arabic-Indic digits in rendered text (`/[٠-٩۰-۹]/`, i.e. U+0660–0669 and U+06F0–06F9).
   - Touch: on mobile contexts, interactive controls ≥ 44×44 px (inline text links reported as warnings).
   - Overlays: focus each form field and assert `document.elementFromPoint` at its centre is the field (sticky CTA/header must not cover it).
5. **Inspect the images yourself.** Open every captured screenshot (image viewer / Read tool) and note what you see per page; run the colour-ratio script on full-page shots at 390 and 1440. Then walk the visual regression checklist below.
6. **Motion evidence.** For each signature moment: `recordVideo` at 1440×900 and 390×844 (`screenshots/motion/<moment>-<width>.webm`) and deterministic frames with `page.clock.install()` + `runFor()` (0 / mid / end). Confirm the behaviour matches the storyboard, sticky scenes release at the right scroll position, no pin gaps or jumps on reload.
7. **Special conditions:** `reducedMotion: 'reduce'` (all content visible, no pinning/parallax/count-up); `javaScriptEnabled: false` (content and nav links usable; forms submit or explain); slow network + CPU via CDP (`Network.emulateNetworkConditions` latency 150 ms, ~1.6 Mbps down, ~750 kbps up; `Emulation.setCPUThrottlingRate({ rate: 4 })`); empty catalogue (isolated fixture DB with zero public products); form validation errors and a forced server failure; locale switch round trip; direct reload of every route.
8. **Log defects** in `docs/test-report.md` using spec §16.5: route · viewport · steps · expected vs actual · severity · screenshot/video · owner · patch reference · verification status. Severity: **P0** blocks a core journey, loses data, fakes success, breaks the logo/metrics or shows non-poultry content; **P1** major function broken on a key viewport or locale (form unusable at 320, menu trap, CTA unreachable); **P2** visible visual defect (overlap, bad crop, misalignment, wrong wrap); **P3** polish.
9. **Iterate.** Re-capture the same frames after fixes and keep before/after pairs. When the first review finds issues, run **at least two polish rounds** (Gate 7) and record each round (date, fixes, evidence) in `docs/test-report.md`.

## Checklists
**Visual regression (spec §16.3) — per page, per viewport**
- [ ] Hero subject not cropped incorrectly; headline does not overlap; CTA visible without excessive scrolling.
- [ ] Arabic joins and line breaks correct; no text outside the viewport; no awkward justified short lines.
- [ ] Logo keeps its source shape, clear space and contrast; the header uses the proper variant.
- [ ] Colour balance credible (white ≈ 55%, black ≈ 25%, vermilion ≈ 15%, amber ≤ 5%); no template gradients.
- [ ] Each section has intentional rhythm; mobile has no ghost columns, cropped buttons or fixed elements covering form fields.
- [ ] Sticky animations release at the correct scroll position; no pin gaps or jumping on refresh.
- [ ] Footer, legal links, navigation and forms function; all images have a proper aspect ratio and recorded licence/provenance.
- [ ] Reduced-motion and low-network experiences still feel designed.
- [ ] No `console.error`, hydration mismatch, broken image, dead link or unresolved placeholder.

**Run completeness**
- [ ] All nine viewports × both locales for home; the 390/1440 set for the other required pages.
- [ ] Every screenshot opened and commented; ratio script output attached.
- [ ] Motion videos/frames for all six moments; reduced-motion and no-JS sets captured.
- [ ] Defects logged with severity and owner; re-test status updated.

## Deliverables
- Screenshot and video evidence under `screenshots/` (paths listed in the report).
- `docs/test-report.md`: run metadata (date, commit if provided, browser/version, server URL, build type), matrix coverage table, automated check results, defect log, polish-round log, open risks (e.g. Safari untested).
- Playwright specs for the automated checks (in files your task owns).

## Acceptance criteria
- Full matrix captured and inspected for the pages in scope, Arabic and English.
- No open P0/P1, no major P2; zero overflow, console errors, broken images, dead links or placeholders (Gate 7).
- Every signature animation has proof; reduced-motion and slow-network runs documented.
- Results come from real execution output — no inferred or fabricated passes (spec §16.5).

## Failure recovery & escalation
- **Dev server down or busy:** ask the orchestrator; never start a second `next dev` or kill a process you did not start.
- **Flaky capture (motion mid-frame):** add stabilisation (fonts, decode, `animations: 'disabled'`, reduced-motion set) rather than retrying until it passes.
- **Defect in a shared component or token:** log it with owner "orchestrator" and the exact selector/fix suggestion.
- **Cannot reproduce on a real device / Safari:** say so in the report; do not extrapolate from Chromium.

## Spec references
§0.2 (widths, browser testing), §5 (mobile direction), §8.4–8.6, §13.11, §13.13-6, §15 Phase 4.6 and Phase 7, §16.1 (E2E), §16.2, §16.3, §16.5, §17 (reject list), §21 Q5–Q8.
