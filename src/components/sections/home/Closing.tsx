import { accent } from '@/components/motion/Accent'
import { TextReveal } from '@/components/motion/TextReveal'
import { ButtonLink } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { href } from '@/i18n/routing'
import { ClosingHorizon } from './ClosingHorizon'

export type ClosingProps = { locale: Locale; copy: HomeDictionary['closing'] }

/** Height of the horizon band; the copy keeps the same bottom padding so the curve never sits under text. */
const HORIZON_H = 'h-[clamp(20rem,7rem+30vw,35rem)]'
const HORIZON_PB = 'pb-[clamp(20rem,7rem+30vw,35rem)]'

/**
 * Scene 11 · Closing (black) — "next dawn". docs/art-direction.md §5, spec Scene 11 + §8.4 moment 6.
 * Giant two-line headline (vermilion key phrase), subhead, primary + outline CTAs, then the horizon:
 * the rising sun behind the Signature Curve. Different from the hero by design (no photo, no white
 * ground, the sun rises behind the line instead of the line drawing over white).
 */
export function Closing({ locale, copy }: ClosingProps) {
  return (
    <section
      id="closing"
      data-theme="dark"
      aria-labelledby="closing-title"
      className="relative isolate overflow-hidden bg-surface text-fg"
    >
      <div className={`relative z-10 container-site pt-[clamp(5rem,2.2rem+9vw,13rem)] ${HORIZON_PB}`}>
        <TextReveal
          as="h2"
          id="closing-title"
          lines={copy.headline.map((line) => accent(line, copy.accent))}
          className="text-display-2xl font-bold lg:rtl:text-[clamp(4.5rem,0.5rem+6.2vw,7.5rem)]"
        />
        <p className="mt-8 max-w-[44ch] text-lead text-fg-soft md:mt-10" data-reveal="up">
          {copy.subhead}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-12" data-reveal="up">
          <ButtonLink href={href(locale, 'contact', { type: 'farm' })} variant="primary" size="lg" className="w-full sm:w-auto">
            {copy.primaryCta}
          </ButtonLink>
          <ButtonLink href={href(locale, 'products')} variant="outline" size="lg" arrow={false} className="w-full sm:w-auto">
            {copy.secondaryCta}
          </ButtonLink>
        </div>
      </div>
      <ClosingHorizon className={`absolute inset-x-0 bottom-0 ${HORIZON_H}`} />
    </section>
  )
}
