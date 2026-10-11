/**
 * Hidden-state offset (yPercent of the line's own height) for `.mask-line > span` reveals.
 * Must match `translate3d(0, 170%, 0)` in globals.css (`@keyframes als-rise` and the `[data-reveal='lines']`
 * initial state). The mask's clip box now reaches 0.46em below the line box and Arabic ink rises up to 0.27em
 * above it, so a line is only fully hidden at ≥ 1 + 0.73 / line-height (≈ 165% for the tightest 1.12).
 */
export const MASK_HIDDEN_Y_PERCENT = 170

/** Line reveal timing shared by every heading in a batch (VQA-04: headings must not trail their body copy). */
export const LINE_REVEAL = { duration: 0.8, stagger: 0.08 } as const
