import 'server-only'

import { cache } from 'react'
import type { Locale } from '@/i18n/config'
import { getPayload } from './payload'

/**
 * Read helpers for CMS globals with graceful degradation: if the database is unreachable the public
 * site still renders its versioned default copy, and the failure is logged (never shown as success).
 */

export type VerifiedChannels = {
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  mapUrl?: string
  social: { platform: string; url: string }[]
}

export type SiteSettingsView = {
  channels: VerifiedChannels
  footerNotice?: string
  legalName?: string
  showKnowledgeHub: boolean
  englishApproved: boolean
  isProduction: boolean
}

type ChannelValue = { value?: string | null; verified?: boolean | null } | null | undefined

const verified = (channel: ChannelValue): string | undefined =>
  channel?.verified && channel.value ? channel.value : undefined

export const getSiteSettings = cache(async (locale: Locale): Promise<SiteSettingsView> => {
  const fallback: SiteSettingsView = {
    channels: { social: [] },
    showKnowledgeHub: true,
    englishApproved: false,
    isProduction: false,
  }
  try {
    const payload = await getPayload()
    const s = await payload.findGlobal({ slug: 'site-settings', locale, depth: 0 })
    const address = s.address as { value?: string | null; mapUrl?: string | null; verified?: boolean | null } | undefined
    return {
      channels: {
        phone: verified(s.phone as ChannelValue),
        whatsapp: verified(s.whatsapp as ChannelValue),
        email: verified(s.email as ChannelValue),
        address: address?.verified && address.value ? address.value : undefined,
        mapUrl: address?.verified && address.mapUrl ? address.mapUrl : undefined,
        social: ((s.social as { platform: string; url: string; verified?: boolean | null }[] | undefined) ?? [])
          .filter((item) => item.verified && item.url)
          .map(({ platform, url }) => ({ platform, url })),
      },
      footerNotice: (s.footerNotice as string | undefined) || undefined,
      legalName: (s.legalName as string | undefined) || undefined,
      showKnowledgeHub: s.showKnowledgeHub !== false,
      englishApproved: s.englishApproved === true,
      isProduction: s.siteStatus === 'production',
    }
  } catch (error) {
    console.error('[cms] site-settings unavailable, using defaults', error)
    return fallback
  }
})
