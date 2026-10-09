import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import type { ProductCard } from '@/lib/catalog'
import type { CommonDict } from '@/i18n/dictionaries'

export type ProductPreviewProps = { locale: Locale; copy: HomeDictionary['productPreview']; products: ProductCard[]; categories: CommonDict['categories'] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function ProductPreview({ copy }: ProductPreviewProps) {
  return (
    <section id="product-preview" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.title}</h2>
    </section>
  )
}
