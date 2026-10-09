import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowIcon, CATEGORY_ICONS } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import type { CategoryKey, SegmentKey } from '@/lib/catalog-params'
import { FlowScene } from './FlowScene'
import { pad2 } from './shared'

export type MatrixSegment = { key: SegmentKey; name: string; latin?: string }
export type MatrixCategory = { key: CategoryKey; name: string }

const LINE = 'bg-line-strong/45'

/**
 * Segments × categories matrix (art direction §7, Distribution Flow motif §4). Every row is a flow:
 * it runs from the segment (start side) through one node per category, into a collector that ends in
 * the single amber destination node beside the honest note ("availability confirmed per request").
 * Each node links to the catalogue filtered by that category AND segment. Desktop = semantic <table>;
 * mobile = one list per segment (recomposed, not squeezed).
 */
export function SegmentMatrix({
  locale,
  id,
  index,
  title,
  intro,
  note,
  segments,
  categories,
  labels,
}: {
  locale: Locale
  id: string
  index?: string
  title: string
  intro: string
  note: string
  segments: MatrixSegment[]
  categories: MatrixCategory[]
  labels: { segment: string; browse: string }
}) {
  const cellHref = (category: CategoryKey, segment: SegmentKey) => href(locale, 'products', { category, segment })

  return (
    <section data-theme="warm" aria-labelledby={id} className="section-y bg-surface text-fg">
      <div className="container-site">
        <SectionHeading id={id} index={index} title={title} intro={intro} size="lg" className="max-w-[58rem]" />

        <FlowScene className="mt-14 lg:mt-20">
          {/* ---------- Desktop: semantic table ---------- */}
          <div className="hidden lg:block">
            <table className="w-full table-fixed border-collapse">
              <caption className="sr-only">{title}</caption>
              <thead>
                <tr className="border-b border-line-strong">
                  <th scope="col" className="w-[27%] pb-7 text-start align-bottom">
                    <span className="text-caption font-semibold text-fg-muted">{labels.segment}</span>
                  </th>
                  {categories.map((category, n) => {
                    const Icon = CATEGORY_ICONS[category.key]
                    return (
                      <th key={category.key} scope="col" className="px-3 pb-7 align-bottom font-normal">
                        <span className="flex flex-col items-center gap-3 text-center">
                          <span className="num text-caption font-semibold text-fg-muted">{pad2(n + 1)}</span>
                          <Icon size={28} aria-hidden className="text-fg" />
                          <span className="text-body leading-snug font-bold text-fg">{category.name}</span>
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {segments.map((segment, row) => (
                  <tr key={segment.key} data-flow-group data-flow-nodes="center" className="border-b border-line">
                    <th scope="row" className="text-start align-middle font-normal">
                      <a href={href(locale, segment.key)} className="group inline-flex items-baseline gap-3 py-9">
                        <span className="text-display-md leading-none font-bold text-fg transition-colors duration-300 group-hover:text-accent">
                          {segment.name}
                        </span>
                        {segment.latin && segment.latin !== segment.name ? (
                          <span lang="en" className="text-small text-fg-muted">
                            {segment.latin}
                          </span>
                        ) : null}
                      </a>
                    </th>
                    {categories.map((category, col) => {
                      const last = col === categories.length - 1
                      return (
                        <td key={category.key} className="relative p-0">
                          <span
                            aria-hidden
                            data-flow-line
                            className={cn('pointer-events-none absolute inset-x-0 top-1/2 h-px ltr:origin-left rtl:origin-right', LINE)}
                          />
                          {last ? (
                            <span
                              aria-hidden
                              data-flow-line="y"
                              className={cn(
                                'pointer-events-none absolute end-0 w-px origin-top',
                                row === 0 ? 'top-1/2 bottom-0' : 'inset-y-0',
                                LINE,
                              )}
                            />
                          ) : null}
                          <a
                            href={cellHref(category.key, segment.key)}
                            aria-label={`${labels.browse}: ${category.name} — ${segment.name}`}
                            className="group/node absolute inset-0 z-10 grid place-items-center rounded-xs"
                          >
                            <span
                              data-flow-node
                              className="block size-4 rounded-full border-[1.5px] border-fg bg-surface transition-[transform,background-color,border-color] duration-300 ease-(--ease-sunrise) group-hover/node:scale-150 group-hover/node:border-vermilion group-hover/node:bg-vermilion group-focus-visible/node:scale-150 group-focus-visible/node:border-vermilion group-focus-visible/node:bg-vermilion"
                            />
                          </a>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Collector → the one amber destination node, annotated by the honest note. */}
            <div data-flow-group data-flow-nodes="end" data-flow-delay="1.2" className="relative flex justify-end pt-12">
              <span aria-hidden data-flow-line="y" className={cn('absolute end-0 top-0 h-[3.45rem] w-px origin-top', LINE)} />
              <span aria-hidden data-flow-node className="absolute end-[-6.5px] top-[3.05rem] block size-3.5 rounded-full bg-amber" />
              <p className="max-w-[54ch] pe-10 text-small text-fg-soft">{note}</p>
            </div>
          </div>

          {/* ---------- Mobile / tablet: one list per segment ---------- */}
          <div className="grid gap-14 lg:hidden">
            {segments.map((segment) => (
              <div key={segment.key} data-flow-group>
                <h3 className="flex items-baseline gap-3">
                  <a href={href(locale, segment.key)} className="text-display-md leading-none font-bold text-fg">
                    {segment.name}
                  </a>
                  {segment.latin && segment.latin !== segment.name ? (
                    <span lang="en" className="text-small text-fg-muted">
                      {segment.latin}
                    </span>
                  ) : null}
                </h3>
                <ul className="mt-5 border-t border-line-strong">
                  {categories.map((category, col) => (
                    <li key={category.key} className="relative">
                      {col < categories.length - 1 ? (
                        <span
                          aria-hidden
                          data-flow-line="y"
                          className={cn('pointer-events-none absolute start-[7.5px] top-1/2 h-full w-px origin-top', LINE)}
                        />
                      ) : null}
                      <a
                        href={cellHref(category.key, segment.key)}
                        className="group flex min-h-14 items-center gap-4 border-b border-line py-3"
                      >
                        <span
                          data-flow-node
                          className="relative z-10 block size-4 shrink-0 rounded-full border-[1.5px] border-fg bg-surface transition-colors group-hover:border-vermilion group-hover:bg-vermilion"
                        />
                        <span className="flex-1 text-body font-semibold text-fg">
                          {category.name}
                          <span className="sr-only"> — {segment.name}</span>
                        </span>
                        <ArrowIcon size={18} aria-hidden className="shrink-0 text-fg-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="flex items-start gap-3 text-small text-fg-soft">
              <span aria-hidden className="mt-[0.45em] block size-3 shrink-0 rounded-full bg-amber" />
              <span>{note}</span>
            </p>
          </div>
        </FlowScene>
      </div>
    </section>
  )
}
