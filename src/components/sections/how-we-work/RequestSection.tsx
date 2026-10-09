import type { Locale } from '@/i18n/config'
import type { HowWeWorkDictionary } from '@/i18n/dictionaries/ar/howWeWork'
import { CrestPattern } from '@/components/brand/CrestPattern'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { TextReveal } from '@/components/motion/TextReveal'

type Props = {
  locale: Locale
  copy: HowWeWorkDictionary['form']
  /** Path of this page, stored with the inquiry (e.g. "/ar/how-we-work"). */
  sourcePath: string
}

/** Compact farm inquiry: sticky heading + crest-pattern aside (empty area) beside the shared InquiryForm. */
export function RequestSection({ locale, copy, sourcePath }: Props) {
  return (
    <section aria-labelledby="request-title" data-theme="light" className="section-y bg-surface text-fg">
      <div className="container-site grid-site gap-y-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <TextReveal as="h2" id="request-title" lines={[copy.title]} className="text-display-lg font-bold" />
            <p data-reveal="up" className="measure-narrow mt-6 text-lead text-fg-soft">
              {copy.intro}
            </p>
            <div aria-hidden className="relative mt-14 hidden aspect-[5/3] overflow-hidden bg-stone-100 lg:block">
              <CrestPattern className="absolute inset-0" opacity={0.16} />
            </div>
          </div>
        </div>
        <div className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-7">
          <InquiryForm locale={locale} kind="farm" variant="compact" sourcePath={sourcePath} id="request" />
        </div>
      </div>
    </section>
  )
}
