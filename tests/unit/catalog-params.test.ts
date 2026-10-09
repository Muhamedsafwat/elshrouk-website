import { describe, expect, it } from 'vitest'
import { catalogHref, hasActiveFilters, parseCatalogParams } from '@/lib/catalog-params'

describe('catalogue query parsing (spec §6.4, §16.1 malformed query safety)', () => {
  it('accepts valid facets, search and page', () => {
    expect(parseCatalogParams({ category: 'vaccines', segment: 'layers', q: ' لقاح ', page: '3' })).toEqual({
      category: 'vaccines',
      segment: 'layers',
      manufacturer: undefined,
      q: 'لقاح',
      page: 3,
    })
  })

  it('drops unknown or malformed values instead of failing', () => {
    const p = parseCatalogParams({ category: 'cattle', segment: '<script>', page: '-4', q: 'x'.repeat(500) })
    expect(p.category).toBeUndefined()
    expect(p.segment).toBeUndefined()
    expect(p.page).toBe(1)
    expect(p.q).toBeUndefined()
  })

  it('takes the first value of repeated params and supports URLSearchParams', () => {
    expect(parseCatalogParams({ category: ['feed', 'vaccines'] }).category).toBe('feed')
    expect(parseCatalogParams(new URLSearchParams('segment=breeders&page=2'))).toMatchObject({ segment: 'breeders', page: 2 })
  })

  it('caps pagination to a sane maximum', () => {
    expect(parseCatalogParams({ page: '999999' }).page).toBe(1)
  })

  it('builds stable shareable URLs and resets the page when a filter changes', () => {
    const current = { category: 'feed' as const, page: 4 }
    expect(catalogHref('ar', current, { segment: 'broilers' })).toBe('/ar/products?category=feed&segment=broilers')
    expect(catalogHref('en', current, { page: 5 })).toBe('/en/products?category=feed&page=5')
    expect(catalogHref('ar', {}, {})).toBe('/ar/products')
  })

  it('composes and resets facets', () => {
    expect(hasActiveFilters({ page: 2 })).toBe(false)
    expect(hasActiveFilters({ q: 'a' })).toBe(true)
    expect(catalogHref('ar', { category: 'feed', segment: 'layers', q: 'x' }, { category: undefined, segment: undefined, q: undefined })).toBe('/ar/products')
  })
})
