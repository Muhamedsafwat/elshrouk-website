import type { ReactNode } from 'react'
import { SunriseCurve } from '@/components/brand/SunriseCurve'

/**
 * Closing band for the catalogue and product pages: black field and one Signature Curve group in its
 * PDF orientation (never mirrored, so it always rises toward the upper right). It is confined to the
 * inline-end half on desktop and to a reserved strip below the actions on smaller screens, so it never
 * runs under text in either direction. Accepts any actions, e.g. the trigger that opens the product inquiry drawer.
 * Reveals carry suppressHydrationWarning: the catalogue streams inside its loading.tsx Suspense boundary
 * and the global reveal runtime may start before that boundary hydrates.
 */
export function ProductInquiryBand({
  title,
  body,
  actions,
}: {
  title: string
  body?: string
  actions: ReactNode
}) {
  return (
    <section data-theme="dark" className="relative isolate overflow-hidden bg-surface text-fg">
      <div
        aria-hidden
        className="pointer-events-none absolute -end-[14%] -bottom-[3%] -z-10 w-[118%] sm:-end-[8%] sm:w-[86%] lg:-end-[3%] lg:-bottom-[12%] lg:w-[min(760px,50%)]"
      >
        <SunriseCurve lines={3} tone="dark" drift={30} />
      </div>
      <div className="container-site section-y">
        <div className="lg:max-w-[48%]">
          <h2 className="text-display-xl font-bold text-balance" data-reveal="up" suppressHydrationWarning>
            {title}
          </h2>
          {body ? (
            <p className="mt-6 max-w-2xl text-lead text-fg-soft" data-reveal="up" suppressHydrationWarning>
              {body}
            </p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="up" suppressHydrationWarning>
            {actions}
          </div>
        </div>
        {/* Room for the curve under the actions where text spans the full width. */}
        <div aria-hidden className="h-[50vw] sm:h-[38vw] lg:hidden" />
      </div>
    </section>
  )
}
