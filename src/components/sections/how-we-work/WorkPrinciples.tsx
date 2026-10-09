import type { HowWeWorkDictionary } from '@/i18n/dictionaries/ar/howWeWork'
import { cn } from '@/lib/cn'
import { TextReveal } from '@/components/motion/TextReveal'

/** Desktop "stair": each principle sits lower than the one before, descending toward the inline end. */
const STAIR = ['', 'lg:mt-16', 'lg:mt-32']

/** Three working principles on warm grey — hairline-topped columns, no cards. */
export function WorkPrinciples({ copy }: { copy: HowWeWorkDictionary['principles'] }) {
  return (
    <section aria-labelledby="principles-title" data-theme="warm" className="section-y bg-surface text-fg">
      <div className="container-site">
        <TextReveal as="h2" id="principles-title" lines={[copy.title]} className="max-w-3xl text-display-lg font-bold" />
        <ol className="grid-site mt-12 gap-y-12 lg:mt-20">
          {copy.items.map((item, n) => (
            <li
              key={item.title}
              data-reveal="up"
              data-reveal-delay={String(n * 0.08)}
              className={cn('col-span-4 border-t-2 border-ink pt-6 md:col-span-6 lg:col-span-4 lg:pe-6', STAIR[n])}
            >
              <span aria-hidden className="num text-small font-semibold text-fg-muted">
                {String(n + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-8 text-title font-bold lg:mt-12">{item.title}</h3>
              <p className="mt-4 text-body text-fg-soft">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
