import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { fallbackLangProps } from '@/components/content/fallbackLang'
import { Photo } from '@/components/media/Photo'
import { ArrowIcon, CATEGORY_ICONS } from '@/components/ui/icons'
import { Tag } from '@/components/ui/States'
import type { PhotoId } from '@/content/photos'
import type { Locale } from '@/i18n/config'
import { productHref } from '@/i18n/routing'
import type { ProductCard as ProductCardData } from '@/lib/catalog'
import type { CategoryKey } from '@/lib/catalog-params'
import { cn } from '@/lib/cn'

/** Editorial category visuals used when an approved product has no approved image — never a fake pack shot. */
export const CATEGORY_PHOTO: Record<CategoryKey, PhotoId> = {
  feed: 'categoryFeed',
  supplements: 'categorySupplements',
  medicines: 'categoryMedicines',
  vaccines: 'categoryVaccines',
}

export type ProductCardLabels = {
  details: string
  availability: Record<'inquiry_only' | 'on_request' | 'confirmed', string>
}

/**
 * Catalogue card (spec §6.4): safe, CMS-controlled fields only — no price, no stock claims.
 * `action` lets the catalogue inject its inquiry trigger (drawer); elsewhere the card links to detail.
 */
export function ProductCard({
  product,
  locale,
  labels,
  action,
  className,
}: {
  product: ProductCardData
  locale: Locale
  labels: ProductCardLabels
  action?: ReactNode
  className?: string
}) {
  const Icon = product.category ? CATEGORY_ICONS[product.category.key] : null
  const detail = productHref(locale, product.slug)
  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-md border border-line bg-paper transition-shadow hover:shadow-[0_24px_60px_-36px_rgb(0_0_0/0.45)]',
        // Keyboard focus on the (stretched) title link rings the whole card (A11Y-2). The ring sits outside
        // the border box, so the card's own overflow-hidden does not clip it.
        'has-[h3_a:focus-visible]:outline-3 has-[h3_a:focus-visible]:outline-offset-3 has-[h3_a:focus-visible]:outline-vermilion',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt || product.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 ease-(--ease-sunrise) group-hover:scale-[1.04]"
          />
        ) : product.category ? (
          <Photo
            id={CATEGORY_PHOTO[product.category.key]}
            locale={locale}
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 40vw, 100vw"
            className="absolute inset-0"
            imgClassName="transition-transform duration-700 ease-(--ease-sunrise) group-hover:scale-[1.04] saturate-[0.85]"
            decorative
          />
        ) : null}
        {product.category ? (
          <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full bg-paper/95 px-3 py-1.5 text-caption font-semibold text-ink">
            {Icon ? <Icon size={16} /> : null}
            {product.category.name}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 className="text-title leading-snug font-bold text-fg">
          <Link
            href={detail}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            {...fallbackLangProps(product.name, locale)}
          >
            {product.name}
          </Link>
        </h3>
        {product.nameAlt ? (
          <p className="text-small text-fg-muted" lang={locale === 'ar' ? 'en' : 'ar'}>
            {product.nameAlt}
          </p>
        ) : null}
        <div className="mt-1 flex flex-wrap gap-2 text-caption">
          {product.manufacturer ? <Tag>{product.manufacturer}</Tag> : null}
          {product.packSize ? (
            <Tag>
              <span {...fallbackLangProps(product.packSize, locale)}>{product.packSize}</span>
            </Tag>
          ) : null}
          {product.segments.map((s) => (
            <Tag key={s.key}>{s.name}</Tag>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line pt-4">
          <span className="text-caption font-medium text-fg-muted">{labels.availability[product.availability]}</span>
          <span className="inline-flex items-center gap-1.5 text-small font-semibold whitespace-nowrap text-fg transition-colors group-hover:text-accent">
            {labels.details}
            <ArrowIcon size={16} />
          </span>
        </div>
        {action ? <div className="relative z-10 pt-1">{action}</div> : null}
      </div>
    </article>
  )
}
