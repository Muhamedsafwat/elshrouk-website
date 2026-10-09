import { APIError, type CollectionConfig } from 'payload'
import { getUser, hasRole, isAdmin, isAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: { ar: 'مستخدم', en: 'User' }, plural: { ar: 'المستخدمون', en: 'Users' } },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'canApprove'],
    group: { ar: 'الإدارة', en: 'Administration' },
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    tokenExpiration: 8 * 60 * 60,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    admin: ({ req }) => Boolean(getUser(req)),
    create: isAdmin,
    delete: isAdmin,
    read: ({ req }) => {
      const user = getUser(req)
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    update: ({ req }) => {
      const user = getUser(req)
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        // The very first account (created through the /admin onboarding screen) becomes the admin.
        if (operation === 'create' && data) {
          const existing = await req.payload.count({ collection: 'users', overrideAccess: true })
          if (existing.totalDocs === 0) {
            data.role = 'admin'
          } else if (!hasRole(req, 'admin') && req.user) {
            throw new APIError('Only administrators can create accounts.', 403)
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: { ar: 'الاسم', en: 'Name' } },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'sales',
      saveToJWT: true,
      access: { update: isAdminField, create: isAdminField },
      options: [
        { label: { ar: 'مدير النظام', en: 'Admin' }, value: 'admin' },
        { label: { ar: 'محرر محتوى', en: 'Editor' }, value: 'editor' },
        { label: { ar: 'فريق المبيعات', en: 'Sales' }, value: 'sales' },
      ],
      admin: {
        description: {
          ar: 'المدير: كل الصلاحيات. المحرر: المحتوى والمنتجات. المبيعات: الطلبات والاستفسارات فقط.',
          en: 'Admin: everything. Editor: content & products. Sales: inquiries only.',
        },
      },
    },
    {
      name: 'canApprove',
      type: 'checkbox',
      defaultValue: false,
      saveToJWT: true,
      label: { ar: 'مخوَّل باعتماد المحتوى ونشره', en: 'Authorised to approve & publish' },
      access: { update: isAdminField, create: isAdminField },
      admin: {
        condition: (data) => data?.role === 'editor',
        description: {
          ar: 'يُمنح فقط لمن لديه تفويض من إدارة الشركة باعتماد البيانات التجارية.',
          en: 'Grant only to editors with business authorisation to approve commercial data.',
        },
      },
    },
  ],
}
