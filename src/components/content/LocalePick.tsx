'use client'

import { useParams } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * Chooses between server-rendered locale variants for boundaries that receive no params
 * (`not-found.tsx`). Both variants are rendered on the server; the URL's locale decides which one shows.
 */
export function LocalePick({ ar, en }: { ar: ReactNode; en: ReactNode }) {
  const params = useParams<{ locale?: string }>()
  return <>{params?.locale === 'en' ? en : ar}</>
}
