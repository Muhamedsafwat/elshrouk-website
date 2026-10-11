import { expect, test } from '@playwright/test'

/**
 * Gate G5.10 — every internal link and CTA resolves. Visits each public route in both locales, collects every
 * <a href>, then requests each unique internal URL once: it must answer 200 directly (no redirect hops, no 404),
 * and a #fragment must exist on the page it points to. Read-only: GET requests only, nothing is submitted.
 */
const MISSING = '/this-page-does-not-exist'

const ROUTES = [
  '',
  '/about',
  '/poultry-solutions',
  '/solutions/broilers',
  '/solutions/layers',
  '/solutions/breeders',
  '/how-we-work',
  '/products',
  '/knowledge',
  '/contact',
  '/partner-with-us',
  '/privacy',
  MISSING,
]

test('every internal link and CTA resolves with 200 and existing fragments (G5.10)', async ({ page, request, baseURL }) => {
  test.setTimeout(300_000)
  const origin = new URL(baseURL ?? 'http://localhost:3200').origin

  // Include one public product page when the catalogue has any (fixture builds do).
  const products = (await (await request.get('/api/products?limit=1&depth=0&select[slug]=true')).json()) as { docs?: { slug?: string }[] }
  const productSlug = products.docs?.[0]?.slug
  const routes = productSlug ? [...ROUTES, `/products/${productSlug}`] : ROUTES

  const targets = new Map<string, { from: string; fragments: Set<string> }>()
  const external = new Set<string>()
  const problems: string[] = []

  for (const locale of ['ar', 'en']) {
    for (const route of routes) {
      const path = `/${locale}${route}`
      await page.goto(path)
      const hrefs = await page.$$eval('a[href]', (anchors) => anchors.map((a) => a.getAttribute('href') ?? ''))
      const ids = new Set(await page.$$eval('[id]', (els) => els.map((el) => el.id)))
      for (const raw of hrefs) {
        if (!raw || /^(mailto|tel|sms|javascript):/i.test(raw)) continue
        const url = new URL(raw, `${origin}${path}`)
        if (url.origin !== origin) {
          external.add(url.href)
          continue
        }
        // On the 404 page the locale switch maps to the same (also missing) path in the other locale, by design
        // (spec §7.3 keeps the equivalent path); that intentional 404 is the gate's stated exception.
        if (route === MISSING && url.pathname.endsWith(MISSING)) continue
        const fragment = decodeURIComponent(url.hash.slice(1))
        url.hash = ''
        if (url.pathname === path && url.search === '' && fragment) {
          if (!ids.has(fragment)) problems.push(`${path}: in-page link #${fragment} has no target`)
          continue
        }
        const entry = targets.get(url.href) ?? { from: path, fragments: new Set<string>() }
        if (fragment) entry.fragments.add(fragment)
        targets.set(url.href, entry)
      }
    }
  }

  for (const [url, { from, fragments }] of targets) {
    const res = await request.get(url, { maxRedirects: 0 })
    if (res.status() !== 200) {
      problems.push(`${from} → ${url}: ${res.status()}`)
      continue
    }
    if (fragments.size) {
      const html = await res.text()
      for (const f of fragments) if (!html.includes(`id="${f}"`)) problems.push(`${from} → ${url}#${f}: fragment target missing`)
    }
  }

  test.info().annotations.push({ type: 'checked', description: `${targets.size} internal URLs from ${routes.length * 2} pages` })
  if (external.size) test.info().annotations.push({ type: 'external links (not requested)', description: [...external].join(', ') })
  expect(targets.size).toBeGreaterThan(20)
  expect(problems, problems.join('\n')).toEqual([])
})
