'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { otherLocale, type Locale } from '@/i18n/config'
import { switchLocalePath } from '@/i18n/routing'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/cn'

type Props = {
  locale: Locale
  short: string
  name: string
  label: string
  className?: string
}

function SwitcherLink({ locale, short, name, label, className }: Props) {
  const pathname = usePathname() || `/${locale}`
  const searchParams = useSearchParams()
  const target = otherLocale(locale)
  const search = searchParams?.toString() ? `?${searchParams.toString()}` : ''
  return (
    <Link
      href={switchLocalePath(pathname, target, search)}
      hrefLang={target}
      lang={target}
      aria-label={`${label}: ${name}`}
      onClick={() => trackEvent('language_toggle', { from: locale, to: target })}
      className={cn(
        'inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-sm font-semibold transition-colors hover:border-fg hover:bg-fg hover:text-surface',
        target === 'en' ? 'font-num tracking-wide' : '',
        className,
      )}
    >
      {short}
    </Link>
  )
}

/** Preserves the equivalent route + query string across locales (spec §7.3). */
export function LocaleSwitcher(props: Props) {
  return (
    <Suspense
      fallback={
        <Link
          href={`/${otherLocale(props.locale)}`}
          hrefLang={otherLocale(props.locale)}
          lang={otherLocale(props.locale)}
          aria-label={`${props.label}: ${props.name}`}
          className={cn('inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-sm font-semibold', props.className)}
        >
          {props.short}
        </Link>
      }
    >
      <SwitcherLink {...props} />
    </Suspense>
  )
}
