import { createHmac, randomBytes } from 'node:crypto'

/**
 * Per-client sliding-window rate limiter for public inquiry submissions (spec §11.4).
 *
 * - Keys are HMAC-SHA256(ip, secret) — a raw IP is never stored, logged or returned. A keyed hash is
 *   used instead of a bare SHA-256 because the IPv4 space is small enough to reverse an unkeyed hash.
 * - `MemoryRateLimitStore` is a sliding-window log held in this process. It is correct for dev, tests and
 *   a single Node instance ONLY. Multi-instance / serverless deployments must implement `RateLimitStore`
 *   on a shared store (Postgres table, Redis, platform KV) — otherwise each instance counts separately.
 *   Tracked in docs/open-items.md by the orchestrator.
 */

export type RateLimitRule = { limit: number; windowMs: number }
export type RateLimitDecision = { ok: true; remaining: number } | { ok: false; retryAfterMs: number }

export interface RateLimitStore {
  /** Records a hit for `key` when every rule allows it; never records a rejected attempt. */
  hit(key: string, rules: readonly RateLimitRule[], now: number): RateLimitDecision
}

/** 5 submissions per 10 minutes and 20 per 24 hours per client. */
export const INQUIRY_RATE_RULES: readonly RateLimitRule[] = [
  { limit: 5, windowMs: 10 * 60_000 },
  { limit: 20, windowMs: 24 * 60 * 60_000 },
]

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly hits = new Map<string, number[]>()

  constructor(private readonly maxKeys = 10_000) {}

  hit(key: string, rules: readonly RateLimitRule[], now: number): RateLimitDecision {
    const longest = Math.max(...rules.map((r) => r.windowMs))
    const log = (this.hits.get(key) ?? []).filter((t) => now - t < longest)

    let retryAfterMs = 0
    for (const rule of rules) {
      const inWindow = log.filter((t) => now - t < rule.windowMs)
      if (inWindow.length >= rule.limit) {
        // The window frees a slot when its oldest counted hit ages out.
        const oldest = inWindow[inWindow.length - rule.limit] ?? now
        retryAfterMs = Math.max(retryAfterMs, oldest + rule.windowMs - now)
      }
    }
    if (retryAfterMs > 0) {
      this.hits.set(key, log)
      return { ok: false, retryAfterMs }
    }

    log.push(now)
    this.hits.delete(key) // re-insert → Map order doubles as least-recently-used order
    this.hits.set(key, log)
    if (this.hits.size > this.maxKeys) this.evict(now, longest)
    const shortest = rules.reduce((a, b) => (b.windowMs < a.windowMs ? b : a))
    return { ok: true, remaining: shortest.limit - log.filter((t) => now - t < shortest.windowMs).length }
  }

  /** Bounded memory: drop expired logs first, then the least recently used keys. */
  private evict(now: number, longest: number) {
    for (const [key, log] of this.hits) {
      if (log.every((t) => now - t >= longest)) this.hits.delete(key)
    }
    while (this.hits.size > this.maxKeys) {
      const first = this.hits.keys().next().value
      if (first === undefined) break
      this.hits.delete(first)
    }
  }

  /** Test helper. */
  size() {
    return this.hits.size
  }
}

export function createRateLimiter({
  rules = INQUIRY_RATE_RULES,
  store = new MemoryRateLimitStore(),
  now = Date.now,
}: { rules?: readonly RateLimitRule[]; store?: RateLimitStore; now?: () => number } = {}) {
  return { check: (key: string) => store.hit(key, rules, now()) }
}

// Fallback salt when PAYLOAD_SECRET is absent (tests): random per process, so hashes are never stable on disk.
const processSalt = randomBytes(32).toString('hex')

/** Opaque, non-reversible client key. Never pass the raw IP anywhere else. */
export function hashClientKey(ip: string, secret: string = process.env.PAYLOAD_SECRET || processSalt): string {
  return createHmac('sha256', secret).update(`inquiry:${ip}`).digest('hex')
}

/**
 * Client IP from proxy headers. Which header is trustworthy depends on the host:
 *   - Vercel / Netlify / Fly / most PaaS: `x-forwarded-for` first hop is written by the platform edge.
 *   - Cloudflare in front: `cf-connecting-ip`.  nginx: configure `proxy_set_header X-Real-IP $remote_addr`.
 * Set INQUIRY_IP_HEADER to pin the header for the deployment (documented deployment open item). Unknown →
 * 'unknown' (one shared bucket; the action applies a more generous limit to it rather than blocking everyone).
 */
export function clientIpFrom(headers: { get(name: string): string | null }): string {
  const pinned = process.env.INQUIRY_IP_HEADER?.toLowerCase()
  const candidates = pinned ? [pinned] : ['cf-connecting-ip', 'x-real-ip', 'x-forwarded-for']
  for (const name of candidates) {
    const value = headers.get(name)?.split(',')[0]?.trim()
    if (value && value.length <= 64) return value
  }
  return 'unknown'
}
