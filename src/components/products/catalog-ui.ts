import type { Locale } from '@/i18n/config'
import { formatNumber, interpolate } from '@/i18n/format'

/** Pure, unit-tested presentation helpers for the catalogue (tests/unit/catalog-ui.test.ts). */

export type CountLabels = {
  count: string
  countZero: string
  countOne: string
  countTwo: string
  countFew: string
  countMany: string
}

const pluralRules: Partial<Record<Locale, Intl.PluralRules>> = {}

/**
 * Result count phrased with the locale's plural rules (Arabic has six forms). Always the real total from
 * the database — never a hard-coded catalogue size.
 */
export function resultCountLabel(locale: Locale, total: number, labels: CountLabels): string {
  if (!Number.isFinite(total) || total <= 0) return labels.countZero
  const rules = (pluralRules[locale] ??= new Intl.PluralRules(locale))
  const form = rules.select(total)
  const template =
    form === 'one'
      ? labels.countOne
      : form === 'two'
        ? labels.countTwo
        : form === 'few'
          ? labels.countFew
          : form === 'many'
            ? labels.countMany
            : labels.count
  return interpolate(template, { count: formatNumber(total) })
}

export type PageItem = number | 'gap'

/**
 * Compact page list: first, last, the current page ±1 and gaps — but never a gap that hides a single page.
 * Up to 7 pages are listed in full.
 */
export function paginationItems(page: number, totalPages: number): PageItem[] {
  const total = Math.max(1, Math.floor(totalPages))
  const current = Math.min(Math.max(1, Math.floor(page)), total)
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)
  if (current <= 3) end = 4
  if (current >= total - 2) start = total - 3
  if (start === 3) start = 2
  if (end === total - 2) end = total - 1

  const items: PageItem[] = [1]
  if (start > 2) items.push('gap')
  for (let i = start; i <= end; i++) items.push(i)
  if (end < total - 1) items.push('gap')
  items.push(total)
  return items
}
