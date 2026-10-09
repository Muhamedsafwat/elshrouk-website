import { afterEach, describe, expect, it } from 'vitest'
import { canApproveContent, publicContentWhere } from '@/payload/access'
import { approvalGuard } from '@/payload/hooks/approval-guard'

type GuardArgs = Parameters<typeof approvalGuard>[0]

const req = (user?: { role: 'admin' | 'editor' | 'sales'; canApprove?: boolean }) =>
  ({ user: user ? { id: 1, collection: 'users', ...user } : null }) as unknown as GuardArgs['req']

const run = (data: Record<string, unknown>, originalDoc: Record<string, unknown> | undefined, user?: Parameters<typeof req>[0]) =>
  approvalGuard({ data, originalDoc, req: req(user), operation: originalDoc ? 'update' : 'create' } as unknown as GuardArgs)

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
    expect(run({ approvalStatus: 'review_required', isPublished: true }, { approvalStatus: 'review_required' }, { role: 'editor' })).toMatchObject({
      isPublished: false,
    })
  })

  it('editors without approval authority cannot approve', () => {
    expect(() => run({ approvalStatus: 'approved' }, { approvalStatus: 'review_required' }, { role: 'editor', canApprove: false })).toThrow(
      /approve/i,
    )
  })

  it('admins and authorised editors can approve and publish', () => {
    expect(run({ approvalStatus: 'approved', isPublished: true }, { approvalStatus: 'review_required' }, { role: 'admin' })).toMatchObject({
      isPublished: true,
    })
    expect(run({ approvalStatus: 'approved', isPublished: true }, { approvalStatus: 'review_required' }, { role: 'editor', canApprove: true })).toMatchObject({
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
