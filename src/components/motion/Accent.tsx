import type { ReactNode } from 'react'

/**
 * Two-tone display headline helper: wraps the first occurrence of `phrase` in vermilion.
 * Only use at display sizes (≥ 32px) — vermilion text is 3.7:1 on white/black (large text only).
 * If the phrase is absent (e.g. the CMS changed the copy) the line renders unchanged.
 */
export function accent(line: string, phrase?: string, className = 'text-vermilion'): ReactNode {
  if (!phrase) return line
  const i = line.indexOf(phrase)
  if (i === -1) return line
  return (
    <>
      {line.slice(0, i)}
      <span className={className}>{phrase}</span>
      {line.slice(i + phrase.length)}
    </>
  )
}
