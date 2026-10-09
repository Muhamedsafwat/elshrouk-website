'use client'

import Link from 'next/link'
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Button, ButtonLink } from '@/components/ui/Button'
import { AlertIcon, CloseIcon } from '@/components/ui/icons'
import { trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/cn'
import { submitInquiry } from '@/lib/inquiries/action'
import { formDataToInput } from '@/lib/inquiries/form-data'
import {
  FIELD_LIMITS,
  PRODUCT_CATEGORY_OPTIONS,
  PRODUCTION_TYPES,
  fieldErrors,
  inquirySchema,
  isInquiryKind,
  type ErrorCode,
  type InquiryKind,
  type InquiryResult,
} from '@/lib/inquiries/schema'
import { CheckboxField, ChoiceCards, SelectField, TextAreaField, TextField } from './fields'
import type { InquiryFormProps } from './InquiryForm'
import type { FailureCode, InquiryFormStrings } from './inquiry-strings'

type ClientProps = InquiryFormProps & { strings: InquiryFormStrings; privacyHref: string }

type FieldName =
  | 'name'
  | 'phone'
  | 'email'
  | 'organization'
  | 'role'
  | 'segment'
  | 'birdCapacity'
  | 'governorate'
  | 'productCategory'
  | 'quantity'
  | 'productLine'
  | 'message'
type ErrorKey = FieldName | 'type' | 'consent'
type Errors = Partial<Record<ErrorKey, ErrorCode>>
type Outcome = InquiryResult | { ok: false; error: 'network' }

/** Fields per inquiry kind (spec §4.3, §11.1–11.3). Order = visual order = error-summary order. */
const LAYOUT: Record<InquiryKind, { about: FieldName[]; need: FieldName[] }> = {
  farm: { about: ['name', 'phone', 'organization'], need: ['segment', 'birdCapacity', 'governorate', 'productCategory', 'message'] },
  product: { about: ['name', 'phone'], need: ['productCategory', 'quantity', 'message'] },
  partner: { about: ['organization', 'role', 'name', 'phone', 'email'], need: ['productLine', 'message'] },
  general: { about: ['name', 'phone', 'email'], need: ['message'] },
}
const REQUIRED: Record<InquiryKind, FieldName[]> = {
  farm: ['name', 'phone', 'segment'],
  product: ['name', 'phone'],
  partner: ['organization', 'role', 'name', 'phone', 'productLine', 'message'],
  general: ['name', 'phone', 'message'],
}

function fieldsFor(kind: InquiryKind, variant: 'full' | 'compact', hasProduct: boolean) {
  const { about, need } = LAYOUT[kind]
  if (variant === 'full') return { about, need }
  const drop = new Set<FieldName>(['email', 'birdCapacity', 'governorate', 'quantity'])
  if (kind !== 'partner') drop.add('organization')
  if (kind === 'farm' || hasProduct) drop.add('productCategory')
  return { about: about.filter((f) => !drop.has(f)), need: need.filter((f) => !drop.has(f)) }
}

/** RFC 4122 v4 — `crypto.randomUUID` needs a secure context, so fall back to getRandomValues. */
function newIdempotencyKey(): string {
  const c = globalThis.crypto
  if (typeof c.randomUUID === 'function') return c.randomUUID()
  const b = c.getRandomValues(new Uint8Array(16))
  b[6] = ((b[6] ?? 0) & 0x0f) | 0x40
  b[8] = ((b[8] ?? 0) & 0x3f) | 0x80
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

const noopSubscribe = () => () => {}
/** false during SSR + hydration, true afterwards (no effect + setState needed). */
const useEnhanced = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

export function InquiryFormClient(props: ClientProps) {
  // A new session (fresh idempotency key, empty fields) after "send another".
  const [session, setSession] = useState(0)
  return (
    <div id={props.id} className={cn('@container scroll-mt-28', props.className)}>
      {props.title || props.intro ? (
        <header className={cn('flex flex-col gap-4', props.variant === 'compact' ? 'mb-8' : 'mb-10 @2xl:mb-12')}>
          {props.title ? (
            <h2 className={cn('font-bold text-balance text-fg', props.variant === 'compact' ? 'text-display-md' : 'text-display-lg')}>
              {props.title}
            </h2>
          ) : null}
          {props.intro ? <p className="measure text-lead text-fg-soft">{props.intro}</p> : null}
        </header>
      ) : null}
      <InquirySession key={session} {...props} onAnother={() => setSession((n) => n + 1)} />
    </div>
  )
}

function InquirySession({
  locale,
  kind: initialKind,
  lockKind = false,
  segment,
  product: initialProduct,
  productCategory,
  variant = 'full',
  sourcePath,
  strings: s,
  privacyHref,
  onAnother,
}: ClientProps & { onAnother: () => void }) {
  // No-JS fallback only: a native POST runs the server action and re-renders this hook with its result.
  const [noJsState, noJsAction] = useActionState(submitInquiry, null)
  const [result, setResult] = useState<Outcome | null>(null)
  const [pending, startTransition] = useTransition()
  const [kind, setKind] = useState<InquiryKind>(initialKind ?? 'farm')
  const [product, setProduct] = useState(initialProduct ?? null)
  const [errors, setErrors] = useState<Errors>({})
  const [summaryFocus, setSummaryFocus] = useState(0)
  const enhanced = useEnhanced()

  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const keyRef = useRef<string | null>(null) // one key per session, re-used on every retry
  const inFlight = useRef(false)
  const attempted = useRef(false)

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const fid = (name: string) => `inq-${uid}-${name}`

  const hasProduct = kind === 'product' && !!product
  const { about, need } = fieldsFor(kind, variant, hasProduct)
  const visible: ErrorKey[] = [...(lockKind ? [] : (['type'] as ErrorKey[])), ...about, ...need, 'consent']

  const outcome: Outcome | null = result ?? noJsState
  const shownErrors: Errors =
    Object.keys(errors).length > 0 || result ? errors : noJsState && !noJsState.ok && noJsState.error === 'validation' ? pick(noJsState.fields) : {}
  const failure: FailureCode | null =
    outcome && !outcome.ok && outcome.error !== 'validation'
      ? outcome.error
      : outcome && !outcome.ok && outcome.error === 'validation' && Object.keys(pick(outcome.fields)).length === 0
        ? 'server' // only hidden context fields failed (tampering / stale page) — nothing the visitor can fix
        : null

  useEffect(() => {
    if (summaryFocus > 0) summaryRef.current?.focus()
  }, [summaryFocus])

  function pick(fields: Partial<Record<string, ErrorCode>>): Errors {
    const out: Errors = {}
    for (const key of visible) if (fields[key]) out[key] = fields[key]
    return out
  }

  function currentErrors(): Errors {
    const form = formRef.current
    if (!form) return {}
    const parsed = inquirySchema.safeParse(formDataToInput(new FormData(form)))
    return parsed.success ? {} : pick(fieldErrors(parsed.error))
  }

  // After the first attempt: fixing a field clears its error while typing; leaving a field re-checks everything.
  const onChange = () => {
    if (!attempted.current) return
    const next = currentErrors()
    setErrors((prev) => {
      const kept: Errors = {}
      for (const key of Object.keys(prev) as ErrorKey[]) if (next[key]) kept[key] = next[key]
      return kept
    })
  }
  const onBlur = () => {
    if (attempted.current) setErrors(currentErrors())
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // JS path: validate, then call the action directly (network errors stay recoverable)
    if (inFlight.current) return // double click / double Enter: one request per session at a time
    attempted.current = true
    const formData = new FormData(event.currentTarget)
    keyRef.current ??= newIdempotencyKey()
    formData.set('idempotencyKey', keyRef.current)

    const parsed = inquirySchema.safeParse(formDataToInput(formData))
    const clientErrors = parsed.success ? {} : pick(fieldErrors(parsed.error))
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      setResult(null)
      setSummaryFocus((n) => n + 1)
      trackEvent('form_submit_error', { kind, source: 'validation' })
      return
    }

    setErrors({})
    setResult(null)
    inFlight.current = true
    startTransition(async () => {
      let next: Outcome
      try {
        next = (await submitInquiry(null, formData)) ?? { ok: false, error: 'network' }
      } catch {
        next = { ok: false, error: 'network' }
      }
      inFlight.current = false
      startTransition(() => {
        setResult(next)
        if (!next.ok && next.error === 'validation') {
          const serverErrors = pick(next.fields)
          setErrors(serverErrors)
          if (Object.keys(serverErrors).length > 0) setSummaryFocus((n) => n + 1)
        }
      })
      if (next.ok) trackEvent('form_submit_success', { kind })
      else trackEvent('form_submit_error', { kind, source: next.error })
    })
  }

  if (outcome?.ok) {
    return <SuccessPanel reference={outcome.reference} strings={s} anotherHref={sourcePath} onAnother={onAnother} />
  }

  const errorText = (key: ErrorKey) => (shownErrors[key] ? s.errors[shownErrors[key]] : undefined)
  const marker = (name: FieldName) => (REQUIRED[kind].includes(name) ? undefined : s.optional)
  const isRequired = (name: FieldName) => REQUIRED[kind].includes(name) || undefined
  const labelFor = (key: ErrorKey): string => {
    if (key === 'type') return s.typeLegend
    if (key === 'consent') return s.consent.fieldLabel
    if (key === 'organization' && kind === 'partner') return s.fields.company.label
    if (key === 'role' && kind === 'partner') return s.fields.partnerRole.label
    return s.fields[key].label
  }
  const wide = (name: FieldName) => name === 'message' || name === 'productLine' || (name === 'organization' && kind === 'farm')
  const ltrInput = 'rtl:text-right'

  const renderField = (name: FieldName) => {
    const base = {
      id: fid(name),
      name,
      error: errorText(name),
      marker: marker(name),
      required: isRequired(name),
      className: wide(name) ? '@lg:col-span-2' : undefined,
    }
    switch (name) {
      case 'name':
        return <TextField key={name} {...base} label={s.fields.name.label} autoComplete="name" maxLength={FIELD_LIMITS.name} />
      case 'phone':
        return (
          <TextField
            key={name}
            {...base}
            label={s.fields.phone.label}
            placeholder={s.fields.phone.placeholder}
            help={s.fields.phone.help}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            inputClassName={ltrInput}
            maxLength={FIELD_LIMITS.phone}
          />
        )
      case 'email':
        return (
          <TextField
            key={name}
            {...base}
            label={s.fields.email.label}
            placeholder={s.fields.email.placeholder}
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            inputClassName={ltrInput}
            maxLength={FIELD_LIMITS.email}
          />
        )
      case 'organization': {
        const field = kind === 'partner' ? s.fields.company : s.fields.organization
        return <TextField key={name} {...base} label={field.label} autoComplete="organization" maxLength={FIELD_LIMITS.organization} />
      }
      case 'role': {
        const field = kind === 'partner' ? s.fields.partnerRole : s.fields.role
        return (
          <TextField
            key={name}
            {...base}
            label={field.label}
            placeholder={field.placeholder}
            autoComplete="organization-title"
            maxLength={FIELD_LIMITS.role}
          />
        )
      }
      case 'segment':
        return (
          <SelectField
            key={name}
            {...base}
            label={s.fields.segment.label}
            placeholder={s.fields.segment.placeholder}
            help={s.fields.segment.help}
            defaultValue={segment ?? ''}
            options={PRODUCTION_TYPES.map((v) => ({ value: v, label: s.options.productionTypes[v] }))}
          />
        )
      case 'birdCapacity':
        return (
          <TextField
            key={name}
            {...base}
            label={s.fields.birdCapacity.label}
            placeholder={s.fields.birdCapacity.placeholder}
            help={s.fields.birdCapacity.help}
            maxLength={FIELD_LIMITS.birdCapacity}
          />
        )
      case 'governorate':
        return (
          <SelectField
            key={name}
            {...base}
            label={s.fields.governorate.label}
            placeholder={s.fields.governorate.placeholder}
            defaultValue=""
            options={s.options.governorates}
          />
        )
      case 'productCategory':
        return (
          <SelectField
            key={name}
            {...base}
            label={s.fields.productCategory.label}
            placeholder={s.fields.productCategory.placeholder}
            defaultValue={productCategory ?? ''}
            options={PRODUCT_CATEGORY_OPTIONS.map((v) => ({ value: v, label: s.options.productCategories[v] }))}
          />
        )
      case 'quantity':
        return (
          <TextField
            key={name}
            {...base}
            label={s.fields.quantity.label}
            placeholder={s.fields.quantity.placeholder}
            help={s.fields.quantity.help}
            maxLength={FIELD_LIMITS.quantity}
          />
        )
      case 'productLine':
        return (
          <TextField
            key={name}
            {...base}
            label={s.fields.productLine.label}
            placeholder={s.fields.productLine.placeholder}
            maxLength={FIELD_LIMITS.productLine}
          />
        )
      case 'message': {
        const field = kind === 'partner' ? s.fields.partnerMessage : s.fields.message
        return (
          <TextAreaField
            key={name}
            {...base}
            label={field.label}
            placeholder={field.placeholder}
            help={field.help}
            rows={variant === 'compact' ? 4 : 6}
            maxLength={FIELD_LIMITS.message}
          />
        )
      }
    }
  }

  const summaryKeys = visible.filter((key) => shownErrors[key])
  const allShown = new Set<string>([...about, ...need])
  const statusText = pending ? s.submitting : failure ? `${s.failure.title}. ${s.errors[failure]}` : ''

  return (
    <form
      ref={formRef}
      action={noJsAction}
      onSubmit={onSubmit}
      onChange={onChange}
      onBlur={onBlur}
      noValidate={enhanced}
      aria-busy={pending || undefined}
      className="flex flex-col gap-10"
    >
      {summaryKeys.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="group"
          aria-labelledby={fid('summary-title')}
          aria-describedby={fid('summary-list')}
          className="border-s-4 border-vermilion-deep bg-stone-50 p-5 focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-vermilion @lg:p-6"
        >
          <p id={fid('summary-title')} className="flex items-center gap-2 font-bold text-ink">
            <AlertIcon size={20} className="shrink-0 text-vermilion-deep" />
            {s.errors.summaryTitle}
          </p>
          <ul id={fid('summary-list')} className="mt-3 flex flex-col gap-1.5 ps-7 text-small">
            {summaryKeys.map((key) => (
              <li key={key}>
                <a
                  href={`#${fid(key)}`}
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault()
                    const target = document.getElementById(fid(key))
                    target?.focus()
                    target?.scrollIntoView({ block: 'center' })
                  }}
                  className="font-medium text-ink underline decoration-vermilion-deep decoration-1 underline-offset-4 hover:decoration-2"
                >
                  {labelFor(key)}: {s.errors[shownErrors[key]!]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {lockKind ? (
        <input type="hidden" name="type" value={kind} />
      ) : (
        <div className="flex flex-col gap-3">
          <ChoiceCards
            id={fid('type')}
            name="type"
            legend={s.typeLegend}
            dense
            value={kind}
            error={errorText('type')}
            onChange={(value) => {
              if (!isInquiryKind(value)) return
              setKind(value)
              setErrors((prev) => {
                const next: Errors = {}
                const keep = new Set<string>([...LAYOUT[value].about, ...LAYOUT[value].need, 'consent'])
                for (const key of Object.keys(prev) as ErrorKey[]) if (keep.has(key)) next[key] = prev[key]
                return next
              })
            }}
            options={(['farm', 'product', 'partner', 'general'] as const).map((k) => ({
              value: k,
              label: s.types[k].title,
              description: s.types[k].description,
            }))}
          />
          <p className="text-caption leading-relaxed text-fg-muted @2xl:hidden">{s.types[kind].description}</p>
        </div>
      )}

      <Section index="01" title={s.sections.about} compact={variant === 'compact'}>
        {about.map(renderField)}
      </Section>

      <Section index="02" title={s.sections.need} compact={variant === 'compact'}>
        {hasProduct && product ? (
          <div className="flex items-start justify-between gap-4 rounded-xs border-[1.5px] border-ink bg-stone-50 p-4 @lg:col-span-2 @lg:p-5">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-caption font-semibold text-fg-muted">{s.product.label}</span>
              <span className="text-body font-bold text-ink">{product.label}</span>
              <span className="text-caption text-fg-muted">{s.product.hint}</span>
            </div>
            <button
              type="button"
              onClick={() => setProduct(null)}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xs px-2 text-small font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-vermilion"
            >
              <CloseIcon size={16} />
              {s.product.clear}
            </button>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="productLabel" value={product.label} />
          </div>
        ) : null}
        {need.map(renderField)}
      </Section>

      {/* Prefilled context that has no visible control in this variant. */}
      {productCategory && !allShown.has('productCategory') ? <input type="hidden" name="productCategory" value={productCategory} /> : null}
      {segment && !allShown.has('segment') ? <input type="hidden" name="segment" value={segment} /> : null}
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="sourcePath" value={sourcePath} />

      {/* Honeypot: invisible to people and assistive tech, skipped by keyboard. Bots fill it; the server rejects. */}
      <div aria-hidden="true" className="pointer-events-none absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]">
        <label htmlFor={fid('website')}>{s.honeypotLabel}</label>
        <input id={fid('website')} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-8">
        <CheckboxField id={fid('consent')} name="consent" value="yes" required label={s.consent.label} error={errorText('consent')} />
        <Link
          href={privacyHref}
          target="_blank"
          rel="noopener"
          className="link-sweep ms-9 self-start text-small font-semibold text-ink"
        >
          {s.consent.privacyLink}
          <span className="sr-only"> {s.consent.newTab}</span>
        </Link>
      </div>

      {failure ? (
        <div className="flex gap-3 border-s-4 border-vermilion-deep bg-stone-50 p-5 @lg:p-6">
          <AlertIcon size={22} className="mt-0.5 shrink-0 text-vermilion-deep" />
          <div className="flex flex-col items-start gap-2">
            <p className="font-bold text-ink">{s.failure.title}</p>
            <p className="text-small leading-relaxed text-stone-700">{s.errors[failure]}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 @lg:flex-row @lg:items-center @lg:gap-6">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          arrow={!pending}
          aria-disabled={pending || undefined}
          className="w-full @lg:w-auto @lg:min-w-64"
        >
          {pending ? s.submitting : failure ? s.failure.retry : s.submit}
        </Button>
        <p role="status" aria-live="polite" className="sr-only">
          {statusText}
        </p>
      </div>
    </form>
  )
}

function Section({ index, title, compact, children }: { index: string; title: string; compact: boolean; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-line pt-6">
      <legend className="float-start w-full pb-6">
        <span className="flex items-baseline gap-3">
          <span className="num text-caption font-semibold tracking-wide text-fg-muted">{index}</span>
          <span className={cn('font-bold text-fg', compact ? 'text-body' : 'text-title')}>{title}</span>
        </span>
      </legend>
      <div className="clear-both grid gap-x-6 gap-y-7 @lg:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function SuccessPanel({
  reference,
  strings: s,
  anotherHref,
  onAnother,
}: {
  reference: string
  strings: InquiryFormStrings
  anotherHref: string
  onAnother: () => void
}) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus()
  }, [])
  const [before, after = ''] = s.success.body.split('{reference}')
  return (
    <div className="flex flex-col gap-8 border-t-2 border-ink pt-8">
      <div className="flex flex-col gap-4">
        <h3 ref={headingRef} tabIndex={-1} className="text-display-md font-bold text-fg focus:outline-none">
          {s.success.title}
        </h3>
        <p className="measure text-lead text-fg-soft">
          {before}
          <bdi className="num font-semibold whitespace-nowrap text-fg">{reference}</bdi>
          {after}
        </p>
      </div>
      <div className="flex flex-col gap-2 border-y border-line py-6">
        <span className="text-caption font-semibold text-fg-muted">{s.success.referenceLabel}</span>
        <bdi
          dir="ltr"
          data-inquiry-reference=""
          className="num self-start text-[clamp(2rem,9cqi,3.75rem)] leading-none font-bold tracking-tight whitespace-nowrap text-vermilion"
        >
          {reference}
        </bdi>
      </div>
      <ButtonLink
        href={anotherHref}
        variant="outline"
        arrow={false}
        className="self-start"
        onClick={(e) => {
          e.preventDefault()
          onAnother()
        }}
      >
        {s.success.another}
      </ButtonLink>
    </div>
  )
}
