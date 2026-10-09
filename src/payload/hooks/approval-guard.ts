import { APIError, type CollectionBeforeChangeHook } from 'payload'
import { canApproveContent } from '../access'

/**
 * Enforces the publication contract server-side (spec §1.3, §10.2):
 *  - only admins / authorised editors may move a record to `approved`;
 *  - a record can be published only while it is `approved`;
 *  - leaving `approved` automatically unpublishes it.
 */
export const approvalGuard: CollectionBeforeChangeHook = ({ data, originalDoc, req, operation }) => {
  const nextStatus = data.approvalStatus ?? originalDoc?.approvalStatus ?? 'review_required'
  const becameApproved = nextStatus === 'approved' && originalDoc?.approvalStatus !== 'approved'

  // Local API calls without a user (seed scripts, server actions) are trusted server code.
  const isTrustedServer = !req.user

  if (becameApproved && !isTrustedServer && !canApproveContent(req)) {
    throw new APIError('Only an admin or an authorised editor can approve content.', 403)
  }

  if (nextStatus !== 'approved') {
    data.isPublished = false
  } else if (operation === 'create' && data.isPublished === undefined) {
    data.isPublished = false
  }

  return data
}
