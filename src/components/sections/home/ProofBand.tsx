import { FlowUnderline } from '@/components/brand/FlowUnderline'
import { MetricCounter } from '@/components/motion/MetricCounter'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Metric } from '@/lib/content'

/**
 * Scene 2 — Trust proof 300 / 15M / 150 (spec §5, signature moment 2 "Farm Network Stats").
 * Exact approved statements; the qualifier is visible from the first frame; each figure rolls once on
 * entry (odometer, never a count from zero); screen readers get one stable sentence per figure.
 */
export function ProofBand({
  copy,
  metrics,
  footnote,
}: {
  copy: { eyebrow: string; title: string }
  metrics: Metric[]
  footnote: string
}) {
  return (
    <section id="proof" data-theme="dark" className="relative overflow-hidden" aria-labelledby="proof-title">
      <div className="container-site section-y">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="proof-title" eyebrow={copy.eyebrow} title={copy.title} size="md" className="max-w-3xl" />
          <p className="max-w-xs text-small text-fg-muted lg:text-end" data-reveal="fade">
            {footnote}
          </p>
        </div>

        <ul className="mt-16 grid border-t border-line lg:mt-24 lg:grid-cols-3">
          {metrics.map((m, i) => (
            <li
              key={m.key}
              className="relative border-b border-line py-10 last:border-b-0 lg:border-b-0 lg:border-s lg:px-10 lg:pt-12 lg:pb-4 lg:first:border-s-0 lg:first:ps-0"
              data-reveal="up"
            >
              <p className="sr-only">{m.srLabel}</p>
              <div aria-hidden>
                <span className="text-[1.375rem] leading-none font-bold text-vermilion">{m.qualifier}</span>
                <div className="mt-4 flex items-end gap-3">
                  <MetricCounter value={m.value} delay={i * 0.12} className="text-stat font-extrabold tracking-[-0.045em] text-fg" />
                  {m.unit ? <span className="pb-[0.15em] text-display-md leading-none font-bold text-fg">{m.unit}</span> : null}
                </div>
                <FlowUnderline destination={i === metrics.length - 1} className="mt-8" delay={0.2 + i * 0.12} />
                <p className="mt-6 max-w-[26ch] text-lead text-fg-soft">{m.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
