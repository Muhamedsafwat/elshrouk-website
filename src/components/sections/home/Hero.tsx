import { SunriseCurve } from '@/components/brand/SunriseCurve'
import { Photo } from '@/components/media/Photo'
import { accent } from '@/components/motion/Accent'
import { ButtonLink } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routing'
import type { Metric } from '@/lib/content'
import { HeroParallax } from './HeroParallax'

export type HeroCopy = {
  eyebrow: string
  headline: string[]
  subhead: string
  primaryCta: string
  secondaryCta: string
  scrollCue: string
  segmentsLine: string
}

const ACCENT: Record<Locale, string> = { ar: 'الدواجن', en: 'poultry' }

/**
 * Scene 1 — "Sunrise / poultry production network" (spec §5, signature moment 1).
 * Editorial composition: the two authored headline lines span the full measure; beneath them the
 * supporting copy (start) faces a wide DOME photo (end) that rises into the viewport like a sun, with the
 * Signature Curve over its lower third. Mobile recomposes: dome first (chickens visible), then headline,
 * subhead and the primary CTA — all inside the first 390×844 viewport.
 * Intro is pure CSS (first paint; no JS dependency); scroll parallax is a desktop-only enhancement.
 */
export function Hero({ locale, copy, metrics }: { locale: Locale; copy: HeroCopy; metrics: Metric[] }) {
  return (
    <HeroParallax className="relative isolate overflow-hidden">
      <div className="container-site relative z-10 pt-2 pb-14 lg:pt-4 lg:pb-20">
        <div className="grid grid-cols-1 gap-y-7 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
          {/* ---------- Headline (full measure on desktop) ---------- */}
          <div data-hero-copy className="order-2 lg:order-none lg:col-span-12">
            <p className="eyebrow intro-fade hidden sm:inline-flex" style={{ '--i': 0 } as React.CSSProperties}>
              {copy.eyebrow}
            </p>
            <h1 id="hero-title" className="text-display-2xl font-extrabold text-fg sm:mt-6">
              {copy.headline.map((line, i) => (
                <span key={i} className="mask-line intro-line" style={{ '--i': i } as React.CSSProperties}>
                  <span>{accent(line, ACCENT[locale])}</span>
                  {i < copy.headline.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>
          </div>

          {/* ---------- Supporting copy (start side) ---------- */}
          <div data-hero-copy className="order-3 flex flex-col lg:order-none lg:col-span-5 lg:pt-2">
            <p className="intro-fade max-w-[36ch] text-lead text-fg-soft" style={{ '--i': 1 } as React.CSSProperties}>
              {copy.subhead}
            </p>
            <div className="intro-fade mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ '--i': 2 } as React.CSSProperties}>
              <ButtonLink href="#farm-types" variant="primary" size="lg" className="w-full sm:w-auto">
                {copy.primaryCta}
              </ButtonLink>
              <ButtonLink
                href={href(locale, 'contact', { type: 'farm' })}
                variant="outline"
                size="lg"
                arrow={false}
                className="w-full sm:w-auto"
              >
                {copy.secondaryCta}
              </ButtonLink>
            </div>

            {/* Micro-proof: the three approved statements, qualifiers always visible (spec §0.1 item 4). */}
            <dl className="intro-fade mt-12 grid gap-y-4 border-t border-line pt-6" style={{ '--i': 3 } as React.CSSProperties}>
              {metrics.map((m) => (
                <div key={m.key} className="grid grid-cols-[auto_1fr] items-baseline gap-x-4">
                  <dt className="flex items-baseline gap-1.5 whitespace-nowrap">
                    <span className="text-small font-semibold text-fg-muted">{m.qualifier}</span>
                    <span className="num text-[1.6rem] leading-none font-extrabold tracking-tight text-fg">{m.value}</span>
                    {m.unit ? <span className="text-base font-bold text-fg">{m.unit}</span> : null}
                  </dt>
                  <dd className="text-small leading-snug text-fg-muted">{m.label}</dd>
                </div>
              ))}
            </dl>

            <a
              href="#proof"
              className="intro-fade mt-10 hidden items-center gap-3 self-start text-caption font-medium text-fg-muted hover:text-fg lg:inline-flex"
              style={{ '--i': 5 } as React.CSSProperties}
            >
              <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-line">
                <span className="scroll-cue-line absolute inset-0 block bg-fg" />
              </span>
              {copy.scrollCue}
            </a>
          </div>

          {/* ---------- Dome photo (end side; first on mobile) ---------- */}
          <div className="order-1 lg:order-none lg:col-span-7">
            <div
              data-hero-photo
              className="intro-mask relative aspect-[16/10] overflow-hidden rounded-t-[999px] bg-stone-200 lg:aspect-[8/5]"
            >
              <div data-hero-photo-inner className="intro-zoom absolute inset-0 origin-bottom">
                <Photo
                  id="hero"
                  locale={locale}
                  priority
                  quality={80}
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="absolute -inset-y-[7%] inset-x-0"
                />
              </div>
              {/* Signature Curve over the photo's lower third (PDF p.15), PDF orientation, cropped by the frame. */}
              <div aria-hidden className="pointer-events-none absolute inset-x-[-10%] bottom-[-6%] h-[48%]">
                <SunriseCurve lines={3} tone="dark" cssDraw strokeWidth={7} className="h-full w-full" />
              </div>
              <p
                className="intro-fade absolute start-1/2 bottom-5 z-10 -translate-x-1/2 rounded-full bg-paper px-4 py-2 text-caption font-semibold whitespace-nowrap text-ink shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)] rtl:translate-x-1/2"
                style={{ '--i': 4 } as React.CSSProperties}
              >
                {copy.segmentsLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </HeroParallax>
  )
}
