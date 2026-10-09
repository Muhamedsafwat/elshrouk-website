import type { CollectionConfig } from 'payload'
import { getUser, isAdmin, isAdminOrEditor, isStaffField } from '../access'

/** Media library with rights metadata (spec §10.1 "Asset"). Restricted files are never public. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: { ar: 'ملف وسائط', en: 'Media file' }, plural: { ar: 'الوسائط', en: 'Media' } },
  admin: {
    group: { ar: 'المحتوى', en: 'Content' },
    defaultColumns: ['filename', 'alt', 'license', 'restricted'],
  },
  access: {
    read: ({ req }) => {
      if (getUser(req)) return true
      return { restricted: { not_equals: true } }
    },
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
    focalPoint: true,
    crop: true,
    imageSizes: [
      { name: 'thumb', width: 480, height: 360, position: 'centre', formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'card', width: 960, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'wide', width: 1920, formatOptions: { format: 'webp', options: { quality: 78 } } },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { ar: 'النص البديل', en: 'Alt text' },
      admin: {
        description: {
          ar: 'وصف دقيق لمحتوى الصورة (دواجن فقط). مطلوب لإتاحة الموقع لقارئات الشاشة.',
          en: 'Accurate description of the image (poultry only). Required for screen readers.',
        },
      },
    },
    {
      name: 'license',
      type: 'select',
      required: true,
      defaultValue: 'unknown',
      label: { ar: 'حقوق الاستخدام', en: 'Usage rights' },
      options: [
        { label: { ar: 'ملك الشركة', en: 'Company-owned' }, value: 'owned' },
        { label: { ar: 'تصوير بتكليف', en: 'Commissioned' }, value: 'commissioned' },
        { label: { ar: 'مرخّص (مكتبة صور)', en: 'Licensed stock' }, value: 'licensed' },
        { label: { ar: 'مقدَّم من المُصنِّع', en: 'Manufacturer-supplied' }, value: 'manufacturer' },
        { label: { ar: 'غير معروف — لا يُنشر', en: 'Unknown — do not publish' }, value: 'unknown' },
      ],
    },
    { name: 'credit', type: 'text', label: { ar: 'المصدر / المصوّر', en: 'Credit / source' } },
    {
      name: 'rightsEvidence',
      type: 'textarea',
      access: { read: isStaffField },
      label: { ar: 'دليل الحقوق', en: 'Rights evidence' },
    },
    { name: 'rightsExpireAt', type: 'date', access: { read: isStaffField }, label: { ar: 'انتهاء الحقوق', en: 'Rights expire' } },
    {
      name: 'restricted',
      type: 'checkbox',
      defaultValue: false,
      label: { ar: 'ملف داخلي (غير عام)', en: 'Internal file (not public)' },
      admin: { position: 'sidebar' },
    },
  ],
}
