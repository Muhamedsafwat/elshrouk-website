import { expect, test, type APIRequestContext } from '@playwright/test'
import {
  AR,
  BASE_URL,
  authHeaders,
  cleanupInquiries,
  expectSuccess,
  fillInquiry,
  findInquiries,
  inquiryByReference,
  inquiryForm,
  newRunTag,
  randomMobile,
  useClientIp,
  waitForHydratedForm,
} from './support'

/**
 * Spec §10.2–10.3 / §16.1 journeys 4–5: CMS roles, approval contract and inquiry lifecycle through the
 * Payload REST API (request fixture). Temporary products use the slug prefix `e2e-tmp-`; every record is
 * deleted in afterAll even when a test fails midway.
 */
const RUN = newRunTag('cms')
const SLUG_PREFIX = `e2e-tmp-${Date.now()}`
const createdProducts = new Set<number>()
const createdUsers = new Set<number>()

const api = (path: string) => `${BASE_URL}/api${path}`

async function taxonomyId(request: APIRequestContext, collection: 'product-categories' | 'poultry-segments', key: string) {
  const res = await request.get(api(`/${collection}?depth=0&where[key][equals]=${key}`))
  expect(res.status()).toBe(200)
  const { docs } = (await res.json()) as { docs: { id: number }[] }
  expect(docs).toHaveLength(1)
  return docs[0]!.id
}

async function createProduct(request: APIRequestContext, role: 'admin' | 'editor', suffix: string) {
  const slug = `${SLUG_PREFIX}-${suffix}`
  const res = await request.post(api('/products'), {
    headers: await authHeaders(request, role),
    data: {
      nameAr: `[TEST] منتج مؤقت ${slug}`,
      slug,
      category: await taxonomyId(request, 'product-categories', 'feed'),
      segments: [await taxonomyId(request, 'poultry-segments', 'broilers')],
      availabilityStatus: 'inquiry_only',
    },
  })
  expect(res.status(), `create product as ${role}: ${await res.text()}`).toBe(201)
  const { doc } = (await res.json()) as { doc: { id: number; slug: string; approvalStatus: string; isPublished: boolean } }
  createdProducts.add(doc.id)
  return doc
}

async function deleteProduct(request: APIRequestContext, id: number) {
  const res = await request.delete(api(`/products/${id}`), { headers: await authHeaders(request, 'admin') })
  expect([200, 404]).toContain(res.status())
  createdProducts.delete(id)
}

test.afterAll(async ({ request }) => {
  for (const id of [...createdProducts]) await deleteProduct(request, id)
  for (const id of [...createdUsers]) {
    await request.delete(api(`/users/${id}`), { headers: await authHeaders(request, 'admin') })
  }
  await cleanupInquiries(request, RUN)
  // Nothing from this run may survive.
  const left = await request.get(api(`/products?depth=0&where[slug][contains]=${SLUG_PREFIX}`), { headers: await authHeaders(request, 'admin') })
  expect(((await left.json()) as { totalDocs: number }).totalDocs).toBe(0)
  expect(await findInquiries(request, { name: ['contains', RUN] }, 'admin')).toHaveLength(0)
})

test.describe('products: approval contract', () => {
  test('admin creates a draft → invisible; approve + publish → in the catalogue; delete → gone', async ({ page, request }) => {
    const draft = await createProduct(request, 'admin', 'pub')
    expect(draft.approvalStatus).toBe('review_required')
    expect(draft.isPublished).toBe(false)

    // A draft is invisible to the public API and site.
    const anon = await request.get(api(`/products?depth=0&where[slug][equals]=${draft.slug}`))
    expect(((await anon.json()) as { totalDocs: number }).totalDocs).toBe(0)
    expect((await page.goto(`/ar/products/${draft.slug}`))?.status()).toBe(404)

    // Publishing an unapproved record is not possible (the guard unpublishes it).
    const sneaky = await request.patch(api(`/products/${draft.id}`), {
      headers: await authHeaders(request, 'admin'),
      data: { isPublished: true },
    })
    expect(sneaky.status()).toBe(200)
    expect(((await sneaky.json()) as { doc: { isPublished: boolean } }).doc.isPublished).toBe(false)

    const approve = await request.patch(api(`/products/${draft.id}`), {
      headers: await authHeaders(request, 'admin'),
      data: { approvalStatus: 'approved', isPublished: true },
    })
    expect(approve.status(), await approve.text()).toBe(200)

    await page.goto('/ar/products')
    const card = page.locator(`a[href="/ar/products/${draft.slug}"]`).first()
    await expect
      .poll(
        async () => {
          await page.reload()
          return card.count()
        },
        { timeout: 20_000, intervals: [500, 1_000, 2_000, 3_000] },
      )
      .toBeGreaterThan(0)
    expect((await page.goto(`/ar/products/${draft.slug}`))?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(draft.slug)

    await deleteProduct(request, draft.id)
    await expect
      .poll(async () => (await page.goto(`/ar/products/${draft.slug}`))?.status(), { timeout: 15_000 })
      .toBe(404)
    await page.goto('/ar/products')
    await expect(page.locator(`a[href="/ar/products/${draft.slug}"]`)).toHaveCount(0)
  })

  test('editor with canApprove can approve; an editor without it cannot', async ({ request, playwright }) => {
    const product = await createProduct(request, 'editor', 'edt')
    const approve = await request.patch(api(`/products/${product.id}`), {
      headers: await authHeaders(request, 'editor'),
      data: { approvalStatus: 'approved' },
    })
    expect(approve.status(), await approve.text()).toBe(200)
    expect(((await approve.json()) as { doc: { approvalStatus: string } }).doc.approvalStatus).toBe('approved')

    // A plain editor (no canApprove) — created for this test and deleted afterwards.
    const email = `${SLUG_PREFIX}-plain-editor@e2e.test`
    const password = `Plain-${RUN}-Password-1`
    const created = await request.post(api('/users'), {
      headers: await authHeaders(request, 'admin'),
      data: { email, password, name: `Plain editor ${RUN}`, role: 'editor', canApprove: false },
    })
    expect(created.status(), await created.text()).toBe(201)
    createdUsers.add(((await created.json()) as { doc: { id: number } }).doc.id)

    const plain = await playwright.request.newContext()
    const login = await plain.post(api('/users/login'), { data: { email, password } })
    expect(login.status()).toBe(200)
    const token = ((await login.json()) as { token: string }).token
    const second = await createProduct(request, 'admin', 'plain')
    const denied = await plain.patch(api(`/products/${second.id}`), {
      headers: { Authorization: `JWT ${token}` },
      data: { approvalStatus: 'approved' },
    })
    expect(denied.status()).toBe(403)
    // The record stays unapproved.
    const check = await request.get(api(`/products/${second.id}?depth=0`), { headers: await authHeaders(request, 'admin') })
    expect(((await check.json()) as { approvalStatus: string }).approvalStatus).toBe('review_required')
    await plain.dispose()
  })

  test('sales cannot create, update or delete products', async ({ request }) => {
    const headers = await authHeaders(request, 'sales')
    const create = await request.post(api('/products'), {
      headers,
      data: { nameAr: 'غير مسموح', slug: `${SLUG_PREFIX}-sales`, category: await taxonomyId(request, 'product-categories', 'feed') },
    })
    expect(create.status()).toBe(403)

    const fixture = await request.get(api('/products?depth=0&where[slug][equals]=fixture-feed-alpha'), { headers })
    const id = ((await fixture.json()) as { docs: { id: number }[] }).docs[0]!.id
    expect((await request.patch(api(`/products/${id}`), { headers, data: { nameAr: 'تعديل' } })).status()).toBe(403)
    expect((await request.delete(api(`/products/${id}`), { headers })).status()).toBe(403)
  })
})

test.describe('inquiries: lifecycle and access', () => {
  test('sales moves an inquiry new → contacted → closed; closed → new is rejected; submitted data is immutable', async ({ page, request }) => {
    // Create a real inquiry through the public form (REST create is closed to everyone).
    await useClientIp(page)
    const name = `دورة حياة ${RUN}`
    await page.goto('/ar/contact')
    const form = inquiryForm(page)
    await form.scrollIntoViewIfNeeded()
    await waitForHydratedForm(form)
    await fillInquiry(form, { name, phone: randomMobile(), segment: 'layers', message: `lifecycle ${RUN}`, consent: true })
    await form.getByRole('button', { name: AR.submit }).click()
    const reference = await expectSuccess(page)
    const doc = await inquiryByReference(request, reference)
    expect(doc.status).toBe('new')

    const sales = await authHeaders(request, 'sales')
    const contacted = await request.patch(api(`/inquiries/${doc.id}`), { headers: sales, data: { status: 'contacted' } })
    expect(contacted.status(), await contacted.text()).toBe(200)
    const after = ((await contacted.json()) as { doc: { status: string; statusHistory: { status: string }[] } }).doc
    expect(after.status).toBe('contacted')
    expect(after.statusHistory.map((h) => h.status)).toEqual(['new', 'contacted'])

    // Submitted evidence cannot be rewritten (field-level update access is closed).
    const tamper = await request.patch(api(`/inquiries/${doc.id}`), { headers: sales, data: { name: 'تم التعديل', phone: '+201000000000' } })
    expect(tamper.status()).toBeLessThan(500)
    const reread = (await findInquiries(request, { reference }))[0]!
    expect(reread.name).toBe(name)
    expect(reread.phone).toBe(doc.phone)

    const closed = await request.patch(api(`/inquiries/${doc.id}`), { headers: sales, data: { status: 'closed' } })
    expect(closed.status()).toBe(200)
    const reopen = await request.patch(api(`/inquiries/${doc.id}`), { headers: sales, data: { status: 'new' } })
    expect(reopen.status()).toBe(400)
    expect(await reopen.text()).toMatch(/Invalid status change/i)
    expect((await findInquiries(request, { reference }))[0]!.status).toBe('closed')

    // Sales cannot delete leads; only admins can (afterAll cleans up).
    expect((await request.delete(api(`/inquiries/${doc.id}`), { headers: sales })).status()).toBe(403)
  })

  test('REST create is closed to everyone (public submissions go through the server action only)', async ({ request }) => {
    const data = { reference: 'SHR-ZZZZZZ', type: 'general', name: `rest ${RUN}`, phone: '+201012345678' }
    expect((await request.post(api('/inquiries'), { data })).status()).toBe(403)
    expect((await request.post(api('/inquiries'), { data, headers: await authHeaders(request, 'admin') })).status()).toBe(403)
  })

  test('anonymous visitors cannot read inquiries or users', async ({ request }) => {
    const inquiries = await request.get(api('/inquiries'))
    expect([401, 403]).toContain(inquiries.status())
    const users = await request.get(api('/users'))
    expect([401, 403]).toContain(users.status())
    expect(await users.text()).not.toContain('@e2e.test')
  })
})

test.describe('public product API', () => {
  test('anonymous GET /api/products returns only approved + published records, never the draft fixture', async ({ request }) => {
    const res = await request.get(api('/products?depth=0&limit=100'))
    expect(res.status()).toBe(200)
    const { docs } = (await res.json()) as { docs: Record<string, unknown>[] }
    expect(docs.length).toBeGreaterThan(0)
    for (const doc of docs) {
      expect(doc.approvalStatus, String(doc.slug)).toBe('approved')
      expect(doc.isPublished, String(doc.slug)).toBe(true)
      // Staff-only fields never leak to the public.
      for (const field of ['internalNotes', 'sourceEvidence', 'approvalEvidence']) expect(doc).not.toHaveProperty(field)
    }
    expect(docs.map((d) => d.slug)).not.toContain('fixture-draft-delta')

    const bySlug = await request.get(api('/products?depth=0&where[slug][equals]=fixture-draft-delta'))
    expect(((await bySlug.json()) as { totalDocs: number }).totalDocs).toBe(0)

    // Even by id the draft stays hidden.
    const staff = await request.get(api('/products?depth=0&where[slug][equals]=fixture-draft-delta'), {
      headers: await authHeaders(request, 'admin'),
    })
    const draftId = ((await staff.json()) as { docs: { id: number }[] }).docs[0]?.id
    expect(draftId, 'draft fixture exists for staff').toBeTruthy()
    expect([403, 404]).toContain((await request.get(api(`/products/${draftId}`))).status())
  })
})
