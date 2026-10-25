import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { partnerDomain, partners } from '@/content/partners'

describe('partners registry (header menu + home section)', () => {
  it('has unique names, https links and logo files that exist in an allowed image folder', () => {
    expect(partners.length).toBeGreaterThan(0)
    expect(new Set(partners.map((p) => p.name)).size).toBe(partners.length)
    for (const p of partners) {
      expect(new URL(p.link).protocol, p.name).toBe('https:')
      // next.config.ts images.localPatterns only allows /img/logos/** for these files.
      expect(p.icon, p.name).toMatch(/^\/img\/logos\/[^/]+\.(png|svg|webp|jpg)$/)
      expect(existsSync(path.join(process.cwd(), 'public', p.icon)), p.icon).toBe(true)
    }
  })

  it('shows the bare domain', () => {
    expect(partnerDomain('https://www.betrakimya.com/urunler')).toBe('betrakimya.com')
    expect(partnerDomain('https://nftitalia.com/en/products/')).toBe('nftitalia.com')
  })
})
