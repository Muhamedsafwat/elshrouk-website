import type { CSSProperties } from 'react'
import { Photo } from '@/components/media/Photo'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { SEGMENT_ICONS } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import type { SegmentKey } from '@/lib/catalog-params'
import { SEGMENT_PHOTO } from './shared'

const i = (n: number) => ({ '--i': n }) as CSSProperties

/**
 * Segment hero (art direction §7): full-bleed documentary photo at ≈70vh, ≥50% black under the white
 * copy, sector label + authored two-line title + intro, breadcrumbs on dark. CSS-only first-paint intro.
 */
export function SegmentHero({
  locale,
  segment,
  label,
  title,
  intro,
  cta,
  breadcrumbs,
}: {
  locale: Locale
  segment: SegmentKey
  label: string
  title: string[]
  intro: string
  cta: string
  breadcrumbs: { items: { label: string; href?: string }[]; label: string }
}) {
  const Icon = SEGMENT_ICONS[segment]
  return (
    <section
      data-theme="dark"
      aria-labelledby="segment-title"
      className="relative isolate flex min-h-[78svh] flex-col overflow-hidden bg-ink text-fg sm:min-h-[70svh]"
    >
      <div className="absolute inset-0 -z-10">
        <div className="intro-zoom absolute inset-0 origin-bottom">
          <Photo id={SEGMENT_PHOTO[segment]} locale={locale} priority quality={80} sizes="100vw" className="absolute inset-0" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/50" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/20" />
      </div>

      <div className="container-site flex w-full flex-1 flex-col pt-6 pb-12 lg:pt-8 lg:pb-20">
        <Breadcrumbs items={breadcrumbs.items} label={breadcrumbs.label} tone="onDark" className="intro-fade" />

        <div className="mt-auto grid grid-cols-1 items-end gap-y-8 pt-28 lg:grid-cols-12 lg:gap-x-10 lg:pt-36">
          <div className="lg:col-span-8">
            <p className="eyebrow intro-fade flex items-center gap-3 text-fg-soft" style={i(0)}>
              <Icon size={22} aria-hidden />
              {label}
            </p>
            <h1 id="segment-title" className="mt-5 text-display-xl font-extrabold text-fg">
              {title.map((line, n) => (
                <span key={n} className="mask-line intro-line" style={i(n)}>
                  <span>{line}</span>
                  {n < title.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="intro-fade max-w-[44ch] text-lead text-fg-soft" style={i(2)}>
              {intro}
            </p>
            <div className="intro-fade mt-8" style={i(3)}>
              <ButtonLink href="#inquiry" variant="primary" size="lg" className="w-full sm:w-auto">
                {cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
