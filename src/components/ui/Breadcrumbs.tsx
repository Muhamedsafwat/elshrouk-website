import Link from 'next/link'
import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'
import { cn } from '@/lib/cn'

export type Crumb = { label: string; href?: string }

/** Visible breadcrumbs + BreadcrumbList JSON-LD (spec §6.3, §12.1). Last crumb is the current page. */
export function Breadcrumbs({ items, label, className, tone = 'default' }: { items: Crumb[]; label: string; className?: string; tone?: 'default' | 'onDark' }) {
  return (
    <>
      <nav aria-label={label} className={cn('text-small', className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, i) => {
            const last = i === items.length - 1
            return (
              <li key={`${item.label}-${i}`} className="flex items-center gap-2">
                {item.href && !last ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'link-sweep',
                      tone === 'onDark' ? 'text-stone-300 hover:text-paper' : 'text-fg-muted hover:text-fg',
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={last ? 'page' : undefined} className={cn('font-medium', tone === 'onDark' ? 'text-paper' : 'text-fg')}>
                    {item.label}
                  </span>
                )}
                {!last ? (
                  <span aria-hidden className={cn('inline-block h-px w-4', tone === 'onDark' ? 'bg-white/40' : 'bg-line-strong/40')} />
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items.filter((c) => c.href).map((c) => ({ name: c.label, path: c.href! })))} />
    </>
  )
}
