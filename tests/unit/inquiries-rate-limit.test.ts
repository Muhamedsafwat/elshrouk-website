import { describe, expect, it } from 'vitest'
import { clientIpFrom, createRateLimiter, hashClientKey, INQUIRY_RATE_RULES, MemoryRateLimitStore } from '@/lib/inquiries/rate-limit'

const MIN = 60_000

function clock(start = 1_000_000) {
  let t = start
  return { now: () => t, advance: (ms: number) => (t += ms) }
}

describe('sliding-window rate limiter', () => {
  it('allows 5 submissions per 10 minutes, then blocks with a retry hint', () => {
    const c = clock()
    const limiter = createRateLimiter({ rules: INQUIRY_RATE_RULES, now: c.now })
    for (let i = 0; i < 5; i += 1) {
      expect(limiter.check('a').ok).toBe(true)
      c.advance(MIN)
    }
    const blocked = limiter.check('a') // t = 5 min
    expect(blocked.ok).toBe(false)
    if (!blocked.ok) expect(blocked.retryAfterMs).toBe(5 * MIN) // first hit (t=0) ages out at 10 min
  })

  it('slides: a slot frees exactly when the oldest hit leaves the window', () => {
    const c = clock()
    const limiter = createRateLimiter({ rules: [{ limit: 5, windowMs: 10 * MIN }], now: c.now })
    limiter.check('a') // t = 0
    c.advance(MIN)
    for (let i = 0; i < 4; i += 1) limiter.check('a') // t = 1 min
    c.advance(9 * MIN - 1)
    expect(limiter.check('a').ok).toBe(false) // t = 10 min − 1 ms: still 5 in the window
    c.advance(1)
    expect(limiter.check('a').ok).toBe(true) // t = 10 min: the t=0 hit left the window
    expect(limiter.check('a').ok).toBe(false) // the four t=1 min hits + this one fill it again
  })

  it('does not count rejected attempts (hammering does not extend the block)', () => {
    const c = clock()
    const limiter = createRateLimiter({ rules: [{ limit: 2, windowMs: MIN }], now: c.now })
    limiter.check('a')
    limiter.check('a')
    for (let i = 0; i < 50; i += 1) expect(limiter.check('a').ok).toBe(false)
    c.advance(MIN)
    expect(limiter.check('a').ok).toBe(true)
  })

  it('enforces the 20 per 24 hours cap across short windows', () => {
    const c = clock()
    const limiter = createRateLimiter({ rules: INQUIRY_RATE_RULES, now: c.now })
    let allowed = 0
    for (let batch = 0; batch < 6; batch += 1) {
      for (let i = 0; i < 5; i += 1) if (limiter.check('a').ok) allowed += 1
      c.advance(11 * MIN)
    }
    expect(allowed).toBe(20)
    c.advance(24 * 60 * MIN)
    expect(limiter.check('a').ok).toBe(true)
  })

  it('keeps clients independent and memory bounded', () => {
    const c = clock()
    const store = new MemoryRateLimitStore(100)
    const limiter = createRateLimiter({ rules: [{ limit: 1, windowMs: MIN }], store, now: c.now })
    expect(limiter.check('a').ok).toBe(true)
    expect(limiter.check('b').ok).toBe(true)
    expect(limiter.check('a').ok).toBe(false)
    for (let i = 0; i < 500; i += 1) limiter.check(`k${i}`)
    expect(store.size()).toBeLessThanOrEqual(100)
  })
})

describe('client key hashing and IP extraction', () => {
  it('hashes IPs with a keyed SHA-256 and never exposes the raw IP', () => {
    const key = hashClientKey('203.0.113.7', 'secret-a')
    expect(key).toMatch(/^[0-9a-f]{64}$/)
    expect(key).not.toContain('203.0.113.7')
    expect(hashClientKey('203.0.113.7', 'secret-a')).toBe(key)
    expect(hashClientKey('203.0.113.7', 'secret-b')).not.toBe(key)
    expect(hashClientKey('203.0.113.8', 'secret-a')).not.toBe(key)
  })

  it('reads the client IP from proxy headers', () => {
    const h = (entries: Record<string, string>) => new Headers(entries)
    expect(clientIpFrom(h({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }))).toBe('203.0.113.7')
    expect(clientIpFrom(h({ 'x-real-ip': '198.51.100.2', 'x-forwarded-for': '203.0.113.7' }))).toBe('198.51.100.2')
    expect(clientIpFrom(h({ 'cf-connecting-ip': '192.0.2.9', 'x-forwarded-for': '203.0.113.7' }))).toBe('192.0.2.9')
    expect(clientIpFrom(h({}))).toBe('unknown')
  })
})
