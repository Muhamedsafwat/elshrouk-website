import { expect, test, type Page } from '@playwright/test'
import {
  AR,
  cleanupInquiries,
  expectSuccess,
  fillInquiry,
  findInquiries,
  inquiryForm,
  newRunTag,
  randomMobile,
  uniqueClientIp,
  useClientIp,
  waitForHydratedForm,
} from './support'

/**
 * Spec §11 / §16.1: the ONE inquiry form — client validation, anti-spam, idempotency, rate limiting.
 * Runs in the desktop AND mobile projects (playwright.config.ts). Target: /ar/contact (full farm form).
 * Every record created here has RUN in its name and is deleted in afterAll.
 */
const RUN = newRunTag('forms')

test.afterAll(async ({ request }) => {
  await cleanupInquiries(request, RUN)
  expect(await findInquiries(request, { name: ['contains', RUN] }, 'admin')).toHaveLength(0)
})

/** Records every POST (server-action calls) the page sends. */
function trackPosts(page: Page) {
  const posts: string[] = []
  page.on('request', (r) => {
    if (r.method() === 'POST') posts.push(r.url())
  })
  return posts
}

async function openContactForm(page: Page) {
  await page.goto('/ar/contact')
  const form = inquiryForm(page)
  await form.scrollIntoViewIfNeeded()
  await waitForHydratedForm(form)
  return form
}

const summaryOf = (page: Page) => page.getByRole('group', { name: AR.summaryTitle })

test.describe('client validation', () => {
  test('empty submit → focused error summary, linked messages and aria-invalid fields; nothing sent', async ({ page }) => {
    const posts = trackPosts(page)
    const form = await openContactForm(page)
    await form.getByRole('button', { name: AR.submit }).click()

    const summary = summaryOf(page)
    await expect(summary).toBeVisible()
    await expect(summary).toBeFocused()
    for (const label of [AR.name, AR.phone, 'الموافقة على استخدام البيانات']) {
      await expect(summary.getByRole('link', { name: new RegExp(label) })).toBeVisible()
    }
    await expect(form.getByLabel(AR.name)).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByLabel(AR.phone)).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByRole('checkbox', { name: AR.consent })).toHaveAttribute('aria-invalid', 'true')
    // Each invalid control points at its message.
    const describedBy = await form.getByLabel(AR.name).getAttribute('aria-describedby')
    expect(describedBy).toMatch(/-error\b/)
    await expect(page.locator(`[id="${describedBy!.split(' ')[0]}"]`)).toHaveText(AR.errors.required)

    // Summary links move focus to the field.
    await summary.getByRole('link', { name: new RegExp(AR.name) }).click()
    await expect(form.getByLabel(AR.name)).toBeFocused()

    // Fixing a field clears its error while typing.
    await form.getByLabel(AR.name).fill('مزارع اختبار')
    await expect(form.getByLabel(AR.name)).not.toHaveAttribute('aria-invalid', 'true')
    expect(posts).toEqual([])
  })

  test('production type is required for a farm request: reported on submit and kept until fixed', async ({ page }) => {
    const posts = trackPosts(page)
    const form = await openContactForm(page)
    const segment = form.getByLabel(AR.segment)

    // (a) An empty submit should list the required production type alongside the other fields.
    await form.getByRole('button', { name: AR.submit }).click()
    await expect(summaryOf(page)).toBeVisible()
    await expect.soft(summaryOf(page).getByRole('link', { name: new RegExp(AR.segment) }), 'empty submit lists production type').toBeVisible({ timeout: 3_000 })

    // (b) With everything else valid, the missing production type must stay reported (no silent dead end).
    await fillInquiry(form, { name: 'مزارع اختبار', phone: randomMobile(), consent: true })
    await form.getByRole('button', { name: AR.submit }).click()
    await page.waitForTimeout(1_000) // let focus move to the summary and blur handlers run
    await expect(summaryOf(page), 'error summary still shown after submit').toBeVisible({ timeout: 3_000 })
    await expect(summaryOf(page).getByRole('link', { name: new RegExp(AR.segment) })).toBeVisible()
    await expect(segment).toHaveAttribute('aria-invalid', 'true')
    expect(posts).toEqual([])
  })

  test('invalid phone is rejected inline; Arabic-Indic digits are accepted', async ({ page }) => {
    const posts = trackPosts(page)
    const form = await openContactForm(page)
    await fillInquiry(form, { name: 'مزارع اختبار', phone: '0101234', segment: 'layers', consent: true })
    await form.getByRole('button', { name: AR.submit }).click()

    const phone = form.getByLabel(AR.phone)
    await expect(phone).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByText(AR.errors.invalidPhone).first()).toBeVisible()
    await expect(summaryOf(page).getByRole('link', { name: new RegExp(AR.phone) })).toBeVisible()

    // ٠١٠١٢٣٤٥٦٧٨ (Arabic-Indic) is a valid Egyptian mobile → the error clears while typing.
    await phone.fill('٠١٠١٢٣٤٥٦٧٨')
    await expect(phone).not.toHaveAttribute('aria-invalid', 'true')
    expect(posts).toEqual([])
  })

  test('missing consent blocks the submission with a consent error', async ({ page }) => {
    const posts = trackPosts(page)
    const form = await openContactForm(page)
    await fillInquiry(form, { name: 'مزارع اختبار', phone: randomMobile(), segment: 'broilers', consent: false })
    await form.getByRole('button', { name: AR.submit }).click()

    const consent = form.getByRole('checkbox', { name: AR.consent })
    await expect(consent).toHaveAttribute('aria-invalid', 'true')
    await expect(form.getByText(AR.errors.consentRequired).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: AR.successTitle })).toHaveCount(0)
    expect(posts).toEqual([])
  })
})

test.describe('anti-spam and idempotency', () => {
  test('honeypot filled → neutral failure, no success, no record', async ({ page, request }) => {
    await useClientIp(page)
    const posts = trackPosts(page)
    const name = `روبوت ${RUN}-${test.info().project.name}-hp`
    const form = await openContactForm(page)
    await fillInquiry(form, { name, phone: randomMobile(), segment: 'broilers', message: `honeypot ${RUN}`, consent: true })
    await page.evaluate(() => {
      const trap = document.querySelector<HTMLInputElement>('input[name="website"]')
      if (!trap) throw new Error('honeypot input missing')
      trap.value = 'https://spam.example'
    })
    await form.getByRole('button', { name: AR.submit }).click()

    await expect(form.getByText(AR.errors.spamFull, { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: AR.successTitle })).toHaveCount(0)
    expect(posts.length, 'the server action was called').toBeGreaterThan(0)
    expect(await findInquiries(request, { name })).toHaveLength(0)
  })

  test('double-click submit stores exactly ONE record', async ({ page, request }) => {
    await useClientIp(page)
    const name = `نقر مزدوج ${RUN}-${test.info().project.name}`
    const form = await openContactForm(page)
    await fillInquiry(form, { name, phone: randomMobile(), segment: 'breeders', message: `double ${RUN}`, consent: true })
    await form.getByRole('button', { name: AR.submit }).dblclick()

    const reference = await expectSuccess(page)
    await page.waitForTimeout(1_500) // give a stray second request time to land
    const docs = await findInquiries(request, { name })
    expect(docs, 'records with this name').toHaveLength(1)
    expect(docs[0]!.reference).toBe(reference)
  })
})

test.describe('rate limiting', () => {
  test('after 5 submissions in 10 minutes the 6th shows the rate-limited message', async ({ page, request }) => {
    test.setTimeout(150_000)
    // Own client address (198.19.x.x) so no other test shares this bucket.
    await useClientIp(page, uniqueClientIp(19))
    const name = `حد الإرسال ${RUN}-${test.info().project.name}`
    const phone = randomMobile()
    const message = `rate ${RUN}`
    await page.goto('/ar/contact')

    const references: string[] = []
    let limitedAt = 0
    for (let attempt = 1; attempt <= 7; attempt += 1) {
      const form = inquiryForm(page)
      await form.scrollIntoViewIfNeeded()
      await waitForHydratedForm(form)
      // Identical content each time: the 10-minute duplicate window returns the first record's reference.
      await fillInquiry(form, { name, phone, segment: 'broilers', message, consent: true })
      await form.getByRole('button', { name: AR.submit }).click()

      const success = page.getByRole('heading', { name: AR.successTitle })
      const limited = form.getByText(AR.errors.rateLimitedFull, { exact: true })
      await expect(success.or(limited)).toBeVisible({ timeout: 20_000 })
      if (await limited.isVisible()) {
        limitedAt = attempt
        break
      }
      references.push(await expectSuccess(page))
      await page.getByRole('button', { name: AR.another }).or(page.getByRole('link', { name: AR.another })).click()
    }

    expect(limitedAt, 'attempt that hit the limit').toBe(6)
    expect(new Set(references).size, 'duplicates resolve to one reference').toBe(1)
    await expect(page.getByRole('heading', { name: AR.successTitle })).toHaveCount(0)
    expect(await findInquiries(request, { name })).toHaveLength(1)
  })
})
