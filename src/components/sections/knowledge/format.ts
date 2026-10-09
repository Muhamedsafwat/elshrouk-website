import type { Locale } from '@/i18n/config'
import type { KnowledgeDictionary } from '@/i18n/dictionaries/ar/knowledge'
import { interpolate } from '@/i18n/format'

type CardCopy = KnowledgeDictionary['hub']['card']

/** Reading-time label using the locale's plural rules (Arabic: one / two / few 3–10 / many 11+). */
export function readingTimeLabel(minutes: number, locale: Locale, copy: CardCopy): string {
  if (locale === 'ar') {
    const rule = new Intl.PluralRules('ar').select(minutes)
    if (rule === 'one') return copy.minutesOne
    if (rule === 'two') return copy.minutesTwo
    if (rule === 'few') return interpolate(copy.minutes, { minutes })
    return interpolate(copy.minutesMany, { minutes })
  }
  return minutes === 1 ? copy.minutesOne : interpolate(copy.minutes, { minutes })
}

/** Topic keys mirror the CMS Article `category` values. */
export const TOPIC_PHOTOS = {
  'farm-business': 'farmExterior',
  'feed-supplements': 'categorySupplements',
  'vet-product-handling': 'categoryMedicines',
  'company-news': 'statement',
} as const

/** Spec §6.7: veterinary product handling is published only after qualified professional review. */
export const REVIEWED_TOPIC = 'vet-product-handling'

export const categoryName = (copy: KnowledgeDictionary['hub'], key: string): string =>
  copy.categories.find((c) => c.key === key)?.name ?? key

export const isTopicKey = (copy: KnowledgeDictionary['hub'], key: string | undefined): key is string =>
  Boolean(key && copy.categories.some((c) => c.key === key))
