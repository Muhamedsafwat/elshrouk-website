'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ensureGsap, gsap, ScrollTrigger } from '@/lib/motion/gsap'
import { motion, motionDisabled } from '@/lib/motion/tokens'

declare global {
  interface Window {
    __alsMotion?: boolean
  }
}

const SELECTOR = '[data-reveal]:not([data-revealed]):not([data-reveal-manual])'

function markRevealed(elements: Element[]) {
  for (const el of elements) el.setAttribute('data-revealed', '')
}

function animate(batch: Element[]) {
  const groups = new Map<string, HTMLElement[]>()
  for (const el of batch as HTMLElement[]) {
    const type = el.dataset.reveal ?? 'up'
    groups.set(type, [...(groups.get(type) ?? []), el])
  }
  for (const [type, els] of groups) {
    const done = () => markRevealed(els)
    if (type === 'lines') {
      els.forEach((el, i) => {
        const lines = el.querySelectorAll<HTMLElement>('.mask-line > span')
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1,
            ease: motion.ease.sunrise,
            stagger: motion.lineStagger,
            delay: i * 0.06 + Number(el.dataset.revealDelay ?? 0),
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
      gsap.to(els, { opacity: 1, duration: 0.8, ease: motion.ease.soft, stagger: motion.itemStagger, onComplete: done })
    } else {
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: motion.enter,
        ease: motion.ease.out,
        stagger: motion.itemStagger,
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
      if (!elements.length) return
      triggers.push(
        ...ScrollTrigger.batch(elements, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => animate(batch),
        }),
      )
    }

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

    const observer = new MutationObserver((mutations) => {
      const added: Element[] = []
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches(SELECTOR)) added.push(node)
          added.push(...Array.from(node.querySelectorAll(SELECTOR)))
        })
      }
      if (added.length) register(added)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      triggers.forEach((t) => t.kill())
    }
  }, [pathname])

  return null
}
