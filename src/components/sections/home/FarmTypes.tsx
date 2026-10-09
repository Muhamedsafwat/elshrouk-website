import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'

export type FarmTypesProps = { locale: Locale; copy: HomeDictionary['farmTypes'] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function FarmTypes({ copy }: FarmTypesProps) {
  return (
    <section id="farm-types" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.title.join(' ')}</h2>
    </section>
  )
}
