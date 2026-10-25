import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const isDev = process.env.NODE_ENV !== 'production'
// `upgrade-insecure-requests` only when the configured public origin is HTTPS. On a production build served over plain
// HTTP (the local e2e server, an IP-only staging box) WebKit/Safari upgrades every asset request to https and then loads
// no CSS or JS; Chromium exempts localhost, so this only showed up in the WebKit run. HSTS can stay unconditional:
// browsers ignore it on plain-HTTP responses (RFC 6797 §8.1).
const httpsSite = /^https:\/\//.test(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '')

/**
 * Content-Security-Policy compatible with Next.js hydration (inline bootstrap scripts) and the Payload
 * admin. No third-party origins are allowed: fonts are self-hosted by next/font, images are local.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(!isDev && httpsSite ? ['upgrade-insecure-requests'] : []),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(isDev ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }]),
]

const nextConfig: NextConfig = {
  // Separate output for the isolated fixture/e2e build (NEXT_DIST_DIR=.next-e2e) so it never clobbers the real build.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Inquiry submissions are small text forms; reject anything larger early (the action also bounds input).
    serverActions: { bodySizeLimit: '64kb' },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 72, 80, 90],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [96, 160, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/brand/**' },
      { pathname: '/img/logos/**' },
      { pathname: '/_next/static/media/**' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
