import { expect, test } from '@playwright/test'

/**
 * Spec §16.1 journeys 3, 4 (partial) and 7: navigation, locale switching, keyboard menu, routing integrity.
 */

/** Partner names from src/content/partners.ts. */
const PARTNERS = ['Betra', 'Menon', 'NFT']

test.describe('routing', () => {
  test('root redirects to the Arabic home page', async ({ page }) => {
    const res = await page.goto('/')
    expect(res?.ok()).toBeTruthy()
    await expect(page).toHaveURL(/\/ar$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  })

  test('English home is LTR', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  })

  test('unprefixed paths redirect into the Arabic locale', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveURL(/\/ar\/about$/)
  })

  for (const path of ['/ar/this-page-does-not-exist', '/en/missing/deeper', '/ar/products/NOT_A_VALID_SLUG', '/ar/solutions/cattle']) {
    test(`unknown route ${path} renders the designed 404 with status 404`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status()).toBe(404)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('footer')).toBeVisible()
    })
  }

  const routes = [
    '/ar',
    '/ar/about',
    '/ar/poultry-solutions',
    '/ar/solutions/broilers',
    '/ar/solutions/layers',
    '/ar/solutions/breeders',
    '/ar/products',
    '/ar/how-we-work',
    '/ar/knowledge',
    '/ar/contact',
    '/ar/partner-with-us',
    '/ar/privacy',
  ]
  for (const route of routes) {
    for (const path of [route, route.replace('/ar', '/en')]) {
      test(`direct load ${path} → 200 with one h1 and no console errors`, async ({ page }) => {
        const errors: string[] = []
        page.on('pageerror', (e) => errors.push(e.message))
        page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
        const res = await page.goto(path)
        expect(res?.status()).toBe(200)
        await expect(page.locator('h1')).toHaveCount(1)
        expect(errors, errors.join('\n')).toEqual([])
      })
    }
  }
})

test.describe('header & locale switching', () => {
  test('locale switch preserves the equivalent route and query', async ({ page }) => {
    await page.goto('/ar/products?category=vaccines')
    await page.getByRole('link', { name: /English/ }).first().click()
    await expect(page).toHaveURL(/\/en\/products\?category=vaccines$/)
    await page.getByRole('link', { name: /العربية/ }).first().click()
    await expect(page).toHaveURL(/\/ar\/products\?category=vaccines$/)
  })

  test('skip link moves focus to the main content', async ({ page, browserName }, testInfo) => {
    test.skip(!!testInfo.project.use.isMobile, 'keyboard test runs on desktop')
    await page.goto('/ar')
    const skip = page.locator('a[href="#main"]')
    if (browserName === 'webkit') {
      // WebKit's default keyboard model (Safari with "Press Tab to highlight each item" off) tabs only to buttons and
      // form fields, and Playwright's WebKit has no Option+Tab equivalent, so the link is focused directly there.
      await skip.focus()
    } else {
      await page.keyboard.press('Tab')
    }
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
  })

  test('desktop solutions dropdown is keyboard operable', async ({ page }, testInfo) => {
    test.skip(!!testInfo.project.use.isMobile, 'desktop navigation only')
    await page.goto('/ar')
    const trigger = page.locator('header').getByRole('button', { name: /حلول الدواجن/ })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('header').getByRole('link', { name: 'البياض' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('desktop partners dropdown lists partner sites that open in a new tab', async ({ page }, testInfo) => {
    test.skip(!!testInfo.project.use.isMobile, 'desktop navigation only')
    await page.goto('/ar')
    const trigger = page.locator('header').getByRole('button', { name: 'شركاؤنا' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const panel = page.locator(`[id="${await trigger.getAttribute('aria-controls')}"]`)
    const links = panel.getByRole('link')
    await expect(links).toHaveCount(PARTNERS.length)
    for (const name of PARTNERS) {
      const link = panel.getByRole('link', { name: new RegExp(name) })
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
      await expect(link).toHaveAttribute('href', /^https:\/\//)
    }
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('home partners section links each partner in a new tab', async ({ page }) => {
    await page.goto('/en')
    const section = page.locator('#partners')
    await expect(section.getByRole('heading', { level: 2 })).toBeVisible()
    for (const name of PARTNERS) {
      const link = section.getByRole('link', { name: new RegExp(name) })
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /noopener/)
    }
  })
})

test.describe('mobile menu', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })

  test('opens as a modal dialog, closes with Escape and restores focus; navigation closes it', async ({ page }) => {
    await page.goto('/ar')
    const trigger = page.getByRole('button', { name: 'فتح القائمة' }).first()
    await trigger.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('button', { name: 'إغلاق القائمة' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()

    await trigger.click()
    await dialog.getByRole('link', { name: 'عن الشروق' }).click()
    await expect(page).toHaveURL(/\/ar\/about$/)
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('partners: external links open in a new tab; the label goes to the home partners section', async ({ page }) => {
    await page.goto('/ar/about')
    await page.getByRole('button', { name: 'فتح القائمة' }).first().click()
    const dialog = page.getByRole('dialog')
    for (const name of PARTNERS) {
      await expect(dialog.getByRole('link', { name: new RegExp(name) })).toHaveAttribute('target', '_blank')
    }
    await dialog.getByRole('link', { name: 'شركاؤنا' }).click()
    await expect(page).toHaveURL(/\/ar#partners$/)
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page.locator('#partners')).toBeInViewport()
  })

  test('mobile → About → EN → AR keeps navigation working (journey 3)', async ({ page }) => {
    await page.goto('/ar')
    await page.getByRole('button', { name: 'فتح القائمة' }).first().click()
    await page.getByRole('dialog').getByRole('link', { name: 'عن الشروق' }).click()
    await expect(page).toHaveURL(/\/ar\/about$/)
    await page.getByRole('button', { name: 'فتح القائمة' }).first().click()
    await page.getByRole('dialog').getByRole('link', { name: /English/ }).click()
    await expect(page).toHaveURL(/\/en\/about$/)
    await page.getByRole('button', { name: /open menu/i }).first().click()
    await page.getByRole('dialog').getByRole('link', { name: /العربية/ }).click()
    await expect(page).toHaveURL(/\/ar\/about$/)
  })

  test.describe('at 320px', () => {
    // A context created at 320px, not page.setViewportSize: resizing a live window hangs in Playwright's Firefox
    // driver on Windows (90 s timeout before any navigation), while a 320px context works in every engine.
    test.use({ viewport: { width: 320, height: 720 } })

    test('no horizontal overflow on key pages at 320px', async ({ page }) => {
      for (const path of ['/ar', '/ar/products', '/ar/contact', '/en']) {
        await page.goto(path)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, path).toBeLessThanOrEqual(0)
      }
    })
  })
})
