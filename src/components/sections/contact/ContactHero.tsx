import { accent } from '@/components/motion/Accent'
import { TextReveal } from '@/components/motion/TextReveal'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import type { ContactDictionary } from '@/i18n/dictionaries/ar/contact'

/** Short white hero (art-direction §7 "Contact"): the form follows immediately below. */
export function ContactHero({
  copy,
  crumbs,
  crumbsLabel,
}: {
  copy: ContactDictionary['hero']
  crumbs: { label: string; href?: string }[]
  crumbsLabel: string
}) {
  return (
    <section data-theme="light" className="bg-surface text-fg">
      <div className="container-site pt-8 pb-12 lg:pt-12 lg:pb-16">
        <Breadcrumbs items={crumbs} label={crumbsLabel} />
        <div className="grid-site mt-10 gap-y-8 lg:mt-14 lg:items-end">
          <div className="col-span-4 md:col-span-8 lg:col-span-8">
            <p className="eyebrow" data-reveal="fade">
              {copy.eyebrow}
            </p>
            <TextReveal
              as="h1"
              lines={[copy.title[0], accent(copy.title[1] ?? '', copy.accent)]}
              className="mt-6 text-display-xl font-bold"
            />
          </div>
          <p className="col-span-4 text-lead text-fg-soft md:col-span-6 lg:col-span-4" data-reveal="up">
            {copy.intro}
          </p>
        </div>
      </div>
    </section>
  )
}
