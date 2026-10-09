import { Photo } from '@/components/media/Photo'
import { ArrowLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { PhotoId } from '@/content/photos'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { href } from '@/i18n/routing'
import { FarmTypesScroller } from './FarmTypesScroller'

export type FarmTypesProps = { locale: Locale; copy: HomeDictionary['farmTypes'] }

const SEGMENTS = {
  broilers: 'segmentBroilers',
  layers: 'segmentLayers',
  breeders: 'segmentBreeders',
} as const satisfies Record<string, PhotoId>

type SegmentKey = keyof typeof SEGMENTS
const isSegment = (key: string): key is SegmentKey => key in SEGMENTS

/**
 * Scene 4 — Farm types (warm grey, "day"). Anchor target of the hero CTA (#farm-types).
 * Header (eyebrow, two authored lines, intro at the end column), then three chapters.
 * ≥1024px: chapters (start, 5 cols, each ≥ 80vh) scroll beside a sticky media frame (end, 7 cols) that
 * swaps the segment photographs — see FarmTypesScroller. <1024px: natural flow, photo (4:3) then text.
 * Chapters are real h3 headings in reading order; the frame is decorative (aria-hidden, nothing focusable).
 */
export function FarmTypes({ locale, copy }: FarmTypesProps) {
  const items = copy.items.filter((item) => isSegment(item.key))
  const total = String(items.length).padStart(2, '0')

  return (
    <section id="farm-types" data-theme="warm" aria-labelledby="farm-types-title" className="relative">
      <div className="container-site section-y">
        <div className="grid-site gap-y-8 lg:gap-y-10">
          <SectionHeading
            id="farm-types-title"
            eyebrow={copy.eyebrow}
            title={copy.title}
            size="lg"
            className="col-span-4 md:col-span-8 lg:col-span-10"
          />
          <p
            data-reveal="up"
            className="col-span-4 text-lead text-fg-soft md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8"
          >
            {copy.intro}
          </p>
        </div>

        <FarmTypesScroller className="mt-14 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-x-[clamp(1rem,2vw,2rem)]">
          {/* ---------- Chapters (start) ---------- */}
          <div className="flex flex-col gap-20 sm:gap-24 lg:col-span-5 lg:gap-0">
            {items.map((item) => {
              const key = item.key as SegmentKey
              return (
                <article
                  key={key}
                  data-ft-chapter=""
                  aria-labelledby={`farm-${key}-title`}
                  className="flex flex-col lg:min-h-[80vh] lg:justify-center lg:py-16"
                >
                  <Photo
                    id={SEGMENTS[key]}
                    locale={locale}
                    reveal
                    sizes="(min-width: 768px) 90vw, 100vw"
                    className="mb-9 aspect-[4/3] lg:hidden"
                  />
                  <div data-reveal="up">
                    <span aria-hidden className="num inline-block text-index font-extrabold tracking-tight text-vermilion">
                      {item.index}
                    </span>
                    <p className="mt-6 flex items-center gap-3 text-small font-semibold text-fg">
                      <span>{item.name}</span>
                      {item.latin !== item.name ? (
                        <>
                          <span aria-hidden className="h-px w-6 bg-line-strong" />
                          <span lang="en" className="latin-run font-medium text-fg-muted">
                            {item.latin}
                          </span>
                        </>
                      ) : null}
                    </p>
                    <h3 id={`farm-${key}-title`} className="mt-4 max-w-[18ch] text-display-md font-bold text-fg">
                      {item.title}
                    </h3>
                    <p className="mt-5 max-w-[46ch] text-body text-fg-soft">{item.body}</p>

                    {/* Points with flow-node bullets (Distribution Flow grammar: round nodes, straight links). */}
                    <ul className="mt-8 flex flex-col gap-4">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="relative flex gap-4 text-body text-fg after:absolute after:start-[5px] after:top-[calc(0.5lh_+_5.5px)] after:bottom-[calc(-1rem_-_0.5lh_+_5.5px)] after:w-px after:bg-fg/30 last:after:hidden"
                        >
                          <span
                            aria-hidden
                            className="relative z-10 mt-[calc(0.5lh_-_5.5px)] size-[11px] shrink-0 rounded-full border-2 border-fg bg-surface"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <ArrowLink href={href(locale, key)} className="mt-9 text-lead">
                      {item.cta}
                    </ArrowLink>
                  </div>
                </article>
              )
            })}
          </div>

          {/* ---------- Sticky media frame (end, desktop only) ---------- */}
          <div aria-hidden className="hidden lg:col-span-7 lg:block">
            <div className="sticky top-24 h-[calc(100svh_-_8.75rem)] min-h-[30rem]">
              <div className="relative isolate h-full overflow-hidden bg-ink">
                {items.map((item, i) => (
                  <div
                    key={item.key}
                    data-ft-layer=""
                    className="absolute inset-0 origin-bottom overflow-hidden"
                    style={{ clipPath: i === 0 ? undefined : 'inset(100% 0% 0% 0%)', zIndex: i === 0 ? 3 : 1 }}
                  >
                    <div data-ft-media="" className="absolute inset-0">
                      <Photo
                        id={SEGMENTS[item.key as SegmentKey]}
                        locale={locale}
                        decorative
                        sizes="(min-width: 1024px) 56vw, 1px"
                        className="absolute inset-0"
                      />
                    </div>
                  </div>
                ))}

                {/* Base overlay: ≥ 50% black under the white index, name and progress. */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/80 via-black/55 to-transparent px-8 pt-28 pb-8 text-white xl:px-10 xl:pb-10">
                  <div className="flex items-end justify-between gap-8">
                    <div className="flex items-end gap-5">
                      <span className="grid overflow-hidden">
                        {items.map((item, i) => (
                          <span
                            key={item.key}
                            data-ft-index=""
                            className="num col-start-1 row-start-1 text-[clamp(3.25rem,1.5rem+3vw,5rem)] leading-[0.9] font-extrabold tracking-tight"
                            style={i === 0 ? undefined : { opacity: 0, visibility: 'hidden' }}
                          >
                            {item.index}
                          </span>
                        ))}
                      </span>
                      <span className="grid overflow-hidden pb-1">
                        <span className="num col-start-1 row-start-1 mb-1 self-start justify-self-start text-caption font-semibold text-white/75">
                          / {total}
                        </span>
                        {items.map((item, i) => (
                          <span
                            key={item.key}
                            data-ft-name=""
                            className="col-start-1 row-start-1 self-end pt-6 text-title leading-tight font-bold whitespace-nowrap"
                            style={i === 0 ? undefined : { opacity: 0, visibility: 'hidden' }}
                          >
                            {item.name}
                          </span>
                        ))}
                      </span>
                    </div>

                    {/* Progress — grows from the start edge (right in Arabic). */}
                    <span className="mb-2 flex w-[clamp(7rem,10vw,10rem)] gap-1.5">
                      {items.map((item, i) => (
                        <span key={item.key} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                          <span
                            data-ft-bar=""
                            className="absolute inset-0 origin-right rounded-full bg-white ltr:origin-left"
                            style={{ transform: i === 0 ? 'scaleX(1)' : 'scaleX(0)' }}
                          />
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FarmTypesScroller>
      </div>
    </section>
  )
}
