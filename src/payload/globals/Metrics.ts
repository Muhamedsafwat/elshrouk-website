import { APIError, type GlobalConfig } from 'payload'
import { anyone, canApproveContent, getUser, isStaffField } from '../access'
import { revalidateGlobalAfterChange } from '../hooks/revalidate'

export const METRIC_KEYS = ['farms', 'birds', 'products'] as const
export type MetricKey = (typeof METRIC_KEYS)[number]

/**
 * The three client-supplied proof figures (spec §1.1). Editable only by users authorised to approve
 * commercial data. Qualifiers ("حوالي" / "approximately") are mandatory.
 */
export const Metrics: GlobalConfig = {
  slug: 'metrics',
  label: { ar: 'الأرقام المعتمدة', en: 'Approved metrics' },
  admin: {
    group: { ar: 'المحتوى', en: 'Content' },
    description: {
      ar: 'أرقام تقريبية قدّمتها الشركة. أي تعديل يتطلب تفويضًا بالاعتماد ودليلًا داعمًا.',
      en: 'Approximate figures supplied by the company. Changes require approval authority and evidence.',
    },
  },
  access: {
    read: anyone,
    update: ({ req }) => Boolean(getUser(req)) && canApproveContent(req),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        const items = (data.items ?? []) as Array<{ qualifier?: string; key?: string }>
        if (items.length !== 3) throw new APIError('Exactly three metrics are required (farms, birds, products).', 400)
        for (const item of items) {
          if (!item.qualifier || !item.qualifier.trim()) {
            throw new APIError(`Metric "${item.key}" needs its approximation qualifier.`, 400)
          }
        }
        return data
      },
    ],
    afterChange: [revalidateGlobalAfterChange],
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      labels: { singular: { ar: 'رقم', en: 'Metric' }, plural: { ar: 'الأرقام', en: 'Metrics' } },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              type: 'select',
              required: true,
              options: [
                { label: { ar: 'المزارع', en: 'Farms' }, value: 'farms' },
                { label: { ar: 'الطيور', en: 'Birds' }, value: 'birds' },
                { label: { ar: 'المنتجات', en: 'Products' }, value: 'products' },
              ],
            },
            { name: 'qualifier', type: 'text', required: true, localized: true, label: { ar: 'المُحدِّد (حوالي)', en: 'Qualifier (approximately)' } },
            { name: 'value', type: 'text', required: true, label: { ar: 'القيمة (أرقام غربية)', en: 'Value (western digits)' } },
            { name: 'unit', type: 'text', localized: true, label: { ar: 'الوحدة', en: 'Unit' } },
          ],
        },
        { name: 'label', type: 'text', required: true, localized: true, label: { ar: 'الوصف المعروض', en: 'Display label' } },
        { name: 'srLabel', type: 'text', required: true, localized: true, label: { ar: 'النص الكامل لقارئات الشاشة', en: 'Full screen-reader sentence' } },
        {
          name: 'accuracyNote',
          type: 'textarea',
          access: { read: isStaffField }, // internal editor note: never in the public API
          label: { ar: 'ملاحظة الدقة والمصدر (داخلية)', en: 'Accuracy & source note (internal)' },
        },
      ],
    },
    { name: 'footnote', type: 'text', localized: true, label: { ar: 'الحاشية', en: 'Footnote' } },
  ],
}
