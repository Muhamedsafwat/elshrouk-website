import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { VIEWPORTS } from '../../playwright.config'

/**
 * Visual evidence — spec §16.2 (viewport matrix) + §16.3 (visual regression checklist).
 *
 *   E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test --project=screenshots
 *
 * Output: screenshots/<locale>/<route-slug>/<viewport>.png (12 routes × 9 viewports), plus
 *   <route>/390-full.png, <route>/1440-full.png   every route, page walked first so reveals complete
 *   home/<vp>-middle.png, home/<vp>-footer.png     sticky compact bar in view (390 + 1440, ar + en)
 *   home/scroll-<vp>/NN.png                        film strip: viewport every 0.75 screen (scrubbed scenes)
 *   mobile-menu/390.png, nav-dropdown/1440.png, ar/contact/<vp>-form.png
 * Contact sheets + colour balance: `python scripts/visual-qa-sheets.py`; findings: docs/evidence/visual-qa.md.
 *
 * Every capture also records objective checks in a `visual-metrics` annotation (read it with the JSON
 * reporter): horizontal overflow, broken images, console errors (these three are soft assertions, so a
 * visual run doubles as a regression check without losing any screenshot), plus review hints that are not
 * asserted — text/controls outside the viewport and headings whose last line is a single word.
 * Also asserted: the sticky bar shows mid-page and releases at the top, the first contact field is not
 * covered by fixed elements, and no display line's reveal mask cuts Arabic dots/diacritics.
 */

test.describe.configure({ mode: 'parallel' })

type Route = { path: string; expectStatus?: number }

const ROUTES: Route[] = [
  { path: '/ar' },
  { path: '/ar/about' },
  { path: '/ar/solutions/broilers' },
  { path: '/ar/products' },
  { path: '/ar/products/fixture-feed-alpha' },
  { path: '/ar/contact' },
  { path: '/ar/partner-with-us' },
  { path: '/ar/how-we-work' },
  { path: '/ar/knowledge' },
  { path: '/ar/privacy' },
  { path: '/ar/missing-page', expectStatus: 404 },
  { path: '/en' },
]

/** Time for intro timelines (hero lines, curves, counters) to finish after fonts are ready. */
const SETTLE_MS = 2200

type Viewport = (typeof VIEWPORTS)[number]
const byName = (name: string): Viewport => VIEWPORTS.find((v) => v.name === name) as Viewport

/** Phones get a touch-capable mobile context (spec §16.2); tablets and desktops a desktop one. */
const contextFor = (vp: Viewport) => {
  const touch = vp.width < 768
  return { viewport: { width: vp.width, height: vp.height }, isMobile: touch, hasTouch: touch, deviceScaleFactor: 1 }
}

function routeParts(routePath: string) {
  const [, locale = 'ar', ...rest] = routePath.split('/')
  return { locale, slug: rest.length ? rest.join('-') : 'home' }
}

function outFile(testInfo: TestInfo, locale: string, slug: string, name: string) {
  const dir = path.resolve(testInfo.project.testDir, '..', '..', 'screenshots', locale, slug)
  mkdirSync(dir, { recursive: true })
  return path.join(dir, `${name}.png`)
}

function watchConsole(page: Page, expect404 = false) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    // The designed 404 page is served with status 404 — Chromium logs that document response as an error.
    if (expect404 && /status of 404/.test(m.text())) return
    errors.push(m.text())
  })
  return errors
}

async function settle(page: Page, ms = SETTLE_MS) {
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined)
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  await page.waitForTimeout(ms)
}

/** Walk the whole page so scroll-triggered reveals and lazy images run (page height may grow). */
async function scrollThrough(page: Page, step: number) {
  for (let y = 0; ; y += step) {
    const total = await page.evaluate(() => document.documentElement.scrollHeight)
    if (y >= total) break
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(180)
  }
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => undefined)
  await page.waitForTimeout(800)
}

async function scrollToFraction(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: Math.round(max * f), behavior: 'instant' })
  }, fraction)
  await page.waitForTimeout(1400)
}

type Metrics = { overflowX: number; brokenImages: string[]; offViewport: string[]; orphans: string[] }

async function collectMetrics(page: Page): Promise<Metrics> {
  return page.evaluate(() => {
    const root = document.documentElement
    const vw = root.clientWidth
    const describe = (el: Element) => {
      const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60)
      return `${el.tagName.toLowerCase()}${text ? ` "${text}"` : ''}`
    }
    const hiddenScope = '[inert], [aria-hidden="true"], [hidden], dialog:not([open]), .sr-only'

    const brokenImages = Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0 && !!img.getAttribute('src'))
      .map((img) => img.currentSrc || img.src)

    // Text and controls that extend past the left/right edge of the viewport.
    const offViewport: string[] = []
    for (const el of Array.from(document.querySelectorAll('a, button, input, select, textarea, label, h1, h2, h3, p, img'))) {
      const r = el.getBoundingClientRect()
      if (r.width <= 2 || r.height <= 2) continue
      if (r.left >= -1 && r.right <= vw + 1) continue
      if (el.closest(hiddenScope)) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue
      let clip: Element | null = null
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== 'visible') {
          clip = p
          break
        }
      }
      const clipNote = clip ? ` clipped-by <${clip.tagName.toLowerCase()} class="${String(clip.className).slice(0, 60)}">` : ''
      offViewport.push(`${describe(el)} [x ${Math.round(r.left)}..${Math.round(r.right)} / ${vw}]${clipNote}`)
      if (offViewport.length >= 12) break
    }

    // Display text whose last rendered line is one word (an "orphan"), per line box container.
    const orphans: string[] = []
    const SEL = 'h1, h2, h3, [class*="text-display"], .text-lead, .text-title'
    for (const el of Array.from(document.querySelectorAll<HTMLElement>(SEL))) {
      if (el.parentElement?.closest(SEL)) continue
      if (el.closest(hiddenScope)) continue
      const groups = new Map<Element, { word: string; top: number; height: number }[]>()
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.nodeValue ?? ''
        const parent = node.parentElement
        if (!text.trim() || !parent || parent.closest('.sr-only, [aria-hidden="true"]')) continue
        let box: Element = parent
        while (box !== el && getComputedStyle(box).display === 'inline') box = box.parentElement ?? el
        for (const m of text.matchAll(/\S+/g)) {
          const start = m.index ?? 0
          const range = document.createRange()
          range.setStart(node, start)
          range.setEnd(node, start + m[0].length)
          const rect = range.getClientRects()[0]
          if (!rect || rect.width === 0) continue
          const list = groups.get(box) ?? []
          list.push({ word: m[0], top: rect.top, height: rect.height })
          groups.set(box, list)
        }
      }
      for (const [box, words] of groups) {
        if (box.getBoundingClientRect().width < 40) continue
        const lines: { top: number; words: string[] }[] = []
        for (const w of words) {
          const line = lines.find((l) => Math.abs(l.top - w.top) < Math.max(4, w.height * 0.5))
          if (line) line.words.push(w.word)
          else lines.push({ top: w.top, words: [w.word] })
        }
        lines.sort((a, b) => a.top - b.top)
        const last = lines[lines.length - 1]
        const lastWord = last?.words[0] ?? ''
        if (lines.length >= 2 && last?.words.length === 1 && /[\p{L}\p{N}]/u.test(lastWord)) {
          const text = (box.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 70)
          orphans.push(`${el.tagName.toLowerCase()} "${text}" → last line "${lastWord}" (${lines.length} lines)`)
        }
      }
    }

    return { overflowX: root.scrollWidth - vw, brokenImages, offViewport, orphans }
  })
}

function record(testInfo: TestInfo, file: string, metrics: Metrics, consoleErrors: string[], extra: object = {}) {
  const shot = path.relative(path.resolve(testInfo.project.testDir, '..', '..'), file).replace(/\\/g, '/')
  testInfo.annotations.push({
    type: 'visual-metrics',
    description: JSON.stringify({ shot, ...metrics, consoleErrors, ...extra }),
  })
  expect.soft(metrics.overflowX, `${shot}: horizontal overflow (px)`).toBeLessThanOrEqual(0)
  expect.soft(metrics.brokenImages, `${shot}: broken images`).toEqual([])
  expect.soft(consoleErrors, `${shot}: console errors`).toEqual([])
}

/* ------------------------------------------------------------------ viewport matrix (§16.2) */

for (const vp of VIEWPORTS) {
  test.describe(`viewport ${vp.width}x${vp.height}`, () => {
    test.use(contextFor(vp))

    for (const route of ROUTES) {
      const { locale, slug } = routeParts(route.path)
      test(`${route.path} @ ${vp.name}`, async ({ page }, testInfo) => {
        const errors = watchConsole(page, route.expectStatus === 404)
        const res = await page.goto(route.path)
        expect.soft(res?.status(), `${route.path} status`).toBe(route.expectStatus ?? 200)
        await settle(page)
        const file = outFile(testInfo, locale, slug, vp.name)
        await page.screenshot({ path: file })
        record(testInfo, file, await collectMetrics(page), errors)
      })
    }
  })
}

/* ------------------- full pages at 390 / 1440 (home also: middle + footer shots and the sticky-bar check) */

/** The slim bar that slides in once the masthead leaves the viewport (Header.tsx). */
const stickyBar = (page: Page) => page.locator('div.fixed.inset-x-0.top-0').first()

for (const vp of [byName('390'), byName('1440')]) {
  test.describe(`full page ${vp.name}`, () => {
    test.use(contextFor(vp))

    for (const route of ROUTES) {
      const { locale, slug } = routeParts(route.path)
      const isHome = slug === 'home'
      test(`${route.path} full page${isHome ? ', middle and footer' : ''} @ ${vp.name}`, async ({ page }, testInfo) => {
        test.setTimeout(150_000)
        const errors = watchConsole(page, route.expectStatus === 404)
        await page.goto(route.path)
        await settle(page, 1200)
        await scrollThrough(page, Math.round(vp.height * 0.6))

        if (isHome) {
          // The compact sticky bar is visible in these two (masthead scrolled away).
          await scrollToFraction(page, 0.5)
          await page.screenshot({ path: outFile(testInfo, locale, slug, `${vp.name}-middle`) })
          await expect.soft(stickyBar(page), 'sticky bar shown mid-page').toHaveAttribute('aria-hidden', 'false')
          await scrollToFraction(page, 1)
          await page.screenshot({ path: outFile(testInfo, locale, slug, `${vp.name}-footer`) })
        }

        await scrollToFraction(page, 0)
        // Back at the top the masthead is in view again, so the compact bar must have released.
        await expect.soft(stickyBar(page), 'sticky bar released at top').toHaveAttribute('aria-hidden', 'true')
        const file = outFile(testInfo, locale, slug, `${vp.name}-full`)
        await page.screenshot({ path: file, fullPage: true })
        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
        record(testInfo, file, await collectMetrics(page), errors, { pageHeight })
      })
    }
  })
}

/* Scroll-scrubbed scenes render their scroll-linked state, so a full-page capture taken at the top cannot
   show them. This film strip captures the viewport at successive scroll positions instead (§16.3: sticky
   media and scrubbed scenes release correctly, no gaps or jumps). */
for (const [routePath, vpName] of [
  ['/ar', '1440'],
  ['/en', '1440'],
  ['/ar', '390'],
] as const) {
  const vp = byName(vpName)
  test.describe(`home scroll film strip ${routePath} ${vp.name}`, () => {
    test.use(contextFor(vp))

    test(`${routePath} scroll film strip @ ${vp.name}`, async ({ page }, testInfo) => {
      test.setTimeout(240_000)
      const errors = watchConsole(page)
      const { locale } = routeParts(routePath)
      await page.goto(routePath)
      await settle(page, 1200)
      const step = Math.round(vp.height * 0.75)
      let last = ''
      for (let frame = 1, y = 0; ; frame += 1, y += step) {
        const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
        const top = Math.min(y, max)
        await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), top)
        // Scrub smoothing is ≤ 0.8 s, but section headings only finish their line reveal ~2 s after an
        // instant jump (see docs/evidence/visual-qa.md), so wait for the settled state.
        await page.waitForTimeout(2200)
        last = outFile(testInfo, locale, `home/scroll-${vp.name}`, String(frame).padStart(2, '0'))
        await page.screenshot({ path: last })
        if (top >= max) break
      }
      record(testInfo, last, await collectMetrics(page), errors)
    })
  })
}

/* ------------------------------------------------------------ navigation overlays (§16.2) */

test.describe('mobile menu open @ 390', () => {
  test.use(contextFor(byName('390')))

  for (const [routePath, openLabel] of [
    ['/ar', 'فتح القائمة'],
    ['/en', 'Open menu'],
  ] as const) {
    test(`${routePath} mobile menu`, async ({ page }, testInfo) => {
      const errors = watchConsole(page)
      await page.goto(routePath)
      await settle(page, 800)
      await page.getByRole('button', { name: openLabel }).first().click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.waitForTimeout(2200) // clip-path wipe + staggered link lines
      const file = outFile(testInfo, routeParts(routePath).locale, 'mobile-menu', '390')
      await page.screenshot({ path: file })
      record(testInfo, file, await collectMetrics(page), errors)
    })
  }
})

test.describe('desktop solutions dropdown open @ 1440', () => {
  test.use(contextFor(byName('1440')))

  for (const [routePath, label] of [
    ['/ar', 'حلول الدواجن'],
    ['/en', 'Solutions'],
  ] as const) {
    test(`${routePath} solutions dropdown`, async ({ page }, testInfo) => {
      const errors = watchConsole(page)
      await page.goto(routePath)
      await settle(page, 1500)
      const trigger = page.locator('header').getByRole('button', { name: label })
      await trigger.hover() // a fine pointer opens the panel on hover
      if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click()
      await expect(trigger).toHaveAttribute('aria-expanded', 'true')
      await page.waitForTimeout(700)
      const file = outFile(testInfo, routeParts(routePath).locale, 'nav-dropdown', '1440')
      await page.screenshot({ path: file })
      record(testInfo, file, await collectMetrics(page), errors)
    })
  }
})

/* ------------------------------- contact form in view: fixed elements must not cover fields (§16.3) */

for (const vp of [byName('390'), byName('1440')]) {
  test.describe(`contact form in view ${vp.name}`, () => {
    test.use(contextFor(vp))

    test(`/ar/contact form fields clear of fixed bars @ ${vp.name}`, async ({ page }, testInfo) => {
      const errors = watchConsole(page)
      await page.goto('/ar/contact')
      await settle(page, 1200)
      await scrollThrough(page, Math.round(vp.height * 0.6))
      // First real text-entry control (skips the aria-hidden honeypot and visually hidden choice-card radios).
      const field = page
        .locator('main form')
        .first()
        .locator(
          ':is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]):not([tabindex="-1"]), textarea, select):visible',
        )
        .first()
      // Same alignment a fragment link / skip link uses (respects scroll-padding-top).
      await field.evaluate((el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.waitForTimeout(1200)
      const coveredBy = await field.evaluate((el) => {
        const r = el.getBoundingClientRect()
        const hits = [
          [r.left + r.width / 2, r.top + 2],
          [r.left + 4, r.top + r.height / 2],
          [r.right - 4, r.top + r.height / 2],
        ]
        return hits
          .map(([x, y]) => document.elementFromPoint(x ?? 0, y ?? 0))
          .filter((hit): hit is Element => !!hit && hit !== el && !el.contains(hit) && !hit.contains(el))
          .filter((hit) => !hit.closest('label'))
          .map((hit) => `${hit.tagName.toLowerCase()}.${String(hit.className).split(' ').slice(0, 4).join('.')}`)
      })
      const file = outFile(testInfo, 'ar', 'contact', `${vp.name}-form`)
      await page.screenshot({ path: file })
      record(testInfo, file, await collectMetrics(page), errors, { firstFieldCoveredBy: coveredBy })
      expect.soft(coveredBy, 'first form field is covered by another element').toEqual([])
    })
  })
}

/* --------------- Arabic glyph integrity: the line-reveal mask must not cut dots or diacritics (§16.3) */

/**
 * Every `.mask-line` (TextReveal / SectionHeading lines) is captured twice — as rendered, then with the mask's
 * overflow made visible. Any pixel difference means glyph ink (dots under ي, tanween, hamza…) is being cut,
 * e.g. «في» rendering as «فى». Reduced motion puts every reveal in its final state and stops scroll-linked
 * motion, so the two captures differ only by what the mask clips. See docs/evidence/visual-qa.md (VQA-01).
 */
/** Pixels whose colour differs by more than `threshold` (any channel) between two same-size PNG captures. */
async function inkDiff(page: Page, a: Buffer, b: Buffer, threshold = 40): Promise<number> {
  return page.evaluate(
    async ([a64, b64, limit]) => {
      const pixels = async (encoded: string) => {
        const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0))
        const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }))
        const ctx = new OffscreenCanvas(bitmap.width, bitmap.height).getContext('2d')
        if (!ctx) return new Uint8ClampedArray()
        ctx.drawImage(bitmap, 0, 0)
        return ctx.getImageData(0, 0, bitmap.width, bitmap.height).data
      }
      const [pa, pb] = await Promise.all([pixels(a64), pixels(b64)])
      let count = 0
      for (let i = 0; i < pa.length; i += 4) {
        const delta = Math.max(
          Math.abs((pa[i] ?? 0) - (pb[i] ?? 0)),
          Math.abs((pa[i + 1] ?? 0) - (pb[i + 1] ?? 0)),
          Math.abs((pa[i + 2] ?? 0) - (pb[i + 2] ?? 0)),
        )
        if (delta > limit) count += 1
      }
      return count
    },
    [a.toString('base64'), b.toString('base64'), threshold] as const,
  )
}

const GLYPH_ROUTES = [
  '/ar',
  '/ar/about',
  '/ar/solutions/broilers',
  '/ar/products',
  '/ar/products/fixture-feed-alpha',
  '/ar/contact',
  '/ar/partner-with-us',
  '/ar/how-we-work',
  '/ar/knowledge',
  '/ar/privacy',
  '/en',
]

for (const vp of [byName('390'), byName('1440')]) {
  test.describe(`display line masks keep glyphs intact ${vp.name}`, () => {
    test.use({ ...contextFor(vp), reducedMotion: 'reduce' })

    test(`no glyph ink clipped by .mask-line @ ${vp.name}`, async ({ page }, testInfo) => {
      test.setTimeout(240_000)
      const clipped: string[] = []
      let checked = 0
      for (const routePath of GLYPH_ROUTES) {
        await page.goto(routePath)
        await settle(page, 400)
        const lines = page.locator('.mask-line')
        const count = await lines.count()
        for (let i = 0; i < count; i += 1) {
          const line = lines.nth(i)
          if (!(await line.isVisible())) continue
          await line.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
          const box = await line.boundingBox()
          if (!box || box.width < 2 || box.height < 2) continue
          const pad = Math.ceil(box.height * 0.6)
          const x = Math.max(0, Math.floor(box.x - 8))
          const y = Math.max(0, Math.floor(box.y - pad))
          const clip = {
            x,
            y,
            width: Math.min(vp.width, Math.ceil(box.x + box.width + 8)) - x,
            height: Math.min(vp.height, Math.ceil(box.y + box.height + pad)) - y,
          }
          if (clip.width < 2 || clip.height < 2) continue
          const asRendered = await page.screenshot({ clip, animations: 'disabled' })
          await line.evaluate((el) => (el as HTMLElement).style.setProperty('overflow', 'visible', 'important'))
          const unclipped = await page.screenshot({ clip, animations: 'disabled' })
          await line.evaluate((el) => (el as HTMLElement).style.removeProperty('overflow'))
          checked += 1
          // > 3 clearly different pixels = visible ink loss (sub-visible anti-aliasing at a mask edge is ignored).
          const lost = asRendered.equals(unclipped) ? 0 : await inkDiff(page, asRendered, unclipped)
          if (lost > 3) {
            const text = ((await line.textContent()) ?? '').replace(/\s+/g, ' ').trim()
            clipped.push(`${routePath} → «${text}» (${lost} px)`)
            await testInfo.attach(`clipped-${clipped.length}-as-rendered.png`, { body: asRendered, contentType: 'image/png' })
            await testInfo.attach(`clipped-${clipped.length}-unclipped.png`, { body: unclipped, contentType: 'image/png' })
          }
        }
      }
      testInfo.annotations.push({ type: 'mask-lines', description: JSON.stringify({ viewport: vp.name, checked, clipped }) })
      expect(checked, 'mask lines checked').toBeGreaterThan(20)
      expect.soft(clipped, 'display lines whose glyphs are cut by the reveal mask').toEqual([])
    })
  })
}
