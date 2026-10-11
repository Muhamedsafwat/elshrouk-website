import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook, type CollectionConfig } from 'payload'
import { getUser, isAdmin, isAdminOrSales, nobody } from '../access'

/** Submitted data is evidence of what the visitor sent: never editable after creation (spec §10.3, §11). */
const immutable = () => false

export const INQUIRY_TYPES = ['farm', 'product', 'partner', 'general'] as const
export type InquiryType = (typeof INQUIRY_TYPES)[number]

export const INQUIRY_STATUSES = ['new', 'contacted', 'qualified', 'closed', 'rejected'] as const
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

/** Lifecycle (spec §10.3): new → contacted → qualified → closed / rejected. */
export const ALLOWED_TRANSITIONS: Record<InquiryStatus, InquiryStatus[]> = {
  new: ['contacted', 'rejected', 'closed'],
  contacted: ['qualified', 'closed', 'rejected'],
  qualified: ['closed', 'rejected'],
  closed: [],
  rejected: [],
}

type HistoryEntry = { id?: string | null; status?: string | null; at?: string | null; by?: string | null }

/** The stored audit trail, copied entry by entry (known keys only). */
const storedHistory = (doc: unknown): HistoryEntry[] => {
  const rows = (doc as { statusHistory?: unknown } | undefined)?.statusHistory
  if (!Array.isArray(rows)) return []
  return rows.map((row: HistoryEntry) => ({ id: row?.id, status: row?.status, at: row?.at, by: row?.by }))
}

/**
 * Lifecycle + audit trail (spec §10.3). `statusHistory` is server-owned: on every update it is REBUILT from the
 * stored record (plus one entry when the status really changes), so a value sent through REST or the admin is
 * ignored and the trail cannot be forged or truncated (SEC-02).
 */
export const enforceLifecycle: CollectionBeforeChangeHook = ({ data, originalDoc, operation, req }) => {
  if (operation === 'create') {
    data.status = 'new'
    data.statusHistory = [{ status: 'new', at: new Date().toISOString(), by: 'system' }]
    return data
  }
  const from = (originalDoc?.status ?? 'new') as InquiryStatus
  const to = (data.status ?? from) as InquiryStatus
  const history = storedHistory(originalDoc)
  if (to !== from) {
    if (!ALLOWED_TRANSITIONS[from]?.includes(to)) {
      throw new APIError(`Invalid status change: ${from} → ${to}`, 400)
    }
    const actor = getUser(req)
    history.push({ status: to, at: new Date().toISOString(), by: actor ? String(actor.id) : 'system' })
  }
  data.statusHistory = history
  return data
}

/** Optional e-mail notification — only when SMTP + recipient are configured (spec §10.3). */
const notifySales: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc
  const to = process.env.INQUIRY_NOTIFY_EMAIL
  if (!to || !process.env.SMTP_HOST) {
    req.payload.logger.info(`[inquiry ${doc.reference}] stored in CMS; notifications pending SMTP configuration`)
    return doc
  }
  try {
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/admin/collections/inquiries/${doc.id}`
    await req.payload.sendEmail({
      to,
      subject: `New ${doc.type} inquiry — ${doc.reference}`,
      // No PII in the e-mail body: sales staff open the record in the authenticated admin.
      text: `A new ${doc.type} inquiry (${doc.reference}) was received.\nOpen it in the CMS: ${adminUrl}`,
    })
  } catch (error) {
    req.payload.logger.error({ err: error, msg: `[inquiry ${doc.reference}] notification failed (record is stored)` })
  }
  return doc
}

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: { ar: 'طلب / استفسار', en: 'Inquiry' }, plural: { ar: 'الطلبات والاستفسارات', en: 'Inquiries' } },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'type', 'name', 'segment', 'status', 'createdAt'],
    listSearchableFields: ['reference', 'name', 'phone', 'organization'],
    group: { ar: 'المبيعات', en: 'Sales' },
    description: {
      ar: 'طلبات الزوار المحفوظة. بيانات شخصية — لا تُصدَّر أو تُشارك خارج فريق المبيعات المخوّل.',
      en: 'Stored visitor submissions. Personal data — do not export or share outside the authorised sales team.',
    },
  },
  defaultSort: '-createdAt',
  access: {
    // Public submissions never use REST: the server action validates, rate-limits and writes via the Local API.
    create: nobody,
    read: isAdminOrSales,
    update: isAdminOrSales,
    delete: isAdmin,
  },
  hooks: { beforeChange: [enforceLifecycle], afterChange: [notifySales] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'reference', access: { update: immutable }, type: 'text', required: true, unique: true, index: true, admin: { readOnly: true }, label: { ar: 'الرقم المرجعي', en: 'Reference' } },
        {
          name: 'type',
          access: { update: immutable },
          type: 'select',
          required: true,
          index: true,
          label: { ar: 'نوع الطلب', en: 'Type' },
          admin: { readOnly: true },
          options: [
            { label: { ar: 'مزرعة', en: 'Farm' }, value: 'farm' },
            { label: { ar: 'منتج', en: 'Product' }, value: 'product' },
            { label: { ar: 'شراكة', en: 'Partnership' }, value: 'partner' },
            { label: { ar: 'عام', en: 'General' }, value: 'general' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      label: { ar: 'الحالة', en: 'Status' },
      options: [
        { label: { ar: 'جديد', en: 'New' }, value: 'new' },
        { label: { ar: 'تم التواصل', en: 'Contacted' }, value: 'contacted' },
        { label: { ar: 'مؤهَّل', en: 'Qualified' }, value: 'qualified' },
        { label: { ar: 'مغلق', en: 'Closed' }, value: 'closed' },
        { label: { ar: 'مرفوض', en: 'Rejected' }, value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: { ar: 'بيانات التواصل', en: 'Contact' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', access: { update: immutable }, type: 'text', required: true, admin: { readOnly: true }, label: { ar: 'الاسم', en: 'Name' } },
            { name: 'phone', access: { update: immutable }, type: 'text', required: true, admin: { readOnly: true }, label: { ar: 'الهاتف', en: 'Phone' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'email', access: { update: immutable }, type: 'email', admin: { readOnly: true }, label: { ar: 'البريد', en: 'Email' } },
            { name: 'organization', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'المزرعة / الشركة', en: 'Farm / company' } },
            { name: 'role', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'الصفة', en: 'Role' } },
          ],
        },
        { name: 'governorate', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'المحافظة', en: 'Governorate' } },
      ],
    },
    {
      type: 'collapsible',
      label: { ar: 'تفاصيل الطلب', en: 'Request' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'segment',
          access: { update: immutable },
              type: 'select',
              admin: { readOnly: true },
              label: { ar: 'نوع الإنتاج', en: 'Production type' },
              options: [
                { label: { ar: 'تسمين', en: 'Broilers' }, value: 'broilers' },
                { label: { ar: 'بياض', en: 'Layers' }, value: 'layers' },
                { label: { ar: 'أمهات', en: 'Breeders' }, value: 'breeders' },
                { label: { ar: 'أكثر من نوع', en: 'Multiple' }, value: 'multiple' },
              ],
            },
            {
              name: 'productCategory',
          access: { update: immutable },
              type: 'select',
              admin: { readOnly: true },
              label: { ar: 'فئة المنتج', en: 'Product category' },
              options: [
                { label: { ar: 'أعلاف', en: 'Feed' }, value: 'feed' },
                { label: { ar: 'مكملات أعلاف', en: 'Supplements' }, value: 'supplements' },
                { label: { ar: 'أدوية بيطرية', en: 'Medicines' }, value: 'medicines' },
                { label: { ar: 'لقاحات بيطرية', en: 'Vaccines' }, value: 'vaccines' },
                { label: { ar: 'غير محدد', en: 'Not sure' }, value: 'unsure' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'productRef', access: { update: immutable }, type: 'relationship', relationTo: 'products', admin: { readOnly: true }, label: { ar: 'المنتج', en: 'Product' } },
            { name: 'productLabel', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'اسم المنتج وقت الطلب', en: 'Product name at submission' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'birdCapacity', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'الطاقة التقريبية', en: 'Approx. capacity' } },
            { name: 'quantity', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'الكمية المطلوبة', en: 'Requested quantity' } },
            { name: 'productLine', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'خط المنتجات (شراكة)', en: 'Product line (partner)' } },
          ],
        },
        { name: 'requestDetails', access: { update: immutable }, type: 'textarea', admin: { readOnly: true }, label: { ar: 'الرسالة', en: 'Message' } },
      ],
    },
    {
      type: 'collapsible',
      label: { ar: 'المصدر والموافقة', en: 'Source & consent' },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'locale', access: { update: immutable }, type: 'select', options: ['ar', 'en'], admin: { readOnly: true } },
            { name: 'sourcePath', access: { update: immutable }, type: 'text', admin: { readOnly: true }, label: { ar: 'صفحة المصدر', en: 'Source page' } },
            { name: 'consentAt', access: { update: immutable }, type: 'date', required: true, admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } }, label: { ar: 'وقت الموافقة', en: 'Consent at' } },
          ],
        },
        { name: 'idempotencyKey', access: { update: immutable }, type: 'text', unique: true, index: true, admin: { readOnly: true, hidden: true } },
        {
          name: 'statusHistory',
          type: 'array',
          admin: { readOnly: true },
          label: { ar: 'سجل الحالة', en: 'Status history' },
          fields: [
            { name: 'status', type: 'text' },
            { name: 'at', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
            { name: 'by', type: 'text' },
          ],
        },
      ],
    },
    { name: 'adminNotes', type: 'textarea', label: { ar: 'ملاحظات فريق المبيعات', en: 'Sales notes' }, admin: { position: 'sidebar' } },
  ],
}
