'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motion, mq, motionDisabled } from '@/lib/motion/tokens'

const rendered = (root: Element, selector: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(selector)).filter((el) => el.getClientRects().length > 0)

/**
 * Distribution-flow choreography (art direction §4). Inside every `[data-flow-group]` (or the scene
 * itself) the hairline segments `[data-flow-line]` draw END-TO-END as one continuous stroke from the
 * inline START (right in Arabic → the flow runs right→left), then vertical segments
 * `[data-flow-line="y"]` continue top→down. Round nodes `[data-flow-node]` land as the stroke reaches
 * them and copy `[data-flow-item]` rises with its node. Where the nodes sit on the segments is set per
 * group with `data-flow-nodes`: "start" (default: a node starts each segment), "center" (a node in the
 * middle of each segment) or "end" (after each segment); `data-flow-delay` (s) holds a group back so a
 * follow-on piece (e.g. the matrix collector) draws after the rows that feed it.
 * Only elements rendered at the current breakpoint take part. One-shot at 85% of the viewport;
 * reduced motion / motion-off keep the final, fully drawn state.
 */
export function FlowScene({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (motionDisabled() || !ref.current) return
      const root = ref.current
      const mm = gsap.matchMedia()
      mm.add(mq.motion, () => {
        // Groups that are display:none at this breakpoint are skipped (a trigger on an unrendered
        // element would fire during ScrollTrigger.refresh()).
        const groups = gsap.utils.toArray<HTMLElement>('[data-flow-group]', root).filter((g) => g.getClientRects().length > 0)
        for (const group of groups.length ? groups : [root]) {
          const linesX = rendered(group, '[data-flow-line]:not([data-flow-line="y"])')
          const linesY = rendered(group, '[data-flow-line="y"]')
          const nodes = rendered(group, '[data-flow-node]')
          const items = rendered(group, '[data-flow-item]')
          const segments = linesX.length + linesY.length
          const seg = segments > 3 ? 0.3 : 0.55
          const mode = group.dataset.flowNodes ?? 'start'
          const delay = Number(group.dataset.flowDelay ?? 0)
          const nodeAt = delay + (mode === 'center' ? seg / 2 : mode === 'end' ? seg : 0)

          // play-once via toggleActions (not `once`, which kills the trigger and can mutate GSAP's
          // trigger list while another ScrollTrigger is refreshing).
          const tl = gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: 'play none none none' } })
          if (linesX.length) tl.fromTo(linesX, { scaleX: 0 }, { scaleX: 1, duration: seg, ease: 'none', stagger: seg }, delay)
          if (linesY.length) tl.fromTo(linesY, { scaleY: 0 }, { scaleY: 1, duration: seg, ease: 'none', stagger: seg }, delay + linesX.length * seg)
          if (nodes.length)
            tl.fromTo(nodes, { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.2)', stagger: seg }, nodeAt)
          if (items.length)
            tl.fromTo(items, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: motion.enter, ease: motion.ease.sunrise, stagger: seg }, nodeAt + 0.05)
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className={className} data-reveal-manual="">
      {children}
    </div>
  )
}
