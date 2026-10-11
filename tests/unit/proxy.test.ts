import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { proxy } from '@/proxy'

const ORIGIN = 'http://localhost:3100'

const request = (path: string, init: { method?: string; headers?: Record<string, string> } = {}) =>
  new NextRequest(new URL(path, ORIGIN), init)

/** Stubs the public REST lookup the proxy makes for slugs. */
function stubApi(docs: unknown[] | Error) {
  const fetchMock = vi.fn(async () => {
    if (docs instanceof Error) throw docs
    return Response.json({ docs, totalDocs: docs.length })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const rewriteTarget = (res: Response) => res.headers.get('x-middleware-rewrite')
const isPassThrough = (res: Response) => res.headers.get('x-middleware-next') === '1'

beforeEach(() => {
  vi.stubEnv('SITE_URL', ORIGIN) // the slug lookup's origin comes from configuration only
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('proxy: locale redirect and server-rendered 404s (CI-03)', () => {
  it('redirects unprefixed paths to Arabic, keeping the query', async () => {
    const res = await proxy(request('/products?category=feed'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe(`${ORIGIN}/ar/products?category=feed`)
  })

  it('passes known pages through without any lookup', async () => {
    const fetchMock = stubApi([])
    for (const path of ['/ar', '/en/about', '/ar/solutions/layers', '/ar/products']) {
      expect(isPassThrough(await proxy(request(path))), path).toBe(true)
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rewrites unknown paths to the localized 404 page with status 404', async () => {
    const fetchMock = stubApi([])
    const res = await proxy(request('/en/missing/deeper'))
    expect(res.status).toBe(404)
    expect(rewriteTarget(res)).toBe(`${ORIGIN}/en/page-not-found`)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rewrites a slug the public API does not return', async () => {
    const fetchMock = stubApi([])
    const res = await proxy(request('/ar/products/no-such-product'))
    expect(res.status).toBe(404)
    expect(rewriteTarget(res)).toBe(`${ORIGIN}/ar/page-not-found`)
    const url = new URL(String((fetchMock.mock.calls[0] as unknown[])[0]))
    expect(url.pathname).toBe('/api/products')
    expect(url.searchParams.get('where[slug][equals]')).toBe('no-such-product')
  })

  it('lets a public slug through and asks the articles collection for knowledge pages', async () => {
    const fetchMock = stubApi([{ slug: 'feed-storage' }])
    expect(isPassThrough(await proxy(request('/ar/knowledge/feed-storage')))).toBe(true)
    expect(new URL(String((fetchMock.mock.calls[0] as unknown[])[0])).pathname).toBe('/api/articles')
  })

  it('falls back to the page when the lookup fails', async () => {
    stubApi(new Error('connection refused'))
    expect(isPassThrough(await proxy(request('/ar/products/some-product')))).toBe(true)
  })

  it('never takes the lookup origin from the request Host header (no SSRF)', async () => {
    const fetchMock = stubApi([])
    const forged = new NextRequest('http://169.254.169.254/ar/products/some-product', { headers: { host: '169.254.169.254' } })
    await proxy(forged)
    expect(new URL(String((fetchMock.mock.calls[0] as unknown[])[0])).origin).toBe(ORIGIN)
  })

  it('prefers INTERNAL_SITE_ORIGIN and skips the lookup when no origin is configured', async () => {
    vi.stubEnv('INTERNAL_SITE_ORIGIN', 'http://127.0.0.1:3000')
    const fetchMock = stubApi([])
    await proxy(request('/ar/products/some-product'))
    expect(new URL(String((fetchMock.mock.calls[0] as unknown[])[0])).origin).toBe('http://127.0.0.1:3000')

    vi.stubEnv('INTERNAL_SITE_ORIGIN', '')
    vi.stubEnv('SITE_URL', '')
    fetchMock.mockClear()
    expect(isPassThrough(await proxy(request('/ar/products/some-product')))).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('skips the lookup for staff sessions, server actions and prefetches', async () => {
    const fetchMock = stubApi([])
    const cases = [
      request('/ar/products/draft-product', { headers: { cookie: 'payload-token=abc' } }),
      request('/ar/products/some-product', { method: 'POST', headers: { 'next-action': 'x' } }),
      request('/ar/products/some-product', { headers: { 'next-router-prefetch': '1', rsc: '1' } }),
    ]
    for (const req of cases) expect(isPassThrough(await proxy(req))).toBe(true)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
