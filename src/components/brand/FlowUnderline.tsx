'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled } from '@/lib/motion/tokens'
import { cn } from '@/lib/cn'

/**
 * Distribution-Flow underline (PDF p.14): a straight run with round nodes; `destination` marks the one
 * amber node of the layout. Draws from the inline-start on entry.
 */
export function FlowUnderline({
  destination = false,
  tone = 'dark',
  className,
  delay = 0,
}: {
  destination?: boolean
  tone?: 'dark' | 'light'
  className?: string
  delay?: number
}) {
  const ref = useRef<SVGSVGElement>(null)
  const stroke = tone === 'dark' ? '#FFFFFF' : '#000000'

  useGSAP(
    () => {
      const svg = ref.current
      if (!svg || motionDisabled()) return
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 88%', once: true }, delay })
      tl.fromTo(svg.querySelector('line'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'expo.inOut' })
        .fromTo(svg.querySelectorAll('circle'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.5 }, 0.1)
    },
    { scope: ref },
  )

  return (
    <svg ref={ref} viewBox="0 0 320 14" aria-hidden className={cn('block h-3.5 w-full max-w-80 overflow-visible rtl:-scale-x-100', className)}>
      <line x1="7" y1="7" x2="313" y2="7" stroke={stroke} strokeOpacity={0.55} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx="7" cy="7" r="4.5" fill={stroke} />
      <circle cx="313" cy="7" r="5.5" fill={destination ? '#FEB821' : stroke} />
    </svg>
  )
}
