'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { CloseIcon } from './icons'

/**
 * Accessible side drawer / dialog (spec §7.2 AccessibleDialog, ProductInquiryDrawer) built on the native
 * modal <dialog>: background made inert, Esc closes, focus moves inside and returns to the opener,
 * page scroll locked only while open. Slides in from the inline-end edge (left in RTL).
 */
export function Drawer({
  open,
  onClose,
  title,
  closeLabel,
  children,
  className,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  closeLabel: string
  children: ReactNode
  className?: string
  size?: 'md' | 'lg'
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const opener = useRef<Element | null>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => () => {
    document.documentElement.style.overflow = ''
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClose={() => {
        document.documentElement.style.overflow = ''
        if (opener.current instanceof HTMLElement) opener.current.focus()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={cn(
        'fixed inset-y-0 end-0 start-auto m-0 h-dvh max-h-none w-full max-w-none bg-paper p-0 text-ink shadow-2xl backdrop:bg-ink/55 backdrop:backdrop-blur-[1px]',
        size === 'md' ? 'sm:w-[34rem]' : 'sm:w-[44rem]',
        'open:animate-[drawer-in_500ms_var(--ease-sunrise)] motion-reduce:open:animate-none',
        className,
      )}
      data-theme="light"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4 sm:px-8">
          <h2 className="text-title font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:border-fg hover:bg-fg hover:text-surface"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
      </div>
    </dialog>
  )
}
