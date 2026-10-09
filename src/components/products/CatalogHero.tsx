import type { CSSProperties, ReactNode } from 'react'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'

const order = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * Compact white catalogue hero (art direction §7 "Products"): breadcrumbs, oversized two-line title,
 * intro at the inline end, then the prominent search (or the honest catalogue status when empty).
 *
 * Uses the pure-CSS first-paint intro (`intro-line` / `intro-fade`) rather than data-reveal: this route
 * streams inside the loading.tsx Suspense boundary, and JS reveals there would touch the DOM before the
 * boundary hydrates. CSS intros start at first paint, need no JS and resolve to the final state.
 */
export function CatalogHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  children,
}: {
  eyebrow: string
  title: string[]
  intro: string
  breadcrumbs: { items: { label: string; href?: string }[]; label: string }
  children?: ReactNode
}) {
  return (
    <section data-theme="light" className="bg-surface text-fg">
      <div className="container-site pt-8 pb-12 sm:pt-10 lg:pt-14 lg:pb-16">
        <Breadcrumbs items={breadcrumbs.items} label={breadcrumbs.label} />
        <div className="grid-site mt-10 items-end gap-y-6 lg:mt-14">
          <div className="col-span-full lg:col-span-7">
            <p className="eyebrow intro-fade text-fg-muted" style={order(0)}>
              {eyebrow}
            </p>
            <h1 className="mt-4 text-display-xl font-bold text-balance">
              {title.map((line, i) => (
                <span key={i} className="mask-line intro-line" style={order(i)}>
                  <span>{line}</span>
                  {i < title.length - 1 ? ' ' : null}
                </span>
              ))}
            </h1>
          </div>
          <p className="intro-fade col-span-full text-lead text-fg-soft lg:col-span-5 lg:pb-3" style={order(1)}>
            {intro}
          </p>
        </div>
        {children ? (
          <div className="intro-fade mt-10 lg:mt-14" style={order(3)}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}
