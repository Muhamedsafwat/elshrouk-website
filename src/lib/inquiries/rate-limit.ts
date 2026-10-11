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
 * - Which client-IP header to trust is a deployment decision (INQUIRY_IP_HEADER); see clientIpFrom.
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

/** Visitors without any client-IP header share one bucket: generous instead of blocking every lead. */
export const UNKNOWN_CLIENT_RATE_RULES: readonly RateLimitRule[] = [{ limit: 60, windowMs: 10 * 60_000 }]

/**
 * Fail-safe across ALL clients (SEC-01). Applies in production while INQUIRY_IP_HEADER is unset: the per-client
 * key then comes from headers a client can forge, so rotating them must not buy unlimited submissions.
 */
export const GLOBAL_INQUIRY_RATE_RULES: readonly RateLimitRule[] = [{ limit: 30, windowMs: 10 * 60_000 }]

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
 * Client IP from proxy headers (SEC-01). Which header is trustworthy depends on the host, so the deployment pins
 * it with INQUIRY_IP_HEADER (e.g. `x-real-ip` behind nginx, `cf-connecting-ip` behind Cloudflare, `x-forwarded-for`
 * on Vercel / Netlify / Fly) and then ONLY that header is read.
 *
 * Unset, the best guess is `x-real-ip`, then `x-forwarded-for`; both can be forged by a client that reaches the
 * app directly, which is why production adds a global bucket (see createInquiryRateLimiter). `cf-connecting-ip` is
 * never trusted unless pinned: without Cloudflare in front, any client can send it.
 *
 * `x-forwarded-for` yields its RIGHT-most entry: the address the nearest proxy appended. Entries to its left
 * arrive from the client. Behind a CDN plus a load balancer, pin the CDN's client header instead.
 * No usable header → 'unknown' (one shared, more generous bucket).
 */
export function clientIpFrom(
  headers: { get(name: string): string | null },
  pinnedHeader: string | undefined = process.env.INQUIRY_IP_HEADER,
): string {
  const pinned = pinnedHeader?.trim().toLowerCase()
  const candidates = pinned ? [pinned] : ['x-real-ip', 'x-forwarded-for']
  for (const name of candidates) {
    const entries = headers.get(name)?.split(',') ?? []
    const value = (name === 'x-forwarded-for' ? entries[entries.length - 1] : entries[0])?.trim()
    if (value && value.length <= 64) return value
  }
  return 'unknown'
}

export type InquiryRateLimiter = { check(headers: { get(name: string): string | null }): RateLimitDecision }

const UNKNOWN_CLIENT_KEY = 'client:unknown'
const GLOBAL_KEY = 'global'

/**
 * The inquiry limiter: a per-client sliding window (hashed IP, or one shared bucket when no IP is known) and, in
 * production without INQUIRY_IP_HEADER, the global fail-safe on top. The per-client window is checked first, so a
 * client that is already over its own limit never spends global slots. Logs ONE warning per instance when the
 * fail-safe is active (never an IP).
 */
export function createInquiryRateLimiter({
  store = new MemoryRateLimitStore(),
  globalStore = new MemoryRateLimitStore(16),
  env = process.env,
  now = Date.now,
  warn = (message: string) => console.warn(message),
}: {
  store?: RateLimitStore
  globalStore?: RateLimitStore
  env?: { INQUIRY_IP_HEADER?: string; NODE_ENV?: string }
  now?: () => number
  warn?: (message: string) => void
} = {}): InquiryRateLimiter {
  let warned = false
  return {
    check(headers) {
      const pinned = env.INQUIRY_IP_HEADER?.trim() ?? ''
      const t = now()
      const ip = clientIpFrom(headers, pinned) // '' (never undefined): the injected env wins over process.env
      const decision =
        ip === 'unknown'
          ? store.hit(UNKNOWN_CLIENT_KEY, UNKNOWN_CLIENT_RATE_RULES, t)
          : store.hit(hashClientKey(ip), INQUIRY_RATE_RULES, t)
      if (!decision.ok || pinned || env.NODE_ENV !== 'production') return decision

      if (!warned) {
        warned = true
        warn(
          '[inquiry] INQUIRY_IP_HEADER is unset: client IPs come from headers a client can forge, so a global limit of ' +
            `${GLOBAL_INQUIRY_RATE_RULES.map((r) => `${r.limit} per ${r.windowMs / 60_000} min`).join(', ')} across all visitors ` +
            'is enforced. Set INQUIRY_IP_HEADER to the client-IP header your proxy or platform writes (e.g. x-real-ip).',
        )
      }
      const global = globalStore.hit(GLOBAL_KEY, GLOBAL_INQUIRY_RATE_RULES, t)
      return global.ok ? decision : global
    },
  }
}
