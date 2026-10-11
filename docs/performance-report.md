# Performance report (spec §12.3)

Measured on 2026-10-11, twice: a **baseline** on the QA build and a **final** measurement on the final build after all fixes. All figures are measured, none estimated. Lab numbers from one local machine are a baseline for catching regressions, not field data.

## Setup and caveats

- **Build under test:** production build (`pnpm start:e2e`, `.next-e2e`) on `http://localhost:3200` with the fixture DB `data/e2e.db` (`DEMO_FIXTURES=true`: 3 approved `[TEST]` products, a demo ribbon, no articles).
- **Tooling:**
  - Lighthouse 12.8.2: `npx -y lighthouse@12 <url> --quiet --output=json --chrome-flags="--headless=new" [--preset=desktop]`;
  - Chrome 155 (headless), Node 22.14.0, Windows 11 Pro;
  - AMD Ryzen 7 5700G (8 cores / 16 threads), 31.4 GB RAM;
  - Lighthouse benchmarkIndex: 1500–1946 in the baseline, 1837–1878 in the final runs.
- **Profiles:**
  - *Mobile* is the Lighthouse default: simulated 4× CPU, 150 ms RTT, ~1.6 Mbps, a Moto G-class 412×823 viewport.
  - *Desktop* is `--preset=desktop`: simulated 40 ms RTT, ~10 Mbps, no CPU slowdown.
- **Runs:** 3 valid runs per page and preset; tables show the median, with the range in brackets.
  - Baseline: the representative run of each is in `docs/evidence/lighthouse/<page>-<preset>.json` and every run in `docs/evidence/lighthouse/summary.json`. 13 attempts there ended with Lighthouse's `NO_NAVSTART` trace error and were re-run.
  - Final: the representative runs are in `docs/evidence/lighthouse/after-fixes/`, with all runs in its `summary.json`. 1 attempt hit `NO_NAVSTART` and was re-run.
- **Local-machine caveats:** server and browser share one machine, and localhost has no real network or CDN, so measured TTFB is unrealistically low and Lighthouse models the network on top of it.
- **SEO = 69 everywhere is expected.** The build is not a production deployment, so it serves `noindex` and `robots.txt: Disallow: /`; the only failing SEO audit is `is-crawlable`.
- **Fixture artefact:** on the catalogue's mobile run, the largest element is the demo ribbon («بيئة تجريبية…»), which production does not have. Production's LCP element there will be a heading or an image instead.

## Final results (final build)

| Page | Preset | Perf | A11y | BP | SEO | FCP | **LCP** | CLS | TBT | JS transfer | LCP element |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `/ar` | mobile | 75 [74–79] | 100 | 100 | 69 | 1.42 s | **4.10 s** [4.10–4.10] | 0 | 445 ms [310–480] | 228 KB / 12 | hero photo |
| `/ar` | desktop | 99 | 100 | 100 | 69 | 0.32 s | 0.82 s [0.81–0.91] | 0 | 46 ms | 346 KB / 17 | hero photo |
| `/ar/products` | mobile | 88 [85–90] | 100 | 100 | 69 | 1.09 s | **3.14 s** [2.87–3.50] | 0 | 275 ms [267–290] | 347 KB / 16 | demo ribbon (fixture only) |
| `/ar/products` | desktop | 100 | 100 | 100 | 69 | 0.31 s | 0.73 s [0.72–0.77] | 0 | 3 ms | 356 KB / 18 | header logo |
| `/ar/solutions/broilers` | mobile | 81 [81–82] | 100 | 100 | 69 | 1.07 s | **4.36 s** [4.36–4.37] | 0 | 211 ms [206–212] | 340 KB / 15 | segment hero photo |
| `/ar/solutions/broilers` | desktop | 99 | 100 | 100 | 69 | 0.30 s | 0.96 s | 0 | 0 ms | 361 KB / 19 | segment hero photo |
| `/ar/contact` | mobile | 87 [87–88] | 100 | 100 | 69 | 1.09 s | **2.71 s** [2.70–3.30] | 0 | 340 ms [261–387] | 327 KB / 14 | intro paragraph |
| `/ar/contact` | desktop | 100 | 100 | 100 | 69 | 0.31 s | 0.76 s [0.74–0.79] | 0 | 2 ms | 348 KB / 18 | h1 line |
| `/en` | mobile | 77 [75–82] | 100 | 100 | 69 | 1.08 s | **3.87 s** [3.73–3.97] | 0 | 454 ms [317–492] | 228 KB / 12 | hero photo |
| `/en` | desktop | 99 | 100 | 100 | 69 | 0.35 s | 0.86 s [0.85–0.86] | 0 | 58 ms | 346 KB / 17 | hero photo |

Budgets in spec §12.3 are LCP < 2.5 s and CLS < 0.1.

- **CLS is 0 on every run.**
- **Desktop LCP is 0.73–0.96 s.**
- **Mobile LCP is still above 2.5 s on all five pages (2.71–4.36 s).** The closest is the contact page at 2.71 s.

## Change against the baseline

| Page | Mobile LCP | Mobile Perf | Mobile TBT | A11y (mobile) | Best practices | Desktop LCP |
|---|---|---|---|---|---|---|
| `/ar` | 3.89 → 4.10 s | 77 → 75 | 434 → 445 ms | 100 → 100 | 100 → 100 | 0.87 → 0.82 s |
| `/ar/products` | 3.47 → **3.14 s** | 84 → **88** | 336 → **275 ms** | 98 → **100** | 96 → **100** | 0.86 → 0.73 s |
| `/ar/solutions/broilers` | 4.31 → 4.36 s | 82 → 81 | 212 → 211 ms | 100 → 100 | 96 → **100** | 0.94 → 0.96 s |
| `/ar/contact` | 3.19 → **2.71 s** | 86 → **87** | 314 → 340 ms | 100 → 100 | 96 → **100** | 0.70 → 0.76 s |
| `/en` | 3.66 → 3.87 s | 77 → 77 | 495 → 454 ms | 100 → 100 | 100 → 100 | 0.91 → 0.86 s |

What changed:

- **Best practices 96 → 100** (BP-1): zod no longer makes the `Function("")` JIT probe that the CSP blocked, so no DevTools issue is logged.
- **Accessibility 98 → 100 on the catalogue** (A11Y-6): a visually hidden results heading fixes the heading order.
- **Contact 3.19 → 2.71 s, catalogue 3.47 → 3.14 s.** Content that is already on screen at load is never hidden any more. The reveal states switch on after hydration, only for content below the fold (FR-4).
  - An intermediate version of that fix hid first-screen reveals until hydration and measured **3.90 s** on contact (`summary.json` of that run is not kept in the repo). The final design is the one measured above.
- **Hero image priority** (PERF-1): the hero image is now requested at High priority and the logo no longer competes. The image itself loads within about 80 ms of the HTML on localhost (observed timings).
- **Home, `/en` and broilers moved by 0.05–0.21 s, within run-to-run noise.** The image-priority fix did not lower the simulated LCP there, because the time is spent elsewhere (next section).

## Why mobile LCP is still over budget

- **The time is main-thread work before the frame that paints the LCP element, not network loading.**
  - In the baseline, the DevTools-throttled cross-check had FCP equal to LCP on every run.
  - The 5.6 s of main-thread work on `/ar` under 4× CPU broke down as: style & layout 1.7 s, script evaluation 1.3 s, rendering 0.6 s and other 1.9 s.
  - On the final build the observed (unthrottled) LCP breakdown shows the image loaded in under 100 ms, but Lighthouse's 4× CPU simulation still places LCP at 2.7–4.4 s.
- **Total blocking time is 211–454 ms on mobile.** The likely sources are the client JavaScript (228–347 KB transferred) and the hydration of the full layout (header, menus, footer, motion runtime). This has not been profiled function by function yet.
- **Measured: the slowest pages are those whose LCP element is a large hero photo** (home, `/en`, broilers: 3.9–4.4 s). The photo is painted inside the hero's CSS intro (mask and zoom layers). Why that frame lands so late in the simulation is not yet isolated; the main-thread work above is the leading suspect.

## Perpetual animation at idle (unchanged)

Measured on `/ar` after 6 s idle in the baseline (`docs/evidence/lighthouse/idle-animations.json`): no CSS or Web Animation is running, but GSAP ScrollTrigger's keep-alive calls `requestAnimationFrame` about 64 times per second on every page, also under reduced motion (PERF-3, open). The code that registers ScrollTrigger has not changed, so this still applies; it was not re-measured.

## Recommendations, with status

| # | Recommendation | Status |
|---|---|---|
| 1 | Give the hero/LCP image `fetchPriority="high"` and remove it from the logo | **Done** (PERF-1) |
| 2 | Do not hide first-screen content behind reveal states | **Done** (FR-4): contact −0.48 s, catalogue −0.33 s |
| 3 | Cut main-thread work before the LCP frame on mobile: register GSAP / ScrollTrigger only on pages with scroll scenes, and lazily (also fixes PERF-3); defer the motion runtime and other non-critical client components until after first paint; shrink the inline RSC payload (avoid passing large dictionaries or prop trees to client components) | Open: the largest remaining lever |
| 4 | Keep zod out of the client form bundle (`zod/mini` or server-only validation) | Partly done: the JIT probe is disabled (BP-1); the bundle split is open (PERF-2) |
| 5 | Re-measure after each change with the same commands (3 runs, median) | Done for this release; re-run before launch on the real host, where TTFB and CDN caching will differ |
