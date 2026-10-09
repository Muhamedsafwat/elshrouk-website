import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import { FlowScene } from './FlowScene'
import { pad2 } from './shared'

/**
 * Three-step process as a Distribution Flow (art direction §4): nodes joined by a hairline that runs
 * right→left in Arabic (start→end), ending in the single amber destination node. Horizontal on
 * desktop, a vertical rail on mobile. Copy is a PROPOSED process (no SLA / timing promises).
 */
export function StepsFlow({
  id,
  index,
  title,
  intro,
  steps,
  theme = 'light',
  className,
}: {
  id: string
  index?: string
  title: string
  intro?: string
  steps: { title: string; body: string }[]
  theme?: 'light' | 'warm' | 'dark'
  className?: string
}) {
  return (
    <section data-theme={theme} aria-labelledby={id} className={cn('section-y bg-surface text-fg', className)}>
      <div className="container-site">
        <SectionHeading id={id} index={index} title={title} intro={intro} size="lg" />

        <FlowScene>
          <ol data-flow-group className="mt-14 grid gap-y-12 lg:mt-20 lg:grid-cols-3 lg:gap-x-12">
            {steps.map((step, n) => {
              const last = n === steps.length - 1
              return (
                <li key={step.title} className="relative ps-11 lg:ps-0 lg:pt-14">
                  {!last ? (
                    <>
                      <span
                        aria-hidden
                        data-flow-line="y"
                        className="absolute start-[7.5px] top-[1.375rem] -bottom-[4.375rem] w-px origin-top bg-line-strong/45 lg:hidden"
                      />
                      <span
                        aria-hidden
                        data-flow-line
                        className="absolute start-0 top-[7.5px] hidden h-px w-[calc(100%+3rem)] bg-line-strong/45 lg:block ltr:origin-left rtl:origin-right"
                      />
                    </>
                  ) : null}
                  <span
                    aria-hidden
                    data-flow-node
                    className={cn(
                      'absolute start-0 top-3.5 z-10 block size-4 rounded-full border-[1.5px] lg:top-0',
                      last ? 'border-amber bg-amber' : 'border-fg bg-surface',
                    )}
                  />
                  <div data-flow-item>
                    <p aria-hidden className="text-[clamp(2.75rem,1.9rem+2.2vw,4.5rem)] leading-none font-extrabold tracking-tight text-fg">
                      <span className="num">{pad2(n + 1)}</span>
                    </p>
                    <h3 className="mt-5 text-title font-bold text-fg">{step.title}</h3>
                    <p className="mt-3 max-w-[38ch] text-body text-fg-soft">{step.body}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </FlowScene>
      </div>
    </section>
  )
}
