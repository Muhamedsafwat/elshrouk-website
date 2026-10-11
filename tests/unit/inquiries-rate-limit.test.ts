import { describe, expect, it } from 'vitest'
import {
  clientIpFrom,
  createInquiryRateLimiter,
  createRateLimiter,
  GLOBAL_INQUIRY_RATE_RULES,
  hashClientKey,
  INQUIRY_RATE_RULES,
  MemoryRateLimitStore,
  UNKNOWN_CLIENT_RATE_RULES,
} from '@/lib/inquiries/rate-limit'

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

  const h = (entries: Record<string, string>) => new Headers(entries)

  it('unpinned: x-real-ip, then the right-most x-forwarded-for hop; never cf-connecting-ip (SEC-01)', () => {
    // Left-hand XFF entries come from the client; the right-most one is what the nearest proxy appended.
    expect(clientIpFrom(h({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }), '')).toBe('10.0.0.1')
    expect(clientIpFrom(h({ 'x-forwarded-for': '203.0.113.7' }), '')).toBe('203.0.113.7')
    expect(clientIpFrom(h({ 'x-real-ip': '198.51.100.2', 'x-forwarded-for': '203.0.113.7' }), '')).toBe('198.51.100.2')
    expect(clientIpFrom(h({ 'cf-connecting-ip': '192.0.2.9', 'x-forwarded-for': '203.0.113.7' }), '')).toBe('203.0.113.7')
    expect(clientIpFrom(h({ 'cf-connecting-ip': '192.0.2.9' }), '')).toBe('unknown')
    expect(clientIpFrom(h({}), '')).toBe('unknown')
  })

  it('pinned (INQUIRY_IP_HEADER): ONLY that header is read', () => {
    const all = { 'cf-connecting-ip': '192.0.2.9', 'x-real-ip': '198.51.100.2', 'x-forwarded-for': '203.0.113.7' }
    expect(clientIpFrom(h(all), 'CF-Connecting-IP')).toBe('192.0.2.9')
    expect(clientIpFrom(h(all), 'x-forwarded-for')).toBe('203.0.113.7')
    expect(clientIpFrom(h({ 'x-real-ip': '198.51.100.2', 'x-forwarded-for': '203.0.113.7' }), 'cf-connecting-ip')).toBe('unknown')
  })

  it('defaults to the INQUIRY_IP_HEADER environment variable', () => {
    const previous = process.env.INQUIRY_IP_HEADER
    try {
      process.env.INQUIRY_IP_HEADER = 'cf-connecting-ip'
      expect(clientIpFrom(h({ 'cf-connecting-ip': '192.0.2.9', 'x-real-ip': '198.51.100.2' }))).toBe('192.0.2.9')
      delete process.env.INQUIRY_IP_HEADER
      expect(clientIpFrom(h({ 'cf-connecting-ip': '192.0.2.9', 'x-real-ip': '198.51.100.2' }))).toBe('198.51.100.2')
    } finally {
      if (previous === undefined) delete process.env.INQUIRY_IP_HEADER
      else process.env.INQUIRY_IP_HEADER = previous
    }
  })
})

describe('inquiry limiter: header trust and the production fail-safe (SEC-01)', () => {
  const h = (entries: Record<string, string>) => new Headers(entries)
  const rotating = (i: number) => h({ 'x-real-ip': `198.18.${i >> 8}.${i & 255}` })

  function setup(env: { INQUIRY_IP_HEADER?: string; NODE_ENV?: string }) {
    const c = clock()
    const warnings: string[] = []
    const limiter = createInquiryRateLimiter({ env, now: c.now, warn: (m) => warnings.push(m) })
    return { c, warnings, limiter }
  }

  it('production without INQUIRY_IP_HEADER: rotating forged IPs stop at 30 per 10 min across all clients', () => {
    const { c, warnings, limiter } = setup({ NODE_ENV: 'production' })
    let accepted = 0
    for (let i = 0; i < 50; i += 1) if (limiter.check(rotating(i)).ok) accepted += 1
    expect(accepted).toBe(GLOBAL_INQUIRY_RATE_RULES[0]!.limit)
    const blocked = limiter.check(rotating(999))
    expect(blocked.ok).toBe(false)
    if (!blocked.ok) expect(blocked.retryAfterMs).toBe(10 * MIN)
    // One warning per limiter instance, naming the variable — never an IP.
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toContain('INQUIRY_IP_HEADER')
    expect(warnings[0]).not.toMatch(/198\.18\./)
    c.advance(10 * MIN)
    expect(limiter.check(rotating(1000)).ok).toBe(true)
  })

  it('keeps the per-client window, which is checked first and spends no global slot when it refuses', () => {
    const { limiter } = setup({ NODE_ENV: 'production' })
    const same = h({ 'x-real-ip': '203.0.113.7' })
    for (let i = 0; i < 5; i += 1) expect(limiter.check(same).ok).toBe(true)
    for (let i = 0; i < 20; i += 1) expect(limiter.check(same).ok).toBe(false)
    // 5 global slots used by the accepted hits, none by the 20 refusals → 25 left for everyone else.
    let others = 0
    for (let i = 0; i < 40; i += 1) if (limiter.check(rotating(i)).ok) others += 1
    expect(others).toBe(25)
  })

  it('with INQUIRY_IP_HEADER pinned: only that header keys the client, and no global cap applies', () => {
    const { warnings, limiter } = setup({ NODE_ENV: 'production', INQUIRY_IP_HEADER: 'cf-connecting-ip' })
    let accepted = 0
    for (let i = 0; i < 40; i += 1) {
      if (limiter.check(h({ 'cf-connecting-ip': `192.0.${i >> 8}.${i & 255}` })).ok) accepted += 1
    }
    expect(accepted).toBe(40)
    // Forged unpinned headers do not create new buckets: all of these share the one "unknown client" bucket.
    let forged = 0
    for (let i = 0; i < 100; i += 1) if (limiter.check(rotating(i)).ok) forged += 1
    expect(forged).toBe(UNKNOWN_CLIENT_RATE_RULES[0]!.limit)
    expect(warnings).toEqual([])
  })

  it('development keeps per-client limits only (no global cap, no warning)', () => {
    const { warnings, limiter } = setup({ NODE_ENV: 'development' })
    let accepted = 0
    for (let i = 0; i < 50; i += 1) if (limiter.check(rotating(i)).ok) accepted += 1
    expect(accepted).toBe(50)
    const same = h({ 'x-real-ip': '203.0.113.7' })
    for (let i = 0; i < 5; i += 1) limiter.check(same)
    expect(limiter.check(same).ok).toBe(false)
    expect(warnings).toEqual([])
  })

  it('visitors without any IP header share the generous unknown-client bucket', () => {
    const { limiter } = setup({ NODE_ENV: 'development' })
    let accepted = 0
    for (let i = 0; i < 80; i += 1) if (limiter.check(h({})).ok) accepted += 1
    expect(accepted).toBe(UNKNOWN_CLIENT_RATE_RULES[0]!.limit)
  })
})
