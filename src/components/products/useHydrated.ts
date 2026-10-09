'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False on the server and during hydration, true afterwards. Lets catalogue controls render a working
 * no-JS fallback (plain link / <details>) and upgrade to the scripted version once hydrated.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
