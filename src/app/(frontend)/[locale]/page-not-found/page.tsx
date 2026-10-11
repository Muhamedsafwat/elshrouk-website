import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NotFoundView } from '@/components/sections/not-found/NotFoundView'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

/**
 * Target of the proxy's 404 rewrite (src/proxy.ts, src/lib/route-table.ts): unknown paths and missing slugs get this
 * fully server-rendered page with status 404, so it reads without JavaScript (CI-03). Rendered per request so a
 * cached copy never stands in for a product or article that is published later.
 */
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).common.notFound.meta
  return { title: t.title, description: t.description, robots: { index: false, follow: true } }
}

export default async function PageNotFound({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <NotFoundView locale={locale} />
}
