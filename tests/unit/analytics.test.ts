// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/** The provider is read when the module loads, so each case imports a fresh copy. */
async function load(provider?: string) {
  vi.resetModules()
  if (provider) vi.stubEnv('NEXT_PUBLIC_ANALYTICS_PROVIDER', provider)
  return import('@/lib/analytics')
}

describe('analytics adapter (spec §12.4: no provider and no consent → nothing is sent)', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development') // `send` only logs in development; that log is the observable call
    window.localStorage.clear()
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('is a no-op without a configured provider, even with consent', async () => {
    window.localStorage.setItem('alshorouk-consent', 'granted')
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const { trackEvent, analyticsEnabled } = await load()
    trackEvent('contact_open', { location: 'header' })
    expect(analyticsEnabled).toBe(false)
    expect(debug).not.toHaveBeenCalled()
  })

  it('sends nothing until the visitor has granted consent', async () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const { trackEvent } = await load('plausible')
    trackEvent('contact_open', { location: 'header' })
    window.localStorage.setItem('alshorouk-consent', 'denied')
    trackEvent('contact_open', { location: 'header' })
    expect(debug).not.toHaveBeenCalled()
  })

  it('passes only allow-listed properties, never personal data', async () => {
    window.localStorage.setItem('alshorouk-consent', 'granted')
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const { trackEvent } = await load('plausible')
    const leaky = { kind: 'farm', segment: 'layers', phone: '+201000000000', name: 'Test', message: 'hello', email: 'a@b.c' }
    trackEvent('form_submit_success', leaky as Parameters<typeof trackEvent>[1])
    expect(debug).toHaveBeenCalledTimes(1)
    expect(debug).toHaveBeenCalledWith('[analytics]', 'form_submit_success', { kind: 'farm', segment: 'layers' })
  })
})
