import { TextReveal } from '@/components/motion/TextReveal'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { cn } from '@/lib/cn'
import { JourneyFlow } from './JourneyFlow'
import { JOURNEY, journeyPath, journeyRail } from './JourneyGeometry'

export type JourneyProps = { locale: Locale; copy: HomeDictionary['journey'] }

/** Flow node: black ring on the vermilion ground; the fill (white, or amber for the destination) is what lights up. */
function FlowNode({ destination = false }: { destination?: boolean }) {
  return destination ? (
    <span data-journey-node="" className="relative block size-7 rounded-full border-2 border-ink bg-vermilion">
      <span data-journey-halo="" className="absolute -inset-2.5 rounded-full border border-ink/50" />
      <span data-journey-fill="" className="absolute inset-0 rounded-full bg-amber" />
    </span>
  ) : (
    <span data-journey-node="" className="relative block size-5 rounded-full border-2 border-ink bg-vermilion">
      <span data-journey-fill="" className="absolute inset-0 rounded-full bg-paper" />
    </span>
  )
}

/**
 * Scene 6 — Distribution journey (vermilion ground, "peak sun"); ALL text is black (5.7:1).
 * One ordered list serves both layouts:
 *  - ≥1024px: a 6-column grid (steps 1–5 + destination) with three rows — odd steps above, the flow band
 *    in the middle, even steps and the destination label below — so text never sits on the line. The ol
 *    is a subgrid of the wrapper so the band and the destination share its tracks. The path is a
 *    Distribution Flow: straight runs, 45° turns, five white nodes and ONE amber destination node; in
 *    Arabic it runs right → left.
 *  - <1024px: a vertical line along the start edge with nodes; blocks sit to the inline-end.
 * The steps are a proposed process (journey.note says so); no SLA or delivery-time promise.
 */
export function Journey({ locale, copy }: JourneyProps) {
  const d = journeyPath(JOURNEY.width, JOURNEY.height, locale === 'ar')
  const lastStep = copy.steps.length - 1

  return (
    <section id="journey" data-theme="vermilion" aria-labelledby="journey-title" className="relative overflow-x-clip">
      <div className="container-site section-y">
        <div className="grid-site gap-y-8 lg:items-end">
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <p data-reveal="fade" className="inline-flex items-center gap-3 text-small font-semibold text-fg">
              <span aria-hidden className="h-0.5 w-7 rounded-full bg-ink" />
              {copy.eyebrow}
            </p>
            <TextReveal as="h2" id="journey-title" lines={[copy.title]} className="mt-6 text-display-lg font-bold text-fg" />
          </div>
          <p data-reveal="up" className="col-span-4 text-lead text-fg md:col-span-6 lg:col-span-4 lg:col-start-9">
            {copy.intro}
          </p>
        </div>

        <JourneyFlow className="relative mt-16 lg:mt-28 lg:grid lg:grid-cols-6 lg:grid-rows-[auto_7rem_auto]">
          <ol className="relative lg:col-start-1 lg:col-end-7 lg:row-start-1 lg:row-end-4 lg:grid lg:grid-cols-subgrid lg:grid-rows-subgrid">
            {copy.steps.map((step, i) => (
              <li
                key={step.title}
                data-journey-block=""
                className={cn(
                  'relative ps-12 pb-10 lg:ps-0 lg:pe-10',
                  i % 2 === 0 ? 'lg:row-start-1 lg:self-end lg:pb-8' : 'lg:row-start-3 lg:self-start lg:pt-8 lg:pb-0',
                )}
                style={{ gridColumn: `${i + 1} / span 2` }}
              >
                {/* Mobile: node + connector to the next node along the start edge. */}
                <span aria-hidden data-journey-mnode="" className="absolute start-0 top-[3px] lg:hidden">
                  <FlowNode />
                </span>
                <span aria-hidden className="absolute start-[9px] top-[23px] -bottom-[3px] w-0.5 bg-ink/20 lg:hidden">
                  <span data-journey-seg="" className="absolute inset-0 origin-top bg-ink" />
                </span>

                <span aria-hidden className="num inline-block text-small font-bold text-fg">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={cn('mt-2 text-title font-bold text-fg', i === lastStep && 'lg:max-w-[16ch]')}>{step.title}</h3>
                <p className="mt-2 max-w-[38ch] text-small text-fg">{step.body}</p>
              </li>
            ))}
          </ol>

          {/* Desktop flow band (decorative; the list above carries the content). */}
          <div
            aria-hidden
            data-journey-band=""
            className="pointer-events-none relative hidden text-ink lg:col-start-1 lg:col-end-7 lg:row-start-2 lg:block"
          >
            <svg
              className="absolute inset-0 size-full overflow-visible"
              viewBox={`0 0 ${JOURNEY.width} ${JOURNEY.height}`}
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                data-journey-track=""
                d={d}
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeWidth={2}
                strokeDasharray="2 8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                data-journey-line=""
                d={d}
                pathLength={1}
                stroke="currentColor"
                strokeWidth={3}
                strokeLinejoin="round"
                strokeDasharray="1 1"
                strokeDashoffset={0}
              />
            </svg>
            {copy.steps.map((step, k) => (
              <span
                key={step.title}
                className="absolute -translate-y-1/2"
                style={{ top: journeyRail(k), insetInlineStart: `${(k * 100) / JOURNEY.columns}%` }}
              >
                <FlowNode />
              </span>
            ))}
            <span
              className="absolute -translate-y-1/2"
              style={{
                top: journeyRail(JOURNEY.spans),
                insetInlineStart: `calc(${(JOURNEY.spans * 100) / JOURNEY.columns}% - 4px)`,
              }}
            >
              <FlowNode destination />
            </span>
          </div>

          {/* Destination: the amber node is the only amber in view. */}
          <div data-journey-block="" className="relative ps-12 lg:col-start-6 lg:row-start-3 lg:self-start lg:ps-0 lg:pt-7">
            <span aria-hidden data-journey-mnode="" className="absolute -start-1 top-[3px] lg:hidden">
              <FlowNode destination />
            </span>
            <p className="text-display-md font-extrabold text-fg">{copy.destinationLabel}</p>
          </div>
        </JourneyFlow>

        <p className="mt-16 max-w-[72ch] border-t border-line pt-6 text-small text-fg lg:mt-24">{copy.note}</p>
      </div>
    </section>
  )
}
