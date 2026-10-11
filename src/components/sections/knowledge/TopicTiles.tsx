import Link from 'next/link'
import { Photo } from '@/components/media/Photo'
import { CheckIcon } from '@/components/ui/icons'
import { Tag } from '@/components/ui/States'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import { REVIEWED_TOPIC, TOPIC_PHOTOS } from './format'

/**
 * Four editorial topic tiles. Each topic is a real object (art-direction rule 5), so it earns a card with a
 * documentary photo. Tiles become links that filter the article list only when published articles exist —
 * a filter that can only ever return nothing would be a dead end.
 */
export function TopicTiles({
  locale,
  dict,
  linkable,
  active,
}: {
  locale: Locale
  dict: Dictionary
  linkable: boolean
  active?: string
}) {
  const t = dict.knowledge.hub
  return (
    <section aria-labelledby="topics-title" className="container-site pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-36 lg:pb-36">
      <div className="border-t border-line pt-8 sm:pt-10">
        <p className="eyebrow" data-reveal="fade">
          {t.topics.eyebrow}
        </p>
        <h2 id="topics-title" className="mt-5 text-display-md font-bold text-balance text-fg" data-reveal="up">
          {t.topics.title}
        </h2>
      </div>

      {/* Mobile: a snap row that bleeds to the screen edges; ≥640px: 2 columns; ≥1024px: 4 columns.
          The scroller is a named, focusable region so keyboard users can scroll it with the arrow keys even
          when the tiles are not links (A11Y-1, WCAG 2.1.1); its focus ring is inset because it bleeds to the
          screen edges. */}
      <div
        role="region"
        aria-label={t.topics.title}
        tabIndex={0}
        className={cn(
          'mt-10 snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none] focus-visible:-outline-offset-3 sm:mt-14 sm:overflow-visible sm:pb-0',
          '-mx-[clamp(20px,6vw,88px)] scroll-px-[clamp(20px,6vw,88px)] px-[clamp(20px,6vw,88px)] sm:mx-0 sm:px-0',
        )}
      >
        <ul className="flex gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-4">
          {t.categories.map((topic, i) => {
            const isActive = active === topic.key
            const reviewed = topic.key === REVIEWED_TOPIC
            return (
              <li
                key={topic.key}
                className="group relative flex w-[78%] shrink-0 snap-start flex-col sm:w-auto"
                data-reveal="up"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-stone-200">
                  <Photo
                    id={TOPIC_PHOTOS[topic.key as keyof typeof TOPIC_PHOTOS] ?? 'ambient'}
                    locale={locale}
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 78vw"
                    className="size-full transition-transform duration-700 ease-(--ease-sunrise) group-hover:scale-[1.035] motion-reduce:transition-none"
                    decorative
                  />
                </div>
                <div
                  className={cn(
                    'mt-6 flex items-center justify-between border-t pt-4',
                    isActive ? 'border-vermilion border-t-2' : 'border-line-strong',
                  )}
                >
                  <span className="num text-small font-semibold text-fg">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-4 text-title font-bold text-balance text-fg">
                  {linkable ? (
                    <Link
                      href={href(locale, 'knowledge', { category: topic.key }, 'articles')}
                      aria-current={isActive ? 'true' : undefined}
                      className="outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-ink focus-visible:after:ring-offset-4"
                    >
                      <span className="link-sweep">{topic.name}</span>
                    </Link>
                  ) : (
                    topic.name
                  )}
                </h3>
                <p className="mt-3 text-small text-fg-soft">{topic.description}</p>
                {reviewed ? (
                  <Tag className="mt-4 w-fit gap-1.5 border-line-strong py-1 text-fg">
                    <CheckIcon size={14} className="shrink-0" />
                    {t.reviewTag}
                  </Tag>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
