// Copy status: review_required — see content/approval-register.md
// Product catalogue (/products), product detail (/products/[slug]) and the product inquiry drawer.
// Arabic is the primary locale; the English file is typed against this shape.
//
// Interpolation: {count}, {page}, {total}, {category}, {name}, {reference}.
// Result counts follow Intl.PluralRules('ar'):
//   zero → countZero · one → countOne · two → countTwo · few (3–10) → countFew · many (11–99) → countMany · other (100+) → count
// Keys under catalog.availability mirror the CMS enum Product.availabilityStatus exactly.
// Wrap {reference}, SKUs and other Latin/numeric runs in <bdi> when rendered inside Arabic text.

export const products = {
  catalog: {
    meta: {
      title: 'كتالوج منتجات مزارع الدواجن',
      description:
        'تصفح كتالوج الشروق التجاري لمنتجات مزارع الدواجن، من الأعلاف ومكملاتها إلى الأدوية واللقاحات البيطرية، وأرسل استفسارك عن أي منتج لتأكيد التوافر والسعر.',
    },
    hero: {
      eyebrow: 'المنتجات',
      title: ['كتالوج منتجات', 'مزارع الدواجن'],
      intro:
        'كتالوج تجاري للمنتجات التي نوفرها لمزارع الدواجن، من الأعلاف ومكملاتها إلى الأدوية واللقاحات البيطرية. لا نعرض أسعارًا؛ يؤكد فريقنا السعر والتوافر عند استفسارك عن المنتج.',
    },
    search: {
      label: 'ابحث في الكتالوج',
      placeholder: 'ابحث بالاسم أو الشركة المصنعة أو كود المنتج',
      clear: 'مسح البحث',
      submit: 'بحث',
      inCatalog: 'في الكتالوج: {count}',
    },
    filters: {
      title: 'تصفية النتائج',
      category: 'الفئة',
      segment: 'نوع الإنتاج',
      manufacturer: 'الشركة المصنعة',
      form: 'شكل المنتج',
      reset: 'إعادة ضبط التصفية',
      apply: 'عرض النتائج',
      showFilters: 'عرض خيارات التصفية',
      hideFilters: 'إخفاء خيارات التصفية',
      any: 'الكل',
      active: 'التصفية الحالية',
      remove: 'إزالة {name}',
      searchTerm: 'البحث: {q}',
      close: 'إغلاق',
    },
    results: {
      count: '{count} منتج',
      countZero: 'لا توجد منتجات مطابقة',
      countOne: 'منتج واحد',
      countTwo: 'منتجان',
      countFew: '{count} منتجات',
      countMany: '{count} منتجًا',
      searchFor: 'نتائج البحث عن «{q}»',
      regionLabel: 'نتائج الكتالوج',
    },
    states: {
      loading: 'جارٍ تحميل المنتجات…',
      emptyFilteredTitle: 'لا توجد منتجات تطابق اختياراتك',
      emptyFilteredBody:
        'جرب كلمة بحث مختلفة أو قلل عوامل التصفية. ويمكنك أيضًا أن تصف لنا المنتج الذي تبحث عنه في استفسار مباشر.',
      resetFilters: 'إعادة ضبط التصفية',
      emptyCatalogTitle: 'نضيف المنتجات إلى الكتالوج الرقمي',
      emptyCatalogBody:
        'تظهر المنتجات هنا تباعًا بعد مراجعة بياناتها واعتمادها. وحتى ذلك الحين، يمكنك طلب قائمة المنتجات الحالية من خلال النموذج.',
      emptyCatalogCta: 'اطلب قائمة المنتجات',
      emptyCatalogFormIntro:
        'أرسل بيانات التواصل والفئة التي تحتاجها مزرعتك، ويتابع فريقنا طلبك معك مباشرة.',
      errorTitle: 'تعذر تحميل المنتجات',
      errorBody:
        'حدث خطأ أثناء تحميل الكتالوج. أعد المحاولة بعد قليل، أو أرسل استفسارك مباشرة من صفحة التواصل.',
      retry: 'إعادة المحاولة',
      errorContact: 'تواصل معنا',
    },
    categoryBrowser: {
      title: 'تصفح حسب الفئة',
      intro:
        'نعمل على إتاحة منتجات مزارع الدواجن ضمن أربع فئات رئيسية. اختر فئة لعرض منتجاتها في الكتالوج، أو أرسل استفسارًا عنها مباشرة.',
      viewProducts: 'عرض منتجات الفئة',
      inquire: 'استفسر عن هذه الفئة',
      emptyIntro:
        'نوفر منتجات مزارع الدواجن ضمن أربع فئات رئيسية. اختر الفئة التي تحتاجها مزرعتك وأرسل استفسارك عنها، ويتابع فريقنا معك مباشرة.',
      selected: 'الفئة المختارة',
    },
    pagination: {
      label: 'صفحات المنتجات',
      previous: 'السابق',
      next: 'التالي',
      page: 'صفحة {page} من {total}',
      loadMore: 'عرض المزيد من المنتجات',
      pageLink: 'الصفحة {page}',
      pageShort: 'صفحة {page}',
    },
    card: {
      inquire: 'استفسر عن المنتج',
      details: 'عرض التفاصيل',
      imageFallbackAlt: 'صورة تعبيرية لفئة {category}',
    },
    availability: {
      inquiry_only: 'التوافر عند الاستفسار',
      on_request: 'يُوفَّر عند الطلب',
      confirmed: 'التوافر مؤكد',
    },
    inquiryCta: {
      title: 'لم تجد المنتج الذي تبحث عنه؟',
      body: 'أخبرنا باسم المنتج أو الفئة التي تحتاجها مزرعتك، ويتابع فريقنا استفسارك معك مباشرة.',
      cta: 'أرسل استفسارًا',
    },
  },
  detail: {
    breadcrumbsLabel: 'مسار التصفح',
    backToCatalog: 'العودة إلى الكتالوج',
    category: 'الفئة',
    segments: 'أنواع الإنتاج',
    targetSpecies: 'النوع المستهدف',
    targetSpeciesValue: 'الدواجن',
    manufacturer: 'الشركة المصنعة',
    form: 'شكل المنتج',
    packSize: 'حجم العبوة',
    sku: 'كود المنتج',
    availabilityLabel: 'التوافر',
    description: 'وصف المنتج',
    label: 'النشرة المعتمدة',
    downloadLabel: 'تحميل النشرة بصيغة PDF',
    warnings: 'التحذيرات',
    related: 'منتجات ذات صلة',
    inquireTitle: 'استفسر عن هذا المنتج',
    inquireBody:
      'أرسل استفسارك، ويتواصل معك فريقنا لتأكيد التوافر والسعر ومناقشة تفاصيل التوريد.',
    infoNote:
      'تُعرض بيانات المنتج لأغراض تجارية وتعريفية فقط، ولا تُعد توصية علاجية أو إرشادًا للاستخدام أو الجرعات.',
    vetNote: 'تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.',
    metaDescriptionFallback:
      'تعرّف على {name} ضمن كتالوج الشروق لمنتجات مزارع الدواجن، وأرسل استفسارك لتأكيد التوافر والسعر.',
    factsTitle: 'بيانات المنتج',
    galleryLabel: 'صور المنتج',
    showImage: 'عرض الصورة {n}',
    illustrativeNote: 'صورة تعبيرية لفئة {category}، وليست صورة المنتج.',
    safetyTitle: 'تنبيه بيطري',
    draftLabel: 'مسودة',
    draftBanner: 'معاينة داخلية لفريق المحتوى: هذا المنتج غير منشور للزوار، ولا تفهرسه محركات البحث.',
    draftStatus: 'حالة الاعتماد: {status}',
  },
  drawer: {
    title: 'استفسار عن منتج',
    titleFor: 'استفسار عن {name}',
    productLabel: 'المنتج',
    intro:
      'أدخل بيانات التواصل وأي تفاصيل تساعد فريقنا على فهم طلبك، مثل الكمية التقريبية أو نوع الإنتاج.',
    close: 'إغلاق',
    submit: 'إرسال الاستفسار',
    submitting: 'جارٍ الإرسال…',
    successTitle: 'تم استلام استفسارك',
    success: 'سجلنا استفسارك عن هذا المنتج، وسيتواصل معك فريقنا على رقم الهاتف الذي أدخلته.',
    successReference: 'رقم المرجع: {reference}',
  },
}

export type ProductsDictionary = typeof products
