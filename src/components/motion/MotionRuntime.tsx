'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ensureGsap, gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { motion, motionDisabled } from '@/lib/motion/tokens'
import { LINE_REVEAL, MASK_HIDDEN_Y_PERCENT } from './mask'

declare global {
  interface Window {
    __alsMotion?: boolean
  }
}

const SELECTOR = '[data-reveal]:not([data-revealed]):not([data-reveal-manual])'

function markRevealed(elements: Element[]) {
  for (const el of elements) el.setAttribute('data-revealed', '')
}

/**
 * Turns on the hidden reveal states (`html.reveal`, globals.css) once, on the first load, after hydration.
 * Everything already in the viewport is marked revealed first, so first-screen content is painted once and stays:
 * no visible → hidden flash and no LCP delay. Only content below the fold waits for its scroll reveal. On later
 * client navigations the class is already set, so new pages animate in. If this never runs, nothing is ever hidden.
 */
function enableRevealStates() {
  const root = document.documentElement
  if (root.classList.contains('reveal')) return
  const viewport = window.innerHeight
  markRevealed(
    Array.from(document.querySelectorAll(SELECTOR)).filter((el) => {
      const box = el.getBoundingClientRect()
      return box.top < viewport && box.bottom > 0
    }),
  )
  root.classList.add('reveal')
}

/** Per-item stagger, capped so a large batch (fast scroll / anchor jump) never spreads over more than ~0.5s. */
const staggerFor = (count: number) => Math.min(motion.itemStagger, 0.48 / Math.max(1, count - 1))

function animate(batch: Element[]) {
  const groups = new Map<string, HTMLElement[]>()
  for (const el of batch as HTMLElement[]) {
    const type = el.dataset.reveal ?? 'up'
    groups.set(type, [...(groups.get(type) ?? []), el])
  }
  for (const [type, els] of groups) {
    const done = () => markRevealed(els)
    if (type === 'lines') {
      // Every heading in a batch starts with the batch (no per-index delay): after a fast scroll or an
      // anchor jump a batch can hold many headings, and a cumulative delay made them reveal after the
      // body copy beside them (VQA-04).
      els.forEach((el) => {
        const lines = el.querySelectorAll<HTMLElement>('.mask-line > span')
        // `y: 0` is essential: GSAP parses the CSS hidden state (translate3d(0, 170%, 0)) into a px `y`, so
        // tweening only yPercent left the line parked out of sight until clearProps popped it in at the end.
        gsap.fromTo(
          lines,
          { yPercent: MASK_HIDDEN_Y_PERCENT, y: 0 },
          {
            yPercent: 0,
            y: 0,
            duration: LINE_REVEAL.duration,
            ease: motion.ease.sunrise,
            stagger: LINE_REVEAL.stagger,
            delay: Number(el.dataset.revealDelay ?? 0),
            onComplete: () => {
              gsap.set(lines, { clearProps: 'transform' })
              markRevealed([el])
            },
          },
        )
      })
    } else if (type === 'image') {
      gsap.fromTo(
        els,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: motion.imageReveal,
          ease: 'expo.inOut',
          stagger: 0.12,
          onComplete: () => {
            gsap.set(els, { clearProps: 'clipPath' })
            done()
          },
        },
      )
    } else if (type === 'fade') {
      gsap.to(els, { opacity: 1, duration: 0.8, ease: motion.ease.soft, stagger: staggerFor(els.length), onComplete: done })
    } else {
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: motion.enter,
        ease: motion.ease.out,
        stagger: staggerFor(els.length),
        delay: Number(els[0]?.dataset.revealDelay ?? 0),
        onComplete: () => {
          gsap.set(els, { clearProps: 'transform,opacity' })
          done()
        },
      })
    }
  }
}

/**
 * One controller for every declarative reveal on the page (`data-reveal="up|lines|image|fade"`), so
 * server components stay server components. Complex scenes opt out with `data-reveal-manual` and run
 * their own timelines. Re-scans after client navigations and for nodes added later.
 */
export function MotionRuntime() {
  const pathname = usePathname()

  useEffect(() => {
    ensureGsap()
    window.__alsMotion = true
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined)
    }
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (motionDisabled()) {
      markRevealed(Array.from(document.querySelectorAll('[data-reveal]')))
      return
    }

    const triggers: ScrollTrigger[] = []
    const register = (elements: Element[]) => {
      const live = elements.filter((el) => el.isConnected && !el.hasAttribute('data-revealed'))
      if (!live.length) return
      try {
        triggers.push(
          ...ScrollTrigger.batch(live, {
            start: 'top 90%',
            once: true,
            onEnter: (batch) => animate(batch),
          }),
        )
      } catch (error) {
        // Never leave content hidden because ScrollTrigger hit an internal error (e.g. a sibling trigger
        // destroying itself during a refresh): show these elements in their final state instead.
        console.warn('[motion] reveal registration failed; showing content statically', error)
        markRevealed(live)
      }
    }

    enableRevealStates()
    register(Array.from(document.querySelectorAll(SELECTOR)))

    // Reveal anything left when the reader reaches the very end of a short page.
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        ticking = false
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
          const rest = Array.from(document.querySelectorAll(SELECTOR))
          if (rest.length) animate(rest)
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Nodes added later (streamed Suspense boundaries, client lists) are registered after a short grace
    // period so React finishes hydrating them first — touching their attributes/styles earlier causes
    // hydration attribute mismatches.
    const pending = new Set<Element>()
    let flushTimer: number | undefined
    const flush = () => {
      flushTimer = undefined
      const nodes = Array.from(pending)
      pending.clear()
      register(nodes)
    }
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches(SELECTOR)) pending.add(node)
          node.querySelectorAll(SELECTOR).forEach((el) => pending.add(el))
        })
      }
      if (pending.size && flushTimer === undefined) flushTimer = window.setTimeout(flush, 900)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      if (flushTimer !== undefined) window.clearTimeout(flushTimer)
      window.removeEventListener('scroll', onScroll)
      triggers.forEach((t) => t.kill())
    }
  }, [pathname])

  return null
}
