import { CrestPattern } from '@/components/brand/CrestPattern'
import { ButtonLink } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'

/**
 * The designed, localized 404 (spec §6.10). Rendered by the `[locale]/not-found.tsx` boundary and by the
 * `[locale]/page-not-found` route that the proxy rewrites unknown paths to (server-rendered, status 404).
 */
export function NotFoundView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).common.notFound
  return (
    <section aria-labelledby="not-found-title" className="relative overflow-hidden">
      <div className="container-site grid-site min-h-[72svh] content-center items-center gap-y-12 py-20 sm:py-28 lg:py-36">
        {/* Giant Montserrat numerals; the zero is a sun disc filled with the crest pattern (empty area, no text behind).
            The column is a size container: the numerals are capped at 40cqi (≈ 2.2em wide → ≤ 90% of the column),
            so they never spill past the viewport edge at lg, where the column is only half the page (VQA-03). */}
        <div aria-hidden className="@container col-span-full lg:order-last lg:col-span-6 lg:col-start-7" data-reveal="fade">
          <div
            dir="ltr"
            className="flex items-center justify-center gap-[0.04em] font-num text-[length:min(clamp(7.5rem,3rem+20vw,19rem),40cqi)] leading-none font-bold tracking-[-0.06em] text-fg select-none lg:justify-end"
          >
            <span>4</span>
            <span className="relative mx-[0.03em] inline-block size-[0.72em] shrink-0 overflow-hidden rounded-full ring-[0.035em] ring-ink ring-inset">
              <CrestPattern opacity={0.2} />
            </span>
            <span>4</span>
          </div>
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
