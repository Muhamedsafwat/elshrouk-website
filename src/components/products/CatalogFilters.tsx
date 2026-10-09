import type { ComponentType } from 'react'
import type { Locale } from '@/i18n/config'
import { catalogHref, hasActiveFilters, type CatalogParams } from '@/lib/catalog-params'
import { cn } from '@/lib/cn'
import { CatalogLink } from './CatalogNav'

export type FilterOption = {
  value: string
  label: string
  /** Real published total for this option; omitted when the data layer has no per-option count. */
  count?: number
  icon?: ComponentType<{ size?: number; className?: string }>
}

export type CatalogFiltersLabels = {
  category: string
  segment: string
  manufacturer: string
  reset: string
  any: string
}

type Key = 'category' | 'segment' | 'manufacturer'

/**
 * Filter rail (spec §6.4): category, production type and — only when such records exist — verified
 * manufacturer. Every option is a shareable link; counts are the real published totals per facet.
 * Rendered twice (desktop rail + mobile drawer), so ids are namespaced with `idPrefix`.
 */
export function CatalogFilters({
  locale,
  params,
  categories,
  segments,
  manufacturers,
  labels,
  idPrefix,
}: {
  locale: Locale
  params: CatalogParams
  categories: FilterOption[]
  segments: FilterOption[]
  manufacturers: FilterOption[]
  labels: CatalogFiltersLabels
  idPrefix: string
}) {
  const groups: { key: Key; title: string; options: FilterOption[] }[] = [
    { key: 'category', title: labels.category, options: categories },
    { key: 'segment', title: labels.segment, options: segments },
  ]
  if (manufacturers.length > 0) groups.push({ key: 'manufacturer', title: labels.manufacturer, options: manufacturers })

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group) => {
        const headingId = `${idPrefix}-filter-${group.key}`
        const current = params[group.key]
        return (
          <section key={group.key} aria-labelledby={headingId}>
            <h3 id={headingId} className="eyebrow text-fg-muted">
              {group.title}
            </h3>
            <ul className="mt-3 border-t border-line">
              <li className="border-b border-line">
                <FilterRow
                  href={catalogHref(locale, params, { [group.key]: undefined })}
                  label={labels.any}
                  active={!current}
                />
              </li>
              {group.options.map((option) => {
                const active = current === option.value
                return (
                  <li key={option.value} className="border-b border-line">
                    <FilterRow
                      href={catalogHref(locale, params, { [group.key]: active ? undefined : option.value })}
                      label={option.label}
                      count={option.count}
                      active={active}
                      disabled={!active && option.count === 0}
                      Icon={option.icon}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
      {hasActiveFilters(params) ? (
        <CatalogLink
          href={catalogHref(locale, {})}
          className="inline-flex min-h-11 items-center self-start text-small font-semibold text-fg underline decoration-line-strong underline-offset-8 transition-colors hover:text-accent hover:decoration-current"
        >
          {labels.reset}
        </CatalogLink>
      ) : null}
    </div>
  )
}

function FilterRow({
  href,
  label,
  count,
  active,
  disabled = false,
  Icon,
}: {
  href: string
  label: string
  count?: number
  active: boolean
  disabled?: boolean
  Icon?: FilterOption['icon']
}) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className={cn(
            'inline-flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors',
            active ? 'border-vermilion bg-vermilion' : 'border-line-strong group-hover/row:border-fg',
          )}
        >
          {active ? <span className="size-1.5 rounded-full bg-ink" /> : null}
        </span>
        {Icon ? <Icon size={20} className="shrink-0" /> : null}
        <span className="truncate">{label}</span>
      </span>
      {count !== undefined ? <span className="num text-small text-fg-muted tabular-nums">{count}</span> : null}
    </>
  )
  const base = 'group/row flex min-h-12 w-full items-center justify-between gap-3 py-2.5 text-body'
  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(base, 'cursor-not-allowed text-fg-muted opacity-60')}>
        {inner}
      </span>
    )
  }
  return (
    <CatalogLink
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(base, 'transition-colors hover:text-accent', active ? 'font-bold text-fg' : 'text-fg-soft')}
    >
      {inner}
    </CatalogLink>
  )
}
