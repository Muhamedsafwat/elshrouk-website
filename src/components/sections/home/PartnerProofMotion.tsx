'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { mq, motionDisabled } from '@/lib/motion/tokens'

/** Underline thickness — keep in sync with `STATEMENT_RULE` in PartnerProof.tsx (final, no-JS state). */
const RULE = '0.09em'

/**
 * Scene 9 choreography:
 * - each approved statement gets its vermilion underline drawn as it scrolls through the reading zone
 *   (scrubbed; grows from the inline-start edge, so right→left in Arabic);
 * - the documentary triptych drifts at three depths (desktop pointer devices only, ≤ 32px travel).
 * Reduced motion / motion-off ⇒ underlines fully drawn, no drift.
 */
export function PartnerProofMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root || motionDisabled()) return
      const mm = gsap.matchMedia()

      mm.add(mq.motion, () => {
        gsap.utils.toArray<HTMLElement>('[data-pp-statement]', root).forEach((el) => {
          gsap.fromTo(
            el,
            { backgroundSize: `0% ${RULE}` },
            {
              backgroundSize: `100% ${RULE}`,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 84%', end: 'bottom 52%', scrub: 0.6 },
            },
          )
        })
      })

      mm.add(mq.desktopMotion, () => {
        const triptych = root.querySelector<HTMLElement>('[data-pp-triptych]')
        if (!triptych) return
        gsap.utils.toArray<HTMLElement>('[data-pp-depth]', triptych).forEach((el) => {
          const depth = Math.min(16, Number(el.dataset.ppDepth ?? 0))
          gsap.fromTo(
            el,
            { y: depth },
            {
              y: -depth,
              ease: 'none',
              scrollTrigger: { trigger: triptych, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          )
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} data-reveal-manual="" className={className}>
      {children}
    </div>
  )
}
