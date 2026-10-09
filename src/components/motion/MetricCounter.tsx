'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motion, motionDisabled } from '@/lib/motion/tokens'
import { cn } from '@/lib/cn'

/**
 * Approximate-figure counter (spec §5 Scene 2, §8.3; reference-audit P11):
 * - counts ONCE, ≤ 1.2s, ease-out, in round steps from ≈80% of the value (240→300, 12→15, 120→150) —
 *   never from zero and never above the final value (no overshoot);
 * - the final number is server-rendered: no-JS, reduced-motion and Save-Data users see it at once;
 * - width is reserved by an invisible copy of the final value (tabular figures) → zero layout shift;
 * - digits are aria-hidden: callers provide the full sentence (srLabel) as visually-hidden text.
 */
export function MetricCounter({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const live = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      const out = live.current
      const final = Number(value)
      if (!el || !out || !Number.isFinite(final) || final < 10 || motionDisabled()) return
      const step = 10 ** Math.max(0, String(Math.trunc(final)).length - 2)
      const start = Math.round((final * 0.8) / step) * step
      const state = { n: start }
      // Swap to the start value while the figure is still below the fold (it reveals with its section).
      out.textContent = String(start)
      gsap.to(state, {
        n: final,
        duration: motion.counter,
        ease: 'power2.out',
        delay,
        snap: { n: step },
        onUpdate: () => {
          out.textContent = String(Math.min(final, Math.round(state.n)))
        },
        onComplete: () => {
          out.textContent = value
        },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
    },
    { scope: ref, dependencies: [value] },
  )

  return (
    <span ref={ref} aria-hidden className={cn('num relative inline-grid leading-none', className)}>
      <span className="invisible col-start-1 row-start-1">{value}</span>
      <span ref={live} className="col-start-1 row-start-1 text-end tabular-nums">
        {value}
      </span>
    </span>
  )
}
