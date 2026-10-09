import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, readPublishedOrStaff } from '../access'
import { approvalFields } from '../fields'
import { approvalGuard } from '../hooks/approval-guard'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

/** Business/process FAQs only — never medical recommendations (spec §5 Scene 10). */
export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: { ar: 'سؤال شائع', en: 'FAQ' }, plural: { ar: 'الأسئلة الشائعة', en: 'FAQs' } },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'placement', 'order', 'approvalStatus', 'isPublished'],
    group: { ar: 'المحتوى', en: 'Content' },
  },
  defaultSort: 'order',
  access: { read: readPublishedOrStaff, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  hooks: {
    beforeChange: [approvalGuard],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true, label: { ar: 'السؤال', en: 'Question' } },
    { name: 'answer', type: 'textarea', required: true, localized: true, label: { ar: 'الإجابة', en: 'Answer' } },
    {
      name: 'placement',
      type: 'select',
      hasMany: true,
      defaultValue: ['home'],
      label: { ar: 'مكان الظهور', en: 'Placement' },
      options: [
        { label: { ar: 'الرئيسية', en: 'Home' }, value: 'home' },
        { label: { ar: 'المنتجات', en: 'Products' }, value: 'products' },
        { label: { ar: 'تواصل معنا', en: 'Contact' }, value: 'contact' },
      ],
    },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    ...approvalFields(),
  ],
}
