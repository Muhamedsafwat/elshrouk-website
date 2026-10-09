import 'server-only'

import config from '@payload-config'
import { getPayload as getPayloadInstance, type Payload } from 'payload'
import { cache } from 'react'

/** Cached per-request Payload Local API instance (in-process; no HTTP round-trip). */
export const getPayload = cache(async (): Promise<Payload> => getPayloadInstance({ config }))
