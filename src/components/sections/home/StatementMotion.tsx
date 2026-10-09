'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled, mq } from '@/lib/motion/tokens'

/**
 * Scene 3 choreography. The authored lines rise through the global controller (`data-reveal="lines"`);
 * this layer adds what is specific to the statement:
 *  - desktop: scroll-linked micro-shift (line 1 → inline-end, line 2 → inline-start, 24px, scrub),
 *    the horizon hairline growing from the start edge as the row arrives, and a ≤ 28px photo drift;
 *  - mobile: the horizon draws once on entry (no scrub, no parallax).
 * Reduced motion / motion-off: nothing runs — the server markup already is the final state.
 */
export function StatementMotion({
  children,
  className,
  labelledBy,
}: {
  children: ReactNode
  className?: string
  labelledBy: string
}) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = ref.current
      if (!section || motionDisabled()) return
      const towardEnd = getComputedStyle(section).direction === 'rtl' ? -24 : 24
      const mm = gsap.matchMedia()

      mm.add(mq.desktopMotion, () => {
        const [first, second] = gsap.utils.toArray<HTMLElement>('[data-statement-line]', section)
        const shift = { trigger: section, start: 'top 70%', end: 'bottom 15%', scrub: 0.6 }
        if (first) gsap.fromTo(first, { x: 0 }, { x: towardEnd, ease: 'none', scrollTrigger: shift })
        if (second) gsap.fromTo(second, { x: 0 }, { x: -towardEnd, ease: 'none', scrollTrigger: shift })

        gsap.fromTo(
          '[data-statement-horizon]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-statement-row]', start: 'top 92%', end: 'top 40%', scrub: 0.6 },
          },
        )

        gsap.fromTo(
          '[data-statement-photo] img',
          { yPercent: -4, scale: 1.1 },
          {
            yPercent: 4,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-statement-photo]', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        )
      })

      mm.add(mq.mobileMotion, () => {
        gsap.fromTo(
          '[data-statement-horizon]',
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: '[data-statement-row]', start: 'top 88%', once: true },
          },
        )
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="statement" data-theme="light" aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  )
}
