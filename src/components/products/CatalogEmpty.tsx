import Link from 'next/link'
import type { ReactNode } from 'react'
import { CrestPattern } from '@/components/brand/CrestPattern'
import { Photo } from '@/components/media/Photo'
import { ArrowIcon, CATEGORY_ICONS } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { catalogHref, type CategoryKey } from '@/lib/catalog-params'
import { cn } from '@/lib/cn'
import { CATEGORY_PHOTO } from './ProductCard'

export const CATALOG_INQUIRY_ID = 'catalog-inquiry'

export type CategoryTile = { key: CategoryKey; name: string; description: string }

/**
 * The real experience while no product is approved yet (spec §6.4 last bullet): an editorial category
 * browser + an honest message + a working inquiry form. Never placeholder products.
 * "Ask about this category" reloads with ?category=… so the form arrives pre-filled — works without JS.
 */
export function CatalogEmpty({
  locale,
  selected,
  categories,
  copy,
  form,
}: {
  locale: Locale
  selected?: CategoryKey
  categories: CategoryTile[]
  copy: {
    browserTitle: string
    browserIntro: string
    inquire: string
    selectedLabel: string
    formTitle: string
    formIntro: string
  }
  form: ReactNode
}) {
  const selectedName = categories.find((c) => c.key === selected)?.name
  return (
    <>
      <section data-theme="warm" className="bg-surface text-fg" aria-labelledby="category-browser-title">
        <div className="container-site section-y">
          <div className="grid-site items-end gap-y-6">
            <h2
              id="category-browser-title"
              className="col-span-full text-display-lg font-bold text-balance lg:col-span-6"
              data-reveal="up"
              suppressHydrationWarning
            >
              {copy.browserTitle}
            </h2>
            <p className="col-span-full text-lead text-fg-soft lg:col-span-5 lg:col-start-8" data-reveal="up" suppressHydrationWarning>
              {copy.browserIntro}
            </p>
          </div>
          <ul className="mt-14 grid items-start gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {categories.map((category, i) => {
              const Icon = CATEGORY_ICONS[category.key]
              const isSelected = category.key === selected
              return (
                <li key={category.key} className={cn(i % 2 === 1 && 'lg:mt-20')} data-reveal="up" suppressHydrationWarning>
                  <article className="group relative">
                    <div className="relative">
                      <Photo
                        id={CATEGORY_PHOTO[category.key]}
                        locale={locale}
                        sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 100vw"
                        className="aspect-[16/11] rounded-md sm:aspect-[4/5]"
                        imgClassName="transition-transform duration-700 ease-(--ease-sunrise) group-hover:scale-[1.04]"
                        decorative
                      />
                      <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-ink">
                        <span className="num text-caption font-bold">{String(i + 1).padStart(2, '0')}</span>
                        <span aria-hidden className="h-3 w-px bg-ink/25" />
                        <Icon size={18} />
                      </span>
                      {isSelected ? <span aria-hidden className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-md bg-vermilion" /> : null}
                    </div>
                    <h3 className="mt-6 text-title leading-snug font-bold">{category.name}</h3>
                    <p className="mt-3 text-fg-soft">{category.description}</p>
                    <Link
                      href={`${catalogHref(locale, {}, { category: category.key })}#${CATALOG_INQUIRY_ID}`}
                      aria-current={isSelected ? 'true' : undefined}
                      className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-fg transition-colors after:absolute after:inset-0 after:content-[''] hover:text-accent"
                    >
                      <span className="link-sweep">{copy.inquire}</span>
                      <span className="sr-only">: {category.name}</span>
                      <ArrowIcon size={18} />
                    </Link>
                  </article>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section
        id={CATALOG_INQUIRY_ID}
        data-theme="light"
        className="scroll-mt-24 bg-surface text-fg"
        aria-labelledby="catalog-inquiry-title"
      >
        <div className="container-site section-y grid-site gap-y-12">
          <div className="relative col-span-full flex flex-col lg:col-span-5">
            <h2 id="catalog-inquiry-title" className="text-display-lg font-bold text-balance" data-reveal="up" suppressHydrationWarning>
              {copy.formTitle}
            </h2>
            <p className="mt-6 max-w-md text-lead text-fg-soft" data-reveal="up" suppressHydrationWarning>
              {copy.formIntro}
            </p>
            {selectedName ? (
              <p className="mt-8 inline-flex items-center gap-3 self-start rounded-full border border-line px-4 py-2 text-small">
                <span className="text-fg-muted">{copy.selectedLabel}</span>
                <span className="font-bold text-fg">{selectedName}</span>
              </p>
            ) : null}
            <div
              aria-hidden
              className="mt-16 hidden h-80 overflow-hidden [mask-image:linear-gradient(to_bottom,black_10%,transparent)] lg:block"
            >
              <CrestPattern opacity={0.14} />
            </div>
          </div>
          <div className="col-span-full lg:col-span-6 lg:col-start-7">{form}</div>
        </div>
      </section>
    </>
  )
}
