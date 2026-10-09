// Copy status: review_required — see content/approval-register.md
// Contact page (/contact, /contact?type=farm|product|partner|general).
// Arabic is the primary locale; the English file is typed against this shape.
//
// types keys mirror the CMS Inquiry.type values. Field labels and validation messages live in the shared form dictionary.
// aside.steps describe a PROPOSED follow-up process pending client confirmation — no response-time promise.
// No phone, WhatsApp, email, address or map copy here: verified channels are added only after approval.

export const contact = {
  meta: {
    title: 'تواصل معنا',
    description:
      'تواصل مع فريق الشروق بشأن احتياجات مزرعة الدواجن، أو للاستفسار عن منتج، أو لمناقشة فرص الشراكة، من خلال نموذج طلب مختصر.',
  },
  hero: {
    eyebrow: 'تواصل معنا',
    title: ['تحدث مع فريق الشروق', 'عن احتياجات مزرعتك.'],
    /** Phrase of the title shown in vermilion (display size only). */
    accent: 'احتياجات مزرعتك',
    intro:
      'اختر نوع استفسارك واترك بياناتك، ويتواصل معك فريقنا لمناقشة طلبك، سواء كان احتياجًا لمزرعة دواجن أو منتجًا محددًا أو فرصة شراكة.',
  },
  types: {
    farm: {
      title: 'احتياجات المزرعة',
      description: 'لمناقشة احتياجات مزرعة تسمين أو بياض أو أمهات من المنتجات.',
    },
    product: {
      title: 'استفسار عن منتج',
      description: 'للسؤال عن منتج أو فئة منتجات محددة، وتأكيد التوافر والسعر.',
    },
    partner: {
      title: 'شراكة وتوريد',
      description: 'للشركات المصنعة والموردة الراغبة في مناقشة توزيع منتجاتها على مزارع الدواجن.',
    },
    general: {
      title: 'استفسار عام',
      description: 'لأي سؤال آخر عن الشروق أو طريقة التعامل معنا.',
    },
  },
  form: {
    title: 'أرسل طلبك',
    intro: 'نطلب فقط البيانات اللازمة للتواصل معك وفهم طلبك.',
    typeLegend: 'نوع الاستفسار',
    sectionAbout: 'بيانات التواصل',
    sectionNeed: 'تفاصيل الطلب',
  },
  aside: {
    title: 'ماذا يحدث بعد إرسال طلبك؟',
    steps: [
      {
        title: 'نسجل طلبك',
        body: 'يُسجل طلبك لدينا مع نوع الاستفسار والمنتج المختار إن وُجد، ليطلع عليه الفريق المعني.',
      },
      {
        title: 'نراجع التفاصيل',
        body: 'يراجع الفريق تفاصيل طلبك ويجمع المعلومات المتاحة عن المنتجات أو الفئات التي ذكرتها.',
      },
      {
        title: 'نتواصل معك',
        body: 'نتواصل معك على رقم الهاتف الذي أدخلته لمناقشة طلبك والخطوات التالية، مثل تأكيد التوافر والسعر.',
      },
    ],
    privacyNote:
      'نستخدم بياناتك للرد على طلبك ومتابعته فقط، ولا نبيعها أو نشاركها لأغراض تسويقية.',
    privacyLink: 'اقرأ سياسة الخصوصية',
  },
  formUi: {
    spam: 'تعذّر إرسال طلبك. أعد تحميل الصفحة واكتب بياناتك يدويًا، ثم حاول مرة أخرى.',
    newTab: '(تُفتح في علامة تبويب جديدة)',
    referenceLabel: 'الرقم المرجعي',
    productHint: 'يصل طلبك إلى الفريق مرتبطًا بهذا المنتج.',
    sending: 'جارٍ إرسال طلبك…',
  },
  // Rendered only for channels marked verified in Site Settings (none today → block hidden).
  channels: {
    title: 'قنوات التواصل المعتمدة',
    phone: 'الهاتف',
    whatsapp: 'واتساب',
    email: 'البريد الإلكتروني',
    address: 'العنوان',
  },
  prefill: {
    productLabel: 'المنتج المختار',
    segmentLabel: 'نوع الإنتاج المختار',
    clear: 'إزالة الاختيار',
  },
}

export type ContactDictionary = typeof contact
