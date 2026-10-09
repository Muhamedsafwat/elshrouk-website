/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/cn'

/**
 * Official Alshorouk lockup — vectors extracted from the brand PDF (pages 3 & 9). Never redrawn,
 * recoloured, rotated, stretched or given effects (PDF p.11). Aspect ratios are the artwork's own.
 *
 * - color: full-colour master — white / light grounds only (face is unfilled by design).
 * - white: official one-colour white — black, dark photo or vermilion grounds.
 * - black: official one-colour black — light grounds, single-colour contexts.
 */
const VARIANTS = {
  color: { src: '/brand/alshorouk-logo-full-color.svg', ratio: 237.145 / 255.192 },
  white: { src: '/brand/alshorouk-logo-white.svg', ratio: 85.615 / 92.319 },
  black: { src: '/brand/alshorouk-logo-black.svg', ratio: 86.372 / 92.319 },
} as const

export type LogoVariant = keyof typeof VARIANTS

/** Brand minimum for the full lockup on screen (PDF p.9). */
export const LOGO_MIN_WIDTH = 110

type LogoProps = {
  variant?: LogoVariant
  /** Rendered width in CSS px — clamped to the 110px brand minimum. */
  width: number
  alt: string
  className?: string
  priority?: boolean
  /** Wrap with the mandatory clear-space (15% of logo width on every side). */
  withClearSpace?: boolean
}

export function Logo({ variant = 'color', width, alt, className, priority = false, withClearSpace = false }: LogoProps) {
  const { src, ratio } = VARIANTS[variant]
  const w = Math.max(LOGO_MIN_WIDTH, Math.round(width))
  const h = Math.round(w * ratio)
  const img = (
    <img
      src={src}
      alt={alt}
      width={w}
      height={h}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      loading={priority ? 'eager' : 'lazy'}
      draggable={false}
      className={cn('block h-auto max-w-none select-none', !withClearSpace && className)}
      style={{ width: w }}
    />
  )
  if (!withClearSpace) return img
  return (
    <span className={cn('inline-block', className)} style={{ padding: Math.round(w * 0.15) }} data-logo-clearspace="">
      {img}
    </span>
  )
}
