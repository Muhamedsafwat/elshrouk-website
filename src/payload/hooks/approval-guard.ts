import { APIError, type CollectionBeforeChangeHook, type FieldHook } from 'payload'
import { canApproveContent } from '../access'

/**
 * Enforces the publication contract server-side (spec §1.3, §10.2):
 *  - only admins / authorised editors (`canApprove`) may move a record to `approved` or publish it (403);
 *  - ANY change by someone without approval rights to an `approved` record sends it back to `review_required`
 *    and unpublishes it, so unapproved wording never stays live (SEC-03);
 *  - a record can be published only while it is `approved`; leaving `approved` automatically unpublishes it.
 * Local API calls without a user (seed scripts, server actions) are trusted server code and are not restricted.
 */
export const approvalGuard: CollectionBeforeChangeHook = ({ data, originalDoc, req, operation }) => {
  const mayApprove = !req.user || canApproveContent(req)
  // On `create` (including a duplicate, whose originalDoc is the SOURCE record) nothing has been approved yet.
  const stored = operation === 'update' ? originalDoc : undefined
  const wasApproved = stored?.approvalStatus === 'approved'
  const wasPublished = stored?.isPublished === true

  if (!mayApprove) {
    if (data.isPublished === true && !wasPublished) {
      throw new APIError('Only an admin or an authorised editor can publish content.', 403)
    }
    const requested = data.approvalStatus ?? stored?.approvalStatus ?? 'review_required'
    if (requested === 'approved' && !wasApproved) {
      throw new APIError('Only an admin or an authorised editor can approve content.', 403)
    }
    if (wasApproved) {
      // Edited approved content needs a fresh approval before it can be public again (an explicit move to
      // another non-approved state, e.g. `hidden`, is kept).
      if (data.approvalStatus === undefined || data.approvalStatus === 'approved') data.approvalStatus = 'review_required'
      data.isPublished = false
    }
  }

  const nextStatus = data.approvalStatus ?? stored?.approvalStatus ?? 'review_required'
  if (nextStatus !== 'approved') {
    data.isPublished = false
  } else if (operation === 'create' && data.isPublished === undefined) {
    data.isPublished = false
  }

  return data
}

/**
 * `beforeDuplicate` for approvalStatus / isPublished: a copy made by someone without approval rights starts as an
 * unpublished draft instead of inheriting the source's approval (the guard would otherwise refuse it with 403).
 */
export const resetOnDuplicate =
  (draftValue: 'review_required' | false): FieldHook =>
  ({ req, value }) =>
    !req.user || canApproveContent(req) ? value : draftValue
