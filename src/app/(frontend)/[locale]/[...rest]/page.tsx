import { notFound } from 'next/navigation'

/** Any unknown path under a locale renders the designed, localized 404 (spec §6.10). */
export default function CatchAll() {
  notFound()
}
