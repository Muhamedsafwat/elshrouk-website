import { z } from 'zod'
import type { Locale } from '@/i18n/config'

// No eval-based JIT probe (CSP-safe); harmless if schema.ts already set it.
z.config({ jitless: true })

/** Pure + unit-tested: parses untrusted catalogue query strings (spec §6.4, §9.3). */
export const CATEGORY_KEYS = ['feed', 'supplements', 'medicines', 'vaccines'] as const
export const SEGMENT_KEYS = ['broilers', 'layers', 'breeders'] as const
export type CategoryKey = (typeof CATEGORY_KEYS)[number]
export type SegmentKey = (typeof SEGMENT_KEYS)[number]

export const PAGE_SIZE = 12

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

const schema = z.object({
  category: z.enum(CATEGORY_KEYS).optional().catch(undefined),
  segment: z.enum(SEGMENT_KEYS).optional().catch(undefined),
  manufacturer: z
    .string()
    .trim()
    .max(80)
    .optional()
    .catch(undefined)
    .transform((v) => v || undefined),
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .catch(undefined)
    .transform((v) => v || undefined),
  page: z.coerce.number().int().min(1).max(500).catch(1).default(1),
})

export type CatalogParams = z.output<typeof schema>

export function parseCatalogParams(searchParams: Record<string, string | string[] | undefined> | URLSearchParams): CatalogParams {
  const get = (key: string) =>
    searchParams instanceof URLSearchParams ? (searchParams.get(key) ?? undefined) : first(searchParams[key])
  return schema.parse({
    category: get('category'),
    segment: get('segment'),
    manufacturer: get('manufacturer'),
    q: get('q'),
    page: get('page') ?? 1,
  })
}

/** Builds a stable, shareable catalogue URL; changing any filter resets pagination. */
export function catalogHref(locale: Locale, current: Partial<CatalogParams>, changes: Partial<CatalogParams> = {}): string {
  const next: Partial<CatalogParams> = { ...current, ...changes }
  const filterChanged = Object.keys(changes).some((k) => k !== 'page')
  if (filterChanged) next.page = 1
  const params = new URLSearchParams()
  if (next.q) params.set('q', next.q)
  if (next.category) params.set('category', next.category)
  if (next.segment) params.set('segment', next.segment)
  if (next.manufacturer) params.set('manufacturer', next.manufacturer)
  if (next.page && next.page > 1) params.set('page', String(next.page))
  const s = params.toString()
  return `/${locale}/products${s ? `?${s}` : ''}`
}

export const hasActiveFilters = (p: Partial<CatalogParams>) => Boolean(p.q || p.category || p.segment || p.manufacturer)
