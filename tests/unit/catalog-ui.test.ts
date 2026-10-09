import { describe, expect, it } from 'vitest'
import { paginationItems, resultCountLabel } from '@/components/products/catalog-ui'
import { products as ar } from '@/i18n/dictionaries/ar/products'
import { products as en } from '@/i18n/dictionaries/en/products'

describe('catalogue result count (spec §6.4: real total, Arabic plural forms)', () => {
  const arLabels = ar.catalog.results
  const enLabels = en.catalog.results

  it('uses the six Arabic plural forms', () => {
    expect(resultCountLabel('ar', 0, arLabels)).toBe('لا توجد منتجات مطابقة')
    expect(resultCountLabel('ar', 1, arLabels)).toBe('منتج واحد')
    expect(resultCountLabel('ar', 2, arLabels)).toBe('منتجان')
    expect(resultCountLabel('ar', 3, arLabels)).toBe('3 منتجات')
    expect(resultCountLabel('ar', 10, arLabels)).toBe('10 منتجات')
    expect(resultCountLabel('ar', 11, arLabels)).toBe('11 منتجًا')
    expect(resultCountLabel('ar', 99, arLabels)).toBe('99 منتجًا')
    expect(resultCountLabel('ar', 100, arLabels)).toBe('100 منتج')
    expect(resultCountLabel('ar', 101, arLabels)).toBe('101 منتج')
    expect(resultCountLabel('ar', 103, arLabels)).toBe('103 منتجات')
    // CLDR: n mod 100 in 11..99 → "many", so 1,250 takes the tamyeez accusative form.
    expect(resultCountLabel('ar', 1250, arLabels)).toBe('1,250 منتجًا')
  })

  it('collapses to one/other in English and keeps Western digits', () => {
    expect(resultCountLabel('en', 0, enLabels)).toBe('No matching products')
    expect(resultCountLabel('en', 1, enLabels)).toBe('1 product')
    expect(resultCountLabel('en', 2, enLabels)).toBe('2 products')
    expect(resultCountLabel('en', 37, enLabels)).toBe('37 products')
  })

  it('treats invalid totals as zero', () => {
    expect(resultCountLabel('ar', -4, arLabels)).toBe(arLabels.countZero)
    expect(resultCountLabel('en', Number.NaN, enLabels)).toBe(enLabels.countZero)
  })
})

describe('catalogue pagination range', () => {
  it('lists every page up to seven', () => {
    expect(paginationItems(1, 1)).toEqual([1])
    expect(paginationItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('keeps first/last and the current neighbourhood with gaps', () => {
    expect(paginationItems(1, 20)).toEqual([1, 2, 3, 4, 'gap', 20])
    expect(paginationItems(10, 20)).toEqual([1, 'gap', 9, 10, 11, 'gap', 20])
    expect(paginationItems(20, 20)).toEqual([1, 'gap', 17, 18, 19, 20])
  })

  it('never hides a single page behind a gap', () => {
    expect(paginationItems(4, 20)).toEqual([1, 2, 3, 4, 5, 'gap', 20])
    expect(paginationItems(17, 20)).toEqual([1, 'gap', 16, 17, 18, 19, 20])
  })

  it('clamps out-of-range input', () => {
    expect(paginationItems(0, 10)).toEqual([1, 2, 3, 4, 'gap', 10])
    expect(paginationItems(99, 10)).toEqual([1, 'gap', 7, 8, 9, 10])
    expect(paginationItems(1, 0)).toEqual([1])
  })
})
