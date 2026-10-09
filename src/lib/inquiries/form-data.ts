/**
 * FormData → schema input, shared by the client (pre-validation) and the server action (authoritative).
 * Pure module. Unknown keys are ignored; empty strings become `undefined` so optional fields stay optional.
 */
export const INQUIRY_TEXT_FIELDS = [
  'type',
  'name',
  'phone',
  'email',
  'organization',
  'role',
  'governorate',
  'segment',
  'birdCapacity',
  'productCategory',
  'productLabel',
  'productLine',
  'quantity',
  'message',
  'locale',
  'sourcePath',
  'idempotencyKey',
  'website',
] as const

/** Generous transport bounds: the schema maxima total ≈ 3.3 KB of text; anything far beyond is tampering. */
export const PAYLOAD_LIMITS = { maxEntries: 48, maxChars: 16_000 } as const

type FormDataLike = Pick<FormData, 'get' | 'entries'>

export function formDataToInput(fd: FormDataLike): Record<string, unknown> {
  const input: Record<string, unknown> = {}
  for (const key of INQUIRY_TEXT_FIELDS) {
    const value = fd.get(key)
    // The honeypot keeps its raw value (even whitespace) so the server can detect it.
    if (key === 'website') {
      if (typeof value === 'string' && value.length > 0) input.website = value
      continue
    }
    if (typeof value === 'string' && value.trim() !== '') input[key] = value
  }
  const productId = fd.get('productId')
  if (typeof productId === 'string' && /^\d{1,9}$/.test(productId.trim())) input.productId = Number(productId.trim())
  const consent = fd.get('consent')
  if (typeof consent === 'string' && consent !== '' && consent !== 'false') input.consent = true
  return input
}

/** Rejects oversized or non-text submissions before any parsing (request-size bound, spec §11.4). */
export function isWithinPayloadLimits(fd: FormDataLike): boolean {
  let entries = 0
  let chars = 0
  for (const [key, value] of fd.entries()) {
    entries += 1
    if (typeof value !== 'string') return false // no file uploads on inquiry forms
    // React/Next add $ACTION_* bookkeeping fields for no-JS submissions; they count towards the bound too.
    chars += key.length + value.length
    if (entries > PAYLOAD_LIMITS.maxEntries || chars > PAYLOAD_LIMITS.maxChars) return false
  }
  return true
}

export const isHoneypotFilled = (fd: FormDataLike): boolean => {
  const value = fd.get('website')
  return typeof value === 'string' ? value.length > 0 : value != null
}
