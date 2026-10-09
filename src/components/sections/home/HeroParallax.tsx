'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { mq } from '@/lib/motion/tokens'

/**
 * Scroll-only enhancement for the hero (the intro itself is pure CSS so it runs before hydration).
 * Desktop fine-pointer only: the photo drifts ≤ 40px and the text block eases up slightly as the hero
 * leaves the viewport. Reverted automatically on unmount / breakpoint change.
 */
export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.desktopMotion, () => {
        const section = ref.current
        if (!section || document.documentElement.classList.contains('motion-off')) return
        gsap.to('[data-hero-photo-inner]', {
          y: 40,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.5 },
        })
        gsap.to('[data-hero-copy]', {
          y: -24,
          opacity: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: section, start: '35% top', end: 'bottom top', scrub: 0.5 },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className={className} data-theme="light" aria-labelledby="hero-title">
      {children}
    </section>
  )
}
