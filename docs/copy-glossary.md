# Copy glossary and style rules (Arabic ↔ English)

This glossary applies to `src/i18n/dictionaries/{ar,en}/*.ts` and to any copy entered in the CMS. Arabic is the primary language; English is a polished adaptation, not a literal translation. The terms and rules below are the ones **actually applied** in the dictionaries as of the 2026-10-09 review. Claims and their approval states are tracked in `content/approval-register.md`.

> When the same Arabic string appears in several places, it must have the same English rendering everywhere. A meta title may differ only in casing. The integrity lint checks this (`DRIFT` notes).

## 1. Brand and fixed statements

| Arabic | English | Rule |
|---|---|---|
| الشروق | Alshorouk · "the Alshorouk team" | As the subject of a verb, الشروق takes feminine agreement: «هل تتعامل الشروق…», «أن تحفظ الشروق…». As a nominal predicate it keeps the gender of the noun: «الشروق شريك متخصص… يوفر», «الشروق موزع متخصص». |
| لتوزيع الأدوية واللقاحات البيطرية | "for the distribution of veterinary medicines and vaccines" | This descriptor is part of the logo. Never rewrite it. It is quoted only in alt text (`common.brand.logoAlt`). |
| تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري. | Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian. | Use this sentence **verbatim** wherever veterinary products are discussed. Never paraphrase or shorten it. Source: `common.vetSafetyNote`. |
| الأرقام تقريبية وتعكس نطاق تعاملاتنا الحالي. | Figures are approximate and reflect the current scope of our business. | Metric footnote (spec wording, approval pending). |

### Approved metric statements (verbatim; the qualifier is always visible)

| Metric | Arabic display | Arabic label | English display | English running text | English screen reader |
|---|---|---|---|---|---|
| Farms | حوالي 300 | مزرعة دواجن نتعامل معها بشكل مستمر | ~300 · Poultry farms we serve on an ongoing basis | around 300 poultry farms we serve on an ongoing basis | Approximately 300 poultry farms we serve on an ongoing basis. |
| Birds | حوالي 15 مليون | طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها | ~15 million · Birds within the production capacity of the farms we serve | around 15 million birds within the production capacity of the farms we serve | Approximately 15 million birds within the production capacity of the farms we serve. |
| Products | حوالي 150 | منتجًا نوزعه من الأدوية واللقاحات البيطرية | ~150 · Veterinary medicine and vaccine products we distribute | around 150 veterinary medicine and vaccine products we distribute | Approximately 150 veterinary medicine and vaccine products we distribute. |

- The source of truth is `common.metrics.items`. Components never hard-code the figures.
- The 150 figure covers medicines **and** vaccines only. Never attach it to feed or supplements.
- Never present 15 million as birds sold, vaccinated, owned or served. Never present any figure as exact.
- If you embed a statement in a sentence, keep it whole: «… ضمن حوالي 150 منتجًا نوزعه من الأدوية واللقاحات البيطرية».

## 2. Poultry segments

| Arabic | English | Descriptive forms used |
|---|---|---|
| التسمين | Broilers | مزارع التسمين / مزارع دجاج اللحم = broiler farms · لحم الدواجن = poultry meat · دورة التسمين = broiler cycle · استقبال الكتاكيت = chick placement |
| البياض | Layers | مزارع البياض / مزارع بيض المائدة = layer farms / table-egg farms · مرحلة التربية = rearing phase · مرحلة الإنتاج = laying phase |
| الأمهات | Breeders | مزارع الأمهات = breeder farms · قطعان الأمهات = breeder flocks · بيض التفريخ = hatching eggs · الدجاجات والديوك = hens and roosters |

- There are no other subsectors: no hatcheries, turkeys, ducks or quail.
- Do not use "parent stock" or "broiler chickens". "Laying hens" is acceptable in alt text only.
- In form options, use the article-less forms تسمين / بياض / أمهات and «أكثر من نوع» = "More than one type".

## 3. Business lines (product categories)

| Arabic | English | Short forms |
|---|---|---|
| أعلاف الدواجن | Poultry feed | الأعلاف = feed |
| مكملات الأعلاف | Feed supplements | الأعلاف ومكملاتها = feed and feed supplements |
| الأدوية البيطرية | Veterinary medicines | المنتجات البيطرية = veterinary products (medicines + vaccines) |
| اللقاحات البيطرية | Veterinary vaccines | الأدوية واللقاحات البيطرية = veterinary medicines and vaccines |

## 4. Core vocabulary

| Arabic | English | Notes |
|---|---|---|
| مزرعة / مزارع الدواجن | poultry farm(s) | |
| قطيع / قطعان | flock(s) | Never "herd". |
| الطاقة الإنتاجية | production capacity | |
| دورة الإنتاج | production cycle | |
| الإمداد · التوريد | supply | «حلول الإمداد» = supply solutions |
| التوزيع | distribution | |
| استفسار | inquiry | Never "enquiry". «نموذج الاستفسار» = inquiry form |
| طلب | request | Not "order" (applied across the EN files). «طلبات دورية» = recurring requests |
| الطبيب البيطري | veterinarian | Not "vet". «الطبيب البيطري للمزرعة» = the farm veterinarian |
| البرنامج البيطري | veterinary programme | Refer to it only. Never describe a schedule. |
| الأمن الحيوي | biosecurity | |
| التوافر | availability | «التوافر عند الاستفسار» = availability on inquiry · «يُوفَّر عند الطلب» = supplied on request · «التوافر مؤكد» = availability confirmed (CMS evidence only) |
| الكتالوج · كتالوج تجاري | catalogue · B2B catalogue | |
| النشرة المعتمدة | approved label | |
| الشركة المصنعة | manufacturer | Third-party product makers only, never Alshorouk. |
| كود المنتج | product code (SKU) | House-style question: «رمز المنتج» is the formal alternative. |
| حجم العبوة · شكل المنتج | pack size · form | |
| نوع الإنتاج | production type | |
| الفئة / فئات المنتجات | category / product categories | |
| المحافظة | governorate | |
| المسمى الوظيفي | job title | |
| رقم مرجعي / رقم المرجع | reference | |
| مركز المعرفة | knowledge hub | |
| شراكة وتوريد | partnership and supply | |
| وكالة توزيع | distribution agency | Legal review pending (register C-17). |
| مصادر المنتجات | product sources | Distributor framing. |
| عميل / عملاؤنا | customer(s) | Not "clients". |

## 5. Verbs: supplier and distributor framing

| Arabic | English | Used for |
|---|---|---|
| نوفر | we supply | Feed, feed supplements and general scope |
| نوزع | we distribute | Veterinary medicines and vaccines |
| نعمل على إتاحة | we make … available / we work to make … available | Scope statements, vaccines, categories |
| نساعد في توفير | we help supply | Segment needs |
| ننسق | we coordinate | Supply timing and requests, with no SLA attached |

**Never use:** نصنع، ننتج، مصنعنا، تركيبتنا · "we manufacture", "we produce", "our factory", "our formula".

## 6. CTA and UI labels (keep identical wherever the Arabic repeats)

| Arabic | English |
|---|---|
| تواصل معنا | Contact us (nav and footer heading: "Contact"; meta title: "Contact Us") |
| تواصل مع الفريق | Talk to our team |
| تواصل مع فريق الشروق | Contact the Alshorouk team |
| ابدأ التواصل | Get in touch |
| استكشف حلولنا | Explore our solutions |
| ناقش احتياج مزرعتك | Discuss your farm’s needs |
| اطلب منتجاتك | Request products |
| اطلب قائمة المنتجات | Request the product list |
| اطلب القائمة الحالية | Request the current list |
| استفسر عن المنتج | Inquire about this product |
| تصفح المنتجات | Browse products |
| ابدأ طلبك | Start your request |
| أرسل طلبك | Send your request |
| ابدأ شراكة مع الشروق | Start a partnership with Alshorouk |
| كن شريكًا | Partner with us |
| اطلب استشارة منتجات | Request a product consultation (wording under review, C-20) |
| استفسر عن الحلول | Ask about our solutions |
| اعرف المزيد · عرض الكل | Learn more · View all |
| من احتياج المزرعة إلى متابعة الطلب | From the farm’s needs to follow-up on your request |
| احتياجات المزرعة · استفسار عن منتج · شراكة وتوريد · استفسار عام | Farm needs · Product inquiry · Partnership and supply · General inquiry |

## 7. Words and claims we do not use

| Category | Arabic (avoid) | English (avoid) |
|---|---|---|
| Non-poultry animals | أبقار، ماشية، مواشي، أغنام، ماعز، خيول، ألبان، جاموس، حيوانات أليفة | cows, cattle, sheep, goats, horses, dairy, livestock, herds, pets, animals (generic) |
| Hype | رائد، الأفضل، الأول في، لا مثيل له، مضمون، نضمن، ثورة | world-leading, leading, revolutionary, unmatched, guaranteed, best-in-class, number one |
| Operations not verified | سلسلة التبريد، أسطول، مستودع، مخازن، فروع، 24 ساعة، في نفس اليوم، توصيل خلال … | cold chain, fleet, warehouse, branches, nationwide, same-day, within 24 hours, delivery times |
| Credentials | شهادة، أيزو، ترخيص، منذ عام …، سنوات من الخبرة | certified, ISO/GMP/GSP, licensed, since 19xx, years of experience |
| Medical | جرعة، جرعات، فترة السحب، يعالج، فعالية، برنامج التحصين (as content) | dose, dosage, withdrawal period, cures/treats, efficacy, vaccination schedule |
| Outcome promises | زيادة الوزن، نسبة الفقس، نسبة النفوق، زيادة الإنتاج | weight gain, hatchability, mortality, higher egg production |
| Implied history | — | long-standing, established (as a claim about Alshorouk) |
| Ambiguous scope | منتجات الدواجن (reads as meat and eggs) → use **منتجات مزارع الدواجن** | poultry products → use **poultry farm products** |

Negating disclaimers are allowed, for example «لا تُعد توصية علاجية أو إرشادًا للاستخدام أو الجرعات» and "not … guidance on use or dosage".

## 8. Style rules applied: Arabic

- **Register.** Professional Modern Standard Arabic for the Egyptian B2B market: direct, factual, respectful, with no colloquialisms (e.g. «هل يمكنني…», not «هل أقدر…»). The reader is addressed in the generic second-person singular (مزرعتك، تواصل).
- **Digits.** Use Western digits 0–9 only, never ٠–٩. Figures and Latin runs (`{reference}`, `{year}`, SKUs, PDF, IP) are wrapped in `<bdi>` when rendered.
- **Punctuation.**
  - Use the Arabic comma «،», semicolon «؛» and question mark «؟», and «» for quotes.
  - Put no space before punctuation and one space after «،».
  - Never use exclamation marks.
- **Diacritics.** Use them only where they prevent misreading (تُستخدم، يُوفَّر، تُؤكَّد، يُسجل). Write the accusative tanween on alef (شريكًا، منتجًا، مبكرًا). Never stretch words with kashida.
- **Counts.** Follow `Intl.PluralRules('ar')`:

  | Category | Product count | Reading time (minutes) |
  |---|---|---|
  | zero | لا توجد منتجات مطابقة | — |
  | one | منتج واحد | دقيقة واحدة للقراءة |
  | two | منتجان | دقيقتان للقراءة |
  | few (3–10) | {count} منتجات | {minutes} دقائق للقراءة |
  | many (11–99) | {count} منتجًا | {minutes} دقيقة للقراءة |
  | other (100+) | {count} منتج | {minutes} دقيقة للقراءة |

- **Display headlines.**
  - Write them as arrays of 2–3 lines with no single-word line.
  - Where possible, keep a construct pair (إضافة) and its noun on the same line.
  - A full sentence ends with «.»; a noun-phrase title takes no full stop.
- **Lengths.**
  - Hero subhead: 30 words or fewer.
  - Section intro: 40 words or fewer.
  - Card body: 28 words or fewer.
  - FAQ answer: 60 words or fewer.
  - Meta description: natural length (about 100–165 characters as used).
  - Meta titles are written without the brand; the layout appends « | الشروق».
- **Metrics.** Always «حوالي» + figure + exact label. If a metric appears in a paragraph, the full approved statement appears with it.
- **Veterinary content.** Use the exact safety sentence. Refer the reader to «الطبيب البيطري». Never give doses, schedules, withdrawal periods, compatibility, efficacy or outcomes.
- **Process copy.** Describe steps as a proposed, indicative process («الخطوات المعروضة توضيحية…»), with no time commitments.

## 9. Style rules applied: English

- **Spelling.** British: catalogue, specialised/specialist, programme, organisation/organising, finalised, summarise.
- **Terms.** Use "inquiry", and "request" for طلب, never "order". Use "supply" (نوفر/الإمداد), "distribute" (نوزع) and "make available" (نعمل على إتاحة).
- **Case.**
  - Sentence case for headings, eyebrows, navigation, buttons and labels.
  - Title Case for meta titles ("Poultry Farm Product Catalogue"). The layout appends " | Alshorouk".
- **Typography.**
  - Typographic apostrophes and quotes ’ “ ”, and the ellipsis character "…" in loading states.
  - No Oxford comma ("broiler, layer and breeder farms").
  - No exclamation marks.
- **Metric qualifiers.** "~" in the metric display, "around" in running text, "Approximately" in screen-reader labels.
- **Meta descriptions.** 120–160 characters. Current range: 127–159.
- **Adaptation, not translation.** Natural English is preferred where it keeps the meaning (e.g. "Alshorouk means sunrise" for «مع الشروق يبدأ كل يوم»). Claims must not be stronger than the Arabic: no "established", "long-standing" or "leading" unless the Arabic says so.
- **`latin` fields.** In English they equal `name`; the label is rendered once.

## 10. Single sources of truth

| Content | Key |
|---|---|
| Metric statements | `common.metrics.items[*]` (qualifier, value, unit, label, srLabel) |
| Veterinary safety sentence | `common.vetSafetyNote` (also `products.detail.vetNote`, `knowledge.article.vetNote`, and embedded where noted in the register) |
| Segment names and descriptors | `common.segments.*` · solutions menu: `common.solutionsMenu` |
| Category names and descriptors | `common.categories.*` · form options: `common.forms.options.productCategories` |
| CTA labels | `common.cta.*` |
| Inquiry types | `common.forms.options.inquiryTypes` = `contact.types.*.title` |
| Form fields, errors, consent | `common.forms.*` |
