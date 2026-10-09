import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import type { ErrorCode, InquiryKind, ProductCategoryOption, ProductionType } from '@/lib/inquiries/schema'

/**
 * Serializable copy for the inquiry form, assembled on the server from the shared form dictionary
 * (common.forms) plus contact/partner page keys — the client bundle never imports the dictionaries.
 */
export type FailureCode = 'rateLimited' | 'network' | 'server' | 'spam'

type Field = { label: string; placeholder?: string; help?: string }

export type InquiryFormStrings = {
  typeLegend: string
  types: Record<InquiryKind, { title: string; description: string }>
  sections: { about: string; need: string }
  optional: string
  fields: {
    name: Field
    phone: Field
    email: Field
    organization: Field
    company: Field
    role: Field
    partnerRole: Field
    segment: Field
    birdCapacity: Field
    governorate: Field
    productCategory: Field
    quantity: Field
    productLine: Field
    message: Field
    partnerMessage: Field
  }
  options: {
    productionTypes: Record<ProductionType, string>
    productCategories: Record<ProductCategoryOption, string>
    /** value = Arabic name (what sales reads in the CMS), label = visitor's locale. */
    governorates: { value: string; label: string }[]
  }
  consent: { label: string; fieldLabel: string; privacyLink: string; newTab: string }
  honeypotLabel: string
  submit: string
  submitting: string
  errors: Record<ErrorCode | FailureCode, string> & { summaryTitle: string }
  success: { title: string; body: string; another: string; referenceLabel: string }
  failure: { title: string; retry: string }
  product: { label: string; hint: string; clear: string }
}

export function buildInquiryStrings(locale: Locale): InquiryFormStrings {
  const dict = getDictionary(locale)
  const f = dict.common.forms
  const c = dict.contact
  const p = dict.partner.form.fields
  const arGovernorates = getDictionary('ar').common.forms.options.governorates
  return {
    typeLegend: c.form.typeLegend,
    types: c.types,
    sections: { about: c.form.sectionAbout, need: c.form.sectionNeed },
    optional: f.optional,
    fields: {
      name: { label: f.fields.fullName.label },
      phone: f.fields.phone,
      email: f.fields.email,
      organization: f.fields.organization,
      company: { label: p.company },
      role: f.fields.role,
      partnerRole: { label: p.role, placeholder: p.rolePlaceholder },
      segment: f.fields.productionType,
      birdCapacity: f.fields.birdCapacity,
      governorate: f.fields.governorate,
      productCategory: f.fields.productCategory,
      quantity: f.fields.quantity,
      productLine: { label: p.productLine, placeholder: p.productLineHint },
      message: f.fields.message,
      partnerMessage: { label: f.fields.message.label, placeholder: p.messagePlaceholder, help: f.fields.message.help },
    },
    options: {
      productionTypes: f.options.productionTypes,
      productCategories: f.options.productCategories,
      governorates: f.options.governorates.map((label, i) => ({ value: arGovernorates[i] ?? label, label })),
    },
    consent: { label: f.consentText, fieldLabel: f.fields.consent.label, privacyLink: f.privacyLinkText, newTab: c.formUi.newTab },
    honeypotLabel: f.honeypotLabel,
    submit: f.submit,
    submitting: c.formUi.sending,
    errors: {
      required: f.errors.required,
      invalidPhone: f.errors.invalidPhone,
      invalidEmail: f.errors.invalidEmail,
      tooShort: f.errors.tooShort,
      tooLong: f.errors.tooLong,
      consentRequired: f.errors.consentRequired,
      rateLimited: f.errors.rateLimited,
      network: f.errors.network,
      server: f.errors.server,
      spam: c.formUi.spam,
      summaryTitle: f.errors.summaryTitle,
    },
    success: { ...f.success, referenceLabel: c.formUi.referenceLabel },
    failure: { title: f.failure.title, retry: f.failure.retry },
    product: { label: c.prefill.productLabel, hint: c.formUi.productHint, clear: c.prefill.clear },
  }
}
