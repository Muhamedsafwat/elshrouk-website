'use client'

import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { PlusIcon } from './icons'

export type AccordionItem = { id: string; title: string; content: ReactNode }

/**
 * Accessible disclosure accordion (spec §5 Scene 10, §12.2): real <button>s with aria-expanded /
 * aria-controls, labelled regions, keyboard operable, height animated with CSS grid rows (no JS
 * measuring) and instant under reduced motion. Content stays in the DOM for find-in-page/SEO.
 */
export function Accordion({
  items,
  headingLevel = 3,
  defaultOpen,
  allowMultiple = false,
  className,
}: {
  items: AccordionItem[]
  headingLevel?: 2 | 3 | 4
  defaultOpen?: string
  allowMultiple?: boolean
  className?: string
}) {
  const [open, setOpen] = useState<string[]>(defaultOpen ? [defaultOpen] : [])
  const baseId = useId()
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'

  const toggle = (id: string) =>
    setOpen((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : allowMultiple ? [...current, id] : [id],
    )

  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(item.id)
        const buttonId = `${baseId}-b-${i}`
        const panelId = `${baseId}-p-${i}`
        return (
          <div key={item.id} className="border-b border-line">
            <Heading className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-start text-title font-semibold text-fg transition-colors hover:text-accent"
              >
                <span>{item.title}</span>
                <span
                  aria-hidden
                  className={cn(
                    'inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 ease-(--ease-sunrise) group-hover:border-fg',
                    isOpen && 'rotate-45 border-fg bg-fg text-surface',
                  )}
                >
                  <PlusIcon size={20} />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                'grid transition-[grid-template-rows] duration-500 ease-(--ease-sunrise) motion-reduce:transition-none',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="max-w-3xl pb-7 text-fg-soft">{item.content}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
