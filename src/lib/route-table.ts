import { routes } from '@/i18n/routing'

/**
 * Which public URLs exist under a locale prefix. Pure and dependency-free so `src/proxy.ts` can use it without
 * bundling the CMS; `tests/unit/route-table.test.ts` checks it against the page files so it cannot drift.
 */

/** Shape of every product / article slug (the CMS slug field and the catalogue lookups use the same rule). */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * The localized 404 page that the proxy rewrites unknown paths and missing slugs to, with status 404. A `notFound()`
 * thrown while a page renders is only caught by a client-side boundary, so its HTML would be blank without
 * JavaScript (CI-03); this route renders the same view as a normal page instead.
 */
export const NOT_FOUND_PATH = '/page-not-found'

const STATIC_PATHS: ReadonlySet<string> = new Set(Object.values(routes))

const SLUG_ROUTE = /^\/(products|knowledge)\/([^/]+)$/

export type SlugCollection = 'products' | 'articles'

export type PathMatch =
  | { kind: 'page' }
  | { kind: 'slug'; collection: SlugCollection; slug: string }
  | { kind: 'missing' }

/** Classifies the part of a pathname after `/<locale>` ('' or '/' is the home page). */
export function matchLocalePath(path: string): PathMatch {
  const normalized = path === '/' ? '' : path.replace(/\/+$/, '')
  if (STATIC_PATHS.has(normalized)) return { kind: 'page' }

  const slugRoute = SLUG_ROUTE.exec(normalized)
  if (!slugRoute) return { kind: 'missing' }
  let slug: string
  try {
    slug = decodeURIComponent(slugRoute[2] ?? '')
  } catch {
    return { kind: 'missing' }
  }
  if (!SLUG_PATTERN.test(slug)) return { kind: 'missing' }
  return { kind: 'slug', collection: slugRoute[1] === 'products' ? 'products' : 'articles', slug }
}
