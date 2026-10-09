import Link from 'next/link'
import { Photo } from '@/components/media/Photo'
import { CATEGORY_PHOTO } from '@/components/products/ProductCard'
import { ButtonLink } from '@/components/ui/Button'
import { ArrowIcon, CATEGORY_ICONS } from '@/components/ui/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { href } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import { CATEGORY_KEYS, type CategoryKey } from '@/lib/catalog-params'
import { ProductUniverseMotion } from './ProductUniverseMotion'

export type ProductUniverseProps = { locale: Locale; copy: HomeDictionary['productUniverse'] }

const isCategory = (key: string): key is CategoryKey => (CATEGORY_KEYS as readonly string[]).includes(key)

/** Asymmetric 2×2: row 1 = 7 | 5 (tall), row 2 = 5 | 7. Drift = desktop scroll offset in px (≤ 20). */
const LAYOUT = [
  { cell: 'lg:col-span-7 lg:h-[clamp(32rem,42vw,41rem)]', drift: 10, sizes: '(min-width: 1024px) 56vw, 100vw' },
  { cell: 'lg:col-span-5 lg:h-[clamp(32rem,42vw,41rem)]', drift: 20, sizes: '(min-width: 1024px) 40vw, 100vw' },
  { cell: 'lg:col-span-5 lg:h-[clamp(28rem,36vw,35rem)]', drift: 20, sizes: '(min-width: 1024px) 40vw, 100vw' },
  { cell: 'lg:col-span-7 lg:h-[clamp(28rem,36vw,35rem)]', drift: 10, sizes: '(min-width: 1024px) 56vw, 100vw' },
] as const

/**
 * Scene 5 — Product pillars (black, "noon"). Four commercial pillars as editorial panels, each one link to
 * the catalogue filtered by its category. Distributor framing comes from the copy (نوفر / نوزع / نعمل على
 * إتاحة); the photographs are category visuals, never pack shots. Desktop: text sits on the photo over a
 * ≥ 70% black gradient. Mobile: photo (4:3) with the text block beneath it, no parallax.
 */
export function ProductUniverse({ locale, copy }: ProductUniverseProps) {
  const items = copy.items.filter((item) => isCategory(item.key))

  return (
    <section
      id="product-universe"
      data-theme="dark"
      aria-labelledby="product-universe-title"
      className="relative overflow-x-clip"
    >
      <div className="container-site section-y">
        <div className="grid-site gap-y-8 lg:gap-y-10">
          <SectionHeading
            id="product-universe-title"
            eyebrow={copy.eyebrow}
            title={copy.title}
            size="lg"
            className="col-span-4 md:col-span-8 lg:col-span-10"
          />
          <div data-reveal="up" className="col-span-4 md:col-span-6 md:col-start-3 lg:col-span-5 lg:col-start-8">
            <p className="text-lead text-fg-soft">{copy.intro}</p>
            <ButtonLink href={href(locale, 'products')} variant="primary" size="lg" className="mt-8 w-full sm:w-auto">
              {copy.catalogCta}
            </ButtonLink>
          </div>
        </div>

        <ProductUniverseMotion className="mt-14 grid grid-cols-1 gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
          {items.map((item, i) => {
            const key = item.key as CategoryKey
            const Icon = CATEGORY_ICONS[key]
            const layout = LAYOUT[i % LAYOUT.length] ?? LAYOUT[0]
            return (
              <Link
                key={key}
                href={href(locale, 'products', { category: key })}
                data-pu-panel=""
                data-drift={layout.drift}
                aria-labelledby={`pu-${key}-name`}
                aria-describedby={`pu-${key}-body`}
                className={cn(
                  'group relative isolate flex flex-col overflow-hidden bg-surface-2 text-white',
                  'focus-visible:outline-offset-4',
                  layout.cell,
                )}
              >
                {/* Photo (4:3 on mobile, full-bleed panel on desktop) */}
                <div className="relative aspect-[4/3] overflow-hidden lg:absolute lg:inset-0 lg:aspect-auto">
                  <div data-pu-media="" className="absolute inset-0">
                    <Photo
                      id={CATEGORY_PHOTO[key]}
                      locale={locale}
                      decorative
                      sizes={layout.sizes}
                      className="absolute inset-0"
                      imgClassName="transition-transform duration-700 ease-(--ease-sunrise) group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                    />
                  </div>
                  <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-black/65 to-transparent" />
                  <div
                    aria-hidden
                    className="absolute inset-0 hidden bg-[linear-gradient(to_top,rgb(0_0_0/0.92)_0%,rgb(0_0_0/0.78)_30%,rgb(0_0_0/0.3)_58%,transparent_78%)] lg:block"
                  />
                </div>

                {/* Index + category icon (top) */}
                <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5 sm:p-6 xl:p-8">
                  <span className="num text-small font-semibold tracking-[0.2em] text-white">{item.index}</span>
                  <span className="grid size-12 place-items-center rounded-full border border-white/45 text-white">
                    <Icon size={22} />
                  </span>
                </div>

                {/* Copy (below the photo on mobile, on the gradient on desktop) */}
                <div className="relative z-10 flex flex-1 flex-col px-5 pt-6 pb-7 sm:px-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:p-8 xl:p-10">
                  <h3 id={`pu-${key}-name`} className="text-display-md font-bold text-white">
                    {item.name}
                  </h3>
                  <p id={`pu-${key}-body`} className="mt-3 max-w-[44ch] text-small text-white/85">
                    {item.body}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-small font-semibold text-white">
                    {item.cta}
                    <ArrowIcon
                      size={18}
                      className="transition-transform duration-300 ease-(--ease-sunrise) group-hover:-translate-x-1 group-focus-visible:-translate-x-1 ltr:group-hover:translate-x-1 ltr:group-focus-visible:translate-x-1"
                    />
                  </span>
                </div>

                {/* Vermilion rule grows along the base on hover / focus (from the start edge). */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 z-20 h-1 origin-right scale-x-0 bg-vermilion transition-transform duration-500 ease-(--ease-sunrise) group-hover:scale-x-100 group-focus-visible:scale-x-100 ltr:origin-left"
                />

                {/* Pointer-follow badge (fine pointer only; positioned in physical px by the motion layer). */}
                <span
                  aria-hidden
                  data-pu-badge=""
                  className="pointer-events-none absolute top-0 left-0 z-30 hidden size-24 flex-col items-center justify-center gap-1 rounded-full bg-paper text-caption font-bold text-ink shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)]"
                >
                  {copy.exploreBadge}
                  <ArrowIcon size={16} />
                </span>
              </Link>
            )
          })}
        </ProductUniverseMotion>
      </div>
    </section>
  )
}
