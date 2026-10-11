import { expect, test } from '@playwright/test'
import {
  AR,
  DEV_URL,
  cleanupInquiries,
  expectSuccess,
  fillInquiry,
  findInquiries,
  inquiryByReference,
  inquiryForm,
  newRunTag,
  productIdBySlug,
  randomMobile,
  scrollToBottom,
  useClientIp,
  waitForHydratedForm,
} from './support'

/**
 * Spec §16.1 customer journeys against the production build on :3200 (isolated fixture DB).
 * Every inquiry created here carries RUN in its name and is deleted in afterAll (admin REST).
 */
const RUN = newRunTag('journeys')


test.afterAll(async ({ request }) => {
  await cleanupInquiries(request, RUN)
  // Nothing tagged with this run may survive the cleanup.
  expect(await findInquiries(request, { name: ['contains', RUN] }, 'admin')).toHaveLength(0)
})

test('journey 1 — home → bottom → broilers page → farm inquiry is stored with segment + source context', async ({ page, request }) => {
  await useClientIp(page)
  const name = `مزارع اختبار ${RUN}-j1`
  const message = `طلب أعلاف وتحصينات لدورة تسمين قادمة (${RUN})`

  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/ar')
  await scrollToBottom(page)
  const footer = page.locator('footer')
  await expect(footer).toBeInViewport()

  // The footer's solutions list links to the broilers chapter.
  await footer.locator('a[href="/ar/solutions/broilers"]').first().click()
  await expect(page).toHaveURL(/\/ar\/solutions\/broilers$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const form = inquiryForm(page)
  await form.scrollIntoViewIfNeeded()
  await waitForHydratedForm(form)
  // Segment pages prefill the production type.
  await expect(form.getByLabel(AR.segment)).toHaveValue('broilers')
  await fillInquiry(form, { name, phone: '01012345678', segment: 'broilers', message, consent: true })
  await form.getByRole('button', { name: AR.submit }).click()

  const reference = await expectSuccess(page)
  const doc = await inquiryByReference(request, reference)
  expect(doc).toMatchObject({
    type: 'farm',
    status: 'new',
    segment: 'broilers',
    sourcePath: '/ar/solutions/broilers',
    locale: 'ar',
    name,
    phone: '+201012345678', // stored in E.164
  })
  expect(errors, errors.join('\n')).toEqual([])
})

test('journey 2 — catalogue filters (URL state) → product → inquiry drawer → product inquiry linked to the product', async ({ page, request }) => {
  await useClientIp(page)
  const slug = 'fixture-supplement-beta'
  const productId = await productIdBySlug(request, slug)
  const name = `مشتري اختبار ${RUN}-j2`

  await page.goto('/ar/products')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  // Desktop filter rail: each group is a labelled region of real links.
  await page.getByRole('region', { name: 'الفئة' }).getByRole('link', { name: /مكملات الأعلاف/ }).click()
  await expect(page).toHaveURL(/[?&]category=supplements(&|$)/)
  await page.getByRole('region', { name: 'نوع الإنتاج' }).getByRole('link', { name: /البياض/ }).click()
  await expect(page).toHaveURL(/[?&]segment=layers(&|$)/)
  await expect(page).toHaveURL(/[?&]category=supplements(&|$)/)

  // URL state survives a reload (shareable link) and still lists the matching fixture.
  await page.reload()
  const productLink = page.locator(`a[href="/ar/products/${slug}"]`).first()
  await expect(productLink).toBeVisible()
  // Products outside the filter are gone.
  await expect(page.locator('a[href="/ar/products/fixture-feed-alpha"]')).toHaveCount(0)

  await productLink.click()
  await expect(page).toHaveURL(new RegExp(`/ar/products/${slug}$`))

  await page.getByRole('button', { name: /استفسر عن المنتج/ }).first().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const form = inquiryForm(dialog)
  await waitForHydratedForm(form)
  await fillInquiry(form, { name, phone: randomMobile(), message: `نحتاج عرض سعر وكمية مبدئية (${RUN})`, consent: true })
  await form.getByRole('button', { name: AR.submit }).click()

  const reference = await expectSuccess(dialog)
  const doc = await inquiryByReference(request, reference)
  expect(doc).toMatchObject({ type: 'product', productRef: productId, sourcePath: `/ar/products/${slug}`, name })
  expect(doc.productLabel).toBeTruthy()
})

test('journey 6 — empty catalogue on the dev DB: designed empty state, CTA leads to a working form', async ({ page }) => {
  // Read-only against the development database: the form is exercised up to a server round trip that
  // the honeypot rejects BEFORE persistence, so no record is ever written to dev data.
  test.setTimeout(180_000)
  const res = await page.goto(`${DEV_URL}/ar/products`, { timeout: 120_000 })
  expect(res?.status()).toBe(200)

  await expect(page.getByRole('heading', { name: 'نضيف المنتجات إلى الكتالوج الرقمي' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'تصفح حسب الفئة' })).toBeVisible()
  // No product cards — never placeholder products.
  await expect(page.locator('a[href^="/ar/products/"]')).toHaveCount(0)

  const cta = page.getByRole('link', { name: 'اطلب قائمة المنتجات' })
  await expect(cta).toHaveAttribute('href', '#catalog-inquiry')
  await cta.click()
  await expect(page).toHaveURL(/#catalog-inquiry$/)

  const form = inquiryForm(page)
  await expect(form).toBeInViewport({ ratio: 0.05 })
  await waitForHydratedForm(form)

  // Client validation is live (empty submit → summary + invalid fields)…
  await form.getByRole('button', { name: AR.submit }).click()
  await expect(form.getByText(AR.summaryTitle)).toBeVisible()
  await expect(form.getByLabel(AR.name)).toHaveAttribute('aria-invalid', 'true')

  // …and a valid submission reaches the server action and comes back with a real answer.
  await fillInquiry(form, { name: 'تحقق تلقائي', phone: randomMobile(), consent: true })
  // A category makes the product request complete without a message (schema: product needs id, label,
  // category or message).
  await form.getByLabel('فئة المنتج').selectOption('feed')
  await expect(form.getByText(AR.summaryTitle)).toBeHidden()
  await page.evaluate(() => {
    const trap = document.querySelector<HTMLInputElement>('input[name="website"]')
    if (trap) trap.value = 'honeypot-dev-roundtrip'
  })
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.request().method() === 'POST' && r.url().startsWith(`${DEV_URL}/ar/products`)),
    form.getByRole('button', { name: AR.submit }).click(),
  ])
  expect(response.status()).toBe(200)
  await expect(form.getByText(AR.errors.spamFull, { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: AR.successTitle })).toHaveCount(0)
})

test('journey 7 — malformed queries render safely; drafts and unknown slugs are real 404s', async ({ page }) => {
  let dialogs = 0
  page.on('dialog', async (d) => {
    dialogs += 1
    await d.dismiss()
  })
  const res = await page.goto('/ar/products?category=%3Cscript%3Ealert(1)%3C/script%3E&page=-1')
  expect(res?.status()).toBe(200)
  // Never reflected as live markup (it may appear JSON-escaped inside the RSC payload, which is inert).
  expect(await res!.text()).not.toContain('<script>alert(1)</script>')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  // The bogus category and page are ignored: page 1 of all published fixtures.
  await expect(page.locator('a[href="/ar/products/fixture-feed-alpha"]').first()).toBeVisible()
  await expect(page).toHaveURL(/page=-1/) // no redirect loop, rendered in place
  const injected = await page.evaluate(() => Array.from(document.scripts).some((s) => s.textContent?.trim() === 'alert(1)'))
  expect(injected).toBe(false)
  expect(dialogs).toBe(0)

  for (const path of ['/ar/products/fixture-draft-delta', '/ar/products/does-not-exist']) {
    const r = await page.goto(path)
    expect(r?.status(), path).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
  // Unapproved draft is not reachable through the English route either.
  expect((await page.goto('/en/products/fixture-draft-delta'))?.status()).toBe(404)
})

test('journey 8 — a failed submission shows the failure panel and never a success', async ({ page, request }) => {
  await useClientIp(page)
  const name = `فشل اختبار ${RUN}-j8`
  await page.goto('/ar/solutions/broilers')
  const form = inquiryForm(page)
  await form.scrollIntoViewIfNeeded()
  await waitForHydratedForm(form)

  let intercepted = 0
  await page.route(
    (url) => url.pathname === '/ar/solutions/broilers',
    async (route) => {
      if (route.request().method() !== 'POST') return route.fallback()
      intercepted += 1
      await route.fulfill({ status: 500, contentType: 'text/plain', body: 'Internal Server Error' })
    },
  )

  await fillInquiry(form, { name, phone: randomMobile(), segment: 'broilers', message: `فشل متعمد ${RUN}`, consent: true })
  await form.getByRole('button', { name: AR.submit }).click()

  await expect(form.getByText(AR.failureTitle, { exact: true })).toBeVisible()
  await expect(form.getByText(AR.errors.networkFull, { exact: true })).toBeVisible()
  // …and it is announced through the polite live region.
  await expect(form.getByRole('status')).toContainText(AR.failureTitle)
  await expect(form.getByRole('button', { name: AR.retry })).toBeVisible()
  await expect(page.getByRole('heading', { name: AR.successTitle })).toHaveCount(0)
  await expect(page.locator('[data-inquiry-reference]')).toHaveCount(0)
  expect(intercepted).toBeGreaterThan(0)
  // Typed data is kept for the retry.
  await expect(form.getByLabel(AR.name)).toHaveValue(name)
  // Nothing reached the server, so nothing was stored.
  expect(await findInquiries(request, { name })).toHaveLength(0)
})
