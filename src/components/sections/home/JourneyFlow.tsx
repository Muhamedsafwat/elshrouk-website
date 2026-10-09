'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled, mq } from '@/lib/motion/tokens'
import { JOURNEY, journeyPath } from './JourneyGeometry'

/**
 * Scene 6 — signature moment 4 "Distribution Node Journey".
 * Geometry: the desktop band's path is recomputed from its measured size so every turn stays exactly 45°
 * (runs regardless of motion preferences).
 * Motion (no pinning — the page scrolls normally):
 *  - desktop: the path draws with scroll (scrub, "top 70%" → "bottom 70%"); node k fills white and pops
 *    (1 → 1.25 → 1) when the line reaches it, its step block rises in sync (once); the amber destination
 *    lights last;
 *  - mobile: the vertical line along the start edge draws downward segment by segment, same node logic.
 * Reduced motion / motion-off: nothing runs — the server markup is the final state (full path, all lit).
 */
export function JourneyFlow({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const band = ref.current?.querySelector<HTMLElement>('[data-journey-band]')
    const svg = band?.querySelector('svg')
    if (!band || !svg) return
    const paths = Array.from(svg.querySelectorAll('path'))
    const update = () => {
      const { width, height } = band.getBoundingClientRect()
      if (width < 400 || height < 2 * JOURNEY.inset) return
      const rtl = getComputedStyle(band).direction === 'rtl'
      svg.setAttribute('viewBox', `0 0 ${width.toFixed(1)} ${height.toFixed(1)}`)
      const d = journeyPath(width, height, rtl)
      paths.forEach((path) => path.setAttribute('d', d))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(band)
    return () => observer.disconnect()
  }, [])

  useGSAP(
    () => {
      const root = ref.current
      if (!root || motionDisabled()) return
      const blocks = gsap.utils.toArray<HTMLElement>('[data-journey-block]', root)
      const mm = gsap.matchMedia()

      /** Returns an updater mapping draw progress (0–1) to lit nodes and revealed blocks. */
      const lighting = (nodes: HTMLElement[]) => {
        const fills = nodes.map((node) => node.querySelector<HTMLElement>('[data-journey-fill]'))
        const halos = nodes.map((node) => node.querySelector<HTMLElement>('[data-journey-halo]'))
        const lit = nodes.map(() => false)
        const shown = blocks.map(() => false)
        gsap.set(fills.filter((el): el is HTMLElement => el !== null), { scale: 0 })
        gsap.set(halos.filter((el): el is HTMLElement => el !== null), { scale: 0.5, opacity: 0 })
        gsap.set(blocks, { opacity: 0, y: 24 })
        return (progress: number) => {
          nodes.forEach((node, k) => {
            const on = progress > 0 && progress >= k / JOURNEY.spans - 0.004
            if (on === lit[k]) return
            lit[k] = on
            const fill = fills[k]
            const halo = halos[k]
            const block = blocks[k]
            if (on) {
              if (fill) gsap.to(fill, { scale: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
              gsap
                .timeline()
                .to(node, { scale: 1.25, duration: 0.18, ease: 'power2.out' })
                .to(node, { scale: 1, duration: 0.4, ease: 'power3.out' })
              if (halo) gsap.to(halo, { scale: 1, opacity: 1, duration: 0.7, ease: 'expo.out', overwrite: 'auto' })
              if (block && !shown[k]) {
                shown[k] = true
                gsap.to(block, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
              }
            } else {
              if (fill) gsap.to(fill, { scale: 0, duration: 0.25, ease: 'power2.in', overwrite: 'auto' })
              if (halo) gsap.to(halo, { scale: 0.5, opacity: 0, duration: 0.25, overwrite: 'auto' })
            }
          })
        }
      }

      mm.add(mq.desktopMotion, () => {
        const line = root.querySelector('[data-journey-line]')
        const nodes = gsap.utils.toArray<HTMLElement>('[data-journey-band] [data-journey-node]', root)
        if (!line || nodes.length === 0) return
        const update = lighting(nodes)
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
          onUpdate: () => update(tl.progress()),
        })
        // Attribute tween: CSSPlugin would round the px offset (pathLength = 1 ⇒ all-or-nothing).
        tl.fromTo(line, { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, ease: 'none', duration: 1 })
      })

      mm.add(mq.mobileMotion, () => {
        const segments = gsap.utils.toArray<HTMLElement>('[data-journey-seg]', root)
        const nodes = gsap.utils.toArray<HTMLElement>('[data-journey-mnode] [data-journey-node]', root)
        if (segments.length === 0 || nodes.length === 0) return
        const update = lighting(nodes)
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: 'top 75%', end: 'bottom 75%', scrub: 0.5 },
          onUpdate: () => update(tl.progress()),
        })
        segments.forEach((segment) => tl.fromTo(segment, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: 1 }))
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
