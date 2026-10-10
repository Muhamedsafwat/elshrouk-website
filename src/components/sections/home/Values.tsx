import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { cn } from '@/lib/cn'
import { ValuesMotion } from './ValuesMotion'

export type ValuesProps = { locale: Locale; copy: HomeDictionary['values'] }

type Slot = 1 | 2 | 3 | 4
type ModuleTone = 'vermilion' | 'black' | 'amber' | 'empty'

/* Static class maps (Tailwind cannot see interpolated class names). Column 1 = inline-start. */
const COL: Record<Slot, string> = { 1: 'md:col-start-1', 2: 'md:col-start-2', 3: 'md:col-start-3', 4: 'md:col-start-4' }
const ROW: Record<Slot, string> = { 1: 'md:row-start-1', 2: 'md:row-start-2', 3: 'md:row-start-3', 4: 'md:row-start-4' }

/**
 * Veterinary Grid composition (4×4 = 16 modules): four value cells spanning two modules each step
 * diagonally across the grid; exactly one vermilion, one black and one amber module; five empty
 * warm-grey modules.
 */
const VALUE_SLOTS: { col: Slot; row: Slot }[] = [
  { col: 1, row: 1 },
  { col: 2, row: 2 },
  { col: 3, row: 3 },
  { col: 1, row: 4 },
]
const MODULES: { col: Slot; row: Slot; tone: ModuleTone }[] = [
  { col: 3, row: 1, tone: 'empty' },
  { col: 4, row: 1, tone: 'vermilion' },
  { col: 1, row: 2, tone: 'empty' },
  { col: 4, row: 2, tone: 'empty' },
  { col: 1, row: 3, tone: 'black' },
  { col: 2, row: 3, tone: 'empty' },
  { col: 3, row: 4, tone: 'amber' },
  { col: 4, row: 4, tone: 'empty' },
]
const TONE: Record<ModuleTone, string> = {
  vermilion: 'bg-vermilion',
  black: 'bg-ink',
  amber: 'bg-amber',
  empty: 'bg-stone-100',
}
const MOBILE_DIVIDER: ModuleTone[] = ['vermilion', 'black', 'amber', 'empty']

/**
 * Scene 7 · Values — Veterinary Grid (white). docs/art-direction.md §5.
 * Header in columns 1–4, the 4×4 grid in 5–12 (stacked below xl). Every value is fully readable at
 * rest — hover/focus only inverts the cell to black/white. Mobile: stacked bordered cells with a
 * single row of four small modules as the divider.
 */
export function Values({ copy }: ValuesProps) {
  return (
    <section id="values" data-theme="light" aria-labelledby="values-title" className="section-y bg-surface text-fg">
      <ValuesMotion className="container-site grid-site gap-y-12 md:gap-y-16">
        <div className="col-span-full xl:col-span-4">
          <div className="xl:sticky xl:top-32">
            <SectionHeading
              id="values-title"
              eyebrow={copy.eyebrow}
              title={copy.title}
              intro={copy.intro}
              size="lg"
              // Latin runs longer than the Arabic in a 4-column header: keep it to ≤ 3 display lines.
              titleClassName="ltr:text-display-md"
              introClassName="max-w-[38ch]"
            />
            <div data-vg-divider="" aria-hidden className="mt-12 flex md:hidden">
              {MOBILE_DIVIDER.map((tone) => (
                <span key={tone} className={cn('size-7 border-y border-e border-line first:border-s', TONE[tone])} />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-full xl:col-span-8 [container-type:inline-size]">
          <div
            data-vg-grid=""
            className="grid grid-cols-1 border-s border-t border-line md:grid-cols-4 md:[grid-auto-rows:minmax(25cqi,auto)]"
          >
            {copy.items.slice(0, VALUE_SLOTS.length).map((item, i) => {
              const slot = VALUE_SLOTS[i] ?? ({ col: 1, row: 1 } as const)
              const showLatin = item.latin.trim().toLowerCase() !== item.name.trim().toLowerCase()
              return (
                <article
                  key={item.key}
                  aria-labelledby={`value-${item.key}`}
                  data-vg-cell=""
                  data-diag={slot.row - 1 + (slot.col - 1)}
                  className={cn(
                    'group/value relative flex min-h-48 flex-col justify-between gap-8 border-e border-b border-line bg-surface p-6 text-fg outline-none',
                    'transition-colors duration-500 ease-(--ease-soft) hover:bg-ink hover:text-paper focus-visible:bg-ink focus-visible:text-paper',
                    'focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-amber',
                    'md:col-span-2 md:min-h-0 md:p-7',
                    COL[slot.col],
                    ROW[slot.row],
                  )}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="num text-small font-semibold">{String(i + 1).padStart(2, '0')}</span>
                    {showLatin ? (
                      <span
                        lang="en"
                        className="num text-caption font-medium tracking-[0.18em] text-fg-muted uppercase transition-colors duration-500 group-hover/value:text-paper/70 group-focus-visible/value:text-paper/70"
                      >
                        {item.latin}
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h3 id={`value-${item.key}`} className="text-title font-bold">
                      {item.name}
                    </h3>
                    <p className="mt-2 max-w-[46ch] text-small text-fg-soft transition-colors duration-500 group-hover/value:text-paper/85 group-focus-visible/value:text-paper/85">
                      {item.body}
                    </p>
                  </div>
                </article>
              )
            })}

            {MODULES.map((m) => {
              const accentModule = m.tone !== 'empty'
              return (
                <div
                  key={`${m.col}-${m.row}`}
                  aria-hidden
                  data-vg-accent={accentModule ? '' : undefined}
                  data-vg-empty={accentModule ? undefined : ''}
                  data-diag={m.row - 1 + (m.col - 1)}
                  className={cn('hidden border-e border-b border-line md:block', TONE[m.tone], COL[m.col], ROW[m.row])}
                />
              )
            })}
          </div>
        </div>
      </ValuesMotion>
    </section>
  )
}
