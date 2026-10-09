/** Replaces {placeholders} in dictionary strings. Unknown placeholders are left intact (visible in QA). */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match,
  )
}

/** Brand rule: Western digits 0–9 in both locales (PDF p.13). */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

export function formatDate(iso: string, locale: 'ar' | 'en'): string {
  // Arabic month names with Western digits (nu-latn) keep the brand's numeral rule.
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
