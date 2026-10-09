import 'server-only'

import type { Metadata } from 'next'
import { hrefLang, ogLocale, type Locale } from '@/i18n/config'
import { absoluteUrl } from '@/i18n/routing'
import { getSiteSettings } from './cms'

type BuildArgs = {
  locale: Locale
  title: string
  description: string
  /** Path WITHOUT the locale prefix, e.g. '/about' or '' for home. */
  path: string
  noindex?: boolean
  image?: { url: string; width: number; height: number; alt: string }
  type?: 'website' | 'article'
}

const SITE_ENV = process.env.NEXT_PUBLIC_SITE_ENV ?? 'development'

/**
 * Indexing policy (spec §12.1):
 *  - nothing is indexable unless NEXT_PUBLIC_SITE_ENV=production AND the CMS site status is "production";
 *  - English pages stay noindex (and get no hreflang pairing) until the English copy is approved.
 */
export async function buildMetadata({ locale, title, description, path, noindex, image, type = 'website' }: BuildArgs): Promise<Metadata> {
  const settings = await getSiteSettings(locale)
  const englishLive = settings.englishApproved
  const indexable = SITE_ENV === 'production' && settings.isProduction && !noindex && (locale === 'ar' || englishLive)

  const url = absoluteUrl(`/${locale}${path}`)
  const languages: Record<string, string> = { [hrefLang.ar]: absoluteUrl(`/ar${path}`), 'x-default': absoluteUrl(`/ar${path}`) }
  if (englishLive) languages[hrefLang.en] = absoluteUrl(`/en${path}`)

  const ogImage = image ?? {
    url: absoluteUrl('/og/alshorouk-og.png'),
    width: 1200,
    height: 630,
    alt: locale === 'ar' ? 'الشروق — شريك متخصص لمزارع الدواجن' : 'Alshorouk — a specialist partner for poultry farms',
  }

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: !noindex, googleBot: { index: false, follow: !noindex } },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: locale === 'ar' ? 'الشروق' : 'Alshorouk',
      locale: ogLocale[locale],
      images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage.url] },
  }
}

/** Organization JSON-LD with verified facts only (name, URL, logo; contact data only once verified). */
export async function organizationJsonLd(locale: Locale) {
  const settings = await getSiteSettings(locale)
  const { channels } = settings
  const contactPoint =
    channels.phone || channels.email
      ? [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            ...(channels.phone ? { telephone: channels.phone } : {}),
            ...(channels.email ? { email: channels.email } : {}),
            availableLanguage: ['ar', 'en'],
          },
        ]
      : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'الشروق',
    alternateName: 'Alshorouk',
    url: absoluteUrl(`/${locale}`),
    logo: absoluteUrl('/brand/alshorouk-logo-full-color.svg'),
    ...(settings.legalName ? { legalName: settings.legalName } : {}),
    ...(contactPoint ? { contactPoint } : {}),
    ...(settings.channels.social.length ? { sameAs: settings.channels.social.map((s) => s.url) } : {}),
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

/** Serialises JSON-LD safely for a <script> tag (escapes "<" to prevent tag injection). */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
