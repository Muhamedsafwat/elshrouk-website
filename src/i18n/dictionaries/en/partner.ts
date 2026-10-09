// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/partner.ts (Arabic is primary). /en stays noindex until this copy is approved.

import type { PartnerDictionary } from '../ar/partner'

export const partner: PartnerDictionary = {
  meta: {
    title: 'Supply and Distribution Partnerships',
    description:
      'Manufacturers and suppliers of poultry feed, feed supplements, veterinary medicines and vaccines: talk to Alshorouk about distributing to poultry farms.',
  },
  hero: {
    eyebrow: 'Partner with us',
    title: ['Let’s talk about distributing', 'your products to poultry farms.'],
    accent: 'poultry farms',
    intro:
      'We welcome conversations with manufacturers and suppliers of poultry farm products about supply or agency opportunities that serve the broiler, layer and breeder farms we work with.',
  },
  relationship: {
    title: 'Areas we’re open to discussing',
    items: [
      {
        title: 'Poultry feed and feed supplements',
        body: 'We’re interested in feed and feed supplement products made for poultry, and in exploring how to make them available to broiler, layer and breeder farms.',
      },
      {
        title: 'Veterinary medicines and vaccines',
        body: 'We discuss distribution opportunities for registered poultry veterinary medicines and vaccines, in line with applicable regulatory requirements.',
      },
      {
        title: 'Supply or agency',
        body: 'A partnership may take the form of regular supply or a distribution agency. We agree the right framework together after reviewing the product and market needs.',
      },
    ],
  },
  fit: {
    title: 'What helps us start the conversation',
    items: [
      'Products registered in line with local regulatory requirements',
      'Clear documentation, including approved labels and manufacturer details',
      'Products made for the poultry sector',
      'Openness to a long-term, transparent commercial relationship',
    ],
  },
  process: {
    title: 'How we get started',
    steps: [
      {
        title: 'Introduce your company',
        body: 'Send your company details and the product line you’re proposing using the form.',
      },
      {
        title: 'Initial review',
        body: 'Our team reviews the information and documents provided to assess how well the products fit the needs of the poultry farms we work with.',
      },
      {
        title: 'Detailed discussion',
        body: 'Where there’s an initial fit, we contact you to discuss the scope and details of working together.',
      },
    ],
  },
  form: {
    title: 'Start the conversation',
    intro:
      'Share your company details and the product line you’re proposing. Our team will get in touch after reviewing your request.',
    fields: {
      company: 'Company name',
      role: 'Job title',
      productLine: 'Proposed product line',
      rolePlaceholder: 'For example: export manager or business development manager',
      messagePlaceholder: 'Tell us about your company, your products and their registration, and the kind of cooperation you propose.',
      productLineHint: 'For example: feed supplements or veterinary vaccines for poultry',
      website: 'Company website',
    },
  },
}
