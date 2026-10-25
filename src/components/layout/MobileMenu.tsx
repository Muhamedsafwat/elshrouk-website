'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { Logo } from '@/components/brand/Logo'
import { SunriseCurve } from '@/components/brand/SunriseCurve'
import { MASK_HIDDEN_Y_PERCENT } from '@/components/motion/mask'
import { ButtonLink } from '@/components/ui/Button'
import { CloseIcon, ExternalIcon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { href, isActiveRoute } from '@/i18n/routing'
import { gsap } from '@/lib/motion/gsap'
import { motionDisabled } from '@/lib/motion/tokens'
import { LocaleSwitcher } from './LocaleSwitcher'
import type { HeaderLabels, NavItem } from './types'

type Props = {
  open: boolean
  onClose: () => void
  locale: Locale
  items: NavItem[]
  pathname: string
  labels: HeaderLabels
}

/**
 * Full-screen editorial menu (spec §7.3): native modal <dialog> → background inert + focus contained;
 * closes via Esc, the close button or any navigation; body scroll locked only while open; focus is
 * restored to the trigger by the Header. Links rise line-by-line (disabled for reduced motion).
 */
export function MobileMenu({ open, onClose, locale, items, pathname, labels }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const firstPath = useRef(pathname)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
      if (!motionDisabled()) {
        const tl = gsap.timeline()
        tl.fromTo(dialog, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'expo.inOut' })
          .fromTo(
            dialog.querySelectorAll('[data-menu-line]'),
            { yPercent: MASK_HIDDEN_Y_PERCENT },
            { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 },
            '-=0.2',
          )
          .fromTo(dialog.querySelectorAll('[data-menu-fade]'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.5')
          .fromTo(dialog.querySelector('[data-menu-curve]'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.6')
      }
      dialog.querySelector<HTMLElement>('[data-menu-close]')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
      document.documentElement.style.overflow = ''
      gsap.set(dialog, { clearProps: 'clipPath' })
    }
  }, [open])

  // Close after any client navigation.
  useEffect(() => {
    if (pathname !== firstPath.current) {
      firstPath.current = pathname
      if (open) onClose()
    }
  }, [pathname, open, onClose])

  useEffect(() => () => {
    document.documentElement.style.overflow = ''
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label={labels.menuLabel}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-ink p-0 text-paper backdrop:bg-transparent open:flex open:flex-col"
      data-theme="dark"
    >
      <div className="container-site flex items-center justify-between pt-4 pb-2">
        <Link href={href(locale, 'home')} aria-label={labels.homeLabel} className="rounded-sm" onClick={onClose}>
          <Logo variant="white" width={112} alt={labels.logoAlt} />
        </Link>
        <div className="flex items-center gap-3" data-menu-fade>
          <LocaleSwitcher
            locale={locale}
            short={labels.switchLanguageShort}
            name={labels.switchLanguageName}
            label={labels.languageLabel}
            className="border-white/25 text-paper hover:bg-paper hover:text-ink"
          />
          <button
            type="button"
            data-menu-close
            aria-label={labels.closeMenu}
            onClick={onClose}
            className="inline-flex size-12 items-center justify-center rounded-full border border-white/25 text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            <CloseIcon size={22} />
          </button>
        </div>
      </div>

      <nav aria-label={labels.primaryNav} className="container-site relative z-10 flex-1 py-6">
        <ol className="flex flex-col">
          {items.map((item, i) => {
            const external = item.kind === 'external'
            const id = external ? item.id : item.key
            const lineHref = external ? item.fallbackHref : href(locale, item.key)
            const active = !external && isActiveRoute(pathname, locale, item.key)
            return (
              <li key={id} className="border-b border-white/12 py-1">
                <span className="mask-line">
                  <span data-menu-line>
                    <Link
                      href={lineHref}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className="group flex items-baseline gap-4 py-2.5 text-[clamp(1.75rem,7.5vw,2.75rem)] leading-[1.25] font-bold text-paper transition-colors hover:text-vermilion aria-[current=page]:text-vermilion"
                    >
                      <span className="num w-8 shrink-0 text-sm font-semibold text-stone-400">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                    </Link>
                  </span>
                </span>
                {external ? (
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 ps-12 pb-3" data-menu-fade>
                    {item.links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="latin inline-flex min-h-11 items-center gap-1.5 text-base font-medium text-stone-300 underline-offset-8 hover:text-paper hover:underline"
                        >
                          {link.label}
                          <ExternalIcon size={14} />
                          <span className="sr-only">({labels.externalLink})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : item.children?.length ? (
                  <ul className="flex flex-wrap gap-x-5 gap-y-1 ps-12 pb-3" data-menu-fade>
                    {item.children.map((child) => (
                      <li key={child.key}>
                        <Link
                          href={href(locale, child.key)}
                          onClick={onClose}
                          aria-current={pathname === href(locale, child.key) ? 'page' : undefined}
                          className="inline-flex min-h-11 items-center text-base font-medium text-stone-300 underline-offset-8 hover:text-paper hover:underline aria-[current=page]:text-paper"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="container-site relative z-10 pb-8" data-menu-fade>
        <ButtonLink href={href(locale, 'contact')} variant="accent" size="lg" className="w-full" onClick={onClose}>
          {labels.cta}
        </ButtonLink>
      </div>

      <div data-menu-curve aria-hidden className="pointer-events-none absolute -bottom-10 -start-24 w-[150%] opacity-90 sm:w-[110%]">
        <SunriseCurve lines={3} tone="dark" static />
      </div>
    </dialog>
  )
}
