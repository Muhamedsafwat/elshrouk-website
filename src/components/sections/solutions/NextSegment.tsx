import { Photo } from '@/components/media/Photo'
import { ArrowIcon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routing'
import type { SegmentKey } from '@/lib/catalog-params'
import { SEGMENT_PHOTO } from './shared'

/** Next-segment teaser: one full-bleed photo link into the next chapter (≥55% black under white text). */
export function NextSegment({
  locale,
  next,
  index,
  name,
  latin,
  label,
}: {
  locale: Locale
  next: SegmentKey
  index: string
  name: string
  latin?: string
  label: string
}) {
  return (
    <nav aria-label={label} data-theme="dark" className="relative isolate overflow-hidden bg-ink text-fg">
      <a href={href(locale, next)} className="group block focus-visible:outline-offset-[-6px]">
        <div aria-hidden className="absolute inset-0 -z-10">
          <Photo
            id={SEGMENT_PHOTO[next]}
            locale={locale}
            decorative
            quality={72}
            sizes="100vw"
            className="absolute inset-0 transition-transform duration-[1400ms] ease-(--ease-sunrise) group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="container-site flex min-h-[52svh] flex-col justify-end gap-6 py-14 lg:min-h-[62svh] lg:py-20">
          <p className="flex items-baseline gap-3">
            <span aria-hidden className="num text-small font-semibold text-white/75">
              {index}
            </span>
            <span className="eyebrow text-fg-soft">{name}</span>
            {latin && latin !== name ? (
              <span lang="en" className="text-small text-white/70">
                {latin}
              </span>
            ) : null}
          </p>
          <p className="flex items-end justify-between gap-6">
            <span className="max-w-[14ch] text-display-xl font-extrabold text-fg">{label}</span>
            <span
              aria-hidden
              className="grid size-16 shrink-0 place-items-center rounded-full bg-vermilion text-ink transition-transform duration-500 ease-(--ease-sunrise) group-hover:scale-105 rtl:group-hover:-translate-x-2 ltr:group-hover:translate-x-2 lg:size-24"
            >
              <ArrowIcon size={30} />
            </span>
          </p>
        </div>
      </a>
    </nav>
  )
}
