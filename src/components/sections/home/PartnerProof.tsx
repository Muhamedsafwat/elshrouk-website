import { Photo } from '@/components/media/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { PhotoId } from '@/content/photos'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { cn } from '@/lib/cn'
import type { Metric } from '@/lib/content'
import { PartnerProofMotion } from './PartnerProofMotion'

export type PartnerProofProps = { locale: Locale; copy: HomeDictionary['partnerProof']; metrics: Metric[] }

/* Detail crops — Scene 4 (farm types) owns the wide segment photographs. */
const PHOTO: Record<string, PhotoId> = {
  broilers: 'broilersDetail',
  layers: 'layersDetail',
  breeders: 'breedersDetail',
}
/* Staggered triptych: mobile = one wide frame + two portraits; md+ = three portraits stepping down toward the inline-end. */
const ITEM = ['col-span-2 md:col-span-1', 'md:mt-24', 'mt-12 md:mt-48']
const FRAME = ['aspect-[4/3] md:aspect-[4/5]', 'aspect-[3/4] md:aspect-[4/5]', 'aspect-[3/4] md:aspect-[4/5]']
const DEPTH = [6, 12, 16]

/** Final (no-JS / reduced-motion) underline — PartnerProofMotion scrubs its width from 0. */
const STATEMENT_RULE =
  'bg-[linear-gradient(var(--color-vermilion),var(--color-vermilion))] bg-no-repeat [background-size:100%_0.09em] [background-position:100%_100%] ltr:[background-position:0%_100%]'

type Piece = { text: string } | { key: string; lead: string; value: string; rest: string }

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Finds each approved statement inside the narrative without rewriting it: the metric label (exact,
 * case-insensitive), the figure (+ unit) right before it, and the approximate qualifier before that.
 * Anything not found stays plain text — the narrative itself is never altered.
 */
function splitNarrative(narrative: string, metrics: Metric[], qualifiers: string[]): Piece[] {
  const haystack = narrative.toLowerCase()
  const hits: { start: number; end: number; key: string; lead: string; value: string; rest: string }[] = []
  for (const m of metrics) {
    const label = m.label.trim()
    if (!label || !m.value) continue
    const at = haystack.indexOf(label.toLowerCase())
    if (at < 0) continue
    const unit = m.unit.trim()
    const figure = narrative
      .slice(0, at)
      .match(new RegExp(`${escapeRe(m.value)}${unit ? `\\s+${escapeRe(unit)}` : ''}\\s+$`, 'u'))
    if (!figure || figure.index === undefined) continue
    let start = figure.index
    for (const q of qualifiers) {
      const before = narrative.slice(0, start).match(new RegExp(`${escapeRe(q)}\\s+$`, 'iu'))
      if (q && before && before.index !== undefined) {
        start = before.index
        break
      }
    }
    const end = at + label.length
    hits.push({
      start,
      end,
      key: m.key,
      lead: narrative.slice(start, figure.index),
      value: m.value,
      rest: narrative.slice(figure.index + m.value.length, end),
    })
  }
  hits.sort((a, b) => a.start - b.start)
  const pieces: Piece[] = []
  let cursor = 0
  for (const h of hits) {
    if (h.start < cursor) continue
    if (h.start > cursor) pieces.push({ text: narrative.slice(cursor, h.start) })
    pieces.push({ key: h.key, lead: h.lead, value: h.value, rest: h.rest })
    cursor = h.end
  }
  if (cursor < narrative.length) pieces.push({ text: narrative.slice(cursor) })
  return pieces
}

/**
 * Scene 9 · Partner proof (warm grey). docs/art-direction.md §5, spec Scene 9.
 * The approved statements are re-read inside an editorial narrative (not another counter row) and a
 * documentary triptych shows the three segments served. No quotes, no names, no logos.
 */
export function PartnerProof({ locale, copy, metrics }: PartnerProofProps) {
  const qualifiers = [copy.narrativeQualifier, ...metrics.map((m) => m.qualifier)].filter(Boolean)
  const pieces = splitNarrative(copy.narrative, metrics, qualifiers)

  return (
    <section
      id="partner-proof"
      data-theme="warm"
      aria-labelledby="partner-proof-title"
      className="section-y overflow-hidden bg-surface text-fg"
    >
      <PartnerProofMotion className="container-site">
        <div className="grid-site gap-y-10 md:gap-y-14">
          <div className="col-span-full lg:col-span-7">
            <SectionHeading id="partner-proof-title" eyebrow={copy.eyebrow} title={copy.title} size="lg" />
          </div>
          <p
            className="col-span-full max-w-[30ch] text-[1.5rem] leading-[1.6] font-normal text-fg-soft md:col-span-7 md:col-start-2 md:text-display-md md:leading-[1.6] lg:col-span-9 lg:col-start-3"
            data-reveal="up"
          >
            {pieces.map((piece, i) =>
              'text' in piece ? (
                piece.text
              ) : (
                <strong key={`${piece.key}-${i}`} data-pp-statement="" className={cn('font-bold text-fg', STATEMENT_RULE)}>
                  {piece.lead}
                  <span className="num">{piece.value}</span>
                  {piece.rest}
                </strong>
              ),
            )}
          </p>
        </div>

        <ul data-pp-triptych="" className="mt-20 grid grid-cols-2 items-start gap-x-4 gap-y-12 md:mt-28 md:grid-cols-3 md:gap-x-6 lg:gap-x-8">
          {copy.segments.map((segment, i) => (
            <li key={segment.key} className={ITEM[i % ITEM.length]}>
              <figure data-pp-depth={DEPTH[i % DEPTH.length]} data-reveal-manual="">
                <Photo
                  id={PHOTO[segment.key] ?? 'ambient'}
                  locale={locale}
                  sizes="(min-width: 48rem) 31vw, (min-width: 23.75rem) 50vw, 100vw"
                  className={cn('relative w-full overflow-hidden bg-stone-200', FRAME[i % FRAME.length])}
                  reveal
                />
                <figcaption className="mt-4 border-t border-line pt-4 md:mt-5" data-reveal="up">
                  <span className="flex items-baseline gap-3">
                    <span className="num text-small font-semibold text-fg-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-title font-bold">{segment.label}</span>
                  </span>
                  <span className="mt-1 block text-small text-fg-muted">{segment.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </PartnerProofMotion>
    </section>
  )
}
