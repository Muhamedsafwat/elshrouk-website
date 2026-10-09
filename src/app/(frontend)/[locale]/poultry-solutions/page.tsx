import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Chapters } from '@/components/sections/solutions/Chapters'
import { OverviewHero } from '@/components/sections/solutions/OverviewHero'
import { SegmentMatrix, type MatrixCategory, type MatrixSegment } from '@/components/sections/solutions/SegmentMatrix'
import { StepsFlow } from '@/components/sections/solutions/StepsFlow'
import type { ChapterCopy } from '@/components/sections/solutions/shared'
import { CtaBand } from '@/components/ui/CtaBand'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { getTaxonomy } from '@/lib/catalog'
import { CATEGORY_KEYS, SEGMENT_KEYS, type CategoryKey, type SegmentKey } from '@/lib/catalog-params'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string }> }

const isSegmentKey = (key: string): key is SegmentKey => (SEGMENT_KEYS as readonly string[]).includes(key)
const isCategoryKey = (key: string): key is CategoryKey => (CATEGORY_KEYS as readonly string[]).includes(key)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const { meta } = getDictionary(locale).solutions.overview
  return buildMetadata({ locale, title: meta.title, description: meta.description, path: '/poultry-solutions' })
}

/** Poultry solutions overview (spec §6.2, art direction §7). */
export default async function PoultrySolutionsPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const { common } = dict
  const t = dict.solutions.overview

  const chapters: ChapterCopy[] = t.chapters.flatMap((c) => (isSegmentKey(c.key) ? [{ ...c, key: c.key }] : []))

  // Matrix axes come from the CMS taxonomy (names + order). The dictionary is only a fallback when the
  // taxonomy is unavailable, so the page never renders an empty matrix.
  const taxonomy = await getTaxonomy(locale).catch(() => null)
  const categories: MatrixCategory[] = taxonomy?.categories.length
    ? taxonomy.categories.flatMap((c) => (isCategoryKey(c.key) ? [{ key: c.key, name: c.name || common.categories[c.key].name }] : []))
    : CATEGORY_KEYS.map((key) => ({ key, name: common.categories[key].name }))
  const segments: MatrixSegment[] = taxonomy?.segments.length
    ? taxonomy.segments.flatMap((s) =>
        isSegmentKey(s.key) ? [{ key: s.key, name: s.name || common.segments[s.key].name, latin: common.segments[s.key].latin }] : [],
      )
    : SEGMENT_KEYS.map((key) => ({ key, name: common.segments[key].name, latin: common.segments[key].latin }))

  return (
    <>
      <OverviewHero
        locale={locale}
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        intro={t.hero.intro}
        chapters={chapters}
        indexLabel={t.indexLabel}
        breadcrumbs={{
          label: common.a11y.breadcrumbs,
          items: [{ label: common.breadcrumbs.home, href: href(locale, 'home') }, { label: common.nav.solutions }],
        }}
      />

      <Chapters locale={locale} chapters={chapters} railLabel={t.railLabel} />

      <SegmentMatrix
        locale={locale}
        id="matrix-title"
        index="04"
        title={t.matrix.title}
        intro={t.matrix.intro}
        note={t.matrix.note}
        segments={segments}
        categories={categories}
        labels={{ segment: dict.products.catalog.filters.segment, browse: common.cta.browseProducts }}
      />

      <StepsFlow id="request-title" index="05" title={t.howToRequest.title} steps={t.howToRequest.steps} />

      <CtaBand
        title={t.cta.title}
        body={t.cta.body}
        primary={{ label: t.cta.primary, href: href(locale, 'contact', { type: 'farm' }) }}
        secondary={{ label: common.cta.browseProducts, href: href(locale, 'products') }}
      />
    </>
  )
}
