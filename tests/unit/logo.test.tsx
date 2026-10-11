import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Logo, LOGO_MIN_WIDTH } from '@/components/brand/Logo'

/** Spec §16.1: the logo component must not stretch the artwork or introduce fake recolouring. */
const render = (el: React.ReactElement) => {
  const html = renderToStaticMarkup(el)
  const attr = (name: string) => html.match(new RegExp(`${name}="([^"]*)"`))?.[1]
  return { html, attr }
}

const OFFICIAL = {
  color: { src: '/brand/alshorouk-logo-full-color.svg', ratio: 237.145 / 255.192 },
  white: { src: '/brand/alshorouk-logo-white.svg', ratio: 85.615 / 92.319 },
  black: { src: '/brand/alshorouk-logo-black.svg', ratio: 86.372 / 92.319 },
} as const

describe('Logo (brand lockup integrity)', () => {
  it('uses only the extracted official files, at their own aspect ratio', () => {
    for (const [variant, { src, ratio }] of Object.entries(OFFICIAL)) {
      const { attr } = render(<Logo variant={variant as keyof typeof OFFICIAL} width={200} alt="الشروق" />)
      expect(attr('src')).toBe(src)
      expect(Number(attr('height')) / Number(attr('width'))).toBeCloseTo(ratio, 2)
    }
  })

  it('never renders below the 110 px brand minimum', () => {
    const { attr } = render(<Logo width={60} alt="الشروق" />)
    expect(Number(attr('width'))).toBe(LOGO_MIN_WIDTH)
  })

  it('cannot be stretched by a caller class and carries no recolouring', () => {
    const { html, attr } = render(<Logo width={140} alt="الشروق" className="h-10 w-full" />)
    expect(attr('style')).toContain('width:140px')
    expect(attr('style')).toContain('height:auto') // inline size beats the h-10 / w-full utilities
    expect(html).not.toMatch(/filter|fill=|mix-blend|opacity|hue-rotate|invert/)
  })

  it('wraps the lockup in the mandatory 15 % clear space on request', () => {
    const { html } = render(<Logo width={200} alt="الشروق" withClearSpace />)
    expect(html).toMatch(/data-logo-clearspace/)
    expect(html).toContain('padding:30px')
  })
})
