import type { CSSProperties } from 'react'
import type { HowWeWorkDictionary } from '@/i18n/dictionaries/ar/howWeWork'
import { accent } from '@/components/motion/Accent'
import { ButtonLink } from '@/components/ui/Button'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'

type Props = {
  copy: HowWeWorkDictionary['hero']
  crumbs: Crumb[]
  crumbsLabel: string
  /** In-page jump to the request form. */
  cta: { label: string; href: string }
  /** id given to the h1 — the process list below is labelled by it. */
  titleId: string
}

const i = (n: number) => ({ '--i': n }) as CSSProperties

/** How we work hero: white, large authored title (one vermilion phrase), offset intro + primary CTA. */
export function ProcessHero({ copy, crumbs, crumbsLabel, cta, titleId }: Props) {
  return (
    <section data-theme="light" aria-labelledby={titleId} className="bg-surface pt-28 pb-16 text-fg sm:pt-32 lg:pt-40 lg:pb-28">
      <div className="container-site">
        <Breadcrumbs items={crumbs} label={crumbsLabel} className="intro-fade" />
        <p className="eyebrow intro-fade mt-12 lg:mt-20" style={i(1)}>
          {copy.eyebrow}
        </p>
        <h1 id={titleId} className="mt-6 text-[clamp(2.2rem,0.9rem+3.4vw,4.25rem)] leading-[1.14] font-bold tracking-[-0.01em] lg:mt-8 rtl:text-[clamp(2.2rem,0.75rem+5.6vw,6.5rem)]">
          {copy.title.map((line, n) => (
            <span key={line} className="mask-line intro-line" style={i(n)}>
              <span>{accent(line, copy.accent)}</span>
            </span>
          ))}
        </h1>
        <div className="grid-site mt-10 gap-y-8 lg:mt-16 lg:items-end">
          <p
            className="intro-fade col-span-4 text-lead text-fg-soft md:col-span-6 lg:col-span-5 lg:col-start-8 lg:row-start-1"
            style={i(2)}
          >
            {copy.intro}
          </p>
          <div className="intro-fade col-span-4 md:col-span-6 lg:col-span-4 lg:col-start-1 lg:row-start-1" style={i(3)}>
            <ButtonLink href={cta.href} variant="primary" size="lg" className="w-full sm:w-auto">
              {cta.label}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}
