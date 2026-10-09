import type { CollectionConfig } from 'payload'
import { anyone, isAdmin, isAdminOrEditor } from '../access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const PRODUCT_CATEGORY_KEYS = ['feed', 'supplements', 'medicines', 'vaccines'] as const
export type ProductCategoryKey = (typeof PRODUCT_CATEGORY_KEYS)[number]

export const SEGMENT_KEYS = ['broilers', 'layers', 'breeders'] as const
export type SegmentKey = (typeof SEGMENT_KEYS)[number]

/** The four commercial pillars (spec §5 Scene 5, §10.1 ProductCategory). */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: { ar: 'فئة منتجات', en: 'Product category' }, plural: { ar: 'فئات المنتجات', en: 'Product categories' } },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'key', 'order'], group: { ar: 'الكتالوج', en: 'Catalogue' } },
  defaultSort: 'order',
  access: { read: anyone, create: isAdmin, update: isAdminOrEditor, delete: isAdmin },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: { ar: 'أعلاف الدواجن', en: 'Poultry feed' }, value: 'feed' },
        { label: { ar: 'مكملات الأعلاف', en: 'Feed supplements' }, value: 'supplements' },
        { label: { ar: 'الأدوية البيطرية', en: 'Veterinary medicines' }, value: 'medicines' },
        { label: { ar: 'اللقاحات البيطرية', en: 'Veterinary vaccines' }, value: 'vaccines' },
      ],
      admin: { description: { ar: 'مفتاح ثابت يُستخدم في روابط التصفية.', en: 'Stable key used in filter URLs.' } },
    },
    { name: 'name', type: 'text', required: true, localized: true, label: { ar: 'الاسم', en: 'Name' } },
    { name: 'description', type: 'textarea', localized: true, label: { ar: 'الوصف المعتمد', en: 'Approved description' } },
    { name: 'image', type: 'upload', relationTo: 'media', label: { ar: 'صورة الفئة', en: 'Category image' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}

/** Broilers / Layers / Breeders (spec §10.1 PoultrySegment). */
export const PoultrySegments: CollectionConfig = {
  slug: 'poultry-segments',
  labels: { singular: { ar: 'قطاع إنتاج', en: 'Poultry segment' }, plural: { ar: 'قطاعات الإنتاج', en: 'Poultry segments' } },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'key', 'order'], group: { ar: 'الكتالوج', en: 'Catalogue' } },
  defaultSort: 'order',
  access: { read: anyone, create: isAdmin, update: isAdminOrEditor, delete: isAdmin },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    {
      name: 'key',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: { ar: 'التسمين', en: 'Broilers' }, value: 'broilers' },
        { label: { ar: 'البياض', en: 'Layers' }, value: 'layers' },
        { label: { ar: 'الأمهات', en: 'Breeders' }, value: 'breeders' },
      ],
    },
    { name: 'name', type: 'text', required: true, localized: true, label: { ar: 'الاسم', en: 'Name' } },
    { name: 'intro', type: 'textarea', localized: true, label: { ar: 'مقدمة عامة', en: 'Public intro' } },
    { name: 'image', type: 'upload', relationTo: 'media', label: { ar: 'الصورة', en: 'Image' } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
