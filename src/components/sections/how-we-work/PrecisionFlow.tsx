import type { HowWeWorkDictionary } from '@/i18n/dictionaries/ar/howWeWork'
import { cn } from '@/lib/cn'
import { AlertIcon } from '@/components/ui/icons'
import { FlowScene } from './FlowScene'

type Props = {
  steps: HowWeWorkDictionary['steps']
  disclaimer: string
  /** id of the heading that names the process (the page h1). */
  labelledBy: string
}

/**
 * Vertical precision-flow line (Distribution Flow grammar: one straight line, round nodes, exactly ONE
 * amber destination). The rail sits on the inline-START edge (right in Arabic) and runs top→bottom
 * through five large steps — deliberately unlike the horizontal home journey.
 * Built from per-step segments (in: top→node, out: node→bottom) so the static line is exact in pure CSS;
 * FlowScene animates those same segments on desktop.
 */
export function PrecisionFlow({ steps, disclaimer, labelledBy }: Props) {
  const last = steps.length - 1
  return (
    <section data-theme="light" className="bg-surface pb-[clamp(4.5rem,2.2rem+7.6vw,11rem)] text-fg">
      <div className="container-site">
        <FlowScene>
          <ol aria-labelledby={labelledBy} className="border-t border-line">
            {steps.map((step, n) => {
              const destination = n === last
              return (
                <li
                  key={step.index}
                  data-flow-step=""
                  className="relative ps-11 [--node-y:3.6rem] sm:ps-16 lg:ps-28 lg:[--node-y:5.25rem]"
                >
                  {n > 0 ? (
                    <span aria-hidden className="absolute start-0 top-0 h-(--node-y) w-0.5 bg-line">
                      <span data-flow-in="" className="block size-full origin-top bg-ink" />
                    </span>
                  ) : null}
                  {!destination ? (
                    <span aria-hidden className="absolute start-0 top-(--node-y) bottom-0 w-0.5 bg-line">
                      <span data-flow-out="" className="block size-full origin-top bg-ink" />
                    </span>
                  ) : null}
                  <span
                    aria-hidden
                    data-flow-node=""
                    className={cn(
                      'absolute top-(--node-y) -translate-y-1/2 rounded-full border-2 border-ink bg-paper',
                      destination ? '-start-[13px] size-7' : '-start-[7px] size-4',
                    )}
                  >
                    <span
                      data-flow-fill=""
                      className={cn('absolute rounded-full', destination ? 'inset-[3px] bg-amber' : 'inset-[2px] bg-ink')}
                    />
                  </span>

                  <div className="grid gap-y-4 border-b border-line py-10 lg:grid-cols-12 lg:gap-x-8 lg:py-16">
                    {/* Wrapper keeps the LTR-isolated numeral flush with the inline start (next to the rail). */}
                    <div aria-hidden data-reveal="up" className="lg:col-span-2">
                      <span className="num inline-block text-[clamp(2.75rem,1.4rem+3.9vw,6rem)] leading-[0.82] font-medium tracking-[-0.045em] text-fg-muted">
                        {step.index}
                      </span>
                    </div>
                    <h3 data-reveal="up" data-reveal-delay="0.06" className="text-display-md font-bold lg:col-span-5 lg:pe-6">
                      {step.title}
                    </h3>
                    <p data-reveal="up" data-reveal-delay="0.12" className="max-w-xl text-lead text-fg-soft lg:col-span-5 lg:pt-1.5">
                      {step.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </FlowScene>

        <p
          data-reveal="up"
          className="mt-10 flex max-w-3xl items-start gap-3 ps-11 text-small text-fg-muted sm:ps-16 lg:mt-14 lg:ps-28"
        >
          <AlertIcon size={18} className="mt-1 shrink-0 text-fg" />
          <span>{disclaimer}</span>
        </p>
      </div>
    </section>
  )
}
