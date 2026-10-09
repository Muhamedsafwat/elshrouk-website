import 'server-only'

import type { Locale } from '@/i18n/config'
import { getPayload } from '@/lib/payload'
import { publicContentWhere } from '@/payload/access'

export type ProductContext = { id: number; label: string }

/** `?product=<id>` → positive integer id, or undefined. Anything else is ignored (never echoed). */
export function parseProductParam(raw: string | string[] | undefined): number | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (!value || !/^\d{1,9}$/.test(value)) return undefined
  const id = Number(value)
  return id > 0 ? id : undefined
}

/**
 * Resolves a product id through the PUBLIC gate only (approved + published + not a fixture; Payload access
 * with overrideAccess:false AND an explicit publicContentWhere()). Unknown, draft or hidden ids → null.
 * The label always comes from the database, never from the client.
 */
export async function getPublicProductContext(id: number, locale: Locale): Promise<ProductContext | null> {
  if (!Number.isInteger(id) || id <= 0) return null
  try {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: 'products',
      where: { and: [{ id: { equals: id } }, publicContentWhere()] },
      overrideAccess: false,
      depth: 0,
      limit: 1,
      pagination: false,
      select: { nameAr: true, nameEn: true },
    })
    const product = docs[0]
    if (!product) return null
    return { id: product.id, label: locale === 'en' && product.nameEn ? product.nameEn : product.nameAr }
  } catch {
    return null
  }
}
