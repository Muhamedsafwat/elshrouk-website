import { CrestPattern } from '@/components/brand/CrestPattern'
import { ArrowLink } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Locale } from '@/i18n/config'
import { articleHref } from '@/i18n/routing'

export type ResourceItem = { id: number; slug: string; title: string; excerpt?: string; minutes: string }

/**
 * Published resources relevant to the segment, or the designed empty state (today's real experience).
 * The crest pattern stays in the empty end area, never behind text.
 */
export function Resources({
  locale,
  index,
  title,
  items,
  empty,
  contact,
}: {
  locale: Locale
  index?: string
  title: string
  items: ResourceItem[]
  empty: string
  contact: { label: string; href: string }
}) {
  return (
    <section data-theme="light" aria-labelledby="resources-title" className="section-y bg-surface text-fg">
      <div className="container-site grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <SectionHeading id="resources-title" index={index} title={title} size="md" />
        </div>
        <div className="lg:col-span-7">
          {items.length > 0 ? (
            <ul className="border-t border-line-strong">
              {items.map((item) => (
                <li key={item.id} data-reveal="up" className="border-b border-line">
                  <a href={articleHref(locale, item.slug)} className="group grid gap-2 py-6 lg:py-7">
                    <span className="link-sweep justify-self-start text-title font-bold text-fg">{item.title}</span>
                    {item.excerpt ? <span className="line-clamp-2 text-small text-fg-soft">{item.excerpt}</span> : null}
                    <span className="text-caption text-fg-muted">{item.minutes}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div data-reveal="up" className="relative overflow-hidden rounded-sm bg-stone-100 p-8 sm:p-10 lg:p-12">
              <CrestPattern className="pointer-events-none absolute inset-y-0 end-0 hidden w-[30%] sm:block" opacity={0.14} />
              <p className="relative max-w-[44ch] text-lead text-fg-soft sm:max-w-[64%]">{empty}</p>
              <ArrowLink href={contact.href} className="relative mt-6">
                {contact.label}
              </ArrowLink>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
