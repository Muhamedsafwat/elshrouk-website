import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TextReveal } from '@/components/motion/TextReveal'
import { PrivacyToc } from '@/components/sections/privacy/PrivacyToc'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ButtonLink } from '@/components/ui/Button'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { buildMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const t = getDictionary(locale).privacy
  return buildMetadata({ locale, title: t.meta.title, description: t.meta.description, path: '/privacy' })
}

const sectionId = (i: number) => `section-${String(i + 1).padStart(2, '0')}`

/** Privacy policy — plain editorial long-form: sticky contents (desktop), numbered sections, comfortable measure. */
export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const dict = getDictionary(locale)
  const t = dict.privacy
  const c = dict.common
  const toc = t.sections.map((s, i) => ({ id: sectionId(i), title: s.title }))

  return (
    <>
      <header className="container-site pt-8 sm:pt-10">
        <Breadcrumbs
          label={c.a11y.breadcrumbs}
          items={[{ label: c.breadcrumbs.home, href: href(locale, 'home') }, { label: c.footer.privacy }]}
        />
        <div className="grid-site mt-14 gap-y-10 sm:mt-20 lg:mt-24">
          <div className="col-span-full lg:col-span-8 lg:col-start-4">
            <TextReveal as="h1" lines={[t.title]} className="text-display-xl font-bold text-fg" />
            <p className="mt-8 max-w-[62ch] text-lead text-fg-soft" data-reveal="up">
              {t.intro}
            </p>
            <p className="mt-8 max-w-[62ch] border-s-2 border-amber ps-5 text-small text-fg-soft" data-reveal="up">
              {t.statusNote}
            </p>
          </div>
        </div>
      </header>

      <div className="container-site grid-site mt-14 gap-y-10 pb-24 sm:mt-20 lg:mt-24 lg:pb-36">
        <aside className="col-span-full lg:col-span-3">
          <PrivacyToc items={toc} label={t.tocTitle} />
        </aside>

        <div className="col-span-full lg:col-span-8 lg:col-start-4 xl:col-span-7 xl:col-start-4">
          {t.sections.map((section, i) => (
            <section
              key={section.title}
              id={sectionId(i)}
              aria-labelledby={`${sectionId(i)}-title`}
              className="scroll-mt-28 border-t border-line pt-8 pb-12 first:border-t-0 first:pt-0 lg:pb-16"
            >
              <div className="flex items-baseline gap-5">
                <span aria-hidden className="num shrink-0 text-small font-semibold text-fg-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 id={`${sectionId(i)}-title`} className="text-title font-bold text-fg">
                  {section.title}
                </h2>
              </div>
              <div className="mt-5 max-w-[68ch] space-y-5 ps-0 text-body text-fg-soft sm:ps-[calc(1.25rem+2ch)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-4 rounded-md bg-stone-100 px-6 py-8 sm:px-10 sm:py-10">
            <p className="max-w-[52ch] text-lead font-medium text-fg">{t.contact.body}</p>
            <ButtonLink href={href(locale, 'contact', { type: 'general' })} className="mt-6">
              {t.contact.cta}
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  )
}
