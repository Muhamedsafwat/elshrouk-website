import { describe, expect, it } from 'vitest'
import { buildSearchText, normalizeForSearch, searchTokens, toWesternDigits } from '@/lib/search/normalize'

describe('Arabic search normalisation (spec §6.4)', () => {
  it('folds alef variants, alef maksura and ta marbuta', () => {
    expect(normalizeForSearch('أعلاف إضافية آمنة')).toBe('اعلاف اضافيه امنه')
    expect(normalizeForSearch('مستشفى')).toBe('مستشفي')
  })

  it('removes diacritics (tashkeel) and tatweel without touching letters', () => {
    expect(normalizeForSearch('لَقَاحٌ')).toBe('لقاح')
    expect(normalizeForSearch('لقـــاح')).toBe('لقاح')
  })

  it('keeps hamza seats ؤ/ئ and the definite article (no over-aggressive matching)', () => {
    expect(normalizeForSearch('مؤكد')).toBe('مؤكد')
    expect(normalizeForSearch('بيئي')).toBe('بيئي')
    expect(normalizeForSearch('اللقاحات')).toBe('اللقاحات')
  })

  it('converts Arabic-Indic and Persian digits to Western digits', () => {
    expect(toWesternDigits('٣٠٠ ۱۵۰')).toBe('300 150')
    expect(normalizeForSearch('عبوة ٥٠٠ مل')).toBe('عبوه 500 مل')
  })

  it('lowercases Latin and splits punctuation for SKUs symmetrically', () => {
    expect(normalizeForSearch('AB-12.5 Premix')).toBe('ab 12 5 premix')
    expect(searchTokens('ab-12')).toEqual(['ab', '12'])
  })

  it('returns no tokens for empty or punctuation-only input and caps token count', () => {
    expect(searchTokens('   ')).toEqual([])
    expect(searchTokens('!!!')).toEqual([])
    expect(searchTokens('a b c d e f g h')).toHaveLength(6)
  })

  it('builds a combined search document from optional fields', () => {
    expect(buildSearchText(['لقاح تجريبي', null, 'ABC-1', undefined])).toBe('لقاح تجريبي abc 1')
  })
})
