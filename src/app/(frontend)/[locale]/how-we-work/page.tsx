import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PrecisionFlow } from '@/components/sections/how-we-work/PrecisionFlow'
import { ProcessHero } from '@/components/sections/how-we-work/ProcessHero'
import { RequestSection } from '@/components/sections/how-we-work/RequestSection'
import { WorkPrinciples } from '@/components/sections/how-we-work/WorkPrinciples'
import { CtaBand } from '@/components/ui/CtaBand'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).howWeWork
  return buildMetadata({ locale, title: t.meta.title, description: t.meta.description, path: '/how-we-work' })
}

/**
 * How we work / كيف نعمل — spec §6.6; docs/art-direction.md §7. The five steps are an INDICATIVE process
 * (copy review_required): no SLA, delivery-time, fleet or cold-chain claims; the disclaimer renders with them.
 */
export default async function HowWeWorkPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.howWeWork
  const pagePath = href(locale, 'howWeWork')

  const crumbs = [
    { label: dict.common.breadcrumbs.home, href: href(locale, 'home') },
    { label: dict.common.nav.howWeWork, href: pagePath },
  ]

  return (
    <>
      <ProcessHero
        copy={t.hero}
        crumbs={crumbs}
        crumbsLabel={dict.common.a11y.breadcrumbs}
        cta={{ label: dict.common.cta.startRequest, href: '#request' }}
        titleId="process-title"
      />
      <PrecisionFlow steps={t.steps} disclaimer={t.disclaimer} labelledBy="process-title" />
      <WorkPrinciples copy={t.principles} />
      <RequestSection locale={locale} copy={t.form} sourcePath={pagePath} />
      <CtaBand
        title={t.cta.title}
        primary={{ label: t.cta.primary, href: href(locale, 'contact', { type: 'farm' }) }}
        secondary={{ label: dict.common.cta.browseProducts, href: href(locale, 'products') }}
      />
    </>
  )
}
