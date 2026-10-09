/** Motion tokens (spec §8.3) shared by GSAP timelines. CSS equivalents live in globals.css. */
export const motion = {
  hover: 0.18,
  enter: 0.65,
  imageReveal: 1.0,
  lineStagger: 0.1,
  itemStagger: 0.08,
  counter: 1.2,
  travel: 20, // px for component entrances
  parallax: 40, // px max image drift (desktop only)
  ease: {
    sunrise: 'expo.out',
    out: 'power3.out',
    soft: 'power2.out',
    flow: 'power2.inOut',
  },
} as const

/** Media queries used with gsap.matchMedia — motion only runs when the user allows it. */
export const mq = {
  motion: '(prefers-reduced-motion: no-preference)',
  desktopMotion: '(prefers-reduced-motion: no-preference) and (min-width: 64rem) and (pointer: fine)',
  mobileMotion: '(prefers-reduced-motion: no-preference) and (max-width: 63.98rem)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const

/** True when animations must not run: reduced motion, the no-JS/slow-start fail-safe, or Save-Data. */
export function motionDisabled(): boolean {
  if (typeof window === 'undefined') return true
  const html = document.documentElement
  if (html.classList.contains('motion-off')) return true
  if (window.matchMedia(mq.reduced).matches) return true
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}
