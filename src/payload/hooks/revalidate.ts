import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Content edits must reach the public site predictably (spec §9.3).
 * The site is small, so any published-content change revalidates every localized route.
 * Outside a Next.js runtime (seed scripts, CLI) revalidation is unavailable and silently skipped.
 */
export async function revalidateSite(reason: string): Promise<void> {
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/[locale]', 'layout')
    revalidatePath('/sitemap.xml')
  } catch {
    if (process.env.NODE_ENV !== 'test') {
      console.info(`[revalidate] skipped (${reason}) — not running inside Next.js`)
    }
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ collection, doc }) => {
  await revalidateSite(`${collection.slug} changed`)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc }) => {
  await revalidateSite(`${collection.slug} deleted`)
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = async ({ global, doc }) => {
  await revalidateSite(`${global.slug} changed`)
  return doc
}
