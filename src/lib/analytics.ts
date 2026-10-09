/**
 * Privacy-first analytics adapter (spec §12.4).
 * No provider or ID has been supplied, so every call is a safe no-op. When a provider is approved,
 * implement `send` below behind the consent check — never pass PII, phone numbers, messages or
 * medical notes as event properties.
 */
export type AnalyticsEvent =
  | 'hero_cta_click'
  | 'contact_open'
  | 'form_submit_success'
  | 'form_submit_error'
  | 'product_filter'
  | 'product_search'
  | 'product_view'
  | 'product_inquiry_start'
  | 'language_toggle'

type Props = Record<string, string | number | boolean | undefined>

const ALLOWED_KEYS = new Set(['from', 'to', 'location', 'category', 'segment', 'kind', 'page', 'slug', 'source', 'results'])

const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER // e.g. 'plausible' | 'ga4' (not configured)

function hasConsent(): boolean {
  try {
    return typeof window !== 'undefined' && window.localStorage.getItem('alshorouk-consent') === 'granted'
  } catch {
    return false
  }
}

export function trackEvent(event: AnalyticsEvent, props: Props = {}): void {
  if (!provider || typeof window === 'undefined' || !hasConsent()) return
  const safe: Props = {}
  for (const [key, value] of Object.entries(props)) {
    if (ALLOWED_KEYS.has(key) && value !== undefined) safe[key] = value
  }
  send(event, safe)
}

function send(event: AnalyticsEvent, props: Props): void {
  // Intentionally empty until an approved provider + consent strategy exists (docs/open-items.md).
  if (process.env.NODE_ENV === 'development') console.debug('[analytics]', event, props)
}

export const analyticsEnabled = Boolean(provider)
