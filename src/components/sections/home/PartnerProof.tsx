import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import type { Metric } from '@/lib/content'

export type PartnerProofProps = { locale: Locale; copy: HomeDictionary['partnerProof']; metrics: Metric[] }

/** STUB — scene to be implemented per docs/art-direction.md (homepage). Keep the props contract. */
export function PartnerProof({ copy }: PartnerProofProps) {
  return (
    <section id="partner-proof" className="container-site section-y border-t border-line">
      <h2 className="text-display-md font-bold">{copy.title}</h2>
    </section>
  )
}
