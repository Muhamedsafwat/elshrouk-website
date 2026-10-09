// Copy status: review_required — see content/approval-register.md
// How we work (/how-we-work). Arabic is the primary locale; the English file is typed against this shape.
//
// steps[].title follow spec §5 Scene 6. The steps describe a PROPOSED, indicative process pending client
// confirmation: no SLA, delivery time, fleet, warehouse or cold-chain claims. Render `disclaimer` with the steps.
// The veterinary safety line is part of `disclaimer` (step 02 refers to veterinary products).

export const howWeWork = {
  meta: {
    title: 'كيف نعمل: من احتياج المزرعة إلى متابعة الطلب',
    description:
      'تعرّف على الخطوات التي نتبعها مع مزارع الدواجن: فهم احتياج المزرعة، وتحديد المنتجات المناسبة، وتأكيد الطلب والتوافر، وتنسيق التوريد، واستمرار التواصل.',
  },
  hero: {
    eyebrow: 'كيف نعمل',
    title: ['من احتياج المزرعة', 'إلى متابعة الطلب.'],
    // Presentation only: the phrase of `title` set in vermilion (display size). Must stay a substring of title.
    accent: 'متابعة الطلب',
    intro:
      'طريقة عمل واضحة تبدأ بفهم احتياج مزرعتك، وتمر بتأكيد التفاصيل قبل أي التزام، وتستمر بالتواصل بعد التوريد.',
  },
  steps: [
    {
      index: '01',
      title: 'فهم احتياج المزرعة',
      body: 'نتعرف على مزرعتك ونوع إنتاجها، تسمين أو بياض أو أمهات، وعلى الفئات أو المنتجات التي تحتاجها والكميات التقريبية.',
    },
    {
      index: '02',
      title: 'تحديد المنتجات المناسبة',
      body: 'نطابق طلبك مع المنتجات المتاحة ونشاركك معلوماتها المعتمدة، وفي المنتجات البيطرية نعتمد على ما يحدده الطبيب البيطري للمزرعة.',
    },
    {
      index: '03',
      title: 'تأكيد الطلب والتوافر',
      body: 'نراجع معك التوافر والكميات وشروط التوريد، ولا يُعد الطلب مؤكدًا إلا بعد اتفاق واضح على تفاصيله.',
    },
    {
      index: '04',
      title: 'تنسيق التوريد',
      body: 'ننسق موعد التوريد وطريقته وفق ما نتفق عليه مع المزرعة، ونوضح أي تغيير في حينه.',
    },
    {
      index: '05',
      title: 'استمرار التواصل',
      body: 'نتابع معك بعد التوريد، ونراجع احتياج المزرعة مع كل دورة جديدة، لتبقى العلاقة قائمة على معلومات واضحة.',
    },
  ],
  disclaimer:
    'تعرض هذه الخطوات الإطار العام لطريقة عملنا، ونتفق على تفاصيلها مع كل عميل حسب طبيعة طلبه. تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.',
  principles: {
    title: 'ثلاثة مبادئ في كل طلب',
    items: [
      {
        title: 'وضوح المعلومات',
        body: 'نقدم معلومات المنتجات كما وردت في بياناتها المعتمدة، ونفرق بوضوح بين ما هو متاح وما يحتاج إلى تأكيد.',
      },
      {
        title: 'التأكيد قبل الالتزام',
        body: 'لا نقدم وعدًا بتوافر أو موعد قبل مراجعته، ونؤكد تفاصيل الطلب معك قبل تنفيذه.',
      },
      {
        title: 'تواصل مستمر',
        body: 'نبقى على اتصال بعد التوريد، ونستمع إلى ملاحظاتك، ونراجع احتياج مزرعتك مع كل دورة.',
      },
    ],
  },
  form: {
    title: 'أرسل طلبك أو استفسارك',
    intro:
      'شاركنا بعض التفاصيل عن مزرعتك واحتياجها، ويتواصل معك فريق الشروق لاستكمال الخطوات.',
  },
  cta: {
    title: 'جاهز لمناقشة احتياج مزرعتك؟',
    primary: 'ابدأ طلبك',
  },
}

export type HowWeWorkDictionary = typeof howWeWork
