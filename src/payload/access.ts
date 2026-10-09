import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

/**
 * Role model (spec §10.2)
 * - admin  : users, security settings, full content control
 * - editor : drafts and content; may approve/publish only when `canApprove` is granted by an admin
 * - sales  : reads/updates inquiries; read-only product context; no publishing or settings
 * Public visitors: published + approved content only, and protected lead submission (server-side only).
 */
export const ROLES = ['admin', 'editor', 'sales'] as const
export type Role = (typeof ROLES)[number]

type StaffUser = { id: number | string; role?: Role | null; canApprove?: boolean | null }

export const getUser = (req: PayloadRequest): StaffUser | null =>
  req.user && req.user.collection === 'users' ? (req.user as unknown as StaffUser) : null

export const hasRole = (req: PayloadRequest, ...roles: Role[]): boolean => {
  const user = getUser(req)
  return Boolean(user?.role && roles.includes(user.role))
}

/** Admins always approve; editors only when an admin granted `canApprove`. */
export const canApproveContent = (req: PayloadRequest): boolean => {
  const user = getUser(req)
  if (!user) return false
  if (user.role === 'admin') return true
  return user.role === 'editor' && user.canApprove === true
}

export const anyone: Access = () => true
export const nobody: Access = () => false
export const isStaff: Access = ({ req }) => Boolean(getUser(req))
export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')
export const isAdminOrEditor: Access = ({ req }) => hasRole(req, 'admin', 'editor')
export const isAdminOrSales: Access = ({ req }) => hasRole(req, 'admin', 'sales')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req, 'admin')
export const isAdminOrEditorField: FieldAccess = ({ req }) => hasRole(req, 'admin', 'editor')
export const isStaffField: FieldAccess = ({ req }) => Boolean(getUser(req))

/** Public visitors only ever see records that are approved AND published (and never test fixtures). */
export const publicContentWhere = (): Where => {
  const conditions: Where[] = [{ approvalStatus: { equals: 'approved' } }, { isPublished: { equals: true } }]
  if (process.env.DEMO_FIXTURES !== 'true') conditions.push({ isFixture: { not_equals: true } })
  return { and: conditions }
}

/** Staff read everything (editors need drafts; sales needs product context); public reads the gated subset. */
export const readPublishedOrStaff: Access = ({ req }) => {
  if (getUser(req)) return true
  return publicContentWhere()
}
