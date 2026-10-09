#!/usr/bin/env node
/**
 * Renders the default Open Graph images (1200×630) with Playwright:
 *   public/og/alshorouk-og.png     (Arabic — referenced by src/lib/seo.ts buildMetadata)
 *   public/og/alshorouk-og-en.png  (English variant)
 *
 *   node scripts/og-image.mjs
 *
 * Composition: white ground; the official full-colour logo (public/brand) above its legal minimum width and
 * with its 15% clear space; the home meta title set in the self-hosted brand fonts (src/styles/fonts); the
 * Signature Curve (same paths/colours as src/components/brand/SunriseCurve.tsx, PDF orientation — never
 * mirrored) cropped off the lower-right edges, clear of the text.
 * Re-run whenever the home meta title, logo or fonts change.
 */
import { mkdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(path.join(root, p))
const dataUri = (p, mime) => `data:${mime};base64,${read(p).toString('base64')}`

/** The home meta title is the single source of the OG line (src/i18n/dictionaries/{ar,en}/home.ts). */
const metaTitle = (locale) => {
  const src = read(`src/i18n/dictionaries/${locale}/home.ts`).toString('utf8')
  const match = src.match(/meta:\s*\{\s*title:\s*'([^']+)'/)
  if (!match) throw new Error(`meta.title not found in ${locale}/home.ts`)
  return match[1]
}

const fonts = {
  arabic: dataUri('src/styles/fonts/alexandria-arabic-var.woff2', 'font/woff2'),
  latin: dataUri('src/styles/fonts/montserrat-latin-var.woff2', 'font/woff2'),
}
const logo = dataUri('public/brand/alshorouk-logo-full-color.svg', 'image/svg+xml')

// Same unicode ranges as src/styles/fonts.ts so Arabic resolves to Alexandria and Latin/digits to Montserrat.
const ARABIC_RANGE =
  'U+0600-06FF, U+0750-077F, U+0870-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC'
const LATIN_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-200B, U+2012-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'

const CURVES = [
  { d: 'M -20 520 C 300 430, 700 250, 1220 -10', color: '#FE3300', width: 8 },
  { d: 'M -20 560 C 320 480, 720 310, 1220 60', color: '#FEB821', width: 8 },
  { d: 'M 30 610 C 380 540, 760 380, 1220 140', color: '#000000', width: 4.4 },
]

const LOGO_WIDTH = 196 // ≥ 110px brand minimum; clear space = 15% of the width on every side

const html = (locale) => {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const title = metaTitle(locale)
  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: 'Brand Arabic'; src: url(${fonts.arabic}) format('woff2'); font-weight: 100 900; unicode-range: ${ARABIC_RANGE}; }
  @font-face { font-family: 'Brand Latin'; src: url(${fonts.latin}) format('woff2'); font-weight: 100 900; unicode-range: ${LATIN_RANGE}; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; background: #ffffff; overflow: hidden; }
  body { position: relative; font-family: 'Brand Latin', 'Brand Arabic', sans-serif; color: #000; }
  .curve { position: absolute; left: 0; top: 368px; width: 1200px; height: 620px; overflow: visible; }
  .stack { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 52px; text-align: center; }
  .logo { padding: ${Math.round(LOGO_WIDTH * 0.15)}px; }
  .logo img { display: block; width: ${LOGO_WIDTH}px; height: auto; }
  h1 { margin-top: 6px; max-width: 860px; font-weight: 700; text-wrap: balance; }
  h1.ar { font-size: 60px; line-height: 1.32; }
  h1.en { font-size: 54px; line-height: 1.16; letter-spacing: -0.02em; }
</style>
</head>
<body>
  <svg class="curve" viewBox="0 0 1200 620" aria-hidden="true">
    ${CURVES.map((c) => `<path d="${c.d}" fill="none" stroke="${c.color}" stroke-width="${c.width}" stroke-linecap="round"/>`).join('\n    ')}
  </svg>
  <div class="stack">
    <div class="logo"><img src="${logo}" alt=""></div>
    <h1 class="${locale}">${title}</h1>
  </div>
</body>
</html>`
}

const outDir = path.join(root, 'public/og')
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  for (const [locale, file] of [
    ['ar', 'alshorouk-og.png'],
    ['en', 'alshorouk-og-en.png'],
  ]) {
    await page.setContent(html(locale), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    const family = locale === 'ar' ? 'Brand Arabic' : 'Brand Latin'
    const loaded = await page.evaluate((f) => document.fonts.check(`700 54px "${f}"`), family)
    if (!loaded) throw new Error(`${family} did not load`)
    // Guard the composition: the headline must clear the curve band and the canvas.
    const box = await page.locator('h1').boundingBox()
    if (!box || box.y + box.height > 470) throw new Error(`headline overlaps the curve band: ${JSON.stringify(box)}`)
    const out = path.join(outDir, file)
    await page.screenshot({ path: out, type: 'png' })
    console.log(JSON.stringify({ out: path.relative(root, out), locale, title: metaTitle(locale), headline: box }))
  }
} finally {
  await browser.close()
}
