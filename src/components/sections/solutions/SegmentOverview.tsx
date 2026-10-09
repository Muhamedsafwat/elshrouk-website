import { Photo } from '@/components/media/Photo'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Locale } from '@/i18n/config'
import type { SegmentKey } from '@/lib/catalog-params'
import { SEGMENT_DETAIL_PHOTO } from './shared'

/** Short overview of the operation's supply needs (descriptive only), beside an arch-window detail photo. */
export function SegmentOverview({
  locale,
  segment,
  index,
  title,
  body,
}: {
  locale: Locale
  segment: SegmentKey
  index?: string
  title: string
  body: string
}) {
  return (
    <section data-theme="light" aria-labelledby="overview-title" className="section-y bg-surface text-fg">
      <div className="container-site grid grid-cols-1 items-center gap-y-14 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-6">
          <SectionHeading id="overview-title" index={index} title={title} size="lg" />
          <p data-reveal="up" className="mt-8 max-w-[56ch] text-lead text-fg-soft">
            {body}
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Photo
            id={SEGMENT_DETAIL_PHOTO[segment]}
            locale={locale}
            shape="arch"
            reveal
            quality={72}
            sizes="(min-width: 1024px) 36vw, 100vw"
            className="aspect-[5/4] w-full bg-stone-200 sm:aspect-[4/3] lg:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  )
}
