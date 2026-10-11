import Image from 'next/image'
import type { Locale } from '@/i18n/config'
import { photos, type PhotoId } from '@/content/photos'
import { cn } from '@/lib/cn'

type Props = {
  id: PhotoId
  locale: Locale
  /** Required responsive sizes hint, e.g. "(min-width: 1024px) 40vw, 100vw". */
  sizes: string
  className?: string
  imgClassName?: string
  /**
   * Mark only the LCP image of a page. Rendered as `loading="eager"` + `fetchPriority="high"` (Next 16
   * deprecates `priority`; its docs prefer these two over `preload`). React's SSR also emits a matching
   * `<link rel="preload" fetchpriority="high">` for it, so the request starts from the document head.
   */
  priority?: boolean
  /** 'arch' = brand sunrise window (fully rounded top). */
  shape?: 'rect' | 'arch' | 'rounded'
  /** Declarative clip reveal handled by MotionRuntime. */
  reveal?: boolean
  quality?: 60 | 72 | 80 | 90
  /** Decorative duplicates (e.g. sticky media mirrors) should be hidden from AT. */
  decorative?: boolean
  /** Extra attributes for scene timelines (e.g. data-parallax). */
  dataAttr?: Record<string, string>
  children?: React.ReactNode
}

/**
 * Registry-driven documentary photo (src/content/photos.ts): bilingual alt text, focal-point aware
 * object-position, blur placeholder from the static import, AVIF/WebP via next/image.
 * The parent decides the aspect ratio through className (e.g. "aspect-[4/5]").
 */
export function Photo({
  id,
  locale,
  sizes,
  className,
  imgClassName,
  priority = false,
  shape = 'rect',
  reveal = false,
  quality = 72,
  decorative = false,
  dataAttr,
  children,
}: Props) {
  const photo = photos[id]
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-stone-200',
        shape === 'arch' && 'rounded-t-full',
        shape === 'rounded' && 'rounded-md',
        className,
      )}
      data-reveal={reveal ? 'image' : undefined}
      {...dataAttr}
    >
      <Image
        src={photo.src}
        alt={decorative ? '' : photo.alt[locale]}
        aria-hidden={decorative || undefined}
        fill
        sizes={sizes}
        loading={priority ? 'eager' : undefined}
        fetchPriority={priority ? 'high' : undefined}
        quality={quality}
        placeholder="blur"
        className={cn('object-cover', imgClassName)}
        style={{ objectPosition: `${photo.focal.x}% ${photo.focal.y}%` }}
      />
      {children}
    </div>
  )
}
