'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { FilterIcon } from '@/components/ui/icons'
import { useHydrated } from './useHydrated'

/**
 * Mobile filters: a native <details> disclosure before hydration / without JS, upgraded to the
 * accessible Drawer once hydrated. Filter links inside update the results live (router.replace);
 * the apply button just closes the drawer and shows the real count.
 */
export function MobileFilters({
  labels,
  activeCount,
  applyLabel,
  children,
}: {
  labels: { show: string; title: string; close: string }
  activeCount: number
  applyLabel: string
  children: ReactNode
}) {
  const hydrated = useHydrated()
  const [open, setOpen] = useState(false)

  const face = (
    <>
      <FilterIcon size={20} />
      <span>{labels.show}</span>
      {activeCount > 0 ? (
        <span className="num inline-flex size-6 items-center justify-center rounded-full bg-vermilion text-caption font-bold text-ink">
          {activeCount}
        </span>
      ) : null}
    </>
  )
  const faceClass =
    'flex min-h-13 w-full cursor-pointer list-none items-center justify-center gap-3 rounded-xs border-[1.5px] border-ink bg-paper px-5 font-semibold text-ink transition-colors hover:bg-ink hover:text-paper [&::-webkit-details-marker]:hidden'

  if (!hydrated) {
    return (
      <details className="lg:hidden">
        <summary className={faceClass}>{face}</summary>
        <div className="mt-4 rounded-md border border-line bg-paper p-5">{children}</div>
      </details>
    )
  }

  return (
    <div className="lg:hidden">
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={faceClass}>
        {face}
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} title={labels.title} closeLabel={labels.close}>
        {children}
        <div className="sticky bottom-0 -mx-6 -mb-6 mt-10 border-t border-line bg-paper px-6 py-4 sm:-mx-8 sm:px-8">
          <Button variant="ink" className="w-full" onClick={() => setOpen(false)}>
            {applyLabel}
          </Button>
        </div>
      </Drawer>
    </div>
  )
}
