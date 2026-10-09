import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'

export type StatementProps = { locale: Locale; copy: HomeDictionary['statement'] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function Statement({ copy }: StatementProps) {
  return (
    <section id="statement" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.lines.join(' ')}</h2>
    </section>
  )
}
