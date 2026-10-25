// Copy status: review_required — see content/approval-register.md
// Shared UI copy: brand, navigation, header, footer, CTAs, segments, categories, metrics, forms, a11y, states, utility pages.
// Arabic is the primary locale; the English file is typed against this shape.
//
// Interpolation: {year}, {reference}, {minutes}.
// metrics.items hold the three APPROVED business statements. Never edit qualifier, value, unit or label wording.
//   Keep the qualifier visible next to the number; use srLabel as the accessible text (hide the animated digits from AT).
// forms.options keys mirror the CMS Inquiry select values (type, segment, productCategory).
// forms.options.governorates is index-aligned between ar and en: 27 governorates in CAPMAS / national-ID order, then "outside Egypt".
// Reading time follows Intl.PluralRules('ar'):
//   one → readingTimeOne · two → readingTimeTwo · few (3–10) → readingTime · many / other (11+) → readingTimeMany
// `latin` fields are the Latin-script label shown beside the Arabic name; in English they equal `name` (hide when identical).
// Wrap {reference}, {year} and other Latin/numeric runs in <bdi> when rendered inside Arabic text.
// No phone, WhatsApp, email or address copy here: verified contact channels are added only after approval.

export const common = {
  brand: {
    name: 'الشروق',
    latinName: 'Alshorouk',
    logoAlt: 'شعار الشروق: رأس ديك فوق اسم «الشروق»، مع عبارة «لتوزيع الأدوية واللقاحات البيطرية»',
  },
  nav: {
    home: 'الرئيسية',
    about: 'عن الشروق',
    solutions: 'حلول الدواجن',
    products: 'المنتجات',
    partners: 'شركاؤنا',
    howWeWork: 'كيف نعمل',
    knowledge: 'المعرفة',
    contact: 'تواصل معنا',
  },
  solutionsMenu: {
    /** Header menu label (breadcrumbs and page titles use nav.solutions). */
    label: 'حلول الدواجن',
    overview: 'نظرة عامة',
    broilers: 'التسمين',
    layers: 'البياض',
    breeders: 'الأمهات',
  },
  header: {
    cta: 'تواصل مع الفريق',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    menuLabel: 'القائمة',
    skipToContent: 'انتقل إلى المحتوى الرئيسي',
    primaryNavLabel: 'القائمة الرئيسية',
    language: {
      label: 'اللغة',
      switchToEnglish: 'EN',
      switchToArabic: 'ع',
      englishName: 'English',
      arabicName: 'العربية',
    },
  },
  footer: {
    statement: 'إمداد متخصص لمزارع التسمين والبياض والأمهات.',
    navTitle: 'روابط سريعة',
    solutionsTitle: 'حلول الدواجن',
    categoriesTitle: 'فئات المنتجات',
    contactTitle: 'تواصل معنا',
    contactBody:
      'لديك استفسار عن المنتجات أو احتياجات مزرعتك؟ أرسل طلبك عبر نموذج الاستفسار، وسيتواصل معك فريق الشروق.',
    privacy: 'سياسة الخصوصية',
    partner: 'كن شريكًا',
    copyright: '© {year} الشروق. جميع الحقوق محفوظة.',
    backToTop: 'العودة إلى الأعلى',
  },
  cta: {
    contactTeam: 'تواصل مع فريق الشروق',
    requestProducts: 'اطلب منتجاتك',
    exploreSolutions: 'استكشف حلولنا',
    contactUs: 'تواصل معنا',
    startContact: 'ابدأ التواصل',
    browseProducts: 'تصفح المنتجات',
    discussFarmNeeds: 'ناقش احتياج مزرعتك',
    requestCatalog: 'اطلب قائمة المنتجات',
    requestCurrentList: 'اطلب القائمة الحالية',
    inquireProduct: 'استفسر عن المنتج',
    startPartnership: 'ابدأ شراكة مع الشروق',
    startRequest: 'ابدأ طلبك',
    learnMore: 'اعرف المزيد',
    viewAll: 'عرض الكل',
    backHome: 'العودة إلى الرئيسية',
  },
  segments: {
    broilers: {
      name: 'التسمين',
      latin: 'Broilers',
      short: 'إمداد مزارع دجاج اللحم بما يتماشى مع إيقاع دورات التسمين.',
    },
    layers: {
      name: 'البياض',
      latin: 'Layers',
      short: 'إمداد مزارع بيض المائدة خلال دورة إنتاج تمتد لأشهر طويلة.',
    },
    breeders: {
      name: 'الأمهات',
      latin: 'Breeders',
      short: 'إمداد مزارع الأمهات وقطعانها المنتجة لبيض التفريخ.',
    },
  },
  categories: {
    feed: {
      name: 'أعلاف الدواجن',
      short: 'أعلاف للدواجن نوفرها وننسق توريدها وفق احتياج كل مزرعة.',
    },
    supplements: {
      name: 'مكملات الأعلاف',
      short: 'مكملات لأعلاف الدواجن نوفرها مع المعلومات الواردة في ملصقاتها المعتمدة.',
    },
    medicines: {
      name: 'الأدوية البيطرية',
      short: 'أدوية بيطرية للدواجن نوزعها لتُستخدم تحت إشراف الطبيب البيطري.',
    },
    vaccines: {
      name: 'اللقاحات البيطرية',
      short: 'لقاحات بيطرية للدواجن نوزعها لتُستخدم وفق برنامج يحدده الطبيب البيطري.',
    },
  },
  metrics: {
    intro: 'ثلاثة أرقام تقريبية تلخص نطاق عملنا مع مزارع الدواجن اليوم.',
    footnote: 'الأرقام تقريبية وتعكس نطاق تعاملاتنا الحالي.',
    items: [
      {
        key: 'farms',
        qualifier: 'حوالي',
        value: '300',
        unit: '',
        label: 'مزرعة دواجن نتعامل معها بشكل مستمر',
        srLabel: 'حوالي 300 مزرعة دواجن نتعامل معها بشكل مستمر.',
      },
      {
        key: 'birds',
        qualifier: 'حوالي',
        value: '15',
        unit: 'مليون',
        label: 'طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها',
        srLabel: 'حوالي 15 مليون طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها.',
      },
      {
        key: 'products',
        qualifier: 'حوالي',
        value: '150',
        unit: '',
        label: 'منتجًا نوزعه من الأدوية واللقاحات البيطرية',
        srLabel: 'حوالي 150 منتجًا نوزعه من الأدوية واللقاحات البيطرية.',
      },
    ],
  },
  forms: {
    fields: {
      inquiryType: {
        label: 'نوع الاستفسار',
        placeholder: 'اختر نوع الاستفسار',
        help: 'اختر الأقرب إلى طلبك حتى نوجهه بشكل صحيح.',
      },
      fullName: {
        label: 'الاسم بالكامل',
      },
      phone: {
        label: 'رقم الهاتف',
        placeholder: '01xxxxxxxxx',
        help: 'رقم مصري، أو رقم دولي يبدأ برمز الدولة.',
      },
      email: {
        label: 'البريد الإلكتروني',
        placeholder: 'name@example.com',
      },
      organization: {
        label: 'اسم المزرعة أو الشركة',
      },
      role: {
        label: 'المسمى الوظيفي',
        placeholder: 'مثال: مدير مزرعة أو مسؤول مشتريات',
      },
      productionType: {
        label: 'نوع الإنتاج',
        placeholder: 'اختر نوع الإنتاج',
        help: 'إن كان لديك أكثر من نوع من المزارع، اختر «أكثر من نوع».',
      },
      birdCapacity: {
        label: 'الطاقة الإنتاجية التقريبية (عدد الطيور)',
        placeholder: 'مثال: 20 ألف طائر',
        help: 'يكفي رقم تقريبي يساعدنا على فهم حجم احتياجك.',
      },
      governorate: {
        label: 'المحافظة',
        placeholder: 'اختر المحافظة',
      },
      productCategory: {
        label: 'فئة المنتج',
        placeholder: 'اختر الفئة',
      },
      product: {
        label: 'المنتج',
        placeholder: 'اسم المنتج، إن كان لديك منتج محدد',
      },
      quantity: {
        label: 'الكمية المطلوبة',
        placeholder: 'مثال: عدد العبوات أو الوزن التقريبي',
        help: 'يكفي تقدير مبدئي، وتُؤكَّد الكمية لاحقًا مع فريقنا.',
      },
      message: {
        label: 'تفاصيل طلبك',
        placeholder:
          'اكتب ما تحتاجه: المنتجات أو الفئات المطلوبة، ونوع المزرعة، وأي تفاصيل تساعدنا على فهم طلبك.',
        help: 'صف احتياجك التجاري فقط؛ لا نقدّم عبر هذا النموذج تشخيصًا أو توصيات علاجية.',
      },
      consent: {
        label: 'الموافقة على استخدام البيانات',
      },
    },
    options: {
      inquiryTypes: {
        farm: 'احتياجات المزرعة',
        product: 'استفسار عن منتج',
        partner: 'شراكة وتوريد',
        general: 'استفسار عام',
      },
      productionTypes: {
        broilers: 'تسمين',
        layers: 'بياض',
        breeders: 'أمهات',
        multiple: 'أكثر من نوع',
      },
      productCategories: {
        feed: 'أعلاف الدواجن',
        supplements: 'مكملات الأعلاف',
        medicines: 'الأدوية البيطرية',
        vaccines: 'اللقاحات البيطرية',
        unsure: 'غير محدد بعد',
      },
      governorates: [
        'القاهرة',
        'الإسكندرية',
        'بورسعيد',
        'السويس',
        'دمياط',
        'الدقهلية',
        'الشرقية',
        'القليوبية',
        'كفر الشيخ',
        'الغربية',
        'المنوفية',
        'البحيرة',
        'الإسماعيلية',
        'الجيزة',
        'بني سويف',
        'الفيوم',
        'المنيا',
        'أسيوط',
        'سوهاج',
        'قنا',
        'أسوان',
        'الأقصر',
        'البحر الأحمر',
        'الوادي الجديد',
        'مطروح',
        'شمال سيناء',
        'جنوب سيناء',
        'خارج مصر',
      ],
    },
    optional: '(اختياري)',
    required: '(مطلوب)',
    consentText: 'أوافق على أن تحفظ الشروق البيانات التي أرسلها عبر هذا النموذج وتستخدمها للرد على طلبي ومتابعته.',
    privacyLinkText: 'اقرأ سياسة الخصوصية',
    honeypotLabel: 'اترك هذا الحقل فارغًا',
    submit: 'أرسل طلبك',
    submitting: 'جارٍ الإرسال…',
    errors: {
      required: 'هذا الحقل مطلوب.',
      invalidPhone: 'أدخل رقم هاتف صحيحًا: رقمًا مصريًا، أو رقمًا دوليًا يبدأ برمز الدولة.',
      invalidEmail: 'أدخل عنوان بريد إلكتروني صحيحًا.',
      tooShort: 'النص أقصر من الحد الأدنى المطلوب.',
      tooLong: 'النص أطول من الحد المسموح به.',
      consentRequired: 'يُرجى الموافقة على استخدام بياناتك حتى نتمكن من الرد على طلبك.',
      rateLimited: 'أُرسلت عدة طلبات خلال وقت قصير. انتظر قليلًا ثم حاول مرة أخرى.',
      network: 'تعذّر الاتصال. تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى.',
      server: 'حدث خطأ من جانبنا ولم يُحفظ طلبك. حاول مرة أخرى بعد قليل.',
      summaryTitle: 'لم يُرسَل النموذج. راجع الحقول التالية:',
    },
    success: {
      title: 'تم استلام طلبك',
      body: 'سجّلنا طلبك برقم مرجعي {reference}. سيتواصل معك فريق الشروق لمتابعة التفاصيل، ويمكنك ذكر هذا الرقم عند تواصلك معنا.',
      another: 'إرسال طلب آخر',
    },
    failure: {
      title: 'لم يُرسَل طلبك',
      body: 'لم نتمكن من حفظ طلبك هذه المرة. تحقق من اتصالك ثم حاول الإرسال مرة أخرى.',
      retry: 'حاول مرة أخرى',
    },
  },
  a11y: {
    externalLink: 'رابط خارجي، يفتح في علامة تبويب جديدة',
    opensDialog: 'يفتح نافذة حوار',
    close: 'إغلاق',
    loading: 'جارٍ التحميل',
    menuDialog: 'قائمة التنقل',
    breadcrumbs: 'مسار التصفح',
    pagination: 'التنقل بين الصفحات',
    carouselPrevious: 'الشريحة السابقة',
    carouselNext: 'الشريحة التالية',
    scrollToContent: 'انتقل إلى المحتوى',
  },
  states: {
    loading: 'جارٍ التحميل…',
    emptyTitle: 'لا توجد نتائج',
    emptyBody: 'لم نجد ما يطابق اختياراتك. جرّب تعديل البحث أو إزالة بعض عوامل التصفية.',
    errorTitle: 'تعذّر تحميل المحتوى',
    errorBody: 'حدث خطأ أثناء التحميل. حاول مرة أخرى بعد قليل.',
    retry: 'إعادة المحاولة',
  },
  vetSafetyNote: 'تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.',
  breadcrumbs: {
    home: 'الرئيسية',
  },
  notFound: {
    meta: {
      title: 'الصفحة غير موجودة',
      description:
        'الصفحة التي تبحث عنها غير متاحة. عد إلى الصفحة الرئيسية لموقع الشروق، أو تصفح فئات منتجات مزارع الدواجن.',
    },
    eyebrow: '404',
    title: 'لم نجد هذه الصفحة',
    body: 'ربما تغيّر رابط الصفحة أو لم تعد متاحة. يمكنك العودة إلى الرئيسية أو تصفح المنتجات.',
    primary: 'العودة إلى الرئيسية',
    secondary: 'تصفح المنتجات',
  },
  errorPage: {
    title: 'حدث خطأ غير متوقع',
    body: 'تعذّر عرض هذه الصفحة الآن. حاول مرة أخرى، أو عد إلى الصفحة الرئيسية.',
    retry: 'إعادة المحاولة',
    home: 'العودة إلى الرئيسية',
  },
  cookie: {
    title: 'ملفات تعريف الارتباط',
    body: 'نستخدم ملفات تعريف الارتباط الضرورية لتشغيل الموقع. أما الملفات التحليلية التي تساعدنا على فهم طريقة استخدامه وتحسينه، فلا نستخدمها إلا بموافقتك.',
    accept: 'قبول',
    reject: 'رفض',
    settings: 'إعدادات ملفات تعريف الارتباط',
  },
  demoBanner: 'بيئة تجريبية: البيانات المعروضة هنا بيانات اختبار، وليست منتجات حقيقية.',
  englishReviewNotice: 'النسخة الإنجليزية — بانتظار المراجعة التحريرية',
  statusRibbonLabel: 'حالة الموقع',
  readingTime: '{minutes} دقائق للقراءة',
  readingTimeOne: 'دقيقة واحدة للقراءة',
  readingTimeTwo: 'دقيقتان للقراءة',
  readingTimeMany: '{minutes} دقيقة للقراءة',
}

export type CommonDictionary = typeof common
