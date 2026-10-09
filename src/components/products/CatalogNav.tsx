'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import { motionDisabled } from '@/lib/motion/tokens'

/**
 * Catalogue navigation controller (spec §6.4). Every filter, chip, reset and page control is a real
 * server-rendered link (works without JS). Once hydrated, clicks are routed through one transition so
 * the results region can show a pending state: filters/search use router.replace (no history spam),
 * pagination uses router.push (back button walks pages).
 */
type NavigateOptions = { history?: 'push' | 'replace' }
type CatalogNav = { navigate: (href: string, options?: NavigateOptions) => void; pending: boolean }

const CatalogNavContext = createContext<CatalogNav | null>(null)

export const RESULTS_ID = 'catalog-results'

export function CatalogNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const navigate = useCallback(
    (href: string, { history = 'replace' }: NavigateOptions = {}) => {
      startTransition(() => {
        if (history === 'push') router.push(href, { scroll: false })
        else router.replace(href, { scroll: false })
      })
    },
    [router],
  )
  const value = useMemo(() => ({ navigate, pending }), [navigate, pending])
  return <CatalogNavContext.Provider value={value}>{children}</CatalogNavContext.Provider>
}

export const useCatalogNav = () => useContext(CatalogNavContext)

type CatalogLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'replace' | 'scroll'> & {
  href: string
  history?: 'push' | 'replace'
  /** Bring the top of the results into view first (pagination). */
  toResults?: boolean
}

export function CatalogLink({ href, history = 'replace', toResults = false, onClick, ...rest }: CatalogLinkProps) {
  const nav = useCatalogNav()
  return (
    <Link
      {...rest}
      href={href}
      replace={history === 'replace'}
      scroll={false}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (!nav || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return
        }
        event.preventDefault()
        if (toResults) {
          const region = document.getElementById(RESULTS_ID)
          if (region && region.getBoundingClientRect().top < 0) {
            region.scrollIntoView({ block: 'start', behavior: motionDisabled() ? 'auto' : 'smooth' })
          }
        }
        nav.navigate(href, { history })
      }}
    />
  )
}

/** Wraps the results; dims them and sets aria-busy while a catalogue navigation is in flight. */
export function CatalogPending({ children, className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  const pending = useCatalogNav()?.pending ?? false
  return (
    <div
      {...rest}
      aria-busy={pending || undefined}
      data-pending={pending ? '' : undefined}
      className={cn('transition-opacity duration-300 ease-(--ease-soft) data-pending:opacity-45', className)}
    >
      {children}
    </div>
  )
}
