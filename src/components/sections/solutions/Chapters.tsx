import { Photo } from '@/components/media/Photo'
import { ButtonLink } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routing'
import { ChaptersScene } from './ChaptersScene'
import { SEGMENT_PHOTO, type ChapterCopy } from './shared'

/**
 * Three full-bleed cinematic chapters (broilers / layers / breeders) with a sticky progress rail on
 * desktop. The rail is a real <nav> list of anchors (works without JS); it lives in a zero-height
 * sticky strip inside the chapters wrapper, which `overflow: clip` crops so the rail never leaks
 * onto the next section. White text always sits on ≥50% black.
 */
export function Chapters({ locale, chapters, railLabel }: { locale: Locale; chapters: ChapterCopy[]; railLabel: string }) {
  return (
    <ChaptersScene className="relative overflow-clip bg-ink">
      <nav
        aria-label={railLabel}
        data-theme="dark"
        className="pointer-events-none sticky top-0 z-30 hidden h-0 lg:block"
      >
        <div className="pointer-events-auto absolute end-[clamp(1.25rem,2.4vw,2.5rem)] top-[50vh] -translate-y-1/2">
          <div className="relative">
            <span aria-hidden className="absolute end-[5px] top-3 bottom-3 w-px bg-white/25" />
            <span aria-hidden data-rail-fill className="absolute end-[5px] top-3 bottom-3 w-px origin-top bg-white" />
            <ol className="relative grid gap-8">
              {chapters.map((chapter) => (
                <li key={chapter.key}>
                  <a
                    href={`#${chapter.key}`}
                    data-rail-link={chapter.key}
                    className="group flex items-center justify-end gap-3 py-1 text-white/65 transition-colors duration-300 hover:text-white data-[active]:text-white"
                  >
                    <span className="text-small font-semibold">{chapter.name}</span>
                    <span className="num text-caption font-semibold">{chapter.index}</span>
                    <span
                      aria-hidden
                      className="relative block size-[11px] shrink-0 rounded-full border border-current bg-ink transition-[background-color,transform] duration-300 group-hover:scale-125 group-data-[active]:scale-125 group-data-[active]:bg-white"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      {chapters.map((chapter, n) => (
        <section
          key={chapter.key}
          id={chapter.key}
          data-chapter={chapter.key}
          data-theme="dark"
          aria-labelledby={`chapter-${chapter.key}`}
          className="relative isolate flex min-h-[100svh] scroll-mt-0 flex-col overflow-hidden bg-ink text-fg lg:min-h-[max(100svh,46rem)]"
        >
          <div aria-hidden className="absolute inset-0 -z-10">
            <div data-chapter-photo className="absolute inset-x-0 -inset-y-10">
              <Photo
                id={SEGMENT_PHOTO[chapter.key]}
                locale={locale}
                decorative
                quality={72}
                sizes="100vw"
                className="absolute inset-0"
              />
            </div>
            {/* ≥50% black everywhere white text can sit, deepening towards the copy (bottom/start). */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10" />
            <div className="absolute inset-0 hidden bg-linear-to-l from-black/45 to-transparent lg:block ltr:bg-linear-to-r" />
          </div>

          <div className="container-site flex w-full flex-1 flex-col justify-between gap-14 pt-14 pb-16 lg:pt-24 lg:pb-24">
            {/* Numeral on the inline END, padded clear of the sticky rail's band at that edge (desktop). */}
            <div aria-hidden className="flex justify-end lg:pe-[clamp(4.5rem,7vw,7.5rem)]">
              <p
                data-chapter-numeral
                className="num text-[clamp(7rem,2.5rem+15vw,18rem)] leading-[0.78] font-extrabold tracking-[-0.04em] text-transparent select-none [-webkit-text-stroke:1.5px_rgb(255_255_255/0.9)] lg:[-webkit-text-stroke:2px_rgb(255_255_255/0.9)]"
              >
                {chapter.index}
              </p>
            </div>

            <div className="max-w-[44rem] lg:max-w-[46%]">
              <p data-reveal="up" className="flex items-baseline gap-3 text-fg-soft">
                <span className="eyebrow text-fg-soft">{chapter.name}</span>
                {chapter.latin !== chapter.name ? (
                  <span lang="en" className="text-small font-medium text-white/70">
                    {chapter.latin}
                  </span>
                ) : null}
              </p>
              <h2
                id={`chapter-${chapter.key}`}
                data-reveal="up"
                className="mt-5 text-display-lg font-extrabold text-fg"
              >
                {chapter.title}
              </h2>
              <p data-reveal="up" data-reveal-delay="0.08" className="mt-6 max-w-[52ch] text-lead text-fg-soft">
                {chapter.body}
              </p>
              <div data-reveal="up" data-reveal-delay="0.16" className="mt-10">
                <ButtonLink
                  href={href(locale, chapter.key)}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {chapter.cta}
                </ButtonLink>
              </div>
            </div>
          </div>
          {n < chapters.length - 1 ? <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-white/15" /> : null}
        </section>
      ))}
    </ChaptersScene>
  )
}
