import { defineConfig, devices } from '@playwright/test'

/**
 * E2E + visual evidence (spec §16).
 * Default target: a PRODUCTION build served on :3200 against the isolated fixture database
 * (data/e2e.db, seeded with `DATABASE_URL=file:./data/e2e.db pnpm seed:fixtures`), so tests never touch
 * development data and exercise the real build. Override with E2E_BASE_URL (e.g. the dev server :3100).
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3200'
const startServer = !process.env.E2E_BASE_URL

export const VIEWPORTS = [
  { name: '320', width: 320, height: 720 },
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
] as const

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'ar-EG',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /screenshots\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      testIgnore: /screenshots\.spec\.ts/,
      testMatch: /(navigation|forms|catalogue|a11y)\.spec\.ts/,
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'screenshots',
      testMatch: /screenshots\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    // Cross-engine smoke (`pnpm test:e2e:engines`; needs `playwright install webkit firefox`): routing, server-rendered
    // 404s, every route's h1 and console, locale switch, keyboard menu/dropdown, mobile dialog, 320 px overflow.
    {
      name: 'webkit',
      testMatch: /navigation\.spec\.ts/,
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile-safari',
      testMatch: /navigation\.spec\.ts/,
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'firefox',
      testMatch: /navigation\.spec\.ts/,
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: startServer
    ? {
        // Requires `pnpm seed:e2e && pnpm build:e2e` first (isolated fixture DB + separate .next-e2e output).
        command: 'pnpm start:e2e',
        url: 'http://localhost:3200/ar',
        reuseExistingServer: true,
        timeout: 180_000,
      }
    : undefined,
})
