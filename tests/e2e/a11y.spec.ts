import fs from 'node:fs'
import path from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page, type TestInfo } from '@playwright/test'

/**
 * Spec §12.2 / §16 — automated WCAG 2.2 AA scan (axe-core) of every public route in docs/site-map.md,
 * in Arabic and English, at 1440 (desktop) and 390 (mobile), plus the interactive states that only exist
 * after a click: open mobile menu, open product inquiry drawer, open mobile filter drawer, open solutions
 * dropdown, sticky compact bar, form validation errors, and /ar with prefers-reduced-motion.
 *
 * Each scan writes docs/evidence/axe/<locale>-<page>-<viewport>[-state].json (violations with nodes,
 * "incomplete" items that need a manual check, and the pass count). Summarise with
 * `node scripts/axe-summary.mjs`. The suite fails on any violation: the target is zero.
 *
 * Run against the fixture production build: E2E_BASE_URL=http://localhost:3200 pnpm exec playwright test
 * tests/e2e/a11y.spec.ts --project=desktop. Article detail (/knowledge/[slug]) is not covered while the
 * fixture DB has no approved article.
 */

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const OUT_DIR = path.join(process.cwd(), 'docs', 'evidence', 'axe')
const PRODUCT = '/ar/products/fixture-feed-alpha'

const ROUTES = [
  '/ar',
  '/ar/about',
  '/ar/poultry-solutions',
  '/ar/solutions/broilers',
  '/ar/solutions/layers',
  '/ar/solutions/breeders',
  '/ar/products',
  '/ar/products?q=zzzz-no-match',
  PRODUCT,
  '/ar/how-we-work',
  '/ar/knowledge',
  '/ar/contact',
  '/ar/partner-with-us',
  '/ar/privacy',
  '/ar/this-page-does-not-exist',
]

const MOBILE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } as const

test.describe.configure({ mode: 'parallel' })

const toEn = (route: string) => route.replace(/^\/ar(?=\/|\?|$)/, '/en')

function fileName(route: string, vw: number, state?: string) {
  const [pathname = '', query] = route.split('?')
  const parts = pathname.split('/').filter(Boolean)
  const locale = parts.shift() ?? 'root'
  const pageName = parts.length ? parts.join('-') : 'home'
  const q = query ? `-${query.replace(/[^a-z0-9]+/gi, '_')}` : ''
  return `${locale}-${pageName}${q}-${vw}${state ? `-${state}` : ''}.json`
}

/** Walk the page so every scroll-triggered reveal has run, then return to the top and let motion settle. */
async function settle(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined)
  await page.evaluate(() => document.fonts?.ready)
  const vh = page.viewportSize()?.height ?? 900
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += Math.round(vh * 0.7)) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y)
    await page.waitForTimeout(110)
  }
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }))
  await page.waitForTimeout(500)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(1400)
}

async function scan(page: Page, testInfo: TestInfo, route: string, state?: string, include?: string) {
  const builder = new AxeBuilder({ page }).withTags(TAGS)
  if (include) builder.include(include)
  const results = await builder.analyze()
  const vw = page.viewportSize()?.width ?? 0
  const record = {
    route,
    url: page.url(),
    viewport: page.viewportSize(),
    state: state ?? 'default',
    scope: include ?? 'document',
    project: testInfo.project.name,
    reducedMotion: state === 'reduced-motion',
    axe: results.testEngine.version,
    timestamp: results.timestamp,
    tags: TAGS,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      helpUrl: v.helpUrl,
      tags: v.tags.filter((t) => t.startsWith('wcag')),
      nodes: v.nodes.map((n) => ({
        target: n.target,
        html: n.html.slice(0, 400),
        failureSummary: n.failureSummary,
        data: [...n.any, ...n.all, ...n.none].map((c) => c.data).filter(Boolean),
      })),
    })),
    incomplete: results.incomplete.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      count: v.nodes.length,
      nodes: v.nodes.slice(0, 12).map((n) => ({
        target: n.target,
        html: n.html.slice(0, 200),
        reason: [...n.any, ...n.all, ...n.none].map((c) => c.message).filter(Boolean)[0],
      })),
    })),
    passes: results.passes.length,
  }
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, fileName(route, vw, state)), JSON.stringify(record, null, 2))
  await testInfo.attach('axe-results', { body: JSON.stringify(record, null, 2), contentType: 'application/json' })

  const summary = results.violations.map(
    (v) => `${v.id} [${v.impact}] ×${v.nodes.length}: ${v.nodes.slice(0, 4).map((n) => n.target.join(' ')).join(' | ')}`,
  )
  expect.soft(summary, `axe WCAG 2.2 AA violations on ${route} @${vw}${state ? ` (${state})` : ''}`).toEqual([])
}

async function load(page: Page, route: string) {
  const res = await page.goto(route)
  expect(res?.status(), route).toBeLessThan(500)
  await settle(page)
}

for (const [label, use] of [
  ['1440', { viewport: { width: 1440, height: 900 } }],
  ['390', MOBILE],
] as const) {
  test.describe(`axe @${label}`, () => {
    test.use(use)
    test.beforeEach(({}, testInfo) => {
      test.skip(label === '1440' && testInfo.project.name === 'mobile', 'desktop viewport scans run in the desktop project')
    })
    for (const route of ROUTES) {
      for (const p of [route, toEn(route)]) {
        test(`${p}`, async ({ page }, testInfo) => {
          await load(page, p)
          await scan(page, testInfo, p)
        })
      }
    }
  })
}

test.describe('axe @1440 states', () => {
  test.use({ viewport: { width: 1440, height: 900 } })
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'desktop-only states')
  })

  // Scoped to the bar: the rest of the page is covered by the default scan, and scroll-linked scenes that are
  // off-screen at this position (e.g. the hero fading out as it leaves) are not a resting state.
  test('/ar sticky compact bar (scrolled)', async ({ page }, testInfo) => {
    await load(page, '/ar')
    await page.evaluate(() => window.scrollTo({ top: Math.round(document.documentElement.scrollHeight * 0.4), behavior: 'instant' }))
    const bar = 'div.fixed[data-theme="light"][aria-hidden="false"]'
    await expect(page.locator(bar)).toBeVisible()
    await page.waitForTimeout(900)
    await scan(page, testInfo, '/ar', 'sticky-bar', bar)
  })

  test('/ar solutions dropdown open', async ({ page }, testInfo) => {
    await load(page, '/ar')
    const trigger = page.locator('header').getByRole('button', { name: /حلول الدواجن/ }).first()
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await page.waitForTimeout(700)
    await scan(page, testInfo, '/ar', 'dropdown-open')
  })

  for (const route of ['/ar', '/en']) {
    test(`${route} reduced motion @1440 + @390`, async ({ browser }, testInfo) => {
      for (const opts of [{ viewport: { width: 1440, height: 900 } }, MOBILE]) {
        const context = await browser.newContext({ ...opts, reducedMotion: 'reduce', locale: 'ar-EG', baseURL: testInfo.project.use.baseURL })
        try {
          const page = await context.newPage()
          await load(page, route)
          await scan(page, testInfo, route, 'reduced-motion')
        } finally {
          await context.close()
        }
      }
    })
  }
})

for (const [label, use] of [
  ['1440', { viewport: { width: 1440, height: 900 } }],
  ['390', MOBILE],
] as const) {
  test.describe(`axe @${label} dialogs & forms`, () => {
    test.use(use)
    test.beforeEach(({}, testInfo) => {
      test.skip(label === '1440' && testInfo.project.name === 'mobile', 'desktop viewport scans run in the desktop project')
    })

    for (const route of [PRODUCT, toEn(PRODUCT)]) {
      test(`${route} product inquiry drawer open`, async ({ page }, testInfo) => {
        await load(page, route)
        const trigger = page.locator('main button[aria-haspopup="dialog"]').first()
        await trigger.scrollIntoViewIfNeeded()
        await trigger.click()
        const dialog = page.locator('dialog[open]')
        await expect(dialog).toBeVisible()
        await page.waitForTimeout(900)
        await scan(page, testInfo, route, 'drawer-open')
      })
    }

    for (const route of ['/ar/contact', '/en/contact']) {
      test(`${route} validation errors shown`, async ({ page }, testInfo) => {
        await load(page, route)
        const form = page.locator('main form[novalidate]').first()
        await expect(form).toBeAttached()
        await form.locator('button[type="submit"]').click()
        await expect(form.locator('[aria-invalid="true"]').first()).toBeAttached()
        await page.waitForTimeout(800)
        await scan(page, testInfo, route, 'form-errors')
      })
    }

    if (label === '390') {
      for (const route of ['/ar', '/en']) {
        test(`${route} mobile menu open`, async ({ page }, testInfo) => {
          await load(page, route)
          await page.getByRole('button', { name: route === '/ar' ? 'فتح القائمة' : /open menu/i }).first().click()
          await expect(page.getByRole('dialog')).toBeVisible()
          await page.waitForTimeout(1000)
          await scan(page, testInfo, route, 'menu-open')
        })
      }

      for (const route of ['/ar/products', '/en/products']) {
        test(`${route} mobile filter drawer open`, async ({ page }, testInfo) => {
          await load(page, route)
          const trigger = page.locator('main .lg\\:hidden > button[aria-haspopup="dialog"]').first()
          await trigger.scrollIntoViewIfNeeded()
          await trigger.click()
          await expect(page.locator('dialog[open]')).toBeVisible()
          await page.waitForTimeout(900)
          await scan(page, testInfo, route, 'filters-open')
        })
      }
    }
  })
}
