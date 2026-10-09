'use client'

import { useEffect, useRef } from 'react'

/**
 * Reading-progress bar for long pages (spec §8.5 optional interaction #3) — segment pages and articles
 * only. Transform-only, rAF-throttled, hidden under reduced motion. Decorative (aria-hidden).
 */
export function ScrollProgress({ targetId }: { targetId?: string }) {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = targetId ? document.getElementById(targetId) : document.documentElement
      if (!el || !bar.current) return
      const rect = el.getBoundingClientRect()
      const total = el === document.documentElement ? el.scrollHeight - window.innerHeight : rect.height - window.innerHeight
      const done = el === document.documentElement ? window.scrollY : -rect.top
      const p = total > 0 ? Math.min(1, Math.max(0, done / total)) : 0
      bar.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] motion-reduce:hidden">
      <div ref={bar} className="h-full origin-right scale-x-0 bg-vermilion ltr:origin-left" />
    </div>
  )
}
