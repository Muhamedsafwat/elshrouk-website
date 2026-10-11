import { SunriseCurve } from '@/components/brand/SunriseCurve'
import { accent } from '@/components/motion/Accent'
import { TextReveal } from '@/components/motion/TextReveal'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import type { PartnerDictionary } from '@/i18n/dictionaries/ar/partner'

/**
 * Black hero with the Signature Curve (art-direction §7 "Partner"). The curve keeps the PDF orientation
 * (never mirrored), is cropped off the bottom edge and sits below the copy — never under body text.
 */
export function PartnerHero({
  copy,
  ctaLabel,
  ctaHref,
  crumbs,
  crumbsLabel,
}: {
  copy: PartnerDictionary['hero']
  ctaLabel: string
  ctaHref: string
  crumbs: { label: string; href?: string }[]
  crumbsLabel: string
}) {
  return (
    <section data-theme="dark" className="relative isolate overflow-hidden bg-ink text-paper">
      <div className="container-site relative z-10 pt-8 pb-[clamp(14rem,30vw,28rem)] sm:pt-10 lg:pt-12">
        <Breadcrumbs items={crumbs} label={crumbsLabel} tone="onDark" />
        {/* lg: intro + CTA sit beside the title, bottom-aligned (as on How we work), so the CTA stays above the
            fold at 1024–1440 in both languages (VQA-05). */}
        <div className="grid-site mt-10 gap-y-10 lg:mt-14 lg:items-end">
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <p className="eyebrow text-stone-300" data-reveal="fade">
              {copy.eyebrow}
            </p>
            <TextReveal
              as="h1"
              lines={[copy.title[0], accent(copy.title[1] ?? '', copy.accent)]}
              className="mt-6 text-display-xl font-bold text-paper"
            />
          </div>
          <div className="col-span-4 flex flex-col items-start gap-8 md:col-span-6 lg:col-span-4 lg:col-start-9 lg:pb-2">
            <p className="text-lead text-stone-300" data-reveal="up">
              {copy.intro}
            </p>
            <div data-reveal="up" className="w-full sm:w-auto">
              <ButtonLink href={ctaHref} variant="primary" size="lg" className="w-full sm:w-auto">
                {ctaLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
      {/* Box keeps the SVG aspect (no slice crop) and starts 2.5rem below the copy; the section edges crop the lines. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[calc(100%_-_clamp(14rem,30vw,28rem)_+_2.5rem)] z-0 aspect-[1200/620]"
      >
        <SunriseCurve lines={3} tone="dark" trigger="immediate" delay={0.4} drift={16} strokeWidth={8} className="size-full" />
      </div>
    </section>
  )
}
