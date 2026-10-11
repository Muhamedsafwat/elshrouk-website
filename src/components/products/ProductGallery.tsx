'use client'

import Image from 'next/image'
import { useState } from 'react'
import { interpolate } from '@/i18n/format'
import type { CatalogImage } from '@/lib/catalog'
import { cn } from '@/lib/cn'

/**
 * Approved product images only. Pack shots are shown whole (object-contain on warm grey) so labels are
 * never cropped; thumbnails are real buttons with aria-pressed.
 */
export function ProductGallery({
  images,
  name,
  labels,
}: {
  images: CatalogImage[]
  name: string
  labels: { galleryLabel: string; showImage: string }
}) {
  const [active, setActive] = useState(0)
  const current = images[active] ?? images[0]
  if (!current) return null

  return (
    <div role="group" aria-label={labels.galleryLabel}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-stone-100">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt || name}
          fill
          // First image = the page's LCP: eager + high priority (Next 16 deprecates `priority`; PERF-1).
          loading={active === 0 ? 'eager' : undefined}
          fetchPriority={active === 0 ? 'high' : undefined}
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="animate-[als-fade-up_500ms_var(--ease-sunrise)] object-contain p-6 motion-reduce:animate-none sm:p-12"
        />
      </div>
      {images.length > 1 ? (
        <ul className="mt-4 flex flex-wrap gap-3">
          {images.map((image, i) => (
            <li key={`${image.url}-${i}`}>
              <button
                type="button"
                aria-label={interpolate(labels.showImage, { n: i + 1 })}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  'relative block size-20 overflow-hidden rounded-xs border-2 bg-stone-100 transition-colors',
                  i === active ? 'border-ink' : 'border-transparent hover:border-line-strong',
                )}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
