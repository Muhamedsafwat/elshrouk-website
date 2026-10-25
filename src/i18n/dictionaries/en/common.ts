// Copy status: review_required — see content/approval-register.md
// English adaptation of ../ar/common.ts (Arabic is primary). /en stays noindex until this copy is approved.
// metrics.items use the approved English statements ("~300 poultry farms we serve on an ongoing basis", etc.).
// governorates are index-aligned with the Arabic list. English reading-time forms share one pattern;
// the extra Arabic plural keys are kept for shape parity.

import type { CommonDictionary } from '../ar/common'

export const common: CommonDictionary = {
  brand: {
    name: 'Alshorouk',
    latinName: 'Alshorouk',
    logoAlt:
      'Alshorouk logo: a rooster head above the Arabic wordmark Alshorouk, with the descriptor “for the distribution of veterinary medicines and vaccines”',
  },
  nav: {
    home: 'Home',
    about: 'About',
    solutions: 'Poultry solutions',
    products: 'Products',
    partners: 'Partners',
    howWeWork: 'How we work',
    knowledge: 'Knowledge',
    contact: 'Contact',
  },
  solutionsMenu: {
    // Shorter than nav.solutions so the one-line English header fits at 1024px and 1280px.
    label: 'Solutions',
    overview: 'Overview',
    broilers: 'Broilers',
    layers: 'Layers',
    breeders: 'Breeders',
  },
  header: {
    cta: 'Talk to our team',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuLabel: 'Menu',
    skipToContent: 'Skip to main content',
    primaryNavLabel: 'Main navigation',
    language: {
      label: 'Language',
      switchToEnglish: 'EN',
      switchToArabic: 'ع',
      englishName: 'English',
      arabicName: 'العربية',
    },
  },
  footer: {
    statement: 'Specialised supply for broiler, layer and breeder farms.',
    navTitle: 'Quick links',
    solutionsTitle: 'Poultry solutions',
    categoriesTitle: 'Product categories',
    contactTitle: 'Contact',
    contactBody:
      'Questions about our products or your farm’s needs? Send a request through the inquiry form and the Alshorouk team will get back to you.',
    privacy: 'Privacy policy',
    partner: 'Partner with us',
    copyright: '© {year} Alshorouk. All rights reserved.',
    backToTop: 'Back to top',
  },
  cta: {
    contactTeam: 'Contact the Alshorouk team',
    requestProducts: 'Request products',
    exploreSolutions: 'Explore our solutions',
    contactUs: 'Contact us',
    startContact: 'Get in touch',
    browseProducts: 'Browse products',
    discussFarmNeeds: 'Discuss your farm’s needs',
    requestCatalog: 'Request the product list',
    requestCurrentList: 'Request the current list',
    inquireProduct: 'Inquire about this product',
    startPartnership: 'Start a partnership with Alshorouk',
    startRequest: 'Start your request',
    learnMore: 'Learn more',
    viewAll: 'View all',
    backHome: 'Back to home',
  },
  segments: {
    broilers: {
      name: 'Broilers',
      latin: 'Broilers',
      short: 'Supply for broiler farms, in step with each production cycle.',
    },
    layers: {
      name: 'Layers',
      latin: 'Layers',
      short: 'Supply for table-egg farms through a laying cycle that runs for many months.',
    },
    breeders: {
      name: 'Breeders',
      latin: 'Breeders',
      short: 'Supply for breeder farms and the flocks that produce hatching eggs.',
    },
  },
  categories: {
    feed: {
      name: 'Poultry feed',
      short: 'Poultry feed we supply, coordinated around each farm’s requirements.',
    },
    supplements: {
      name: 'Feed supplements',
      short: 'Poultry feed supplements we supply with their approved label information.',
    },
    medicines: {
      name: 'Veterinary medicines',
      short: 'Poultry veterinary medicines we distribute for use under veterinary supervision.',
    },
    vaccines: {
      name: 'Veterinary vaccines',
      short: 'Poultry veterinary vaccines we distribute for use in programmes set by a veterinarian.',
    },
  },
  metrics: {
    intro: 'Three approximate figures that summarise the scope of our work with poultry farms today.',
    footnote: 'Figures are approximate and reflect the current scope of our business.',
    items: [
      {
        key: 'farms',
        qualifier: 'Approx.',
        value: '300',
        unit: '',
        label: 'Poultry farms we serve on an ongoing basis',
        srLabel: 'Approximately 300 poultry farms we serve on an ongoing basis.',
      },
      {
        key: 'birds',
        qualifier: 'Approx.',
        value: '15',
        unit: 'million',
        label: 'Birds within the production capacity of the farms we serve',
        srLabel: 'Approximately 15 million birds within the production capacity of the farms we serve.',
      },
      {
        key: 'products',
        qualifier: 'Approx.',
        value: '150',
        unit: '',
        label: 'Veterinary medicine and vaccine products we distribute',
        srLabel: 'Approximately 150 veterinary medicine and vaccine products we distribute.',
      },
    ],
  },
  forms: {
    fields: {
      inquiryType: {
        label: 'Inquiry type',
        placeholder: 'Select an inquiry type',
        help: 'Choose the closest match so we can route your request correctly.',
      },
      fullName: {
        label: 'Full name',
      },
      phone: {
        label: 'Phone number',
        placeholder: '01xxxxxxxxx',
        help: 'An Egyptian number, or an international number starting with the country code.',
      },
      email: {
        label: 'Email',
        placeholder: 'name@example.com',
      },
      organization: {
        label: 'Farm or company name',
      },
      role: {
        label: 'Job title',
        placeholder: 'e.g. Farm manager or procurement officer',
      },
      productionType: {
        label: 'Production type',
        placeholder: 'Select a production type',
        help: 'If you run more than one type of farm, choose “More than one type”.',
      },
      birdCapacity: {
        label: 'Approximate production capacity (number of birds)',
        placeholder: 'e.g. 20,000 birds',
        help: 'A rough figure is enough to help us understand the scale of your needs.',
      },
      governorate: {
        label: 'Governorate',
        placeholder: 'Select a governorate',
      },
      productCategory: {
        label: 'Product category',
        placeholder: 'Select a category',
      },
      product: {
        label: 'Product',
        placeholder: 'Product name, if you have one in mind',
      },
      quantity: {
        label: 'Requested quantity',
        placeholder: 'e.g. number of packs or approximate weight',
        help: 'An initial estimate is fine; the quantity is confirmed later with our team.',
      },
      message: {
        label: 'Request details',
        placeholder:
          'Tell us what you need: products or categories, your farm type and anything else that helps us understand your request.',
        help: 'Describe your commercial need only; we do not provide diagnosis or treatment advice through this form.',
      },
      consent: {
        label: 'Consent to data use',
      },
    },
    options: {
      inquiryTypes: {
        farm: 'Farm needs',
        product: 'Product inquiry',
        partner: 'Partnership and supply',
        general: 'General inquiry',
      },
      productionTypes: {
        broilers: 'Broilers',
        layers: 'Layers',
        breeders: 'Breeders',
        multiple: 'More than one type',
      },
      productCategories: {
        feed: 'Poultry feed',
        supplements: 'Feed supplements',
        medicines: 'Veterinary medicines',
        vaccines: 'Veterinary vaccines',
        unsure: 'Not sure yet',
      },
      governorates: [
        'Cairo',
        'Alexandria',
        'Port Said',
        'Suez',
        'Damietta',
        'Dakahlia',
        'Sharqia',
        'Qalyubia',
        'Kafr El Sheikh',
        'Gharbia',
        'Monufia',
        'Beheira',
        'Ismailia',
        'Giza',
        'Beni Suef',
        'Faiyum',
        'Minya',
        'Asyut',
        'Sohag',
        'Qena',
        'Aswan',
        'Luxor',
        'Red Sea',
        'New Valley',
        'Matrouh',
        'North Sinai',
        'South Sinai',
        'Outside Egypt',
      ],
    },
    optional: '(optional)',
    required: '(required)',
    consentText:
      'I agree that Alshorouk may store the information I submit through this form and use it to respond to and follow up on my request.',
    privacyLinkText: 'Read our privacy policy',
    honeypotLabel: 'Leave this field empty',
    submit: 'Send your request',
    submitting: 'Sending…',
    errors: {
      required: 'This field is required.',
      invalidPhone: 'Enter a valid phone number: Egyptian, or international starting with the country code.',
      invalidEmail: 'Enter a valid email address.',
      tooShort: 'This entry is shorter than the minimum length.',
      tooLong: 'This entry is longer than the maximum length.',
      consentRequired: 'Please give your consent so we can respond to your request.',
      rateLimited: 'Several requests were sent in a short time. Please wait a moment and try again.',
      network: 'We couldn’t connect. Check your internet connection and try again.',
      server: 'Something went wrong on our side and your request was not saved. Please try again shortly.',
      summaryTitle: 'The form was not sent. Please review the following fields:',
    },
    success: {
      title: 'Your request has been received',
      body: 'Your request is recorded under reference {reference}. The Alshorouk team will contact you to follow up; please quote this reference whenever you get in touch.',
      another: 'Send another request',
    },
    failure: {
      title: 'Your request was not sent',
      body: 'We couldn’t save your request this time. Check your connection and try sending it again.',
      retry: 'Try again',
    },
  },
  a11y: {
    externalLink: 'External link, opens in a new tab',
    opensDialog: 'Opens a dialog',
    close: 'Close',
    loading: 'Loading',
    menuDialog: 'Navigation menu',
    breadcrumbs: 'Breadcrumb',
    pagination: 'Pagination',
    carouselPrevious: 'Previous slide',
    carouselNext: 'Next slide',
    scrollToContent: 'Scroll to content',
  },
  states: {
    loading: 'Loading…',
    emptyTitle: 'No results',
    emptyBody: 'Nothing matches your selection. Try changing your search or removing some filters.',
    errorTitle: 'This content couldn’t be loaded',
    errorBody: 'Something went wrong while loading. Please try again shortly.',
    retry: 'Try again',
  },
  vetSafetyNote:
    'Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian.',
  breadcrumbs: {
    home: 'Home',
  },
  notFound: {
    meta: {
      title: 'Page Not Found',
      description:
        'The page you are looking for is not available. Return to the Alshorouk home page or browse our poultry farm product categories.',
    },
    eyebrow: '404',
    title: 'We couldn’t find this page',
    body: 'The link may have changed, or the page is no longer available. You can return to the home page or browse our products.',
    primary: 'Back to home',
    secondary: 'Browse products',
  },
  errorPage: {
    title: 'Something went wrong',
    body: 'This page couldn’t be displayed right now. Try again, or go back to the home page.',
    retry: 'Try again',
    home: 'Back to home',
  },
  cookie: {
    title: 'Cookies',
    body: 'We use essential cookies to run this website. Analytics cookies, which help us understand how the site is used and improve it, are set only with your consent.',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie settings',
  },
  demoBanner: 'Staging environment: the data shown here is test data, not real products.',
  englishReviewNotice: 'English version — editorial review pending',
  statusRibbonLabel: 'Site status',
  readingTime: '{minutes} min read',
  readingTimeOne: '1 min read',
  readingTimeTwo: '2 min read',
  readingTimeMany: '{minutes} min read',
}
