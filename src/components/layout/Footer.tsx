import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowUpIcon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import type { CommonDict } from '@/i18n/dictionaries'
import { interpolate } from '@/i18n/format'
import { href, type RouteKey } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import type { SiteSettingsView } from '@/lib/cms'
import { LocaleSwitcher } from './LocaleSwitcher'

type Props = { locale: Locale; t: CommonDict; settings: SiteSettingsView }

/**
 * Real footer (spec §5 Scene 11): official white lockup on black, navigation, segments, categories,
 * VERIFIED contact channels only (none are verified yet → the contact column invites the inquiry form),
 * language toggle, privacy, current-year copyright. No invented address, phone, email or social links.
 */
export function Footer({ locale, t, settings }: Props) {
  const year = new Date().getFullYear()
  const siteLinks: { key: RouteKey; label: string }[] = [
    { key: 'home', label: t.nav.home },
    { key: 'about', label: t.nav.about },
    { key: 'howWeWork', label: t.nav.howWeWork },
    ...(settings.showKnowledgeHub ? [{ key: 'knowledge' as RouteKey, label: t.nav.knowledge }] : []),
    { key: 'partner', label: t.footer.partner },
    { key: 'contact', label: t.nav.contact },
  ]
  const segmentLinks: { key: RouteKey; label: string }[] = [
    { key: 'solutions', label: t.solutionsMenu.overview },
    { key: 'broilers', label: t.segments.broilers.name },
    { key: 'layers', label: t.segments.layers.name },
    { key: 'breeders', label: t.segments.breeders.name },
  ]
  const categoryKeys = ['feed', 'supplements', 'medicines', 'vaccines'] as const
  const { channels } = settings

  return (
    <footer data-theme="dark" className="relative overflow-hidden">
      <div className="container-site pt-[clamp(4rem,8vw,7rem)] pb-10">
        {/* Below lg the link groups sit two per row (VQA-09) instead of one ~2-screen column. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-line pb-14 sm:gap-x-10 lg:grid-cols-12 lg:gap-8">
          <div className="col-span-2 lg:col-span-4">
            <Link href={href(locale, 'home')} aria-label={t.nav.home} className="inline-block rounded-sm">
              <Logo variant="white" width={140} alt={t.brand.logoAlt} />
            </Link>
            <p className="mt-8 max-w-sm text-lead text-fg-soft">{t.footer.statement}</p>
          </div>

          <FooterColumn title={t.footer.navTitle} className="lg:col-span-2">
            {siteLinks.map((l) => (
              <FooterLink key={l.key} href={href(locale, l.key)}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t.footer.solutionsTitle} className="lg:col-span-2">
            {segmentLinks.map((l) => (
              <FooterLink key={l.key} href={href(locale, l.key)}>
                {l.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {/* Phones: full row with the four links in a 2×2 grid; sm/md: half row beside the contact block. */}
          <FooterColumn
            title={t.footer.categoriesTitle}
            className="col-span-2 sm:col-span-1 lg:col-span-2"
            listClassName="grid grid-cols-2 gap-x-6 gap-y-1 space-y-0 sm:block sm:space-y-1"
          >
            {categoryKeys.map((key) => (
              <FooterLink key={key} href={href(locale, 'products', { category: key })}>
                {t.categories[key].name}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h2 className="text-small font-semibold text-fg-muted">{t.footer.contactTitle}</h2>
            {channels.phone || channels.email || channels.whatsapp || channels.address ? (
              <ul className="mt-5 space-y-3 text-fg-soft">
                {channels.phone ? (
                  <li>
                    <a className="link-sweep" href={`tel:${channels.phone.replace(/\s+/g, '')}`} dir="ltr">
                      {channels.phone}
                    </a>
                  </li>
                ) : null}
                {channels.whatsapp ? (
                  <li>
                    <a
                      className="link-sweep"
                      href={`https://wa.me/${channels.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                    >
                      WhatsApp
                    </a>
                  </li>
                ) : null}
                {channels.email ? (
                  <li>
                    <a className="link-sweep" href={`mailto:${channels.email}`} dir="ltr">
                      {channels.email}
                    </a>
                  </li>
                ) : null}
                {channels.address ? <li className="whitespace-pre-line">{channels.address}</li> : null}
              </ul>
            ) : (
              <p className="mt-5 text-small text-fg-soft">{t.footer.contactBody}</p>
            )}
            <ButtonLink href={href(locale, 'contact')} variant="inverse" className="mt-6">
              {t.nav.contact}
            </ButtonLink>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-6 pt-8 text-small text-fg-muted md:flex-row md:items-center md:justify-between">
          <p>
            {interpolate(t.footer.copyright, { year: '__YEAR__' })
              .split('__YEAR__')
              .flatMap((part, i, arr) => (i < arr.length - 1 ? [part, <bdi key={i} className="num">{year}</bdi>] : [part]))}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={href(locale, 'privacy')} className="link-sweep text-fg-soft hover:text-fg">
              {t.footer.privacy}
            </Link>
            <LocaleSwitcher
              locale={locale}
              short={locale === 'ar' ? t.header.language.switchToEnglish : t.header.language.switchToArabic}
              name={locale === 'ar' ? t.header.language.englishName : t.header.language.arabicName}
              label={t.header.language.label}
              className="text-fg hover:bg-paper hover:text-ink"
            />
            <a href="#top" className="group inline-flex items-center gap-2 text-fg-soft hover:text-fg">
              {t.footer.backToTop}
              <ArrowUpIcon size={16} className="transition-transform group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
        {settings.footerNotice ? <p className="mt-6 text-caption text-fg-muted">{settings.footerNotice}</p> : null}
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  className,
  listClassName,
  children,
}: {
  title: string
  className?: string
  listClassName?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <h2 className="text-small font-semibold text-fg-muted">{title}</h2>
      <ul className={cn('mt-5 space-y-1', listClassName)}>{children}</ul>
    </div>
  )
}

function FooterLink({ href: to, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={to} className="inline-flex min-h-10 items-center text-fg-soft transition-colors hover:text-fg">
        <span className="link-sweep">{children}</span>
      </Link>
    </li>
  )
}

