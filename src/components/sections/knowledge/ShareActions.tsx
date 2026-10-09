'use client'

import { useEffect, useState } from 'react'
import { CheckIcon, ExternalIcon, LinkIcon } from '@/components/ui/icons'

/**
 * Copy-link button (always) + native share (only where the Web Share API exists). The URL is read on the
 * client so previews and locale variants share exactly what the reader sees.
 */
export function ShareActions({
  title,
  labels,
}: {
  title: string
  labels: { heading: string; copyLink: string; copied: string; share: string }
}) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    // Feature detection must run after hydration (no `navigator` on the server).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2400)
    return () => window.clearTimeout(id)
  }, [copied])

  const pageUrl = () => window.location.href.replace(/#.*$/, '')

  const copy = async () => {
    const url = pageUrl()
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for browsers that block the async clipboard API.
      const field = document.createElement('textarea')
      field.value = url
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
  }

  const share = async () => {
    try {
      await navigator.share({ title, url: pageUrl() })
    } catch {
      /* dismissed by the reader */
    }
  }

  const button =
    'inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-strong px-5 text-small font-semibold text-fg transition-colors hover:border-ink focus-visible:border-ink'

  return (
    <div>
      <p className="text-caption font-semibold text-fg-muted">{labels.heading}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        <button type="button" onClick={copy} className={button}>
          {copied ? <CheckIcon size={16} /> : <LinkIcon size={16} />}
          <span>{copied ? labels.copied : labels.copyLink}</span>
        </button>
        {canShare ? (
          <button type="button" onClick={share} className={button}>
            <ExternalIcon size={16} />
            <span>{labels.share}</span>
          </button>
        ) : null}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {copied ? labels.copied : ''}
      </p>
    </div>
  )
}
