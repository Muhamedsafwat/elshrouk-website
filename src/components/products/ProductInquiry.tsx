'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { isMostlyArabic } from '@/components/content/fallbackLang'
import { Button, ButtonLink, type ButtonSize, type ButtonVariant } from '@/components/ui/Button'
import { Drawer } from '@/components/ui/Drawer'
import { interpolate } from '@/i18n/format'
import { trackEvent } from '@/lib/analytics'
import type { CategoryKey } from '@/lib/catalog-params'
import { useHydrated } from './useHydrated'

/**
 * ProductInquiryDrawer (spec §7.2, §11.2). One drawer per page; each trigger opens it for a product
 * whose id comes from the CMS record (never from the URL). The forms are server-rendered
 * <InquiryForm kind="product" lockKind product={{ id, label }} …/> elements passed in by the page,
 * keyed by product id. Without JS every trigger is a plain link to the fallback inquiry route.
 */
export type InquiryProduct = { id: number; slug: string; name: string; category?: { key: CategoryKey; name: string } }

type InquiryContextValue = { open: (id: number) => void }
const InquiryContext = createContext<InquiryContextValue | null>(null)

export function ProductInquiryProvider({
  products,
  forms,
  labels,
  source,
  children,
}: {
  products: InquiryProduct[]
  forms: Record<string, ReactNode>
  /** titleFor: "{name}" template — the product context lives in the drawer title; the form shows its own product summary. */
  labels: { title: string; titleFor: string; close: string; intro: string }
  source: 'catalog' | 'detail'
  children: ReactNode
}) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [open, setOpen] = useState(false)

  const openFor = useCallback(
    (id: number) => {
      const product = products.find((p) => p.id === id)
      if (!product) return
      setActiveId(id)
      setOpen(true)
      trackEvent('product_inquiry_start', { slug: product.slug, category: product.category?.key, source })
    },
    [products, source],
  )
  const value = useMemo(() => ({ open: openFor }), [openFor])
  const active = products.find((p) => p.id === activeId)

  return (
    <InquiryContext.Provider value={value}>
      {children}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={active ? interpolate(labels.titleFor, { name: active.name }) : labels.title}
        closeLabel={labels.close}
      >
        {active ? (
          <div key={active.id}>
            <p className="text-small text-fg-soft">{labels.intro}</p>
            <div className="mt-6">{forms[String(active.id)]}</div>
          </div>
        ) : null}
      </Drawer>
    </InquiryContext.Provider>
  )
}

export function ProductInquiryTrigger({
  productId,
  label,
  srContext,
  fallbackHref,
  variant = 'primary',
  size = 'md',
  className,
}: {
  productId: number
  label: string
  /** Visually hidden product name so repeated triggers stay distinguishable for screen readers. */
  srContext?: string
  fallbackHref: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  const inquiry = useContext(InquiryContext)
  const hydrated = useHydrated()
  const content = (
    <>
      {label}
      {srContext ? (
        <span className="sr-only">
          {': '}
          {/* An untranslated (Arabic) product name on /en is voiced with the Arabic voice (CI-01). */}
          <span {...(isMostlyArabic(srContext) ? { lang: 'ar', dir: 'rtl' } : {})}>{srContext}</span>
        </span>
      ) : null}
    </>
  )
  if (!hydrated || !inquiry) {
    return (
      <ButtonLink href={fallbackHref} variant={variant} size={size} className={className}>
        {content}
      </ButtonLink>
    )
  }
  return (
    <Button variant={variant} size={size} className={className} arrow aria-haspopup="dialog" onClick={() => inquiry.open(productId)}>
      {content}
    </Button>
  )
}
