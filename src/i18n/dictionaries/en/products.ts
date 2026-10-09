// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/products.ts (Arabic is primary). /en stays noindex until this copy is approved.
// English plural forms collapse to countOne / count; the extra Arabic plural keys are kept for shape parity.

import type { ProductsDictionary } from '../ar/products'

export const products: ProductsDictionary = {
  catalog: {
    meta: {
      title: 'Poultry Farm Product Catalogue',
      description:
        'Browse Alshorouk’s B2B catalogue of poultry feed, feed supplements, veterinary medicines and vaccines, and send an inquiry to confirm availability and price.',
    },
    hero: {
      eyebrow: 'Products',
      title: ['The poultry farm', 'product catalogue'],
      intro:
        'A B2B catalogue of what we supply to poultry farms: feed, feed supplements, veterinary medicines and vaccines. Prices aren’t listed; our team confirms price and availability when you inquire.',
    },
    search: {
      label: 'Search the catalogue',
      placeholder: 'Search by name, manufacturer or product code',
      clear: 'Clear search',
      submit: 'Search',
    },
    filters: {
      title: 'Filter results',
      category: 'Category',
      segment: 'Production type',
      manufacturer: 'Manufacturer',
      form: 'Form',
      reset: 'Reset filters',
      apply: 'Show results',
      showFilters: 'Show filters',
      hideFilters: 'Hide filters',
      any: 'All',
    },
    results: {
      count: '{count} products',
      countZero: 'No matching products',
      countOne: '1 product',
      countTwo: '2 products',
      countFew: '{count} products',
      countMany: '{count} products',
    },
    states: {
      loading: 'Loading products…',
      emptyFilteredTitle: 'No products match your selection',
      emptyFilteredBody:
        'Try a different search term or remove some filters. You can also describe the product you’re looking for in an inquiry.',
      resetFilters: 'Reset filters',
      emptyCatalogTitle: 'We’re adding products to the digital catalogue',
      emptyCatalogBody:
        'Products will appear here as their details are reviewed and approved. In the meantime, you can request the current product list using the form.',
      emptyCatalogCta: 'Request the product list',
      errorTitle: 'We couldn’t load the products',
      errorBody:
        'Something went wrong while loading the catalogue. Please try again shortly, or send your inquiry from the contact page.',
      retry: 'Try again',
    },
    categoryBrowser: {
      title: 'Browse by category',
      intro:
        'We make poultry farm products available across four main categories. Choose a category to see its products in the catalogue, or send an inquiry about it directly.',
      viewProducts: 'View products',
      inquire: 'Ask about this category',
    },
    pagination: {
      label: 'Product pages',
      previous: 'Previous',
      next: 'Next',
      page: 'Page {page} of {total}',
      loadMore: 'Load more products',
    },
    card: {
      inquire: 'Inquire about this product',
      details: 'View details',
      imageFallbackAlt: 'Illustrative image for the {category} category',
    },
    availability: {
      inquiry_only: 'Availability on inquiry',
      on_request: 'Supplied on request',
      confirmed: 'Availability confirmed',
    },
    inquiryCta: {
      title: 'Can’t find the product you need?',
      body: 'Tell us which product or category your farm needs, and our team will follow up with you directly.',
      cta: 'Send an inquiry',
    },
  },
  detail: {
    breadcrumbsLabel: 'Breadcrumb',
    backToCatalog: 'Back to catalogue',
    category: 'Category',
    segments: 'Production types',
    targetSpecies: 'Target species',
    targetSpeciesValue: 'Poultry',
    manufacturer: 'Manufacturer',
    form: 'Form',
    packSize: 'Pack size',
    sku: 'Product code (SKU)',
    availabilityLabel: 'Availability',
    description: 'Product description',
    label: 'Approved label',
    downloadLabel: 'Download label (PDF)',
    warnings: 'Warnings',
    related: 'Related products',
    inquireTitle: 'Inquire about this product',
    inquireBody:
      'Send your inquiry and our team will contact you to confirm availability and price and to discuss supply details.',
    infoNote:
      'Product information is provided for commercial reference only. It is not a treatment recommendation or guidance on use or dosage.',
    vetNote:
      'Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
    metaDescriptionFallback:
      'View {name} in Alshorouk’s poultry farm product catalogue and send an inquiry to confirm availability and price.',
  },
  drawer: {
    title: 'Product inquiry',
    productLabel: 'Product',
    intro:
      'Enter your contact details and anything that helps our team understand your request, such as the approximate quantity or production type.',
    close: 'Close',
    submit: 'Send inquiry',
    submitting: 'Sending…',
    successTitle: 'Your inquiry has been received',
    success:
      'We’ve recorded your inquiry about this product. Our team will contact you on the phone number you provided.',
    successReference: 'Reference: {reference}',
  },
}
