import 'server-only'

import type { Payload } from 'payload'
import { getPayload } from '@/lib/payload'
import { generateReference } from './reference'
import type { InquiryData } from './schema'

/**
 * Persistence for public inquiries (spec §10.3). Server code writes through the Local API with
 * overrideAccess — the REST `create` stays closed (`access.create: nobody`). The collection hook sets
 * status `new` + history and runs the optional notification; a notification failure never fails the lead.
 *
 * De-duplication, in order:
 *   1. same idempotency key (double click, refresh-resubmit, retry after a lost response) → existing record;
 *   2. same phone + type + product + normalised message within DUPLICATE_WINDOW_MS (two tabs) → existing;
 *   3. a unique-constraint race on the key re-reads and returns the record that won.
 */
export const DUPLICATE_WINDOW_MS = 10 * 60_000

export type ProductSnapshot = { productRef?: number; productLabel?: string }
export type PersistOutcome = { reference: string; existing: boolean }

const fingerprint = (parts: (string | number | null | undefined)[]) =>
  parts
    .map((p) => String(p ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase())
    .join('|')

async function findReferenceByKey(payload: Payload, idempotencyKey: string): Promise<string | null> {
  const { docs } = await payload.find({
    collection: 'inquiries',
    where: { idempotencyKey: { equals: idempotencyKey } },
    overrideAccess: true,
    depth: 0,
    limit: 1,
    pagination: false,
    select: { reference: true },
  })
  return docs[0]?.reference ?? null
}

async function findRecentDuplicate(payload: Payload, data: InquiryData, product: ProductSnapshot): Promise<string | null> {
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString()
  const { docs } = await payload.find({
    collection: 'inquiries',
    where: { and: [{ phone: { equals: data.phone } }, { type: { equals: data.type } }, { createdAt: { greater_than: since } }] },
    overrideAccess: true,
    depth: 0,
    limit: 20,
    pagination: false,
    sort: '-createdAt',
    select: { reference: true, requestDetails: true, productRef: true, productLabel: true },
  })
  const wanted = fingerprint([data.message, product.productRef, product.productLabel])
  const match = docs.find(
    (doc) =>
      fingerprint([
        doc.requestDetails,
        typeof doc.productRef === 'object' && doc.productRef ? doc.productRef.id : doc.productRef,
        doc.productLabel,
      ]) === wanted,
  )
  return match?.reference ?? null
}

async function referenceTaken(payload: Payload, reference: string): Promise<boolean> {
  const { totalDocs } = await payload.count({ collection: 'inquiries', where: { reference: { equals: reference } }, overrideAccess: true })
  return totalDocs > 0
}

export async function persistInquiry(data: InquiryData, product: ProductSnapshot): Promise<PersistOutcome> {
  const payload = await getPayload()

  const byKey = await findReferenceByKey(payload, data.idempotencyKey)
  if (byKey) return { reference: byKey, existing: true }
  const duplicate = await findRecentDuplicate(payload, data, product)
  if (duplicate) return { reference: duplicate, existing: true }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = generateReference()
    try {
      await payload.create({
        collection: 'inquiries',
        overrideAccess: true,
        data: {
          reference,
          type: data.type,
          status: 'new',
          name: data.name,
          phone: data.phone,
          email: data.email,
          organization: data.organization,
          role: data.role,
          governorate: data.governorate,
          segment: data.segment,
          productCategory: data.productCategory,
          productRef: product.productRef,
          productLabel: product.productLabel,
          birdCapacity: data.birdCapacity,
          quantity: data.quantity,
          productLine: data.productLine,
          requestDetails: data.message,
          locale: data.locale,
          sourcePath: data.sourcePath,
          consentAt: new Date().toISOString(),
          idempotencyKey: data.idempotencyKey,
        },
      })
      return { reference, existing: false }
    } catch (error) {
      // Lost a race on the idempotency key → the other request stored this exact submission.
      const winner = await findReferenceByKey(payload, data.idempotencyKey).catch(() => null)
      if (winner) return { reference: winner, existing: true }
      // Reference collision → retry with a fresh reference; anything else is a real failure.
      if (!(await referenceTaken(payload, reference).catch(() => false))) throw error
    }
  }
  throw new Error('InquiryReferenceExhausted')
}
