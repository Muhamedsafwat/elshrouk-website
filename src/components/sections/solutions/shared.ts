import type { PhotoId } from '@/content/photos'
import type { Locale } from '@/i18n/config'
import { interpolate } from '@/i18n/format'
import type { SegmentKey } from '@/lib/catalog-params'

/** Wide documentary frame per segment (heroes, chapters, next-segment teaser). */
export const SEGMENT_PHOTO: Record<SegmentKey, PhotoId> = {
  broilers: 'segmentBroilers',
  layers: 'segmentLayers',
  breeders: 'segmentBreeders',
}

/** Close-up frame per segment (overview arch window). */
export const SEGMENT_DETAIL_PHOTO: Record<SegmentKey, PhotoId> = {
  broilers: 'broilersDetail',
  layers: 'layersDetail',
  breeders: 'breedersDetail',
}

/** Reading order of the segment pages (dictionary `next.label` assumes broilers → layers → breeders → broilers). */
export const NEXT_SEGMENT: Record<SegmentKey, SegmentKey> = {
  broilers: 'layers',
  layers: 'breeders',
  breeders: 'broilers',
}

export const pad2 = (n: number) => String(n).padStart(2, '0')

export type ChapterCopy = {
  key: SegmentKey
  index: string
  name: string
  latin: string
  title: string
  body: string
  cta: string
}

type PluralForms = { zero?: string; one: string; two?: string; few?: string; many?: string; other: string }

/**
 * Picks the CLDR plural form for `n` (Arabic has zero/one/two/few/many/other) and fills `{count}`/`{minutes}`.
 * Missing forms fall back to `other`.
 */
export function plural(n: number, locale: Locale, forms: PluralForms): string {
  if (n === 0 && forms.zero) return forms.zero
  const rule = new Intl.PluralRules(locale).select(n) as keyof PluralForms
  const template = forms[rule] ?? forms.other
  return interpolate(template, { count: n, minutes: n })
}
