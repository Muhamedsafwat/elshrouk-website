import type { Locale } from '@/i18n/config'
import type { InquiryKind } from '@/lib/inquiries/schema'

/**
 * CONTRACT STUB — the forms agent replaces the implementation; the props below are the stable API used
 * by contact, partner, segment, how-we-work and product pages. One form implementation site-wide.
 */
export type InquiryFormProps = {
  locale: Locale
  /** Pre-selected inquiry type (?type=farm|product|partner|general). */
  kind?: InquiryKind
  /** Hide the type selector (e.g. partner page, product drawer). */
  lockKind?: boolean
  /** Prefilled production type (segment pages). */
  segment?: 'broilers' | 'layers' | 'breeders' | 'multiple'
  /** Trusted product context (id from the CMS + label snapshot). */
  product?: { id: number; label: string }
  productCategory?: 'feed' | 'supplements' | 'medicines' | 'vaccines'
  /** compact = essential fields only (embedded forms); full = contact page. */
  variant?: 'full' | 'compact'
  /** Path of the page hosting the form, stored with the inquiry (e.g. "/ar/solutions/broilers"). */
  sourcePath: string
  title?: string
  intro?: string
  className?: string
  id?: string
}

export function InquiryForm({ title, className, id }: InquiryFormProps) {
  return (
    <div id={id} className={className}>
      {title ? <h2 className="text-display-md font-bold">{title}</h2> : null}
    </div>
  )
}
