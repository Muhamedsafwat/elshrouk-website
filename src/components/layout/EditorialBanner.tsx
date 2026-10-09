import type { Locale } from '@/i18n/config'
import type { CommonDict } from '@/i18n/dictionaries'
import { getSiteSettings } from '@/lib/cms'

/**
 * Honest status ribbons (spec §1.3, §4.2):
 *  - fixture/demo environments say so on every page (fake data is never presented as real);
 *  - English pages flag that the translation is awaiting editorial approval.
 */
export async function EditorialBanner({ locale, t }: { locale: Locale; t: CommonDict }) {
  const settings = await getSiteSettings(locale)
  const messages: string[] = []
  if (process.env.DEMO_FIXTURES === 'true') messages.push(t.demoBanner)
  if (locale === 'en' && !settings.englishApproved) messages.push(t.englishReviewNotice)
  if (!messages.length) return null
  return (
    <div role="note" data-theme="dark" className="relative z-30 text-caption">
      <div className="container-site flex flex-wrap items-center gap-x-6 gap-y-1 py-2">
        {messages.map((m) => (
          <p key={m} className="flex items-center gap-2 text-fg-soft">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-amber" />
            {m}
          </p>
        ))}
      </div>
    </div>
  )
}
