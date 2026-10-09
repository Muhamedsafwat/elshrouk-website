import { ArrowIcon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { interpolate } from '@/i18n/format'
import { catalogHref, type CatalogParams } from '@/lib/catalog-params'
import { cn } from '@/lib/cn'
import { paginationItems } from './catalog-ui'
import { CatalogLink } from './CatalogNav'

export type PaginationLabels = { label: string; previous: string; next: string; page: string; pageLink: string }

/**
 * Server pagination with stable, shareable URLs and rel="prev"/"next". Page changes push history
 * (back button walks pages) and bring the results back into view.
 */
export function Pagination({
  locale,
  params,
  page,
  totalPages,
  labels,
}: {
  locale: Locale
  params: CatalogParams
  page: number
  totalPages: number
  labels: PaginationLabels
}) {
  if (totalPages <= 1) return null
  const prev = page > 1 ? catalogHref(locale, params, { page: page - 1 }) : null
  const next = page < totalPages ? catalogHref(locale, params, { page: page + 1 }) : null
  const step =
    'inline-flex min-h-12 items-center gap-2 rounded-xs px-4 text-small font-semibold transition-colors'

  return (
    <nav aria-label={labels.label} className="mt-16 border-t border-line pt-8">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <p className="text-small text-fg-muted">{interpolate(labels.page, { page, total: totalPages })}</p>
        <ul className="flex flex-wrap items-center justify-center gap-1.5">
          <li>
            {prev ? (
              <CatalogLink href={prev} rel="prev" history="push" toResults className={cn(step, 'hover:bg-stone-100')}>
                <ArrowIcon size={18} className="rotate-180" />
                {labels.previous}
              </CatalogLink>
            ) : (
              <span aria-disabled="true" className={cn(step, 'text-fg-muted opacity-50')}>
                <ArrowIcon size={18} className="rotate-180" />
                {labels.previous}
              </span>
            )}
          </li>
          {paginationItems(page, totalPages).map((item, i) =>
            item === 'gap' ? (
              <li key={`gap-${i}`} aria-hidden className="num px-1 text-fg-muted">
                …
              </li>
            ) : (
              <li key={item}>
                <CatalogLink
                  href={catalogHref(locale, params, { page: item })}
                  history="push"
                  toResults
                  aria-label={interpolate(labels.pageLink, { page: item })}
                  aria-current={item === page ? 'page' : undefined}
                  className={cn(
                    'num inline-flex size-12 items-center justify-center rounded-full text-small font-semibold transition-colors',
                    item === page ? 'bg-ink text-paper' : 'text-fg hover:bg-stone-100',
                  )}
                >
                  {item}
                </CatalogLink>
              </li>
            ),
          )}
          <li>
            {next ? (
              <CatalogLink href={next} rel="next" history="push" toResults className={cn(step, 'hover:bg-stone-100')}>
                {labels.next}
                <ArrowIcon size={18} />
              </CatalogLink>
            ) : (
              <span aria-disabled="true" className={cn(step, 'text-fg-muted opacity-50')}>
                {labels.next}
                <ArrowIcon size={18} />
              </span>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}
