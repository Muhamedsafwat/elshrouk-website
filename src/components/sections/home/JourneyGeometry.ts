/**
 * Distribution Flow geometry for the home journey (Scene 6, desktop band).
 * Shared by the server markup (first paint at the reference width) and JourneyFlow (exact maths after
 * measuring), so it must stay a plain module — no 'use client'.
 *
 * Six equal columns: steps 1–5 + the destination. Node k sits at the start of column k (its start edge on
 * the column start, like the text block above/below it). Steps alternate between the upper rail
 * (odd steps, text above) and the lower rail (even steps + destination, text below); every change of rail
 * is a 45° diagonal centred between two nodes. Each of the five spans has the same length, so node k is
 * reached exactly at progress k / 5.
 */
export const JOURNEY = {
  /** Reference width = container content width at 1440px. */
  width: 1268,
  /** Band height in px — must match the `7rem` grid row in Journey.tsx. */
  height: 112,
  /** Rail inset from the band's top / bottom edge. */
  inset: 20,
  /** Step node radius (20px nodes). */
  radius: 10,
  columns: 6,
  spans: 5,
} as const

export const journeyRail = (k: number, height: number = JOURNEY.height) =>
  k % 2 === 0 ? JOURNEY.inset : height - JOURNEY.inset

/** SVG path data in the band's own pixel space; `rtl` mirrors it so the flow runs right → left. */
export function journeyPath(width: number = JOURNEY.width, height: number = JOURNEY.height, rtl = true): string {
  const col = width / JOURNEY.columns
  const rise = height - 2 * JOURNEY.inset
  const run = Math.max(0, (col - rise) / 2)
  const node = (k: number) => k * col + JOURNEY.radius
  const x = (v: number) => (rtl ? width - v : v).toFixed(1)
  let d = `M${x(node(0))} ${journeyRail(0, height)}`
  for (let k = 0; k < JOURNEY.spans; k++) {
    const start = node(k)
    d += ` H${x(start + run)} L${x(start + run + rise)} ${journeyRail(k + 1, height)} H${x(node(k + 1))}`
  }
  return d
}
