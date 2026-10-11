import { expect, type APIRequestContext, type Locator, type Page } from '@playwright/test'

/**
 * Shared helpers for the E2E suite (spec §16.1). Not a spec file (no `.spec.` in the name).
 *
 * Every record a test creates carries a per-file run tag in its `name` (inquiries) or `slug` (products),
 * so `cleanupInquiries(tag)` can remove exactly what the file created — and nothing else.
 */
export const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3200'
/** Dev server with the real (empty) development database — read-only checks only, never writes. */
export const DEV_URL = process.env.E2E_DEV_URL ?? 'http://localhost:3100'

/** Staff accounts that `pnpm seed:e2e` creates ONLY in the isolated fixture DB (src/scripts/seed.ts). */
export const STAFF = {
  admin: { email: 'admin@e2e.test', password: 'Admin-e2e-Password-1' },
  editor: { email: 'editor@e2e.test', password: 'Editor-e2e-Password-1' },
  sales: { email: 'sales@e2e.test', password: 'Sales-e2e-Password-1' },
} as const
export type StaffRole = keyof typeof STAFF

export const REFERENCE_PATTERN = /^SHR-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/

/** Arabic UI copy the tests rely on (src/i18n/dictionaries/ar/common.ts → forms, contact.ts → formUi). */
export const AR = {
  name: 'الاسم بالكامل',
  phone: 'رقم الهاتف',
  segment: 'نوع الإنتاج',
  message: 'تفاصيل طلبك',
  consent: /أوافق على أن تحفظ الشروق/,
  submit: 'أرسل طلبك',
  retry: 'حاول مرة أخرى',
  successTitle: 'تم استلام طلبك',
  another: 'إرسال طلب آخر',
  summaryTitle: 'لم يُرسَل النموذج. راجع الحقول التالية:',
  failureTitle: 'لم يُرسَل طلبك',
  errors: {
    required: 'هذا الحقل مطلوب.',
    invalidPhone: 'أدخل رقم هاتف صحيحًا',
    consentRequired: 'يُرجى الموافقة على استخدام بياناتك',
    rateLimited: 'أُرسلت عدة طلبات خلال وقت قصير',
    rateLimitedFull: 'أُرسلت عدة طلبات خلال وقت قصير. انتظر قليلًا ثم حاول مرة أخرى.',
    network: 'تعذّر الاتصال',
    networkFull: 'تعذّر الاتصال. تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى.',
    spam: 'تعذّر إرسال طلبك',
    spamFull: 'تعذّر إرسال طلبك. أعد تحميل الصفحة واكتب بياناتك يدويًا، ثم حاول مرة أخرى.',
  },
} as const

/** Unique per spec-file load (each project/worker loads its own copy). */
export const newRunTag = (prefix: string) => `E2E-${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** Valid Egyptian mobile (010 + 8 digits), random so the 10-minute duplicate window never merges tests. */
export const randomMobile = () => `010${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`

/**
 * The inquiry rate limiter keys on the client IP (5 / 10 min per IP; src/lib/inquiries/rate-limit.ts) and,
 * with INQUIRY_IP_HEADER unset, trusts `x-real-ip`. Every submitting test therefore presents its own
 * address from the benchmarking range 198.18.0.0/15 so tests (and re-runs) never share a bucket.
 * NOTE: this works only because the header is client-controlled in this configuration (open item
 * "Trusted client-IP header per host" in docs/open-items.md).
 */
let ipCounter = 0
export function uniqueClientIp(range: 18 | 19 = 18): string {
  const n = (Math.floor(Math.random() * 0xffff) + ++ipCounter * 7919) & 0xffff
  return `198.${range}.${n >> 8}.${n & 255}`
}
export async function useClientIp(page: Page, ip = uniqueClientIp()): Promise<string> {
  await page.setExtraHTTPHeaders({ 'x-real-ip': ip })
  return ip
}

// ── Payload REST ────────────────────────────────────────────────────────────────────────────────────
const tokens = new Map<StaffRole, string>()

export async function staffToken(request: APIRequestContext, role: StaffRole): Promise<string> {
  const cached = tokens.get(role)
  if (cached) return cached
  const res = await request.post(`${BASE_URL}/api/users/login`, { data: STAFF[role] })
  expect(res.status(), `login as ${role}`).toBe(200)
  const { token } = (await res.json()) as { token: string }
  expect(token, `token for ${role}`).toBeTruthy()
  tokens.set(role, token)
  return token
}

export async function authHeaders(request: APIRequestContext, role: StaffRole) {
  return { Authorization: `JWT ${await staffToken(request, role)}` }
}

export type InquiryDoc = {
  id: number
  reference: string
  type: string
  status: string
  name: string
  phone: string
  segment?: string | null
  sourcePath?: string | null
  productRef?: number | null
  productLabel?: string | null
  productCategory?: string | null
  locale?: string | null
  requestDetails?: string | null
}

type Op = 'equals' | 'contains' | 'like'

export async function findInquiries(
  request: APIRequestContext,
  where: Record<string, string | [Op, string]>,
  role: StaffRole = 'sales',
): Promise<InquiryDoc[]> {
  const params = new URLSearchParams({ depth: '0', limit: '100' })
  for (const [field, condition] of Object.entries(where)) {
    const [op, value] = Array.isArray(condition) ? condition : (['equals', condition] as const)
    params.set(`where[${field}][${op}]`, value)
  }
  const res = await request.get(`${BASE_URL}/api/inquiries?${params}`, { headers: await authHeaders(request, role) })
  expect(res.status(), `GET /api/inquiries as ${role}`).toBe(200)
  return ((await res.json()) as { docs: InquiryDoc[] }).docs
}

/** Polls briefly: the success panel appears only after persistence, but keep the check tolerant. */
export async function inquiryByReference(request: APIRequestContext, reference: string): Promise<InquiryDoc> {
  let docs: InquiryDoc[] = []
  await expect
    .poll(async () => (docs = await findInquiries(request, { reference })).length, { timeout: 10_000 })
    .toBe(1)
  return docs[0]!
}

/** Deletes every inquiry whose name contains the run tag (admin only — sales cannot delete). */
export async function cleanupInquiries(request: APIRequestContext, tag: string): Promise<number> {
  const docs = await findInquiries(request, { name: ['contains', tag] }, 'admin')
  const headers = await authHeaders(request, 'admin')
  for (const doc of docs) {
    const res = await request.delete(`${BASE_URL}/api/inquiries/${doc.id}`, { headers })
    expect(res.status(), `DELETE inquiry ${doc.reference}`).toBe(200)
  }
  return docs.length
}

export async function productIdBySlug(request: APIRequestContext, slug: string): Promise<number> {
  const res = await request.get(`${BASE_URL}/api/products?depth=0&where[slug][equals]=${encodeURIComponent(slug)}`)
  expect(res.status()).toBe(200)
  const { docs } = (await res.json()) as { docs: { id: number }[] }
  expect(docs, `public product ${slug}`).toHaveLength(1)
  return docs[0]!.id
}

// ── Inquiry form (the ONE form component used site-wide) ─────────────────────────────────────────────
/** Submit button in any of its states: idle, pending, or "try again" after a failure. */
export const SUBMIT_BUTTON_NAME = /أرسل طلبك|حاول مرة أخرى|جارٍ إرسال طلبك/

const pageOf = (scope: Page | Locator): Page => ('page' in scope ? (scope as Locator).page() : (scope as Page))

/** The inquiry form inside `scope` — identified by its submit button, not by CSS. */
export const inquiryForm = (scope: Page | Locator) =>
  scope.locator('form').filter({ has: pageOf(scope).getByRole('button', { name: SUBMIT_BUTTON_NAME }) })

export async function fillInquiry(
  form: Locator,
  data: { name?: string; phone?: string; segment?: string; message?: string; consent?: boolean },
) {
  if (data.name !== undefined) await form.getByLabel(AR.name).fill(data.name)
  if (data.phone !== undefined) await form.getByLabel(AR.phone).fill(data.phone)
  if (data.segment !== undefined) await form.getByLabel(AR.segment).selectOption(data.segment)
  if (data.message !== undefined) await form.getByLabel(AR.message).fill(data.message)
  if (data.consent) await form.getByRole('checkbox', { name: AR.consent }).check()
}

/** Waits for the success panel and returns the reference it shows. */
export async function expectSuccess(scope: Page | Locator): Promise<string> {
  await expect(scope.getByRole('heading', { name: AR.successTitle })).toBeVisible({ timeout: 20_000 })
  const ref = scope.locator('[data-inquiry-reference]')
  await expect(ref).toHaveText(REFERENCE_PATTERN)
  return (await ref.innerText()).trim()
}

/** Waits until React has hydrated the form (the client sets noValidate once enhanced). */
export async function waitForHydratedForm(form: Locator) {
  await expect(form).toHaveAttribute('novalidate', '')
}

/** Scrolls through the whole page in viewport steps so scroll-driven scenes run, ending at the footer. */
export async function scrollToBottom(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8))
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
  })
}
