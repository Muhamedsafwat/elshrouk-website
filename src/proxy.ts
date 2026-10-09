import { NextResponse, type NextRequest } from 'next/server'

const LOCALES = new Set(['ar', 'en'])
const DEFAULT_LOCALE = 'ar'

/**
 * Arabic-first locale policy: every public URL carries a locale prefix.
 * Unprefixed paths (including "/") redirect to the Arabic equivalent; unknown pages then render the
 * designed localized 404 instead of a bare framework error.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const firstSegment = pathname.split('/')[1] ?? ''
  if (LOCALES.has(firstSegment)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  url.search = search
  return NextResponse.redirect(url, 307)
}

export const config = {
  // Skip the CMS, APIs, Next internals and any file with an extension (static assets).
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
