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
 * Who / for whom / what / proof / next action are all in the first screen.
 * Intro choreography is CSS (first paint): curve draws → arch photo opens like a rising sun →
 * headline lines rise → subhead, CTAs, micro-proof. Scroll parallax is a desktop-only enhancement.
 */
export function Hero({ locale, copy, metrics }: { locale: Locale; copy: HeroCopy; metrics: Metric[] }) {
  return (
    <HeroParallax className="relative isolate overflow-hidden">
      <div className="container-site grid-site relative z-10 items-center gap-y-12 pt-4 pb-16 lg:min-h-[max(40rem,calc(100svh-10.75rem))] lg:pt-2 lg:pb-14">
        {/* ---------- Copy ---------- */}
        <div data-hero-copy className="col-span-4 md:col-span-8 lg:col-span-7 lg:pe-6 xl:pe-14">
          <p className="eyebrow intro-fade" style={{ '--i': 0 } as React.CSSProperties}>
            {copy.eyebrow}
          </p>
          <h1 id="hero-title" className="mt-7 text-display-2xl font-extrabold text-fg">
            {copy.headline.map((line, i) => (
              <span key={i} className="mask-line intro-line" style={{ '--i': i } as React.CSSProperties}>
                <span>{accent(line, ACCENT[locale])}</span>
                {i < copy.headline.length - 1 ? ' ' : null}
              </span>
            ))}
          </h1>
          <p className="intro-fade mt-8 max-w-[38ch] text-lead text-fg-soft" style={{ '--i': 1 } as React.CSSProperties}>
            {copy.subhead}
          </p>
          <div className="intro-fade mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ '--i': 2 } as React.CSSProperties}>
            <ButtonLink href="#farm-types" variant="primary" size="lg" className="w-full sm:w-auto">
              {copy.primaryCta}
            </ButtonLink>
            <ButtonLink href={href(locale, 'contact', { type: 'farm' })} variant="outline" size="lg" arrow={false} className="w-full sm:w-auto">
              {copy.secondaryCta}
            </ButtonLink>
          </div>

          {/* Micro-proof: the three approved statements, qualifiers always visible (spec §0.1 item 4). */}
          <dl className="intro-fade mt-14 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-line pt-6 sm:grid-cols-3" style={{ '--i': 3 } as React.CSSProperties}>
            {metrics.map((m) => (
              <div key={m.key} className="flex items-baseline gap-3 sm:block">
                <dt className="flex items-baseline gap-1.5 whitespace-nowrap">
                  <span className="text-small font-semibold text-fg-muted">{m.qualifier}</span>
                  <span className="num text-[1.75rem] leading-none font-extrabold tracking-tight text-fg">{m.value}</span>
                  {m.unit ? <span className="text-base font-bold text-fg">{m.unit}</span> : null}
                </dt>
                <dd className="text-caption leading-snug text-fg-muted sm:mt-2">{m.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---------- Arch photo ---------- */}
        <div className="relative col-span-4 md:col-span-6 md:col-start-2 lg:col-span-5 lg:col-start-auto">
          <div data-hero-photo className="intro-mask relative aspect-[4/5] overflow-hidden rounded-t-full bg-stone-200">
            <div data-hero-photo-inner className="intro-zoom absolute inset-0 origin-bottom">
              <Photo
                id="hero"
                locale={locale}
                priority
                quality={80}
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 75vw, 100vw"
                className="absolute -inset-y-[6%] inset-x-0"
              />
            </div>
            {/* Signature Curve over the photo's lower third (PDF p.15 "Curve over the lower third"), PDF orientation,
                cropped by the arch frame — it can never touch the copy. */}
            <div aria-hidden className="pointer-events-none absolute inset-x-[-12%] bottom-[-4%] h-[46%]">
              <SunriseCurve lines={3} tone="dark" cssDraw strokeWidth={7} className="h-full w-full" />
            </div>
          </div>
          <p
            className="intro-fade absolute start-1/2 bottom-6 z-10 -translate-x-1/2 rounded-full bg-paper px-4 py-2 text-caption font-semibold whitespace-nowrap text-ink shadow-[0_8px_30px_-12px_rgb(0_0_0/0.35)] rtl:translate-x-1/2"
            style={{ '--i': 4 } as React.CSSProperties}
          >
            {copy.segmentsLine}
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#proof"
        className="intro-fade absolute start-[clamp(1.25rem,4vw,5.5rem)] bottom-6 z-10 hidden items-center gap-3 text-caption font-medium text-fg-muted hover:text-fg lg:inline-flex"
        style={{ '--i': 5 } as React.CSSProperties}
      >
        <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-line">
          <span className="scroll-cue-line absolute inset-0 block bg-fg" />
        </span>
        {copy.scrollCue}
      </a>
    </HeroParallax>
  )
}
