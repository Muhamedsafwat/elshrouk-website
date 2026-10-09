import { SectionHeading } from '@/components/ui/SectionHeading'
import { pad2 } from './shared'

/** Supply needs as a numbered 2×2 hairline grid (warm ground). Supply-side wording only, no protocols. */
export function SupplyNeeds({
  index,
  title,
  items,
}: {
  index?: string
  title: string
  items: { title: string; body: string }[]
}) {
  return (
    <section data-theme="warm" aria-labelledby="needs-title" className="section-y bg-surface text-fg">
      <div className="container-site grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading id="needs-title" index={index} title={title} size="lg" />
          </div>
        </div>
        <ol className="grid grid-cols-1 border-t border-line-strong sm:grid-cols-2 lg:col-span-8">
          {items.map((item, n) => (
            <li
              key={item.title}
              data-reveal="up"
              className="border-b border-line py-9 sm:py-12 sm:odd:pe-8 sm:even:border-s sm:even:ps-8 lg:odd:pe-12 lg:even:ps-12"
            >
              <p aria-hidden className="text-[2.75rem] leading-none font-extrabold tracking-tight text-fg">
                <span className="num">{pad2(n + 1)}</span>
              </p>
              <h3 className="mt-7 text-title font-bold text-fg">{item.title}</h3>
              <p className="mt-3 max-w-[44ch] text-body text-fg-soft">{item.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
