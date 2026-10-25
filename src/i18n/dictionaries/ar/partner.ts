// Copy status: review_required — see content/approval-register.md
// Partnership page (/partner-with-us): supply / distribution / agency discussions with manufacturers and suppliers.
// Arabic is the primary locale; the English file is typed against this shape.
//
// Copy expresses openness to discussion only: no existing partners, exclusivity, agencies or geography are claimed.
// No partner or supplier logos are shown on this page; the client-supplied partner list (src/content/partners.ts)
// appears in the header menu and the home page partners section.
// process.steps describe a PROPOSED process pending client confirmation.

export const partner = {
  meta: {
    title: 'شراكات التوريد والتوزيع',
    description:
      'للشركات المصنعة والموردة لأعلاف الدواجن ومكملات الأعلاف والأدوية واللقاحات البيطرية: تواصل مع الشروق لمناقشة فرص توزيع منتجاتك على مزارع الدواجن.',
  },
  hero: {
    eyebrow: 'كن شريكًا',
    title: ['لنناقش توزيع منتجاتك', 'على مزارع الدواجن.'],
    /** Phrase of the title shown in vermilion (display size only). */
    accent: 'مزارع الدواجن',
    intro:
      'نرحب بالحديث مع الشركات المصنعة والموردة لمنتجات مزارع الدواجن حول فرص التوريد أو الوكالة، بما يخدم احتياجات مزارع التسمين والبياض والأمهات التي نتعامل معها.',
  },
  relationship: {
    title: 'مجالات نرحب بمناقشتها',
    items: [
      {
        title: 'أعلاف الدواجن ومكملات الأعلاف',
        body: 'نتطلع إلى التعرف على منتجات الأعلاف ومكملاتها المخصصة للدواجن، وبحث إتاحتها لمزارع التسمين والبياض والأمهات.',
      },
      {
        title: 'الأدوية واللقاحات البيطرية',
        body: 'نناقش فرص توزيع الأدوية واللقاحات البيطرية المسجلة والمخصصة للدواجن، وفق المتطلبات التنظيمية المعمول بها.',
      },
      {
        title: 'التوريد أو الوكالة',
        body: 'قد تأخذ الشراكة شكل توريد منتظم أو وكالة توزيع، ونحدد معًا الإطار المناسب بعد دراسة المنتج واحتياجات السوق.',
      },
    ],
  },
  fit: {
    title: 'ما يساعدنا على بدء الحديث',
    items: [
      'منتجات مسجلة وفق المتطلبات التنظيمية المحلية',
      'مستندات واضحة تشمل النشرات المعتمدة وبيانات الشركة المصنعة',
      'منتجات مخصصة لقطاع الدواجن',
      'استعداد لعلاقة تجارية طويلة الأمد قائمة على الشفافية',
    ],
  },
  process: {
    title: 'كيف نبدأ',
    steps: [
      {
        title: 'عرّفنا بشركتك',
        body: 'أرسل بيانات شركتك وخط المنتجات الذي تقترحه من خلال النموذج.',
      },
      {
        title: 'مراجعة أولية',
        body: 'يراجع فريقنا المعلومات والمستندات المتاحة لتقييم مدى توافق المنتجات مع احتياجات مزارع الدواجن التي نتعامل معها.',
      },
      {
        title: 'نقاش تفصيلي',
        body: 'عند وجود توافق مبدئي، نتواصل معك لمناقشة إطار التعاون وتفاصيله.',
      },
    ],
  },
  form: {
    title: 'ابدأ النقاش معنا',
    intro: 'شاركنا بيانات شركتك وخط المنتجات الذي تقترحه، ويتواصل معك فريقنا بعد مراجعة طلبك.',
    fields: {
      company: 'اسم الشركة',
      role: 'المسمى الوظيفي',
      productLine: 'خط المنتجات المقترح',
      rolePlaceholder: 'مثال: مدير التصدير أو مدير تطوير الأعمال',
      messagePlaceholder: 'عرّفنا بشركتك ومنتجاتك وتسجيلها، وبالإطار الذي تقترحه للتعاون.',
      productLineHint: 'مثال: مكملات أعلاف أو لقاحات بيطرية للدواجن',
      website: 'الموقع الإلكتروني للشركة',
    },
  },
}

export type PartnerDictionary = typeof partner
