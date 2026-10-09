import { cn } from '@/lib/cn'

/**
 * VETERINARY GRID (PDF p.14): a modular 4×4 grid — one vermilion module, one black, at most one amber.
 * Static, decorative version for section transitions; the interactive values grid builds on the same rules.
 */
type Cell = 'vermilion' | 'black' | 'amber' | null
const DEFAULT_CELLS: Cell[] = [
  null, null, null, null,
  null, 'vermilion', 'vermilion', null,
  null, null, 'black', null,
  null, 'amber', null, null,
]

export function VetGrid({ className, cells = DEFAULT_CELLS, line = 'rgb(0 0 0 / 0.14)' }: { className?: string; cells?: Cell[]; line?: string }) {
  return (
    <div
      aria-hidden
      className={cn('grid aspect-square grid-cols-4 grid-rows-4', className)}
      style={{ gap: 1, background: line, border: `1px solid ${line}` }}
    >
      {cells.slice(0, 16).map((cell, i) => (
        <span
          key={i}
          className={cn(
            'block',
            cell === 'vermilion' && 'bg-vermilion',
            cell === 'black' && 'bg-ink',
            cell === 'amber' && 'bg-amber',
            !cell && 'bg-stone-100',
          )}
        />
      ))}
    </div>
  )
}
