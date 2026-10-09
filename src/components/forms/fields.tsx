'use client'

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertIcon, CheckIcon, ChevronIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

/**
 * Form primitives (spec §6.8, §12.2): every control has a visible <label>, optional/required marker,
 * help text and an error message wired through aria-describedby + aria-invalid. 56px controls, 16px+
 * text (no iOS zoom), logical-direction padding, error colour never the only signal (icon + text).
 */

type FieldShellProps = {
  id: string
  label: string
  marker?: string
  help?: string
  error?: string
  children: ReactNode
  className?: string
}

export function FieldShell({ id, label, marker, help, error, children, className }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-small font-semibold text-fg">
        {label}
        {marker ? <span className="ms-1.5 font-normal text-fg-muted">{marker}</span> : null}
      </label>
      {children}
      {help && !error ? (
        <p id={`${id}-help`} className="text-caption text-fg-muted">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-caption font-medium text-vermilion-deep">
          <AlertIcon size={16} className="mt-0.5" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
}

const control =
  'w-full rounded-xs border-[1.5px] border-stone-300 bg-paper px-4 text-base text-ink placeholder:text-stone-500 ' +
  'transition-[border-color,box-shadow] duration-200 hover:border-stone-500 ' +
  'focus:border-ink focus:outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-vermilion ' +
  'aria-[invalid=true]:border-vermilion-deep disabled:bg-stone-100 disabled:text-stone-500'

const describedBy = (id: string, help?: string, error?: string) =>
  [error ? `${id}-error` : null, help && !error ? `${id}-help` : null].filter(Boolean).join(' ') || undefined

type BaseProps = { label: string; marker?: string; help?: string; error?: string; className?: string; inputClassName?: string }

export const TextField = forwardRef<HTMLInputElement, BaseProps & InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { label, marker, help, error, className, inputClassName, id, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} marker={marker} help={help} error={error} className={className}>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fieldId, help, error)}
        className={cn(control, 'h-14', inputClassName)}
        {...rest}
      />
    </FieldShell>
  )
})

export const TextAreaField = forwardRef<HTMLTextAreaElement, BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextAreaField({ label, marker, help, error, className, inputClassName, id, rows = 5, ...rest }, ref) {
    const autoId = useId()
    const fieldId = id ?? autoId
    return (
      <FieldShell id={fieldId} label={label} marker={marker} help={help} error={error} className={className}>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, help, error)}
          className={cn(control, 'min-h-36 resize-y py-3.5 leading-relaxed', inputClassName)}
          {...rest}
        />
      </FieldShell>
    )
  },
)

export const SelectField = forwardRef<
  HTMLSelectElement,
  BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder?: string }
>(function SelectField({ label, marker, help, error, className, inputClassName, id, options, placeholder, ...rest }, ref) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} marker={marker} help={help} error={error} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, help, error)}
          className={cn(control, 'h-14 appearance-none pe-12', inputClassName)}
          {...rest}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronIcon size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-stone-600" />
      </div>
    </FieldShell>
  )
})

export const CheckboxField = forwardRef<
  HTMLInputElement,
  { label: ReactNode; error?: string; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>
>(function CheckboxField({ label, error, className, id, ...rest }, ref) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-start gap-3">
        <span className="relative mt-0.5 inline-flex size-6 shrink-0">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className="peer size-6 cursor-pointer appearance-none rounded-xs border-[1.5px] border-stone-400 bg-paper transition-colors checked:border-ink checked:bg-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-vermilion aria-[invalid=true]:border-vermilion-deep"
            {...rest}
          />
          <CheckIcon size={16} className="pointer-events-none absolute inset-0 m-auto text-paper opacity-0 peer-checked:opacity-100" />
        </span>
        <label htmlFor={fieldId} className="cursor-pointer text-small leading-relaxed text-fg-soft">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${fieldId}-error`} className="flex items-start gap-1.5 text-caption font-medium text-vermilion-deep">
          <AlertIcon size={16} className="mt-0.5" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  )
})

/** Radio group rendered as selectable cards (e.g. inquiry type). Native radios → arrow-key navigation. */
export function ChoiceCards({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  className,
  columns = 2,
  dense = false,
  id,
}: {
  name: string
  legend: string
  options: { value: string; label: string; description?: string }[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  className?: string
  columns?: 2 | 4
  /** Two columns at every width; descriptions appear only when the nearest @container is ≥ 42rem. */
  dense?: boolean
  /** id of the fieldset (error-summary target). */
  id?: string
}) {
  const groupId = useId()
  return (
    <fieldset id={id} tabIndex={id ? -1 : undefined} className={cn('flex flex-col gap-3 focus:outline-none', className)} aria-describedby={error ? `${groupId}-error` : undefined}>
      <legend className="mb-3 text-small font-semibold text-fg">{legend}</legend>
      <div className={cn('grid gap-3', dense ? 'grid-cols-2 gap-2.5' : columns === 4 ? 'sm:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2')}>
        {options.map((o) => {
          const id = `${groupId}-${o.value}`
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cn('group relative flex cursor-pointer flex-col gap-1 rounded-xs border-[1.5px] border-stone-300 bg-paper transition-colors', dense ? 'p-3.5 @2xl:p-4' : 'p-4', ' hover:border-stone-500 has-[:checked]:border-ink has-[:checked]:bg-stone-50 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-vermilion')}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={o.value}
                checked={value === undefined ? undefined : value === o.value}
                onChange={(e) => onChange?.(e.target.value)}
                className="peer sr-only"
              />
              <span className="flex items-center justify-between gap-3">
                <span className="font-semibold text-fg">{o.label}</span>
                <span
                  aria-hidden
                  className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-stone-400 peer-checked:border-ink group-has-[:checked]:border-ink"
                >
                  <span className="size-2.5 scale-0 rounded-full bg-vermilion transition-transform group-has-[:checked]:scale-100" />
                </span>
              </span>
              {o.description ? (
                <span className={cn('text-caption leading-relaxed text-fg-muted', dense && 'hidden @2xl:block')}>{o.description}</span>
              ) : null}
            </label>
          )
        })}
      </div>
      {error ? (
        <p id={`${groupId}-error`} className="flex items-start gap-1.5 text-caption font-medium text-vermilion-deep">
          <AlertIcon size={16} className="mt-0.5" />
          <span>{error}</span>
        </p>
      ) : null}
    </fieldset>
  )
}
