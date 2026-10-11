import { NextResponse, type NextRequest } from 'next/server'
import { matchLocalePath, NOT_FOUND_PATH, type SlugCollection } from '@/lib/route-table'

const LOCALES = new Set(['ar', 'en'])
const DEFAULT_LOCALE = 'ar'
const SLUG_CHECK_TIMEOUT_MS = 1500

/**
 * Arabic-first locale policy: every public URL carries a locale prefix. Unprefixed paths (including "/") redirect to
 * the Arabic equivalent.
 *
 * Under a locale, unknown paths and missing product/article slugs are rewritten to the designed 404 page with status
 * 404. Deciding this here, before rendering, is what lets the 404 be server-rendered: a `notFound()` thrown while a
 * page renders is caught only on the client, so its HTML is blank without JavaScript (CI-03). The pages keep their
 * own `notFound()` as the fallback whenever this check is skipped or cannot run.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const [, firstSegment = '', ...rest] = pathname.split('/')

  if (LOCALES.has(firstSegment)) {
    const match = matchLocalePath(rest.length ? `/${rest.join('/')}` : '')
    if (match.kind === 'missing') return notFoundRewrite(request, firstSegment)
    if (match.kind === 'slug' && shouldCheckSlug(request)) {
      const exists = await slugIsPublic(match.collection, match.slug, firstSegment)
      if (exists === false) return notFoundRewrite(request, firstSegment)
    }
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  url.search = search
  return NextResponse.redirect(url, 307)
}

function notFoundRewrite(request: NextRequest, locale: string) {
  return NextResponse.rewrite(new URL(`/${locale}${NOT_FOUND_PATH}`, request.url), { status: 404 })
}

/**
 * Only plain page loads and navigations are checked. Skipped: server actions and other non-GET requests, router
 * prefetches (one lookup per visible card would be wasteful), and signed-in staff, whose drafts are visible only to
 * them (the page's own preview logic decides).
 */
function shouldCheckSlug(request: NextRequest): boolean {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false
  if (request.headers.has('next-router-prefetch')) return false
  return !request.cookies.has('payload-token')
}

/**
 * Asks the public REST API whether a slug is visible to anonymous visitors. That API applies the same read access
 * as the pages (approved + published, fixtures only on demo builds), so the answers cannot differ. Returns
 * `undefined` when the check could not be made, and the page then decides as before.
 *
 * The origin comes from server configuration only, never from the request: a client-supplied Host header must not
 * be able to point this server-side fetch at another host (SSRF).
 */
async function slugIsPublic(collection: SlugCollection, slug: string, locale: string): Promise<boolean | undefined> {
  const origin = process.env.INTERNAL_SITE_ORIGIN || process.env.SITE_URL
  if (!origin) return undefined
  const url = new URL(`/api/${collection}`, origin)
  url.searchParams.set('where[slug][equals]', slug)
  url.searchParams.set('select[slug]', 'true')
  url.searchParams.set('depth', '0')
  url.searchParams.set('limit', '1')
  url.searchParams.set('locale', locale)
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(SLUG_CHECK_TIMEOUT_MS),
    })
    if (!res.ok) return undefined
    const body = (await res.json()) as { docs?: unknown[] }
    return Array.isArray(body.docs) ? body.docs.length > 0 : undefined
  } catch {
    return undefined
  }
}

export const config = {
  // Skip the CMS, APIs, Next internals and any file with an extension (static assets).
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
