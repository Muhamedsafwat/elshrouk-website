#!/usr/bin/env node
/**
 * Visual QA helper — captures one or more viewport screenshots of a URL.
 *
 *   node scripts/shot.mjs <url> <out.png> [--w 1440] [--h 900] [--full] [--reduced] [--scroll 0.5]
 *                         [--wait 1200] [--frames 300,900,1800] [--mobile]
 *
 * --full     full-page capture (scrolls through first so scroll-triggered reveals fire)
 * --reduced  emulate prefers-reduced-motion: reduce
 * --scroll   scroll to a fraction (0–1) of the page before capturing
 * --frames   capture extra frames at these ms offsets after load (suffix -t<ms>.png) to inspect motion
 * --mobile   touch + mobile UA (use with --w 390 --h 844)
 */
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const url = args[0]
const out = args[1]
if (!url || !out) {
  console.error('usage: node scripts/shot.mjs <url> <out.png> [options]')
  process.exit(1)
}
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  if (i === -1) return fallback
  const v = args[i + 1]
  return v && !v.startsWith('--') ? v : true
}
const width = Number(opt('w', 1440))
const height = Number(opt('h', 900))
const full = Boolean(opt('full', false))
const reduced = Boolean(opt('reduced', false))
const scroll = opt('scroll', null)
const wait = Number(opt('wait', 1200))
const frames = opt('frames', null)
const mobile = Boolean(opt('mobile', false))

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: reduced ? 'reduce' : 'no-preference',
  isMobile: mobile,
  hasTouch: mobile,
  userAgent: mobile
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    : undefined,
})
const page = await context.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console.error: ${m.text()}`)
})

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 180_000 })
if (frames && typeof frames === 'string') {
  for (const t of frames.split(',').map(Number)) {
    await page.waitForTimeout(t)
    await page.screenshot({ path: out.replace(/\.png$/, `-t${t}.png`) })
  }
}
await page.waitForLoadState('networkidle', { timeout: 60_000 }).catch(() => undefined)
await page.evaluate(() => document.fonts?.ready)

if (full || scroll !== null) {
  // Walk the page so scroll-triggered reveals run, then settle.
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += Math.round(height * 0.6)) {
    await page.evaluate((top) => window.scrollTo(0, top), y)
    await page.waitForTimeout(160)
  }
  await page.waitForTimeout(900)
  if (scroll !== null && !full) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
    await page.evaluate((top) => window.scrollTo(0, top), Math.round(h * Number(scroll)))
  } else {
    await page.evaluate(() => window.scrollTo(0, 0))
  }
}
await page.waitForTimeout(wait)
await page.screenshot({ path: out, fullPage: full })

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log(JSON.stringify({ out, width, height, overflowX: overflow, errors }, null, 0))
await browser.close()
