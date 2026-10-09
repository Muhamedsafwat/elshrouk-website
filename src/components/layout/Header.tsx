'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { ChevronIcon, MenuIcon, SEGMENT_ICONS } from '@/components/ui/icons'
import { href, isActiveRoute } from '@/i18n/routing'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { LocaleSwitcher } from './LocaleSwitcher'
import { MobileMenu } from './MobileMenu'
import type { HeaderProps, NavItem } from './types'

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
        <div className="container-site flex items-center justify-between gap-6 py-[clamp(1rem,1.5vw,1.375rem)]">
          <Link
            href={href(locale, 'home')}
            aria-label={labels.homeLabel}
            className="-m-1 shrink-0 rounded-sm p-1"
            aria-current={isActiveRoute(pathname, locale, 'home') ? 'page' : undefined}
          >
            {/* 112px on phones, 140px on large screens (brand min 110px; spec 112–155px). */}
            <span className="block lg:hidden">
              <Logo variant="color" width={112} alt={labels.logoAlt} priority />
            </span>
            <span className="hidden lg:block">
              <Logo variant="color" width={140} alt={labels.logoAlt} priority />
            </span>
          </Link>

          <nav aria-label={labels.primaryNav} className="hidden lg:block">
            <DesktopNav locale={locale} items={items} pathname={pathname} />
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
              className="hidden lg:inline-flex"
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
          <MenuButton label={labels.openMenu} expanded={menuOpen} onOpen={openMenu} className="lg:hidden" />
          <nav aria-label={labels.primaryNav} className="hidden lg:block">
            <DesktopNav locale={locale} items={[homeItem, ...items]} pathname={pathname} compact />
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
              className="h-11 px-4 text-sm sm:h-12 sm:px-5"
              onClick={() => trackEvent('contact_open', { location: 'sticky-bar' })}
            >
              {labels.cta}
            </ButtonLink>
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
  compact = false,
}: {
  locale: HeaderProps['locale']
  items: NavItem[]
  pathname: string
  compact?: boolean
}) {
  return (
    <ul className={cn('flex items-center', compact ? 'gap-1' : 'gap-1 xl:gap-2')}>
      {items.map((item) =>
        item.children?.length ? (
          <li key={item.key}>
            <NavDropdown locale={locale} item={item} pathname={pathname} />
          </li>
        ) : (
          <li key={item.key}>
            <Link
              href={href(locale, item.key)}
              aria-current={isActiveRoute(pathname, locale, item.key) ? 'page' : undefined}
              className="group relative inline-flex h-11 items-center px-3 text-[0.95rem] font-medium text-fg-soft transition-colors hover:text-fg aria-[current=page]:text-fg"
            >
              {item.label}
              <NavUnderline />
            </Link>
          </li>
        ),
      )}
    </ul>
  )
}

function NavUnderline() {
  return (
    <span
      aria-hidden
      className="absolute inset-x-3 bottom-1.5 h-0.5 origin-right scale-x-0 rounded-full bg-vermilion transition-transform duration-300 ease-(--ease-sunrise) group-hover:scale-x-100 group-aria-[current=page]:scale-x-100 ltr:origin-left"
    />
  )
}

function NavDropdown({ locale, item, pathname }: { locale: HeaderProps['locale']; item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)
  const active = isActiveRoute(pathname, locale, item.key)

  useEffect(() => setOpen(false), [pathname])

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
    if (window.matchMedia('(pointer: fine)').matches) setOpen(true)
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
        onClick={() => setOpen((v) => !v)}
        data-active={active || undefined}
        className="group relative inline-flex h-11 items-center gap-1.5 px-3 text-[0.95rem] font-medium text-fg-soft transition-colors hover:text-fg data-[active]:text-fg"
      >
        {item.label}
        <ChevronIcon size={16} className={cn('transition-transform duration-300', open && 'rotate-180')} />
        <span
          aria-hidden
          className={cn(
            'absolute inset-x-3 bottom-1.5 h-0.5 origin-right scale-x-0 rounded-full bg-vermilion transition-transform duration-300 ease-(--ease-sunrise) group-hover:scale-x-100 ltr:origin-left',
            active && 'scale-x-100',
          )}
        />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute start-0 top-full z-50 w-[min(34rem,80vw)] pt-3"
      >
        <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)]">
          {item.children?.map((child) => {
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
      </div>
    </div>
  )
}
