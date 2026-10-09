import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ProductDetailView, toAbsoluteUrl } from '@/components/products/ProductDetailView'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { interpolate } from '@/i18n/format'
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog'
import { getPayload } from '@/lib/payload'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string; slug: string }> }

/** Draft preview only for an authenticated admin/editor (spec §6.5, §12.1). Anyone else sees public data. */
const canPreview = cache(async (): Promise<boolean> => {
  try {
    const payload = await getPayload()
    const { user } = await payload.auth({ headers: await headers() })
    const role = (user as { role?: string | null } | null)?.role
    return role === 'admin' || role === 'editor'
  } catch {
    return false
  }
})

/** Shared by generateMetadata and the page (one lookup per request). Invalid/unpublished slugs → null. */
const loadProduct = cache(async (locale: Locale, slug: string) => {
  const preview = await canPreview()
  const product = await getProductBySlug(locale, slug, preview)
  return { product, preview }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const { product } = await loadProduct(locale, slug)
  // Decided before any HTML is sent so unknown/unpublished slugs get a real 404 status. (The catalogue's
  // loading.tsx lives in the (catalog) group precisely so no Suspense boundary wraps this route.)
  if (!product) notFound()
  const t = getDictionary(locale).products.detail
  const first = product.gallery[0]
  return buildMetadata({
    locale,
    title: product.seo?.metaTitle || product.name,
    description: product.seo?.metaDescription || interpolate(t.metaDescriptionFallback, { name: product.name }),
    path: `/products/${product.slug}`,
    // Drafts (editor preview) and fixtures are never indexed.
    noindex: !product.isPublic,
    image:
      first?.width && first.height
        ? { url: toAbsoluteUrl(first.url), width: first.width, height: first.height, alt: first.alt || product.name }
        : undefined,
  })
}

/** Product detail (spec §6.5): validated slug, public approved record (or editor preview), else 404. */
export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const { product, preview } = await loadProduct(locale, slug)
  if (!product) notFound()

  const related = await getRelatedProducts(locale, product, 3).catch((error: unknown) => {
    console.error('[product] related products unavailable', error)
    return []
  })

  return (
    <ProductDetailView
      locale={locale}
      dict={getDictionary(locale)}
      product={product}
      related={related}
      isDraft={preview && !product.isPublic}
    />
  )
}
