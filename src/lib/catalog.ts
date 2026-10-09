import 'server-only'

import type { Where } from 'payload'
import { cache } from 'react'
import type { Locale } from '@/i18n/config'
import type { Media, PoultrySegment, Product, ProductCategory } from '@/payload-types'
import { publicContentWhere } from '@/payload/access'
import { searchTokens } from '@/lib/search/normalize'
import { CATEGORY_KEYS, PAGE_SIZE, SEGMENT_KEYS, type CatalogParams, type CategoryKey, type SegmentKey } from './catalog-params'
import { getPayload } from './payload'

/**
 * Public catalogue data access (spec §6.4–6.5, §10). Every public query runs with
 * overrideAccess:false (Payload enforces approved+published and strips staff-only fields) AND an
 * explicit publicContentWhere() — defence in depth so drafts can never leak.
 */

export type CatalogImage = { url: string; alt: string; width?: number; height?: number }

export type ProductCard = {
  id: number
  slug: string
  name: string
  nameAlt?: string
  category?: { key: CategoryKey; name: string }
  segments: { key: SegmentKey; name: string }[]
  manufacturer?: string
  packSize?: string
  form?: string
  availability: 'inquiry_only' | 'on_request' | 'confirmed'
  image?: CatalogImage
}

export type ProductDetail = ProductCard & {
  sku?: string
  description?: string
  warnings?: string
  safetyText?: string
  labelPdf?: { url: string; filename?: string }
  gallery: CatalogImage[]
  seo?: { metaTitle?: string; metaDescription?: string }
  isPublic: boolean
  approvalStatus: string
  updatedAt: string
}

export type Facets = {
  total: number
  categories: Record<CategoryKey, number>
  segments: Record<SegmentKey, number>
  manufacturers: string[]
}

const asMedia = (m: unknown): Media | undefined => (m && typeof m === 'object' && 'url' in m ? (m as Media) : undefined)

const toImage = (m: unknown): CatalogImage | undefined => {
  const media = asMedia(m)
  if (!media?.url) return undefined
  const card = media.sizes?.card?.url
  return { url: card || media.url, alt: media.alt ?? '', width: media.sizes?.card?.width ?? media.width ?? undefined, height: media.sizes?.card?.height ?? media.height ?? undefined }
}

function toCard(p: Product, locale: Locale): ProductCard {
  const category = p.category && typeof p.category === 'object' ? (p.category as ProductCategory) : undefined
  const segments = (p.segments ?? []).filter((s): s is PoultrySegment => typeof s === 'object' && s !== null)
  const primaryName = locale === 'en' && p.nameEn ? p.nameEn : p.nameAr
  const altName = locale === 'en' ? (p.nameEn ? p.nameAr : undefined) : p.nameEn || undefined
  const images = (p.images ?? []) as unknown[]
  return {
    id: p.id,
    slug: p.slug,
    name: primaryName,
    nameAlt: altName ?? undefined,
    category: category ? { key: category.key as CategoryKey, name: category.name } : undefined,
    segments: segments.map((s) => ({ key: s.key as SegmentKey, name: s.name })),
    manufacturer: p.manufacturerVerified && p.manufacturer ? p.manufacturer : undefined,
    packSize: p.packSize ?? undefined,
    form: p.form ?? undefined,
    availability: (p.availabilityStatus ?? 'inquiry_only') as ProductCard['availability'],
    image: toImage(images[0]),
  }
}

function filtersWhere(params: Partial<CatalogParams>): Where[] {
  const and: Where[] = [publicContentWhere()]
  if (params.category) and.push({ 'category.key': { equals: params.category } })
  if (params.segment) and.push({ 'segments.key': { equals: params.segment } })
  if (params.manufacturer) {
    and.push({ manufacturer: { equals: params.manufacturer } }, { manufacturerVerified: { equals: true } })
  }
  for (const token of searchTokens(params.q)) and.push({ searchText: { contains: token } })
  return and
}

export async function queryProducts(locale: Locale, params: CatalogParams) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'products',
    where: { and: filtersWhere(params) },
    locale,
    fallbackLocale: 'ar',
    depth: 1,
    page: params.page,
    limit: PAGE_SIZE,
    sort: locale === 'en' ? 'nameEn' : 'nameAr',
    overrideAccess: false,
  })
  return {
    items: result.docs.map((p) => toCard(p, locale)),
    total: result.totalDocs,
    page: result.page ?? 1,
    totalPages: Math.max(1, result.totalPages),
  }
}

export const getFacets = cache(async (locale: Locale): Promise<Facets> => {
  const payload = await getPayload()
  const base = publicContentWhere()
  const count = async (where: Where) =>
    (await payload.count({ collection: 'products', where: { and: [base, where] }, overrideAccess: false })).totalDocs
  const [total, ...rest] = await Promise.all([
    payload.count({ collection: 'products', where: base, overrideAccess: false }).then((r) => r.totalDocs),
    ...CATEGORY_KEYS.map((k) => count({ 'category.key': { equals: k } })),
    ...SEGMENT_KEYS.map((k) => count({ 'segments.key': { equals: k } })),
  ])
  const manufacturersRes = await payload.find({
    collection: 'products',
    where: { and: [base, { manufacturerVerified: { equals: true } }, { manufacturer: { exists: true } }] },
    locale,
    depth: 0,
    limit: 500,
    pagination: false,
    select: { manufacturer: true },
    overrideAccess: false,
  })
  const manufacturers = [...new Set(manufacturersRes.docs.map((d) => d.manufacturer).filter((m): m is string => Boolean(m)))].sort()
  return {
    total,
    categories: Object.fromEntries(CATEGORY_KEYS.map((k, i) => [k, rest[i] ?? 0])) as Record<CategoryKey, number>,
    segments: Object.fromEntries(SEGMENT_KEYS.map((k, i) => [k, rest[CATEGORY_KEYS.length + i] ?? 0])) as Record<SegmentKey, number>,
    manufacturers,
  }
})

export async function getFeaturedProducts(locale: Locale, limit = 6): Promise<ProductCard[]> {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: publicContentWhere(),
    locale,
    fallbackLocale: 'ar',
    depth: 1,
    limit,
    sort: '-updatedAt',
    overrideAccess: false,
  })
  return res.docs.map((p) => toCard(p, locale))
}

export async function getProductsForSegment(locale: Locale, segment: SegmentKey, limit = 8): Promise<ProductCard[]> {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: { and: [publicContentWhere(), { 'segments.key': { equals: segment } }] },
    locale,
    fallbackLocale: 'ar',
    depth: 1,
    limit,
    sort: '-updatedAt',
    overrideAccess: false,
  })
  return res.docs.map((p) => toCard(p, locale))
}

/**
 * Product detail. `preview` is only true for an authenticated admin/editor (checked by the caller via
 * payload.auth) — it lets editors see unpublished records with a DRAFT banner and noindex.
 */
export async function getProductBySlug(locale: Locale, slug: string, preview = false): Promise<ProductDetail | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: preview ? { slug: { equals: slug } } : { and: [publicContentWhere(), { slug: { equals: slug } }] },
    locale,
    fallbackLocale: 'ar',
    depth: 1,
    limit: 1,
    overrideAccess: preview,
  })
  const p = res.docs[0]
  if (!p) return null
  const card = toCard(p, locale)
  const label = asMedia(p.labelPdf)
  return {
    ...card,
    sku: p.sku ?? undefined,
    description: p.description ?? undefined,
    warnings: p.warnings ?? undefined,
    safetyText: p.safetyText ?? undefined,
    labelPdf: p.labelPdfApproved && label?.url ? { url: label.url, filename: label.filename ?? undefined } : undefined,
    gallery: ((p.images ?? []) as unknown[]).map(toImage).filter((x): x is CatalogImage => Boolean(x)),
    seo: { metaTitle: p.seo?.metaTitle ?? undefined, metaDescription: p.seo?.metaDescription ?? undefined },
    isPublic: p.approvalStatus === 'approved' && p.isPublished === true && p.isFixture !== true,
    approvalStatus: p.approvalStatus,
    updatedAt: p.updatedAt,
  }
}

export async function getRelatedProducts(locale: Locale, product: ProductDetail, limit = 4): Promise<ProductCard[]> {
  if (!product.category) return []
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: { and: [publicContentWhere(), { 'category.key': { equals: product.category.key } }, { id: { not_equals: product.id } }] },
    locale,
    fallbackLocale: 'ar',
    depth: 1,
    limit,
    overrideAccess: false,
  })
  return res.docs.map((p) => toCard(p, locale))
}

/** Slugs of public products — for sitemap generation only. */
export async function getPublicProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  const payload = await getPayload()
  const res = await payload.find({
    collection: 'products',
    where: publicContentWhere(),
    depth: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
    overrideAccess: false,
  })
  return res.docs.map((d) => ({ slug: d.slug, updatedAt: d.updatedAt }))
}

/** Taxonomy with dictionary fallback so the UI never renders blank before the CMS is seeded. */
export const getTaxonomy = cache(async (locale: Locale) => {
  const payload = await getPayload()
  const [cats, segs] = await Promise.all([
    payload.find({ collection: 'product-categories', locale, sort: 'order', depth: 1, limit: 10, overrideAccess: false }),
    payload.find({ collection: 'poultry-segments', locale, sort: 'order', depth: 1, limit: 10, overrideAccess: false }),
  ])
  return {
    categories: cats.docs.map((c) => ({ key: c.key as CategoryKey, name: c.name, description: c.description ?? undefined, image: toImage(c.image) })),
    segments: segs.docs.map((s) => ({ key: s.key as SegmentKey, name: s.name, intro: s.intro ?? undefined, image: toImage(s.image) })),
  }
})
