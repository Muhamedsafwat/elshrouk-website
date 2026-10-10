import { chromium } from '@playwright/test'
// usage: node scripts/_frames.mjs <url> <outDir> <width> <height> <mobile 0|1> <steps>
const [, , url, outDir, w, h, mob, stepsArg] = process.argv
const width = Number(w), height = Number(h), mobile = mob === '1', steps = Number(stepsArg || 12)
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 160)))
page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text().slice(0, 160)))
await page.goto(url, { waitUntil: 'networkidle', timeout: 240000 })
await page.waitForTimeout(1800)
const total = await page.evaluate(() => document.documentElement.scrollHeight)
const max = total - height
const frames = []
for (let i = 0; i <= steps; i++) {
  const y = Math.round((max * i) / steps)
  // scroll in small increments so scroll-linked scenes update
  const cur = await page.evaluate(() => window.scrollY)
  for (let s = cur; Math.abs(s - y) > 1; s += Math.sign(y - s) * Math.min(Math.abs(y - s), 300)) {
    await page.evaluate((top) => window.scrollTo(0, top), s + Math.sign(y - s) * Math.min(Math.abs(y - s), 300))
    await page.waitForTimeout(60)
  }
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForTimeout(1300)
  const f = `${outDir}/f${String(i).padStart(2, '0')}.png`
  await page.screenshot({ path: f })
  frames.push(f)
}
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
console.log(JSON.stringify({ total, frames: frames.length, overflow, errors: errors.slice(0, 6) }))
await browser.close()
