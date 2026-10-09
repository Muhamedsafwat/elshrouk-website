'use server'

import { randomUUID } from 'node:crypto'
import { headers } from 'next/headers'
import { formDataToInput, isHoneypotFilled, isWithinPayloadLimits } from './form-data'
import { persistInquiry } from './persist'
import { getPublicProductContext } from './product-context'
import { clientIpFrom, createRateLimiter, hashClientKey, INQUIRY_RATE_RULES, MemoryRateLimitStore } from './rate-limit'
import { fieldErrors, inquirySchema, isInquiryKind, type InquiryResult } from './schema'

/**
 * The ONE server action behind every inquiry form (spec §4.3, §10.3, §11).
 *
 * Order: size bound → honeypot → per-client rate limit → schema (authoritative re-validation) → public
 * product check → idempotent persistence → `{ ok: true, reference }` only after the record is stored.
 *
 * CSRF: Next.js Server Actions only accept POSTs whose Origin matches the Host (or x-forwarded-host /
 * `serverActions.allowedOrigins`), so no extra origin check is duplicated here. NEXT_PUBLIC_SITE_URL is
 * deliberately NOT used for this (it is inlined at build time). Request size: Next's serverActions
 * bodySizeLimit (proposed 64kb in next.config) plus `isWithinPayloadLimits` below.
 *
 * Logging: reference, type, locale and outcome only — never names, phones, e-mails, messages or IPs.
 */

type LimiterGlobal = typeof globalThis & {
  __inquiryLimiter?: ReturnType<typeof createRateLimiter>
  __inquiryLimiterUnknownIp?: ReturnType<typeof createRateLimiter>
}
const g = globalThis as LimiterGlobal
// globalThis keeps the in-memory windows across dev HMR reloads (single-instance store — see rate-limit.ts).
const limiter = (g.__inquiryLimiter ??= createRateLimiter({ rules: INQUIRY_RATE_RULES, store: new MemoryRateLimitStore() }))
// When no client IP header exists every visitor shares one bucket: be generous instead of blocking all leads.
const unknownIpLimiter = (g.__inquiryLimiterUnknownIp ??= createRateLimiter({
  rules: [{ limit: 60, windowMs: 10 * 60_000 }],
  store: new MemoryRateLimitStore(),
}))

const log = (outcome: string, meta: { type?: string; locale?: string; reference?: string } = {}) => {
  const parts = [`outcome=${outcome}`]
  if (meta.reference) parts.push(`ref=${meta.reference}`)
  if (meta.type) parts.push(`type=${meta.type}`)
  if (meta.locale) parts.push(`locale=${meta.locale}`)
  console.info(`[inquiry] ${parts.join(' ')}`)
}

export async function submitInquiry(_previous: InquiryResult | null, formData: FormData): Promise<InquiryResult> {
  const rawType = formData instanceof FormData ? formData.get('type') : null
  const type = isInquiryKind(rawType) ? rawType : undefined
  const rawLocale = formData instanceof FormData ? formData.get('locale') : null
  const locale = rawLocale === 'ar' || rawLocale === 'en' ? rawLocale : undefined

  try {
    if (!(formData instanceof FormData) || !isWithinPayloadLimits(formData)) {
      log('rejected_size', { type, locale })
      return { ok: false, error: 'spam' }
    }
    // Honeypot: a neutral, recoverable error — never a fake success (autofill can hit honeypots too).
    if (isHoneypotFilled(formData)) {
      log('rejected_honeypot', { type, locale })
      return { ok: false, error: 'spam' }
    }

    const ip = clientIpFrom(await headers())
    const decision = (ip === 'unknown' ? unknownIpLimiter : limiter).check(hashClientKey(ip))
    if (!decision.ok) {
      log('rate_limited', { type, locale })
      return { ok: false, error: 'rateLimited' }
    }

    const input = formDataToInput(formData)
    // No-JS submissions cannot mint a key in the browser; the duplicate window still protects them.
    if (!input.idempotencyKey) input.idempotencyKey = randomUUID()
    const parsed = inquirySchema.safeParse(input)
    if (!parsed.success) {
      log('invalid', { type, locale })
      return { ok: false, error: 'validation', fields: fieldErrors(parsed.error) }
    }
    const data = parsed.data

    // Trusted product context: only a PUBLIC product keeps its relation; otherwise the label stays plain text.
    let productRef: number | undefined
    let productLabel = data.productLabel
    if (data.productId) {
      const product = await getPublicProductContext(data.productId, data.locale)
      if (product) {
        productRef = product.id
        productLabel = product.label
      }
    }

    const { reference, existing } = await persistInquiry(data, { productRef, productLabel })
    log(existing ? 'duplicate_returned' : 'stored', { reference, type: data.type, locale: data.locale })
    return { ok: true, reference }
  } catch (error) {
    // Error names only: driver messages can echo submitted values.
    log(`server_error:${error instanceof Error ? error.name : 'unknown'}`, { type, locale })
    return { ok: false, error: 'server' }
  }
}
