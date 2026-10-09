import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { ContactAside } from '@/components/sections/contact/ContactAside'
import { ContactHero } from '@/components/sections/contact/ContactHero'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/cms'
import { getPublicProductContext, parseProductParam } from '@/lib/inquiries/product-context'
import { isInquiryKind } from '@/lib/inquiries/schema'
import { buildMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).contact
  return buildMetadata({ locale, title: t.meta.title, description: t.meta.description, path: '/contact' })
}

/**
 * Contact (spec §6.8, §11; art-direction §7): conversion-first. `?type=` pre-selects the inquiry type and
 * `?product=<id>` adds product context — resolved server-side through the public gate only; unknown values
 * are ignored, never echoed.
 */
export default async function ContactPage({ params, searchParams }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const query = await searchParams
  const dict = getDictionary(locale)
  const t = dict.contact

  const typeParam = Array.isArray(query.type) ? query.type[0] : query.type
  const kind = isInquiryKind(typeParam) ? typeParam : undefined
  const productId = parseProductParam(query.product)
  const [product, settings] = await Promise.all([
    productId ? getPublicProductContext(productId, locale) : Promise.resolve(null),
    getSiteSettings(locale),
  ])

  return (
    <>
      <ContactHero
        copy={t.hero}
        crumbs={[{ label: dict.common.nav.home, href: href(locale, 'home') }, { label: dict.common.nav.contact }]}
        crumbsLabel={dict.common.a11y.breadcrumbs}
      />
      <section data-theme="warm" className="bg-surface pt-10 pb-20 text-fg md:pt-14 lg:pt-20 lg:pb-32">
        <div className="container-site grid-site gap-y-16 lg:items-start">
          <div data-theme="light" className="col-span-4 rounded-xs bg-surface px-5 py-8 text-fg sm:px-8 sm:py-10 md:col-span-8 lg:col-span-7 lg:px-12 lg:py-14">
            <InquiryForm
              id="inquiry"
              locale={locale}
              kind={kind}
              product={product ?? undefined}
              variant="full"
              sourcePath={href(locale, 'contact')}
              title={t.form.title}
              intro={t.form.intro}
            />
          </div>
          <ContactAside
            className="col-span-4 md:col-span-8 lg:sticky lg:top-28 lg:col-span-4 lg:col-start-9"
            copy={t.aside}
            channelsCopy={t.channels}
            channels={settings.channels}
            privacyHref={href(locale, 'privacy')}
          />
        </div>
      </section>
    </>
  )
}
