import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  as?: ElementType
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  id?: string
  /** Opt out of the global controller when a scene timeline animates the lines itself. */
  manual?: boolean
  delay?: number
}

/**
 * Display headline whose authored lines rise from a mask (spec §8.3 headline stagger 80–130ms).
 * Lines are authored, never split at runtime, so Arabic shaping is untouched and there is no layout
 * shift. Without JS / with reduced motion the text simply renders.
 */
export function TextReveal({ as: Tag = 'h2', lines, className, lineClassName, id, manual, delay }: Props) {
  return (
    <Tag
      id={id}
      className={className}
      data-reveal="lines"
      data-reveal-manual={manual ? '' : undefined}
      data-reveal-delay={delay}
    >
      {lines.map((line, i) => (
        <span key={i} className={cn('mask-line', lineClassName)}>
          <span>{line}</span>
          {i < lines.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}
