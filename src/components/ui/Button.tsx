import Link from 'next/link'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ArrowIcon } from './icons'

/**
 * Buttons (spec §7.1): solid black or vermilion, understated directional sweep on hover,
 * 3px focus ring, ≥ 52px tall. Vermilion fills always carry BLACK text (5.7:1) — white on vermilion
 * is reserved for large headings per the brand book.
 */
export type ButtonVariant = 'primary' | 'accent' | 'inverse' | 'outline' | 'ghost'
export type ButtonSize = 'md' | 'lg'

const base =
  'group/btn relative isolate inline-flex select-none items-center justify-center gap-3 overflow-hidden rounded-xs font-semibold leading-none whitespace-nowrap ' +
  'transition-[color,background-color,border-color,box-shadow] duration-200 ease-(--ease-soft) ' +
  'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50'

const sizes: Record<ButtonSize, string> = {
  md: 'h-13 px-6 text-[0.95rem]',
  lg: 'h-15 px-8 text-base',
}

/* The ::before layer is the sweep; it grows from the inline-start edge. */
const sweep =
  "before:absolute before:inset-0 before:-z-10 before:origin-[var(--sweep-origin)] before:scale-x-0 before:transition-transform before:duration-500 before:ease-(--ease-sunrise) before:content-[''] hover:before:scale-x-100 focus-visible:before:scale-x-100 [--sweep-origin:right] ltr:[--sweep-origin:left]"

const variants: Record<ButtonVariant, string> = {
  primary: cn('bg-ink text-paper before:bg-vermilion hover:text-ink focus-visible:text-ink', sweep),
  accent: cn('bg-vermilion text-ink before:bg-ink hover:text-paper focus-visible:text-paper', sweep),
  inverse: cn('bg-paper text-ink before:bg-vermilion', sweep),
  outline: cn(
    'border-[1.5px] border-current bg-transparent text-fg before:bg-fg hover:text-surface focus-visible:text-surface',
    sweep,
  ),
  ghost: 'h-auto bg-transparent px-0 text-fg underline-offset-8 hover:text-accent',
}

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  arrow?: boolean
  className?: string
  children: ReactNode
}

function Inner({ children, arrow }: { children: ReactNode; arrow?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {arrow ? (
        <ArrowIcon
          size={18}
          className="transition-transform duration-300 ease-(--ease-sunrise) group-hover/btn:-translate-x-1 ltr:group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  )
}

type ButtonLinkProps = CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, 'className' | 'children'>

export function ButtonLink({ variant = 'primary', size = 'md', arrow = true, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  )
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>

export function Button({ variant = 'primary', size = 'md', arrow = false, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  )
}

/** Text link with arrow and underline sweep — for tertiary actions inside content. */
export function ArrowLink({
  className,
  children,
  ...rest
}: Omit<ComponentPropsWithoutRef<typeof Link>, 'className'> & { className?: string; children: ReactNode }) {
  return (
    <Link
      className={cn(
        'group/link inline-flex items-center gap-2 py-2 font-semibold text-fg transition-colors hover:text-accent focus-visible:text-accent',
        className,
      )}
      {...rest}
    >
      <span className="link-sweep pb-0.5">{children}</span>
      <ArrowIcon
        size={18}
        className="transition-transform duration-300 ease-(--ease-sunrise) group-hover/link:-translate-x-1 ltr:group-hover/link:translate-x-1"
      />
    </Link>
  )
}
