'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled } from '@/lib/motion/tokens'

const BELOW = 'inset(100% 0% 0% 0%)'
const ABOVE = 'inset(0% 0% 100% 0%)'
const SHOWN = 'inset(0% 0% 0% 0%)'

/**
 * Scene 4 — signature moment 3 "Segment Scene Transitions".
 * ≥1024px the chapters scroll past a CSS-sticky media frame; whichever chapter crosses the viewport's
 * centre band becomes active: its photo wipes in with a clip-path (from the bottom going down, from the
 * top going back up, expo.inOut 0.9s) while the previous one scales back; the index/name overlay rolls and
 * the active progress segment fills with the chapter's scroll. The swap itself is content state, so it
 * also runs under reduced motion — instantly, without wipes or scrubbing.
 * <1024px nothing runs here: chapters are natural flow with their own photos (declarative reveals).
 */
export function FarmTypesScroller({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const mm = gsap.matchMedia()

      mm.add('(min-width: 64rem)', () => {
        const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, root)
        const chapters = q('[data-ft-chapter]')
        const layers = q('[data-ft-layer]')
        const media = q('[data-ft-media]')
        const indexes = q('[data-ft-index]')
        const names = q('[data-ft-name]')
        const bars = q('[data-ft-bar]')
        const animate = !motionDisabled()
        let active = 0

        const settle = (next: number) => {
          layers.forEach((layer, i) =>
            gsap.set(layer, { clipPath: i === next ? SHOWN : BELOW, zIndex: i === next ? 3 : 1, scale: 1, opacity: 1 }),
          )
          ;[...indexes, ...names].forEach((el) => gsap.set(el, { yPercent: 0 }))
          indexes.forEach((el, i) => gsap.set(el, { autoAlpha: i === next ? 1 : 0 }))
          names.forEach((el, i) => gsap.set(el, { autoAlpha: i === next ? 1 : 0 }))
          if (!animate) bars.forEach((bar, i) => gsap.set(bar, { scaleX: i <= next ? 1 : 0 }))
        }

        const roll = (els: HTMLElement[], prev: number, next: number, dir: number) => {
          const outgoing = els[prev]
          const incoming = els[next]
          els.forEach((el, i) => {
            if (i !== prev && i !== next) gsap.set(el, { autoAlpha: 0 })
          })
          if (outgoing) gsap.to(outgoing, { yPercent: -100 * dir, autoAlpha: 0, duration: 0.5, ease: 'power3.in' })
          if (incoming) {
            gsap.fromTo(
              incoming,
              { yPercent: 100 * dir, autoAlpha: 0 },
              { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', delay: 0.25 },
            )
          }
        }

        const show = (next: number) => {
          if (next === active) return
          const prev = active
          active = next
          if (!animate) {
            settle(next)
            return
          }
          const dir = next > prev ? 1 : -1
          const incoming = layers[next]
          const outgoing = layers[prev]
          const incomingMedia = media[next]
          if (!incoming || !outgoing) {
            settle(next)
            return
          }
          gsap.killTweensOf([...layers, ...media, ...indexes, ...names])
          layers.forEach((layer, i) => {
            if (i !== prev && i !== next) gsap.set(layer, { clipPath: BELOW, zIndex: 1, scale: 1, opacity: 1 })
          })
          gsap.set(outgoing, { zIndex: 2 })
          gsap.set(incoming, { zIndex: 3, scale: 1, opacity: 1 })
          gsap.fromTo(incoming, { clipPath: dir > 0 ? BELOW : ABOVE }, { clipPath: SHOWN, duration: 0.9, ease: 'expo.inOut' })
          if (incomingMedia) gsap.fromTo(incomingMedia, { scale: 1.14 }, { scale: 1, duration: 1.5, ease: 'expo.out' })
          gsap.to(outgoing, {
            scale: 0.94,
            opacity: 0.45,
            duration: 0.9,
            ease: 'expo.inOut',
            onComplete: () => gsap.set(outgoing, { clipPath: BELOW, zIndex: 1, scale: 1, opacity: 1 }),
          })
          roll(indexes, prev, next, dir)
          roll(names, prev, next, dir)
        }

        settle(0)
        chapters.forEach((chapter, i) => {
          ScrollTrigger.create({
            trigger: chapter,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => {
              if (self.isActive) show(i)
            },
          })
          if (animate && bars[i]) {
            gsap.fromTo(
              bars[i],
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: { trigger: chapter, start: 'top 55%', end: 'bottom 55%', scrub: 0.4 },
              },
            )
          }
        })
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
