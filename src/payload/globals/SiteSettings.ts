import type { Field, FieldAccess, GlobalConfig } from 'payload'
import { anyone, getUser, isAdmin, isAdminField } from '../access'
import { revalidateGlobalAfterChange } from '../hooks/revalidate'

/** A contact value is visible to the public API only after it has been verified (spec §1.1 "Contact details"). */
const readIfVerified: FieldAccess = ({ req, siblingData }) => Boolean(getUser(req)) || siblingData?.verified === true

const verifiedChannel = (name: string, label: { ar: string; en: string }, type: 'text' | 'email' = 'text'): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    type === 'email'
      ? { name: 'value', type: 'email', access: { read: readIfVerified }, label: { ar: 'القيمة', en: 'Value' } }
      : { name: 'value', type: 'text', access: { read: readIfVerified }, label: { ar: 'القيمة', en: 'Value' } },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      access: { update: isAdminField },
      label: { ar: 'تم التحقق رسميًا — يُعرض للزوار', en: 'Officially verified — show publicly' },
    },
  ],
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { ar: 'إعدادات الموقع', en: 'Site settings' },
  admin: { group: { ar: 'الإدارة', en: 'Administration' } },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { ar: 'قنوات التواصل', en: 'Contact channels' },
          description: {
            ar: 'لا تُعرض أي قناة على الموقع قبل تفعيل «تم التحقق». لا تُدخل أرقامًا تجريبية.',
            en: 'Nothing is shown on the site until "verified" is ticked. Never enter sample numbers.',
          },
          fields: [
            verifiedChannel('phone', { ar: 'الهاتف', en: 'Phone' }),
            verifiedChannel('whatsapp', { ar: 'واتساب', en: 'WhatsApp' }),
            verifiedChannel('email', { ar: 'البريد الإلكتروني', en: 'Email' }, 'email'),
            {
              name: 'address',
              type: 'group',
              label: { ar: 'العنوان', en: 'Address' },
              fields: [
                { name: 'value', type: 'textarea', localized: true, access: { read: readIfVerified } },
                { name: 'mapUrl', type: 'text', access: { read: readIfVerified } },
                { name: 'verified', type: 'checkbox', defaultValue: false, access: { update: isAdminField } },
              ],
            },
            {
              name: 'social',
              type: 'array',
              label: { ar: 'الحسابات الرسمية', en: 'Official social profiles' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: ['facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok'],
                },
                { name: 'url', type: 'text', required: true, access: { read: readIfVerified } },
                { name: 'verified', type: 'checkbox', defaultValue: false, access: { update: isAdminField } },
              ],
            },
          ],
        },
        {
          label: { ar: 'الهوية والنصوص', en: 'Identity & copy' },
          fields: [
            { name: 'legalName', type: 'text', localized: true, label: { ar: 'الاسم القانوني (بعد التحقق)', en: 'Legal entity name (once verified)' } },
            { name: 'footerNotice', type: 'textarea', localized: true, label: { ar: 'ملاحظة التذييل', en: 'Footer notice' } },
            {
              name: 'brandSource',
              type: 'text',
              defaultValue: 'Alshorouk_Brand_Guidelines.pdf v1.0 (October 2026) — logo vectors extracted from PDF pages 3 and 9',
              access: { update: isAdminField },
              label: { ar: 'مصدر الهوية البصرية', en: 'Brand source reference' },
            },
          ],
        },
        {
          label: { ar: 'خصائص الموقع', en: 'Features' },
          fields: [
            {
              name: 'siteStatus',
              type: 'select',
              defaultValue: 'staging',
              options: [
                { label: { ar: 'تجريبي (غير مفهرس)', en: 'Staging (noindex)' }, value: 'staging' },
                { label: { ar: 'منشور', en: 'Production' }, value: 'production' },
              ],
              admin: {
                description: {
                  ar: 'في الوضع التجريبي تُمنع فهرسة محركات البحث.',
                  en: 'Staging blocks search-engine indexing.',
                },
              },
            },
            { name: 'showKnowledgeHub', type: 'checkbox', defaultValue: true, label: { ar: 'إظهار مركز المعرفة في القائمة', en: 'Show knowledge hub in navigation' } },
            {
              name: 'englishApproved',
              type: 'checkbox',
              defaultValue: false,
              label: { ar: 'النسخة الإنجليزية معتمدة للفهرسة', en: 'English copy approved for indexing' },
              admin: {
                description: {
                  ar: 'قبل الاعتماد تبقى الصفحات الإنجليزية متاحة لكن غير مفهرسة.',
                  en: 'Until approved, English pages stay reachable but noindex.',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
