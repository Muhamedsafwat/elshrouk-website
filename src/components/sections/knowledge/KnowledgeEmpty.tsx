import { CrestPattern } from '@/components/brand/CrestPattern'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'

/**
 * Honest empty state (spec §6.7): no placeholder articles, no invented dates. The crest pattern fills an
 * arch window — the sun on the horizon — beside the copy, never behind it.
 */
export function KnowledgeEmpty({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.knowledge.hub
  return (
    <section id="articles" aria-labelledby="articles-empty-title" className="section-y scroll-mt-24">
      <div className="container-site grid-site items-center gap-y-14">
        <div className="col-span-full md:col-span-5 lg:col-span-6 xl:col-span-5">
          <p className="eyebrow" data-reveal="fade">
            {t.articlesEyebrow}
          </p>
          <h2 id="articles-empty-title" className="mt-6 text-display-md font-bold text-balance text-fg" data-reveal="up">
            {t.empty.title}
          </h2>
          <p className="mt-6 max-w-lg text-lead text-fg-soft" data-reveal="up">
            {t.empty.body}
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8" data-reveal="up">
            <ButtonLink href={href(locale, 'contact', { type: 'general' })} size="lg" className="justify-center">
              {t.empty.cta}
            </ButtonLink>
            <ArrowLink href={href(locale, 'products')}>{dict.common.cta.browseProducts}</ArrowLink>
          </div>
        </div>
        <div aria-hidden className="col-span-full md:col-span-3 md:col-start-6 lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
          {/* The arch rises from a horizon hairline: the sunrise, with the crest as its texture. */}
          <div className="border-b border-ink">
            <div className="relative mx-auto aspect-[4/5] w-3/5 max-w-[15rem] overflow-hidden rounded-t-full bg-stone-100 md:w-4/5 md:max-w-none" data-reveal="image">
              <CrestPattern opacity={0.18} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
