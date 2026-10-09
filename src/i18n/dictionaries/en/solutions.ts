// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/solutions.ts (Arabic is primary). /en stays noindex until this copy is approved.
// overview.chapters[].latin equals name in English; render the label once.

import type { SolutionsDictionary } from '../ar/solutions'

export const solutions: SolutionsDictionary = {
  overview: {
    meta: {
      title: 'Poultry Solutions: Broilers, Layers and Breeders',
      description:
        'Supply solutions for broiler, layer and breeder farms: poultry feed, feed supplements, veterinary medicines and vaccines, with a clear way to request products.',
    },
    hero: {
      eyebrow: 'Poultry solutions',
      title: ['Supply solutions for', 'broiler, layer and breeder farms'],
      intro:
        'Every poultry segment has its own needs. We work with broiler, layer and breeder farms to supply poultry feed, feed supplements, veterinary medicines and vaccines, matched to each farm’s requirements.',
    },
    indexLabel: 'Segment index',
    railLabel: 'Segment navigation',
    chapters: [
      {
        key: 'broilers',
        index: '01',
        name: 'Broilers',
        latin: 'Broilers',
        title: 'Short cycles that call for organised supply',
        body: 'Broiler farms produce poultry meat in short, successive cycles. We supply feed, feed supplements, veterinary medicines and vaccines, and coordinate requests with farm management ahead of each cycle.',
        cta: 'Explore broiler solutions',
      },
      {
        key: 'layers',
        index: '02',
        name: 'Layers',
        latin: 'Layers',
        title: 'Continuity for the egg-production cycle',
        body: 'Layer farms produce table eggs over a long cycle with steady consumption. We work with them on continuous supply of the categories they need through rearing and laying.',
        cta: 'Explore layer solutions',
      },
      {
        key: 'breeders',
        index: '03',
        name: 'Breeders',
        latin: 'Breeders',
        title: 'Precision where the chain begins',
        body: 'Breeder flocks produce the hatching eggs that start broiler and layer cycles. We work to supply what the farm’s management and veterinarian specify, coordinating every request carefully.',
        cta: 'Explore breeder solutions',
      },
    ],
    matrix: {
      title: 'Four categories across three segments',
      intro:
        'We work to make four main categories available to poultry farms: poultry feed, feed supplements, veterinary medicines and veterinary vaccines. Choose a segment and category to browse the catalogue or send a direct inquiry.',
      note: 'Availability within each category is confirmed with every request, and the information shown is commercial, not a treatment recommendation. Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
    },
    howToRequest: {
      title: 'Three steps to request products',
      steps: [
        {
          title: 'Choose a segment and category',
          body: 'Select your farm’s segment and the category you need, or browse the catalogue directly.',
        },
        {
          title: 'Send your request',
          body: 'List the products or categories you need, approximate quantities and any details that help us understand your requirements.',
        },
        {
          title: 'We confirm the details with you',
          body: 'The Alshorouk team contacts you to review availability, confirm the request and agree on supply.',
        },
      ],
    },
    cta: {
      title: 'Your farm’s needs are the starting point',
      body: 'Tell us your farm’s segment and what you’re looking for in feed, supplements or veterinary products, and our team will contact you to discuss the details.',
      primary: 'Discuss your farm’s needs',
    },
  },
  segments: {
    broilers: {
      meta: {
        title: 'Broiler Farm Solutions',
        description:
          'Supply for broiler farms: poultry feed, feed supplements, veterinary medicines and vaccines, planned around short, successive production cycles.',
      },
      hero: {
        label: 'Broilers',
        title: ['Every broiler cycle starts', 'with clear supply planning.'],
        intro:
          'We work with broiler farms to supply poultry feed, feed supplements, veterinary medicines and vaccines, coordinated around the rhythm of short, successive cycles and each farm’s needs.',
      },
      overview: {
        title: 'What a broiler farm needs from supply',
        body: 'Broiler farms produce poultry meat in short cycles, each followed by the next, so feed, feed supplements and veterinary products need to be ready according to each cycle’s plan. Good supply therefore starts with planning alongside farm management before chick placement, and continues with follow-up until the cycle ends.',
      },
      needs: {
        title: 'Supply needs on broiler farms',
        items: [
          {
            title: 'Planning before each cycle',
            body: 'Reviewing the cycle’s needs for feed, feed supplements and veterinary products before chick placement, so the cycle starts with a clear supply plan.',
          },
          {
            title: 'Categories for each phase of the cycle',
            body: 'Feed and supplement needs change between the start, middle and end of the cycle; we help supply the categories the farm specifies for each phase.',
          },
          {
            title: 'Coordination with the farm veterinarian',
            body: 'We work to supply the veterinary medicines and vaccines specified by the farm’s responsible veterinarian, with each product’s information as stated in its approved data.',
          },
          {
            title: 'Continuity between cycles',
            body: 'With cycles following one another, regular contact matters: we review the finished cycle’s requests with the farm and prepare with it for the next one.',
          },
        ],
      },
      categories: {
        title: 'Product categories for broiler farms',
        intro:
          'Browse the categories we make available to broiler farms, and send an inquiry about any product you don’t see listed. Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
      },
      help: {
        title: 'How we help you request products',
        steps: [
          {
            title: 'Share your cycle plan',
            body: 'Tell us the approximate chick placement date, the categories or products you need, and what the farm veterinarian has specified.',
          },
          {
            title: 'We check availability and confirm',
            body: 'We review the available products and quantities with you, and confirm the request details before any commitment.',
          },
          {
            title: 'We coordinate supply and follow up',
            body: 'We coordinate supply as agreed and stay in touch with you during the cycle and ahead of the next one.',
          },
        ],
      },
      resources: {
        title: 'Broiler farm resources',
        empty:
          'There are no published resources on broiler farms at the moment. For any question about products or how to request them, contact our team directly.',
      },
      form: {
        title: 'Request a product consultation for your broiler farm',
        intro:
          'Leave your details and what you need, and the Alshorouk team will contact you to discuss the products available for your farm. Production type is preset to Broilers.',
      },
      next: {
        label: 'Go to layer solutions',
      },
      cta: 'Request a product consultation',
    },
    layers: {
      meta: {
        title: 'Layer Farm Solutions',
        description:
          'Supply for layer farms: poultry feed, feed supplements, veterinary medicines and vaccines, with the continuity that long table-egg production cycles need.',
      },
      hero: {
        label: 'Layers',
        title: ['A long production cycle', 'calls for continuous supply.'],
        intro:
          'We work with table-egg layer farms to supply poultry feed, feed supplements, veterinary medicines and vaccines, with regular contact through both the rearing and laying phases.',
      },
      overview: {
        title: 'What a layer farm needs from supply',
        body: 'Layer farms produce table eggs over a long cycle that moves from rearing to laying. Throughout that cycle, the farm relies on continuous supply of feed and feed supplements, and on timely availability of the veterinary products set out in its veterinary programme.',
      },
      needs: {
        title: 'Supply needs on layer farms',
        items: [
          {
            title: 'Continuity throughout the cycle',
            body: 'A layer cycle runs for a long period with steady consumption, so supply needs periodic planning that limits gaps in core categories.',
          },
          {
            title: 'Categories for rearing and laying',
            body: 'Flock needs differ between the rearing phase and the laying phase; we help supply the categories the farm specifies for each.',
          },
          {
            title: 'Coordination with the farm veterinarian',
            body: 'The veterinarian responsible for the flock determines the medicines and vaccines required; we work to supply them, with each product’s information as stated in its approved data.',
          },
          {
            title: 'Regular quantities you can plan for',
            body: 'Steady consumption makes it possible to agree on clear recurring requests, with quantities reviewed with the farm whenever its needs change.',
          },
        ],
      },
      categories: {
        title: 'Product categories for layer farms',
        intro:
          'Browse the categories we make available to layer farms for rearing and laying, and ask about any product you don’t see listed. Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
      },
      help: {
        title: 'How we help you request products',
        steps: [
          {
            title: 'Tell us the phase and the need',
            body: 'Let us know the flock’s phase, rearing or laying, the categories or products you need, and approximate quantities.',
          },
          {
            title: 'We agree the details',
            body: 'We review availability and quantities with you and confirm the request before any commitment. Recurring requests can also be reviewed periodically, as agreed.',
          },
          {
            title: 'We follow up throughout the cycle',
            body: 'We coordinate supply as agreed and stay in touch to review your needs as the cycle progresses.',
          },
        ],
      },
      resources: {
        title: 'Layer farm resources',
        empty:
          'There are no published resources on layer farms at the moment. Our team is happy to answer your questions about products and how to request them.',
      },
      form: {
        title: 'Talk to our team about your layer farm',
        intro:
          'Send us the details of what you need, and the Alshorouk team will contact you to review the categories required and their availability. Production type is preset to Layers.',
      },
      next: {
        label: 'Go to breeder solutions',
      },
      cta: 'Talk to our team',
    },
    breeders: {
      meta: {
        title: 'Breeder Farm Solutions',
        description:
          'Supply for breeder farms producing hatching eggs: poultry feed, feed supplements, veterinary medicines and vaccines, coordinated with the farm’s veterinarian.',
      },
      hero: {
        label: 'Breeders',
        title: ['Where the chain', 'of poultry production begins.'],
        intro:
          'Breeder flocks produce the hatching eggs that broiler and layer chicks come from. We work with these farms on precise supply of feed, feed supplements, veterinary medicines and vaccines.',
      },
      overview: {
        title: 'What a breeder farm needs from supply',
        body: 'Breeder farms keep flocks of hens and roosters to produce hatching eggs, over a long cycle that runs from rearing to production. Because these farms sit at the start of the poultry production chain, they need precise, organised supply and clear coordination with their veterinary programme and biosecurity procedures.',
      },
      needs: {
        title: 'Supply needs on breeder farms',
        items: [
          {
            title: 'Precision in every request',
            body: 'We check each product’s name, category and quantity against what farm management has specified, before confirming the request.',
          },
          {
            title: 'Coordination with the veterinary programme',
            body: 'The farm veterinarian sets the farm’s programme of medicines and vaccines; we work to supply what is specified, with each product’s information as stated in its approved data.',
          },
          {
            title: 'Respect for biosecurity procedures',
            body: 'Breeder farms usually apply strict biosecurity procedures, so we schedule supply according to the rules set by farm management.',
          },
          {
            title: 'Follow-up over a long cycle',
            body: 'A breeder cycle runs for a long time, from rearing to production, so we stay in regular contact with the farm to review the needs of each phase.',
          },
        ],
      },
      categories: {
        title: 'Product categories for breeder farms',
        intro:
          'Browse the categories we make available to breeder farms, or send us the farm veterinarian’s product list to review availability together. Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
      },
      help: {
        title: 'How we help you request products',
        steps: [
          {
            title: 'Send the required specifications',
            body: 'Share the flock’s phase and the products or categories specified by farm management and the farm veterinarian, with approximate quantities.',
          },
          {
            title: 'We match and confirm the request',
            body: 'We review the request line by line, clarify what is available, then confirm the details with you before any commitment.',
          },
          {
            title: 'We schedule supply around farm procedures',
            body: 'We schedule supply in line with the farm’s procedures and stay in touch with you throughout the cycle.',
          },
        ],
      },
      resources: {
        title: 'Breeder farm resources',
        empty:
          'There are no published resources on breeder farms at the moment. Contact our team with any question about products or how to request them.',
      },
      form: {
        title: 'Ask about breeder farm solutions',
        intro:
          'Send your inquiry, and the Alshorouk team will contact you to discuss your farm’s needs and confirm the details. Production type is preset to Breeders.',
      },
      next: {
        label: 'Go to broiler solutions',
      },
      cta: 'Ask about our solutions',
    },
  },
}
