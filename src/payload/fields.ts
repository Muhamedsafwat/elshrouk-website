import type { Field } from 'payload'
import { isAdminOrEditorField, isStaffField } from './access'
import { resetOnDuplicate } from './hooks/approval-guard'

export const APPROVAL_STATES = ['approved', 'review_required', 'placeholder_internal', 'hidden'] as const
export type ApprovalState = (typeof APPROVAL_STATES)[number]

/** Editorial status + publication flag shared by every publishable record (spec §1.3). */
export const approvalFields = (): Field[] => [
  {
    name: 'approvalStatus',
    type: 'select',
    label: { ar: 'حالة الاعتماد', en: 'Approval status' },
    required: true,
    defaultValue: 'review_required',
    index: true,
    options: [
      { label: { ar: 'معتمد', en: 'Approved' }, value: 'approved' },
      { label: { ar: 'يحتاج مراجعة', en: 'Review required' }, value: 'review_required' },
      { label: { ar: 'محتوى داخلي مؤقت', en: 'Internal placeholder' }, value: 'placeholder_internal' },
      { label: { ar: 'مخفي', en: 'Hidden' }, value: 'hidden' },
    ],
    access: { update: isAdminOrEditorField },
    hooks: { beforeDuplicate: [resetOnDuplicate('review_required')] },
    admin: {
      position: 'sidebar',
      description: {
        ar: 'لا يظهر المحتوى للزوار إلا إذا كان «معتمدًا» و«منشورًا». الاعتماد والنشر متاحان للمدير أو المحرر المخوَّل، وأي تعديل من غيرهما على محتوى معتمد يعيده إلى «يحتاج مراجعة» ويوقف نشره.',
        en: 'Visitors only see records that are Approved AND Published. Approving and publishing require an admin or an authorised editor; any edit by anyone else to approved content returns it to Review required and unpublishes it.',
      },
    },
  },
  {
    name: 'isPublished',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    label: { ar: 'منشور', en: 'Published' },
    access: { update: isAdminOrEditorField },
    hooks: { beforeDuplicate: [resetOnDuplicate(false)] },
    admin: { position: 'sidebar' },
  },
  {
    name: 'approvalEvidence',
    type: 'textarea',
    label: { ar: 'مصدر الاعتماد / الدليل', en: 'Approval evidence / source' },
    access: { read: isStaffField },
    admin: {
      position: 'sidebar',
      description: {
        ar: 'من اعتمد المعلومة ومتى، أو رابط المستند الداعم. لا يظهر للزوار.',
        en: 'Who approved it and when, or a link to the supporting document. Never public.',
      },
    },
  },
  {
    name: 'isFixture',
    type: 'checkbox',
    defaultValue: false,
    index: true,
    label: { ar: 'بيانات اختبار', en: 'Test fixture' },
    // Readable on purpose: public queries filter on it (Payload rejects filters on unreadable fields).
    access: { update: () => false, create: () => process.env.SEED_FIXTURES === 'true' },
    admin: { position: 'sidebar', readOnly: true, condition: (data) => Boolean(data?.isFixture) },
  },
]

export const slugField = (description?: { ar: string; en: string }): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  label: { ar: 'المعرّف في الرابط', en: 'URL slug' },
  validate: (value: unknown) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : 'Use lowercase latin letters, digits and single hyphens (e.g. product-name-500ml).',
  admin: { position: 'sidebar', description },
})

export const seoGroup = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    { name: 'metaTitle', type: 'text', localized: true, maxLength: 70 },
    { name: 'metaDescription', type: 'textarea', localized: true, maxLength: 170 },
  ],
})
