import { ArrowLink } from '@/components/ui/Button'
import type { ContactDictionary } from '@/i18n/dictionaries/ar/contact'
import type { VerifiedChannels } from '@/lib/cms'
import { cn } from '@/lib/cn'
import { FlowSteps } from './FlowSteps'

/**
 * "What happens next" (3 steps, no time promises), the privacy note and — only when Site Settings holds
 * VERIFIED channels — those channels. No map, no placeholder numbers (spec §6.8).
 */
export function ContactAside({
  copy,
  channelsCopy,
  channels,
  privacyHref,
  className,
}: {
  copy: ContactDictionary['aside']
  channelsCopy: ContactDictionary['channels']
  channels: VerifiedChannels
  privacyHref: string
  className?: string
}) {
  const digits = (value: string) => value.replace(/[^\d+]/g, '')
  const items = [
    channels.phone ? { key: 'phone', label: channelsCopy.phone, value: channels.phone, href: `tel:${digits(channels.phone)}`, ltr: true } : null,
    channels.whatsapp
      ? { key: 'whatsapp', label: channelsCopy.whatsapp, value: channels.whatsapp, href: `https://wa.me/${digits(channels.whatsapp).replace('+', '')}`, ltr: true }
      : null,
    channels.email ? { key: 'email', label: channelsCopy.email, value: channels.email, href: `mailto:${channels.email}`, ltr: true } : null,
    channels.address ? { key: 'address', label: channelsCopy.address, value: channels.address, href: undefined, ltr: false } : null,
  ].filter((item) => item !== null)

  return (
    <aside className={cn('flex flex-col gap-12', className)} aria-labelledby="contact-next-title">
      <div>
        <h2 id="contact-next-title" className="text-title font-bold text-fg">
          {copy.title}
        </h2>
        <FlowSteps steps={copy.steps} className="mt-8" />
      </div>

      <div className="flex flex-col gap-3 border-t border-fg pt-6">
        <p className="text-small leading-relaxed text-fg-soft">{copy.privacyNote}</p>
        <ArrowLink href={privacyHref} className="self-start text-small">
          {copy.privacyLink}
        </ArrowLink>
      </div>

      {items.length > 0 ? (
        <div className="flex flex-col gap-4 border-t border-line pt-6">
          <h2 className="text-body font-bold text-fg">{channelsCopy.title}</h2>
          <dl className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.key} className="flex flex-col gap-0.5">
                <dt className="text-caption text-fg-muted">{item.label}</dt>
                <dd className="text-body font-semibold text-fg">
                  {item.href ? (
                    <a href={item.href} className="link-sweep" dir={item.ltr ? 'ltr' : undefined}>
                      <bdi className={item.ltr ? 'num' : undefined}>{item.value}</bdi>
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </aside>
  )
}
