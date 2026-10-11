import { randomUUID } from 'node:crypto'
import { expect, request as playwrightRequest, test, type APIRequestContext, type Page, type Route } from '@playwright/test'

/**
 * Spec §11.4 + §16.4 security checks, run against the PRODUCTION fixture build (:3200, data/e2e.db).
 * Evidence + findings: docs/evidence/security-review.md.
 *
 * Isolation rules (shared fixture server):
 *  - Inquiry submissions carry their own `cf-connecting-ip` so they never consume the localhost rate-limit
 *    bucket the forms journeys rely on. (The limiter trusts that header by default — finding SEC-01 in the
 *    evidence doc. If that trust is removed, each run costs one slot of the localhost bucket.)
 *  - Every record this file creates is marked with a unique `SECTEST-…` token and deleted afterwards.
 *  - Lockout is exercised on a throwaway account created and deleted by the admin — never on shared staff.
 */

const ADMIN = { email: 'admin@e2e.test', password: 'Admin-e2e-Password-1' }
const REFERENCE = /^SHR-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/
const AR_SPAM_ERROR = 'تعذّر إرسال طلبك'
const AR_FAILURE_TITLE = 'لم يُرسَل طلبك'

const marker = () => `SECTEST-${randomUUID().slice(0, 8)}`
const fakeClientIp = () => `198.51.100.${Math.floor(Math.random() * 250) + 2}`

async function apiAs(baseURL: string | undefined, credentials = ADMIN): Promise<{ api: APIRequestContext; token: string }> {
  const api = await playwrightRequest.newContext({ baseURL })
  const res = await api.post('/api/users/login', { data: credentials })
  expect(res.ok(), `login ${credentials.email}`).toBeTruthy()
  const { token } = (await res.json()) as { token: string }
  return { api, token }
}

async function inquiriesMatching(api: APIRequestContext, token: string, token_: string) {
  const res = await api.get('/api/inquiries', {
    params: { 'where[requestDetails][like]': token_, depth: '0', limit: '100' },
    headers: { Authorization: `JWT ${token}` },
  })
  expect(res.ok()).toBeTruthy()
  return ((await res.json()) as { docs: { id: number; reference: string; name: string; requestDetails: string }[] }).docs
}

async function deleteInquiries(api: APIRequestContext, token: string, ids: number[]) {
  for (const id of ids) {
    await api.delete(`/api/inquiries/${id}`, { headers: { Authorization: `JWT ${token}` } })
  }
}

/** Opens the general contact form and waits for hydration (the JS path calls the server action via fetch). */
async function openGeneralForm(page: Page) {
  await page.goto('/ar/contact?type=general')
  const form = page.locator('form:has(input[name="phone"])').first()
  await expect(form).toBeVisible()
  await page.waitForFunction(() => {
    const el = document.querySelector('form input[name="phone"]')?.closest('form')
    return Boolean(el && Object.keys(el).some((k) => k.startsWith('__reactProps')))
  })
  return form
}

async function fillGeneral(page: Page, { name, message }: { name: string; message: string }) {
  const form = await openGeneralForm(page)
  await form.locator('input[name="name"]').fill(name)
  await form.locator('input[name="phone"]').fill('01012345678')
  await form.locator('textarea[name="message"]').fill(message)
  await form.locator('input[name="consent"]').check()
  return form
}

/** Intercepts the first server-action POST and lets the test rewrite it (headers/body) before it reaches the server. */
async function interceptActionOnce(
  page: Page,
  rewrite: (route: Route, headers: Record<string, string>) => Promise<{ headers?: Record<string, string>; postData?: Buffer }>,
): Promise<{ status: () => number | undefined }> {
  let status: number | undefined
  let handled = false
  await page.route(
    (url) => url.pathname.startsWith('/ar/contact'),
    async (route) => {
      const req = route.request()
      if (handled || req.method() !== 'POST') return route.fallback()
      handled = true
      const headers = { ...(await req.allHeaders()) }
      delete headers['content-length'] // recomputed for the rewritten body
      const change = await rewrite(route, headers)
      const response = await route.fetch({ headers: change.headers ?? headers, postData: change.postData ?? req.postDataBuffer() ?? undefined })
      status = response.status()
      await route.fulfill({ response })
    },
  )
  return { status: () => status }
}

/**
 * Adds an extra multipart field of `size` bytes INSIDE the action's FormData. React encodes a FormData
 * argument as `_<n>_<field>` entries (observed: `_1_phone`) followed by the root part `0` (`[null,"$K1"]`);
 * the FormData is assembled when the root part arrives, so the padding must precede it and carry the prefix.
 */
function withPadding(route: Route, size: number): Buffer {
  const req = route.request()
  const contentType = req.headers()['content-type'] ?? ''
  const boundary = /boundary=([^;]+)/.exec(contentType)?.[1]
  const body = req.postDataBuffer()
  if (!boundary || !body) throw new Error(`unexpected action request: ${contentType}`)
  const prefix = /name="(_?\d+_)phone"/.exec(body.toString('utf8'))?.[1]
  if (!prefix) throw new Error('could not find the FormData prefix in the action body')
  const at = body.indexOf(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="0"`))
  if (at < 0) throw new Error('could not find the root part of the action body')
  const extra = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${prefix}padding"\r\n\r\n${'x'.repeat(size)}\r\n`)
  return Buffer.concat([body.subarray(0, at), extra, body.subarray(at)])
}

test.describe('response headers', () => {
  const expected: [string, RegExp][] = [
    ['content-security-policy', /default-src 'self'.*object-src 'none'.*base-uri 'self'.*form-action 'self'.*frame-ancestors 'self'/],
    ['x-content-type-options', /^nosniff$/],
    ['x-frame-options', /^SAMEORIGIN$/],
    ['referrer-policy', /^strict-origin-when-cross-origin$/],
    ['permissions-policy', /camera=\(\).*microphone=\(\).*geolocation=\(\)/],
    ['cross-origin-opener-policy', /^same-origin$/],
    ['strict-transport-security', /max-age=\d{7,}/],
  ]

  test('HTML, API, admin and static assets all carry the security headers', async ({ request }) => {
    const html = await (await request.get('/ar')).text()
    const asset = /\/_next\/static\/[^"']+\.js/.exec(html)?.[0]
    expect(asset, 'a static chunk is referenced from /ar').toBeTruthy()
    for (const path of ['/ar', '/en/products', '/api/products', '/admin/login', '/robots.txt', asset!]) {
      const res = await request.get(path)
      expect(res.status(), path).toBeLessThan(400)
      const headers = res.headers()
      for (const [name, value] of expected) expect(headers[name], `${path} ${name}`).toMatch(value)
      expect(headers['x-powered-by'], `${path} x-powered-by`).toBeUndefined()
    }
  })

  test('upgrade-insecure-requests only on an https origin (Safari loads no CSS/JS over plain HTTP otherwise)', async ({ request, baseURL }) => {
    const csp = (await request.get('/ar')).headers()['content-security-policy'] ?? ''
    if (baseURL?.startsWith('https://')) expect(csp).toContain('upgrade-insecure-requests')
    else expect(csp).not.toContain('upgrade-insecure-requests')
  })

  test('cross-origin API reads are not granted by CORS', async ({ request }) => {
    const res = await request.get('/api/products', { headers: { Origin: 'https://evil.example' } })
    const allow = res.headers()['access-control-allow-origin']
    expect(allow === undefined || (allow !== '*' && !allow.includes('evil.example'))).toBeTruthy()
  })
})

test.describe('CMS / API surface', () => {
  test('admin is noindex and staging robots.txt disallows everything', async ({ request }) => {
    const admin = await (await request.get('/admin/login')).text()
    expect(admin).toMatch(/<meta name="robots" content="noindex, nofollow"\s*\/?>/)
    expect(await (await request.get('/robots.txt')).text()).toMatch(/Disallow: \/\s/)
  })

  test('GraphQL is disabled', async ({ request }) => {
    expect((await request.get('/api/graphql')).status()).toBe(404)
    expect((await request.post('/api/graphql', { data: { query: '{__typename}' } })).status()).toBe(404)
    expect((await request.get('/api/graphql-playground')).status()).toBe(404)
  })

  test('anonymous REST cannot read leads, staff, approvals or version history', async ({ request }) => {
    for (const path of ['inquiries', 'users', 'content-approvals', 'products/versions', 'articles/versions', 'faqs/versions']) {
      expect((await request.get(`/api/${path}`)).status(), path).toBe(403)
    }
    expect(await (await request.get('/api/users/me')).json()).toMatchObject({ user: null })
  })

  test('anonymous REST never returns unapproved products or staff-only fields', async ({ request, baseURL }) => {
    for (const query of [
      'where[approvalStatus][equals]=review_required',
      'where[slug][equals]=fixture-draft-delta',
      'where[isPublished][equals]=false',
      'where[approvalStatus][not_equals]=approved',
    ]) {
      const body = (await (await request.get(`/api/products?${query}&depth=0`)).json()) as { totalDocs: number }
      expect(body.totalDocs, query).toBe(0)
    }

    const { api, token } = await apiAs(baseURL)
    const staff = (await (await api.get('/api/products?where[slug][equals]=fixture-draft-delta&depth=0', { headers: { Authorization: `JWT ${token}` } })).json()) as {
      docs: { id: number }[]
    }
    expect(staff.docs.length, 'the draft fixture exists for staff').toBe(1)
    expect([403, 404]).toContain((await request.get(`/api/products/${staff.docs[0]!.id}`)).status())
    await api.dispose()

    const list = (await (await request.get('/api/products?depth=2&limit=100')).json()) as { docs: Record<string, unknown>[] }
    expect(list.docs.length).toBeGreaterThan(0)
    for (const doc of list.docs) {
      expect(doc.approvalStatus).toBe('approved')
      expect(doc.isPublished).toBe(true)
      for (const field of ['sourceEvidence', 'internalNotes', 'approvalEvidence']) expect(doc, `${doc.slug} ${field}`).not.toHaveProperty(field)
    }
    // Staff-only fields cannot be used as a filter/sort oracle either.
    for (const query of ['where[internalNotes][exists]=true', 'where[sourceEvidence][like]=a', 'where[approvalEvidence][exists]=true', 'sort=internalNotes']) {
      expect((await request.get(`/api/products?${query}`)).status(), query).toBe(400)
    }
  })

  test('unverified contact channels are not exposed by the public settings API', async ({ request }) => {
    const settings = (await (await request.get('/api/globals/site-settings?depth=0')).json()) as Record<string, { verified?: boolean; value?: unknown }>
    for (const channel of ['phone', 'whatsapp', 'email', 'address']) {
      if (settings[channel]?.verified !== true) expect(settings[channel], channel).not.toHaveProperty('value')
    }
  })
})

test.describe('inquiry server action abuse', () => {
  test.describe.configure({ mode: 'serial' })
  test.use({ extraHTTPHeaders: { 'cf-connecting-ip': fakeClientIp() } })

  const created: number[] = []
  test.afterAll(async ({ baseURL }) => {
    // Remove this file's records — including leftovers of an interrupted earlier run (all carry SECTEST-).
    const { api, token } = await apiAs(baseURL)
    const leftovers = (await inquiriesMatching(api, token, 'SECTEST-')).map((d) => d.id)
    await deleteInquiries(api, token, [...new Set([...created, ...leftovers])])
    await api.dispose()
  })

  test('script tags are stored as inert text and only the reference is echoed back', async ({ page, baseURL }) => {
    const token = marker()
    const name = `<img src=x onerror="window.__xss=1">Sec ${token}`
    const message = `${token} <script>window.__xss=2</script><svg onload="window.__xss=3"></svg> "quotes" & 'amps'`
    const dialogs: string[] = []
    page.on('dialog', (d) => {
      dialogs.push(d.message())
      void d.dismiss()
    })
    const form = await fillGeneral(page, { name, message })
    await form.locator('button[type="submit"]').click()
    const reference = page.locator('[data-inquiry-reference]')
    await expect(reference).toHaveText(REFERENCE)
    await expect(page.locator('main')).not.toContainText(token) // the success panel never echoes submitted text
    expect(await page.evaluate(() => (window as { __xss?: number }).__xss)).toBeUndefined()

    const { api, token: jwt } = await apiAs(baseURL)
    const docs = await inquiriesMatching(api, jwt, token)
    expect(docs).toHaveLength(1)
    const record = docs[0]!
    created.push(record.id)
    expect(record.reference).toBe((await reference.textContent())?.trim())
    expect(record.requestDetails).toBe(message) // stored verbatim, not stripped or HTML-encoded
    expect(record.name).toBe(name)

    // The only place the text is ever rendered is the authenticated admin — as text.
    const login = await page.request.post('/api/users/login', { data: ADMIN })
    expect(login.ok()).toBeTruthy()
    await page.goto(`/admin/collections/inquiries/${record.id}`)
    await expect
      .poll(
        () =>
          page
            .locator('textarea')
            .evaluateAll((els, t) => els.map((e) => (e as HTMLTextAreaElement).value).find((v) => v.includes(t)) ?? null, token),
        { timeout: 30_000 },
      )
      .toBe(message)
    expect(await page.evaluate(() => (window as { __xss?: number }).__xss)).toBeUndefined()
    await page.goto('/admin/collections/inquiries')
    await expect(page.getByText(token).first()).toBeVisible({ timeout: 30_000 }) // list view renders the name as text
    expect(await page.evaluate(() => (window as { __xss?: number }).__xss)).toBeUndefined()
    expect(dialogs).toEqual([])
    await api.dispose()
  })

  test('a filled honeypot is refused with a recoverable error and nothing is stored', async ({ page, baseURL }) => {
    const token = marker()
    const form = await fillGeneral(page, { name: 'Honeypot Bot', message: `${token} honeypot` })
    await form.locator('input[name="website"]').fill('https://spam.example', { force: true })
    await form.locator('button[type="submit"]').click()
    await expect(page.getByText(AR_FAILURE_TITLE, { exact: true })).toBeVisible()
    await expect(page.locator('p:not([role="status"])').filter({ hasText: AR_SPAM_ERROR })).toBeVisible()
    await expect(page.locator('[data-inquiry-reference]')).toHaveCount(0)
    const { api, token: jwt } = await apiAs(baseURL)
    expect(await inquiriesMatching(api, jwt, token)).toHaveLength(0)
    await api.dispose()
  })

  test('a foreign Origin on the action POST is rejected by the framework (CSRF)', async ({ page, baseURL }) => {
    const token = marker()
    const form = await fillGeneral(page, { name: 'Origin Test', message: `${token} origin` })
    const action = await interceptActionOnce(page, async (_route, headers) => ({ headers: { ...headers, origin: 'https://evil.example' } }))
    await form.locator('button[type="submit"]').click()
    await expect(page.getByText(AR_FAILURE_TITLE, { exact: true })).toBeVisible()
    await expect(page.locator('[data-inquiry-reference]')).toHaveCount(0)
    expect(action.status()).toBeGreaterThanOrEqual(400)
    const { api, token: jwt } = await apiAs(baseURL)
    expect(await inquiriesMatching(api, jwt, token)).toHaveLength(0)
    await api.dispose()
  })

  for (const [label, size, expectStatus] of [
    ['above the app bound (20 KB) → app refuses', 20_000, 200],
    ['above the 64 KB framework limit (70 KB) → framework refuses', 70_000, 413],
  ] as const) {
    test(`oversized body ${label}; never a fake success`, async ({ page, baseURL }) => {
      const token = marker()
      const form = await fillGeneral(page, { name: 'Size Test', message: `${token} size` })
      const action = await interceptActionOnce(page, async (route) => ({ postData: withPadding(route, size) }))
      await form.locator('button[type="submit"]').click()
      await expect(page.getByText(AR_FAILURE_TITLE, { exact: true })).toBeVisible()
      await expect(page.locator('[data-inquiry-reference]')).toHaveCount(0)
      if (expectStatus === 413) expect(action.status()).toBeGreaterThanOrEqual(400)
      const { api, token: jwt } = await apiAs(baseURL)
      expect(await inquiriesMatching(api, jwt, token)).toHaveLength(0)
      await api.dispose()
    })
  }
})

test.describe('staff authentication', () => {
  test('five failed logins lock a (throwaway) account; other staff are unaffected', async ({ baseURL }) => {
    const { api, token } = await apiAs(baseURL)
    const auth = { Authorization: `JWT ${token}` }
    const email = `lockout-${randomUUID().slice(0, 8)}@e2e.test`
    const password = `Throwaway-${randomUUID()}`
    const created = await api.post('/api/users', { data: { email, password, role: 'sales', name: 'Lockout throwaway' }, headers: auth })
    expect(created.ok(), await created.text()).toBeTruthy()
    const userId = ((await created.json()) as { doc: { id: number } }).doc.id
    const anon = await playwrightRequest.newContext({ baseURL })
    try {
      for (let i = 0; i < 5; i += 1) {
        const res = await anon.post('/api/users/login', { data: { email, password: 'wrong-password' } })
        expect(res.ok(), `wrong attempt ${i + 1}`).toBeFalsy()
      }
      const locked = await anon.post('/api/users/login', { data: { email, password } })
      expect(locked.ok(), 'correct password after 5 failures must be refused while locked').toBeFalsy()
      expect(await locked.text()).not.toContain('"token"')
      // Lockout is per account: the admin can still sign in.
      expect((await anon.post('/api/users/login', { data: ADMIN })).ok()).toBeTruthy()
    } finally {
      expect((await api.delete(`/api/users/${userId}`, { headers: auth })).ok()).toBeTruthy()
      await anon.dispose()
      await api.dispose()
    }
  })

  test('only an admin can create staff accounts', async ({ request, baseURL }) => {
    const body = { email: `nope-${randomUUID().slice(0, 8)}@e2e.test`, password: 'Nope-password-123', role: 'admin' }
    expect((await request.post('/api/users', { data: body })).status()).toBe(403)
    expect((await request.post('/api/users/first-register', { data: body })).ok()).toBeFalsy()
    const { api, token } = await apiAs(baseURL, { email: 'editor@e2e.test', password: 'Editor-e2e-Password-1' })
    expect((await api.post('/api/users', { data: body, headers: { Authorization: `JWT ${token}` } })).ok()).toBeFalsy()
    await api.dispose()
  })
})
