import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { CatalogEmpty, CATALOG_INQUIRY_ID } from '@/components/products/CatalogEmpty'
import { CatalogHero } from '@/components/products/CatalogHero'
import { CatalogLiveView, type CatalogHeroCopy } from '@/components/products/CatalogLiveView'
import { ButtonLink } from '@/components/ui/Button'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { interpolate } from '@/i18n/format'
import { href } from '@/i18n/routing'
import { getFacets, getTaxonomy, queryProducts } from '@/lib/catalog'
import { CATEGORY_KEYS, SEGMENT_KEYS, catalogHref, hasActiveFilters, parseCatalogParams } from '@/lib/catalog-params'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).products.catalog
  const query = parseCatalogParams(await searchParams)
  const filtered = hasActiveFilters(query)
  const paged = !filtered && query.page > 1
  const metadata = await buildMetadata({
    locale,
    title: paged ? `${t.meta.title} — ${interpolate(t.pagination.pageShort, { page: query.page })}` : t.meta.title,
    description: t.meta.description,
    path: paged ? `/products?page=${query.page}` : '/products',
  })
  // Filter/search permutations stay crawlable links but are never indexed (spec §12.1: no infinite filter routes).
  if (filtered) metadata.robots = { index: false, follow: true, googleBot: { index: false, follow: true } }
  return metadata
}

/** Product catalogue (spec §6.4; art direction §7 "Products"). Real data only — never placeholder products. */
export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const c = dict.products.catalog
  const query = parseCatalogParams(await searchParams)

  const [facets, taxonomy, result] = await Promise.all([getFacets(locale), getTaxonomy(locale), queryProducts(locale, query)])

  // CMS taxonomy names win; the dictionary keeps the UI complete before the CMS is seeded.
  const categories = CATEGORY_KEYS.map((key) => {
    const cms = taxonomy.categories.find((x) => x.key === key)
    return {
      key,
      name: cms?.name || dict.common.categories[key].name,
      description: cms?.description || dict.common.categories[key].short,
    }
  })
  const segments = SEGMENT_KEYS.map((key) => ({
    key,
    name: taxonomy.segments.find((x) => x.key === key)?.name || dict.common.segments[key].name,
  }))

  const hero: CatalogHeroCopy = {
    eyebrow: c.hero.eyebrow,
    title: c.hero.title,
    intro: c.hero.intro,
    breadcrumbs: {
      label: dict.common.a11y.breadcrumbs,
      items: [
        { label: dict.common.breadcrumbs.home, href: href(locale, 'home') },
        { label: dict.common.nav.products, href: href(locale, 'products') },
      ],
    },
  }

  /* Empty catalogue — the current truth until the first product is approved. */
  if (facets.total === 0) {
    return (
      <>
        <CatalogHero {...hero}>
          <div className="grid-site gap-y-8 border-t border-line pt-8 lg:pt-10">
            <div className="col-span-full lg:col-span-8">
              <h2 className="text-display-md font-bold text-balance">{c.states.emptyCatalogTitle}</h2>
              <p className="mt-4 max-w-2xl text-lead text-fg-soft">{c.states.emptyCatalogBody}</p>
            </div>
            <div className="col-span-full flex items-end lg:col-span-4 lg:justify-end">
              <ButtonLink href={`#${CATALOG_INQUIRY_ID}`} variant="primary" size="lg" className="w-full sm:w-auto">
                {c.states.emptyCatalogCta}
              </ButtonLink>
            </div>
          </div>
        </CatalogHero>
        <CatalogEmpty
          locale={locale}
          selected={query.category}
          categories={categories}
          copy={{
            browserTitle: c.categoryBrowser.title,
            browserIntro: c.categoryBrowser.emptyIntro,
            inquire: c.categoryBrowser.inquire,
            selectedLabel: c.categoryBrowser.selected,
            formTitle: c.states.emptyCatalogCta,
            formIntro: c.states.emptyCatalogFormIntro,
            vetNote: dict.common.vetSafetyNote,
          }}
          form={
            <InquiryForm
              locale={locale}
              kind="product"
              variant="compact"
              productCategory={query.category}
              sourcePath={`/${locale}/products`}
              id="catalog-inquiry-form"
            />
          }
        />
      </>
    )
  }

  // A bookmarked page beyond the end (the catalogue shrank) lands on the last real page.
  if (result.total > 0 && query.page > result.totalPages) {
    redirect(catalogHref(locale, query, { page: result.totalPages }))
  }

  return (
    <CatalogLiveView
      locale={locale}
      dict={dict}
      hero={hero}
      query={query}
      facets={facets}
      categories={categories}
      segments={segments}
      result={result}
    />
  )
}
