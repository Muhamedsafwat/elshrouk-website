import Image from 'next/image'
import { ArrowLink } from '@/components/ui/Button'
import { ExternalIcon } from '@/components/ui/icons'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { partnerDomain, type Partner } from '@/content/partners'
import type { Locale } from '@/i18n/config'
import type { HomeDictionary } from '@/i18n/dictionaries/ar/home'
import { href } from '@/i18n/routing'

export type PartnersProps = {
  locale: Locale
  copy: HomeDictionary['partners']
  partners: Partner[]
  /** Screen-reader note for links that open in a new tab. */
  externalLabel: string
}

/**
 * Home · Partners (white). Partner logo cards from src/content/partners.ts; each card opens the partner's own
 * site in a new tab. Logos are shown no larger than their source files allow. The header "Partners" menu
 * links here on mobile (#partners).
 */
export function Partners({ locale, copy, partners, externalLabel }: PartnersProps) {
  if (!partners.length) return null
  return (
    <section
      id="partners"
      data-theme="light"
      aria-labelledby="partners-title"
      className="bg-surface pb-[clamp(4.5rem,2.2rem+7.6vw,11rem)] text-fg"
    >
      <div className="container-site">
        <div aria-hidden className="mb-[clamp(3.5rem,2rem+4.8vw,7.5rem)] border-t border-line" />
        <div className="grid-site items-end gap-y-6">
          <div className="col-span-full lg:col-span-8">
            <SectionHeading id="partners-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} size="lg" />
          </div>
          <div className="col-span-full lg:col-span-4 lg:justify-self-end" data-reveal="fade">
            <ArrowLink href={href(locale, 'partner')}>{copy.cta}</ArrowLink>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-6 lg:grid-cols-3">
          {partners.map((partner) => (
            <li key={partner.name} data-reveal="up">
              <a
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper transition-colors duration-300 hover:border-ink focus-visible:border-ink"
              >
                <span className="flex h-40 items-center justify-center border-b border-line px-8 md:h-48">
                  <span className="relative block h-16 w-36">
                    <Image
                      src={partner.icon}
                      alt=""
                      fill
                      sizes="144px"
                      className="object-contain transition-transform duration-500 ease-(--ease-sunrise) group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </span>
                </span>
                <span className="flex items-center justify-between gap-4 p-5 md:p-6">
                  <span className="min-w-0">
                    <span className="latin block text-title font-bold">{partner.name}</span>
                    <span className="latin mt-1 block truncate text-small text-fg-muted">{partnerDomain(partner.link)}</span>
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-fg transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper group-focus-visible:border-ink group-focus-visible:bg-ink group-focus-visible:text-paper"
                  >
                    <ExternalIcon size={18} />
                  </span>
                </span>
                <span className="sr-only">({externalLabel})</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
