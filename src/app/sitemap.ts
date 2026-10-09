import type { MetadataRoute } from 'next'
import { hrefLang, type Locale } from '@/i18n/config'
import { absoluteUrl, articleHref, href, productHref, type RouteKey } from '@/i18n/routing'
import { getPublicProductSlugs } from '@/lib/catalog'
import { getSiteSettings } from '@/lib/cms'
import { getPublicArticleSlugs } from '@/lib/content'

/** Rendered per request so the sitemap reflects CMS approvals immediately and the build never needs the DB. */
export const dynamic = 'force-dynamic'

/** Static routes change with deployments; the server start time is the honest "last modified". */
const DEPLOYED_AT = new Date()

const STATIC_ROUTES: { key: RouteKey; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { key: 'home', priority: 1, changeFrequency: 'weekly' },
  { key: 'solutions', priority: 0.9, changeFrequency: 'monthly' },
  { key: 'broilers', priority: 0.8, changeFrequency: 'monthly' },
  { key: 'layers', priority: 0.8, changeFrequency: 'monthly' },
  { key: 'breeders', priority: 0.8, changeFrequency: 'monthly' },
  { key: 'products', priority: 0.9, changeFrequency: 'weekly' },
  { key: 'about', priority: 0.7, changeFrequency: 'monthly' },
  { key: 'howWeWork', priority: 0.7, changeFrequency: 'monthly' },
  { key: 'knowledge', priority: 0.6, changeFrequency: 'weekly' },
  { key: 'contact', priority: 0.8, changeFrequency: 'yearly' },
  { key: 'partner', priority: 0.6, changeFrequency: 'yearly' },
  { key: 'privacy', priority: 0.2, changeFrequency: 'yearly' },
]

/**
 * Sitemap (spec §12.1 — published routes only): Arabic URLs always; English URLs (and hreflang pairs) only
 * once the CMS marks the English copy approved; the knowledge hub only when it is switched on; products and
 * articles only when approved + published.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings('ar')
  const locales: Locale[] = settings.englishApproved ? ['ar', 'en'] : ['ar']

  const [products, articles] = await Promise.all([
    getPublicProductSlugs().catch(() => []),
    getPublicArticleSlugs().catch(() => []),
  ])

  const entry = (
    path: (l: Locale) => string,
    lastModified: Date | string,
    extra: Pick<MetadataRoute.Sitemap[number], 'priority' | 'changeFrequency'>,
  ): MetadataRoute.Sitemap =>
    locales.map((locale) => ({
      url: absoluteUrl(path(locale)),
      lastModified,
      ...extra,
      ...(settings.englishApproved
        ? { alternates: { languages: Object.fromEntries(locales.map((l) => [hrefLang[l], absoluteUrl(path(l))])) } }
        : {}),
    }))

  const staticRoutes = STATIC_ROUTES.filter((r) => r.key !== 'knowledge' || settings.showKnowledgeHub)

  return [
    ...staticRoutes.flatMap((r) =>
      entry((l) => href(l, r.key), DEPLOYED_AT, { priority: r.priority, changeFrequency: r.changeFrequency }),
    ),
    ...products.flatMap((p) => entry((l) => productHref(l, p.slug), p.updatedAt, { priority: 0.7, changeFrequency: 'monthly' })),
    ...articles.flatMap((a) => entry((l) => articleHref(l, a.slug), a.updatedAt, { priority: 0.5, changeFrequency: 'monthly' })),
  ]
}
