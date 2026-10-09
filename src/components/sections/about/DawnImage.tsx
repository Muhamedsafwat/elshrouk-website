'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled, mq } from '@/lib/motion/tokens'

/**
 * About hero image — "from monochrome to colour" (docs/art-direction.md §7).
 * Two identical server-rendered photos are stacked: the top copy is grayscale (`[data-dawn-mono]`) and
 * fades out (opacity only) as the frame scrolls through the viewport, so the dawn "comes up" in colour.
 * Desktop adds a slow scale settle on `[data-dawn-media]` (transform only).
 * The grayscale layer is only visible in CSS when JS + motion are active, so reduced motion, the
 * motion-off fail-safe and no-JS all show the colour photograph.
 */
export function DawnImage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = ref.current
      if (!root) return
      const mono = root.querySelector<HTMLElement>('[data-dawn-mono]')
      const media = root.querySelector<HTMLElement>('[data-dawn-media]')
      if (motionDisabled()) {
        // Save-Data etc.: CSS may still show the grayscale layer — resolve to the final (colour) state.
        if (mono) gsap.set(mono, { opacity: 0 })
        return
      }
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        if (!mono) return
        gsap.fromTo(
          mono,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top 78%', end: 'center 38%', scrub: 0.8 },
          },
        )
      })
      mm.add(mq.desktopMotion, () => {
        if (!media) return
        gsap.fromTo(
          media,
          { scale: 1.07 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom 35%', scrub: true },
          },
        )
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
