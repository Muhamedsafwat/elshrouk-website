import { InquiryForm } from '@/components/forms/InquiryForm'
import { ButtonLink } from '@/components/ui/Button'
import { CATEGORY_ICONS, CloseIcon, SEGMENT_ICONS } from '@/components/ui/icons'
import { EmptyState } from '@/components/ui/States'
import type { Locale } from '@/i18n/config'
import type { getDictionary } from '@/i18n/dictionaries'
import { interpolate } from '@/i18n/format'
import { href } from '@/i18n/routing'
import type { Facets, ProductCard as ProductCardData } from '@/lib/catalog'
import { catalogHref, type CatalogParams, type CategoryKey, type SegmentKey } from '@/lib/catalog-params'
import { CatalogFilters, type FilterOption } from './CatalogFilters'
import { CatalogHero } from './CatalogHero'
import { CatalogLink, CatalogNavProvider, CatalogPending, RESULTS_ID } from './CatalogNav'
import { CatalogSearch } from './CatalogSearch'
import { CatalogTracker } from './CatalogTracker'
import { resultCountLabel } from './catalog-ui'
import { MobileFilters } from './MobileFilters'
import { Pagination } from './Pagination'
import { ProductCard } from './ProductCard'
import { ProductInquiryProvider, ProductInquiryTrigger } from './ProductInquiry'
import { ProductInquiryBand } from './ProductInquiryBand'

export type CatalogHeroCopy = {
  eyebrow: string
  title: string[]
  intro: string
  breadcrumbs: { items: { label: string; href?: string }[]; label: string }
}

/**
 * The live catalogue (spec §6.4): prominent search, filter rail (drawer on mobile), real result count
 * (aria-live), product grid with inquiry drawer, filtered-empty state, server pagination, closing band.
 * Pure presentation — the route loads the data.
 */
export function CatalogLiveView({
  locale,
  dict,
  hero,
  query,
  facets,
  categories,
  segments,
  result,
}: {
  locale: Locale
  dict: ReturnType<typeof getDictionary>
  hero: CatalogHeroCopy
  query: CatalogParams
  facets: Facets
  categories: { key: CategoryKey; name: string }[]
  segments: { key: SegmentKey; name: string }[]
  result: { items: ProductCardData[]; total: number; page: number; totalPages: number }
}) {
  const c = dict.products.catalog
  const sourcePath = `/${locale}/products`
  const contactHref = href(locale, 'contact', { type: 'product' })
  const countText = resultCountLabel(locale, result.total, c.results)

  const filterProps = {
    locale,
    params: query,
    categories: categories.map(
      (cat): FilterOption => ({ value: cat.key, label: cat.name, count: facets.categories[cat.key], icon: CATEGORY_ICONS[cat.key] }),
    ),
    segments: segments.map(
      (seg): FilterOption => ({ value: seg.key, label: seg.name, count: facets.segments[seg.key], icon: SEGMENT_ICONS[seg.key] }),
    ),
    manufacturers: facets.manufacturers.map((m): FilterOption => ({ value: m, label: m })),
    labels: {
      category: c.filters.category,
      segment: c.filters.segment,
      manufacturer: c.filters.manufacturer,
      reset: c.filters.reset,
      any: c.filters.any,
    },
  }

  const chips = [
    query.q ? { key: 'q', label: interpolate(c.filters.searchTerm, { q: query.q }), href: catalogHref(locale, query, { q: undefined }) } : null,
    query.category
      ? {
          key: 'category',
          label: categories.find((x) => x.key === query.category)?.name ?? query.category,
          href: catalogHref(locale, query, { category: undefined }),
        }
      : null,
    query.segment
      ? {
          key: 'segment',
          label: segments.find((x) => x.key === query.segment)?.name ?? query.segment,
          href: catalogHref(locale, query, { segment: undefined }),
        }
      : null,
    query.manufacturer
      ? { key: 'manufacturer', label: query.manufacturer, href: catalogHref(locale, query, { manufacturer: undefined }) }
      : null,
  ].filter((chip): chip is { key: string; label: string; href: string } => chip !== null)
  const activeFilterCount = [query.category, query.segment, query.manufacturer].filter(Boolean).length

  // One server-rendered form per visible product, keyed by the trusted CMS id; the drawer shows the active one.
  const forms = Object.fromEntries(
    result.items.map((p) => [
      String(p.id),
      <InquiryForm
        key={p.id}
        locale={locale}
        kind="product"
        lockKind
        product={{ id: p.id, label: p.name }}
        productCategory={p.category?.key}
        variant="compact"
        sourcePath={sourcePath}
      />,
    ]),
  )

  return (
    <CatalogNavProvider>
      <CatalogHero {...hero}>
        <CatalogSearch
          locale={locale}
          params={query}
          labels={c.search}
          caption={interpolate(c.search.inCatalog, { count: resultCountLabel(locale, facets.total, c.results) })}
        />
      </CatalogHero>

      <section data-theme="light" aria-label={c.results.regionLabel} className="bg-surface text-fg">
        <div className="container-site pb-24 lg:pb-36">
          <div className="grid-site gap-y-8 border-t border-line pt-8 lg:pt-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28 pb-8">
                <h2 className="text-title font-bold">{c.filters.title}</h2>
                <div className="mt-8">
                  <CatalogFilters {...filterProps} idPrefix="rail" />
                </div>
              </div>
            </aside>

            <div className="col-span-full lg:col-span-9 lg:ps-6 xl:ps-10">
              <MobileFilters
                labels={{ show: c.filters.showFilters, title: c.filters.title, close: c.filters.close }}
                activeCount={activeFilterCount}
                applyLabel={`${c.filters.apply} · ${countText}`}
              >
                <CatalogFilters {...filterProps} idPrefix="drawer" />
              </MobileFilters>

              <div id={RESULTS_ID} className="scroll-mt-28 pt-8 lg:pt-0">
                <p aria-live="polite" aria-atomic="true" className="text-display-md font-bold">
                  {countText}
                </p>
                {query.q ? <p className="mt-2 text-fg-muted">{interpolate(c.results.searchFor, { q: query.q })}</p> : null}
                {chips.length > 0 ? (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <span className="sr-only">{c.filters.active}</span>
                    {chips.map((chip) => (
                      <CatalogLink
                        key={chip.key}
                        href={chip.href}
                        aria-label={interpolate(c.filters.remove, { name: chip.label })}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line-strong/40 bg-paper px-4 text-small font-semibold text-fg transition-colors hover:border-fg"
                      >
                        <span className="max-w-[16rem] truncate">{chip.label}</span>
                        <CloseIcon size={14} />
                      </CatalogLink>
                    ))}
                    <CatalogLink
                      href={catalogHref(locale, {})}
                      className="ms-2 inline-flex min-h-10 items-center text-small font-semibold text-fg-muted underline underline-offset-4 hover:text-fg"
                    >
                      {c.filters.reset}
                    </CatalogLink>
                  </div>
                ) : null}

                <CatalogPending className="mt-10">
                  {result.items.length > 0 ? (
                    <ProductInquiryProvider
                      source="catalog"
                      products={result.items.map((p) => ({ id: p.id, slug: p.slug, name: p.name, category: p.category }))}
                      forms={forms}
                      labels={{
                        title: dict.products.drawer.title,
                        close: dict.products.drawer.close,
                        titleFor: dict.products.drawer.titleFor,
                        intro: dict.products.drawer.intro,
                      }}
                    >
                      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 2xl:grid-cols-3">
                        {result.items.map((product) => (
                          <li key={product.id} className="flex" data-reveal="up" suppressHydrationWarning>
                            <ProductCard
                              className="w-full"
                              product={product}
                              locale={locale}
                              labels={{ details: c.card.details, availability: c.availability }}
                              action={
                                <ProductInquiryTrigger
                                  productId={product.id}
                                  label={c.card.inquire}
                                  srContext={product.name}
                                  fallbackHref={contactHref}
                                  variant="outline"
                                  className="w-full"
                                />
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </ProductInquiryProvider>
                  ) : (
                    <EmptyState
                      title={c.states.emptyFilteredTitle}
                      body={c.states.emptyFilteredBody}
                      action={
                        <>
                          <ButtonLink href={catalogHref(locale, {})} replace scroll={false} variant="ink">
                            {c.states.resetFilters}
                          </ButtonLink>
                          <ButtonLink href={contactHref} variant="outline">
                            {c.inquiryCta.cta}
                          </ButtonLink>
                        </>
                      }
                    />
                  )}
                  <Pagination
                    locale={locale}
                    params={query}
                    page={result.page}
                    totalPages={result.totalPages}
                    labels={{
                      label: c.pagination.label,
                      previous: c.pagination.previous,
                      next: c.pagination.next,
                      page: c.pagination.page,
                      pageLink: c.pagination.pageLink,
                    }}
                  />
                </CatalogPending>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CatalogTracker
        q={query.q}
        category={query.category}
        segment={query.segment}
        manufacturer={query.manufacturer}
        total={result.total}
        page={result.page}
      />

      <ProductInquiryBand
        title={c.inquiryCta.title}
        body={c.inquiryCta.body}
        actions={
          <ButtonLink href={contactHref} variant="primary" size="lg">
            {c.inquiryCta.cta}
          </ButtonLink>
        }
      />
    </CatalogNavProvider>
  )
}
