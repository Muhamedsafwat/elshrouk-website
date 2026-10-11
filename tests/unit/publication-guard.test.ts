import { afterEach, describe, expect, it } from 'vitest'
import { canApproveContent, publicContentWhere } from '@/payload/access'
import { Articles } from '@/payload/collections/Articles'
import { Media } from '@/payload/collections/Media'
import { Products } from '@/payload/collections/Products'
import { Metrics } from '@/payload/globals/Metrics'
import { approvalGuard, resetOnDuplicate } from '@/payload/hooks/approval-guard'
import { restrictHiddenFieldQueries, revealWhen, whereMentions } from '@/payload/hooks/public-visibility'

type GuardArgs = Parameters<typeof approvalGuard>[0]
type User = { role: 'admin' | 'editor' | 'sales'; canApprove?: boolean }
type Doc = Record<string, unknown>

const req = (user?: User) => ({ user: user ? { id: 1, collection: 'users', ...user } : null }) as unknown as GuardArgs['req']

const run = (data: Doc, originalDoc: Doc | undefined, user?: User, operation?: 'create' | 'update') =>
  approvalGuard({ data, originalDoc, req: req(user), operation: operation ?? (originalDoc ? 'update' : 'create') } as unknown as GuardArgs) as Doc

/** The thrown error's HTTP status (APIError), or null when nothing was thrown. */
const statusOf = (fn: () => unknown): number | null => {
  try {
    fn()
    return null
  } catch (error) {
    return (error as { status?: number }).status ?? -1
  }
}

const EDITOR: User = { role: 'editor', canApprove: false }
const APPROVER: User = { role: 'editor', canApprove: true }
const ADMIN: User = { role: 'admin' }
const live: Doc = { approvalStatus: 'approved', isPublished: true, nameAr: 'منتج' }

describe('publication guard (spec §1.3, §10.2)', () => {
  afterEach(() => {
    delete process.env.DEMO_FIXTURES
  })

  it('public reads require approved + published and exclude fixtures', () => {
    expect(publicContentWhere()).toEqual({
      and: [{ approvalStatus: { equals: 'approved' } }, { isPublished: { equals: true } }, { isFixture: { not_equals: true } }],
    })
  })

  it('fixtures are only visible when the demo environment is explicitly enabled', () => {
    process.env.DEMO_FIXTURES = 'true'
    expect(publicContentWhere()).toEqual({ and: [{ approvalStatus: { equals: 'approved' } }, { isPublished: { equals: true } }] })
  })

  it('unpublishes anything that is not approved', () => {
    expect(run({ approvalStatus: 'review_required', isPublished: true }, { approvalStatus: 'review_required' }, ADMIN)).toMatchObject({
      isPublished: false,
    })
    expect(run({ approvalStatus: 'hidden' }, live, APPROVER)).toMatchObject({ approvalStatus: 'hidden', isPublished: false })
  })

  it('editors without approval authority cannot approve', () => {
    expect(() => run({ approvalStatus: 'approved' }, { approvalStatus: 'review_required' }, EDITOR)).toThrow(/approve/i)
    expect(statusOf(() => run({ approvalStatus: 'approved' }, { approvalStatus: 'review_required' }, EDITOR))).toBe(403)
    expect(statusOf(() => run({ approvalStatus: 'approved', nameAr: 'x' }, undefined, EDITOR))).toBe(403)
  })

  it('admins and authorised editors can approve and publish', () => {
    expect(run({ approvalStatus: 'approved', isPublished: true }, { approvalStatus: 'review_required' }, ADMIN)).toMatchObject({
      isPublished: true,
    })
    expect(run({ approvalStatus: 'approved', isPublished: true }, { approvalStatus: 'review_required' }, APPROVER)).toMatchObject({
      isPublished: true,
    })
  })

  it('sales users can never approve', () => {
    expect(canApproveContent(req({ role: 'sales', canApprove: true }))).toBe(false)
  })

  it('new records default to unpublished', () => {
    expect(run({ approvalStatus: 'approved' }, undefined)).toMatchObject({ isPublished: false })
  })
})

describe('approval is required again after any edit by a non-approver (SEC-03)', () => {
  it('a user without approval rights cannot publish (403), whatever the approval state', () => {
    expect(statusOf(() => run({ isPublished: true }, { approvalStatus: 'review_required', isPublished: false }, EDITOR))).toBe(403)
    expect(statusOf(() => run({ isPublished: true }, { approvalStatus: 'approved', isPublished: false }, EDITOR))).toBe(403)
    expect(statusOf(() => run({ nameAr: 'x', isPublished: true }, undefined, EDITOR))).toBe(403)
    expect(() => run({ isPublished: true }, { approvalStatus: 'approved', isPublished: false }, EDITOR)).toThrow(/publish/i)
  })

  it('any edit to an approved, published record demotes it to review_required and unpublishes it', () => {
    // A partial REST PATCH…
    expect(run({ nameAr: 'تعديل' }, live, EDITOR)).toMatchObject({ approvalStatus: 'review_required', isPublished: false })
    // …and the admin form, which re-sends the current approval state with every save.
    expect(run({ ...live, nameAr: 'تعديل' }, live, EDITOR)).toMatchObject({ approvalStatus: 'review_required', isPublished: false })
    // Unpublishing an approved record is an edit too.
    expect(run({ isPublished: false }, live, EDITOR)).toMatchObject({ approvalStatus: 'review_required', isPublished: false })
    // An explicit move to another non-approved state is kept (still unpublished).
    expect(run({ ...live, approvalStatus: 'hidden' }, live, EDITOR)).toMatchObject({ approvalStatus: 'hidden', isPublished: false })
  })

  it('an approved but unpublished record is demoted as well', () => {
    expect(run({ nameAr: 'تعديل' }, { approvalStatus: 'approved', isPublished: false }, EDITOR)).toMatchObject({
      approvalStatus: 'review_required',
      isPublished: false,
    })
  })

  it('non-approvers keep editing drafts normally', () => {
    const draft = run({ nameAr: 'مسودة' }, { approvalStatus: 'review_required', isPublished: false }, EDITOR)
    expect(draft).toEqual({ nameAr: 'مسودة', isPublished: false }) // status untouched, nothing thrown
    expect(run({ nameAr: 'جديد' }, undefined, EDITOR)).toMatchObject({ isPublished: false })
  })

  it('admins, authorised editors and trusted server code edit approved records without losing approval', () => {
    for (const user of [ADMIN, APPROVER, undefined]) {
      expect(run({ ...live, nameAr: 'تعديل' }, live, user)).toMatchObject({ approvalStatus: 'approved', isPublished: true })
      expect(run({ nameAr: 'تعديل' }, live, user)).toMatchObject({ nameAr: 'تعديل' })
    }
    // Trusted server code may still approve and publish.
    expect(run({ approvalStatus: 'approved', isPublished: true }, { approvalStatus: 'review_required' })).toMatchObject({
      isPublished: true,
    })
  })

  it('a duplicate (create whose originalDoc is the approved source) does not inherit approval for a non-approver', () => {
    expect(statusOf(() => run({ ...live }, live, EDITOR, 'create'))).toBe(403)
    // …because the duplicate field hooks reset the copy to a draft first:
    const status = resetOnDuplicate('review_required')
    const published = resetOnDuplicate(false)
    const args = (user?: User, value: unknown = 'approved') => ({ req: req(user), value }) as unknown as Parameters<typeof status>[0]
    expect(status(args(EDITOR))).toBe('review_required')
    expect(published(args(EDITOR, true))).toBe(false)
    expect(status(args(ADMIN))).toBe('approved')
    expect(published(args(APPROVER, true))).toBe(true)
    expect(run({ ...live, approvalStatus: 'review_required', isPublished: false }, live, EDITOR, 'create')).toMatchObject({
      approvalStatus: 'review_required',
      isPublished: false,
    })
  })
})

describe('unverified data stays out of the public API (SEC-04, SEC-09)', () => {
  type HookArgs = Parameters<ReturnType<typeof revealWhen>>[0]
  const hookArgs = (value: unknown, sibling: Doc, user?: User, overrideAccess = false) =>
    ({ value, siblingData: sibling, req: req(user), overrideAccess }) as unknown as HookArgs

  it('revealWhen hides the value from the public until its flag is set', () => {
    const hook = revealWhen('manufacturerVerified')
    expect(hook(hookArgs('ACME Vet', { manufacturerVerified: false }))).toBeNull()
    expect(hook(hookArgs('ACME Vet', {}))).toBeNull() // flag not selected → hidden (fail safe)
    expect(hook(hookArgs('ACME Vet', { manufacturerVerified: true }))).toBe('ACME Vet')
    expect(hook(hookArgs('ACME Vet', { manufacturerVerified: false }, EDITOR))).toBe('ACME Vet')
    // overrideAccess = trusted server code, e.g. the stored copy Payload reads before an update (no data loss).
    expect(hook(hookArgs('ACME Vet', { manufacturerVerified: false }, undefined, true))).toBe('ACME Vet')
    expect(hook(hookArgs(undefined, {}))).toBeUndefined()
  })

  const fieldNamed = (fields: unknown, name: string): Doc | undefined => {
    const stack: unknown[] = [fields]
    while (stack.length) {
      const node = stack.pop()
      if (Array.isArray(node)) stack.push(...node)
      else if (node && typeof node === 'object') {
        const field = node as Doc
        if (field.name === name) return field
        stack.push(field.fields, field.tabs)
      }
    }
    return undefined
  }
  const afterReadOf = (fields: unknown, name: string) =>
    ((fieldNamed(fields, name)?.hooks as { afterRead?: ReturnType<typeof revealWhen>[] } | undefined)?.afterRead ?? [])[0]

  it('wires the hooks and forced flags on products and articles', () => {
    expect(Products.forceSelect).toMatchObject({ manufacturerVerified: true, labelPdfApproved: true })
    expect(Articles.forceSelect).toMatchObject({ authorVerified: true })
    expect(afterReadOf(Products.fields, 'manufacturer')?.(hookArgs('ACME', { manufacturerVerified: false }))).toBeNull()
    expect(afterReadOf(Products.fields, 'labelPdf')?.(hookArgs(12, { labelPdfApproved: false }))).toBeNull()
    expect(afterReadOf(Products.fields, 'labelPdf')?.(hookArgs(12, { labelPdfApproved: true }))).toBe(12)
    expect(afterReadOf(Articles.fields, 'author')?.(hookArgs('د. أحمد', { authorVerified: false }))).toBeNull()
  })

  it('product search text includes the manufacturer only once it is verified', () => {
    const [, computeSearchText] = Products.hooks!.beforeChange! as ((args: unknown) => Doc)[]
    const text = (data: Doc, originalDoc?: Doc) => String(computeSearchText!({ data: { ...data }, originalDoc })['searchText'])
    expect(text({ nameAr: 'منتج', manufacturer: 'Zeta Pharma' })).not.toMatch(/zeta/i)
    expect(text({ nameAr: 'منتج', manufacturer: 'Zeta Pharma', manufacturerVerified: true })).toMatch(/zeta/i)
    expect(text({ nameAr: 'منتج' }, { manufacturer: 'Zeta Pharma', manufacturerVerified: true })).toMatch(/zeta/i)
  })

  it('public filters or sorts on a hidden field only match verified records', () => {
    type OpArgs = Parameters<ReturnType<typeof restrictHiddenFieldQueries>>[0]
    const guard = restrictHiddenFieldQueries({ manufacturer: 'manufacturerVerified' })
    const call = (args: Doc, user?: User, operation = 'read', overrideAccess = false) =>
      guard({ args, operation, req: req(user), overrideAccess } as unknown as OpArgs) as { where?: unknown }

    const where = { manufacturer: { like: 'ac' } }
    expect(call({ where }).where).toEqual({ and: [where, { manufacturerVerified: { equals: true } }] })
    const nested = { or: [{ nameAr: { like: 'x' } }, { and: [{ manufacturer: { equals: 'ACME' } }] }] }
    expect(call({ where: nested }, undefined, 'count').where).toEqual({ and: [nested, { manufacturerVerified: { equals: true } }] })
    expect(call({ sort: '-manufacturer' }).where).toEqual({ and: [{ manufacturerVerified: { equals: true } }] })
    // Untouched: unrelated queries, staff, trusted server code, writes.
    const unrelated = { where: { manufacturerVerified: { equals: true } } }
    expect(call(unrelated)).toBe(unrelated)
    expect(call({ where }, EDITOR).where).toBe(where)
    expect(call({ where }, undefined, 'read', true).where).toBe(where)
    expect(call({ where }, undefined, 'update').where).toBe(where)
    expect(whereMentions({ 'manufacturer.something': { exists: true } }, 'manufacturer')).toBe(true)
    expect(whereMentions({ manufacturerVerified: { equals: true } }, 'manufacturer')).toBe(false)
  })

  it('the metrics accuracy note is staff-only', () => {
    const items = fieldNamed(Metrics.fields, 'items')
    const note = fieldNamed(items?.fields, 'accuracyNote') as { access?: { read?: (a: unknown) => boolean } } | undefined
    expect(note?.access?.read?.({ req: req() })).toBe(false)
    expect(note?.access?.read?.({ req: req(EDITOR) })).toBe(true)
  })

  it('media with unknown usage rights is not public (SEC-09)', () => {
    const read = Media.access!.read as (args: unknown) => unknown
    expect(read({ req: req() })).toEqual({
      and: [{ restricted: { not_equals: true } }, { license: { not_equals: 'unknown' } }],
    })
    expect(read({ req: req(EDITOR) })).toBe(true)
  })
})
