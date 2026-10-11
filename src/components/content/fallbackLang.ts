import type { Locale } from '@/i18n/config'

const ARABIC_LETTER = /[؀-ۿݐ-ݿࡰ-࢟ࢠ-ࣿﭐ-﷿ﹰ-﻿]/gu
const LATIN_LETTER = /[A-Za-zÀ-ɏ]/g

/** True when Arabic letters outnumber Latin ones (digits, punctuation and SKUs are ignored). */
export function isMostlyArabic(text: string): boolean {
  const arabic = text.match(ARABIC_LETTER)?.length ?? 0
  if (arabic === 0) return false
  return arabic > (text.match(LATIN_LETTER)?.length ?? 0)
}

/**
 * Product/CMS fields are queried with `fallbackLocale: 'ar'`, so an English page can receive Arabic text an
 * editor has not translated yet (CI-01). Spread the result on the element that renders such a value:
 * `<p {...fallbackLangProps(product.description, locale)}>` → `lang="ar" dir="rtl"` only when needed.
 */
export function fallbackLangProps(
  text: string | null | undefined,
  locale: Locale,
): { lang?: 'ar'; dir?: 'rtl' } {
  if (locale === 'ar' || !text || !isMostlyArabic(text)) return {}
  return { lang: 'ar', dir: 'rtl' }
}
