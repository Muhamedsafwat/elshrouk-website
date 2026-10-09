import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@/components/content/RichText'
import { ScrollProgress } from '@/components/motion/ScrollProgress'
import { TextReveal } from '@/components/motion/TextReveal'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArrowLink } from '@/components/ui/Button'
import { CtaBand } from '@/components/ui/CtaBand'
import { AlertIcon, CheckIcon, ExternalIcon } from '@/components/ui/icons'
import { hrefLang, type Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries'
import { formatDate, interpolate } from '@/i18n/format'
import { absoluteUrl, href } from '@/i18n/routing'
import type { ArticleCard as ArticleCardData, getArticleBySlug } from '@/lib/content'
import { ArticleCard } from './ArticleCard'
import { categoryName, readingTimeLabel, REVIEWED_TOPIC } from './format'
import { ShareActions } from './ShareActions'

export type ArticleData = NonNullable<Awaited<ReturnType<typeof getArticleBySlug>>>

const WEB_URL = /^https?:\/\//i
const absolute = (url: string) => (WEB_URL.test(url) ? url : absoluteUrl(url))
const isWebUrl = (url?: string): url is string => Boolean(url && WEB_URL.test(url))

/**
 * Article template (spec §6.7): breadcrumbs, title + meta line (topic · reading time · approved date),
 * cover, RTL-aware rich text, review note only when flagged, general-information disclaimer, sources,
 * share, related reading. Article JSON-LD only for public articles; drafts carry a banner (and noindex
 * via the page metadata).
 */
export function ArticleView({
  locale,
  dict,
  article,
  related,
  isDraft,
}: {
  locale: Locale
  dict: Dictionary
  article: ArticleData
  related: ArticleCardData[]
  isDraft: boolean
}) {
  const hub = dict.knowledge.hub
  const t = dict.knowledge.article
  const c = dict.common
  const topic = categoryName(hub, article.category)
  const reading = readingTimeLabel(article.readingMinutes, locale, hub.card)
  const sources = article.sources.filter((s) => s.label)

  const jsonLd = isDraft
    ? null
    : {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        ...(article.excerpt ? { description: article.excerpt } : {}),
        inLanguage: hrefLang[locale],
        mainEntityOfPage: absoluteUrl(`/${locale}/knowledge/${article.slug}`),
        ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
        dateModified: article.updatedAt,
        ...(article.cover ? { image: [absolute(article.cover.url)] } : {}),
        ...(article.author ? { author: { '@type': 'Person', name: article.author } } : {}),
        publisher: {
          '@type': 'Organization',
          name: c.brand.name,
          logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/alshorouk-logo-full-color.svg') },
        },
      }

  return (
    <>
      <ScrollProgress targetId="article-body" />
      {jsonLd ? <JsonLd data={jsonLd} /> : null}

      {isDraft ? (
        <div role="note" className="bg-ink text-paper">
          <p className="container-site flex items-center gap-3 py-3 text-small font-medium">
            <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-vermilion" />
            {t.draftBanner}
          </p>
        </div>
      ) : null}

      <article>
        <header className="container-site pt-8 sm:pt-10">
          <Breadcrumbs
            label={t.breadcrumbs}
            items={[
              { label: c.breadcrumbs.home, href: href(locale, 'home') },
              { label: c.nav.knowledge, href: href(locale, 'knowledge') },
              { label: article.title },
            ]}
          />
          <div className="mt-12 max-w-5xl sm:mt-16 lg:mt-20">
            <TextReveal as="h1" lines={[article.title]} className="text-display-lg font-bold text-balance text-fg" />
            {article.excerpt ? (
              <p className="mt-8 max-w-3xl text-lead text-fg-soft" data-reveal="up">
                {article.excerpt}
              </p>
            ) : null}
            <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-6 text-small text-fg-muted" data-reveal="fade">
              <Link
                href={href(locale, 'knowledge', { category: article.category }, 'articles')}
                className="font-semibold text-fg underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                {topic}
              </Link>
              <span aria-hidden>·</span>
              <span>
                <span className="sr-only">{t.readingTime}: </span>
                {reading}
              </span>
              {article.publishedAt ? (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    <span className="sr-only">{t.published}: </span>
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
                  </span>
                </>
              ) : null}
              {article.author ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="text-fg">{interpolate(t.byline, { author: article.author })}</span>
                </>
              ) : null}
            </div>
          </div>
        </header>

        {article.cover ? (
          <figure className="container-site mt-12 sm:mt-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-stone-100 sm:aspect-[16/9]" data-reveal="image">
              <Image
                src={article.cover.url}
                alt={article.cover.alt}
                fill
                priority
                sizes="(min-width: 1536px) 1360px, 92vw"
                className="object-cover"
              />
            </div>
          </figure>
        ) : null}

        <div className="container-site grid-site mt-16 gap-y-16 pb-24 sm:mt-20 lg:mt-24 lg:pb-32">
          <div id="article-body" className="col-span-full lg:col-span-8 xl:col-span-7">
            <RichText data={article.body} locale={locale} className="max-w-[68ch]" />

            <div className="mt-16 max-w-[68ch] space-y-4">
              {article.professionalReview ? (
                <p className="flex items-start gap-3 rounded-md border border-line px-5 py-4 text-small text-fg">
                  <CheckIcon size={18} className="mt-1 shrink-0" />
                  <span>{t.reviewedNote}</span>
                </p>
              ) : null}
              <aside aria-label={t.generalInfo} className="rounded-md bg-stone-100 px-5 py-5 sm:px-6">
                <p className="flex items-center gap-2 text-caption font-semibold text-fg">
                  <AlertIcon size={16} />
                  {t.generalInfo}
                </p>
                <p className="mt-2 text-small text-fg-soft">{t.disclaimer}</p>
                {article.category === REVIEWED_TOPIC ? <p className="mt-2 text-small text-fg-soft">{t.vetNote}</p> : null}
              </aside>
            </div>

            {sources.length ? (
              <section aria-labelledby="sources-title" className="mt-16 max-w-[68ch] border-t border-line pt-8">
                <h2 id="sources-title" className="text-title font-bold text-fg">
                  {t.sources}
                </h2>
                <ol className="mt-6 space-y-4">
                  {sources.map((s, i) => (
                    <li key={`${s.label}-${i}`} className="flex gap-4 text-small text-fg-soft">
                      <span className="num w-6 shrink-0 font-semibold text-fg">{String(i + 1).padStart(2, '0')}</span>
                      {isWebUrl(s.url) ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-1.5 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-ink"
                        >
                          <span>{s.label}</span>
                          <ExternalIcon size={14} className="mt-1.5 shrink-0" />
                          <span className="sr-only">({c.a11y.externalLink})</span>
                        </a>
                      ) : (
                        <span>{s.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}
          </div>

          <aside className="col-span-full lg:col-span-3 lg:col-start-10">
            <div className="space-y-8 border-t border-line pt-6 lg:sticky lg:top-28">
              <ShareActions
                title={article.title}
                labels={{ heading: t.share, copyLink: t.copyLink, copied: t.copied, share: t.shareNative }}
              />
              <ArrowLink href={href(locale, 'knowledge')}>{t.backToHub}</ArrowLink>
            </div>
          </aside>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="related-title" data-theme="warm" className="section-y-tight bg-surface text-fg">
          <div className="container-site">
            <h2 id="related-title" className="text-display-md font-bold text-fg">
              {t.related}
            </h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} locale={locale} copy={hub} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title={hub.closing.title}
        body={hub.closing.body}
        primary={{ label: hub.closing.cta, href: href(locale, 'contact', { type: 'general' }) }}
      />
    </>
  )
}
