import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import type { FaqItem } from '@/lib/content'

export type FaqTeaserProps = { locale: Locale; copy: HomeDictionary['faq']; items: FaqItem[] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function FaqTeaser({ copy }: FaqTeaserProps) {
  return (
    <section id="faq" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.title}</h2>
    </section>
  )
}
