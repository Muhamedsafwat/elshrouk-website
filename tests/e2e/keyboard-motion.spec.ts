import { expect, test } from '@playwright/test'

/**
 * Spec §12.2 / §16.1: keyboard operation of the shared interactive primitives and the reduced-motion
 * contract ("reduced motion ⇒ final state", docs/dev-cheatsheet.md). Desktop project only.
 */

test.describe('keyboard', () => {
  test('first Tab from the top of the page reaches the skip link, which becomes visible', async ({ page }) => {
    await page.goto('/ar')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'انتقل إلى المحتوى' }).or(page.locator('a[href="#main"]')).first()
    await expect(skip).toBeFocused()
    await expect(skip).toHaveAttribute('href', '#main')
    await expect(skip).toBeInViewport()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
    await expect(page.locator('#main')).toBeInViewport()
  })

  test('FAQ accordion toggles with Enter and Space and keeps aria-expanded in sync', async ({ page }) => {
    await page.goto('/ar')
    const faq = page.locator('#faq')
    await faq.scrollIntoViewIfNeeded()
    const button = faq.getByRole('button').first()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    const panel = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`)
    await expect(panel).toHaveAttribute('role', 'region')

    await button.focus()
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(panel.getByText(/\S/).first()).toBeVisible()
    await expect(button).toBeFocused()

    await page.keyboard.press('Space')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    // Closed content is inert (not focusable / not exposed) but stays in the DOM for find-in-page.
    await expect(panel.locator('[inert]')).toHaveCount(1)

    // Opening another item closes the first (single-open accordion), all by keyboard.
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    const second = faq.getByRole('button').nth(1)
    await second.focus()
    await page.keyboard.press('Enter')
    await expect(second).toHaveAttribute('aria-expanded', 'true')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  test('product inquiry drawer: opens from the keyboard, focus moves inside, Esc closes and returns focus', async ({ page }) => {
    await page.goto('/ar/products/fixture-feed-alpha')
    const trigger = page.getByRole('button', { name: /استفسر عن المنتج/ }).first()
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await trigger.focus()
    await page.keyboard.press('Enter')

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleName(/استفسار عن/)
    await expect.poll(() => dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    // Tabbing stays inside the modal.
    for (let i = 0; i < 3; i += 1) {
      await page.keyboard.press('Tab')
      expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true)
    }
    // The page behind is inert while the modal is open.
    await expect(page.locator('html')).toHaveCSS('overflow', 'hidden')

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden')
  })
})

test.describe('reduced motion', () => {
  test('with prefers-reduced-motion, every [data-reveal] element on /ar is in its final visible state at load', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/ar', { waitUntil: 'load' })
    await page.waitForTimeout(500) // hydration + MotionRuntime effects

    const report = await page.evaluate(() => {
      const offenders: string[] = []
      const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
      const describe = (el: Element) =>
        `${el.tagName.toLowerCase()}[data-reveal=${(el as HTMLElement).dataset.reveal}] "${(el.textContent ?? '').trim().slice(0, 40)}"`
      const effectiveOpacity = (el: Element | null) => {
        let o = 1
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) o *= Number(getComputedStyle(n).opacity)
        return o
      }
      const shifted = (el: Element) => {
        const t = getComputedStyle(el).transform
        if (!t || t === 'none') return false
        const m = new DOMMatrixReadOnly(t)
        return Math.abs(m.m41) > 1 || Math.abs(m.m42) > 1
      }
      const clipped = (el: Element) => {
        const c = getComputedStyle(el).clipPath
        return !!c && c !== 'none' && !/^inset\(0(px|%)?( 0(px|%)?){0,3}\)$/.test(c)
      }
      let rendered = 0
      for (const el of nodes) {
        if (el.getClientRects().length === 0) continue // not rendered at this breakpoint
        rendered += 1
        if (effectiveOpacity(el) < 0.99) offenders.push(`opacity ${effectiveOpacity(el).toFixed(2)}: ${describe(el)}`)
        if (getComputedStyle(el).visibility === 'hidden') offenders.push(`visibility hidden: ${describe(el)}`)
        if (shifted(el)) offenders.push(`transform ${getComputedStyle(el).transform}: ${describe(el)}`)
        if (clipped(el)) offenders.push(`clip-path ${getComputedStyle(el).clipPath}: ${describe(el)}`)
        for (const line of Array.from(el.querySelectorAll('.mask-line > span'))) {
          if (shifted(line)) offenders.push(`mask line transform ${getComputedStyle(line).transform}: ${describe(el)}`)
        }
      }
      return { total: nodes.length, rendered, offenders }
    })

    expect(report.rendered, 'reveal elements found').toBeGreaterThan(5)
    expect(report.offenders, report.offenders.join('\n')).toEqual([])
  })
})
