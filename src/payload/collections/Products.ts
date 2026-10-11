import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { buildSearchText } from '../../lib/search/normalize'
import { isAdmin, isAdminOrEditor, isStaffField, readPublishedOrStaff } from '../access'
import { approvalFields, seoGroup, slugField } from '../fields'
import { approvalGuard } from '../hooks/approval-guard'
import { restrictHiddenFieldQueries, revealWhen } from '../hooks/public-visibility'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const PRODUCT_FORMS = [
  'injectable',
  'oral-solution',
  'water-soluble-powder',
  'premix',
  'feed-pellets',
  'feed-mash',
  'feed-crumbles',
  'liquid',
  'tablet',
  'other',
] as const

export const AVAILABILITY = ['inquiry_only', 'on_request', 'confirmed'] as const

const FORM_LABELS: Record<(typeof PRODUCT_FORMS)[number], { ar: string; en: string }> = {
  injectable: { ar: 'حقن', en: 'Injectable' },
  'oral-solution': { ar: 'محلول فموي', en: 'Oral solution' },
  'water-soluble-powder': { ar: 'مسحوق يذوب في الماء', en: 'Water-soluble powder' },
  premix: { ar: 'بريمكس', en: 'Premix' },
  'feed-pellets': { ar: 'علف محبب (بيليت)', en: 'Feed pellets' },
  'feed-mash': { ar: 'علف ناعم (مش)', en: 'Feed mash' },
  'feed-crumbles': { ar: 'علف مجروش (كرامبل)', en: 'Feed crumbles' },
  liquid: { ar: 'سائل', en: 'Liquid' },
  tablet: { ar: 'أقراص', en: 'Tablet' },
  other: { ar: 'أخرى', en: 'Other' },
}

/** Public search text: names and SKU, plus the manufacturer ONLY once it is verified (SEC-04). */
const computeSearchText: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const pick = <K extends string>(key: K) => (data[key] ?? originalDoc?.[key]) as string | undefined
  const verified = (data.manufacturerVerified ?? originalDoc?.manufacturerVerified) === true
  data.searchText = buildSearchText([pick('nameAr'), pick('nameEn'), pick('sku'), verified ? pick('manufacturer') : undefined])
  return data
}

/**
 * Real, approval-gated B2B catalogue records (spec §6.4–6.5, §10.1 Product).
 * NOTHING here is seeded in development or production — only authorised editors add real products.
 * Test fixtures exist exclusively in the isolated e2e database (isFixture = true).
 */
export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: { ar: 'منتج', en: 'Product' }, plural: { ar: 'المنتجات', en: 'Products' } },
  admin: {
    useAsTitle: 'nameAr',
    defaultColumns: ['nameAr', 'category', 'approvalStatus', 'isPublished', 'updatedAt'],
    listSearchableFields: ['nameAr', 'nameEn', 'sku', 'manufacturer'],
    group: { ar: 'الكتالوج', en: 'Catalogue' },
    description: {
      ar: 'أدخل فقط بيانات منتجات حقيقية معتمدة من الشركة والجهة المصنّعة. لا تُكتب جرعات أو بروتوكولات علاج.',
      en: 'Enter only real products approved by the company and manufacturer. Never add dosages or treatment protocols.',
    },
  },
  defaultSort: 'nameAr',
  versions: { maxPerDoc: 25 },
  access: {
    read: readPublishedOrStaff,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  // The flags the public-visibility hooks read must be present even when a query selects only a few fields.
  forceSelect: { manufacturerVerified: true, labelPdfApproved: true },
  hooks: {
    beforeOperation: [restrictHiddenFieldQueries({ manufacturer: 'manufacturerVerified', labelPdf: 'labelPdfApproved' })],
    beforeChange: [approvalGuard, computeSearchText],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { ar: 'البيانات الأساسية', en: 'Core data' },
          fields: [
            { name: 'nameAr', type: 'text', required: true, label: { ar: 'الاسم بالعربية', en: 'Arabic name' } },
            { name: 'nameEn', type: 'text', label: { ar: 'الاسم بالإنجليزية (إن وُجد)', en: 'English name (if approved)' } },
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  type: 'relationship',
                  relationTo: 'product-categories',
                  required: true,
                  index: true,
                  label: { ar: 'الفئة', en: 'Category' },
                },
                {
                  name: 'segments',
                  type: 'relationship',
                  relationTo: 'poultry-segments',
                  hasMany: true,
                  index: true,
                  label: { ar: 'قطاعات الإنتاج', en: 'Poultry segments' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'sku', type: 'text', index: true, label: { ar: 'الكود (SKU) المعتمد', en: 'Verified SKU' } },
                {
                  name: 'form',
                  type: 'select',
                  label: { ar: 'الشكل', en: 'Form' },
                  options: PRODUCT_FORMS.map((value) => ({ label: FORM_LABELS[value], value })),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'manufacturer',
                  type: 'text',
                  label: { ar: 'الجهة المصنّعة', en: 'Manufacturer' },
                  // Public API: null until verified (staff always see it).
                  hooks: { afterRead: [revealWhen('manufacturerVerified')] },
                },
                {
                  name: 'manufacturerVerified',
                  type: 'checkbox',
                  defaultValue: false,
                  label: { ar: 'تم التحقق من الجهة المصنّعة', en: 'Manufacturer verified' },
                  admin: { description: { ar: 'لا يُعرض اسم المصنّع للزوار إلا بعد التحقق.', en: 'Manufacturer is shown publicly only when verified.' } },
                },
              ],
            },
            { name: 'packSize', type: 'text', localized: true, label: { ar: 'حجم العبوة المعتمد', en: 'Approved pack size' } },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              label: { ar: 'الوصف الرسمي', en: 'Official description' },
              admin: { description: { ar: 'نص مأخوذ من النشرة المعتمدة فقط.', en: 'Text from the approved label only.' } },
            },
            { name: 'warnings', type: 'textarea', localized: true, label: { ar: 'التحذيرات كما وردت', en: 'Warnings as supplied' } },
            {
              name: 'availabilityStatus',
              type: 'select',
              required: true,
              defaultValue: 'inquiry_only',
              label: { ar: 'صياغة التوافر', en: 'Availability wording' },
              options: [
                { label: { ar: 'عند الاستفسار', en: 'On inquiry' }, value: 'inquiry_only' },
                { label: { ar: 'يُوفَّر عند الطلب', en: 'Supplied on request' }, value: 'on_request' },
                { label: { ar: 'التوافر مؤكد', en: 'Availability confirmed' }, value: 'confirmed' },
              ],
            },
          ],
        },
        {
          label: { ar: 'الصور والنشرة', en: 'Media & label' },
          fields: [
            { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, label: { ar: 'الصور', en: 'Images' } },
            {
              name: 'labelPdf',
              type: 'upload',
              relationTo: 'media',
              label: { ar: 'النشرة الفنية (PDF)', en: 'Technical label (PDF)' },
              filterOptions: { mimeType: { equals: 'application/pdf' } },
              // Public API: null until legally approved (staff always see it).
              hooks: { afterRead: [revealWhen('labelPdfApproved')] },
            },
            {
              name: 'labelPdfApproved',
              type: 'checkbox',
              defaultValue: false,
              label: { ar: 'النشرة معتمدة قانونيًا للنشر', en: 'Label legally approved for download' },
            },
          ],
        },
        {
          label: { ar: 'السلامة والتحسين', en: 'Safety & SEO' },
          fields: [
            {
              name: 'safetyText',
              type: 'textarea',
              localized: true,
              label: { ar: 'نص السلامة', en: 'Safety text' },
              admin: {
                description: {
                  ar: 'يُعرض مع المنتجات البيطرية. اتركه فارغًا لاستخدام النص الافتراضي المعتمد.',
                  en: 'Shown with veterinary products. Leave empty to use the default approved sentence.',
                },
              },
            },
            seoGroup(),
          ],
        },
        {
          label: { ar: 'داخلي', en: 'Internal' },
          fields: [
            {
              name: 'sourceEvidence',
              type: 'textarea',
              access: { read: isStaffField },
              label: { ar: 'مصدر البيانات', en: 'Data source evidence' },
            },
            { name: 'internalNotes', type: 'textarea', access: { read: isStaffField }, label: { ar: 'ملاحظات داخلية', en: 'Internal notes' } },
          ],
        },
      ],
    },
    slugField({
      ar: 'حروف لاتينية صغيرة وأرقام وشرطات فقط، ويظهر في الرابط /ar/products/<slug>.',
      en: 'Lowercase Latin letters, digits and hyphens — used in /ar/products/<slug> and /en/products/<slug>.',
    }),
    ...approvalFields(),
    {
      // Normalised name/SKU (+ verified manufacturer) text for Arabic-aware search. Readable on purpose: public
      // search filters on it (Payload rejects filters on unreadable fields); it only contains public name data.
      name: 'searchText',
      type: 'text',
      index: true,
      admin: { hidden: true },
    },
  ],
}
