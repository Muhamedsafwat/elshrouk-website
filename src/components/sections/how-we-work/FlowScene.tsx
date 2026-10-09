'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motion, motionDisabled, mq } from '@/lib/motion/tokens'

/**
 * Precision-flow choreography (How we work). Desktop + motion only: each rail segment draws (scaleY from
 * the top) exactly while the reader's "reading line" (62% of the viewport) travels across it, and each
 * round node fills the moment that line reaches it — the amber destination lights last, once per pass.
 * Mobile, reduced motion and no-JS keep the server-rendered final state: full line, all nodes filled.
 * Step copy reveals itself declaratively (data-reveal) so text is never held hostage by the line.
 */
const LINE = '62%'

export function FlowScene({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (motionDisabled()) return
      const root = ref.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(mq.desktopMotion, () => {
        const steps = gsap.utils.toArray<HTMLElement>('[data-flow-step]', root)
        for (const step of steps) {
          const node = step.querySelector<HTMLElement>('[data-flow-node]')
          if (!node) continue
          const segIn = step.querySelector<HTMLElement>('[data-flow-in]')
          const segOut = step.querySelector<HTMLElement>('[data-flow-out]')
          const fill = step.querySelector<HTMLElement>('[data-flow-fill]')
          if (segIn) {
            gsap.fromTo(
              segIn,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: step, start: `top ${LINE}`, endTrigger: node, end: `center ${LINE}`, scrub: true },
              },
            )
          }
          if (segOut) {
            gsap.fromTo(
              segOut,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: node, start: `center ${LINE}`, endTrigger: step, end: `bottom ${LINE}`, scrub: true },
              },
            )
          }
          if (fill) {
            gsap.fromTo(
              fill,
              { scale: 0 },
              {
                scale: 1,
                duration: 0.5,
                ease: motion.ease.sunrise,
                scrollTrigger: { trigger: node, start: `center ${LINE}`, toggleActions: 'play none none reverse' },
              },
            )
          }
        }
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
