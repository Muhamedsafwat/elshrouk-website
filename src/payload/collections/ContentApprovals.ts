import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor } from '../access'

/** Internal approval log (spec §10.1 ContentApproval). Mirrors content/approval-register.md. Never public. */
export const ContentApprovals: CollectionConfig = {
  slug: 'content-approvals',
  labels: { singular: { ar: 'سجل اعتماد', en: 'Approval record' }, plural: { ar: 'سجل الاعتمادات', en: 'Approval register' } },
  admin: {
    useAsTitle: 'item',
    defaultColumns: ['item', 'location', 'state', 'owner', 'approvedAt'],
    group: { ar: 'الإدارة', en: 'Administration' },
  },
  access: { read: isAdminOrEditor, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  fields: [
    { name: 'item', type: 'text', required: true, label: { ar: 'العنصر', en: 'Item' } },
    { name: 'location', type: 'text', label: { ar: 'الموقع (ملف/مفتاح أو صفحة)', en: 'Location (file:key or page)' } },
    {
      name: 'state',
      type: 'select',
      required: true,
      defaultValue: 'review_required',
      options: [
        { label: { ar: 'معتمد', en: 'Approved' }, value: 'approved' },
        { label: { ar: 'يحتاج مراجعة', en: 'Review required' }, value: 'review_required' },
        { label: { ar: 'محتوى داخلي مؤقت', en: 'Internal placeholder' }, value: 'placeholder_internal' },
        { label: { ar: 'مخفي', en: 'Hidden' }, value: 'hidden' },
      ],
    },
    { name: 'owner', type: 'text', label: { ar: 'المسؤول', en: 'Owner' } },
    { name: 'evidence', type: 'textarea', label: { ar: 'الدليل / المصدر', en: 'Evidence / source' } },
    { name: 'evidenceFile', type: 'upload', relationTo: 'media', label: { ar: 'ملف داعم', en: 'Evidence file' } },
    { name: 'approvedBy', type: 'relationship', relationTo: 'users', label: { ar: 'اعتمده', en: 'Approved by' } },
    { name: 'approvedAt', type: 'date', label: { ar: 'تاريخ الاعتماد', en: 'Approved at' } },
    { name: 'notes', type: 'textarea', label: { ar: 'ملاحظات', en: 'Notes' } },
  ],
}
