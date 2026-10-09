import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { CategoryTiles, type CategoryTile } from '@/components/sections/solutions/CategoryTiles'
import { NextSegment } from '@/components/sections/solutions/NextSegment'
import { Resources, type ResourceItem } from '@/components/sections/solutions/Resources'
import { SegmentHero } from '@/components/sections/solutions/SegmentHero'
import { SegmentOverview } from '@/components/sections/solutions/SegmentOverview'
import { StepsFlow } from '@/components/sections/solutions/StepsFlow'
import { SupplyNeeds } from '@/components/sections/solutions/SupplyNeeds'
import { NEXT_SEGMENT, plural } from '@/components/sections/solutions/shared'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { getFacets, getProductsForSegment, getTaxonomy, queryProducts, type Facets } from '@/lib/catalog'
import { CATEGORY_KEYS, SEGMENT_KEYS, parseCatalogParams, type CategoryKey, type SegmentKey } from '@/lib/catalog-params'
import { getSiteSettings } from '@/lib/cms'
import { getArticles } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string; segment: string }> }

const isSegmentKey = (key: string): key is SegmentKey => (SEGMENT_KEYS as readonly string[]).includes(key)
const isCategoryKey = (key: string): key is CategoryKey => (CATEGORY_KEYS as readonly string[]).includes(key)

export function generateStaticParams() {
  return SEGMENT_KEYS.map((segment) => ({ segment }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segment } = await params
  if (!isLocale(locale) || !isSegmentKey(segment)) return {}
  const { meta } = getDictionary(locale).solutions.segments[segment]
  return buildMetadata({ locale, title: meta.title, description: meta.description, path: `/solutions/${segment}` })
}

/**
 * Exact number of approved products per category FOR THIS SEGMENT — the same set the tile links to.
 * getFacets() only counts categories and segments separately, so it is used as a cheap gate; the
 * category × segment total comes from the catalogue query itself (no query at all while it is empty).
 */
async function segmentCategoryCounts(locale: Locale, segment: SegmentKey, facets: Facets | null) {
  const entries = await Promise.all(
    CATEGORY_KEYS.map(async (category) => {
      if (!facets || facets.categories[category] === 0 || facets.segments[segment] === 0) return [category, 0] as const
      const { total } = await queryProducts(locale, parseCatalogParams({ category, segment })).catch(() => ({ total: 0 }))
      return [category, total] as const
    }),
  )
  return Object.fromEntries(entries) as Record<CategoryKey, number>
}

/** Segment detail template — broilers / layers / breeders (spec §6.3, art direction §7). */
export default async function SegmentPage({ params }: Props) {
  const { locale, segment } = await params
  if (!isLocale(locale) || !isSegmentKey(segment)) notFound()

  const dict = getDictionary(locale)
  const { common } = dict
  const t = dict.solutions.segments[segment]
  const catalog = dict.products.catalog
  const cardCopy = dict.knowledge.hub.card

  const [taxonomy, facets, products, articles, settings] = await Promise.all([
    getTaxonomy(locale).catch(() => null),
    getFacets(locale).catch(() => null),
    getProductsForSegment(locale, segment, 8).catch(() => []),
    getArticles(locale).catch(() => []),
    getSiteSettings(locale).catch(() => null),
  ])
  const counts = await segmentCategoryCounts(locale, segment, facets)

  // Category tiles: CMS taxonomy (names, order, description) with the reviewed dictionary as fallback.
  const taxonomyCategories = taxonomy?.categories.filter((c) => isCategoryKey(c.key)) ?? []
  const categorySource = taxonomyCategories.length
    ? taxonomyCategories.map((c) => ({ key: c.key, name: c.name, description: c.description }))
    : CATEGORY_KEYS.map((key) => ({ key, name: common.categories[key].name, description: undefined }))
  const tiles: CategoryTile[] = categorySource.map(({ key, name, description }) => {
    const count = counts[key] ?? 0
    return {
      key,
      name: name || common.categories[key].name,
      short: description || common.categories[key].short,
      count,
      status:
        count > 0
          ? plural(count, locale, {
              one: catalog.results.countOne,
              two: catalog.results.countTwo,
              few: catalog.results.countFew,
              many: catalog.results.countMany,
              other: catalog.results.count,
            })
          : catalog.availability.inquiry_only,
    }
  })

  // Resources: only published articles that are actually about this segment (title/excerpt mention it),
  // and only while the knowledge hub is switched on. Otherwise the reviewed empty text is shown.
  const stems = [common.segments[segment].name, common.segments[segment].latin]
    .map((s) => s.replace(/^ال/, '').replace(/s$/i, '').toLowerCase())
    .filter((s) => s.length > 2)
  const resources: ResourceItem[] =
    settings?.showKnowledgeHub === false
      ? []
      : articles
          .filter((a) => stems.some((stem) => `${a.title} ${a.excerpt ?? ''}`.toLowerCase().includes(stem)))
          .slice(0, 3)
          .map((a) => ({
            id: a.id,
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            minutes: plural(a.readingMinutes, locale, {
              one: cardCopy.minutesOne,
              two: cardCopy.minutesTwo,
              few: cardCopy.minutes,
              many: cardCopy.minutesMany,
              other: cardCopy.minutesMany,
            }),
          }))

  const next = NEXT_SEGMENT[segment]
  const nextChapter = dict.solutions.overview.chapters.find((c) => c.key === next)
  const sourcePath = href(locale, segment)

  return (
    <>
      <ScrollProgress />

      <SegmentHero
        locale={locale}
        segment={segment}
        label={t.hero.label}
        title={t.hero.title}
        intro={t.hero.intro}
        cta={t.cta}
        breadcrumbs={{
          label: common.a11y.breadcrumbs,
          items: [
            { label: common.breadcrumbs.home, href: href(locale, 'home') },
            { label: common.nav.solutions, href: href(locale, 'solutions') },
            { label: common.segments[segment].name },
          ],
        }}
      />

      <SegmentOverview locale={locale} segment={segment} index="01" title={t.overview.title} body={t.overview.body} />

      <SupplyNeeds index="02" title={t.needs.title} items={t.needs.items} />

      <CategoryTiles
        locale={locale}
        segment={segment}
        index="03"
        title={t.categories.title}
        intro={t.categories.intro}
        tiles={tiles}
        products={products}
        labels={{
          productsHeading: catalog.hero.eyebrow,
          viewAll: common.cta.viewAll,
          card: { details: catalog.card.details, availability: catalog.availability },
        }}
      />

      <StepsFlow id="help-title" index="04" theme="dark" title={t.help.title} steps={t.help.steps} />

      <Resources
        locale={locale}
        index="05"
        title={t.resources.title}
        items={resources}
        empty={t.resources.empty}
        contact={{ label: common.cta.contactUs, href: '#inquiry' }}
      />

      <div data-theme="warm" className="section-y bg-surface text-fg">
        <div className="container-site">
          <InquiryForm
            locale={locale}
            kind="farm"
            segment={segment}
            variant="compact"
            sourcePath={sourcePath}
            title={t.form.title}
            intro={t.form.intro}
            id="inquiry"
            className="scroll-mt-28"
          />
        </div>
      </div>

      {nextChapter ? (
        <NextSegment
          locale={locale}
          next={next}
          index={nextChapter.index}
          name={nextChapter.name}
          latin={nextChapter.latin}
          label={t.next.label}
        />
      ) : null}
    </>
  )
}
