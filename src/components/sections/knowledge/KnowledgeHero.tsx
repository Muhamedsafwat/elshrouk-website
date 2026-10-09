import { accent } from '@/components/motion/Accent'
import { TextReveal } from '@/components/motion/TextReveal'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'

/**
 * Knowledge hub hero — warm-grey editorial spread (art-direction §7). Typography carries the scene:
 * a two-line display title with one vermilion phrase, the intro set against it at the inline end.
 */
export function KnowledgeHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.knowledge.hub.hero
  const c = dict.common
  return (
    <header className="container-site pt-8 sm:pt-10">
      <Breadcrumbs
        label={c.a11y.breadcrumbs}
        items={[{ label: c.breadcrumbs.home, href: href(locale, 'home') }, { label: c.nav.knowledge }]}
      />
      <div className="grid-site mt-14 items-end gap-y-8 sm:mt-20 lg:mt-28">
        <div className="col-span-full lg:col-span-8">
          <p className="eyebrow" data-reveal="fade">
            {t.eyebrow}
          </p>
          <TextReveal
            as="h1"
            lines={t.title.map((line, i) => (i === 0 ? accent(line, t.accent) : line))}
            className="mt-6 text-display-2xl font-bold text-balance text-fg"
          />
        </div>
        <p data-reveal="up" className="col-span-full max-w-md text-lead text-fg-soft lg:col-span-4 lg:pb-3">
          {t.intro}
        </p>
      </div>
    </header>
  )
}
