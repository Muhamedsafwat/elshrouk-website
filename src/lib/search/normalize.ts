/**
 * Conservative Arabic/Latin search normalisation (spec §6.4).
 * Goals: make everyday spelling variants match (أ/إ/آ → ا, ى → ي, ة → ه, diacritics, tatweel,
 * Arabic-Indic digits) WITHOUT over-aggressive folding that could merge distinct medicine names
 * (we deliberately keep ؤ/ئ, keep the definite article «ال», and never stem words).
 */
const ARABIC_DIACRITICS = /[ؐ-ًؚ-ٰٟۖ-ۜ۟-۪ۨ-ۭ]/g
const TATWEEL = /ـ/g
const ALEF_VARIANTS = /[آأإٱ]/g // آ أ إ ٱ
const ALEF_MAKSURA = /ى/g // ى
const TA_MARBUTA = /ة/g // ة
const ARABIC_INDIC_DIGITS = /[٠-٩]/g
const PERSIAN_DIGITS = /[۰-۹]/g

export function toWesternDigits(input: string): string {
  return input
    .replace(ARABIC_INDIC_DIGITS, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(PERSIAN_DIGITS, (d) => String(d.charCodeAt(0) - 0x06f0))
}

export function normalizeForSearch(input: string | null | undefined): string {
  if (!input) return ''
  return toWesternDigits(input.normalize('NFKC'))
    .replace(ARABIC_DIACRITICS, '')
    .replace(TATWEEL, '')
    .replace(ALEF_VARIANTS, 'ا')
    .replace(ALEF_MAKSURA, 'ي')
    .replace(TA_MARBUTA, 'ه')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

/** Splits a normalised query into unique tokens (max 6, each ≥ 1 char) for AND-matching. */
export function searchTokens(query: string | null | undefined): string[] {
  const normalized = normalizeForSearch(query).slice(0, 80)
  if (!normalized) return []
  return [...new Set(normalized.split(' '))].filter(Boolean).slice(0, 6)
}

/** Builds the stored search document for a product from its searchable fields. */
export function buildSearchText(parts: Array<string | null | undefined>): string {
  return normalizeForSearch(parts.filter(Boolean).join(' '))
}
