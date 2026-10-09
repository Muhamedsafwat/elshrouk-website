import Image from 'next/image'
import Link from 'next/link'
import { CrestPattern } from '@/components/brand/CrestPattern'
import { ArrowIcon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import type { KnowledgeDictionary } from '@/i18n/dictionaries/ar/knowledge'
import { formatDate } from '@/i18n/format'
import { articleHref } from '@/i18n/routing'
import { cn } from '@/lib/cn'
import type { ArticleCard as ArticleCardData } from '@/lib/content'
import { categoryName, readingTimeLabel } from './format'

/**
 * Article card: cover, topic, reading time and — only when the CMS carries an approved publication date —
 * the date. The whole card is one link target (title link stretched over the card).
 */
export function ArticleCard({
  article,
  locale,
  copy,
  featured = false,
  headingLevel = 3,
}: {
  article: ArticleCardData
  locale: Locale
  copy: KnowledgeDictionary['hub']
  featured?: boolean
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className={cn('group relative flex flex-col', featured && 'md:col-span-2')} data-reveal="up">
      <div className={cn('relative overflow-hidden rounded-md bg-stone-100', featured ? 'aspect-[16/10]' : 'aspect-[3/2]')}>
        {article.cover ? (
          <Image
            src={article.cover.url}
            alt=""
            fill
            sizes={featured ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw'}
            className="object-cover transition-transform duration-700 ease-(--ease-sunrise) group-hover:scale-[1.035] motion-reduce:transition-none"
          />
        ) : (
          <CrestPattern opacity={0.12} />
        )}
      </div>
      <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-caption text-fg-muted">
        <span className="font-semibold text-fg">{categoryName(copy, article.category)}</span>
        <span aria-hidden>·</span>
        <span>{readingTimeLabel(article.readingMinutes, locale, copy.card)}</span>
        {article.publishedAt ? (
          <>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
          </>
        ) : null}
      </p>
      <Heading className={cn('mt-3 font-bold text-balance text-fg', featured ? 'text-display-md' : 'text-title')}>
        <Link
          href={articleHref(locale, article.slug)}
          className="outline-none after:absolute after:inset-0 after:rounded-md focus-visible:after:ring-2 focus-visible:after:ring-ink focus-visible:after:ring-offset-4"
        >
          <span className="link-sweep">{article.title}</span>
        </Link>
      </Heading>
      {article.excerpt ? <p className="mt-3 line-clamp-3 text-small text-fg-soft">{article.excerpt}</p> : null}
      <span aria-hidden className="mt-5 inline-flex items-center gap-2 text-small font-semibold text-fg">
        {copy.card.readMore}
        <ArrowIcon size={16} className="transition-transform duration-300 group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
      </span>
    </article>
  )
}
