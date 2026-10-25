// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/home.ts (Arabic is primary). /en stays noindex until this copy is approved.
// Approved statements appear in running text as "around 300 poultry farms we serve on an ongoing basis", etc.;
// keep the qualifier with every figure.

import type { HomeDictionary } from '../ar/home'

export const home: HomeDictionary = {
  meta: {
    title: 'Specialised Supply Solutions for Poultry Farms',
    description:
      'Alshorouk supplies poultry feed and feed supplements, and distributes veterinary medicines and vaccines, for broiler, layer and breeder farms.',
  },
  hero: {
    eyebrow: 'Alshorouk | Integrated supply for the poultry sector',
    headline: ['Rooted in the poultry industry,', 'supporting every stage of production.'],
    subhead:
      'Alshorouk is a specialised supply partner for broiler, layer and breeder farms, from poultry feed and feed supplements to veterinary medicines and vaccines.',
    primaryCta: 'Explore our solutions',
    secondaryCta: 'Contact us',
    scrollCue: 'Scroll to explore',
    segmentsLine: 'Broilers · Layers · Breeders',
  },
  proof: {
    eyebrow: 'Alshorouk in numbers',
    title: 'Ongoing working relationships with broiler, layer and breeder farms.',
    footnote: 'Figures are approximate and reflect the current scope of our business.',
  },
  statement: {
    lines: ['Every farm has different needs.', 'And every stage deserves specialised support.'],
    accent: 'specialised support',
    caption: 'That’s why we start with your farm, not with a product list.',
  },
  farmTypes: {
    eyebrow: 'The segments we serve',
    title: ['Three types of farm,', 'each with its own supply needs.'],
    intro:
      'Broiler, layer and breeder farms differ in the products they need and when they need them, so we coordinate supply for each segment around its production cycle.',
    items: [
      {
        key: 'broilers',
        index: '01',
        name: 'Broilers',
        latin: 'Broilers',
        title: 'Supply in step with the broiler cycle',
        body: 'Broiler cycles are short and back-to-back, and each one needs its supplies ready on time. We work with broiler farms to coordinate supply in step with that rhythm.',
        points: [
          'Requests coordinated with the start of each cycle',
          'One source for feed, supplements and veterinary products',
          'Ongoing follow-up from one cycle to the next',
        ],
        cta: 'Explore broiler solutions',
      },
      {
        key: 'layers',
        index: '02',
        name: 'Layers',
        latin: 'Layers',
        title: 'Steady needs across a long laying cycle',
        body: 'A laying cycle runs for many months, so supply must be regular and planned. We help layer farms obtain what they need from our four product categories.',
        points: [
          'Requests scheduled across the laying period',
          'Availability confirmed before each request is finalised',
          'Needs reviewed regularly with farm management',
        ],
        cta: 'Explore layer solutions',
      },
      {
        key: 'breeders',
        index: '03',
        name: 'Breeders',
        latin: 'Breeders',
        title: 'Supply for the flocks where the next generation begins',
        body: 'Breeder flocks produce the hatching eggs behind broiler and layer production, so their needs require careful planning. We work with farm teams to make suitable products available.',
        points: [
          'Requests coordinated with the flock management plan',
          'Product information as stated in approved data',
          'Regular contact throughout the production period',
        ],
        cta: 'Explore breeder solutions',
      },
    ],
  },
  productUniverse: {
    eyebrow: 'Product categories',
    title: ['From feed to vaccines,', 'four categories and one supply partner.'],
    intro:
      'We supply poultry farms with feed and feed supplements, and distribute veterinary medicines and vaccines. Choose a category to browse its products, or request the current list from our team.',
    items: [
      {
        key: 'feed',
        index: '01',
        name: 'Poultry feed',
        body: 'A daily essential on every farm. We supply poultry feed and coordinate quantities and timing with farm management.',
        cta: 'Browse category',
      },
      {
        key: 'supplements',
        index: '02',
        name: 'Feed supplements',
        body: 'We supply poultry feed supplements and present each product with the information on its approved label, so your choice rests on clear data.',
        cta: 'Browse category',
      },
      {
        key: 'medicines',
        index: '03',
        name: 'Veterinary medicines',
        body: 'Veterinary medicines for poultry, distributed to farms with the information from their approved labels. Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
        cta: 'Browse category',
      },
      {
        key: 'vaccines',
        index: '04',
        name: 'Veterinary vaccines',
        body: 'Veterinary vaccines for poultry that we make available to farms, for use according to the programme set by the flock’s veterinarian.',
        cta: 'Browse category',
      },
    ],
    catalogCta: 'Browse the product catalogue',
    exploreBadge: 'Explore',
  },
  journey: {
    eyebrow: 'How we work',
    title: 'From the farm’s needs to follow-up on your request',
    intro:
      'A clear path that starts with understanding your farm’s needs and continues with follow-up after supply, so you know what comes next at every step.',
    steps: [
      {
        title: 'Understanding the farm’s needs',
        body: 'We learn about your farm, its production type and flock size, and the products or categories you need.',
      },
      {
        title: 'Identifying suitable products',
        body: 'We share the available information on approved products in the categories you need; veterinary products are selected with your veterinarian.',
      },
      {
        title: 'Confirming the request and availability',
        body: 'We confirm product availability, quantities and commercial terms with you before the request is finalised.',
      },
      {
        title: 'Coordinating supply',
        body: 'We coordinate supply arrangements and timing according to the terms agreed for each request.',
      },
      {
        title: 'Staying in touch',
        body: 'We stay in touch after supply to follow up on your request and prepare for your next cycle’s needs.',
      },
    ],
    destinationLabel: 'Your farm',
    note: 'The steps shown are indicative; details are confirmed with each customer according to their request.',
  },
  values: {
    eyebrow: 'Our values',
    title: 'Four principles that guide our work',
    intro: 'They shape how we present products, how we handle requests and how we look after our relationship with every farm.',
    items: [
      {
        key: 'integrity',
        name: 'Integrity',
        latin: 'Integrity',
        body: 'We give honest, clear product information as stated in approved data, and we are upfront about availability and terms before any request is confirmed.',
      },
      {
        key: 'precision',
        name: 'Precision',
        latin: 'Precision',
        body: 'We check the details of every request, from product and quantity to supply arrangements, so it matches what was agreed.',
      },
      {
        key: 'reliability',
        name: 'Reliability',
        latin: 'Reliability',
        body: 'Our ongoing relationships with farms rest on doing what we agree and communicating clearly whenever something changes.',
      },
      {
        key: 'expertise',
        name: 'Expertise',
        latin: 'Expertise',
        body: 'We focus on poultry alone, and we know its products and the needs of broiler, layer and breeder farms.',
      },
    ],
  },
  productPreview: {
    eyebrow: 'From the catalogue',
    title: 'Selected products',
    intro: 'A selection of approved products from our catalogue. Browse the catalogue and inquire about any product directly.',
    emptyTitle: 'Our digital catalogue is being prepared',
    emptyBody:
      'We are preparing approved product entries to publish here. In the meantime, you can request the current list directly from our team.',
    emptyCta: 'Request the current list',
    viewAll: 'View all products',
    categoriesLabel: 'Browse the catalogue by category',
  },
  partners: {
    eyebrow: 'Our partners',
    title: 'Companies we work with',
    intro: 'Get to know our partners and explore their products on their official websites.',
    cta: 'Partner with us',
  },
  partnerProof: {
    // The approximate qualifier exactly as it appears inside `narrative` (emphasised with each approved statement).
    narrativeQualifier: 'around',
    eyebrow: 'From the field',
    title: 'Relationships built cycle after cycle',
    narrative:
      'We measure our work in long-term relationships, not one-off deals. Today, three approximate figures sum up their scope: around 300 poultry farms we serve on an ongoing basis, around 15 million birds within the production capacity of the farms we serve, and around 150 veterinary medicine and vaccine products we distribute. These farms span broilers, layers and breeders, and each segment has its own rhythm and needs.',
    segments: [
      {
        key: 'broilers',
        label: 'Broilers',
        caption: 'Farms producing chicken meat',
      },
      {
        key: 'layers',
        label: 'Layers',
        caption: 'Farms producing table eggs',
      },
      {
        key: 'breeders',
        label: 'Breeders',
        caption: 'Flocks producing hatching eggs',
      },
    ],
  },
  faq: {
    eyebrow: 'Common questions',
    title: 'Clear answers before you start',
    items: [
      {
        question: 'Does Alshorouk work with broiler, layer and breeder farms?',
        answer:
          'Yes. We work with all three segments, and our customers include around 300 poultry farms we serve on an ongoing basis. You can see how we work with each segment on our Poultry solutions page.',
      },
      {
        question: 'How do I check whether a product is available?',
        answer:
          'If the product is listed in the catalogue, use the “Inquire about this product” button on its page. If you can’t find it, send a request through the inquiry form with the product name or category, and our team will reply with current availability.',
      },
      {
        question: 'Can I request the current product list?',
        answer:
          'Yes. Request it through the inquiry form, mentioning your farm type and the categories you are interested in, and our team will contact you to share it.',
      },
      {
        question: 'Are prices and availability fixed?',
        answer:
          'No. Prices and availability change from time to time, so we do not publish them on the website. We confirm both with you directly for each request before it is finalised.',
      },
    ],
    moreCta: 'Ask our team',
  },
  closing: {
    headline: ['Your farm deserves a partner', 'that knows what it needs.'],
    // Display-only vermilion phrase inside `headline` (ignored if the CMS headline no longer contains it).
    accent: 'what it needs',
    subhead: 'Talk to the Alshorouk team about your farm’s needs and the products and solutions available.',
    primaryCta: 'Get in touch',
    secondaryCta: 'Browse products',
  },
}
