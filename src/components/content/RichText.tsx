import type { ComponentProps, JSX } from 'react'
import { LinkJSXConverter, RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { Locale } from '@/i18n/config'
import { articleHref, productHref } from '@/i18n/routing'
import { cn } from '@/lib/cn'

type LexicalData = ComponentProps<typeof LexicalRichText>['data']

/**
 * Editorial typography for CMS rich text (Lexical JSON). Logical properties only, so the same rules read
 * right-to-left in Arabic and left-to-right in English. The measure is set by the caller (`measure`).
 */
const prose = cn(
  'text-body text-fg-soft',
  // paragraphs & rhythm
  '[&_p]:my-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
  '[&_strong]:font-semibold [&_strong]:text-fg [&_b]:font-semibold [&_b]:text-fg',
  // headings — one H1 per page lives in the article header, so body headings start at H2
  '[&_h2]:mt-16 [&_h2]:mb-5 [&_h2]:text-balance [&_h2]:text-[clamp(1.45rem,1.15rem+0.9vw,2rem)] [&_h2]:leading-[1.35] [&_h2]:font-bold [&_h2]:text-fg',
  '[&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:text-title [&_h3]:font-bold [&_h3]:text-fg',
  '[&_h4]:mt-10 [&_h4]:mb-3 [&_h4]:text-lead [&_h4]:font-semibold [&_h4]:text-fg',
  '[&_h5]:mt-8 [&_h5]:mb-2 [&_h5]:font-semibold [&_h5]:text-fg [&_h6]:mt-8 [&_h6]:mb-2 [&_h6]:font-semibold [&_h6]:text-fg',
  // lists (Western digits by default — brand numeral rule)
  '[&_ul]:my-6 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:ps-6',
  '[&_li]:my-2 [&_li]:ps-1.5 [&_li::marker]:text-fg-muted [&_ol>li::marker]:font-num [&_ol>li::marker]:font-semibold',
  '[&_li>ul]:my-2 [&_li>ol]:my-2',
  // quotes / callouts
  '[&_blockquote]:my-12 [&_blockquote]:border-s-2 [&_blockquote]:border-vermilion [&_blockquote]:ps-6 [&_blockquote]:text-lead [&_blockquote]:font-medium [&_blockquote]:text-fg sm:[&_blockquote]:ps-8',
  // links
  '[&_a]:font-medium [&_a]:text-fg [&_a]:underline [&_a]:decoration-vermilion [&_a]:decoration-2 [&_a]:underline-offset-[6px] [&_a]:transition-colors hover:[&_a]:decoration-ink',
  // media
  '[&_img]:my-10 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-md [&_picture]:block [&_picture_img]:my-0 [&_picture]:my-10',
  // rules, code, tables
  '[&_hr]:my-14 [&_hr]:border-line',
  '[&_code]:rounded-xs [&_code]:bg-stone-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-small',
  '[&_table]:w-full [&_table]:border-collapse [&_table]:text-small [&_th]:border-b [&_th]:border-line-strong [&_th]:py-3 [&_th]:pe-4 [&_th]:text-start [&_th]:font-semibold [&_th]:text-fg',
  '[&_td]:border-b [&_td]:border-line [&_td]:py-3 [&_td]:pe-4 [&_td]:align-top',
)

type DocRef = { relationTo?: string; value?: unknown } | null | undefined

const docSlug = (value: unknown): string | undefined =>
  value && typeof value === 'object' && 'slug' in value && typeof (value as { slug?: unknown }).slug === 'string'
    ? (value as { slug: string }).slug
    : undefined

/** Maps internal CMS links to localized public routes; unknown targets fall back to the hub. */
const internalHref = (locale: Locale, doc: DocRef): string => {
  const slug = docSlug(doc?.value)
  if (slug && doc?.relationTo === 'articles') return articleHref(locale, slug)
  if (slug && doc?.relationTo === 'products') return productHref(locale, slug)
  return `/${locale}/knowledge`
}

const converters =
  (locale: Locale): JSXConvertersFunction =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({
      internalDocToHref: ({ linkNode }) => internalHref(locale, linkNode.fields.doc as DocRef),
    }),
    heading: ({ node, nodesToJSX }) => {
      const Tag = (node.tag === 'h1' ? 'h2' : node.tag) as keyof JSX.IntrinsicElements
      return <Tag>{nodesToJSX({ nodes: node.children })}</Tag>
    },
    table: (args) => {
      const table = defaultConverters.table
      const rendered = typeof table === 'function' ? table(args) : null
      return <div className="my-10 overflow-x-auto">{rendered}</div>
    },
    // Relationship embeds and any feature without a public renderer are omitted instead of printing "unknown node".
    unknown: () => null,
  })

export function RichText({ data, locale, className }: { data: unknown; locale: Locale; className?: string }) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return (
    <LexicalRichText
      data={data as LexicalData}
      converters={converters(locale)}
      disableTextAlign
      disableIndent
      className={cn(prose, className)}
    />
  )
}
