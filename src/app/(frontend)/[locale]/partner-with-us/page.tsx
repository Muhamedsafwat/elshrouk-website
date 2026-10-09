import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { ArrowLink } from '@/components/ui/Button'
import { PartnerHero } from '@/components/sections/partner/PartnerHero'
import { PartnerFit, PartnerProcess, PartnerRelationships } from '@/components/sections/partner/PartnerBody'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).partner
  return buildMetadata({ locale, title: t.meta.title, description: t.meta.description, path: '/partner-with-us' })
}

/**
 * Partner with us (spec §6.9, §11.3; art-direction §7): relationship types, fit criteria, a three-step
 * process and the partner form (type locked to `partner`). No partner logos, exclusivity or reach claims.
 */
export default async function PartnerPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.partner

  return (
    <>
      <PartnerHero
        copy={t.hero}
        ctaLabel={t.form.title}
        ctaHref="#partner-form"
        crumbs={[{ label: dict.common.nav.home, href: href(locale, 'home') }, { label: t.hero.eyebrow }]}
        crumbsLabel={dict.common.a11y.breadcrumbs}
      />
      <PartnerRelationships copy={t.relationship} locale={locale} />
      <PartnerFit copy={t.fit} />
      <PartnerProcess copy={t.process} />
      <section data-theme="warm" aria-label={t.form.title} className="bg-surface pt-16 pb-20 text-fg lg:pt-24 lg:pb-32">
        <div className="container-site grid-site gap-y-12 lg:items-start">
          <div
            data-theme="light"
            className="col-span-4 rounded-xs bg-surface px-5 py-8 text-fg sm:px-8 sm:py-10 md:col-span-8 lg:col-span-8 lg:px-12 lg:py-14"
          >
            <InquiryForm
              id="partner-form"
              locale={locale}
              kind="partner"
              lockKind
              variant="full"
              sourcePath={href(locale, 'partner')}
              title={t.form.title}
              intro={t.form.intro}
            />
          </div>
          <div className="col-span-4 flex flex-col gap-3 border-t border-fg pt-6 md:col-span-6 lg:sticky lg:top-28 lg:col-span-3 lg:col-start-10">
            <p className="text-small leading-relaxed text-fg-soft">{dict.contact.aside.privacyNote}</p>
            <ArrowLink href={href(locale, 'privacy')} className="self-start text-small">
              {dict.contact.aside.privacyLink}
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  )
}
