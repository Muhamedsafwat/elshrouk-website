import type { Metadata } from 'next'
import { LocalePick } from '@/components/content/LocalePick'
import { NotFoundView } from '@/components/sections/not-found/NotFoundView'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

/**
 * Next passes the segment params to a not-found boundary's metadata; fall back to Arabic if it ever does not.
 * Next also injects `robots: noindex` for every 404 response — set explicitly here as well.
 */
export async function generateMetadata(props: { params?: Promise<{ locale?: string }> }): Promise<Metadata> {
  const params = props?.params ? await props.params : undefined
  const locale: Locale = isLocale(params?.locale) ? params.locale : 'ar'
  const t = getDictionary(locale).common.notFound.meta
  return { title: t.title, description: t.description, robots: { index: false, follow: true } }
}

/** Designed, localized 404 for every unknown path under a locale (spec §6.10). */
export default function NotFound() {
  return <LocalePick ar={<NotFoundView locale="ar" />} en={<NotFoundView locale="en" />} />
}
