import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import type { AboutDictionary } from '@/i18n/dictionaries/ar/about'
import { href } from '@/i18n/routing'
import type { Metric } from '@/lib/content'
import { cn } from '@/lib/cn'
import { Logo } from '@/components/brand/Logo'
import { VetGrid } from '@/components/brand/VetGrid'
import { TextReveal } from '@/components/motion/TextReveal'
import { ArrowIcon, SEGMENT_ICONS } from '@/components/ui/icons'
import { ChapterMarker } from './ChapterMarker'

/*
 * About — numbered editorial chapters 01–05 (docs/art-direction.md §7, spec §6.1).
 * Each chapter: marker (index + hairline) → authored title → offset body columns. Reveals are declarative
 * (`data-reveal` + `data-reveal-delay`) so they stagger in time AND sit on offset grid columns in space.
 * Rhythm: white · warm · white · black · white, then vision/mission on warm before the black CtaBand.
 */

const delay = (n: number) => String(Math.round(n * 100) / 100)

/* ------------------------------------------------------------------ 01 · Who we are */

export function ChapterWho({ copy }: { copy: AboutDictionary['who'] }) {
  const [lead, ...rest] = copy.paragraphs
  return (
    <section aria-labelledby="chapter-who" data-theme="light" className="section-y bg-surface text-fg">
      <div className="container-site">
        <ChapterMarker index={copy.index} />
        <div className="grid-site mt-10 gap-y-10 lg:mt-16">
          <TextReveal
            as="h2"
            id="chapter-who"
            lines={[copy.title]}
            className="col-span-4 text-display-lg font-bold md:col-span-7 lg:col-span-6"
          />
          <div className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8 lg:pt-36">
            <p data-reveal="up" className="text-lead font-medium text-fg">
              {lead}
            </p>
            {rest.map((paragraph, n) => (
              <p key={n} data-reveal="up" data-reveal-delay={delay(0.08 * (n + 1))} className="mt-6 text-body text-fg-soft">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 02 · Why "الشروق" */

/** Brand-book plate: corner marks frame the mandatory clear space around the official lockup. */
function ClearSpaceFrame({ children }: { children: ReactNode }) {
  const mark = 'absolute size-4 border-stone-400 lg:size-5'
  return (
    <span className="relative inline-block">
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0">
        <span className={cn(mark, 'start-0 top-0 border-s border-t')} />
        <span className={cn(mark, 'end-0 top-0 border-e border-t')} />
        <span className={cn(mark, 'start-0 bottom-0 border-s border-b')} />
        <span className={cn(mark, 'end-0 bottom-0 border-e border-b')} />
      </span>
    </span>
  )
}

export function ChapterName({ copy, logoAlt }: { copy: AboutDictionary['name']; logoAlt: string }) {
  return (
    <section aria-labelledby="chapter-name" data-theme="warm" className="section-y bg-surface text-fg">
      <div className="container-site">
        <ChapterMarker index={copy.index} />
        <div className="grid-site mt-10 gap-y-10 lg:mt-16 lg:items-center">
          <TextReveal
            as="h2"
            id="chapter-name"
            lines={[copy.title]}
            className="col-span-4 text-display-lg font-bold md:col-span-7 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end"
          />
          <figure className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div data-reveal="image" className="grid aspect-square place-items-center bg-paper sm:aspect-[4/3] lg:aspect-square">
              <ClearSpaceFrame>
                <Logo variant="color" width={196} alt={logoAlt} withClearSpace className="sm:hidden" />
                <Logo variant="color" width={260} alt={logoAlt} withClearSpace className="hidden sm:inline-block lg:hidden" />
                <Logo variant="color" width={340} alt={logoAlt} withClearSpace className="hidden lg:inline-block" />
              </ClearSpaceFrame>
            </div>
            <figcaption data-reveal="up" className="mt-5 max-w-xl border-t border-line pt-5 text-small text-fg-muted">
              {copy.note}
            </figcaption>
          </figure>
          <p
            data-reveal="up"
            data-reveal-delay="0.1"
            className="col-span-4 text-lead text-fg md:col-span-7 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:self-start"
          >
            {copy.body}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 03 · Poultry-only focus */

type SegmentCopy = { name: string; latin: string; short: string }
const SEGMENTS = ['broilers', 'layers', 'breeders'] as const

export function ChapterFocus({
  locale,
  copy,
  segments,
}: {
  locale: Locale
  copy: AboutDictionary['focus']
  segments: Record<(typeof SEGMENTS)[number], SegmentCopy>
}) {
  return (
    <section aria-labelledby="chapter-focus" data-theme="light" className="section-y bg-surface text-fg">
      <div className="container-site">
        <ChapterMarker index={copy.index} />
        <div className="grid-site mt-10 gap-y-12 lg:mt-16">
          <div className="col-span-4 md:col-span-7 lg:col-span-5">
            <TextReveal as="h2" id="chapter-focus" lines={[copy.title]} className="text-display-lg font-bold" />
            <p data-reveal="up" className="mt-8 text-lead text-fg-soft">
              {copy.body}
            </p>
          </div>
          <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7 lg:pt-32">
            <p data-reveal="fade" className="text-small text-fg-muted">
              {copy.segmentsIntro}
            </p>
            <ul className="mt-6 border-t border-line">
              {SEGMENTS.map((key, n) => {
                const Icon = SEGMENT_ICONS[key]
                const segment = segments[key]
                return (
                  <li key={key} data-reveal="up" data-reveal-delay={delay(n * 0.08)} className="border-b border-line">
                    <Link
                      href={href(locale, key)}
                      className="group/seg flex items-center gap-5 py-7 transition-colors duration-300 hover:text-accent focus-visible:text-accent sm:gap-7 lg:py-9"
                    >
                      <Icon size={44} className="shrink-0" />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <span className="text-display-md font-bold">{segment.name}</span>
                          {segment.latin !== segment.name ? (
                            <span className="num text-caption tracking-[0.16em] text-fg-muted uppercase">{segment.latin}</span>
                          ) : null}
                        </span>
                        <span className="mt-2 block text-small text-fg-soft">{segment.short}</span>
                      </span>
                      <ArrowIcon
                        size={24}
                        className="shrink-0 transition-transform duration-300 ease-(--ease-sunrise) group-hover/seg:-translate-x-1.5 ltr:group-hover/seg:translate-x-1.5"
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 04 · Scale as typographic sentences */

/** Each sentence steps one column further toward the inline end: the figures read right→left in Arabic. */
const SENTENCE_OFFSETS = ['lg:col-span-9', 'lg:col-span-9 lg:col-start-3', 'lg:col-span-9 lg:col-start-4']

export function ChapterScale({ copy, metrics, footnote }: { copy: AboutDictionary['scale']; metrics: Metric[]; footnote: string }) {
  return (
    <section aria-labelledby="chapter-scale" data-theme="dark" className="section-y bg-surface text-fg">
      <div className="container-site">
        <ChapterMarker index={copy.index} />
        <div className="grid-site mt-10 gap-y-8 lg:mt-16">
          <TextReveal
            as="h2"
            id="chapter-scale"
            lines={[copy.title]}
            className="col-span-4 text-display-lg font-bold md:col-span-6 lg:col-span-5"
          />
          <p
            data-reveal="up"
            className="col-span-4 text-lead text-fg-soft md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8 lg:self-end"
          >
            {copy.intro}
          </p>
        </div>
        <ul className="mt-14 border-b border-line lg:mt-24">
          {metrics.map((metric, n) => (
            <li key={metric.key} className="grid-site border-t border-line py-9 lg:py-14">
              <p
                data-reveal="up"
                data-reveal-delay={delay(n * 0.08)}
                className={cn('col-span-4 text-display-md leading-[1.45] font-bold md:col-span-8', SENTENCE_OFFSETS[n] ?? 'lg:col-span-9')}
              >
                <span className="text-fg-muted">{metric.qualifier}</span>{' '}
                <span className="num inline-block text-[clamp(4rem,1.4rem+7.4vw,10.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-fg">
                  {metric.value}
                </span>{' '}
                {metric.unit ? <span className="text-fg">{metric.unit} </span> : null}
                <span className="font-medium text-fg-soft">{metric.label}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-caption text-fg-muted">{footnote}</p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ 05 · Principles */

/** Veterinary Grid for the four values: one vermilion, one black, one amber (brand rule). */
const PRINCIPLE_CELLS: ('vermilion' | 'black' | 'amber' | null)[] = [
  null, null, null, null,
  null, 'vermilion', null, null,
  null, null, null, 'black',
  null, null, 'amber', null,
]

export function ChapterPrinciples({ copy }: { copy: AboutDictionary['principles'] }) {
  return (
    <section aria-labelledby="chapter-principles" data-theme="light" className="section-y bg-surface text-fg">
      <div className="container-site">
        <ChapterMarker index={copy.index} />
        <div className="grid-site mt-10 gap-y-12 lg:mt-16">
          <div className="col-span-4 md:col-span-8 lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <TextReveal as="h2" id="chapter-principles" lines={[copy.title]} className="text-display-lg font-bold" />
              <p data-reveal="up" className="measure-narrow mt-6 text-lead text-fg-soft">
                {copy.intro}
              </p>
              <div data-reveal="fade" data-reveal-delay="0.15" className="mt-10 w-32 sm:w-40 lg:mt-16 lg:w-56">
                <VetGrid cells={PRINCIPLE_CELLS} />
              </div>
            </div>
          </div>
          <ol className="col-span-4 border-t border-line md:col-span-8 lg:col-span-6 lg:col-start-7">
            {copy.items.map((item, n) => (
              <li
                key={item.key}
                data-reveal="up"
                data-reveal-delay={delay(n * 0.06)}
                className="grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-line py-8 sm:grid-cols-[3rem_1fr] lg:py-11"
              >
                <div aria-hidden className="pt-3 lg:pt-4">
                  <span className="num text-small font-semibold text-fg-muted">{String(n + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="text-display-md font-bold">{item.title}</h3>
                  <p className="mt-3 max-w-xl text-body text-fg-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ Vision · Mission */

export function VisionMission({ copy }: { copy: AboutDictionary['visionMission'] }) {
  return (
    <section data-theme="warm" className="section-y bg-surface text-fg">
      <div className="container-site">
        <div className="grid-site">
          <div className="col-span-4 md:col-span-8 lg:col-span-10">
            <h2 className="eyebrow">{copy.vision.title}</h2>
            <p data-reveal="up" className="mt-6 text-display-lg font-bold lg:mt-8">
              {copy.vision.body}
            </p>
          </div>
        </div>
        {/* Mission steps toward the inline end, under a hairline — the pair reads right→left in Arabic. */}
        <div className="grid-site mt-14 lg:mt-24">
          <div className="col-span-4 border-t border-line pt-8 md:col-span-7 md:col-start-2 lg:col-span-6 lg:col-start-7 lg:pt-10">
            <h2 className="eyebrow">{copy.mission.title}</h2>
            <p data-reveal="up" data-reveal-delay="0.1" className="mt-6 text-title font-medium text-fg-soft">
              {copy.mission.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
