'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled } from '@/lib/motion/tokens'
import { cn } from '@/lib/cn'

/**
 * SIGNATURE CURVE (PDF p.14): the arc under the wordmark extended as 1–3 parallel lines, cropped off
 * an edge. Vermilion → amber → black (or grey on dark), one curve group per layout, never over the logo
 * and never under body text. Draws in on entry; optional subtle scroll drift.
 *
 * The geometry is a gentle convex arc rising toward the inline-end, matching the brand cover (p.1).
 * Mirrored automatically in RTL so it always rises away from the reading start.
 */
type Props = {
  lines?: 1 | 2 | 3
  tone?: 'light' | 'dark' | 'vermilion'
  className?: string
  /** Render final state only (no draw animation). */
  static?: boolean
  /** Start drawing when it enters the viewport (default) or immediately (hero). */
  trigger?: 'scroll' | 'immediate'
  delay?: number
  duration?: number
  /** Scroll-linked drift in px (desktop pointer devices only). */
  drift?: number
  strokeWidth?: number
  mirror?: boolean
}

const PATHS = [
  'M -20 520 C 300 430, 700 250, 1220 -10',
  'M -20 560 C 320 480, 720 310, 1220 60',
  'M 30 610 C 380 540, 760 380, 1220 140',
]

export function SunriseCurve({
  lines = 3,
  tone = 'light',
  className,
  static: isStatic = false,
  trigger = 'scroll',
  delay = 0,
  duration = 1.6,
  drift = 0,
  strokeWidth = 6,
  mirror = true,
}: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const colors =
    tone === 'dark'
      ? ['#FE3300', '#FEB821', '#7a7a76']
      : tone === 'vermilion'
        ? ['#000000', '#FEB821', '#FFFFFF']
        : ['#FE3300', '#FEB821', '#000000']

  useGSAP(
    () => {
      const svg = ref.current
      if (!svg || isStatic || motionDisabled()) return
      const paths = svg.querySelectorAll('path')
      const tl = gsap.timeline({
        delay,
        paused: trigger === 'scroll',
        scrollTrigger: trigger === 'scroll' ? { trigger: svg, start: 'top 85%', once: true } : undefined,
      })
      tl.fromTo(paths, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration, ease: 'expo.inOut', stagger: 0.14 })
      if (trigger === 'immediate') tl.play()

      if (drift && window.matchMedia('(min-width: 64rem) and (pointer: fine)').matches) {
        gsap.to(svg, {
          y: -drift,
          ease: 'none',
          scrollTrigger: { trigger: svg, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      }
    },
    { scope: ref, dependencies: [isStatic, trigger] },
  )

  return (
    <svg
      ref={ref}
      viewBox="0 0 1200 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
      className={cn('block h-auto w-full overflow-visible', mirror && 'rtl:-scale-x-100', className)}
      data-sunrise-curve=""
    >
      {PATHS.slice(0, lines).map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={colors[i]}
          strokeWidth={i === 2 ? strokeWidth * 0.55 : strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  )
}
