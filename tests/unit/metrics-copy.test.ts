import { describe, expect, it } from 'vitest'
import { common as ar } from '@/i18n/dictionaries/ar/common'
import { common as en } from '@/i18n/dictionaries/en/common'

/** The three client-supplied statements must render verbatim with their qualifiers (spec §1.1, §5 Scene 2). */
describe('approved metric statements', () => {
  it('Arabic statements are exact', () => {
    const items = ar.metrics.items.map((m) => `${m.qualifier} ${m.value}${m.unit ? ` ${m.unit}` : ''} ${m.label}`)
    expect(items).toEqual([
      'حوالي 300 مزرعة دواجن نتعامل معها بشكل مستمر',
      'حوالي 15 مليون طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها',
      'حوالي 150 منتجًا نوزعه من الأدوية واللقاحات البيطرية',
    ])
  })

  it('every metric keeps a visible qualifier and a full screen-reader sentence in both locales', () => {
    for (const dict of [ar, en]) {
      expect(dict.metrics.items).toHaveLength(3)
      for (const m of dict.metrics.items) {
        expect(m.qualifier.trim().length).toBeGreaterThan(0)
        expect(m.srLabel).toContain(m.value)
        // The accessible sentence must spell the approximation out in full.
        expect(m.srLabel).toMatch(/^(حوالي|Approximately) /)
      }
    }
  })

  it('uses Western digits only', () => {
    for (const m of ar.metrics.items) expect(m.value).toMatch(/^[0-9]+$/)
  })

  it('the 150 figure is scoped to medicines and vaccines, never feed', () => {
    const products = ar.metrics.items.find((m) => m.key === 'products')!
    expect(products.label).toContain('الأدوية واللقاحات البيطرية')
    expect(products.label).not.toMatch(/أعلاف|مكملات/)
    const enProducts = en.metrics.items.find((m) => m.key === 'products')!
    expect(enProducts.label.toLowerCase()).toContain('veterinary')
    expect(enProducts.label.toLowerCase()).not.toMatch(/feed|supplement/)
  })
})
