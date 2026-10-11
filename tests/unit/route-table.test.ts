import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { routes } from '@/i18n/routing'
import { SEGMENT_KEYS } from '@/lib/catalog-params'
import { matchLocalePath, NOT_FOUND_PATH, SLUG_PATTERN } from '@/lib/route-table'

const LOCALE_DIR = path.join(process.cwd(), 'src', 'app', '(frontend)', '[locale]')

/** URL path (after the locale) of every page file under [locale], with route groups removed. */
function pageRoutes(dir = LOCALE_DIR, segments: string[] = []): string[] {
  const found: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const isGroup = /^\(.*\)$/.test(entry.name)
      found.push(...pageRoutes(path.join(dir, entry.name), isGroup ? segments : [...segments, entry.name]))
    } else if (entry.name === 'page.tsx') {
      found.push(segments.length ? `/${segments.join('/')}` : '')
    }
  }
  return found
}

describe('route table used by the proxy for server-rendered 404s (CI-03)', () => {
  const files = pageRoutes()

  it('knows every page file, so the proxy never turns a real page into a 404', () => {
    expect(files.length).toBeGreaterThan(10)
    for (const route of files) {
      if (route === '/[...rest]' || route === NOT_FOUND_PATH) continue
      if (route === '/solutions/[segment]') {
        for (const segment of SEGMENT_KEYS) expect(matchLocalePath(`/solutions/${segment}`), route).toEqual({ kind: 'page' })
      } else if (route === '/products/[slug]' || route === '/knowledge/[slug]') {
        expect(matchLocalePath(route.replace('[slug]', 'sample-slug-1')).kind, route).toBe('slug')
      } else {
        expect(route, `${route} has a dynamic segment the proxy does not know`).not.toMatch(/\[/)
        expect(matchLocalePath(route), route).toEqual({ kind: 'page' })
      }
    }
  })

  it('has a page file behind every canonical route', () => {
    const expanded = new Set(
      files.flatMap((r) => (r === '/solutions/[segment]' ? SEGMENT_KEYS.map((s) => `/solutions/${s}`) : [r])),
    )
    for (const route of Object.values(routes)) expect(expanded.has(route), route).toBe(true)
  })

  it('maps product and article slugs to their collections', () => {
    expect(matchLocalePath('/products/broiler-starter-1')).toEqual({ kind: 'slug', collection: 'products', slug: 'broiler-starter-1' })
    expect(matchLocalePath('/knowledge/feed-storage')).toEqual({ kind: 'slug', collection: 'articles', slug: 'feed-storage' })
  })

  it('treats unknown paths, malformed slugs and the 404 route itself as missing', () => {
    for (const p of [
      '/nope',
      '/en',
      '/missing/deeper',
      '/solutions/cattle',
      '/products/NOT_A_VALID_SLUG',
      '/products/a/b',
      '/products/%E0%A4%A',
      '/knowledge/-leading-dash',
      '//about',
      NOT_FOUND_PATH,
    ]) {
      expect(matchLocalePath(p), p).toEqual({ kind: 'missing' })
    }
  })

  it('accepts the home page and trailing slashes', () => {
    for (const p of ['', '/', '/about/', '/products/']) expect(matchLocalePath(p), p).toEqual({ kind: 'page' })
  })

  it('shares the catalogue slug rule', () => {
    expect(SLUG_PATTERN.test('layer-premix-2')).toBe(true)
    expect(SLUG_PATTERN.test('Layer_Premix')).toBe(false)
  })
})
