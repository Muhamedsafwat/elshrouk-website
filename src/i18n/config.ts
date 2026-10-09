export const locales = ['ar', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ar'

export const isLocale = (value: string | undefined | null): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value)

export const localeDirection = (locale: Locale): 'rtl' | 'ltr' => (locale === 'ar' ? 'rtl' : 'ltr')

/** hreflang values (spec §12.1). */
export const hrefLang: Record<Locale, string> = { ar: 'ar-EG', en: 'en' }

export const ogLocale: Record<Locale, string> = { ar: 'ar_EG', en: 'en_US' }

export const otherLocale = (locale: Locale): Locale => (locale === 'ar' ? 'en' : 'ar')
