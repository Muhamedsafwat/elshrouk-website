import { SunriseCurve } from '@/components/brand/SunriseCurve'
import { TextReveal } from '@/components/motion/TextReveal'
import { cn } from '@/lib/cn'
import { ButtonLink } from './Button'

type Action = { label: string; href: string }

/**
 * Closing call-to-action for interior pages: black field, large display line, one Signature Curve group.
 * The curve lives in its OWN zone so it never runs under copy or buttons (brand rule):
 *  - ≥ lg: copy in the start 7 columns; the curve sits in the end-side lower corner, cropped off the edge;
 *  - < lg: the curve gets a reserved band beneath the full-width actions.
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
      <div className="container-site section-y grid-site relative z-10">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <TextReveal as="h2" lines={lines} className="text-display-xl font-bold" />
          {body ? (
            <p className="mt-6 max-w-2xl text-lead text-fg-soft" data-reveal="up">
              {body}
            </p>
          ) : null}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap" data-reveal="up">
            <ButtonLink href={primary.href} variant="primary" size="lg" className="w-full sm:w-auto">
              {primary.label}
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="outline" size="lg" className="w-full text-paper sm:w-auto">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
        {curve ? (
          /* Mobile/tablet: reserved band below the actions. */
          <div aria-hidden className="pointer-events-none relative col-span-4 -mx-[clamp(1.25rem,6vw,5.5rem)] mt-12 h-40 overflow-hidden md:col-span-8 lg:hidden">
            <div className="absolute -start-[10%] -bottom-6 w-[130%]">
              <SunriseCurve lines={3} tone="dark" />
            </div>
          </div>
        ) : null}
      </div>
      {curve ? (
        /* Desktop: end-side lower corner only (never behind the start-side copy). */
        <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 hidden w-[42%] overflow-hidden lg:block">
          <div className="absolute -end-[18%] bottom-[-10%] w-[150%]">
            <SunriseCurve lines={3} tone="dark" drift={24} />
          </div>
        </div>
      ) : null}
    </section>
  )
}
