import type { Locale } from '@/i18n/config'
import type { RouteKey } from '@/i18n/routing'

export type NavLink = { key: RouteKey; label: string; description?: string }
export type NavItem = NavLink & { children?: NavLink[] }

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
}

export type HeaderProps = {
  locale: Locale
  items: NavItem[]
  homeItem: NavLink
  labels: HeaderLabels
}
