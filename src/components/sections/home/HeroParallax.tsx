'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { mq } from '@/lib/motion/tokens'

/**
 * Scroll-only enhancement for the hero (the intro itself is pure CSS so it runs before hydration).
 * Desktop fine-pointer only: the photo drifts down by 6% of its frame height (≈ 27 px at 1440; spec §5 asks
 * for 24–48 px), which stays inside the photo's 7% overscan so the dome never shows an edge, and the text
 * block eases up slightly as the hero leaves the viewport. Reverted automatically on unmount / breakpoint change.
 */
export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(mq.desktopMotion, () => {
        const section = ref.current
        if (!section || document.documentElement.classList.contains('motion-off')) return
        const frame = section.querySelector<HTMLElement>('[data-hero-photo]')
        // Targets the drift layer, not [data-hero-photo-inner]: that element's CSS intro animation keeps its
        // transform, which silently cancelled this tween (measured drift was 0 px).
        gsap.to('[data-hero-photo-drift]', {
          y: () => (frame?.offsetHeight ?? 0) * 0.06,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true },
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
