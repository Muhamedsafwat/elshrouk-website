import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'

export type ProductUniverseProps = { locale: Locale; copy: HomeDictionary['productUniverse'] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function ProductUniverse({ copy }: ProductUniverseProps) {
  return (
    <section id="product-universe" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.title.join(' ')}</h2>
    </section>
  )
}
