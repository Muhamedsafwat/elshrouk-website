'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { motion, mq, motionDisabled } from '@/lib/motion/tokens'

/**
 * Poultry-solutions chapters (art direction §7): keeps the sticky progress rail in sync with the
 * chapter in view (state, not motion — runs under reduced motion too) and, when motion is allowed,
 * adds the desktop choreography: rail fill scrubbed by progress, ≤32px photo drift, numeral rise.
 * Without JS the rail is still a plain list of anchors.
 */
export function ChaptersScene({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]', root)
      const links = gsap.utils.toArray<HTMLAnchorElement>('[data-rail-link]', root)

      const setActive = (key: string | undefined) => {
        for (const link of links) {
          const on = link.dataset.railLink === key
          link.toggleAttribute('data-active', on)
          if (on) link.setAttribute('aria-current', 'true')
          else link.removeAttribute('aria-current')
        }
      }

      for (const chapter of chapters) {
        ScrollTrigger.create({
          trigger: chapter,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) setActive(chapter.dataset.chapter)
          },
        })
      }

      if (motionDisabled()) return
      const mm = gsap.matchMedia()
      mm.add(mq.desktopMotion, () => {
        gsap.fromTo(
          '[data-rail-fill]',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top center', end: 'bottom center', scrub: 0.4 } },
        )
        for (const chapter of chapters) {
          const photo = chapter.querySelector('[data-chapter-photo]')
          const numeral = chapter.querySelector('[data-chapter-numeral]')
          if (photo) {
            gsap.fromTo(
              photo,
              { y: -32 },
              { y: 32, ease: 'none', scrollTrigger: { trigger: chapter, start: 'top bottom', end: 'bottom top', scrub: true } },
            )
          }
          if (numeral) {
            gsap.fromTo(
              numeral,
              { yPercent: 22, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1.2,
                ease: motion.ease.sunrise,
                scrollTrigger: { trigger: chapter, start: 'top 65%', toggleActions: 'play none none none' },
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
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
