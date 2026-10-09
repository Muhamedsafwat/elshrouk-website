import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { AlertIcon } from './icons'

/** Designed empty state (spec §6.4): never a dead end — always offers a next action. */
export function EmptyState({
  title,
  body,
  action,
  icon,
  className,
  tone = 'warm',
}: {
  title: string
  body?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
  tone?: 'warm' | 'plain'
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md px-6 py-12 sm:px-12 sm:py-16',
        tone === 'warm' ? 'bg-stone-100' : 'border border-line',
        className,
      )}
    >
      {icon ? <div className="mb-6 text-fg">{icon}</div> : null}
      <h2 className="max-w-xl text-title font-bold text-fg">{title}</h2>
      {body ? <div className="mt-4 max-w-xl text-fg-soft">{body}</div> : null}
      {action ? <div className="mt-8 flex flex-wrap gap-3">{action}</div> : null}
    </div>
  )
}

export function ErrorState({ title, body, action, className }: { title: string; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn('rounded-md border border-vermilion/40 bg-vermilion-20/40 px-6 py-8', className)}>
      <div className="flex items-start gap-4">
        <AlertIcon className="mt-1 text-vermilion-deep" />
        <div>
          <h2 className="text-title font-bold">{title}</h2>
          {body ? <div className="mt-2 text-fg-soft">{body}</div> : null}
          {action ? <div className="mt-6">{action}</div> : null}
        </div>
      </div>
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-sm bg-stone-200 motion-reduce:animate-none', className)} />
}

export function Tag({ children, className, tone = 'line' }: { children: ReactNode; className?: string; tone?: 'line' | 'solid' | 'accent' }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-8 items-center rounded-full px-3 text-caption font-semibold',
        tone === 'line' && 'border border-line text-fg-soft',
        tone === 'solid' && 'bg-ink text-paper',
        tone === 'accent' && 'bg-vermilion text-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}
