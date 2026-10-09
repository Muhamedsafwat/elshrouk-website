'use client'

import { useRef } from 'react'
import { cn } from '@/lib/cn'
import { gsap, useGSAP } from '@/lib/motion/gsap'
import { motionDisabled, mq } from '@/lib/motion/tokens'

/**
 * Numbered process as a Distribution Flow (art-direction §4): straight hairline segments between round
 * nodes, exactly ONE amber destination node (the last step). Horizontal orientation runs from the inline
 * start — right→left in Arabic — and recomposes to a vertical flow below `lg`. The segments draw in once,
 * step by step, when the list enters the viewport; reduced motion shows the final state.
 */
type Step = { title: string; body: string }

export function FlowSteps({
  steps,
  orientation = 'vertical',
  headingLevel = 3,
  className,
}: {
  steps: Step[]
  orientation?: 'vertical' | 'horizontal'
  headingLevel?: 3 | 4
  className?: string
}) {
  const ref = useRef<HTMLOListElement>(null)
  const horizontal = orientation === 'horizontal'
  const Heading = headingLevel === 3 ? 'h3' : 'h4'

  useGSAP(
    () => {
      if (motionDisabled() || !ref.current) return
      const root = ref.current
      const mm = gsap.matchMedia()
      const build = (axis: 'scaleX' | 'scaleY') => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 85%', once: true } })
        root.querySelectorAll('li').forEach((item, i) => {
          const at = i * 0.32
          tl.from(item.querySelector('[data-flow-node]'), { scale: 0, duration: 0.5, ease: 'expo.out' }, at)
          tl.from(item.querySelectorAll('[data-flow-text]'), { y: 16, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, at + 0.05)
          const seg = item.querySelector('[data-flow-seg]')
          if (seg) tl.from(seg, { [axis]: 0, duration: 0.6, ease: 'expo.inOut' }, at + 0.15)
        })
      }
      if (horizontal) {
        mm.add(`${mq.motion} and (min-width: 64rem)`, () => build('scaleX'))
        mm.add(`${mq.motion} and (max-width: 63.999rem)`, () => build('scaleY'))
      } else {
        mm.add(mq.motion, () => build('scaleY'))
      }
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <ol ref={ref} data-reveal-manual="" className={cn('relative grid', horizontal ? 'lg:grid-cols-3 lg:gap-8' : '', className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        return (
          <li key={step.title} className={cn('relative ps-10 pb-10 last:pb-0', horizontal && 'lg:ps-0 lg:pb-0 lg:pt-12')}>
            <span
              data-flow-node=""
              aria-hidden
              className={cn(
                'absolute start-0 top-1 size-4 rounded-full border-[1.5px]',
                last ? 'border-amber bg-amber' : 'border-fg bg-surface',
                horizontal && 'lg:top-0',
              )}
            />
            {!last ? (
              <span
                data-flow-seg=""
                aria-hidden
                className={cn(
                  'absolute start-[7.25px] top-6 -bottom-0.5 w-[1.5px] origin-top bg-fg/35',
                  horizontal &&
                    'lg:start-6 lg:-end-6 lg:top-[7.25px] lg:bottom-auto lg:h-[1.5px] lg:w-auto lg:origin-right ltr:lg:origin-left',
                )}
              />
            ) : null}
            <span data-flow-text="" className="num block text-small font-semibold tracking-wide text-fg-muted">
              {String(i + 1).padStart(2, '0')}
            </span>
            <Heading data-flow-text="" className="mt-2 text-title font-bold text-fg">
              {step.title}
            </Heading>
            <p data-flow-text="" className="mt-3 measure text-small leading-relaxed text-fg-soft lg:text-body">
              {step.body}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
