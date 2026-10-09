'use client'

import { useParams } from 'next/navigation'
import { Skeleton } from '@/components/ui/States'
import { products as ar } from '@/i18n/dictionaries/ar/products'
import { products as en } from '@/i18n/dictionaries/en/products'

/** Catalogue skeleton: mirrors hero → search → rail + results grid so nothing jumps when data lands. */
export default function ProductsLoading() {
  const params = useParams<{ locale?: string }>()
  const t = (params?.locale === 'en' ? en : ar).catalog.states

  return (
    <div data-theme="light" className="bg-surface text-fg">
      <p role="status" className="sr-only">
        {t.loading}
      </p>
      <div aria-hidden className="container-site pt-8 pb-24 sm:pt-10 lg:pt-14">
        <Skeleton className="h-4 w-40" />
        <div className="grid-site mt-10 items-end gap-y-6 lg:mt-14">
          <div className="col-span-full space-y-4 lg:col-span-7">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-14 w-4/5 lg:h-20" />
            <Skeleton className="h-14 w-3/5 lg:h-20" />
          </div>
          <div className="col-span-full space-y-3 lg:col-span-5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <Skeleton className="mt-10 h-16 w-full sm:h-20 lg:mt-14" />
        <div className="grid-site mt-12 gap-y-8 border-t border-line pt-8 lg:pt-12">
          <div className="hidden space-y-4 lg:col-span-3 lg:block">
            <Skeleton className="h-6 w-32" />
            {Array.from({ length: 7 }, (_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <div className="col-span-full lg:col-span-9 lg:ps-6 xl:ps-10">
            <Skeleton className="h-10 w-48" />
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="overflow-hidden rounded-md border border-line">
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />
                  <div className="space-y-3 p-6">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="mt-6 h-12 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
