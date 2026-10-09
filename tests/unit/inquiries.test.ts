import { describe, expect, it } from 'vitest'
import { formDataToInput, isHoneypotFilled, isWithinPayloadLimits } from '@/lib/inquiries/form-data'
import { generateReference, REFERENCE_ALPHABET, REFERENCE_PATTERN } from '@/lib/inquiries/reference'
import { fieldErrors, inquirySchema, isValidPhone, normalizePhone, toE164 } from '@/lib/inquiries/schema'

// Synthetic numbers only — never shown in the UI or seeded as contacts.
const base = {
  locale: 'ar',
  sourcePath: '/ar/contact',
  idempotencyKey: '3f1c2a9e-8b7d-4c6e-9f10-2a3b4c5d6e7f',
  consent: true,
  name: 'محمد علي',
  phone: '01012345678',
} as const

const errorsOf = (input: Record<string, unknown>) => {
  const result = inquirySchema.safeParse(input)
  return result.success ? {} : fieldErrors(result.error)
}

describe('inquirySchema — valid payloads per kind', () => {
  it('accepts a farm inquiry and stores the phone in E.164', () => {
    const result = inquirySchema.safeParse({
      ...base,
      type: 'farm',
      segment: 'broilers',
      birdCapacity: '20 ألف طائر',
      governorate: 'الشرقية',
      productCategory: 'feed',
      organization: '  مزرعة النور  ',
    })
    expect(result.success).toBe(true)
    expect(result.data?.phone).toBe('+201012345678')
    expect(result.data?.organization).toBe('مزرعة النور')
    expect(result.data?.message).toBeUndefined()
  })

  it('accepts a product inquiry carrying only a product id (message optional)', () => {
    const result = inquirySchema.safeParse({ ...base, type: 'product', productId: '42', productLabel: 'منتج' })
    expect(result.success).toBe(true)
    expect(result.data?.productId).toBe(42)
  })

  it('accepts a partner inquiry with company, role, product line and message', () => {
    const result = inquirySchema.safeParse({
      ...base,
      type: 'partner',
      organization: 'Example Animal Health Ltd',
      role: 'Export manager',
      productLine: 'لقاحات بيطرية للدواجن',
      email: 'export@example.com',
      phone: '+44 20 7946 0958',
      message: 'نرغب في مناقشة التوزيع.',
    })
    expect(result.success).toBe(true)
    expect(result.data?.phone).toBe('+442079460958')
  })

  it('accepts a general inquiry with a message', () => {
    expect(inquirySchema.safeParse({ ...base, type: 'general', message: 'سؤال عام' }).success).toBe(true)
  })
})

describe('inquirySchema — malformed payloads', () => {
  it('requires the production type for farm inquiries', () => {
    expect(errorsOf({ ...base, type: 'farm' })).toMatchObject({ segment: 'required' })
  })

  it('requires company, role, product line and message for partners', () => {
    expect(errorsOf({ ...base, type: 'partner' })).toMatchObject({
      organization: 'required',
      role: 'required',
      productLine: 'required',
      message: 'required',
    })
  })

  it('requires a message for general inquiries and some context for product inquiries', () => {
    expect(errorsOf({ ...base, type: 'general' })).toMatchObject({ message: 'required' })
    expect(errorsOf({ ...base, type: 'product' })).toMatchObject({ message: 'required' })
    expect(errorsOf({ ...base, type: 'product', productCategory: 'vaccines' })).toEqual({})
  })

  it('maps field problems to localisable codes', () => {
    expect(
      errorsOf({ ...base, type: 'general', message: 'x'.repeat(2001), name: 'م', phone: '12345', email: 'not-an-email', consent: false }),
    ).toMatchObject({ message: 'tooLong', name: 'tooShort', phone: 'invalidPhone', email: 'invalidEmail', consent: 'consentRequired' })
    expect(errorsOf({ ...base, type: 'general', message: 'm', name: undefined, phone: '   ' })).toMatchObject({
      name: 'required',
      phone: 'required',
    })
  })

  it('rejects unknown types, enum values and tampered context fields', () => {
    expect(errorsOf({ ...base, type: 'wholesale', message: 'm' })).toHaveProperty('type')
    expect(errorsOf({ ...base, type: 'farm', segment: 'ducks' })).toHaveProperty('segment')
    expect(errorsOf({ ...base, type: 'general', message: 'm', sourcePath: 'https://evil.example/' })).toHaveProperty('sourcePath')
    expect(errorsOf({ ...base, type: 'general', message: 'm', sourcePath: '//evil.example/' })).toHaveProperty('sourcePath')
    expect(errorsOf({ ...base, type: 'general', message: 'm', idempotencyKey: 'abc' })).toHaveProperty('idempotencyKey')
    expect(errorsOf({ ...base, type: 'general', message: 'm', locale: 'fr' })).toHaveProperty('locale')
  })
})

describe('phone normalisation (spec §11.4)', () => {
  it.each([
    '01012345678',
    '٠١٠١٢٣٤٥٦٧٨', // Arabic-Indic digits
    '۰۱۰۱۲۳۴۵۶۷۸', // Extended Arabic-Indic digits
    '01112345678',
    '01212345678',
    '01512345678',
    '+20 101 234 5678',
    '0020-10-1234-5678',
    '‏+20 10 1234 5678', // pasted with a leading RLM
    '⁦+20 10 1234 5678⁩', // wrapped in bidi isolates
    '(010) 1234.5678',
    '0223456789', // Cairo landline
    '033456789', // Alexandria landline
    '0402345678', // Tanta landline
    '+20 2 2345 6789',
    '+44 20 7946 0958', // international
    '+1 (202) 555-0143',
    '00971501234567',
  ])('accepts %s', (raw) => {
    expect(isValidPhone(raw)).toBe(true)
  })

  it.each([
    '12345',
    '+0123456789',
    '',
    '0101234567', // truncated 010 mobile
    '01312345678', // 11 digits but 013 is not a mobile prefix
    '01712345678', // 017 is neither a mobile prefix nor an area code
    '+20101234567', // international Egyptian mobile missing a digit
    '0223456789012',
    'phone',
  ])('rejects %j', (raw) => {
    expect(isValidPhone(raw)).toBe(false)
  })

  it('normalises digits, separators and the 00 prefix', () => {
    expect(normalizePhone(' ٠١٠-١٢٣٤-٥٦٧٨ ')).toBe('01012345678')
    expect(normalizePhone('0020 10 1234 5678')).toBe('+201012345678')
  })

  it('stores one canonical E.164 form', () => {
    expect(toE164('01012345678')).toBe('+201012345678')
    expect(toE164('٠٢٢٣٤٥٦٧٨٩')).toBe('+20223456789')
    expect(toE164('+20 10 1234 5678')).toBe('+201012345678')
    expect(toE164('+1 (202) 555-0143')).toBe('+12025550143')
  })
})

describe('honeypot, FormData mapping and payload bounds', () => {
  const formData = (entries: Record<string, string>) => {
    const fd = new FormData()
    for (const [k, v] of Object.entries(entries)) fd.append(k, v)
    return fd
  }

  it('detects a filled honeypot (even whitespace) and the schema rejects it too', () => {
    expect(isHoneypotFilled(formData({ website: 'https://spam.example' }))).toBe(true)
    expect(isHoneypotFilled(formData({ website: ' ' }))).toBe(true)
    expect(isHoneypotFilled(formData({ website: '' }))).toBe(false)
    expect(isHoneypotFilled(formData({}))).toBe(false)
    const input = formDataToInput(formData({ ...base, consent: 'yes', type: 'general', message: 'm', website: 'x' }))
    expect(inquirySchema.safeParse(input).success).toBe(false)
  })

  it('maps checkbox, ids and empty strings safely', () => {
    const input = formDataToInput(formData({ type: 'product', name: 'n', email: '', productId: '17', consent: 'yes', extra: 'ignored' }))
    expect(input).toEqual({ type: 'product', name: 'n', productId: 17, consent: true })
    expect(formDataToInput(formData({ productId: '1; DROP TABLE' }))).toEqual({})
    expect(formDataToInput(formData({ consent: 'false' }))).toEqual({})
  })

  it('bounds the request size and refuses files', () => {
    expect(isWithinPayloadLimits(formData({ name: 'n', message: 'x'.repeat(2000) }))).toBe(true)
    expect(isWithinPayloadLimits(formData({ message: 'x'.repeat(20_000) }))).toBe(false)
    const many = new FormData()
    for (let i = 0; i < 60; i += 1) many.append(`f${i}`, 'v')
    expect(isWithinPayloadLimits(many)).toBe(false)
    const withFile = new FormData()
    withFile.append('upload', new Blob(['x']), 'x.txt')
    expect(isWithinPayloadLimits(withFile)).toBe(false)
  })
})

describe('reference format', () => {
  it('produces SHR- plus six unambiguous symbols', () => {
    const refs = Array.from({ length: 2000 }, () => generateReference())
    for (const ref of refs) expect(ref).toMatch(REFERENCE_PATTERN)
    expect(new Set(refs).size).toBeGreaterThan(1990)
    expect(refs.join('')).not.toMatch(/[01OI]/)
  })

  it('maps random bytes uniformly onto the 32-symbol alphabet', () => {
    expect(REFERENCE_ALPHABET).toHaveLength(32)
    expect(generateReference((bytes) => bytes.fill(0))).toBe('SHR-222222')
    expect(generateReference((bytes) => bytes.fill(255))).toBe('SHR-ZZZZZZ')
    expect(generateReference((bytes) => Object.assign(bytes, [0, 1, 2, 3, 32, 63]))).toBe('SHR-23452Z')
  })
})
