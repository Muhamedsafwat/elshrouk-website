'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

/**
 * Fires catalogue analytics once per resulting view (after the server has answered), so the event
 * carries the real result count. The search text itself is never sent (could contain personal data).
 */
export function CatalogTracker({
  q,
  category,
  segment,
  manufacturer,
  total,
  page,
}: {
  q?: string
  category?: string
  segment?: string
  manufacturer?: string
  total: number
  page: number
}) {
  useEffect(() => {
    if (q) trackEvent('product_search', { results: total, page })
  }, [q, total, page])

  useEffect(() => {
    if (category || segment || manufacturer) trackEvent('product_filter', { category, segment, results: total })
  }, [category, segment, manufacturer, total])

  return null
}

/** product_view — fired once per product detail view. */
export function ProductViewTracker({ slug, category }: { slug: string; category?: string }) {
  useEffect(() => {
    trackEvent('product_view', { slug, category })
  }, [slug, category])
  return null
}
