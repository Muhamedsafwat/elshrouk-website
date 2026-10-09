import Link from 'next/link'
import { CrestPattern } from '@/components/brand/CrestPattern'
import { TextReveal } from '@/components/motion/TextReveal'
import { ProductCard } from '@/components/products/ProductCard'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowIcon, CATEGORY_ICONS } from '@/components/ui/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Locale } from '@/i18n/config'
import { getDictionary, type CommonDict } from '@/i18n/dictionaries'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { href } from '@/i18n/routing'
import type { ProductCard as ProductCardData } from '@/lib/catalog'
import { CATEGORY_KEYS } from '@/lib/catalog-params'
import { cn } from '@/lib/cn'

export type ProductPreviewProps = {
  locale: Locale
  copy: HomeDictionary['productPreview']
  products: ProductCardData[]
  categories: CommonDict['categories']
}

const MAX_CARDS = 6

/**
 * Scene 8 · Product preview (white). docs/art-direction.md §5, spec Scene 8.
 * Approved products → 4–6 real `ProductCard`s + "view all". Zero approved products (today's truth) →
 * the designed "catalogue in preparation" panel. Never renders placeholder or invented cards.
 */
export function ProductPreview({ locale, copy, products, categories }: ProductPreviewProps) {
  const items = products.slice(0, MAX_CARDS)
  return (
    <section id="product-preview" data-theme="light" aria-labelledby="product-preview-title" className="bg-surface pb-[clamp(4.5rem,2.2rem+7.6vw,11rem)] text-fg">
      <div className="container-site">
        <div aria-hidden className="mb-[clamp(3.5rem,2rem+4.8vw,7.5rem)] border-t border-line" />
        {items.length > 0 ? (
          <ProductGallery locale={locale} copy={copy} items={items} />
        ) : (
          <CataloguePending locale={locale} copy={copy} categories={categories} />
        )}
      </div>
    </section>
  )
}

function ProductGallery({ locale, copy, items }: { locale: Locale; copy: ProductPreviewProps['copy']; items: ProductCardData[] }) {
  const catalog = getDictionary(locale).products.catalog
  const labels = { details: catalog.card.details, availability: catalog.availability }
  return (
    <>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading id="product-preview-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} size="lg" />
        <div className="shrink-0" data-reveal="fade">
          <ButtonLink href={href(locale, 'products')} variant="outline">
            {copy.viewAll}
          </ButtonLink>
        </div>
      </div>
      <ul className={cn('mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2', items.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4')}>
        {items.map((product, i) => (
          <li key={product.id} data-reveal="up" data-reveal-delay={(i % 3) * 0.08}>
            <ProductCard product={product} locale={locale} labels={labels} className="h-full" />
          </li>
        ))}
      </ul>
    </>
  )
}

function CataloguePending({
  locale,
  copy,
  categories,
}: {
  locale: Locale
  copy: ProductPreviewProps['copy']
  categories: CommonDict['categories']
}) {
  return (
    <div data-theme="warm" className="relative isolate overflow-hidden bg-surface text-fg">
      {/* Crest Pattern strip: a full-height empty area at the inline-end — never behind copy (art-direction §4). */}
      <div aria-hidden className="absolute inset-y-0 end-0 hidden w-[30%] border-s border-line lg:block" data-reveal="fade">
        <CrestPattern opacity={0.16} />
      </div>

      <div className="relative px-6 py-12 md:px-12 md:py-16 lg:w-[70%] lg:px-16 lg:py-20 xl:px-20 xl:py-24">
        <div>
          <p className="eyebrow" data-reveal="fade">
            {copy.eyebrow}
          </p>
          <TextReveal
            as="h2"
            id="product-preview-title"
            lines={[copy.emptyTitle]}
            className="mt-6 max-w-[16ch] text-display-lg font-bold"
          />
          <p className="mt-6 max-w-[52ch] text-lead text-fg-soft" data-reveal="up">
            {copy.emptyBody}
          </p>
          <div className="mt-10" data-reveal="up">
            <ButtonLink
              href={href(locale, 'contact', { type: 'product' })}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {copy.emptyCta}
            </ButtonLink>
          </div>
        </div>

        <nav aria-labelledby="product-preview-categories" className="mt-12 border-t border-line pt-8 md:mt-16" data-reveal="up">
          <h3 id="product-preview-categories" className="text-small font-semibold text-fg-muted">
            {copy.categoriesLabel}
          </h3>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CATEGORY_KEYS.map((key) => {
              const Icon = CATEGORY_ICONS[key]
              return (
                <li key={key}>
                  <Link
                    href={href(locale, 'products', { category: key })}
                    className="group/chip flex h-14 items-center gap-3 rounded-full border border-line-strong/30 bg-paper ps-4 pe-5 text-small font-semibold text-ink transition-colors duration-300 ease-(--ease-soft) hover:border-ink hover:bg-ink hover:text-paper focus-visible:border-ink focus-visible:bg-ink focus-visible:text-paper"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-stone-100 text-ink transition-colors duration-300 group-hover/chip:bg-vermilion group-focus-visible/chip:bg-vermilion">
                      <Icon size={18} />
                    </span>
                    <span className="flex-1">{categories[key].name}</span>
                    <ArrowIcon
                      size={16}
                      className="shrink-0 transition-transform duration-300 ease-(--ease-sunrise) group-hover/chip:-translate-x-1 ltr:group-hover/chip:translate-x-1"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}
