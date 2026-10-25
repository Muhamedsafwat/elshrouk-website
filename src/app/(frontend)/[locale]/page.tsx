import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Closing } from '@/components/sections/home/Closing'
import { FaqTeaser } from '@/components/sections/home/FaqTeaser'
import { FarmTypes } from '@/components/sections/home/FarmTypes'
import { Hero } from '@/components/sections/home/Hero'
import { Journey } from '@/components/sections/home/Journey'
import { PartnerProof } from '@/components/sections/home/PartnerProof'
import { Partners } from '@/components/sections/home/Partners'
import { ProductPreview } from '@/components/sections/home/ProductPreview'
import { ProductUniverse } from '@/components/sections/home/ProductUniverse'
import { ProofBand } from '@/components/sections/home/ProofBand'
import { Statement } from '@/components/sections/home/Statement'
import { Values } from '@/components/sections/home/Values'
import { partners } from '@/content/partners'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { getFeaturedProducts } from '@/lib/catalog'
import { getFaqs, getHomepage, getMetrics } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const dict = getDictionary(locale)
  const t = dict.home
  const metadata = await buildMetadata({ locale, title: t.meta.title, description: t.meta.description, path: '' })
  // The layout's "%s | brand" template does not apply to a page in the same segment, so the home title
  // carries the brand explicitly (CI-04).
  return { ...metadata, title: { absolute: `${t.meta.title} | ${dict.common.brand.name}` } }
}

/** Homepage — sequenced scenes (spec §5; docs/art-direction.md §5). CMS copy overrides dictionary defaults. */
export default async function HomePage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.home

  const [cms, metrics, faqs, featured] = await Promise.all([
    getHomepage(locale),
    getMetrics(locale),
    getFaqs(locale, 'home'),
    getFeaturedProducts(locale, 6).catch((error) => {
      console.error('[home] featured products unavailable', error)
      return []
    }),
  ])
  const s = cms.sections

  return (
    <>
      <Hero
        locale={locale}
        metrics={metrics.items}
        copy={{
          ...t.hero,
          eyebrow: cms.heroEyebrow ?? t.hero.eyebrow,
          headline: cms.heroHeadline ?? t.hero.headline,
          subhead: cms.heroSubhead ?? t.hero.subhead,
          primaryCta: cms.heroPrimaryCta ?? t.hero.primaryCta,
          secondaryCta: cms.heroSecondaryCta ?? t.hero.secondaryCta,
        }}
      />
      {s.showProof ? <ProofBand copy={t.proof} metrics={metrics.items} footnote={metrics.footnote} /> : null}
      {s.showStatement ? <Statement locale={locale} copy={{ ...t.statement, lines: cms.statementLines ?? t.statement.lines }} /> : null}
      {s.showFarmTypes ? <FarmTypes locale={locale} copy={t.farmTypes} /> : null}
      {s.showProductUniverse ? <ProductUniverse locale={locale} copy={t.productUniverse} /> : null}
      {s.showJourney ? <Journey locale={locale} copy={t.journey} /> : null}
      {s.showValues ? <Values locale={locale} copy={t.values} /> : null}
      {s.showProductPreview ? (
        <ProductPreview locale={locale} copy={t.productPreview} products={featured} categories={dict.common.categories} />
      ) : null}
      <Partners locale={locale} copy={t.partners} partners={partners} externalLabel={dict.common.a11y.externalLink} />
      {s.showPartnerProof ? <PartnerProof locale={locale} copy={t.partnerProof} metrics={metrics.items} /> : null}
      {s.showFaq ? <FaqTeaser locale={locale} copy={t.faq} items={faqs} /> : null}
      <Closing
        locale={locale}
        copy={{ ...t.closing, headline: cms.closingHeadline ?? t.closing.headline, subhead: cms.closingSubhead ?? t.closing.subhead }}
      />
    </>
  )
}
