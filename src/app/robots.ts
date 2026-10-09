import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/i18n/routing'

/**
 * robots.txt (spec §12.1): production allows the public site and keeps the CMS and APIs out;
 * every other environment (staging, preview, local) disallows crawling entirely but still names the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === 'production'
  return {
    rules: isProduction
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
