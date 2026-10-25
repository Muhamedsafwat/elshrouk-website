import type { Locale } from '@/i18n/config'
import type { RouteKey } from '@/i18n/routing'

export type NavLink = { key: RouteKey; label: string; description?: string }

/** A link to another website; always opens in a new tab. */
export type ExternalNavLink = { label: string; href: string; description?: string; logo?: string }

export type RouteNavItem = NavLink & { kind?: 'route'; children?: NavLink[] }

/**
 * Top-level item whose menu lists links to other websites (e.g. partners). It has no page of its own:
 * `fallbackHref` is the on-site place that lists the same links, used where the label itself must be a link
 * (the mobile menu).
 */
export type ExternalMenuItem = {
  kind: 'external'
  id: string
  label: string
  fallbackHref: string
  links: ExternalNavLink[]
}

export type NavItem = RouteNavItem | ExternalMenuItem

export type HeaderLabels = {
  logoAlt: string
  homeLabel: string
  primaryNav: string
  openMenu: string
  closeMenu: string
  menuLabel: string
  cta: string
  languageLabel: string
  switchLanguageShort: string
  switchLanguageName: string
  /** Screen-reader note appended to links that open another website in a new tab. */
  externalLink: string
}

export type HeaderProps = {
  locale: Locale
  items: NavItem[]
  homeItem: NavLink
  labels: HeaderLabels
}
