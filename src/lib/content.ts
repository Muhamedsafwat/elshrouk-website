import 'server-only'

import { cache } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import type { Article, Media } from '@/payload-types'
import { publicContentWhere } from '@/payload/access'
import { getPayload } from './payload'
import { SLUG_PATTERN } from './route-table'

/**
 * Editorial content access. CMS values override the versioned dictionary copy when present; when the
 * CMS is empty or unreachable the dictionary (approved/proposed copy) renders instead — never blank.
 */

export type Metric = { key: string; qualifier: string; value: string; unit: string; label: string; srLabel: string }

export const getMetrics = cache(async (locale: Locale): Promise<{ items: Metric[]; footnote: string }> => {
  const fallback = getDictionary(locale).common.metrics
  try {
    const payload = await getPayload()
    const g = await payload.findGlobal({ slug: 'metrics', locale, depth: 0 })
    const items = (g.items ?? []).map((m) => ({
      key: m.key,
      qualifier: m.qualifier,
      value: m.value,
      unit: m.unit ?? '',
      label: m.label,
      srLabel: m.srLabel,
    }))
    if (items.length === 3) return { items, footnote: g.footnote || fallback.footnote }
  } catch (error) {
    console.error('[cms] metrics unavailable, using approved dictionary statements', error)
  }
  return { items: fallback.items.map((m) => ({ ...m })), footnote: fallback.footnote }
})

export type HomepageOverrides = {
  heroEyebrow?: string
  heroHeadline?: string[]
  heroSubhead?: string
  heroPrimaryCta?: string
  heroSecondaryCta?: string
  statementLines?: string[]
  closingHeadline?: string[]
  closingSubhead?: string
  sections: Record<
    'showProof' | 'showStatement' | 'showFarmTypes' | 'showProductUniverse' | 'showJourney' | 'showValues' | 'showProductPreview' | 'showPartnerProof' | 'showFaq',
    boolean
  >
}

const lines = (arr: { text: string }[] | null | undefined) => {
  const out = (arr ?? []).map((l) => l.text).filter(Boolean)
  return out.length ? out : undefined
}

export const getHomepage = cache(async (locale: Locale): Promise<HomepageOverrides> => {
  const allOn: HomepageOverrides['sections'] = {
    showProof: true,
    showStatement: true,
    showFarmTypes: true,
    showProductUniverse: true,
    showJourney: true,
    showValues: true,
    showProductPreview: true,
    showPartnerProof: true,
    showFaq: true,
  }
  try {
    const payload = await getPayload()
    const g = await payload.findGlobal({ slug: 'homepage', locale, depth: 0, fallbackLocale: false as unknown as 'ar' })
    return {
      heroEyebrow: g.heroEyebrow || undefined,
      heroHeadline: lines(g.heroHeadline),
      heroSubhead: g.heroSubhead || undefined,
      heroPrimaryCta: g.heroPrimaryCta || undefined,
      heroSecondaryCta: g.heroSecondaryCta || undefined,
      statementLines: lines(g.statementLines),
      closingHeadline: lines(g.closingHeadline),
      closingSubhead: g.closingSubhead || undefined,
      sections: {
        showProof: g.showProof !== false,
        showStatement: g.showStatement !== false,
        showFarmTypes: g.showFarmTypes !== false,
        showProductUniverse: g.showProductUniverse !== false,
        showJourney: g.showJourney !== false,
        showValues: g.showValues !== false,
        showProductPreview: g.showProductPreview !== false,
        showPartnerProof: g.showPartnerProof !== false,
        showFaq: g.showFaq !== false,
      },
    }
  } catch (error) {
    console.error('[cms] homepage global unavailable, using dictionary copy', error)
    return { sections: allOn }
  }
})

export type FaqItem = { id: string; question: string; answer: string }

export const getFaqs = cache(async (locale: Locale, placement: 'home' | 'products' | 'contact' = 'home'): Promise<FaqItem[]> => {
  try {
    const payload = await getPayload()
    const res = await payload.find({
      collection: 'faqs',
      where: { and: [publicContentWhere(), { placement: { contains: placement } }] },
      locale,
      sort: 'order',
      limit: 6,
      overrideAccess: false,
    })
    if (res.docs.length) return res.docs.map((f) => ({ id: String(f.id), question: f.question, answer: f.answer }))
  } catch (error) {
    console.error('[cms] faqs unavailable, using dictionary copy', error)
  }
  if (placement !== 'home') return []
  return getDictionary(locale).home.faq.items.map((f, i) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
})

/* ---------------- Knowledge hub ---------------- */

export type ArticleCard = {
  id: number
  slug: string
  title: string
  excerpt?: string
  category: string
  publishedAt?: string
  cover?: { url: string; alt: string; width?: number; height?: number }
  readingMinutes: number
}

const coverOf = (m: unknown) => {
  const media = m && typeof m === 'object' && 'url' in m ? (m as Media) : undefined
  return media?.url ? { url: media.sizes?.card?.url || media.url, alt: media.alt ?? '', width: media.width ?? undefined, height: media.height ?? undefined } : undefined
}

/** Counts words in a Lexical JSON tree (Arabic ≈ 180 wpm, English ≈ 220 wpm). */
export function readingMinutes(body: unknown, locale: Locale): number {
  let words = 0
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { text?: string; children?: unknown[]; root?: unknown }
    if (typeof n.text === 'string') words += n.text.trim().split(/\s+/).filter(Boolean).length
    if (n.root) walk(n.root)
    n.children?.forEach(walk)
  }
  walk(body)
  return Math.max(1, Math.round(words / (locale === 'ar' ? 180 : 220)))
}

const toArticleCard = (a: Article, locale: Locale): ArticleCard => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt ?? undefined,
  category: a.category,
  publishedAt: a.publishedAt ?? undefined,
  cover: coverOf(a.coverImage),
  readingMinutes: readingMinutes(a.body, locale),
})

export async function getArticles(locale: Locale, category?: string, limit = 24): Promise<ArticleCard[]> {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'articles',
    where: { and: [publicContentWhere(), ...(category ? [{ category: { equals: category } }] : [])] },
    locale,
    fallbackLocale: false as unknown as 'ar',
    depth: 1,
    limit,
    sort: '-publishedAt',
    overrideAccess: false,
  })
  // Only show articles that actually exist in the requested locale.
  return res.docs.filter((a) => Boolean(a.title)).map((a) => toArticleCard(a, locale))
}

export async function getArticleBySlug(locale: Locale, slug: string, preview = false) {
  if (!SLUG_PATTERN.test(slug)) return null
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'articles',
    where: preview ? { slug: { equals: slug } } : { and: [publicContentWhere(), { slug: { equals: slug } }] },
    locale,
    fallbackLocale: false as unknown as 'ar',
    depth: 1,
    limit: 1,
    overrideAccess: preview,
  })
  const a = res.docs[0]
  if (!a || !a.title) return null
  return {
    ...toArticleCard(a, locale),
    body: a.body,
    sources: (a.sources ?? []).map((s) => ({ label: s.label, url: s.url ?? undefined })),
    author: a.authorVerified && a.author ? a.author : undefined,
    professionalReview: a.professionalReview === true,
    seo: { metaTitle: a.seo?.metaTitle ?? undefined, metaDescription: a.seo?.metaDescription ?? undefined },
    isPublic: a.approvalStatus === 'approved' && a.isPublished === true,
    updatedAt: a.updatedAt,
  }
}

export async function getPublicArticleSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'articles',
    where: publicContentWhere(),
    depth: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
    overrideAccess: false,
  })
  return res.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt }))
}
