'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { ChevronIcon, ExternalIcon, MenuIcon, SEGMENT_ICONS } from '@/components/ui/icons'
import { href, isActiveRoute } from '@/i18n/routing'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'
import type { ExternalNavLink, HeaderProps, NavItem, NavLink } from './types'

/**
 * Two-state header (spec §7.3, brand p.9):
 * 1. In-flow white MASTHEAD carrying the full official lockup at a legal size with its 15% clear space.
 * 2. Slim STICKY BAR that slides in once the masthead leaves the viewport. The stacked lockup cannot be
 *    reduced below 110px wide (≈102px tall) + clear space, so the compact bar carries navigation and the
 *    contact CTA only — the logo is never shrunk below the brand minimum.
 */
export function Header({ locale, items, homeItem, labels }: HeaderProps) {
  const pathname = usePathname() || `/${locale}`
  const [compact, setCompact] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setCompact(!entry?.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const openMenu = useCallback((trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger
    setMenuOpen(true)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  const ctaHref = href(locale, 'contact')

  return (
    <>
      {/* ---------- MASTHEAD ---------- */}
      <header className="relative z-30 bg-paper" data-theme="light">
        <div className="container-site flex items-center justify-between gap-4 py-[clamp(1rem,1.5vw,1.375rem)] lg:gap-3 xl:gap-6">
          <Link
            href={href(locale, 'home')}
            aria-label={labels.homeLabel}
            className="-m-1 shrink-0 rounded-sm p-1"
            aria-current={isActiveRoute(pathname, locale, 'home') ? 'page' : undefined}
          >
            {/* 112px up to 1279px (so the one-line nav fits at 1024 in both locales), 140px from xl
                (brand min 110px; spec 112–155px). */}
            <span className="block xl:hidden">
              <Logo variant="color" width={112} alt={labels.logoAlt} priority />
            </span>
            <span className="hidden xl:block">
              <Logo variant="color" width={140} alt={labels.logoAlt} priority />
            </span>
          </Link>

          <nav aria-label={labels.primaryNav} className="hidden lg:block">
            <DesktopNav locale={locale} items={items} pathname={pathname} externalLabel={labels.externalLink} />
          </nav>

          <div className="flex items-center gap-3">
            <LocaleSwitcher
              locale={locale}
              short={labels.switchLanguageShort}
              name={labels.switchLanguageName}
              label={labels.languageLabel}
              className="hidden sm:inline-flex"
            />
            <ButtonLink
              href={ctaHref}
              variant="primary"
              className="hidden lg:inline-flex lg:max-xl:px-5 lg:max-xl:[&>svg]:hidden"
              onClick={() => trackEvent('contact_open', { location: 'header' })}
            >
              {labels.cta}
            </ButtonLink>
            <MenuButton label={labels.openMenu} expanded={menuOpen} onOpen={openMenu} className="lg:hidden" />
          </div>
        </div>
        <div ref={sentinelRef} aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px" />
      </header>

      {/* ---------- STICKY COMPACT BAR ---------- */}
      <div
        className={cn(
          'fixed inset-x-0 top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-[2px] transition-transform duration-500 ease-(--ease-sunrise) motion-reduce:transition-none',
          compact ? 'translate-y-0' : '-translate-y-full',
        )}
        data-theme="light"
        aria-hidden={!compact}
        inert={!compact}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <nav aria-label={labels.primaryNav} className="hidden lg:block">
            <DesktopNav
              locale={locale}
              items={[homeItem, ...items]}
              pathname={pathname}
              externalLabel={labels.externalLink}
            />
          </nav>
          {/* Same inline-end group as the masthead, so the menu button never changes sides (VQA-10). */}
          <div className="ms-auto flex items-center gap-3">
            <LocaleSwitcher
              locale={locale}
              short={labels.switchLanguageShort}
              name={labels.switchLanguageName}
              label={labels.languageLabel}
              className="hidden sm:inline-flex"
            />
            <ButtonLink
              href={ctaHref}
              variant="primary"
              className="h-11 px-4 text-sm sm:h-12 sm:px-5"
              onClick={() => trackEvent('contact_open', { location: 'sticky-bar' })}
            >
              {labels.cta}
            </ButtonLink>
            <MenuButton label={labels.openMenu} expanded={menuOpen} onOpen={openMenu} className="lg:hidden" />
          </div>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        locale={locale}
        items={[homeItem, ...items]}
        pathname={pathname}
        labels={labels}
      />
    </>
  )
}

function MenuButton({
  label,
  expanded,
  onOpen,
  className,
}: {
  label: string
  expanded: boolean
  onOpen: (trigger: HTMLButtonElement) => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      aria-haspopup="dialog"
      onClick={(e) => onOpen(e.currentTarget)}
      className={cn(
        'inline-flex size-12 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-fg hover:bg-fg hover:text-surface',
        className,
      )}
    >
      <MenuIcon size={22} className="rtl:-scale-x-100" />
    </button>
  )
}

function DesktopNav({
  locale,
  items,
  pathname,
  externalLabel,
}: {
  locale: HeaderProps['locale']
  items: NavItem[]
  pathname: string
  externalLabel: string
}) {
  return (
    <ul className="flex items-center gap-0 xl:gap-1">
      {items.map((item) => {
        if (item.kind === 'external') {
          return (
            <li key={item.id}>
              <NavDropdown label={item.label} active={false} pathname={pathname} panelClassName="w-[min(25rem,80vw)]">
                {(close) => <ExternalPanel links={item.links} externalLabel={externalLabel} onNavigate={close} />}
              </NavDropdown>
            </li>
          )
        }
        const { children } = item
        if (children?.length) {
          return (
            <li key={item.key}>
              <NavDropdown
                label={item.label}
                active={isActiveRoute(pathname, locale, item.key)}
                pathname={pathname}
                panelClassName="w-[min(34rem,80vw)]"
              >
                {() => <RoutePanel locale={locale} links={children} pathname={pathname} />}
              </NavDropdown>
            </li>
          )
        }
        return (
          <li key={item.key}>
            <Link
              href={href(locale, item.key)}
              aria-current={isActiveRoute(pathname, locale, item.key) ? 'page' : undefined}
              className="group relative inline-flex h-11 items-center px-1.5 text-[0.875rem] font-medium whitespace-nowrap text-fg-soft transition-colors hover:text-fg aria-[current=page]:text-fg xl:px-3 xl:text-[0.95rem]"
            >
              {item.label}
              <NavUnderline />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function NavUnderline() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-1.5 bottom-1.5 h-0.5 origin-right scale-x-0 rounded-full bg-vermilion transition-transform duration-300 ease-(--ease-sunrise) group-hover:scale-x-100 group-aria-[current=page]:scale-x-100 xl:inset-x-3 ltr:origin-left"
    />
  )
}

/** Disclosure button + panel. `children` renders the panel content and receives `close` for links that keep the page. */
function NavDropdown({
  label,
  active,
  pathname,
  panelClassName,
  children,
}: {
  label: string
  active: boolean
  pathname: string
  panelClassName: string
  children: (close: () => void) => ReactNode
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  // A pointer hover opens the panel; the click that usually follows must not immediately close it.
  const openedByHover = useRef(false)

  // Close after client navigation (state adjusted during render — no effect cascade).
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
    setPrevPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        wrapperRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const hoverOpen = () => {
    window.clearTimeout(closeTimer.current)
    if (!open && window.matchMedia('(pointer: fine)').matches) {
      openedByHover.current = true
      setOpen(true)
    }
  }
  const hoverClose = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), 180)
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (open && openedByHover.current) {
            openedByHover.current = false
            return
          }
          openedByHover.current = false
          setOpen(!open)
        }}
        data-active={active || undefined}
        className="group relative inline-flex h-11 items-center gap-1 px-1.5 text-[0.875rem] font-medium whitespace-nowrap text-fg-soft transition-colors hover:text-fg data-[active]:text-fg xl:gap-1.5 xl:px-3 xl:text-[0.95rem]"
      >
        {label}
        <ChevronIcon size={16} className={cn('transition-transform duration-300', open && 'rotate-180')} />
        <span
          aria-hidden
          className={cn(
            'absolute inset-x-1.5 bottom-1.5 h-0.5 origin-right scale-x-0 rounded-full bg-vermilion transition-transform duration-300 ease-(--ease-sunrise) group-hover:scale-x-100 xl:inset-x-3 ltr:origin-left',
            active && 'scale-x-100',
          )}
        />
      </button>
      <div id={panelId} hidden={!open} className={cn('absolute start-0 top-full z-50 pt-3', panelClassName)}>
        {children(() => setOpen(false))}
      </div>
    </div>
  )
}

const PANEL_LIST =
  'grid gap-px overflow-hidden rounded-md border border-stone-200 bg-stone-200 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)]'

function RoutePanel({ locale, links, pathname }: { locale: HeaderProps['locale']; links: NavLink[]; pathname: string }) {
  return (
    <ul className={PANEL_LIST}>
      {links.map((child) => {
        const Icon = child.key in SEGMENT_ICONS ? SEGMENT_ICONS[child.key as keyof typeof SEGMENT_ICONS] : null
        const current = pathname === href(locale, child.key)
        return (
          <li key={child.key}>
            <Link
              href={href(locale, child.key)}
              aria-current={current ? 'page' : undefined}
              className="group/item flex items-start gap-4 bg-paper p-4 transition-colors hover:bg-stone-100 focus-visible:bg-stone-100 aria-[current=page]:bg-stone-100"
            >
              <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-fg transition-colors group-hover/item:border-vermilion group-hover/item:text-vermilion">
                {Icon ? <Icon size={20} /> : <ChevronIcon size={18} className="-rotate-90 rtl:rotate-90" />}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-fg">{child.label}</span>
                {child.description ? (
                  <span className="mt-1 block text-small leading-snug text-fg-muted">{child.description}</span>
                ) : null}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** Links to other websites (partners): logo tile, name, domain; each opens in a new tab. */
function ExternalPanel({
  links,
  externalLabel,
  onNavigate,
}: {
  links: ExternalNavLink[]
  externalLabel: string
  onNavigate: () => void
}) {
  return (
    <ul className={PANEL_LIST}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onNavigate}
            className="group/item flex items-center gap-4 bg-paper p-4 transition-colors hover:bg-stone-100 focus-visible:bg-stone-100"
          >
            {link.logo ? (
              <span className="relative h-12 w-[4.5rem] shrink-0 rounded-sm border border-line bg-paper">
                <Image src={link.logo} alt="" fill sizes="72px" className="object-contain p-1.5" />
              </span>
            ) : null}
            <span className="min-w-0 flex-1">
              <span className="latin block font-semibold text-fg">{link.label}</span>
              {link.description ? (
                <span className="latin mt-0.5 block truncate text-small leading-snug text-fg-muted">{link.description}</span>
              ) : null}
            </span>
            <ExternalIcon
              size={18}
              className="shrink-0 text-fg-muted transition-colors group-hover/item:text-vermilion group-focus-visible/item:text-vermilion"
            />
            <span className="sr-only">({externalLabel})</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
