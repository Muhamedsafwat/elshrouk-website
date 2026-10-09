import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'

export type JourneyProps = { locale: Locale; copy: HomeDictionary['journey'] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function Journey({ copy }: JourneyProps) {
  return (
    <section id="journey" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.title}</h2>
    </section>
  )
}
