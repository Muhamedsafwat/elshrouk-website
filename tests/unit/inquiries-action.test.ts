import { beforeEach, describe, expect, it, vi } from 'vitest'

// The action's server-only collaborators: request headers, persistence and the product lookup.
const state = vi.hoisted(() => ({ ip: '203.0.113.10', persisted: 0 }))
vi.mock('next/headers', () => ({ headers: async () => new Headers({ 'x-real-ip': state.ip }) }))
vi.mock('@/lib/inquiries/persist', () => ({
  persistInquiry: vi.fn(async () => {
    state.persisted += 1
    return { reference: 'SHR-ABCDEF', existing: false }
  }),
}))
vi.mock('@/lib/inquiries/product-context', () => ({ getPublicProductContext: vi.fn(async () => null) }))

const { submitInquiry } = await import('@/lib/inquiries/action')

let ipCounter = 0
const formData = (entries: Record<string, string>) => {
  const fd = new FormData()
  for (const [key, value] of Object.entries(entries)) fd.append(key, value)
  return fd
}
const context = { locale: 'ar', sourcePath: '/ar/contact', idempotencyKey: '3f1c2a9e-8b7d-4c6e-9f10-2a3b4c5d6e7f' }
const validFarm = () =>
  formData({ ...context, type: 'farm', name: 'محمد علي', phone: '01012345678', segment: 'broilers', consent: 'yes' })

describe('submitInquiry (server action)', () => {
  beforeEach(() => {
    ipCounter += 1
    state.ip = `203.0.113.${ipCounter}` // a fresh rate-limit bucket per test
    state.persisted = 0
    vi.spyOn(console, 'info').mockImplementation(() => {})
  })

  it('returns the COMPLETE list of required fields for an empty submission (E2E-F1)', async () => {
    const result = await submitInquiry(null, formData({ ...context, type: 'partner' }))
    expect(result).toMatchObject({ ok: false, error: 'validation' })
    if (result.ok || result.error !== 'validation') return
    expect(Object.keys(result.fields).sort()).toEqual(
      ['consent', 'message', 'name', 'organization', 'phone', 'productLine', 'role'].sort(),
    )
    expect(state.persisted).toBe(0)
  })

  it('accepts a product inquiry with only name, phone and consent (E2E-F2)', async () => {
    const result = await submitInquiry(
      null,
      formData({ ...context, type: 'product', name: 'محمد علي', phone: '01012345678', consent: 'yes' }),
    )
    expect(result).toEqual({ ok: true, reference: 'SHR-ABCDEF' })
    expect(state.persisted).toBe(1)
  })

  it('spends rate-limit slots only on valid submissions (SEC-08)', async () => {
    // Ten mistakes in a row (no-JS visitor) must not lock the visitor out...
    for (let i = 0; i < 10; i += 1) {
      expect(await submitInquiry(null, formData({ ...context, type: 'farm', name: 'م' }))).toMatchObject({ error: 'validation' })
    }
    // ...so the 5 valid submissions per 10 minutes are all still available, and the 6th is refused.
    for (let i = 0; i < 5; i += 1) expect(await submitInquiry(null, validFarm())).toMatchObject({ ok: true })
    expect(await submitInquiry(null, validFarm())).toEqual({ ok: false, error: 'rateLimited' })
    expect(state.persisted).toBe(5)
  })

  it('a filled honeypot is refused without storing anything and without spending a slot', async () => {
    for (let i = 0; i < 8; i += 1) {
      const trap = validFarm()
      trap.set('website', 'https://spam.example')
      expect(await submitInquiry(null, trap)).toEqual({ ok: false, error: 'spam' })
    }
    expect(state.persisted).toBe(0)
    expect(await submitInquiry(null, validFarm())).toMatchObject({ ok: true })
  })
})
