import { z } from 'zod'
import { toWesternDigits } from '@/lib/search/normalize'

/**
 * Shared inquiry contract (spec §4.3, §11) — the SAME schema validates on the client (UX) and on the
 * server (authoritative). Error messages are codes; the UI maps them to localized copy
 * (common.forms.errors.*). Pure module: safe to import from client components and unit tests.
 */
export const INQUIRY_KINDS = ['farm', 'product', 'partner', 'general'] as const
export const PRODUCTION_TYPES = ['broilers', 'layers', 'breeders', 'multiple'] as const
export const PRODUCT_CATEGORY_OPTIONS = ['feed', 'supplements', 'medicines', 'vaccines', 'unsure'] as const

export type InquiryKind = (typeof INQUIRY_KINDS)[number]
export type ProductionType = (typeof PRODUCTION_TYPES)[number]
export type ProductCategoryOption = (typeof PRODUCT_CATEGORY_OPTIONS)[number]
export type ErrorCode = 'required' | 'invalidPhone' | 'invalidEmail' | 'tooShort' | 'tooLong' | 'consentRequired'

/** Explicit bounds — shared by the schema and the inputs' maxLength attributes. */
export const FIELD_LIMITS = {
  name: 120,
  phone: 32,
  email: 160,
  organization: 160,
  role: 120,
  governorate: 60,
  birdCapacity: 60,
  productLabel: 200,
  productLine: 200,
  quantity: 120,
  message: 2000,
  sourcePath: 300,
} as const

export const isInquiryKind = (value: unknown): value is InquiryKind =>
  typeof value === 'string' && (INQUIRY_KINDS as readonly string[]).includes(value)

/** Bidi controls that RTL copy/paste adds around numbers: LRM/RLM/ALM, embeddings/overrides, isolates. */
const BIDI_MARKS = /[؜‎‏‪-‮⁦-⁩]/g

/**
 * Phone normalisation: Arabic-Indic / Extended Arabic-Indic digits → Western, strip spaces, dashes,
 * brackets, dots and bidi marks, 00 → +. Returns the compact form (not yet E.164 — see toE164).
 */
export function normalizePhone(raw: string): string {
  let v = toWesternDigits(raw).replace(BIDI_MARKS, '').trim().replace(/[\s\-().]/g, '')
  if (v.startsWith('00')) v = `+${v.slice(2)}`
  return v
}

/*
 * Egyptian numbering plan (NTRA): mobiles 010/011/012/015 + 8 digits; landlines 02 + 8 digits (Cairo/Giza),
 * 03 + 7 digits (Alexandria), or a two-digit governorate area code + 7 digits. Area codes are listed
 * explicitly so truncated mobiles (e.g. 010 + 7 digits) and 11-digit "013…" strings are rejected.
 */
const EG_MOBILE = '1[0125]\\d{8}'
const EG_LANDLINE = '(?:2\\d{8}|3\\d{7}|(?:13|15|4[05-8]|5[057]|6[245689]|8[2468]|9[23567])\\d{7})'
const EG_LOCAL = new RegExp(`^0(?:${EG_MOBILE}|${EG_LANDLINE})$`)
const EG_INTERNATIONAL = new RegExp(`^\\+20(?:${EG_MOBILE}|${EG_LANDLINE})$`)
const OTHER_E164 = /^\+(?!20)[1-9]\d{7,14}$/

export function isValidPhone(raw: string): boolean {
  const v = normalizePhone(raw)
  return EG_LOCAL.test(v) || EG_INTERNATIONAL.test(v) || OTHER_E164.test(v)
}

/** Canonical storage form (E.164, e.g. "+201012345678") so duplicate detection and follow-up are reliable. */
export function toE164(raw: string): string {
  const v = normalizePhone(raw)
  if (EG_LOCAL.test(v)) return `+20${v.slice(1)}`
  return v
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
    name: trimmed(FIELD_LIMITS.name).pipe(z.string().min(2, { error: 'tooShort' })),
    phone: trimmed(FIELD_LIMITS.phone)
      .refine((v) => v.length > 0, { error: 'required' })
      .refine(isValidPhone, { error: 'invalidPhone' })
      .transform(toE164),
    email: z
      .string()
      .optional()
      .transform((v) => (v ? v.trim() : undefined))
      .pipe(z.email({ error: 'invalidEmail' }).max(FIELD_LIMITS.email, { error: 'tooLong' }).optional()),
    organization: optionalText(FIELD_LIMITS.organization),
    role: optionalText(FIELD_LIMITS.role),
    governorate: optionalText(FIELD_LIMITS.governorate),
    segment: z.enum(PRODUCTION_TYPES, { error: 'required' }).optional(),
    birdCapacity: optionalText(FIELD_LIMITS.birdCapacity),
    productCategory: z.enum(PRODUCT_CATEGORY_OPTIONS, { error: 'required' }).optional(),
    productId: z.coerce.number().int().positive().optional(),
    productLabel: optionalText(FIELD_LIMITS.productLabel),
    productLine: optionalText(FIELD_LIMITS.productLine),
    quantity: optionalText(FIELD_LIMITS.quantity),
    message: optionalText(FIELD_LIMITS.message),
    consent: z.literal(true, { error: 'consentRequired' }),
    // Context added by the form (not user-typed)
    locale: z.enum(['ar', 'en']),
    sourcePath: z.string().max(FIELD_LIMITS.sourcePath).regex(/^\/(?!\/)[^\s]*$/, { error: 'invalid' }),
    idempotencyKey: z.uuid({ error: 'invalid' }),
    // Honeypot: must stay empty (bots fill every input). The server action checks it BEFORE parsing.
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    const requireField = (field: string) => ctx.addIssue({ code: 'custom', path: [field], message: 'required' })
    if (data.type === 'farm' && !data.segment) requireField('segment')
    if (data.type === 'partner') {
      if (!data.organization) requireField('organization')
      if (!data.role) requireField('role')
      if (!data.productLine) requireField('productLine')
    }
    if (data.type === 'product' && !data.productId && !data.productLabel && !data.productCategory && !data.message) {
      requireField('message')
    }
    if ((data.type === 'general' || data.type === 'partner') && !data.message) requireField('message')
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
