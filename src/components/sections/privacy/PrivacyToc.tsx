'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

type Item = { id: string; title: string }

/**
 * Table of contents for the privacy policy. Desktop: sticky list with a scroll-spy (the current section
 * gets a vermilion start rule). Mobile: a collapsible list above the text. Plain anchors work without JS.
 */
export function PrivacyToc({ items, label }: { items: Item[]; label: string }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length || typeof IntersectionObserver === 'undefined') return
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.boundingClientRect.top)
          else visible.delete(e.target.id)
        }
        // The first section (document order) inside the reading band wins.
        const current = items.find((i) => visible.has(i.id))
        if (current) setActive(current.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [items])

  const list = (compact: boolean) => (
    <ol className={cn('space-y-1', compact && 'mt-4')}>
      {items.map((item, i) => {
        const current = !compact && active === item.id
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={current ? 'location' : undefined}
              className={cn(
                'group flex gap-4 border-s-2 py-2 ps-4 text-small transition-colors',
                current ? 'border-vermilion font-semibold text-fg' : 'border-transparent text-fg-muted hover:text-fg',
              )}
            >
              <span className="num w-5 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )

  return (
    <>
      <details className="group rounded-md border border-line lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 text-small font-semibold text-fg [&::-webkit-details-marker]:hidden">
          {label}
          <span aria-hidden className="num text-lg leading-none transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <nav aria-label={label} className="px-1 pb-4">
          {list(true)}
        </nav>
      </details>
      <nav aria-label={label} className="hidden lg:sticky lg:top-28 lg:block">
        <p className="eyebrow">{label}</p>
        <div className="mt-6">{list(false)}</div>
      </nav>
    </>
  )
}
