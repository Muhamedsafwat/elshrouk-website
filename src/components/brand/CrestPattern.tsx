import { cn } from '@/lib/cn'

/**
 * CREST PATTERN (PDF p.14): three overlapping circles from the rooster crest, tone-on-tone at 10–20%.
 * Decorative only — never placed behind text (callers position it in empty areas).
 */
export function CrestPattern({ className, opacity = 0.14, tone = 'ink' }: { className?: string; opacity?: number; tone?: 'ink' | 'paper' }) {
  const color = tone === 'ink' ? '#000000' : '#FFFFFF'
  return (
    <svg aria-hidden focusable="false" className={cn('block size-full', className)} style={{ opacity }}>
      <defs>
        <pattern id={`crest-${tone}`} width="64" height="44" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1.5">
            <circle cx="14" cy="22" r="9" />
            <circle cx="24" cy="22" r="9" />
            <circle cx="19" cy="14" r="9" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#crest-${tone})`} />
    </svg>
  )
}
