import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ArticleView } from '@/components/sections/knowledge/ArticleView'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { interpolate } from '@/i18n/format'
import { getArticleBySlug, getArticles } from '@/lib/content'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string; slug: string }> }

/** Drafts are visible only to signed-in CMS admins/editors (Payload session cookie). */
const canPreview = cache(async (): Promise<boolean> => {
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })
    const role = user && 'role' in user ? (user as { role?: string }).role : undefined
    return role === 'admin' || role === 'editor'
  } catch {
    return false
  }
})

const loadArticle = cache(async (locale: Locale, slug: string) => {
  const preview = await canPreview()
  const article = await getArticleBySlug(locale, slug, preview)
  return article ? { article, isDraft: !article.isPublic } : null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const loaded = await loadArticle(locale, slug)
  if (!loaded) return {}
  const { article, isDraft } = loaded
  const t = getDictionary(locale).knowledge.article
  return buildMetadata({
    locale,
    title: article.seo.metaTitle ?? article.title,
    description: article.seo.metaDescription ?? article.excerpt ?? interpolate(t.metaDescriptionFallback, { title: article.title }),
    path: `/knowledge/${article.slug}`,
    noindex: isDraft,
    type: 'article',
  })
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const loaded = await loadArticle(locale, slug)
  if (!loaded) notFound()
  const { article, isDraft } = loaded

  const related = isDraft
    ? []
    : (await getArticles(locale, article.category, 4)).filter((a) => a.slug !== article.slug).slice(0, 3)

  return <ArticleView locale={locale} dict={getDictionary(locale)} article={article} related={related} isDraft={isDraft} />
}
