'use client'

import { useEffect, useRef, useState } from 'react'
import { CloseIcon, SearchIcon } from '@/components/ui/icons'
import type { Locale } from '@/i18n/config'
import { catalogHref, parseCatalogParams, type CatalogParams } from '@/lib/catalog-params'
import { useCatalogNav } from './CatalogNav'

const DEBOUNCE_MS = 350

export type CatalogSearchLabels = { label: string; placeholder: string; clear: string; submit: string }

/**
 * Prominent catalogue search. Without JS it is a plain GET form (keeps the active filters as hidden
 * fields and resets pagination). With JS it debounces typing (350 ms) and replaces the URL in place so
 * results update without losing focus; Enter submits immediately.
 */
export function CatalogSearch({
  locale,
  params,
  labels,
  caption,
}: {
  locale: Locale
  params: CatalogParams
  labels: CatalogSearchLabels
  caption?: string
}) {
  const nav = useCatalogNav()
  const urlQ = params.q ?? ''
  const [value, setValue] = useState(urlQ)
  const [seenQ, setSeenQ] = useState(urlQ)
  const [focused, setFocused] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const input = useRef<HTMLInputElement>(null)

  // Adopt URL changes made elsewhere (reset, chips, back button) unless the visitor is typing.
  if (urlQ !== seenQ) {
    setSeenQ(urlQ)
    if (!focused) setValue(urlQ)
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const commit = (raw: string) => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    if (!nav) return
    // Read the live URL so a filter clicked while typing is never overwritten by stale props.
    const current = parseCatalogParams(new URLSearchParams(window.location.search))
    const q = raw.trim().slice(0, 80) || undefined
    if (current.q === q) return
    nav.navigate(catalogHref(locale, current, { q }))
  }

  return (
    <form
      role="search"
      action={`/${locale}/products`}
      method="get"
      onSubmit={(event) => {
        if (!nav) return
        event.preventDefault()
        commit(value)
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <label htmlFor="catalog-search" className="text-small font-semibold text-fg">
          {labels.label}
        </label>
        {caption ? <p className="text-small text-fg-muted">{caption}</p> : null}
      </div>
      <div className="relative mt-3 flex items-stretch rounded-xs border-[1.5px] border-ink bg-paper transition-shadow focus-within:shadow-[0_0_0_3px_var(--color-vermilion)]">
        <SearchIcon size={24} className="pointer-events-none absolute start-5 top-1/2 -translate-y-1/2 text-fg sm:start-6" />
        <input
          ref={input}
          id="catalog-search"
          type="search"
          name="q"
          value={value}
          maxLength={80}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder={labels.placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => {
            const next = event.target.value
            setValue(next)
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => commit(next), DEBOUNCE_MS)
          }}
          className="h-16 min-w-0 flex-1 bg-transparent ps-14 pe-3 text-base text-fg outline-none placeholder:text-fg-muted sm:h-20 sm:ps-16 sm:text-lead [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value ? (
          <button
            type="button"
            aria-label={labels.clear}
            onClick={() => {
              setValue('')
              commit('')
              input.current?.focus()
            }}
            className="my-auto me-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-stone-100 hover:text-fg"
          >
            <CloseIcon size={18} />
          </button>
        ) : null}
        <button
          type="submit"
          className="m-1.5 inline-flex shrink-0 items-center justify-center rounded-xs bg-ink px-5 text-[0.95rem] font-semibold text-paper transition-colors hover:bg-vermilion hover:text-ink sm:px-8"
        >
          {labels.submit}
        </button>
      </div>
      {params.category ? <input type="hidden" name="category" value={params.category} /> : null}
      {params.segment ? <input type="hidden" name="segment" value={params.segment} /> : null}
      {params.manufacturer ? <input type="hidden" name="manufacturer" value={params.manufacturer} /> : null}
    </form>
  )
}
