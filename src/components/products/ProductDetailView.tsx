import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { InquiryForm } from '@/components/forms/InquiryForm'
import { Photo } from '@/components/media/Photo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArrowLink, ButtonLink } from '@/components/ui/Button'
import { AlertIcon, CATEGORY_ICONS, DownloadIcon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import type { getDictionary } from '@/i18n/dictionaries'
import { interpolate } from '@/i18n/format'
import { absoluteUrl, href, productHref } from '@/i18n/routing'
import type { ProductCard as ProductCardData, ProductDetail } from '@/lib/catalog'
import { catalogHref } from '@/lib/catalog-params'
import { ProductViewTracker } from './CatalogTracker'
import { CATEGORY_PHOTO, ProductCard } from './ProductCard'
import { ProductGallery } from './ProductGallery'
import { ProductInquiryProvider, ProductInquiryTrigger } from './ProductInquiry'
import { ProductInquiryBand } from './ProductInquiryBand'

const order = (i: number) => ({ '--i': i }) as CSSProperties

export const toAbsoluteUrl = (url: string) => (/^https?:\/\//.test(url) ? url : absoluteUrl(url))
const toAbsolute = toAbsoluteUrl

/**
 * Product detail presentation (spec §6.5; art direction §7 "Product detail"): clean two columns
 * (facts at the start, gallery or the category's editorial visual at the end), approved fields only,
 * veterinary safety note, approved label PDF, inquiry drawer, related products, JSON-LD Product only
 * for public approved records. The route loads the data and decides draft preview.
 */
export function ProductDetailView({
  locale,
  dict,
  product,
  related,
  isDraft,
}: {
  locale: Locale
  dict: ReturnType<typeof getDictionary>
  product: ProductDetail
  related: ProductCardData[]
  isDraft: boolean
}) {
  const t = dict.products.detail
  const c = dict.products.catalog
  const category = product.category
  const CategoryIcon = category ? CATEGORY_ICONS[category.key] : null
  const isVeterinary = category?.key === 'medicines' || category?.key === 'vaccines' || category?.key === 'supplements'
  const safetyText = product.safetyText || (isVeterinary ? dict.common.vetSafetyNote : undefined)
  const listSeparator = locale === 'ar' ? '، ' : ', '
  const contactHref = href(locale, 'contact', { type: 'product' })

  const facts: { label: string; value: ReactNode }[] = []
  if (category) {
    facts.push({
      label: t.category,
      value: (
        <Link href={catalogHref(locale, {}, { category: category.key })} className="link-sweep">
          {category.name}
        </Link>
      ),
    })
  }
  if (product.segments.length > 0) {
    facts.push({
      label: t.segments,
      value: product.segments.map((s, i) => (
        <span key={s.key}>
          {i > 0 ? listSeparator : null}
          <Link href={catalogHref(locale, {}, { segment: s.key })} className="link-sweep">
            {s.name}
          </Link>
        </span>
      )),
    })
  }
  facts.push({ label: t.targetSpecies, value: t.targetSpeciesValue })
  if (product.manufacturer) facts.push({ label: t.manufacturer, value: product.manufacturer })
  if (product.form) facts.push({ label: t.form, value: product.form })
  if (product.packSize) facts.push({ label: t.packSize, value: product.packSize })
  if (product.sku) facts.push({ label: t.sku, value: <bdi className="num">{product.sku}</bdi> })
  facts.push({ label: t.availabilityLabel, value: c.availability[product.availability] })

  const jsonLd = product.isPublic
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        ...(product.nameAlt ? { alternateName: product.nameAlt } : {}),
        url: absoluteUrl(productHref(locale, product.slug)),
        ...(category ? { category: category.name } : {}),
        ...(product.manufacturer ? { brand: { '@type': 'Brand', name: product.manufacturer } } : {}),
        ...(product.gallery.length > 0 ? { image: product.gallery.map((img) => toAbsolute(img.url)) } : {}),
      }
    : null

  const inquiryLabels = {
    title: dict.products.drawer.title,
    close: dict.products.drawer.close,
    titleFor: dict.products.drawer.titleFor,
    intro: dict.products.drawer.intro,
  }
  const trigger = (size: 'md' | 'lg', className?: string) => (
    <ProductInquiryTrigger
      productId={product.id}
      label={c.card.inquire}
      fallbackHref={contactHref}
      variant="primary"
      size={size}
      className={className}
    />
  )

  return (
    <>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <ProductViewTracker slug={product.slug} category={category?.key} />

      {isDraft ? (
        <div data-theme="dark" className="bg-surface text-fg">
          <div className="container-site flex flex-wrap items-center gap-x-4 gap-y-2 py-3 text-small">
            <span className="rounded-full bg-vermilion px-3 py-1 font-bold text-ink">{t.draftLabel}</span>
            <span>{t.draftBanner}</span>
            <span className="text-fg-muted">
              {interpolate(t.draftStatus, { status: '' })}
              <bdi className="num">{product.approvalStatus}</bdi>
            </span>
          </div>
        </div>
      ) : null}

      <ProductInquiryProvider
        source="detail"
        products={[{ id: product.id, slug: product.slug, name: product.name, category }]}
        forms={{
          [String(product.id)]: (
            <InquiryForm
              locale={locale}
              kind="product"
              lockKind
              product={{ id: product.id, label: product.name }}
              productCategory={category?.key}
              variant="compact"
              sourcePath={productHref(locale, product.slug)}
            />
          ),
        }}
        labels={inquiryLabels}
      >
        <section data-theme="light" className="bg-surface text-fg">
          <div className="container-site pt-8 pb-20 sm:pt-10 lg:pt-14 lg:pb-28">
            <Breadcrumbs
              label={dict.common.a11y.breadcrumbs}
              items={[
                { label: dict.common.breadcrumbs.home, href: href(locale, 'home') },
                { label: dict.common.nav.products, href: href(locale, 'products') },
                { label: product.name, href: productHref(locale, product.slug) },
              ]}
            />

            <div className="grid-site mt-10 gap-y-10 lg:mt-14 lg:grid-rows-[auto_1fr]">
              <header className="col-span-full lg:col-span-5 lg:col-start-1 lg:row-start-1">
                {category ? (
                  <p className="intro-fade inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-caption font-semibold text-fg" style={order(0)}>
                    {CategoryIcon ? <CategoryIcon size={16} /> : null}
                    {category.name}
                  </p>
                ) : null}
                <h1 className="mt-5 text-display-lg font-bold text-balance">
                  <span className="mask-line intro-line" style={order(0)}>
                    <span>{product.name}</span>
                  </span>
                </h1>
                {product.nameAlt ? (
                  <p className="intro-fade mt-3 text-lead text-fg-muted" style={order(1)} lang={locale === 'ar' ? 'en' : 'ar'} dir="auto">
                    {product.nameAlt}
                  </p>
                ) : null}
              </header>

              <div className="col-span-full lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1">
                <div className="lg:sticky lg:top-28">
                  {product.gallery.length > 0 ? (
                    <ProductGallery
                      images={product.gallery}
                      name={product.name}
                      labels={{ galleryLabel: t.galleryLabel, showImage: t.showImage }}
                    />
                  ) : category ? (
                    <figure>
                      <Photo
                        id={CATEGORY_PHOTO[category.key]}
                        locale={locale}
                        shape="arch"
                        sizes="(min-width: 1024px) 46vw, 100vw"
                        className="intro-mask aspect-[4/5] w-full"
                        imgClassName="intro-zoom"
                        priority
                        decorative
                      />
                      <figcaption className="mt-4 text-caption text-fg-muted">
                        {interpolate(t.illustrativeNote, { category: category.name })}
                      </figcaption>
                    </figure>
                  ) : null}
                </div>
              </div>

              <div className="col-span-full lg:col-span-5 lg:col-start-1 lg:row-start-2">
                <div className="intro-fade flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={order(2)}>
                  {trigger('lg', 'w-full sm:w-auto')}
                  {product.labelPdf ? (
                    <a
                      href={product.labelPdf.url}
                      download={product.labelPdf.filename || true}
                      type="application/pdf"
                      className="inline-flex h-15 items-center justify-center gap-3 rounded-xs border-[1.5px] border-current px-8 font-semibold text-fg transition-colors hover:bg-fg hover:text-surface"
                    >
                      <DownloadIcon size={20} />
                      {t.downloadLabel}
                    </a>
                  ) : null}
                </div>

                <h2 className="sr-only">{t.factsTitle}</h2>
                <dl className="mt-10 border-t border-line">
                  {facts.map((fact) => (
                    <div key={fact.label} className="grid grid-cols-[minmax(7.5rem,38%)_1fr] gap-4 border-b border-line py-4">
                      <dt className="text-small text-fg-muted">{fact.label}</dt>
                      <dd className="font-semibold text-fg">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                {safetyText ? (
                  <div role="note" className="mt-8 flex gap-4 rounded-md bg-stone-100 p-5 sm:p-6">
                    <AlertIcon size={22} className="mt-0.5 shrink-0 text-fg" />
                    <div>
                      <p className="font-bold text-fg">{t.safetyTitle}</p>
                      <p className="mt-1 text-small text-fg-soft whitespace-pre-line">{safetyText}</p>
                    </div>
                  </div>
                ) : null}
                <p className="mt-6 text-caption text-fg-muted">{t.infoNote}</p>
              </div>
            </div>
          </div>
        </section>

        {product.description || product.warnings ? (
          <section data-theme="light" className="bg-surface text-fg">
            <div className="container-site">
              <div className="flex flex-col gap-14 border-t border-line pt-14 pb-20 lg:pt-20 lg:pb-28">
                {product.description ? (
                  <div className="grid-site gap-y-4" data-reveal="up" suppressHydrationWarning>
                    <h2 className="col-span-full text-title font-bold lg:col-span-4">{t.description}</h2>
                    <p className="measure col-span-full text-lead text-fg-soft whitespace-pre-line lg:col-span-7 lg:col-start-6">
                      {product.description}
                    </p>
                  </div>
                ) : null}
                {product.warnings ? (
                  <div className="grid-site gap-y-4" data-reveal="up" suppressHydrationWarning>
                    <h2 className="col-span-full text-title font-bold lg:col-span-4">{t.warnings}</h2>
                    <p className="measure col-span-full border-s-2 border-vermilion ps-6 text-fg-soft whitespace-pre-line lg:col-span-7 lg:col-start-6">
                      {product.warnings}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section data-theme="warm" className="bg-surface text-fg" aria-labelledby="related-products-title">
            <div className="container-site section-y-tight">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <h2 id="related-products-title" className="text-display-md font-bold" data-reveal="up" suppressHydrationWarning>
                  {t.related}
                </h2>
                <ArrowLink href={href(locale, 'products')}>{t.backToCatalog}</ArrowLink>
              </div>
              <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <li key={item.id} className="flex" data-reveal="up" suppressHydrationWarning>
                    <ProductCard
                      className="w-full"
                      product={item}
                      locale={locale}
                      labels={{ details: c.card.details, availability: c.availability }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <ProductInquiryBand
          title={t.inquireTitle}
          body={t.inquireBody}
          actions={
            <>
              {trigger('lg')}
              <ButtonLink href={href(locale, 'products')} variant="outline" size="lg" className="text-paper">
                {t.backToCatalog}
              </ButtonLink>
            </>
          }
        />
      </ProductInquiryProvider>
    </>
  )
}
