import type { ReactNode } from 'react'
import { TextReveal } from '@/components/motion/TextReveal'
import { cn } from '@/lib/cn'

type Props = {
  eyebrow?: string
  /** One string or authored display lines (never split at runtime). */
  title: string | string[]
  intro?: ReactNode
  /** Chapter marker, e.g. "01" — rendered in Montserrat. */
  index?: string
  as?: 'h1' | 'h2' | 'h3'
  size?: 'xl' | 'lg' | 'md'
  align?: 'start' | 'center'
  className?: string
  titleClassName?: string
  introClassName?: string
  id?: string
  children?: ReactNode
}

const sizeClass = {
  xl: 'text-display-xl',
  lg: 'text-display-lg',
  md: 'text-display-md',
} as const

/** Editorial section header: eyebrow (horizon dash) → display title (line reveal) → intro (fade-up). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  index,
  as = 'h2',
  size = 'lg',
  align = 'start',
  className,
  titleClassName,
  introClassName,
  id,
  children,
}: Props) {
  const lines = Array.isArray(title) ? title : [title]
  return (
    <div className={cn('flex flex-col', align === 'center' && 'items-center text-center', className)}>
      {index || eyebrow ? (
        <div className="flex items-center gap-4" data-reveal="fade">
          {/* Neutral index: vermilion text is reserved for ≥24px bold (brand audit D4). */}
          {index ? <span className="num inline-block text-small font-semibold text-fg-muted">{index}</span> : null}
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        </div>
      ) : null}
      <TextReveal
        as={as}
        id={id}
        lines={lines}
        className={cn(sizeClass[size], 'font-bold', (index || eyebrow) && 'mt-6', titleClassName)}
      />
      {intro ? (
        <div className={cn('mt-6 measure text-lead text-fg-soft', align === 'center' && 'mx-auto', introClassName)} data-reveal="up">
          {intro}
        </div>
      ) : null}
      {children}
    </div>
  )
}
