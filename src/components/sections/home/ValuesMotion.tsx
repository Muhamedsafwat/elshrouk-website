'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled } from '@/lib/motion/tokens'

/** The 4×4 grid is laid out from 48rem; below that the values are a stacked list. */
const GRID_MOTION = '(prefers-reduced-motion: no-preference) and (min-width: 48rem)'
const LIST_MOTION = '(prefers-reduced-motion: no-preference) and (max-width: 47.98rem)'
const STEP = 0.085

/**
 * Scene 7 choreography — the Veterinary Grid assembles along the diagonal that starts at the
 * inline-start/top corner (`data-diag` = row + column, so RTL runs right→left automatically);
 * the three accent modules rise into place last. Reduced motion / motion-off ⇒ final state.
 */
export function ValuesMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root || motionDisabled()) return
      const mm = gsap.matchMedia()

      mm.add(GRID_MOTION, () => {
        const grid = root.querySelector<HTMLElement>('[data-vg-grid]')
        if (!grid) return
        const modules = gsap.utils.toArray<HTMLElement>('[data-vg-cell], [data-vg-empty]', grid)
        const accents = gsap.utils.toArray<HTMLElement>('[data-vg-accent]', grid)
        const lastDiag = Math.max(0, ...modules.map((el) => Number(el.dataset.diag ?? 0)))
        const tl = gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 78%', once: true } })
        modules.forEach((el) => {
          // opacity (not autoAlpha): value cells are focusable and must stay reachable before the reveal runs.
          tl.from(el, { opacity: 0, y: 28, duration: 0.9, ease: 'expo.out' }, Number(el.dataset.diag ?? 0) * STEP)
        })
        accents.forEach((el, i) => {
          tl.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' },
            (lastDiag + 1.5) * STEP + i * 0.14,
          )
        })
      })

      mm.add(LIST_MOTION, () => {
        gsap.utils.toArray<HTMLElement>('[data-vg-cell]', root).forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 16,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })
        const divider = gsap.utils.toArray<HTMLElement>('[data-vg-divider] > *', root)
        if (divider.length) {
          gsap.fromTo(
            divider,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.8,
              ease: 'expo.out',
              stagger: 0.09,
              scrollTrigger: { trigger: divider[0], start: 'top 90%', once: true },
            },
          )
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
