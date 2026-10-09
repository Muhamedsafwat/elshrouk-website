import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'

export type ClosingProps = { locale: Locale; copy: HomeDictionary['closing'] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function Closing({ copy }: ClosingProps) {
  return (
    <section id="closing" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.headline.join(' ')}</h2>
    </section>
  )
}
