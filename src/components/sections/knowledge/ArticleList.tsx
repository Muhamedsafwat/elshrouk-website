import Link from 'next/link'
import { ArrowLink } from '@/components/ui/Button'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import type { ArticleCard as ArticleCardData } from '@/lib/content'
import { ArticleCard } from './ArticleCard'
import { categoryName } from './format'

/** Category filter (server links with `?category=`) + editorial article grid. */
export function ArticleList({
  locale,
  dict,
  articles,
  active,
}: {
  locale: Locale
  dict: Dictionary
  articles: ArticleCardData[]
  active?: string
}) {
  const t = dict.knowledge.hub
  const chip = (current: boolean) =>
    cn(
      'inline-flex min-h-11 items-center rounded-full border px-5 text-small font-medium transition-colors',
      current ? 'border-ink bg-ink text-paper' : 'border-line-strong text-fg hover:border-ink',
    )
  const [first, ...rest] = articles
  return (
    <section id="articles" aria-labelledby="articles-title" className="section-y scroll-mt-24">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t.articlesEyebrow}</p>
            <h2 id="articles-title" className="mt-5 text-display-md font-bold text-fg">
              {active ? categoryName(t, active) : t.latestTitle}
            </h2>
          </div>
        </div>

        <nav aria-label={t.categoriesTitle} className="mt-10 border-y border-line py-4">
          <ul className="flex flex-wrap gap-2.5">
            <li>
              <Link href={href(locale, 'knowledge', undefined, 'articles')} aria-current={!active ? 'page' : undefined} className={chip(!active)}>
                {t.allCategories}
              </Link>
            </li>
            {t.categories.map((c) => (
              <li key={c.key}>
                <Link
                  href={href(locale, 'knowledge', { category: c.key }, 'articles')}
                  aria-current={active === c.key ? 'page' : undefined}
                  className={chip(active === c.key)}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {first ? (
          <div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            <ArticleCard article={first} locale={locale} copy={t} featured={rest.length > 0} />
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} locale={locale} copy={t} />
            ))}
          </div>
        ) : (
          <div className="mt-14 max-w-xl">
            <p className="text-title font-bold text-fg">{t.emptyCategory.title}</p>
            <p className="mt-3 text-fg-soft">{t.emptyCategory.body}</p>
            <ArrowLink href={href(locale, 'knowledge', undefined, 'articles')} className="mt-6">
              {t.allCategories}
            </ArrowLink>
          </div>
        )}
      </div>
    </section>
  )
}
