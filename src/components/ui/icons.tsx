import type { SVGProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * Brand icon grammar (PDF p.16): 24-unit grid · 2-unit stroke · round caps & joins · no fills.
 * Black on light, white on dark (currentColor); vermilion for one active state only.
 * Directional icons point to the inline END in LTR and are mirrored in RTL via `rtl:-scale-x-100`.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number; title?: string }

function Icon({ size = 24, title, className, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={cn('shrink-0', className)}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export const ArrowIcon = ({ className, ...p }: IconProps) => (
  <Icon className={cn('rtl:-scale-x-100', className)} {...p}>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </Icon>
)

export const ArrowUpIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20V5" />
    <path d="M6 11l6-6 6 6" />
  </Icon>
)

export const ArrowDiagonalIcon =({ className, ...p }: IconProps) => (
  <Icon className={cn('rtl:-scale-x-100', className)} {...p}>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Icon>
)

export const ChevronIcon = ({ className, ...p }: IconProps) => (
  <Icon className={className} {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
)

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Icon>
)

export const MinusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
)

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </Icon>
)

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8h16" />
    <path d="M4 16h10" />
  </Icon>
)

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6" />
    <path d="M20 20l-4.5-4.5" />
  </Icon>
)

export const FilterIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h10" />
    <path d="M18 7h2" />
    <circle cx="16" cy="7" r="2" />
    <path d="M4 17h2" />
    <path d="M10 17h10" />
    <circle cx="8" cy="17" r="2" />
  </Icon>
)

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
)

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <path d="M12 16.5h.01" />
  </Icon>
)

export const DownloadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4v11" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 20h14" />
  </Icon>
)

export const ExternalIcon = ({ className, ...p }: IconProps) => (
  <Icon className={cn('rtl:-scale-x-100', className)} {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Icon>
)

export const LinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  </Icon>
)

/* ---- Category icons (own drawings in the brand grammar) ---- */

/** Poultry feed — grain kernels. */
export const FeedIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21V9" />
    <path d="M12 13c-2.8 0-4.5-1.6-4.5-4 2.8 0 4.5 1.6 4.5 4z" />
    <path d="M12 13c2.8 0 4.5-1.6 4.5-4-2.8 0-4.5 1.6-4.5 4z" />
    <path d="M12 9c-2.2 0-3.5-1.3-3.5-3.2 2.2 0 3.5 1.3 3.5 3.2z" />
    <path d="M12 9c2.2 0 3.5-1.3 3.5-3.2-2.2 0-3.5 1.3-3.5 3.2z" />
    <path d="M12 5.8V3" />
  </Icon>
)

/** Feed supplements — measuring scoop with granules. */
export const SupplementIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12h11a0 0 0 0 1 0 0 5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" />
    <path d="M14 13l7-3" />
    <path d="M6.5 8.5h.01" />
    <path d="M9.5 6.5h.01" />
    <path d="M11 9.5h.01" />
  </Icon>
)

/** Veterinary medicine — flask (after the PDF "Medicine" pictogram grammar). */
export const MedicineIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 3h6" />
    <path d="M10 3v6.2L5.3 17.4A2.4 2.4 0 0 0 7.4 21h9.2a2.4 2.4 0 0 0 2.1-3.6L14 9.2V3" />
    <path d="M7.5 15h9" />
  </Icon>
)

/** Veterinary vaccine — syringe. */
export const VaccineIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M18 3l3 3" />
    <path d="M19.5 4.5L15 9" />
    <path d="M16.5 7.5L8 16l-3 .5.5-3L14 5z" />
    <path d="M10.5 8.5l2 2" />
    <path d="M8 11l2 2" />
    <path d="M5.5 16.5L3 21" />
  </Icon>
)

/** Broilers — growth curve inside a circle (abstract; no cartoon birds). */
export const BroilerIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M7 15.5c2-.3 3.6-1.6 4.6-3.6S14.4 8.6 17 8.5" />
    <circle cx="17" cy="8.5" r="0.6" />
  </Icon>
)

/** Layers — egg. */
export const LayerIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3c3.6 0 6.5 5.4 6.5 9.6A6.5 6.5 0 0 1 12 19a6.5 6.5 0 0 1-6.5-6.4C5.5 8.4 8.4 3 12 3z" />
    <path d="M9 14.5a3 3 0 0 0 3 2" />
  </Icon>
)

/** Breeders — two overlapping circles (parent stock), echoing the crest pattern. */
export const BreederIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="12" r="5.5" />
    <circle cx="15" cy="12" r="5.5" />
  </Icon>
)

/** Veterinary — crosshair circle (PDF "Veterinary" pictogram grammar). */
export const VeterinaryIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4v16" />
    <path d="M4 12h16" />
  </Icon>
)

export const CATEGORY_ICONS = {
  feed: FeedIcon,
  supplements: SupplementIcon,
  medicines: MedicineIcon,
  vaccines: VaccineIcon,
} as const

export const SEGMENT_ICONS = {
  broilers: BroilerIcon,
  layers: LayerIcon,
  breeders: BreederIcon,
} as const
