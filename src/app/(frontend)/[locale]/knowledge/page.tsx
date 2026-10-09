import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleList } from '@/components/sections/knowledge/ArticleList'
import { isTopicKey } from '@/components/sections/knowledge/format'
import { KnowledgeEmpty } from '@/components/sections/knowledge/KnowledgeEmpty'
import { KnowledgeHero } from '@/components/sections/knowledge/KnowledgeHero'
import { TopicTiles } from '@/components/sections/knowledge/TopicTiles'
import { CtaBand } from '@/components/ui/CtaBand'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/cms'
import { getArticles } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string | string[] }>
}

const pickCategory = (raw: string | string[] | undefined) => (Array.isArray(raw) ? raw[0] : raw)

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).knowledge.hub
  const [settings, { category }] = await Promise.all([getSiteSettings(locale), searchParams])
  const meta = await buildMetadata({
    locale,
    title: t.meta.title,
    description: t.meta.description,
    path: '/knowledge',
    // The hub itself is indexable only once the CMS switches the knowledge hub on.
    noindex: !settings.showKnowledgeHub,
  })
  // Filtered views share the hub's canonical and stay out of the index (spec §12.1, no filter-route indexing),
  // but crawlers may still follow them to the articles.
  return pickCategory(category) ? { ...meta, robots: { index: false, follow: true } } : meta
}

export default async function KnowledgePage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.knowledge.hub

  const requested = pickCategory((await searchParams).category)
  const active = isTopicKey(t, requested) ? requested : undefined

  const [all, filtered] = await Promise.all([
    getArticles(locale),
    active ? getArticles(locale, active) : Promise.resolve(undefined),
  ])
  const hasArticles = all.length > 0

  return (
    <>
      <div data-theme="warm" className="bg-surface text-fg">
        <KnowledgeHero locale={locale} dict={dict} />
        <TopicTiles locale={locale} dict={dict} linkable={hasArticles} active={active} />
      </div>

      {hasArticles ? (
        <>
          <ArticleList locale={locale} dict={dict} articles={filtered ?? all} active={active} />
          <CtaBand
            title={t.closing.title}
            body={t.closing.body}
            primary={{ label: t.closing.cta, href: href(locale, 'contact', { type: 'general' }) }}
          />
        </>
      ) : (
        <KnowledgeEmpty locale={locale} dict={dict} />
      )}
    </>
  )
}
