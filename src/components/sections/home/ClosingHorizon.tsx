'use client'

import { useRef } from 'react'
import { SunriseCurve } from '@/components/brand/SunriseCurve'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { mq, motionDisabled } from '@/lib/motion/tokens'
import { cn } from '@/lib/cn'

/*
 * Sun geometry in the SunriseCurve viewBox (0 0 1200 620) so the disc and the arcs share one coordinate
 * system. The clip is the area ABOVE the first (vermilion) arc of the Signature Curve — copied from
 * SunriseCurve PATHS[0] and lifted by an 18-unit gap — so the sun is hidden below the line and rises
 * from behind it. Keep in sync if the brand geometry in SunriseCurve ever changes.
 */
const HORIZON_CLIP = 'M -600 -900 L -600 502 L -20 502 C 300 412, 700 232, 1220 -28 L 1800 -28 L 1800 -900 Z'
const SUN = { cx: 560, cy: 380, r: 300 }
/** Start offset (user units): far enough down that no part of the disc clears the line. */
const SUN_START_Y = 280

/**
 * Signature moment 6 "Closing Sunrise CTA" — the horizon band under the closing copy.
 * A sun disc (the page's single vermilion → amber gradient) rises, scrubbed to the scroll, from behind
 * the Signature Curve, which emerges from the lower edge and leaves the canvas on the right.
 * Physical placement on purpose: the curve keeps the PDF orientation in both locales (never mirrored).
 * Decorative only (aria-hidden); reduced motion / motion-off ⇒ sun fully risen, curve drawn.
 */
export function ClosingHorizon({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      const sun = root?.querySelector<SVGCircleElement>('[data-closing-sun]')
      if (!root || !sun || motionDisabled()) return
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        gsap.fromTo(
          sun,
          { y: SUN_START_Y },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} aria-hidden data-reveal-manual="" className={cn('pointer-events-none', className)}>
      <div className="absolute right-[-41%] bottom-[-14%] w-[170%] md:right-[-7%] md:bottom-[-17%] md:w-[82%]">
        <svg
          viewBox="0 0 1200 620"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          className="absolute inset-0 block size-full overflow-visible"
        >
          <defs>
            {/* Vermilion at the horizon → amber at the crown, in the disc's own (moving) user space. */}
            <linearGradient id="closing-sun-fill" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2="80">
              <stop offset="0" stopColor="#FE3300" />
              <stop offset="1" stopColor="#FEB821" />
            </linearGradient>
            <clipPath id="closing-horizon-clip">
              <path d={HORIZON_CLIP} />
            </clipPath>
          </defs>
          <g clipPath="url(#closing-horizon-clip)">
            <circle data-closing-sun="" cx={SUN.cx} cy={SUN.cy} r={SUN.r} fill="url(#closing-sun-fill)" />
          </g>
        </svg>
        <SunriseCurve lines={3} tone="dark" strokeWidth={6} trigger="scroll" duration={2.2} className="relative" />
      </div>
    </div>
  )
}
