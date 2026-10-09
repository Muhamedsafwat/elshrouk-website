import { SunriseCurve } from '@/components/brand/SunriseCurve'
import { TextReveal } from '@/components/motion/TextReveal'
import { cn } from '@/lib/cn'
import { ButtonLink } from './Button'

type Action = { label: string; href: string }

/**
 * Closing call-to-action for interior pages: black field, large display line, one Signature Curve group
 * rising from the lower inline-end corner (brand: one curve group per layout).
 */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  className,
  curve = true,
}: {
  title: string | string[]
  body?: string
  primary: Action
  secondary?: Action
  className?: string
  curve?: boolean
}) {
  const lines = Array.isArray(title) ? title : [title]
  return (
    <section data-theme="dark" className={cn('relative isolate overflow-hidden', className)}>
      {curve ? (
        <div aria-hidden className="pointer-events-none absolute -end-[10%] bottom-[-12%] -z-10 w-[min(1100px,120%)] opacity-90">
          <SunriseCurve lines={3} tone="dark" drift={30} />
        </div>
      ) : null}
      <div className="container-site section-y">
        <TextReveal as="h2" lines={lines} className="max-w-4xl text-display-xl font-bold" />
        {body ? (
          <p className="mt-6 max-w-2xl text-lead text-fg-soft" data-reveal="up">
            {body}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-3" data-reveal="up">
          <ButtonLink href={primary.href} variant="accent" size="lg">
            {primary.label}
          </ButtonLink>
          {secondary ? (
            <ButtonLink href={secondary.href} variant="outline" size="lg" className="text-paper">
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}
