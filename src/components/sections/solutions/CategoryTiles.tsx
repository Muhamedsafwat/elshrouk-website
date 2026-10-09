import { Photo } from '@/components/media/Photo'
import { CATEGORY_PHOTO, ProductCard, type ProductCardLabels } from '@/components/products/ProductCard'
import { ArrowLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowIcon, CATEGORY_ICONS } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routing'
import type { ProductCard as ProductCardData } from '@/lib/catalog'
import type { CategoryKey, SegmentKey } from '@/lib/catalog-params'
import { cn } from '@/lib/cn'
import { pad2 } from './shared'

export type CategoryTile = {
  key: CategoryKey
  name: string
  short: string
  /** Approved products in this category for this segment (exact catalogue total behind the link). */
  count: number
  /** Ready-made label: a pluralised real count when count > 0, otherwise the neutral "on inquiry" phrase. */
  status: string
}

/**
 * Data-driven category tiles for one segment: each links to the catalogue filtered by category AND
 * segment. Real counts only when > 0; otherwise a neutral availability phrase (no fake numbers).
 * Approved products for the segment follow as ProductCards — only when any exist.
 */
export function CategoryTiles({
  locale,
  segment,
  index,
  title,
  intro,
  tiles,
  products,
  labels,
}: {
  locale: Locale
  segment: SegmentKey
  index?: string
  title: string
  intro: string
  tiles: CategoryTile[]
  products: ProductCardData[]
  labels: { productsHeading: string; viewAll: string; card: ProductCardLabels }
}) {
  return (
    <section data-theme="light" aria-labelledby="categories-title" className="section-y bg-surface text-fg">
      <div className="container-site">
        <SectionHeading id="categories-title" index={index} title={title} intro={intro} size="lg" className="max-w-[60rem]" />

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-6">
          {tiles.map((tile, n) => {
            const Icon = CATEGORY_ICONS[tile.key]
            return (
              <li
                key={tile.key}
                data-reveal="up"
                className="group relative flex flex-col overflow-hidden rounded-sm bg-stone-100 transition-shadow duration-500 hover:shadow-[0_24px_60px_-32px_rgb(0_0_0/0.45)]"
              >
                <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[4/3]">
                  <Photo
                    id={CATEGORY_PHOTO[tile.key]}
                    locale={locale}
                    decorative
                    quality={72}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 46vw, 100vw"
                    className="absolute inset-0 transition-transform duration-700 ease-(--ease-sunrise) group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 lg:p-7">
                  <div className="flex items-center justify-between text-fg">
                    <Icon size={26} aria-hidden />
                    <span aria-hidden className="num text-caption font-semibold text-fg-muted">
                      {pad2(n + 1)}
                    </span>
                  </div>
                  <h3 className="mt-5 text-title font-bold text-fg">
                    <a
                      href={href(locale, 'products', { category: tile.key, segment })}
                      className="after:absolute after:inset-0 after:rounded-sm after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-(--focus) focus-visible:after:outline-solid"
                    >
                      {tile.name}
                    </a>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-small text-fg-soft">{tile.short}</p>
                  <div className="mt-auto pt-6">
                    <p className="flex items-center justify-between gap-4 border-t border-line pt-4">
                      <span className={cn('text-small', tile.count > 0 ? 'font-semibold text-fg' : 'text-fg-muted')}>
                        {tile.status}
                      </span>
                      <span
                        aria-hidden
                        className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong/25 text-fg transition-colors duration-300 group-hover:border-vermilion group-hover:bg-vermilion group-hover:text-ink"
                      >
                        <ArrowIcon size={18} />
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {products.length > 0 ? (
          <div className="mt-20 lg:mt-28">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line-strong pb-5">
              <h3 className="text-title font-bold text-fg">{labels.productsHeading}</h3>
              <ArrowLink href={href(locale, 'products', { segment })}>{labels.viewAll}</ArrowLink>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <li key={product.id}>
                  <ProductCard product={product} locale={locale} labels={labels.card} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
