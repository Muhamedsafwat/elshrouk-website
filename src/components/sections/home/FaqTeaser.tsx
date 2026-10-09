import { Accordion } from '@/components/ui/Accordion'
import { ArrowLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { href } from '@/i18n/routing'
import type { FaqItem } from '@/lib/content'

export type FaqTeaserProps = { locale: Locale; copy: HomeDictionary['faq']; items: FaqItem[] }

const MAX_ITEMS = 6

/**
 * Scene 10 · FAQ (white). docs/art-direction.md §5, spec Scene 10.
 * 5/7 split: start = eyebrow, title and "ask our team" link; end = accordion of business/process
 * answers (CMS FAQs, dictionary fallback). No FAQ schema: rich-result eligibility is not met.
 */
export function FaqTeaser({ locale, copy, items }: FaqTeaserProps) {
  if (!items.length) return null
  const accordionItems = items.slice(0, MAX_ITEMS).map((item) => ({
    id: item.id,
    title: item.question,
    content: <p className="max-w-[62ch] text-body text-fg-soft">{item.answer}</p>,
  }))

  return (
    <section id="faq" data-theme="light" aria-labelledby="faq-title" className="section-y bg-surface text-fg">
      <div className="container-site grid-site gap-y-12">
        <div className="col-span-full lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading id="faq-title" eyebrow={copy.eyebrow} title={copy.title} size="lg" titleClassName="max-w-[13ch]" />
            <div className="mt-8 md:mt-10" data-reveal="fade">
              <ArrowLink href={href(locale, 'contact')} className="text-lead">
                {copy.moreCta}
              </ArrowLink>
            </div>
          </div>
        </div>
        <div className="col-span-full lg:col-span-7" data-reveal="up">
          <Accordion items={accordionItems} />
        </div>
      </div>
    </section>
  )
}
