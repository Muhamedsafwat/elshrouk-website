# Developer cheat-sheet (read this instead of exploring the codebase)

Everything a page/scene builder needs. Signatures are exact. Read the source of a primitive only if you must change behaviour (you usually must not — primitives are orchestrator-owned).

## Stack & conventions
- Next 16 App Router: `params`/`searchParams` are **Promises** (`const { locale } = await params`). Server Components by default; `'use client'` only for interaction/animation. Route files: `src/app/(frontend)/[locale]/<route>/page.tsx`.
- Every page: validate locale → `if (!isLocale(locale)) notFound()`; `generateMetadata` via `buildMetadata({ locale, title, description, path })` (path WITHOUT locale, e.g. `'/about'`).
- Tailwind 4 tokens (src/styles/globals.css). Logical utilities only (`ms/me/ps/pe/start/end/text-start`). Sections set colours with `data-theme="light|warm|dark|vermilion"` → use `bg-surface text-fg text-fg-soft text-fg-muted border-line text-accent`.
- Type scale: `text-display-2xl|xl|lg|md`, `text-title`, `text-lead`, `text-body`, `text-small`, `text-caption`, `text-stat`, `text-index`. Numbers/Latin: `.num` (Montserrat, LTR-isolated). Layout: `container-site`, `grid-site` (4/8/12 cols), `section-y`, `section-y-tight`, `measure`, `eyebrow`, `link-sweep`, `mask-line`.
- Colours: `bg-vermilion text-ink` (CTA), `bg-ink`, `bg-paper`, `bg-amber` (≤1 accent per view, never behind text), `stone-50…900` (warm grey ground `stone-100` = #F6F5F3).
- Copy: ONLY from dictionaries. `const dict = getDictionary(locale)` → `dict.common | home | about | solutions | products | howWeWork | knowledge | contact | partner | privacy`. Add missing keys to YOUR page dictionary pair (ar + en identical shape; en typed against ar). `interpolate(str, { n: 3 })` for `{n}` placeholders.

## Imports you will use
```ts
import { isLocale, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { href, productHref, articleHref, type RouteKey } from '@/i18n/routing'   // href(locale,'contact',{type:'farm'}, 'hash?')
import { interpolate, formatDate } from '@/i18n/format'
import { buildMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { cn } from '@/lib/cn'
```
RouteKeys: `home about solutions broilers layers breeders products howWeWork knowledge contact partner privacy`.

## UI primitives (src/components/ui, brand, motion, media)
| Component | Props (key ones) | Notes |
|---|---|---|
| `ButtonLink` (`@/components/ui/Button`) | `href, variant='primary'|'ink'|'outline'|'inverse'|'ghost'|'accent', size='md'|'lg', arrow=true, className, onClick` | primary = vermilion/black label. Also `Button` (same + `type`, `disabled`) and `ArrowLink` (text link + arrow). |
| `SectionHeading` (`@/components/ui/SectionHeading`) | `eyebrow?, title: string|string[], intro?, index?, as='h2', size='xl'|'lg'|'md', align='start'|'center', id?, className, titleClassName` | Lines reveal automatically. |
| `TextReveal` (`@/components/motion/TextReveal`) | `as, lines: ReactNode[], className, manual?` | Authored lines rise from masks. |
| `accent(line, phrase)` (`@/components/motion/Accent`) | returns ReactNode with phrase in vermilion | Display sizes only (≥32px). |
| `Breadcrumbs` (`@/components/ui/Breadcrumbs`) | `items: {label, href?}[], label (=dict.common.a11y.breadcrumbs), tone='default'|'onDark'` | Emits BreadcrumbList JSON-LD. |
| `EmptyState`, `ErrorState`, `Skeleton`, `Tag` (`@/components/ui/States`) | EmptyState `{title, body?, action?, icon?, tone='warm'|'plain'}` | |
| `CtaBand` (`@/components/ui/CtaBand`) | `title, body?, primary:{label,href}, secondary?, curve=true` | Black closing band with Signature Curve. |
| `Accordion` (`@/components/ui/Accordion`) | `items:{id,title,content}[], headingLevel=3, defaultOpen?, allowMultiple?` | client |
| `Drawer` (`@/components/ui/Drawer`) | `open, onClose, title, closeLabel, children, size='md'|'lg'` | client, native modal dialog |
| icons (`@/components/ui/icons`) | `ArrowIcon, ChevronIcon, PlusIcon, CloseIcon, SearchIcon, FilterIcon, CheckIcon, AlertIcon, DownloadIcon, ExternalIcon, LinkIcon, ArrowUpIcon, CATEGORY_ICONS[feed|supplements|medicines|vaccines], SEGMENT_ICONS[broilers|layers|breeders]` | `size` prop, currentColor |
| `Logo` (`@/components/brand/Logo`) | `variant='color'|'white'|'black', width (≥110), alt, withClearSpace?` | Only way to show the logo. color on white/warm grey; white on dark. |
| `SunriseCurve` (`@/components/brand/SunriseCurve`) | `lines=3, tone='light'|'dark'|'vermilion', trigger='scroll'|'immediate', static?, drift?, strokeWidth=6, cssDraw?` | Draws on entry. Never under body text. |
| `FlowUnderline` | `destination?, tone='dark'|'light', delay?` | line + 2 nodes (amber if destination) |
| `CrestPattern` | `className, opacity=0.14, tone='ink'|'paper'` | empty areas only |
| `VetGrid` | `cells?: ('vermilion'|'black'|'amber'|null)[16]` | 4×4 grid |
| `MetricCounter` (`@/components/motion/MetricCounter`) | `value: string, className, delay?` | aria-hidden digits — add srLabel text yourself |
| `ScrollProgress` (`@/components/motion/ScrollProgress`) | `targetId?` | reading bar (segment pages/articles) |
| `Photo` (`@/components/media/Photo`) | `id: PhotoId, locale, sizes, className (give it a size/aspect), shape='rect'|'arch'|'rounded', reveal?, priority?, decorative?, quality?` | fill + object-cover + focal point |
| `ProductCard` (`@/components/products/ProductCard`) | `product: ProductCardData, locale, labels:{details, availability:{inquiry_only,on_request,confirmed}}, action?: ReactNode` | `CATEGORY_PHOTO[categoryKey]` → PhotoId |
| `InquiryForm` (`@/components/forms/InquiryForm`) | `locale, kind?, lockKind?, segment?, product?:{id,label}, productCategory?, variant='full'|'compact', sourcePath, title?, intro?, id?` | Server component; the forms builder implements it — other pages just use it. |
| form fields (`@/components/forms/fields`) | `TextField, TextAreaField, SelectField({options, placeholder}), CheckboxField, ChoiceCards({name, legend, options, value, onChange})` | client |

**Photo ids** (`src/content/photos.ts`): `hero heroAlt1 heroAlt2 statement segmentBroilers broilersDetail segmentLayers layersDetail segmentBreeders breedersDetail categoryFeed categorySupplements categoryMedicines categoryVaccines chicks peopleVet eggs farmExterior ambient`. Contact sheet: `docs/image-contact-sheet.jpg`. `peopleVet` shows identifiable people (model release unknown) — use sparingly, never as a testimonial.

## Data (server only)
```ts
import { queryProducts, getFacets, getFeaturedProducts, getProductsForSegment, getProductBySlug, getRelatedProducts, getTaxonomy, getPublicProductSlugs, type ProductCard, type ProductDetail } from '@/lib/catalog'
import { parseCatalogParams, catalogHref, hasActiveFilters, CATEGORY_KEYS, SEGMENT_KEYS, PAGE_SIZE, type CatalogParams } from '@/lib/catalog-params'
import { getMetrics, getHomepage, getFaqs, getArticles, getArticleBySlug, getPublicArticleSlugs, readingMinutes, type Metric } from '@/lib/content'
import { getSiteSettings } from '@/lib/cms'          // { channels:{phone?,whatsapp?,email?,address?,social[]}, showKnowledgeHub, englishApproved, isProduction }
import { getPayload } from '@/lib/payload'           // Payload Local API (e.g. payload.auth({ headers: await headers() }) for preview checks)
```
- `queryProducts(locale, params)` → `{ items: ProductCard[], total, page, totalPages }`. `getFacets(locale)` → `{ total, categories:{feed:n,…}, segments:{broilers:n,…}, manufacturers: string[] }`.
- `getProductBySlug(locale, slug, preview?)` → `ProductDetail | null` (+ `sku, description, warnings, safetyText, labelPdf?, gallery[], seo, isPublic, approvalStatus, updatedAt`).
- `getTaxonomy(locale)` → `{ categories:{key,name,description?,image?}[], segments:{key,name,intro?,image?}[] }`.
- `getMetrics(locale)` → `{ items: Metric[], footnote }`, Metric = `{key,qualifier,value,unit,label,srLabel}`.
- `getArticles(locale, category?)` → `ArticleCard[]` (`id, slug, title, excerpt?, category, publishedAt?, cover?, readingMinutes`). `getArticleBySlug(locale, slug, preview?)` → article + `body` (Lexical JSON), `sources`, `author?`, `professionalReview`, `isPublic`.
- Today the dev DB has **zero approved products and zero articles** → empty states are the real experience. A production server with test fixtures may run on :3200 (`[TEST]` products + demo banner).
- Inquiry contract: `src/lib/inquiries/schema.ts` (`inquirySchema`, `InquiryResult`, `normalizePhone`, `isValidPhone`, `fieldErrors`).

## Motion pattern (client component)
```tsx
'use client'
import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap'
import { mq, motionDisabled } from '@/lib/motion/tokens'
export function Scene({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    if (motionDisabled()) return
    const mm = gsap.matchMedia()
    mm.add(mq.desktopMotion, () => { /* desktop-only scrub/pin-free timelines, selectors scoped to ref */ })
    mm.add(mq.motion, () => { /* all-device entrances */ })
    return () => mm.revert()
  }, { scope: ref })
  return <section ref={ref} data-reveal-manual="">{children}</section>
}
```
- Simple reveals need NO JS: add `data-reveal="up"` / `"fade"` / `"image"` or use `TextReveal`. Elements animated by your own timeline: mark them `data-reveal-manual` (and don't also give them `data-reveal`).
- Pass server-rendered markup as `children` into client motion wrappers to keep content server-rendered.
- Reduced motion / `motion-off` ⇒ final state; only transform/opacity/clip-path/stroke-dash; no perpetual loops; parallax ≤ 32px desktop, 0 mobile; flows run right→left in Arabic; the Signature Curve keeps PDF orientation.

## Verify (fast loop)
```bash
cd "/d/ويبسايت الشروق"
pnpm exec tsc --noEmit --incremental false 2>&1 | grep -E "<your path fragments>"
pnpm exec eslint <your files>
node scripts/shot.mjs http://localhost:3100/ar/<route> screenshots/dev/<name>-1440.png --w 1440 --h 900 --full
node scripts/shot.mjs http://localhost:3100/ar/<route> screenshots/dev/<name>-390.png --w 390 --h 844 --mobile --full
# options: --reduced, --scroll 0.5 (viewport shot at 50% of the page), /en/ URL for LTR
```
The script prints `{ overflowX, errors[] }` — both must be clean. Look at screenshots with the Read tool. Dev server: http://localhost:3100 (shared; don't restart it).

## Gotchas learned during the build
- `.num` sets `direction: ltr` — a **block-level** `.num` (e.g. a giant index on its own line) aligns LEFT inside RTL copy. Make it `inline-block` or place it in a flex/grid aligned to start.
- GSAP's CSSPlugin rounds px: tweening `strokeDashoffset` on a `pathLength="1"` path snaps 1→0. Tween `attr: { 'stroke-dashoffset': … }` or use DrawSVG without `pathLength`.
- Don't put `once: true` ScrollTriggers on markup that is `display:none` at some breakpoints (it can self-destruct during a refresh and break sibling batches). Prefer `toggleActions` or create triggers inside the matching `gsap.matchMedia` branch.
- Content inside streamed Suspense boundaries (routes with `loading.tsx`): prefer the CSS intro classes (`intro-line`, `intro-fade`, `intro-mask`) over `data-reveal`; `MotionRuntime` delays late nodes ~0.9 s but CSS intros never race hydration.
- A route segment wrapped in Suspense (e.g. `loading.tsx`) turns `notFound()` into a streamed **200**. Pages that must return a real 404 (product/article slugs) must not have a loading boundary above them.
