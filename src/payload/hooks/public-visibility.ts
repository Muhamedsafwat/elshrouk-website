import type { CollectionBeforeOperationHook, FieldHook, Where } from 'payload'
import { getUser } from '../access'

/**
 * Values the public site hides until they are verified (unverified manufacturer, unapproved label PDF,
 * unapproved author) must not leak through the public REST / GraphQL / Local API either (SEC-04).
 *
 * Field `afterRead` hooks, NOT field `read` access, on purpose: public queries still filter on these fields
 * (catalogue manufacturer filter and facets) and Payload rejects filters on unreadable fields. The verification
 * flag must reach the hook, so collections list it in `forceSelect`.
 */

/**
 * afterRead: returns `null` unless `siblingData[flag] === true`, the reader is staff, or the call overrides access
 * (trusted server code — including the copy of the stored record Payload reads before every update, so hiding a
 * value here can never erase it on save).
 */
export const revealWhen =
  (flag: string): FieldHook =>
  ({ value, siblingData, req, overrideAccess }) => {
    if (value === null || value === undefined) return value
    if (overrideAccess || getUser(req)) return value
    return (siblingData as Record<string, unknown> | undefined)?.[flag] === true ? value : null
  }

/** True when a `where` tree constrains `field` (directly or inside and/or). */
export function whereMentions(where: unknown, field: string): boolean {
  if (Array.isArray(where)) return where.some((node) => whereMentions(node, field))
  if (!where || typeof where !== 'object') return false
  return Object.entries(where).some(
    ([key, value]) => key === field || key.startsWith(`${field}.`) || ((key === 'and' || key === 'or') && whereMentions(value, field)),
  )
}

const sortMentions = (sort: unknown, field: string): boolean =>
  (Array.isArray(sort) ? sort : typeof sort === 'string' ? sort.split(',') : []).some(
    (entry) => String(entry).trim().replace(/^-/, '') === field,
  )

/**
 * beforeOperation: a PUBLIC read/count that filters or sorts on a hidden field only matches records whose flag is
 * set, so `?where[manufacturer][like]=…` cannot be used to guess a hidden value. `fields` maps field → flag.
 * The site's own queries already add these conditions, so their results are unchanged.
 */
export const restrictHiddenFieldQueries =
  (fields: Record<string, string>): CollectionBeforeOperationHook =>
  ({ args, operation, req, overrideAccess }) => {
    const op = operation as string
    if (op !== 'read' && op !== 'find' && op !== 'count') return args
    if (overrideAccess || getUser(req)) return args
    const query = args as { where?: Where; sort?: unknown }
    const conditions: Where[] = Object.entries(fields)
      .filter(([field]) => whereMentions(query.where, field) || sortMentions(query.sort, field))
      .map(([, flag]) => ({ [flag]: { equals: true } }))
    if (conditions.length === 0) return args
    return { ...args, where: query.where ? { and: [query.where, ...conditions] } : { and: conditions } } as typeof args
  }
