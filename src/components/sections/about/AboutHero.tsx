import type { CSSProperties } from 'react'
import type { Locale } from '@/i18n/config'
import type { AboutDictionary } from '@/i18n/dictionaries/ar/about'
import { Photo } from '@/components/media/Photo'
import { accent } from '@/components/motion/Accent'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { DawnImage } from './DawnImage'

type Props = {
  locale: Locale
  copy: AboutDictionary['hero']
  crumbs: Crumb[]
  crumbsLabel: string
}

const i = (n: number) => ({ '--i': n }) as CSSProperties

/**
 * About hero (art-direction §7): white ground, giant two-line authored title with one vermilion phrase,
 * offset intro, then a full-bleed dawn photograph that eases from monochrome to colour on scroll.
 * Above-the-fold motion is the CSS first-paint intro (no JS needed, final state under reduced motion).
 */
export function AboutHero({ locale, copy, crumbs, crumbsLabel }: Props) {
  return (
    <>
      <section
        data-theme="light"
        aria-labelledby="about-title"
        className="bg-surface pt-8 pb-14 text-fg sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-24"
      >
        <div className="container-site">
          <Breadcrumbs items={crumbs} label={crumbsLabel} className="intro-fade" />
          <p className="eyebrow intro-fade mt-10 lg:mt-14" style={i(1)}>
            {copy.eyebrow}
          </p>
          <h1
            id="about-title"
            className="mt-6 text-[clamp(2.3rem,0.9rem+3.6vw,4.5rem)] leading-[1.12] font-bold tracking-[-0.015em] lg:mt-8 rtl:text-[clamp(2.75rem,0.55rem+6.9vw,7.5rem)]"
          >
            {copy.title.map((line, n) => (
              <span key={line} className="mask-line intro-line" style={i(n)}>
                <span>{accent(line, copy.accent)}</span>
              </span>
            ))}
          </h1>
          <div className="grid-site mt-10 lg:mt-16">
            <p
              className="intro-fade col-span-4 text-lead text-fg-soft md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8"
              style={i(2)}
            >
              {copy.intro}
            </p>
          </div>
        </div>
      </section>

      <DawnImage className="relative isolate h-[70svh] max-h-[44rem] min-h-[24rem] overflow-hidden bg-stone-200 lg:h-[88svh] lg:max-h-[62rem]">
        <div data-dawn-media="" className="absolute inset-0 will-change-transform">
          <Photo id="farmExterior" locale={locale} sizes="100vw" priority className="absolute inset-0" />
          <div
            data-dawn-mono=""
            aria-hidden
            className="absolute inset-0 opacity-0 motion-safe:[html.js:not(.motion-off)_&]:opacity-100"
          >
            {/* Same URL as the colour photo above (one request); only the real LCP image carries `priority`. */}
            <Photo id="farmExterior" locale={locale} sizes="100vw" decorative className="absolute inset-0 grayscale" />
          </div>
        </div>
      </DawnImage>
    </>
  )
}
