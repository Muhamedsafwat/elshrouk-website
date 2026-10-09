import type { Field, GlobalConfig } from 'payload'
import { anyone, isAdminOrEditor } from '../access'
import { revalidateGlobalAfterChange } from '../hooks/revalidate'

const lines = (name: string, label: { ar: string; en: string }, maxRows = 3): Field => ({
  name,
  type: 'array',
  label,
  maxRows,
  labels: { singular: { ar: 'سطر', en: 'Line' }, plural: { ar: 'أسطر', en: 'Lines' } },
  admin: {
    description: {
      ar: 'كل عنصر سطر مستقل في العنوان الكبير. اتركه فارغًا لاستخدام النص الافتراضي.',
      en: 'Each item is one display line. Leave empty to use the default copy.',
    },
  },
  fields: [{ name: 'text', type: 'text', required: true, localized: true }],
})

const toggle = (name: string, ar: string, en: string): Field => ({
  name,
  type: 'checkbox',
  defaultValue: true,
  label: { ar, en },
})

/**
 * Editable homepage copy (spec §10.1 Homepage). Empty fields fall back to the versioned
 * dictionary copy, so the page never renders blank. High-visibility headlines require approval
 * before launch — track them in content/approval-register.md.
 */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: { ar: 'الصفحة الرئيسية', en: 'Homepage' },
  admin: { group: { ar: 'المحتوى', en: 'Content' } },
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { ar: 'الافتتاحية', en: 'Hero' },
          fields: [
            { name: 'heroEyebrow', type: 'text', localized: true, label: { ar: 'السطر التمهيدي', en: 'Eyebrow' } },
            lines('heroHeadline', { ar: 'العنوان الرئيسي', en: 'Headline' }),
            { name: 'heroSubhead', type: 'textarea', localized: true, label: { ar: 'النص التعريفي', en: 'Subhead' } },
            {
              type: 'row',
              fields: [
                { name: 'heroPrimaryCta', type: 'text', localized: true, label: { ar: 'زر رئيسي', en: 'Primary CTA' } },
                { name: 'heroSecondaryCta', type: 'text', localized: true, label: { ar: 'زر ثانوي', en: 'Secondary CTA' } },
              ],
            },
          ],
        },
        {
          label: { ar: 'العبارة والخاتمة', en: 'Statement & closing' },
          fields: [
            lines('statementLines', { ar: 'عبارة الانتقال', en: 'Statement lines' }),
            lines('closingHeadline', { ar: 'عنوان الخاتمة', en: 'Closing headline' }),
            { name: 'closingSubhead', type: 'textarea', localized: true, label: { ar: 'نص الخاتمة', en: 'Closing subhead' } },
          ],
        },
        {
          label: { ar: 'الأقسام', en: 'Sections' },
          fields: [
            toggle('showProof', 'إظهار الأرقام', 'Show proof numbers'),
            toggle('showStatement', 'إظهار العبارة', 'Show statement'),
            toggle('showFarmTypes', 'إظهار أنواع المزارع', 'Show farm types'),
            toggle('showProductUniverse', 'إظهار فئات المنتجات', 'Show product pillars'),
            toggle('showJourney', 'إظهار رحلة الطلب', 'Show distribution journey'),
            toggle('showValues', 'إظهار القيم', 'Show values'),
            toggle('showProductPreview', 'إظهار معاينة المنتجات', 'Show product preview'),
            toggle('showPartnerProof', 'إظهار قسم الشراكة', 'Show partner proof'),
            toggle('showFaq', 'إظهار الأسئلة الشائعة', 'Show FAQ'),
          ],
        },
      ],
    },
  ],
}
