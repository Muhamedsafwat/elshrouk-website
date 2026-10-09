import { Photo } from '@/components/media/Photo'
import { accent } from '@/components/motion/Accent'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { cn } from '@/lib/cn'
import { StatementMotion } from './StatementMotion'

export type StatementProps = { locale: Locale; copy: HomeDictionary['statement'] }

/**
 * Scene 3 — Statement (white, "morning"). A typographic reset between the black proof band and the
 * farm-type chapters: two authored display lines (the key phrase in vermilion), set against each other
 * — line 1 from the start edge, line 2 to the end edge — then a full-width horizon hairline. The arch
 * window (the sun on the horizon) sits at the inline-end with its dome rising above that horizon, and
 * overlaps the section's bottom edge into the warm-grey farm-types scene.
 *
 * Desktop: the horizon is placed exactly at the base of the arch's dome (half the photo's width, derived
 * from the same container / grid maths as `container-site` + `grid-site`). Mobile: the horizon divides the
 * statement from the caption; the arch follows at the end side.
 */
export function Statement({ locale, copy }: StatementProps) {
  return (
    <StatementMotion
      labelledBy="statement-title"
      className="relative z-10 overflow-x-clip pt-[clamp(4.5rem,2.2rem+7.6vw,11rem)]"
    >
      <div className="container-site">
        {/* Below 640px the scale steps down slightly so the two authored lines read in ≤ 4 visual lines. */}
        <h2
          id="statement-title"
          data-reveal="lines"
          className="text-display-xl font-extrabold text-fg max-sm:text-[clamp(1.75rem,7.6vw,2.3rem)]"
        >
          {copy.lines.map((line, i) => (
            <span key={i} data-statement-line="" className={cn('mask-line', i % 2 === 1 && 'lg:text-end')}>
              <span>{accent(line, copy.accent)}</span>
              {i < copy.lines.length - 1 ? ' ' : null}
            </span>
          ))}
        </h2>
      </div>

      <div
        data-statement-row=""
        className="relative mt-10 [--horizon:0px] lg:mt-20 lg:[--horizon:calc((min(100vw,96rem)_-_2*clamp(1.25rem,6vw,5.5rem))/6_-_clamp(1rem,2vw,2rem)/3)]"
      >
        {/* Horizon hairline — grows from the start edge; passes behind the arch window. */}
        <span
          aria-hidden
          data-statement-horizon=""
          className="absolute inset-x-0 top-(--horizon) h-px origin-right bg-line-strong ltr:origin-left"
        />
        <div className="container-site grid-site">
          <p
            data-reveal="up"
            className="col-span-4 max-w-[34ch] pt-8 text-lead text-fg-muted md:col-span-4 lg:col-span-4 lg:pt-[calc(var(--horizon)_+_2.25rem)]"
          >
            {copy.caption}
          </p>
          <div className="relative z-10 col-span-3 col-start-2 mt-10 -mb-10 md:col-span-4 md:col-start-5 md:mt-0 md:-mb-16 lg:col-span-4 lg:col-start-9 lg:-mb-28">
            <Photo
              id="statement"
              locale={locale}
              shape="arch"
              reveal
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 72vw"
              className="aspect-[3/4]"
              dataAttr={{ 'data-statement-photo': '' }}
            />
          </div>
        </div>
      </div>
    </StatementMotion>
  )
}
