import { isLocale, type Locale } from './config'

/** Canonical route map (spec §4.2). Identical slugs in both locales keep locale switching lossless. */
export const routes = {
  home: '',
  about: '/about',
  solutions: '/poultry-solutions',
  broilers: '/solutions/broilers',
  layers: '/solutions/layers',
  breeders: '/solutions/breeders',
  products: '/products',
  howWeWork: '/how-we-work',
  knowledge: '/knowledge',
  contact: '/contact',
  partner: '/partner-with-us',
  privacy: '/privacy',
} as const

export type RouteKey = keyof typeof routes

export type QueryValue = string | number | undefined | null
export type Query = Record<string, QueryValue>

const toSearch = (query?: Query): string => {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  }
  const s = params.toString()
  return s ? `?${s}` : ''
}

export function href(locale: Locale, route: RouteKey, query?: Query, hash?: string): string {
  return `/${locale}${routes[route]}${toSearch(query)}${hash ? `#${hash}` : ''}`
}

export const segmentRoute = (segment: 'broilers' | 'layers' | 'breeders'): RouteKey => segment

export const productHref = (locale: Locale, slug: string) => `/${locale}/products/${encodeURIComponent(slug)}`
export const articleHref = (locale: Locale, slug: string) => `/${locale}/knowledge/${encodeURIComponent(slug)}`

/** Maps the current pathname to the equivalent page in the target locale (spec §7.3). */
export function switchLocalePath(pathname: string, target: Locale, search = ''): string {
  const parts = pathname.split('/')
  if (isLocale(parts[1])) {
    parts[1] = target
  } else {
    parts.splice(1, 0, target)
  }
  const path = parts.join('/') || `/${target}`
  return `${path}${search}`
}

/** True when `pathname` is (or is nested under) the given route in the given locale. */
export function isActiveRoute(pathname: string, locale: Locale, route: RouteKey): boolean {
  const base = `/${locale}${routes[route]}`
  if (route === 'home') return pathname === base || pathname === `${base}/`
  if (route === 'solutions') {
    return pathname.startsWith(`/${locale}/poultry-solutions`) || pathname.startsWith(`/${locale}/solutions/`)
  }
  return pathname === base || pathname.startsWith(`${base}/`)
}

export const absoluteUrl = (path: string): string => {
  // Server-side runtime SITE_URL first (NEXT_PUBLIC_* is inlined at build time).
  const base = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100').replace(/\/$/, '')
  return `${base}${path}`
}
