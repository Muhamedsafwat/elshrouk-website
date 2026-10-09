// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/howWeWork.ts (Arabic is primary). /en stays noindex until this copy is approved.

import type { HowWeWorkDictionary } from '../ar/howWeWork'

export const howWeWork: HowWeWorkDictionary = {
  meta: {
    title: 'How We Work: From Farm Needs to Follow-up',
    description:
      'How we work with poultry farms: understanding the need, identifying suitable products, confirming availability, coordinating supply and staying in touch.',
  },
  hero: {
    eyebrow: 'How we work',
    title: ['From the farm’s needs', 'to follow-up on your request.'],
    accent: 'follow-up',
    intro:
      'A clear way of working that starts with understanding your farm’s needs, confirms the details before any commitment, and continues with contact after supply.',
  },
  steps: [
    {
      index: '01',
      title: 'Understanding the farm’s needs',
      body: 'We learn about your farm and its production type, whether broilers, layers or breeders, and the categories or products you need, with approximate quantities.',
    },
    {
      index: '02',
      title: 'Identifying suitable products',
      body: 'We match your request with the available products and share their approved information. For veterinary products, we rely on what the farm veterinarian specifies.',
    },
    {
      index: '03',
      title: 'Confirming the request and availability',
      body: 'We review availability, quantities and supply terms with you. A request is confirmed only once its details are clearly agreed.',
    },
    {
      index: '04',
      title: 'Coordinating supply',
      body: 'We coordinate the timing and arrangements of supply as agreed with the farm, and communicate any change as it happens.',
    },
    {
      index: '05',
      title: 'Staying in touch',
      body: 'We follow up after supply and review the farm’s needs with each new cycle, so the relationship stays grounded in clear information.',
    },
  ],
  disclaimer:
    'These steps describe our general way of working; the specifics are agreed with each customer according to the nature of their request. Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
  principles: {
    title: 'Three principles in every request',
    items: [
      {
        title: 'Clear information',
        body: 'We present product information as stated in its approved data, and clearly separate what is available from what still needs confirming.',
      },
      {
        title: 'Confirmation before commitment',
        body: 'We make no promise on availability or timing before checking it, and we confirm the request details with you before acting on them.',
      },
      {
        title: 'Ongoing communication',
        body: 'We stay in touch after supply, listen to your feedback and review your farm’s needs with each cycle.',
      },
    ],
  },
  form: {
    title: 'Send your request or inquiry',
    intro:
      'Share a few details about your farm and what it needs, and the Alshorouk team will contact you to take the next steps.',
  },
  cta: {
    title: 'Ready to discuss your farm’s needs?',
    primary: 'Start your request',
  },
}
