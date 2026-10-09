import type { Metadata } from 'next'
import { CrestPattern } from '@/components/brand/CrestPattern'
import { LocalePick } from '@/components/content/LocalePick'
import { ButtonLink } from '@/components/ui/Button'
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'

/**
 * Next passes the segment params to a not-found boundary's metadata; fall back to Arabic if it ever does not.
 * Next also injects `robots: noindex` for every 404 response — set explicitly here as well.
 */
export async function generateMetadata(props: { params?: Promise<{ locale?: string }> }): Promise<Metadata> {
  const params = props?.params ? await props.params : undefined
  const locale: Locale = isLocale(params?.locale) ? params.locale : 'ar'
  const t = getDictionary(locale).common.notFound.meta
  return { title: t.title, description: t.description, robots: { index: false, follow: true } }
}

function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).common.notFound
  return (
    <section aria-labelledby="not-found-title" className="relative overflow-hidden">
      <div className="container-site grid-site min-h-[72svh] content-center items-center gap-y-12 py-20 sm:py-28 lg:py-36">
        {/* Giant Montserrat numerals; the zero is a sun disc filled with the crest pattern (empty area, no text behind). */}
        <div
          aria-hidden
          dir="ltr"
          className="col-span-full flex items-center justify-center gap-[0.04em] font-num text-[clamp(7.5rem,3rem+20vw,19rem)] leading-none font-bold tracking-[-0.06em] text-fg select-none lg:order-last lg:col-span-6 lg:col-start-7 lg:justify-end"
          data-reveal="fade"
        >
          <span>4</span>
          <span className="relative mx-[0.03em] inline-block size-[0.72em] shrink-0 overflow-hidden rounded-full ring-[0.035em] ring-ink ring-inset">
            <CrestPattern opacity={0.2} />
          </span>
          <span>4</span>
        </div>

        <div className="col-span-full lg:col-span-6">
          <p className="sr-only">{t.eyebrow}</p>
          <h1 id="not-found-title" className="text-display-lg font-bold text-balance text-fg" data-reveal="up">
            {t.title}
          </h1>
          <p className="mt-6 max-w-lg text-lead text-fg-soft" data-reveal="up">
            {t.body}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-reveal="up">
            <ButtonLink href={href(locale, 'home')} size="lg" className="justify-center">
              {t.primary}
            </ButtonLink>
            <ButtonLink href={href(locale, 'products')} size="lg" variant="outline" arrow={false} className="justify-center">
              {t.secondary}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Designed, localized 404 for every unknown path under a locale (spec §6.10). */
export default function NotFound() {
  return <LocalePick ar={<NotFoundView locale="ar" />} en={<NotFoundView locale="en" />} />
}
