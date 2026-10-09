import { z } from 'zod'
import { toWesternDigits } from '@/lib/search/normalize'

/**
 * Shared inquiry contract (spec §4.3, §11) — the SAME schema validates on the client (UX) and on the
 * server (authoritative). Error messages are codes; the UI maps them to localized copy
 * (common.forms.errors.*).
 */
export const INQUIRY_KINDS = ['farm', 'product', 'partner', 'general'] as const
export const PRODUCTION_TYPES = ['broilers', 'layers', 'breeders', 'multiple'] as const
export const PRODUCT_CATEGORY_OPTIONS = ['feed', 'supplements', 'medicines', 'vaccines', 'unsure'] as const

export type InquiryKind = (typeof INQUIRY_KINDS)[number]
export type ErrorCode = 'required' | 'invalidPhone' | 'invalidEmail' | 'tooShort' | 'tooLong' | 'consentRequired'

/**
 * Phone normalisation: Arabic-Indic digits → Western, strip spaces/dashes/brackets/dots, 00 → +.
 * Accepts natural Egyptian formats (01x mobile with 11 digits, 0 + area-code landlines, +20 / 0020)
 * and any valid international E.164 number (+ and 8–15 digits).
 */
export function normalizePhone(raw: string): string {
  let v = toWesternDigits(raw).trim().replace(/[\s\-().‎‏]/g, '')
  if (v.startsWith('00')) v = `+${v.slice(2)}`
  return v
}

export function isValidPhone(raw: string): boolean {
  const v = normalizePhone(raw)
  if (/^01[0125]\d{8}$/.test(v)) return true // Egyptian mobile (local)
  if (/^\+201[0125]\d{8}$/.test(v)) return true // Egyptian mobile (international)
  if (/^0(2|3|[1-9]\d)\d{6,8}$/.test(v)) return true // Egyptian landline (local, with area code)
  if (/^\+20(2|3|[1-9]\d)\d{6,8}$/.test(v)) return true // Egyptian landline (international)
  if (/^\+(?!20)[1-9]\d{7,14}$/.test(v)) return true // other countries, E.164
  return false
}

const trimmed = (max: number) =>
  z
    .string({ error: 'required' })
    .transform((v) => v.trim())
    .pipe(z.string().max(max, { error: 'tooLong' }))

const optionalText = (max: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v ? v.trim() : undefined))
    .pipe(z.string().max(max, { error: 'tooLong' }).optional())
    .transform((v) => (v ? v : undefined))

export const inquirySchema = z
  .object({
    type: z.enum(INQUIRY_KINDS, { error: 'required' }),
    name: trimmed(120).pipe(z.string().min(2, { error: 'tooShort' })),
    phone: trimmed(32).refine((v) => v.length > 0, { error: 'required' }).refine(isValidPhone, { error: 'invalidPhone' }),
    email: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim() : undefined))
      .pipe(z.email({ error: 'invalidEmail' }).max(160, { error: 'tooLong' }).optional()),
    organization: optionalText(160),
    role: optionalText(120),
    governorate: optionalText(60),
    segment: z.enum(PRODUCTION_TYPES).optional(),
    birdCapacity: optionalText(60),
    productCategory: z.enum(PRODUCT_CATEGORY_OPTIONS).optional(),
    productId: z.coerce.number().int().positive().optional(),
    productLabel: optionalText(200),
    productLine: optionalText(200),
    quantity: optionalText(120),
    message: optionalText(2000),
    consent: z.literal(true, { error: 'consentRequired' }),
    // Context added by the form (not user-typed)
    locale: z.enum(['ar', 'en']),
    sourcePath: z.string().max(300).regex(/^\/[^\s]*$/, { error: 'invalid' }),
    idempotencyKey: z.uuid({ error: 'invalid' }),
    // Honeypot: must stay empty (bots fill every input)
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'partner' && !data.organization) {
      ctx.addIssue({ code: 'custom', path: ['organization'], message: 'required' })
    }
    if (data.type === 'product' && !data.productId && !data.productLabel && !data.productCategory && !data.message) {
      ctx.addIssue({ code: 'custom', path: ['message'], message: 'required' })
    }
    if ((data.type === 'general' || data.type === 'partner') && !data.message) {
      ctx.addIssue({ code: 'custom', path: ['message'], message: 'required' })
    }
  })

export type InquiryInput = z.input<typeof inquirySchema>
export type InquiryData = z.output<typeof inquirySchema>

/** Flattens Zod issues into { field: errorCode } for the UI. */
export function fieldErrors(error: z.ZodError): Record<string, ErrorCode> {
  const out: Record<string, ErrorCode> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!out[key]) out[key] = (issue.message as ErrorCode) || 'required'
  }
  return out
}

/** Result returned by the server action — success ONLY after the record is persisted. */
export type InquiryResult =
  | { ok: true; reference: string }
  | { ok: false; error: 'validation'; fields: Record<string, ErrorCode> }
  | { ok: false; error: 'rateLimited' | 'server' | 'spam' }
