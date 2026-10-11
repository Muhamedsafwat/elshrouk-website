import { notFound } from 'next/navigation'

/**
 * Fallback only: src/proxy.ts already rewrites unknown paths to the server-rendered `page-not-found` route with
 * status 404 (CI-03). If a request ever reaches this catch-all, the not-found boundary still shows the designed 404.
 */
export default function CatchAll() {
  notFound()
}
