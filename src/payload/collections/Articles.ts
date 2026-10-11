import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrEditor, isStaffField, readPublishedOrStaff } from '../access'
import { approvalFields, seoGroup, slugField } from '../fields'
import { approvalGuard } from '../hooks/approval-guard'
import { restrictHiddenFieldQueries, revealWhen } from '../hooks/public-visibility'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const ARTICLE_CATEGORIES = ['farm-business', 'feed-supplements', 'vet-product-handling', 'company-news'] as const
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]

/** Knowledge hub articles (spec §6.7). No article is seeded; veterinary topics require professional review. */
export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: { singular: { ar: 'مقال', en: 'Article' }, plural: { ar: 'المقالات', en: 'Articles' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'approvalStatus', 'isPublished', 'publishedAt'],
    group: { ar: 'المحتوى', en: 'Content' },
  },
  defaultSort: '-publishedAt',
  versions: { maxPerDoc: 25 },
  access: { read: readPublishedOrStaff, create: isAdminOrEditor, update: isAdminOrEditor, delete: isAdmin },
  // The flag the public-visibility hook reads must be present even when a query selects only a few fields.
  forceSelect: { authorVerified: true },
  hooks: {
    beforeOperation: [restrictHiddenFieldQueries({ author: 'authorVerified' })],
    beforeChange: [approvalGuard],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { ar: 'العنوان', en: 'Title' } },
    { name: 'excerpt', type: 'textarea', localized: true, maxLength: 280, label: { ar: 'مقتطف', en: 'Excerpt' } },
    {
      name: 'category',
      type: 'select',
      required: true,
      index: true,
      label: { ar: 'التصنيف', en: 'Category' },
      options: [
        { label: { ar: 'أعمال مزارع الدواجن', en: 'Poultry farm business' }, value: 'farm-business' },
        { label: { ar: 'التوعية بمكملات الأعلاف', en: 'Feed supplements awareness' }, value: 'feed-supplements' },
        { label: { ar: 'تداول المنتجات البيطرية', en: 'Veterinary product handling' }, value: 'vet-product-handling' },
        { label: { ar: 'أخبار الشركة', en: 'Company news' }, value: 'company-news' },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media', label: { ar: 'صورة الغلاف', en: 'Cover image' } },
    { name: 'body', type: 'richText', required: true, localized: true, label: { ar: 'المحتوى', en: 'Body' } },
    {
      name: 'sources',
      type: 'array',
      label: { ar: 'المصادر', en: 'Sources' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', validate: (v: unknown) => !v || /^https?:\/\//.test(String(v)) || 'Must be an http(s) URL' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'text',
          label: { ar: 'الكاتب', en: 'Author' },
          // Public API: null until the attribution is approved (staff always see it).
          hooks: { afterRead: [revealWhen('authorVerified')] },
        },
        {
          name: 'authorVerified',
          type: 'checkbox',
          defaultValue: false,
          label: { ar: 'اسم الكاتب معتمد للعرض', en: 'Author attribution approved' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'professionalReview',
          type: 'checkbox',
          defaultValue: false,
          label: { ar: 'تمت مراجعته من مختص مؤهل', en: 'Reviewed by a qualified professional' },
        },
        { name: 'reviewer', type: 'text', access: { read: isStaffField }, label: { ar: 'المراجع', en: 'Reviewer' } },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      label: { ar: 'تاريخ النشر', en: 'Publish date' },
      admin: { position: 'sidebar', description: { ar: 'يُعرض فقط بعد الاعتماد.', en: 'Shown only once approved.' } },
    },
    slugField(),
    ...approvalFields(),
    seoGroup(),
  ],
}
