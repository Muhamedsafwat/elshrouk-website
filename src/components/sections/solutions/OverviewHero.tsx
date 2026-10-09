import type { CSSProperties } from 'react'
import { accent } from '@/components/motion/Accent'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArrowUpIcon, SEGMENT_ICONS } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import type { ChapterCopy } from './shared'

/** Arabic headline phrase set in vermilion (display size only). English stays monochrome. */
const ACCENT: Partial<Record<Locale, string>> = { ar: 'الدواجن' }

const i = (n: number) => ({ '--i': n }) as CSSProperties

/**
 * Poultry solutions hero (art direction §7): white, typographic, with the 01/02/03 chapter index as a
 * real list of in-page anchors. First-paint intro is pure CSS (no JS dependency).
 */
export function OverviewHero({
  locale,
  eyebrow,
  title,
  intro,
  chapters,
  indexLabel,
  breadcrumbs,
}: {
  locale: Locale
  eyebrow: string
  title: string[]
  intro: string
  chapters: ChapterCopy[]
  indexLabel: string
  breadcrumbs: { items: { label: string; href?: string }[]; label: string }
}) {
  return (
    <section data-theme="light" aria-labelledby="solutions-title" className="bg-surface text-fg">
      <div className="container-site pt-6 pb-16 lg:pt-10 lg:pb-28">
        <Breadcrumbs items={breadcrumbs.items} label={breadcrumbs.label} className="intro-fade" />

        <div className="mt-12 grid grid-cols-1 gap-y-12 lg:mt-20 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-12">
            <p className="eyebrow intro-fade" style={i(0)}>
              {eyebrow}
            </p>
            <h1 id="solutions-title" className="mt-6 text-display-2xl font-extrabold text-fg">
              {title.map((line, n) => (
                <span key={n} className="mask-line intro-line" style={i(n)}>
                  <span>{accent(line, ACCENT[locale])}</span>
                  {n < title.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>
          </div>

          <p className="intro-fade max-w-[40ch] text-lead text-fg-soft lg:col-span-5" style={i(2)}>
            {intro}
          </p>

          <nav aria-label={indexLabel} className="lg:col-span-6 lg:col-start-7">
            <ol className="border-t border-line-strong">
              {chapters.map((chapter, n) => {
                const Icon = SEGMENT_ICONS[chapter.key]
                return (
                  <li key={chapter.key} className="intro-fade border-b border-line" style={i(3 + n)}>
                    <a
                      href={`#${chapter.key}`}
                      className="group flex items-center gap-5 py-5 transition-colors sm:gap-7 lg:py-7"
                    >
                      <span className="num w-7 shrink-0 text-small font-semibold text-fg-muted">{chapter.index}</span>
                      <span className="flex min-w-0 flex-1 items-baseline gap-3">
                        <span className="text-display-md leading-none font-bold transition-transform duration-500 ease-(--ease-sunrise) rtl:group-hover:-translate-x-2 ltr:group-hover:translate-x-2">
                          {chapter.name}
                        </span>
                        {chapter.latin !== chapter.name ? (
                          <span lang="en" className="hidden text-small text-fg-muted sm:inline">
                            {chapter.latin}
                          </span>
                        ) : null}
                      </span>
                      <Icon size={26} aria-hidden className="hidden shrink-0 text-fg-muted sm:block" />
                      <span
                        aria-hidden
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong/30 transition-colors duration-300 group-hover:border-vermilion group-hover:bg-vermilion group-hover:text-ink"
                      >
                        <ArrowUpIcon size={18} className="rotate-180" />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  )
}
