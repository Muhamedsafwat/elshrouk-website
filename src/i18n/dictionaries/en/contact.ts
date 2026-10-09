// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/contact.ts (Arabic is primary). /en stays noindex until this copy is approved.

import type { ContactDictionary } from '../ar/contact'

export const contact: ContactDictionary = {
  meta: {
    title: 'Contact Us',
    description:
      'Contact the Alshorouk team about your poultry farm’s needs, a specific product or a partnership opportunity, using a short inquiry form.',
  },
  hero: {
    eyebrow: 'Contact us',
    title: ['Talk to the Alshorouk team', 'about your farm’s needs.'],
    intro:
      'Choose an inquiry type and leave your details. Our team will contact you to discuss your request, whether it’s a poultry farm’s needs, a specific product or a partnership.',
  },
  types: {
    farm: {
      title: 'Farm needs',
      description: 'Discuss the product needs of a broiler, layer or breeder farm.',
    },
    product: {
      title: 'Product inquiry',
      description: 'Ask about a specific product or product category and confirm availability and price.',
    },
    partner: {
      title: 'Partnership and supply',
      description:
        'For manufacturers and suppliers who want to discuss distributing their products to poultry farms.',
    },
    general: {
      title: 'General inquiry',
      description: 'Any other question about Alshorouk or how we work.',
    },
  },
  form: {
    title: 'Send your request',
    intro: 'We only ask for the details we need to contact you and understand your request.',
    typeLegend: 'Inquiry type',
    sectionAbout: 'Your contact details',
    sectionNeed: 'Request details',
  },
  aside: {
    title: 'What happens after you send your request?',
    steps: [
      {
        title: 'We log your request',
        body: 'Your request is logged with its inquiry type and any product you selected, so the relevant team can review it.',
      },
      {
        title: 'We review the details',
        body: 'The team reviews your request and gathers the available information on the products or categories you mentioned.',
      },
      {
        title: 'We get in touch',
        body: 'We contact you on the phone number you provided to discuss your request and next steps, such as confirming availability and price.',
      },
    ],
    privacyNote:
      'We use your details only to respond to and follow up on your request. We don’t sell them or share them for marketing.',
    privacyLink: 'Read our privacy policy',
  },
  prefill: {
    productLabel: 'Selected product',
    segmentLabel: 'Selected production type',
    clear: 'Remove selection',
  },
}
