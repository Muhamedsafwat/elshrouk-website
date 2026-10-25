import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import type { NavItem } from '@/components/layout/types'
import { MotionRuntime } from '@/components/motion/MotionRuntime'
import { EditorialBanner } from '@/components/layout/EditorialBanner'
import { partnerDomain, partners } from '@/content/partners'
import { JsonLd } from '@/components/seo/JsonLd'
import { isLocale, localeDirection, locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { absoluteUrl, href } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/cms'
import { organizationJsonLd } from '@/lib/seo'
import { arabicFont, latinFont } from '@/styles/fonts'

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).common
  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: { default: t.brand.name === 'الشروق' ? 'الشروق' : 'Alshorouk', template: locale === 'ar' ? '%s | الشروق' : '%s | Alshorouk' },
    applicationName: locale === 'ar' ? 'الشروق' : 'Alshorouk',
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/manifest.webmanifest',
    formatDetection: { telephone: false, email: false, address: false },
  }
}

/**
 * Marks `html.js` before first paint (for styles that must know JS is running from the first frame, e.g. the About
 * hero's monochrome layer) and arms the fail-safe that shows everything if motion never boots. A plain inline script
 * at the top of <head> runs while the HTML is parsed; `next/script` beforeInteractive would run at bootstrap, after
 * first paint. The reveal states themselves are switched on later by MotionRuntime (`html.reveal`), after it has
 * marked first-screen content as revealed, so nothing on the first screen is ever hidden.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!window.__alsMotion){d.classList.add('motion-off')}},3500)})();`

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const dict = getDictionary(locale)
  const t = dict.common
  const settings = await getSiteSettings(locale)

  const solutionsChildren = [
    { key: 'solutions' as const, label: t.solutionsMenu.overview },
    { key: 'broilers' as const, label: t.segments.broilers.name, description: t.segments.broilers.short },
    { key: 'layers' as const, label: t.segments.layers.name, description: t.segments.layers.short },
    { key: 'breeders' as const, label: t.segments.breeders.name, description: t.segments.breeders.short },
  ]
  const items: NavItem[] = [
    { key: 'about', label: t.nav.about },
    { key: 'solutions', label: t.solutionsMenu.label, children: solutionsChildren },
    { key: 'products', label: t.nav.products },
    ...(partners.length
      ? [
          {
            kind: 'external' as const,
            id: 'partners',
            label: t.nav.partners,
            fallbackHref: href(locale, 'home', undefined, 'partners'),
            links: partners.map((p) => ({ label: p.name, href: p.link, description: partnerDomain(p.link), logo: p.icon })),
          },
        ]
      : []),
    { key: 'howWeWork', label: t.nav.howWeWork },
    ...(settings.showKnowledgeHub ? [{ key: 'knowledge' as const, label: t.nav.knowledge }] : []),
  ]

  return (
    <html lang={locale} dir={localeDirection(locale)} className={`${arabicFont.variable} ${latinFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <JsonLd data={await organizationJsonLd(locale)} />
      </head>
      <body id="top">
        <a
          href="#main"
          className="fixed start-4 top-4 z-[100] -translate-y-24 rounded-xs bg-ink px-5 py-3 font-semibold text-paper transition-transform focus-visible:translate-y-0"
        >
          {t.header.skipToContent}
        </a>
        <EditorialBanner locale={locale} t={t} />
        <Header
          locale={locale}
          items={items}
          homeItem={{ key: 'home', label: t.nav.home }}
          labels={{
            logoAlt: t.brand.logoAlt,
            homeLabel: t.nav.home,
            primaryNav: t.header.primaryNavLabel,
            openMenu: t.header.openMenu,
            closeMenu: t.header.closeMenu,
            menuLabel: t.a11y.menuDialog,
            cta: t.header.cta,
            languageLabel: t.header.language.label,
            switchLanguageShort: locale === 'ar' ? t.header.language.switchToEnglish : t.header.language.switchToArabic,
            switchLanguageName: locale === 'ar' ? t.header.language.englishName : t.header.language.arabicName,
            externalLink: t.a11y.externalLink,
          }}
        />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer locale={locale} t={t} settings={settings} />
        <MotionRuntime />
      </body>
    </html>
  )
}
