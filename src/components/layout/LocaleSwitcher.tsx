'use client'

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
  /** Not rendered: an Arabic "اللغة:" prefix inside the lang="en" link broke WCAG 2.5.3 (A11Y-5). */
  label?: string
  className?: string
}

/**
 * Accessible name = visible text + the target language's own name, all in the target language
 * ("EN — English" / "ع — العربية"), so it contains the visible label (WCAG 2.5.3) and matches `lang`.
 */
const accessibleName = (short: string, name: string) => `${short} — ${name}`

/**
 * A plain <a>, not next/link, on purpose: switching locale re-mounts the whole root layout (html/head/body), so a
 * client-side navigation gained nothing and lost the pre-paint boot state (html.js). A full load gives the new
 * locale a fresh server-rendered document.
 */
function SwitcherLink({ locale, short, name, className }: Props) {
  const pathname = usePathname() || `/${locale}`
  const searchParams = useSearchParams()
  const target = otherLocale(locale)
  const search = searchParams?.toString() ? `?${searchParams.toString()}` : ''
  return (
    <a
      href={switchLocalePath(pathname, target, search)}
      hrefLang={target}
      lang={target}
      aria-label={accessibleName(short, name)}
      onClick={() => trackEvent('language_toggle', { from: locale, to: target })}
      className={cn(
        'inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-sm font-semibold transition-colors hover:border-fg hover:bg-fg hover:text-surface',
        target === 'en' ? 'font-num tracking-wide' : '',
        className,
      )}
    >
      {short}
    </a>
  )
}

/** Preserves the equivalent route + query string across locales (spec §7.3). */
export function LocaleSwitcher(props: Props) {
  return (
    <Suspense
      fallback={
        <a
          href={`/${otherLocale(props.locale)}`}
          hrefLang={otherLocale(props.locale)}
          lang={otherLocale(props.locale)}
          aria-label={accessibleName(props.short, props.name)}
          className={cn('inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-sm font-semibold', props.className)}
        >
          {props.short}
        </a>
      }
    >
      <SwitcherLink {...props} />
    </Suspense>
  )
}
