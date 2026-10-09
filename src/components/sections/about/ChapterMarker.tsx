import { cn } from '@/lib/cn'

/**
 * Editorial chapter marker (About 01–05): an oversized Montserrat index rising first, then a hairline
 * that runs to the inline-end edge. Decorative — each chapter is named by its own h2.
 */
export function ChapterMarker({ index, className }: { index: string; className?: string }) {
  return (
    <div aria-hidden className={cn('flex items-end gap-5 lg:gap-8', className)}>
      <span
        data-reveal="up"
        className="num text-[clamp(3.25rem,1.9rem+4.2vw,7rem)] leading-[0.78] font-semibold tracking-[-0.045em]"
      >
        {index}
      </span>
      <span data-reveal="fade" data-reveal-delay="0.12" className="mb-1.5 h-px flex-1 bg-line" />
    </div>
  )
}
