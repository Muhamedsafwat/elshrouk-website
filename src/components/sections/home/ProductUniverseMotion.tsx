'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled, mq } from '@/lib/motion/tokens'

/**
 * Scene 5 — signature moment 5 "Product Pillar Reveal".
 *  - all devices (motion allowed): panels open with a clip-path inset from the bottom, staggered 0.12s,
 *    while the photograph settles from 1.16 → 1 (batched per row, once);
 *  - desktop fine pointer: panels drift at different rates (≤ 20px, scrub) and an "Explore" badge follows
 *    the pointer inside the hovered panel (decorative; the real cursor is never hidden; touch never sees it).
 * Reduced motion / motion-off: nothing runs — panels are simply there.
 */
export function ProductUniverseMotion({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root || motionDisabled()) return
      const panels = gsap.utils.toArray<HTMLElement>('[data-pu-panel]', root)
      const mm = gsap.matchMedia()

      mm.add(mq.motion, () => {
        gsap.set(panels, { clipPath: 'inset(100% 0% 0% 0%)' })
        const triggers = ScrollTrigger.batch(panels, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) => {
            const els = batch as HTMLElement[]
            gsap.to(els, {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 1.1,
              ease: 'expo.inOut',
              stagger: 0.12,
              onComplete: () => gsap.set(els, { clearProps: 'clipPath' }),
            })
            els.forEach((el, i) => {
              const media = el.querySelector('[data-pu-media]')
              if (media) gsap.fromTo(media, { scale: 1.16 }, { scale: 1, duration: 1.7, ease: 'expo.out', delay: i * 0.12 })
            })
          },
        })
        return () => triggers.forEach((t) => t.kill())
      })

      mm.add(mq.desktopMotion, () => {
        panels.forEach((panel) => {
          const drift = Number(panel.dataset.drift ?? 0)
          if (!drift) return
          gsap.fromTo(
            panel,
            { y: drift },
            {
              y: -drift,
              ease: 'none',
              scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
            },
          )
        })

        const detach = panels.map((panel) => {
          const badge = panel.querySelector<HTMLElement>('[data-pu-badge]')
          if (!badge) return () => undefined
          gsap.set(badge, { xPercent: -50, yPercent: -50, scale: 0.4, opacity: 0, display: 'flex' })
          const xTo = gsap.quickTo(badge, 'x', { duration: 0.5, ease: 'power3' })
          const yTo = gsap.quickTo(badge, 'y', { duration: 0.5, ease: 'power3' })
          const local = (e: PointerEvent) => {
            const box = panel.getBoundingClientRect()
            return { x: e.clientX - box.left, y: e.clientY - box.top }
          }
          const enter = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return
            const p = local(e)
            gsap.set(badge, { x: p.x, y: p.y })
            xTo(p.x)
            yTo(p.y)
            gsap.to(badge, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
          }
          const move = (e: PointerEvent) => {
            if (e.pointerType !== 'mouse') return
            const p = local(e)
            xTo(p.x)
            yTo(p.y)
          }
          const leave = () => gsap.to(badge, { scale: 0.4, opacity: 0, duration: 0.25, ease: 'power2.in', overwrite: 'auto' })
          panel.addEventListener('pointerenter', enter)
          panel.addEventListener('pointermove', move)
          panel.addEventListener('pointerleave', leave)
          return () => {
            panel.removeEventListener('pointerenter', enter)
            panel.removeEventListener('pointermove', move)
            panel.removeEventListener('pointerleave', leave)
          }
        })
        return () => detach.forEach((off) => off())
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
