'use client'

import { useParams } from 'next/navigation'
import { CrestPattern } from '@/components/brand/CrestPattern'
import { Button, ButtonLink } from '@/components/ui/Button'
import { common as arCommon } from '@/i18n/dictionaries/ar/common'
import { common as enCommon } from '@/i18n/dictionaries/en/common'

/**
 * Route error boundary (spec §6.10): calm, on-brand, with a retry (re-fetches the segment) and a way home.
 * The header and footer stay in place because the boundary sits inside the locale layout.
 */
export default function RouteError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const params = useParams<{ locale?: string }>()
  const locale = params?.locale === 'en' ? 'en' : 'ar'
  const t = (locale === 'en' ? enCommon : arCommon).errorPage

  return (
    <section aria-labelledby="error-title" className="container-site grid-site min-h-[64svh] content-center items-center gap-y-12 py-20 sm:py-28">
      <div className="col-span-full lg:col-span-7" role="alert">
        <h1 id="error-title" className="text-display-lg font-bold text-balance text-fg">
          {t.title}
        </h1>
        <p className="mt-6 max-w-lg text-lead text-fg-soft">{t.body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button onClick={() => retry()} size="lg" className="justify-center">
            {t.retry}
          </Button>
          <ButtonLink href={`/${locale}`} variant="outline" size="lg" arrow={false} className="justify-center">
            {t.home}
          </ButtonLink>
        </div>
      </div>
      <div aria-hidden className="col-span-full hidden lg:col-span-4 lg:col-start-9 lg:block">
        <div className="aspect-square w-full overflow-hidden rounded-full bg-stone-100">
          <CrestPattern opacity={0.16} />
        </div>
      </div>
    </section>
  )
}
