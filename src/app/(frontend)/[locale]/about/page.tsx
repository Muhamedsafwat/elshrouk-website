import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AboutHero } from '@/components/sections/about/AboutHero'
import {
  ChapterFocus,
  ChapterName,
  ChapterPrinciples,
  ChapterScale,
  ChapterWho,
  VisionMission,
} from '@/components/sections/about/AboutChapters'
import { CtaBand } from '@/components/ui/CtaBand'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { getMetrics } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 3600

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).about
  return buildMetadata({ locale, title: t.meta.title, description: t.meta.description, path: '/about' })
}

/** About / من نحن — spec §6.1; docs/art-direction.md §7 (About row). No founding dates or history. */
export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.about
  const metrics = await getMetrics(locale)

  const crumbs = [
    { label: dict.common.breadcrumbs.home, href: href(locale, 'home') },
    { label: dict.common.nav.about, href: href(locale, 'about') },
  ]

  return (
    <>
      <AboutHero locale={locale} copy={t.hero} crumbs={crumbs} crumbsLabel={dict.common.a11y.breadcrumbs} />
      <ChapterWho copy={t.who} />
      <ChapterName copy={t.name} logoAlt={dict.common.brand.logoAlt} />
      <ChapterFocus locale={locale} copy={t.focus} segments={dict.common.segments} />
      <ChapterScale copy={t.scale} metrics={metrics.items} footnote={metrics.footnote} />
      <ChapterPrinciples copy={t.principles} />
      <VisionMission copy={t.visionMission} />
      <CtaBand
        title={t.cta.title}
        body={t.cta.body}
        primary={{ label: t.cta.primary, href: href(locale, 'contact', { type: 'farm' }) }}
        secondary={{ label: t.cta.secondary, href: href(locale, 'howWeWork') }}
      />
    </>
  )
}
