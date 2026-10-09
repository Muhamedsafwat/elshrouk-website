import localFont from 'next/font/local'

/**
 * TYPOGRAPHY BLOCKER (docs/open-items.md): the brand's Arabic face is Thmanyah (خط ثمانية), a licensed
 * font that is not in this repository and must not be downloaded from unofficial sources.
 *
 * Staging fallback: Alexandria (SIL OFL 1.1 — src/styles/fonts/OFL-Alexandria.txt), a geometric,
 * open-form Arabic sans chosen by side-by-side comparison with 9 OFL candidates (docs/brand-audit.md).
 * Fonts are self-hosted with explicit unicode-ranges so the stack resolves deterministically:
 *   Latin letters, figures & punctuation → Montserrat (brand rule, PDF p.13)
 *   Arabic script                         → Alexandria (→ Thmanyah once licensed)
 * No metric-adjusted fallback faces are generated: a `local(Arial)` fallback without a unicode-range
 * would otherwise capture Arabic glyphs before the Arabic face.
 *
 * To switch to the licensed face: add Thmanyah WOFF2 files to src/styles/fonts/ and change `src` below
 * (keep `variable`, `declarations` and `adjustFontFallback`).
 * Montserrat uses Google's latin subset range minus U+200C–U+200F so joiners/bidi marks stay in Arabic runs.
 * (next/font requires literal option values, hence the inline ranges.)
 */
export const arabicFont = localFont({
  src: [{ path: './fonts/alexandria-arabic-var.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-arabic',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0600-06FF, U+0750-077F, U+0870-0891, U+0897-08E1, U+08E3-08FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FE74, U+FE76-FEFC' }],
})

export const latinFont = localFont({
  src: [{ path: './fonts/montserrat-latin-var.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-latin',
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
  declarations: [{ prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-200B, U+2012-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' }],
})
