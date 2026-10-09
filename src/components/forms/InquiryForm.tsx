import type { Locale } from '@/i18n/config'
import { href } from '@/i18n/routing'
import type { InquiryKind } from '@/lib/inquiries/schema'
import { InquiryFormClient } from './InquiryFormClient'
import { buildInquiryStrings } from './inquiry-strings'

/**
 * The ONE inquiry form used site-wide (contact, partner, segment, how-we-work and product pages).
 * Server component: assembles localized copy, then hands over to the client form, which validates with
 * the shared Zod schema and submits to the `submitInquiry` server action (spec §4.3, §6.8, §11).
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

export function InquiryForm({ locale, kind, product, ...rest }: InquiryFormProps) {
  return (
    <InquiryFormClient
      {...rest}
      locale={locale}
      // A product context implies a product inquiry unless the host page says otherwise.
      kind={kind ?? (product ? 'product' : undefined)}
      product={product}
      strings={buildInquiryStrings(locale)}
      privacyHref={href(locale, 'privacy')}
    />
  )
}
