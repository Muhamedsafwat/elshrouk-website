// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/knowledge.ts (Arabic is primary). /en stays noindex until this copy is approved.
// English reading-time forms collapse to minutesOne / minutes; the extra Arabic plural keys are kept for shape parity.

import type { KnowledgeDictionary } from '../ar/knowledge'

export const knowledge: KnowledgeDictionary = {
  hub: {
    meta: {
      title: 'Knowledge Hub for Poultry Farms',
      description:
        'Practical reading from Alshorouk for poultry farm owners and managers on farm business, feed supplements, veterinary product handling and company news.',
    },
    hero: {
      eyebrow: 'Knowledge',
      title: ['Practical knowledge', 'for poultry farms'],
      intro:
        'Clear, concise articles on poultry farm business, feed supplements, veterinary product handling and Alshorouk news, published after editorial review and, where needed, review by a qualified professional.',
    },
    categoriesTitle: 'Browse by topic',
    allCategories: 'All topics',
    categories: [
      {
        key: 'farm-business',
        name: 'Poultry farm business',
        description:
          'Practical topics on planning a farm’s product needs, organising orders and working with suppliers.',
      },
      {
        key: 'feed-supplements',
        name: 'Understanding feed supplements',
        description:
          'General information on feed supplement categories and how to read their product details, without formulations or dosages.',
      },
      {
        key: 'vet-product-handling',
        name: 'Handling veterinary products',
        description:
          'General information on receiving and storing veterinary products, reviewed by a qualified professional before publication and never a substitute for a veterinarian’s advice.',
      },
      {
        key: 'company-news',
        name: 'Alshorouk news',
        description: 'Company updates and official announcements about our work with poultry farms.',
      },
    ],
    empty: {
      title: 'Our first articles are in review',
      body: 'We’re preparing a set of articles for poultry farms, and they’re currently in editorial and professional review before being published here. Until then, our team is happy to answer your questions about products and orders.',
      cta: 'Contact our team',
    },
    card: {
      readMore: 'Read article',
      minutes: '{minutes} min read',
      minutesOne: '1 min read',
      minutesTwo: '2 min read',
      minutesMany: '{minutes} min read',
    },
  },
  article: {
    breadcrumbs: 'Breadcrumb',
    byline: 'By {author}',
    published: 'Published',
    updated: 'Last updated',
    readingTime: 'Reading time',
    sources: 'Sources',
    related: 'Related articles',
    share: 'Share this article',
    copyLink: 'Copy link',
    copied: 'Link copied',
    backToHub: 'Back to the knowledge hub',
    reviewedNote: 'This article was reviewed by a qualified professional before publication.',
    disclaimer:
      'This article provides general information for awareness only. It is not veterinary advice or a treatment recommendation. Consult a veterinarian about any decision affecting your flock’s health.',
    vetNote:
      'Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
    metaDescriptionFallback: 'Read “{title}” in Alshorouk’s knowledge hub for poultry farms.',
  },
}
