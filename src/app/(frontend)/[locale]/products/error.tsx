'use client'

import { useParams, useRouter } from 'next/navigation'
import { startTransition, useEffect } from 'react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/States'
import { products as ar } from '@/i18n/dictionaries/ar/products'
import { products as en } from '@/i18n/dictionaries/en/products'
import { href } from '@/i18n/routing'

/** Error boundary for the catalogue and product pages: honest message, retry, and a way to still inquire. */
export default function ProductsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>()
  const locale = params?.locale === 'en' ? 'en' : 'ar'
  const t = (locale === 'en' ? en : ar).catalog.states
  const router = useRouter()

  useEffect(() => {
    console.error('[products] render failed', error.digest ?? error.message)
  }, [error])

  return (
    <section data-theme="light" className="bg-surface text-fg">
      <div className="container-site section-y-tight">
        <ErrorState
          className="max-w-3xl"
          title={t.errorTitle}
          body={t.errorBody}
          action={
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() =>
                  startTransition(() => {
                    router.refresh()
                    reset()
                  })
                }
              >
                {t.retry}
              </Button>
              <ButtonLink href={href(locale, 'contact', { type: 'product' })} variant="outline">
                {t.errorContact}
              </ButtonLink>
            </div>
          }
        />
      </div>
    </section>
  )
}
