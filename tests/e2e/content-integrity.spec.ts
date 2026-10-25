import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

/**
 * Content-integrity regression over the RENDERED site (AGENTS.md invariants, .agents/skills/poultry-content-integrity,
 * spec §16/§17 reject list). Runs against whichever server E2E_BASE_URL points at — the fixture build (:3200) or the
 * dev server (:3100). Environment-dependent expectations (demo banner, English review notice, product pages) are
 * derived from the public APIs, so the same file is valid on both. Evidence: docs/evidence/content-integrity.md.
 * Tests named "CI-xx" encode a finding from that document.
 */

const ROUTES = [
  '',
  '/about',
  '/poultry-solutions',
  '/solutions/broilers',
  '/solutions/layers',
  '/solutions/breeders',
  '/products',
  '/how-we-work',
  '/knowledge',
  '/contact',
  '/partner-with-us',
  '/privacy',
  '/this-page-does-not-exist',
] as const

const SAFETY = {
  ar: 'تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.',
  en: 'Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
} as const
const DEMO_BANNER = {
  ar: 'بيئة تجريبية: البيانات المعروضة هنا بيانات اختبار، وليست منتجات حقيقية.',
  en: 'Staging environment: the data shown here is test data, not real products.',
} as const
const EN_NOTICE = 'English version — editorial review pending'

/** Pages whose main content discusses veterinary products and must carry the exact safety sentence. */
const VET_PAGES = ['', '/poultry-solutions', '/solutions/broilers', '/solutions/layers', '/solutions/breeders', '/how-we-work']

const AR_WORD = (words: string) => new RegExp(`(?<![\\u0600-\\u06FF])(?:${words})(?![\\u0600-\\u06FF])`, 'u')
const BANNED: Record<string, RegExp[]> = {
  'non-poultry animals': [
    /\b(cows?|cattle|calf|calves|bovine|sheep|lambs?|goats?|horses?|equine|camels?|dairy|livestock|herds?|pets?|cats?|dogs?|swine|pigs?|turkeys?|ducks?|quails?|rabbits?|ruminants?)\b/i,
    AR_WORD('أبقار|بقرة|البقر|ماشية|مواشي|المواشي|أغنام|خراف|ماعز|خيول|عجول|ألبان|جاموس|قطط|كلاب|رومي|بط|البط|سمان|السمان|أرانب|مجترات'),
    /حيوانات أليفة/u,
  ],
  'manufacturer claim': [/نصنع|ننتج|مصنعنا|مصانعنا|تصنيعنا/u, /\bwe (manufacture|produce)\b|\bour (factory|factories|plant|formula)\b/i],
  'unverified operations / certification / SLA': [
    /\bISO ?\d|\bGMP\b|\bGSP\b|HACCP|certif|accredit|cold[- ]chain|\bfleet\b|warehouse|within \d+ (hours?|days?)|same[- ]day|guarantee|world[- ]class|(market|industry|world)[- ]leading|revolutionary|unmatched/i,
    /سلسلة التبريد|أسطول|مستودع|مخازن|خلال [0-9]+ ?(ساعة|ساعات|يوم|أيام)|نضمن|مضمون|الأفضل|الأول في/u,
  ],
  // "Our partners" / «شركاؤنا» are allowed since the client supplied the partner list (2026-10-25, src/content/partners.ts).
  'testimonials / partner proof': [/testimonial|trusted by|clients include|award/i, /قالوا عنا|آراء العملاء|جائزة|جوائز/u],
  'placeholder / unresolved string': [/lorem|ipsum|\bTODO\b|\bTBD\b|FIXME|\bundefined\b|\bNaN\b|\[object |\{\{\s*\w+\s*\}\}|\{[a-zA-Z]+\}|coming soon/i, AR_WORD('قريبًا|قريبا')],
  'Arabic-Indic digits': [/[٠-٩۰-۹]/u],
}

const METRIC_STATEMENTS = {
  ar: [
    /حوالي\s*300\s*مزرعة دواجن نتعامل معها بشكل مستمر/gu,
    /حوالي\s*15\s*مليون\s*طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها/gu,
    /حوالي\s*150\s*منتجًا نوزعه من الأدوية واللقاحات البيطرية/gu,
  ],
  en: [
    /(?:~|approx\.?|approximately|around)\s*300\s*poultry farms we serve on an ongoing basis/giu,
    /(?:~|approx\.?|approximately|around)\s*15\s*million\s*birds within the production capacity of the farms we serve/giu,
    /(?:~|approx\.?|approximately|around)\s*150\s*veterinary medicine and vaccine products we distribute/giu,
  ],
} as const
const BARE_FIGURES = [/(?<![\d.,])300(?![\d.,])/g, /(?<![\d.,])15\s*(?:مليون|million)/giu, /(?<![\d.,])150(?![\d.,])/g]

type Extract = { body: string; all: string; meta: string; alts: string[]; aria: string[]; jsonld: string; banners: string[]; main: string; hrefs: string[] }

async function extract(page: Page): Promise<Extract> {
  return page.evaluate(() => {
    const all: string[] = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest('script,style,noscript,template') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    })
    while (walker.nextNode()) all.push(walker.currentNode.nodeValue ?? '')
    const meta = [...document.querySelectorAll('meta[name="description"],meta[property^="og:"],meta[name^="twitter:"]')]
      .map((m) => m.getAttribute('content') ?? '')
      .filter((v) => !/^https?:\/\//.test(v))
    return {
      body: document.body.innerText.replace(/\s+/g, ' '),
      all: all.join(' ').replace(/\s+/g, ' '),
      meta: [document.title, ...meta].join(' | '),
      alts: [...document.querySelectorAll('img')].map((i) => i.getAttribute('alt') ?? ''),
      aria: [...document.querySelectorAll('[aria-label],[title]')].map((e) => e.getAttribute('aria-label') ?? e.getAttribute('title') ?? ''),
      jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent ?? '').join(' '),
      banners: [...document.querySelectorAll('[role="note"]')].map((n) => (n as HTMLElement).innerText),
      main: (document.querySelector('main') as HTMLElement | null)?.innerText.replace(/\s+/g, ' ') ?? '',
      hrefs: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? ''),
    }
  })
}

/** Arabic text on an English page is allowed only inside an element that declares lang="ar…". */
async function arabicOutsideLangAr(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest('script,style,noscript,template') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    })
    while (walker.nextNode()) {
      const node = walker.currentNode
      if (!/[؀-ۿ]/.test(node.nodeValue ?? '')) continue
      const lang = node.parentElement?.closest('[lang]')?.getAttribute('lang') ?? ''
      if (!lang.startsWith('ar')) out.push((node.nodeValue ?? '').trim().slice(0, 80))
    }
    return out
  })
}

async function environment(request: APIRequestContext) {
  const fixtures = (await (await request.get('/api/products?where[isFixture][equals]=true&limit=1&depth=0')).json()) as { totalDocs: number }
  const settings = (await (await request.get('/api/globals/site-settings?depth=0')).json()) as {
    englishApproved?: boolean
    phone?: { verified?: boolean }
    whatsapp?: { verified?: boolean }
    email?: { verified?: boolean }
  }
  const products = (await (await request.get('/api/products?depth=1&limit=100')).json()) as { docs: { slug: string; category?: { key?: string } }[] }
  return {
    fixturesVisible: fixtures.totalDocs > 0,
    englishApproved: settings.englishApproved === true,
    anyVerifiedChannel: Boolean(settings.phone?.verified || settings.whatsapp?.verified || settings.email?.verified),
    vetProducts: products.docs.filter((p) => p.category?.key === 'medicines' || p.category?.key === 'vaccines').map((p) => p.slug),
    allProducts: products.docs.map((p) => p.slug),
  }
}

for (const locale of ['ar', 'en'] as const) {
  test.describe(`content integrity /${locale}`, () => {
    test(`every page: scope, claims, digits, placeholders, banners, metrics`, async ({ page, request }) => {
      test.setTimeout(240_000)
      const env = await environment(request)
      const routes = [...ROUTES, ...env.allProducts.map((slug) => `/products/${slug}`)]
      const problems: string[] = []
      for (const route of routes) {
        await page.goto(`/${locale}${route}`)
        await page.locator('h1').first().waitFor({ state: 'attached' }) // guard: 404s were client-rendered before the CI-03 fix
        const x = await extract(page)
        const fields: [string, string][] = [
          ['text', x.all],
          ['title/meta', x.meta],
          ['alt', x.alts.join(' | ')],
          ['aria/title', x.aria.join(' | ')],
          ['json-ld', x.jsonld],
        ]
        for (const [rule, patterns] of Object.entries(BANNED)) {
          for (const re of patterns) {
            for (const [field, value] of fields) {
              const m = re.exec(value)
              if (m) problems.push(`${locale}${route} [${field}] ${rule}: «${value.slice(Math.max(0, m.index - 40), m.index + 40)}»`)
            }
          }
        }

        // Banners: the demo ribbon exactly when fixtures are publicly visible; the English notice on /en until approved.
        const demo = x.banners.some((b) => b.includes(DEMO_BANNER[locale]))
        if (demo !== env.fixturesVisible) problems.push(`${locale}${route}: demo banner ${demo ? 'shown' : 'missing'} (fixtures visible: ${env.fixturesVisible})`)
        const notice = x.banners.some((b) => b.includes(EN_NOTICE))
        const wantNotice = locale === 'en' && !env.englishApproved
        if (notice !== wantNotice) problems.push(`${locale}${route}: English review notice ${notice ? 'shown' : 'missing'}`)

        // Metrics: every bare figure is part of an approved statement with its qualifier; 150 is never feed/supplements.
        for (const [i, bare] of BARE_FIGURES.entries()) {
          const figures = x.body.match(bare)?.length ?? 0
          const statement = METRIC_STATEMENTS[locale][i]!
          const statements = x.body.match(statement)?.length ?? 0
          if (figures !== statements) problems.push(`${locale}${route}: figure ${bare} appears ${figures}× but the approved statement only ${statements}×`)
        }
        if (/150[^.،]{0,40}(أعلاف|علف|مكملات|\bfeeds?\b|supplements?)|(\bfeeds?\b|supplements?|أعلاف|مكملات)[^.،]{0,25}150/iu.test(x.body)) {
          problems.push(`${locale}${route}: 150 attached to feed/supplements`)
        }
        // Contact data only when a verified channel exists.
        if (!env.anyVerifiedChannel) {
          const contact = x.hrefs.find((h) => /^(tel:|mailto:)|wa\.me|whatsapp\.com/.test(h)) ?? /(?:\+20|\b0)1[0125]\d{8}\b|[\w.+-]+@[\w-]+\.[a-z]{2,}/i.exec(x.body)?.[0]
          if (contact) problems.push(`${locale}${route}: contact data without a verified channel: ${contact}`)
        }
      }
      expect(problems, problems.join('\n')).toEqual([])
    })

    test('the three approved metric statements render verbatim with their qualifiers (home, about)', async ({ page }) => {
      for (const route of ['', '/about']) {
        await page.goto(`/${locale}${route}`)
        const { body } = await extract(page)
        for (const statement of METRIC_STATEMENTS[locale]) expect(body, `${locale}${route} ${statement}`).toMatch(new RegExp(statement.source, 'iu'))
      }
    })

    test('veterinary pages carry the exact safety sentence', async ({ page, request }) => {
      const env = await environment(request)
      for (const route of [...VET_PAGES, ...env.vetProducts.map((slug) => `/products/${slug}`)]) {
        await page.goto(`/${locale}${route}`)
        expect((await extract(page)).main, `${locale}${route}`).toContain(SAFETY[locale])
      }
    })

    test('CI-02: a catalogue filtered to veterinary medicines/vaccines carries the safety sentence', async ({ page }) => {
      for (const category of ['medicines', 'vaccines']) {
        await page.goto(`/${locale}/products?category=${category}`)
        expect((await extract(page)).main, `${locale}/products?category=${category}`).toContain(SAFETY[locale])
      }
    })

    test('CI-03: the 404 page is server-rendered (readable without JavaScript, with the status ribbons)', async ({ browser, request, baseURL }) => {
      const env = await environment(request)
      const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
      const page = await context.newPage()
      for (const route of ['/this-page-does-not-exist', '/products/no-such-product']) {
        const res = await page.goto(`/${locale}${route}`)
        expect(res?.status(), route).toBe(404)
        await expect(page.locator('h1'), `${locale}${route} h1 without JS`).toHaveCount(1)
        await expect(page.locator('header').first()).toBeAttached()
        const banners = await page.locator('[role="note"]').allInnerTexts()
        if (env.fixturesVisible) expect(banners.join(' '), `${locale}${route} demo banner`).toContain(DEMO_BANNER[locale])
      }
      await context.close()
    })

    if (locale === 'en') {
      test('CI-01: Arabic text on English pages is always marked lang="ar"', async ({ page, request }) => {
        const env = await environment(request)
        const problems: string[] = []
        for (const route of [...ROUTES, ...env.allProducts.map((slug) => `/products/${slug}`)]) {
          await page.goto(`/en${route}`)
          for (const t of await arabicOutsideLangAr(page)) problems.push(`/en${route}: «${t}»`)
        }
        expect(problems, problems.join('\n')).toEqual([])
      })
    }
  })
}
