// Copy status: review_required — see content/approval-register.md
// Knowledge hub (/knowledge) and article page (/knowledge/[slug]).
// Arabic is the primary locale; the English file is typed against this shape.
//
// Interpolation: {minutes}, {author}, {title}.
// Reading time follows Intl.PluralRules('ar'):
//   one → minutesOne · two → minutesTwo · few (3–10) → minutes · many / other (11+) → minutesMany
// hub.categories[].key mirrors the CMS Article category values.
// article.reviewedNote renders only when the CMS marks the article as reviewed by a qualified professional.
// article.vetNote renders on articles that discuss veterinary products.

export const knowledge = {
  hub: {
    meta: {
      title: 'مركز المعرفة لمزارع الدواجن',
      description:
        'محتوى معرفي من الشروق لأصحاب مزارع الدواجن ومديريها حول أعمال المزرعة ومكملات الأعلاف والتعامل مع المنتجات البيطرية، إلى جانب أخبار الشركة.',
    },
    hero: {
      eyebrow: 'المعرفة',
      title: ['معرفة عملية', 'لمزارع الدواجن'],
      intro:
        'مقالات واضحة ومختصرة حول أعمال مزارع الدواجن ومكملات الأعلاف والتعامل مع المنتجات البيطرية وأخبار الشروق، تُنشر بعد مراجعة تحريرية، ومراجعة مهنية متخصصة عند الحاجة.',
    },
    categoriesTitle: 'تصفح حسب الموضوع',
    allCategories: 'كل الموضوعات',
    categories: [
      {
        key: 'farm-business',
        name: 'أعمال مزارع الدواجن',
        description:
          'موضوعات عملية حول تخطيط احتياجات المزرعة من المنتجات، وتنظيم الطلبات، والعمل مع الموردين.',
      },
      {
        key: 'feed-supplements',
        name: 'التوعية بمكملات الأعلاف',
        description:
          'معلومات عامة تعرّف بفئات مكملات الأعلاف وكيفية قراءة بياناتها، دون تقديم تركيبات أو جرعات.',
      },
      {
        key: 'vet-product-handling',
        name: 'التعامل مع المنتجات البيطرية',
        description:
          'معلومات عامة حول استلام المنتجات البيطرية وحفظها، يراجعها مختص مؤهل قبل النشر، ولا تغني عن استشارة الطبيب البيطري.',
      },
      {
        key: 'company-news',
        name: 'أخبار الشروق',
        description: 'مستجدات الشركة وإعلاناتها الرسمية المتعلقة بعملنا مع مزارع الدواجن.',
      },
    ],
    empty: {
      title: 'لا توجد مقالات منشورة بعد',
      body: 'تُنشر المقالات هنا بعد مراجعتها واعتمادها. وإلى ذلك الحين، يسعد فريقنا بالإجابة عن أسئلتك حول المنتجات والطلبات.',
      cta: 'تواصل مع فريقنا',
    },
    card: {
      readMore: 'اقرأ المقال',
      minutes: '{minutes} دقائق',
      minutesOne: 'دقيقة واحدة',
      minutesTwo: 'دقيقتان',
      minutesMany: '{minutes} دقيقة',
    },
  },
  article: {
    breadcrumbs: 'مسار التصفح',
    byline: 'بقلم {author}',
    published: 'تاريخ النشر',
    updated: 'آخر تحديث',
    readingTime: 'مدة القراءة',
    sources: 'المصادر',
    related: 'مقالات ذات صلة',
    share: 'شارك المقال',
    copyLink: 'نسخ الرابط',
    copied: 'تم نسخ الرابط',
    backToHub: 'العودة إلى مركز المعرفة',
    reviewedNote: 'خضع هذا المقال لمراجعة مختص مؤهل قبل نشره.',
    disclaimer:
      'يقدم هذا المقال معلومات عامة لأغراض التوعية، ولا يُعد استشارة بيطرية أو توصية علاجية. استشر الطبيب البيطري بشأن أي قرار يتعلق بصحة القطيع.',
    vetNote: 'تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.',
    metaDescriptionFallback: 'اقرأ «{title}» في مركز المعرفة لمزارع الدواجن من الشروق.',
  },
}

export type KnowledgeDictionary = typeof knowledge
