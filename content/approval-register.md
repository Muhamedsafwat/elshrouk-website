# Content approval register — Alshorouk website

Living document. Every outward-facing claim, headline and regulated statement on the site is tracked here.

- **Register owner:** poultry content-integrity reviewer (copy). The client approves; nobody on the build team self-approves facts.
- **Last full review:** 2026-10-09. All 20 dictionary files in `src/i18n/dictionaries/{ar,en}/` were read in full and checked.
- **Paths:** `ar/home.ts:hero.headline` means `src/i18n/dictionaries/ar/home.ts`, key `hero.headline`. Every Arabic row also covers the same key in `en/`, which is tracked separately in section H (English locale).

## How to use this register

| State | Meaning | Where it may render |
|---|---|---|
| `approved (client-supplied; verify wording before launch)` | The client supplied the statement. It is used verbatim, but the wording must be re-confirmed once before launch. | Production |
| `review_required` | We proposed the wording, or it depends on facts the client has not yet confirmed. | Staging only — the staging site is `noindex` and every such item is tracked here (no on-page draft marker is rendered for Arabic copy; English pages carry an "editorial review pending" notice). Must be approved before production launch. |
| `placeholder_internal` | Internal string for staging, fixtures or editors. | Never in public production |
| `hidden` | Must not render anywhere public until the condition in Notes is met. | Nowhere public |

- **To approve:** the client confirms the wording → set the state to `approved — <name>, <YYYY-MM-DD>` and record the evidence in Notes. Changing approved wording needs a new row.
- **English:** the whole `/en` locale stays `noindex` until row EN-01 is approved (`site-settings.englishApproved`).
- **Publishing gate:** CMS records follow the same states (`approvalStatus`). Dictionary copy follows this register.

### Owner roles

| Owner | Responsible for |
|---|---|
| Client — management | Business facts, positioning, taglines, vision and mission, English copy |
| Client — sales/operations | Commercial process, follow-up, availability, product lists, logistics |
| Client — legal/compliance | Privacy, consent, veterinary wording, regulatory and agency statements |
| Poultry veterinarian (client-appointed) | Technical accuracy of segment descriptions; review of knowledge articles |
| Engineering (orchestrator) | Statements that depend on the implementation: data flows, cookies, gating, persistence |
| Copy reviewer | UI microcopy consistency and glossary (see `docs/copy-glossary.md`) |

### Verification evidence for this review

- `tsc` 5.9.3 (`--strict --target es2022 --module esnext --moduleResolution bundler --skipLibCheck`) on all 20 dictionary files: exit 0. A negative test confirmed that a renamed EN key fails with TS2561.
- Integrity lint, all 10 dictionary pairs: **0 problems**. It checks the following:
  - key, array-length and `{placeholder}` parity between AR and EN;
  - the three metric statements are verbatim with a qualifier;
  - exact veterinary sentence in every veterinary context;
  - no Arabic-Indic digits, no Latin `, ? ;` in Arabic, no exclamation marks;
  - word limits;
  - EN meta descriptions are 127–159 characters;
  - headline lines contain no single-word line.
  - Script: `scratchpad/copy-integrity-review/review-lint.mjs`.
- The six scans in the `poultry-content-integrity` skill (livestock, manufacturing, operations/certification/superlatives, medical, metrics, contact data) over `src/i18n`. The only hits are code comments that document a ban, the negating disclaimers in `products.detail.infoNote` and `knowledge.hub.categories[1]`, and metric strings that carry the qualifier and exact label.
- Arabic typography scan: no detached و, no space before punctuation, no missing space after «،», no kashida and no invisible bidi characters.

---

## A. Client-supplied business statements

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| M-01 | Farms metric: «حوالي 300» + «مزرعة دواجن نتعامل معها بشكل مستمر» | `ar/common.ts:metrics.items[0]` (qualifier, value, label, srLabel); embedded verbatim in `ar/home.ts:partnerProof.narrative`, `ar/home.ts:faq.items[0].answer` | User instruction; AGENTS.md approved statements; spec §1.1 | Client — management | approved (client-supplied; verify wording before launch) | Confirm the figure is current. The qualifier stays visible in every animation frame. The count-up must not start from 0 in a way that implies precise measurement. `srLabel` is the accessible name. The FAQ wraps it as «وتضم قائمة عملائنا حوالي 300 …»; that wrapper sentence is covered by C-12. |
| M-02 | Birds metric: «حوالي 15 مليون» + «طائر ضمن الطاقة الإنتاجية للمزارع التي نخدمها» | `ar/common.ts:metrics.items[1]`; embedded verbatim in `ar/home.ts:partnerProof.narrative` | User instruction; AGENTS.md; spec §1.1 | Client — management | approved (client-supplied; verify wording before launch) | Never phrased as birds sold, vaccinated, owned or served individually. Checked: no occurrence does this. |
| M-03 | Products metric: «حوالي 150» + «منتجًا نوزعه من الأدوية واللقاحات البيطرية» | `ar/common.ts:metrics.items[2]`; embedded verbatim in `ar/home.ts:partnerProof.narrative`, `ar/home.ts:productUniverse.items[2].body` | User instruction; AGENTS.md; spec §1.1 | Client — management | approved (client-supplied; verify wording before launch) | Covers medicines **and** vaccines only. It is never attached to feed or supplements (checked). Spec §19.3: the client should confirm the exact scope of the count. On the home **medicines** card it reads «ضمن حوالي 150 منتجًا نوزعه من الأدوية واللقاحات البيطرية». The scope is correct, but a reader skimming the card could take it as «150 medicines». **Resolved 2026-10-09 (creative director): figure removed from the medicines card** to avoid a «150 medicines» misreading; the proof band and narrative keep the precise statement. |
| S-01 | Segment name التسمين / Broilers | `ar/common.ts:segments.broilers.name`, `solutionsMenu.broilers`, `forms.options.productionTypes.broilers`; `ar/home.ts:farmTypes.items[0].name`; `ar/solutions.ts:overview.chapters[0].name` | User instruction; AGENTS.md segments; spec §1.1 | Client — management | approved (client-supplied; verify wording before launch) | No other subsectors (hatcheries, turkeys, ducks) appear anywhere. Checked. |
| S-02 | Segment name البياض / Layers | as S-01, `layers` keys | User instruction; AGENTS.md; spec §1.1 | Client — management | approved (client-supplied; verify wording before launch) | |
| S-03 | Segment name الأمهات / Breeders | as S-01, `breeders` keys | User instruction; AGENTS.md; spec §1.1 | Client — management | approved (client-supplied; verify wording before launch) | |
| B-01 | Business line أعلاف الدواجن / Poultry feed (the name) | `ar/common.ts:categories.feed.name`, `forms.options.productCategories.feed`; `ar/home.ts:productUniverse.items[0].name` | User instruction; AGENTS.md business lines; spec §1.1 | Client — management | approved (client-supplied; verify wording before launch) | Only the line **name** is approved. Which feed offerings exist, and every description of them, is not approved: see C-01 and C-03 (spec §19.3). |
| B-02 | Business line مكملات الأعلاف / Feed supplements (the name) | `ar/common.ts:categories.supplements.name`, `forms.options.productCategories.supplements`; `ar/home.ts:productUniverse.items[1].name` | as B-01 | Client — management | approved (client-supplied; verify wording before launch) | As B-01. See C-02. |
| B-03 | Business line الأدوية البيطرية / Veterinary medicines (the name) | `ar/common.ts:categories.medicines.name`, `forms.options.productCategories.medicines`; `ar/home.ts:productUniverse.items[2].name` | as B-01 | Client — management | approved (client-supplied; verify wording before launch) | Distributor verbs only (نوزع / نعمل على إتاحة). |
| B-04 | Business line اللقاحات البيطرية / Veterinary vaccines (the name) | `ar/common.ts:categories.vaccines.name`, `forms.options.productCategories.vaccines`; `ar/home.ts:productUniverse.items[3].name` | as B-01 | Client — management | approved (client-supplied; verify wording before launch) | |
| PT-01 | Partner list (Betra, Menon, NFT): names, links and logos, shown in the header «شركاؤنا» menu and the home partners section | `src/content/partners.ts`; logos `public/img/logos/*.png`; copy `ar/common.ts:nav.partners`, `ar/home.ts:partners` | **User instruction 2026-10-25** (names, links and logo files supplied) | Client — management | approved (client-supplied; verify wording before launch) | Menon's supplied `/shop` link returned 404 on 2026-10-25, so the site links to `/poultry` (Menon's poultry page); Betra uses `https`. Section copy (`partners.title`, `intro`) is a writer proposal and claims nothing beyond working with these companies. The Menon logo file is low resolution on a black background; a better file is requested (see OI-08). |

## B. Taglines and high-visibility headlines

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| T-01 | Home page title = proposed tagline «حلول إمداد متخصصة لمزارع الدواجن» | `ar/home.ts:meta.title` | AGENTS.md proposed tagline; spec §4.1 | Client — management | review_required | Renders as «… \| الشروق» in the browser tab and in search results. |
| T-02 | Hero eyebrow «الشروق \| منظومة متكاملة لقطاع الدواجن» | `ar/home.ts:hero.eyebrow` | Spec §5 Scene 1 (marked "requires copy approval") | Client — management | review_required | «منظومة متكاملة» (integrated system) is a claim about scope. |
| T-03 | Hero headline «من قلب صناعة الدواجن، / نساند كل مرحلة من الإنتاج.» | `ar/home.ts:hero.headline` | Spec §5 Scene 1 proposal | Client — management | review_required | "Every stage of production" is a broad scope claim (§19.8). |
| T-04 | Hero subhead «الشروق شريك متخصص لمزارع التسمين والبياض والأمهات، يوفر حلول الإمداد من الأعلاف ومكملاتها إلى الأدوية واللقاحات البيطرية.» | `ar/home.ts:hero.subhead` | Spec §5 Scene 1, verbatim | Client — management | review_required | States that feed and feed supplements are supplied, which spec §19.3 requires the client to confirm. |
| T-05 | Statement «كل مزرعة لها احتياج مختلف. / وكل مرحلة تستحق دعمًا متخصصًا.» + caption «لذلك نبدأ بفهم مزرعتك قبل الحديث عن المنتجات.» | `ar/home.ts:statement.lines`, `statement.caption` | Spec §5 Scene 3 (lines); writer (caption) | Client — management | review_required | The caption describes an approach (understand the farm first). |
| T-06 | Farm-types title «ثلاثة أنواع من المزارع، / لكل منها احتياجات إمداد مختلفة.» | `ar/home.ts:farmTypes.title` | Writer proposal | Client — management | review_required | Low risk. |
| T-07 | Product-universe title «من الأعلاف إلى اللقاحات، / أربع فئات وشريك إمداد واحد.» | `ar/home.ts:productUniverse.title` | Writer proposal | Client — management | review_required | Implies one supplier covers all four lines. Depends on B-01/B-02 being confirmed. |
| T-08 | Partner-proof title «علاقات تُبنى دورة بعد دورة» | `ar/home.ts:partnerProof.title` | Writer proposal; spec §5 Scene 9 | Client — management | review_required | Implies repeat relationships across cycles. The narrative is covered by P-07. |
| T-09 | Closing headline «مزرعتك تستحق شريكًا / يعرف احتياجاتها.» + subhead | `ar/home.ts:closing.headline`, `closing.subhead` | Spec §5 Scene 11 | Client — management | review_required | |
| T-10 | Footer statement «إمداد متخصص لمزارع التسمين والبياض والأمهات.» | `ar/common.ts:footer.statement` | Writer proposal | Client — management | review_required | Appears on every page. |
| T-11 | About hero «نعرف قيمة كل يوم / في دورة الإنتاج.» | `ar/about.ts:hero.title` | Spec §6.1 proposal | Client — management | review_required | |
| T-12 | About name chapter title «مع الشروق يبدأ كل يوم» | `ar/about.ts:name.title` | Writer; PDF p.4 brand story | Client — management | review_required | Reads as a slogan. The EN deliberately differs ("Alshorouk means sunrise") so English readers learn what the name means. |
| T-13 | About CTA title «كل شراكة تبدأ / بفهم احتياج مزرعتك.» | `ar/about.ts:cta.title` | Writer proposal | Client — management | review_required | |
| T-14 | Solutions overview hero «حلول تخدم مراحل / إنتاج الدواجن المختلفة» | `ar/solutions.ts:overview.hero.title` | Spec §6.2, verbatim | Client — management | review_required | The EN adaptation reads "Supply solutions for broiler, layer and breeder farms". |
| T-15 | Segment page heroes: «كل دورة تسمين / تبدأ بتخطيط واضح للإمداد.» · «دورة إنتاج طويلة / تحتاج إلى إمداد مستمر.» · «حيث تبدأ / سلسلة إنتاج الدواجن.» | `ar/solutions.ts:segments.{broilers,layers,breeders}.hero.title` | Writer proposal | Client — management | review_required | |
| T-16 | Process title «من احتياج المزرعة إلى متابعة الطلب» | `ar/home.ts:journey.title`; `ar/howWeWork.ts:hero.title`, `meta.title` | Spec §5 Scene 6 concept | Client — management | review_required | The EN wording is aligned across all three keys (see section I). |
| T-17 | Other page heroes (catalogue, knowledge, contact, partner) | `ar/products.ts:catalog.hero.title`; `ar/knowledge.ts:hub.hero.title`; `ar/contact.ts:hero.title`; `ar/partner.ts:hero.title` | Writer proposal | Client — management | review_required | Descriptive and low risk. |

## C. Positioning, values, vision and mission

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| P-01 | Poultry-only company statements: «نعمل مع مزارع الدواجن وحدها» · «نركز على قطاع الدواجن وحده» · «الشروق موزع متخصص في قطاع الدواجن» | `ar/about.ts:who.paragraphs[0]`, `about.hero.intro`, `about.meta.*`; `ar/home.ts:values.items[3].body` | User instruction (poultry-only). The brand PDF (p.5) says "Not … a poultry-only brand". | Client — management | review_required | The client instruction overrides the PDF for the website. These sentences, however, state it as a fact about the **company**. Confirm (Q6). |
| P-02 | Value descriptions (home): الأمانة · الدقة · الالتزام · الخبرة | `ar/home.ts:values.items[0..3].body`, `values.intro` | Spec §5 Scene 7; PDF p.5, rewritten without its cold-chain, batch/dose and on-time-delivery lines | Client — management | review_required | The value **names** come from the PDF. The descriptions are proposals and remain commitments about behaviour. |
| P-03 | Value descriptions (About), including the authenticity claim «نتعامل في منتجات أصلية» | `ar/about.ts:principles.items[0..3].body`, `principles.intro` | PDF p.5 "Authentic products, honest information" | Client — management + legal | review_required | The authenticity claim needs evidence of authorised sourcing. Without it, soften to the honest-information wording used on home (Q5). Precision and Reliability make no SLA claim. |
| P-04 | Vision «أن نكون شريك الإمداد الذي تعتمد عليه مزارع الدواجن في كل دورة إنتاج.» | `ar/about.ts:visionMission.vision.body` | PDF p.4 adapted; "most dependable" and "vets call first" removed | Client — management | review_required | Proposal. |
| P-05 | Mission (four lines, "clear information, organised coordination, ongoing communication") | `ar/about.ts:visionMission.mission.body` | PDF p.4 adapted; "correctly stored" (a cold-chain claim) and "on schedule" (an SLA) removed | Client — management | review_required | Proposal. Depends on B-01/B-02. |
| P-06 | Brand story and logo note (rooster, horizon dashes, arc) | `ar/about.ts:name.body`, `name.note`; `ar/common.ts:brand.logoAlt` | PDF p.4, p.8, p.13 | Client — management | review_required | Logo description checked against PDF p.8: rooster head, short dashes either side, arc under the wordmark, descriptor «لتوزيع الأدوية واللقاحات البيطرية». "Herds" and "medicines arriving on time" were removed from the story. |
| P-07 | Partner-proof narrative: «نقيس عملنا بعلاقات طويلة الأمد، لا بصفقات منفردة.» + segment spread «وتتوزع هذه المزارع بين التسمين والبياض والأمهات» | `ar/home.ts:partnerProof.narrative`, `partnerProof.segments[*].caption` | Writer proposal; spec §5 Scene 9 | Client — management | review_required | Embeds M-01 to M-03 verbatim (verified by lint). The positioning sentence and the claim that the farms span the three segments need approval. |
| P-08 | Metric framing lines: «ثلاثة أرقام تقريبية تلخص نطاق عملنا …», «علاقات عمل قائمة مع مزارع …», footnote «الأرقام تقريبية وتعكس نطاق تعاملاتنا الحالي.» | `ar/common.ts:metrics.intro`, `metrics.footnote`; `ar/home.ts:proof.title`, `proof.footnote`; `ar/about.ts:scale.intro` | Spec §5 Scene 2 (footnote "if approved"); writer | Client — management | review_required | The footnote wording is the spec's own. Render either `home.proof.title` or `common.metrics.intro` on a page, not both. |
| P-09 | "One source" claims: «جهة واحدة للأعلاف والمكملات والمنتجات البيطرية» · «فئات منتجاتنا الأربع» | `ar/home.ts:farmTypes.items[0].points[1]`, `farmTypes.items[1].body` | Writer proposal | Client — management | review_required | Assumes all four lines are available to each segment. Depends on Q1. |

## D. Service and process claims

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| C-01 | Feed descriptions, including coordinating supply quantities and timing | `ar/common.ts:categories.feed.short`; `ar/home.ts:productUniverse.items[0].body` | Business line confirmed by the user instruction (2026-10-09); specific offerings and logistics wording unconfirmed (spec §19.3, §19.5) | Client — sales/operations | review_required | **Orchestrator note:** that Alshorouk supplies poultry feed and feed supplements is client-confirmed (user instruction), so supplier verbs (نوفر) are allowed; only *which* products and any logistics/timing wording stay unconfirmed. Earlier note: the specific feed offering is unconfirmed, and "coordinating quantities and timing" implies logistics capability. No brands, formulas or delivery times are given. |
| C-02 | Supplement descriptions; catalogue shows approved-label information | `ar/common.ts:categories.supplements.short`; `ar/home.ts:productUniverse.items[1].body` | None yet (spec §19.3) | Client — sales/operations | review_required | Assumes catalogue entries carry approved label data (CMS fields). |
| C-03 | Four-line scope statements in intros and meta descriptions (supplier verbs only) | `ar/home.ts:meta.description`, `productUniverse.intro`; `ar/about.ts:meta.description`, `hero.intro`, `who.paragraphs[0]`; `ar/solutions.ts:overview.meta.description`, `overview.hero.intro`, `overview.matrix.intro`, `overview.chapters[*].body`, `segments.*.meta.description`, `segments.*.hero.intro`; `ar/products.ts:catalog.meta.description`, `catalog.hero.intro`, `catalog.categoryBrowser.intro`; `ar/partner.ts:meta.description`; `ar/privacy.ts:sections[0].body[0]` | **User instruction 2026-10-09** ("The company focuses on poultry feed, feed supplements, and related poultry veterinary supply") + AGENTS.md business lines | Client — management | approved (client-supplied scope; verify wording before launch) | نوفر is used for feed and supplements, نوزع for medicines and vaccines, and نعمل على إتاحة for scope statements. No manufacturing wording anywhere (scan clean). Depends on Q1. |
| C-04 | Segment supply coordination (home farm types) | `ar/home.ts:farmTypes.intro`, `farmTypes.items[*].body`, `farmTypes.items[*].points` | Writer proposal | Client — sales/operations | review_required | Covers requests coordinated with each cycle, scheduled requests for layers, availability confirmed before each request, periodic reviews and coordination with the flock plan. No outcome claims (weight, egg production, hatchability). |
| C-05 | Segment descriptors | `ar/common.ts:segments.*.short`; `ar/home.ts:partnerProof.segments[*].caption` | Writer proposal | Client — management | review_required | Low risk. |
| C-06 | Solutions chapters and segment pages: coordination before each cycle, continuous supply for layers, precise supply for breeders | `ar/solutions.ts:overview.chapters[*]`, `segments.*.overview.body`, `segments.*.needs.items[*]`, `segments.*.help.steps[*]` | Writer proposal | Client — sales/operations; poultry veterinarian (technical accuracy) | review_required | These are intentions, not guarantees. A poultry veterinarian should check the technical descriptions (V-05). |
| C-07 | Recurring or periodic requests for layer farms | `ar/solutions.ts:segments.layers.needs.items[3]`, `segments.layers.help.steps[1]`; `ar/home.ts:farmTypes.items[1].points[0]` | Writer proposal | Client — sales/operations | review_required | Confirm this service is offered (Q3). |
| C-08 | Supply scheduled around breeder-farm biosecurity rules | `ar/solutions.ts:segments.breeders.needs.items[2]`, `segments.breeders.help.steps[2]` | Writer proposal | Client — sales/operations | review_required | Confirm the delivery model (Q3). |
| C-09 | Five-step process (PROPOSED): فهم احتياج المزرعة · تحديد المنتجات المناسبة · تأكيد الطلب والتوافر · تنسيق التوريد · استمرار التواصل | `ar/home.ts:journey.*`; `ar/howWeWork.ts:steps[*]`, `hero.intro`, `principles.items[*]`, `meta.description` | Spec §5 Scene 6, §6.6 | Client — sales/operations | review_required | Always rendered with the "indicative" note (`home.journey.note`, `howWeWork.disclaimer`). No SLA, fleet, warehouse, cold chain or delivery time. «ننسق موعد التوريد وطريقته» still implies we coordinate timing and method, so confirm own transport, carrier or farm pickup (Q3). |
| C-10 | Three-step request process | `ar/solutions.ts:overview.howToRequest.steps` | Writer proposal | Client — sales/operations | review_required | |
| C-11 | Role summary: «حلقة وصل بين مصادر المنتجات والمزرعة…» | `ar/about.ts:who.paragraphs[2]` | Writer proposal | Client — sales/operations | review_required | Distributor framing plus a summary of the proposed process. |
| C-12 | Team follow-up promises (no time frame anywhere) | `ar/common.ts:footer.contactBody`, `forms.success.body`; `ar/home.ts:faq.items[0..2].answer`; `ar/about.ts:cta.body`; `ar/solutions.ts:overview.cta.body`, `overview.howToRequest.steps[2]`, `segments.*.form.intro`; `ar/howWeWork.ts:form.intro`; `ar/products.ts:catalog.inquiryCta.body`, `detail.inquireBody`, `drawer.success`; `ar/contact.ts:hero.intro`, `aside.steps[*]`; `ar/partner.ts:form.intro`, `process.steps[*]` | Spec §10.3, §11 | Client — sales/operations | review_required | Notifications are "pending SMTP configuration", so sales must monitor CMS inquiries for these promises to hold. `drawer.success` and `contact.aside.steps[2]` promise a **phone** follow-up. Show success text only after the inquiry has been saved. |
| C-13 | The current product list is shared on request | `ar/home.ts:faq.items[2].answer`, `productPreview.emptyBody`; `ar/products.ts:catalog.states.emptyCatalogBody`; `ar/common.ts:cta.requestCatalog`, `cta.requestCurrentList` | Spec §1.3, §5 Scene 10 ("once workflow exists") | Client — sales/operations | review_required | Sales must actually send a current list in response. |
| C-14 | Prices and availability are confirmed per request and not listed online | `ar/home.ts:faq.items[3].answer`; `ar/products.ts:catalog.hero.intro` | Spec §6.4 | Client — sales/operations | review_required | Low risk. Matches the no-price, no-stock catalogue policy. |
| C-15 | Catalogue empty-state status lines | `ar/home.ts:productPreview.emptyTitle`, `productPreview.emptyBody`; `ar/products.ts:catalog.states.emptyCatalogTitle` | Writer proposal | Client — sales/operations | review_required | «الكتالوج الرقمي قيد الإعداد» / «نضيف المنتجات…» imply product data is being prepared. This is true only if the client supplies product data. If not, rephrase neutrally, as was done for the knowledge hub (see section I). |
| C-16 | Availability labels: التوافر عند الاستفسار · يُوفَّر عند الطلب · التوافر مؤكد | `ar/products.ts:catalog.availability.*` | Spec §10.1 (`availabilityStatus` enum) | Client — sales/operations; CMS editor | review_required; `confirmed` = **hidden** unless evidence exists | Render «التوافر مؤكد» only when an authorised editor sets `availabilityStatus=confirmed` with evidence. None of the three labels states stock levels. |
| C-17 | Partner page: openness to supply or agency talks (no partners, exclusivity or geography claimed) | `ar/partner.ts:hero.intro`, `meta.description`, `relationship.items[*]`, `fit.items`, `process.steps[*]` | Spec §6.9 | Client — management + legal | review_required | «وكالة توزيع» (distribution agency) has legal implications in Egypt. Keep it, or reduce to supply/distribution (Q9). No partner logos. |
| C-18 | Contact page inquiry types | `ar/contact.ts:types.*` | Writer proposal; spec §6.8 | Copy reviewer | review_required | Titles match `common.forms.options.inquiryTypes` exactly (checked). |
| C-19 | Working principles: «لا نقدم وعدًا بتوافر أو موعد قبل مراجعته» | `ar/howWeWork.ts:principles.items[*]` | Writer proposal | Client — sales/operations | review_required | |
| C-20 | Broiler CTA «اطلب استشارة منتجات» | `ar/solutions.ts:segments.broilers.cta`, `segments.broilers.form.title`, `segments.broilers.meta.description` | Spec §4.2 route table | Client — management | review_required | «استشارة» could be read as a veterinary consultation. The surrounding copy keeps it commercial. Alternatives: «اطلب قائمة المنتجات» / «ناقش احتياج مزرعتك» (Q13). |
| C-21 | Hero CTA order: primary «استكشف حلولنا», secondary «تواصل معنا» | `ar/home.ts:hero.primaryCta`, `hero.secondaryCta` | Spec §5 Scene 1; the spec §4.2 route table names «تواصل مع فريق الشروق» as the home page's primary action | Client — management | review_required | UX decision (Q14). |

## E. Veterinary content

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| V-01 | Safety sentence «تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.» | `ar/common.ts:vetSafetyNote`; `ar/home.ts:productUniverse.items[2].body` (last sentence); `ar/solutions.ts:overview.matrix.note`, `segments.{broilers,layers,breeders}.categories.intro`; `ar/howWeWork.ts:disclaimer`; `ar/products.ts:detail.vetNote`; `ar/knowledge.ts:article.vetNote` | AGENTS.md; spec §1.4 | Client — legal/compliance | review_required (mandated wording; compliance sign-off per §19.6) | 9 Arabic occurrences, all byte-identical (lint). The paraphrase on the home medicines card was replaced in this review. The EN version is EN-03. |
| V-02 | Category descriptors that mention veterinary supervision | `ar/common.ts:categories.medicines.short`, `categories.vaccines.short` | Writer proposal | Client — legal/compliance | review_required | These are short descriptors, not a substitute for V-01. Wherever a veterinary category is shown with products, also render V-01. |
| V-03 | Vaccines card: «… لتُستخدم وفق البرنامج الذي يحدده الطبيب البيطري للقطيع.» | `ar/home.ts:productUniverse.items[3].body` | Writer proposal | Client — legal/compliance | review_required | Refers to the veterinarian's programme only. No schedule is given. |
| V-04 | Medicines and vaccines are supplied as the farm veterinarian specifies | `ar/solutions.ts:segments.*.needs.items` (veterinarian items), `segments.breeders.categories.intro`, `segments.*.help.steps`; `ar/howWeWork.ts:steps[1].body`; `ar/home.ts:journey.steps[1].body` | Writer proposal | Client — legal/compliance | review_required | Confirm this matches practice and Egyptian rules for dispensing veterinary medicines and vaccines (Q4). |
| V-05 | Technical descriptions of production types: cycles, rearing then laying, hens and roosters, biosecurity, feed needs by phase | `ar/solutions.ts:segments.*.overview.body`, `segments.*.needs.items[*]`; `ar/home.ts:farmTypes.items[*].body` | Writer proposal | Poultry veterinarian | review_required | Descriptive only. No protocols, doses, schedules or outcome promises (scan clean). |
| V-06 | Product-detail disclaimer «… ولا تُعد توصية علاجية أو إرشادًا للاستخدام أو الجرعات.» | `ar/products.ts:detail.infoNote` | Spec §1.4 | Client — legal/compliance | review_required | A legitimate negating disclaimer. |
| V-07 | Approved label PDF labels «النشرة المعتمدة» / «تحميل النشرة بصيغة PDF» | `ar/products.ts:detail.label`, `detail.downloadLabel` | Spec §6.5 | CMS editor + Client — legal/compliance | hidden | Render only when a manufacturer-approved, locally appropriate label PDF has been legally cleared for that product (`labelPdfApproved`). |
| V-08 | Target species «الدواجن» | `ar/products.ts:detail.targetSpecies`, `detail.targetSpeciesValue` | Spec §6.5 | CMS editor | review_required | Show only when the approved label lists poultry. |
| V-09 | Knowledge publishing commitment: «تُنشر بعد مراجعة تحريرية، ومراجعة مهنية متخصصة عند الحاجة.» | `ar/knowledge.ts:hub.hero.intro` | Spec §6.7 | Client — management | review_required | The CMS workflow must actually include both review steps. |
| V-10 | Knowledge category «التعامل مع المنتجات البيطرية» (reviewed by a qualified professional before publication) | `ar/knowledge.ts:hub.categories[2]` | Spec §6.7 | Client — legal/compliance; poultry veterinarian | hidden | **High risk.** Hide until the client names the qualified reviewer (Q10). |
| V-11 | Article reviewed note «خضع هذا المقال لمراجعة مختص مؤهل قبل نشره.» | `ar/knowledge.ts:article.reviewedNote` | Spec §6.7 | CMS editor | hidden | Render per article only when the CMS records a reviewer and review evidence. |
| V-12 | Article disclaimer (general information, not veterinary advice) | `ar/knowledge.ts:article.disclaimer` | Spec §6.7 | Client — legal/compliance | review_required | |
| V-13 | Feed-supplement topic description («دون تقديم تركيبات أو جرعات») | `ar/knowledge.ts:hub.categories[1].description` | Writer proposal | Client — legal/compliance | review_required | Low risk. A negating disclaimer. |
| V-14 | Form help: no diagnosis or treatment advice through the form | `ar/common.ts:forms.fields.message.help` | Writer proposal | Client — legal/compliance | review_required | Low risk. |

## F. Legal, privacy and consent

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| L-01 | Consent checkbox text and privacy link | `ar/common.ts:forms.consentText`, `forms.privacyLinkText`, `forms.errors.consentRequired`, `forms.fields.consent.label` | Writer proposal; spec §6.8, §11.4 | Client — legal/compliance | review_required | **High risk.** Depends on the final privacy policy and retention period. Review together with L-02. |
| L-02 | Contact privacy note: «نستخدم بياناتك للرد على طلبك ومتابعته فقط، ولا نبيعها أو نشاركها لأغراض تسويقية.» + data-minimisation line | `ar/contact.ts:aside.privacyNote`, `form.intro` | Writer proposal | Client — legal/compliance | review_required | Must stay consistent with the use and sharing sections of the privacy policy (`privacy.sections[2]`, `sections[6]`). The field set must actually stay minimal. |
| L-03 | Cookie banner | `ar/common.ts:cookie.*` | Spec §6.10, §12.4 | Engineering + Client — legal/compliance | hidden | Show only if analytics is enabled, and only after the cookies section of the privacy policy (`privacy.sections[7]`) has been updated. While analytics is off, the banner text («…فلا نستخدمها إلا بموافقتك») would contradict `privacy.sections[7]` («لا نستخدم حاليًا ملفات تعريف ارتباط للتحليلات»). |
| L-04 | Privacy status note «تعكس هذه السياسة الممارسات الحالية للموقع…» | `ar/privacy.ts:statusNote` | Writer proposal | Client — legal/compliance | review_required | Must be true at launch. |
| L-05 | Data controller identity (legal entity name not supplied) | `ar/privacy.ts:sections[0].body[0..1]` | Spec §19.2 | Client — legal/compliance | review_required | **High risk.** Add the registered legal entity name. No address by design. |
| L-06 | List of data collected, which must equal the real form fields and Inquiry schema | `ar/privacy.ts:sections[1].body[0..2]` | Spec §10.1 Inquiry model | Engineering + Client — legal/compliance | review_required | **High risk.** Update whenever the schema changes. |
| L-07 | IP and technical data processed briefly and then deleted | `ar/privacy.ts:sections[1].body[3]`, `sections[5].body[2]` | Writer proposal | Engineering | review_required | **High risk.** Confirm how rate limiting stores IPs (stored or not, hashed or not, how long). Hosting access logs may also keep IPs. |
| L-08 | No marketing without separate consent | `ar/privacy.ts:sections[2].body[1]` | Writer proposal | Client — legal/compliance | review_required | |
| L-09 | Legal basis is consent; consent can be withdrawn | `ar/privacy.ts:sections[3].body[0..2]` | Writer proposal | Client — legal/compliance | review_required | **High risk.** Check against Egypt's Personal Data Protection Law (Law 151 of 2020). The consent checkbox must be mandatory on every form. |
| L-10 | Storage in a secured CMS database with role-based access | `ar/privacy.ts:sections[4].body[0..1]` | Spec §10.2 | Engineering | review_required | Depends on server-side RBAC and production database security. |
| L-11 | Retention period still to be set | `ar/privacy.ts:sections[5].body[0..1]` | — | Client — legal/compliance | review_required | **High risk.** Set a concrete period before the policy is finalised. |
| L-12 | Sharing and processors (hosting, SMTP); disclosure when required by law | `ar/privacy.ts:sections[6].body[0..1]` | Writer proposal | Engineering + Client — legal/compliance | review_required | Name the processors once chosen. A cross-border transfer may need to be disclosed. |
| L-13 | Cookies: essential only, no analytics | `ar/privacy.ts:sections[7].body[0..1]` | Spec §12.4 | Engineering | review_required | **High risk.** Must be true at launch. See L-03. |
| L-14 | Data-subject rights handled through the contact form, choosing «استفسار عام» | `ar/privacy.ts:sections[8].body[0..1]` | Writer proposal | Client — sales/operations + legal | review_required | «استفسار عام» matches `contact.types.general.title` and `common.forms.options.inquiryTypes.general` (checked). Needs an internal procedure. |
| L-15 | Security measures (no certification or encryption claimed) | `ar/privacy.ts:sections[9].body[0..1]` | Spec §11.4 | Engineering | review_required | Matches the planned honeypot, rate limit, idempotency and RBAC. |
| L-16 | Change clause | `ar/privacy.ts:sections[10].body[0]` | Writer proposal | Client — legal/compliance | review_required | Low risk. No dates by design. |
| L-17 | Copyright «© {year} الشروق. جميع الحقوق محفوظة.» | `ar/common.ts:footer.copyright` | Spec §19.2 | Client — legal/compliance | review_required | Brand name or registered legal entity name (Q12)? |
| L-18 | Regulatory wording on the partner page: «المسجلة … وفق المتطلبات التنظيمية المعمول بها», «منتجات مسجلة وفق المتطلبات التنظيمية المحلية» | `ar/partner.ts:relationship.items[1]`, `fit.items[0..1]` | Writer proposal | Client — legal/compliance | review_required | General terms only. No licence or agency is claimed. |

## G. UI microcopy, forms and internal-only strings

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| U-01 | Navigation, header, footer and CTA labels | `ar/common.ts:nav`, `solutionsMenu`, `header`, `footer` (labels), `cta`, `breadcrumbs` | Spec §4.2 (nav labels and route-table CTAs) | Copy reviewer | review_required | Low risk. EN equivalents are fixed in `docs/copy-glossary.md` §6. |
| U-02 | Form labels, help text, errors, states, accessibility labels, 404 and error pages | `ar/common.ts:forms.fields`, `forms.options` (except governorates), `forms.errors`, `forms.failure`, `a11y`, `states`, `notFound`, `errorPage` | Writer proposal | Copy reviewer | review_required | Low risk. The server error message admits the request was not saved, which is honest. |
| U-03 | Bird-capacity example «مثال: 20 ألف طائر» | `ar/common.ts:forms.fields.birdCapacity.placeholder` | Writer proposal | Client — management | review_required | An illustrative input hint, not a business figure. Remove it if example numbers are unwanted (Q17). |
| U-04 | Governorate list: 27 Egyptian governorates plus «خارج مصر» | `ar/common.ts:forms.options.governorates` | Official list (CAPMAS order) | Copy reviewer | review_required | Captures where the visitor is. It claims no service coverage. AR and EN arrays are both 28 items and index-aligned (checked). |
| U-05 | Logo alt text | `ar/common.ts:brand.logoAlt` | PDF p.8 | Copy reviewer | review_required | Verified against the PDF artwork. |
| U-06 | Staging banner «بيئة تجريبية: البيانات المعروضة هنا بيانات اختبار، وليست منتجات حقيقية.» | `ar/common.ts:demoBanner` | Spec §1.3 | Engineering | placeholder_internal | Fixture and staging environments only. Never in production. |
| U-07 | English review label | `ar/common.ts:englishReviewNotice` | Spec §0.2 | Engineering | placeholder_internal | Shown on `/en` while EN-01 is unapproved. |
| U-08 | Catalogue UI: search, filters, plural result counts, pagination, cards, image fallback alt | `ar/products.ts:catalog.search`, `catalog.filters`, `catalog.results`, `catalog.pagination`, `catalog.card`, `catalog.states` (except C-15), `detail` (field labels), `drawer` (labels) | Writer proposal; spec §6.4 | Copy reviewer | review_required | Plural keys follow `Intl.PluralRules('ar')`. The fallback image must be an unbranded category visual. |
| U-09 | Knowledge UI labels, byline, reading time | `ar/knowledge.ts:hub.categoriesTitle`, `hub.allCategories`, `hub.card`, `article` (labels); `ar/common.ts:readingTime*` | Writer proposal | Copy reviewer | review_required | Show an author or date only when it is real (§6.7). |
| U-10 | Knowledge empty state, rewritten in this review: «لا توجد مقالات منشورة بعد» / «تُنشر المقالات هنا بعد مراجعتها واعتمادها…» | `ar/knowledge.ts:hub.empty` | Copy reviewer | Client — management | review_required | Replaces a status claim that articles were already in editorial and professional review, which could not be verified. Or hide the hub from navigation until articles are approved (§6.7). |
| U-11 | Contact page structure: type cards, form sections, prefill chips | `ar/contact.ts:types`, `form`, `prefill` | Writer proposal | Copy reviewer | review_required | Low risk. |

## H. English locale

| ID | Content item | Location (file:key) | Claim / evidence source | Owner | State | Notes |
|---|---|---|---|---|---|---|
| EN-01 | The whole English adaptation | `en/*.ts` (all 10 files, same keys as Arabic) | Editorial adaptation of the Arabic | Client — management (+ English editor) | review_required | `/en` stays `noindex` until approved (spec §19.8). Every Arabic row above applies to the same EN key. |
| EN-02 | EN metric statements: display «Approx.» + label (`metrics.items[*]`), screen-reader «Approximately …», running text «around …» | `en/common.ts:metrics.items[*]`; `en/home.ts:partnerProof.narrative`, `faq.items[0].answer`, `productUniverse.items[2].body` | AGENTS.md English column ("~300 poultry farms we serve on an ongoing basis", …) | Client — management | review_required | The display wording matches the AGENTS.md table. «Approximately» and «around» are qualifier variants for screen readers and running text. Approve them together with EN-01 (Q15). |
| EN-03 | EN safety sentence "Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian." | `en/common.ts:vetSafetyNote`; `en/home.ts:productUniverse.items[2].body`; `en/solutions.ts:overview.matrix.note`, `segments.*.categories.intro`; `en/howWeWork.ts:disclaimer`; `en/products.ts:detail.vetNote`; `en/knowledge.ts:article.vetNote` | Our translation; no approved English wording exists | Client — legal/compliance | review_required | 9 occurrences, all identical (lint). |
| EN-04 | EN segment and line names: Broilers · Layers · Breeders · Poultry feed · Feed supplements · Veterinary medicines · Veterinary vaccines | `en/common.ts:segments.*.name`, `categories.*.name`, `forms.options.*` | AGENTS.md (English given in brackets) | Client — management | review_required | Approve together with EN-01. Terminology is consistent across all EN files (checked). |
| EN-05 | EN taglines and headlines: "Specialised Supply Solutions for Poultry Farms", "Rooted in the poultry industry, / supporting every stage of production.", "Alshorouk means sunrise", etc. | `en/home.ts:meta.title`, `hero.*`, `statement.*`, `closing.*`; `en/about.ts:hero.title`, `name.title`; `en/solutions.ts:*.hero.title` | Writer adaptation | Client — management | review_required | High-visibility English marketing copy (§19.8). |

---

## I. Changes made in this review (2026-10-09)

Only values were changed. No keys were added or removed, so components are unaffected.

| # | Location | Before → after | Reason |
|---|---|---|---|
| 1 | `ar/home.ts:productUniverse.items[2].body` | «… من بين حوالي 150 … تُستخدم وفق الإرشادات المعتمدة وتحت إشراف الطبيب البيطري.» → «أدوية بيطرية للدواجن، ضمن حوالي 150 منتجًا نوزعه من الأدوية واللقاحات البيطرية. تُستخدم المنتجات البيطرية وفقًا للإرشادات المعتمدة وتحت إشراف الطبيب البيطري.» | The safety sentence was paraphrased; it must be exact. The metric stays verbatim. 22 words. |
| 2 | `en/home.ts:productUniverse.items[2].body` | "Poultry veterinary medicines from a portfolio of approximately 150 … For use in line with approved guidelines and under veterinary supervision." → "Part of around 150 veterinary medicine and vaccine products we distribute. Veterinary products should be used in line with approved guidelines and under the supervision of a veterinarian." | Same as #1, using the exact EN sentence. 28 words. |
| 3 | `ar/home.ts:farmTypes.items[1].title` | «احتياجات ثابتة …» → «احتياجات منتظمة …» | "Fixed" contradicted solutions.ts, which says layer-flock needs differ between rearing and laying. |
| 4 | `en/home.ts:proof.title` | "Established working relationships…" → "Ongoing working relationships…" | "Established" implied a history the Arabic does not claim. |
| 5 | `en/home.ts:values.items[2].body` | "long-standing relationships" → "ongoing relationships" | Implied history; the Arabic «الممتدة» means ongoing or extended. |
| 6 | `en/home.ts:partnerProof.narrative` | "three figures" → "three approximate figures" | Parity with «ثلاثة أرقام تقريبية»; keeps the qualifier explicit. |
| 7 | `en/home.ts:meta.title`; `en/common.ts:notFound.meta.title` | Sentence case → Title Case ("Specialised Supply Solutions for Poultry Farms", "Page Not Found") | All other EN meta titles use Title Case. |
| 8 | `en/home.ts:journey.title`; `en/howWeWork.ts:hero.title` | "From farm needs to follow-up on your request" / "From the farm’s needs / to ongoing follow-up." → "From the farm’s needs to follow-up on your request" (split over two lines on How we work) | The same Arabic string had three EN renderings. |
| 9 | `en/common.ts:cta.startPartnership` | "Partner with Alshorouk" → "Start a partnership with Alshorouk" | The same Arabic «ابدأ شراكة مع الشروق» was translated differently in `about.cta.primary`. The new wording is also distinct from the supplier page CTA "Partner with us". |
| 10 | `ar/common.ts:readingTime`, `readingTimeMany` | «{minutes} دقائق قراءة» / «{minutes} دقيقة قراءة» → «{minutes} دقائق للقراءة» / «{minutes} دقيقة للقراءة» | Same pattern as the one and two forms («دقيقة واحدة للقراءة», «دقيقتان للقراءة»). |
| 11 | `ar/common.ts:categories.supplements.short` | «نوفرها بمعلومات ملصقاتها المعتمدة» → «نوفرها مع المعلومات الواردة في ملصقاتها المعتمدة» | Awkward construction. |
| 12 | `en/solutions.ts` (7 strings: `overview.chapters[0].body`, `segments.broilers.needs.items[3].body`, `segments.broilers.resources.empty`, `segments.layers.needs.items[3].body`, `segments.layers.help.steps[1].body`, `segments.layers.resources.empty`, `segments.breeders.resources.empty`) | "orders / ordering / how to order" → "requests / how to request them" | Glossary: طلب = request. |
| 13 | `en/solutions.ts:segments.layers.cta`, `segments.layers.form.title` | "Contact the team…" → "Talk to our team…" | The same Arabic «تواصل مع الفريق» is "Talk to our team" in the header. |
| 14 | `en/solutions.ts:segments.breeders.hero.title` | "Where the poultry / production chain begins." → "Where the chain / of poultry production begins." | The old line break split the compound noun. |
| 15 | `en/solutions.ts:segments.layers.overview.body` | "…and on the veterinary products set out in its veterinary programme being available at the right time." → "…and on timely availability of the veterinary products set out in its veterinary programme." | Clumsy English. |
| 16 | `ar/solutions.ts:segments.breeders.overview.body` | «قطعانًا من الدجاج والديوك» → «قطعانًا من الدجاجات والديوك» | «الدجاج» is a collective that includes roosters. |
| 17 | `ar/solutions.ts:segments.layers.needs.items[0].body` | «يحد من انقطاع الفئات الأساسية» → «يحد من انقطاع توافر الفئات الأساسية» | Categories are not "interrupted"; their availability is. |
| 18 | `ar/about.ts:name.body` | «يقظ، مرفوع الرأس، ومبكر.» → «يقظ، مرفوع الرأس، يستيقظ مبكرًا.» | «مبكر» describing the rooster was a calque of the English "early". |
| 19 | `ar/knowledge.ts:hub.empty`; `en/knowledge.ts:hub.empty` | «المقالات الأولى قيد المراجعة / نُعد مجموعة من المقالات… قيد المراجعة التحريرية والمهنية» → «لا توجد مقالات منشورة بعد / تُنشر المقالات هنا بعد مراجعتها واعتمادها…» (EN: "No articles published yet / Articles appear here once they have been reviewed and approved…") | The old text was an unverifiable status claim that articles existed and were in professional review. |
| 20 | `en/knowledge.ts:hub.categories[0].description`, `hub.empty.body` | "organising orders", "products and orders" → "organising purchase requests", "products and requests" | Glossary: طلب = request. |
| 21 | `ar/partner.ts:hero.intro`; `en/partner.ts:hero.intro` | «لمنتجات الدواجن» / "poultry products" → «لمنتجات مزارع الدواجن» / "poultry farm products" | «منتجات الدواجن» / "poultry products" normally means chicken meat and eggs, which misstates the business. |
| 22 | `en/partner.ts:form.fields.role`, `form.fields.productLineHint` | "Your role" → "Job title"; "…or poultry vaccines" → "…or veterinary vaccines for poultry" | The same Arabic «المسمى الوظيفي» is "Job title" in common; the glossary term is "veterinary vaccines". |
| 23 | `en/products.ts:catalog.categoryBrowser.intro` | "We supply poultry farm products…" → "We make poultry farm products available…" | Parity with «نعمل على إتاحة». |
| 24 | `ar/home.ts` header comment | Notes that the medicines card embeds the exact safety sentence | Prevents a future paraphrase. |

## J. Open questions for the client (consolidated)

1. **Feed and feed supplements (spec §19.3).** Which poultry feed and feed-supplement lines are actually offered? This affects B-01/B-02 descriptions, C-01 to C-03, T-04, T-07, P-05 and P-09.
2. **Metrics.** Are the three figures still current? What exactly does the 150 count cover? Keep the 150 statement on the home medicines card, or show it only in the proof band?
3. **Commercial process.** Please confirm the five steps, the phone follow-up and who contacts the customer. Does Alshorouk deliver with its own vehicles, use a carrier, or have farms collect? Please also confirm recurring requests for layer farms, scheduling around breeder biosecurity, and sharing the current product list on request.
4. **Veterinary practice.** Are medicines and vaccines supplied only as the farm veterinarian specifies or prescribes? Does this follow Egyptian rules?
5. **Authenticity.** Can «نتعامل في منتجات أصلية» be supported with evidence of authorised sourcing? If not, it will be softened.
6. **Poultry-only.** Should «نعمل مع مزارع الدواجن وحدها» be stated as a fact about the company? The PDF positioning says otherwise.
7. **Headlines and taglines** T-01 to T-17 and the English marketing copy (EN-05).
8. **Vision and mission** (P-04, P-05).
9. **Partner page.** Keep «وكالة توزيع» (agency)? Do you want approaches from manufacturers and suppliers at all?
10. **Knowledge hub.** Who is the qualified reviewer for articles on handling veterinary products? Will the hub launch, or stay hidden until articles are approved?
11. **Privacy.** Please supply the legal entity name, retention period, hosting provider and location, and SMTP processor. Please also confirm how IP addresses are handled, whether analytics will be used, the procedure for data-subject requests, and a legal review against Law 151 of 2020.
12. **Copyright.** Should the line show the brand name «الشروق» or the registered legal entity?
13. **Broiler CTA.** Keep «اطلب استشارة منتجات», or change it?
14. **Hero CTAs.** Which is the primary (filled) button: «استكشف حلولنا» or «تواصل مع فريق الشروق»?
15. **English metric display.** Use "~300" as in AGENTS.md, or "About 300"?
16. **House style.** British English and Title Case meta titles? «كود المنتج» or «رمز المنتج»? Feminine agreement for الشروق as the subject of a verb («تتعامل الشروق»)?
17. **Example number.** May the form keep the example «مثال: 20 ألف طائر»?

## K. Implementation notes for the orchestrator

- **Metrics.** Render the qualifier, value, unit and label from `common.metrics.items`. Use `srLabel` as the accessible text and hide the animated digits from assistive technology. The qualifier must be visible in every frame. On the home page, render `home.proof.title` **or** `common.metrics.intro`, not both.
- **Veterinary sentence.** Render `common.vetSafetyNote` wherever veterinary categories or products appear: medicine and vaccine category views, product detail (`products.detail.vetNote`), and articles about veterinary topics (`knowledge.article.vetNote`). The home medicines card already contains it, so don't render it a second time next to the card.
- **Hidden until evidence exists:**
  - `knowledge.hub.categories[vet-product-handling]` and `knowledge.article.reviewedNote`;
  - `products.detail.label` / `downloadLabel`;
  - `products.catalog.availability.confirmed`;
  - `common.cookie.*` (until analytics is enabled).
  - `common.demoBanner` is for staging only.
- **Forms.** Show success copy (`common.forms.success`, `products.drawer.success*`) only after the inquiry has been saved. Inquiry-type labels must stay identical across `common.forms.options.inquiryTypes`, `contact.types.*.title` and the privacy text («استفسار عام»); they are identical now.
- **Plurals.** `products.catalog.results.*` and the reading-time keys (`common.readingTime*`, `knowledge.hub.card.minutes*`) follow `Intl.PluralRules('ar')`: one, two, few (3–10), many (11–99), other. The two reading-time sets duplicate each other; use one helper.
- **`latin` fields.** In EN they equal `name`; render the label once.
- **Navigation.** `solutionsMenu` is top-level, a sibling of `nav`.
- **Governorates.** The AR and EN arrays are both 28 items and index-aligned.
- **Bidi.** Wrap `{reference}`, `{year}`, SKUs and Latin names in `<bdi>` inside Arabic text.
- **English locale.** `/en` stays `noindex` and shows `common.englishReviewNotice` until EN-01 is approved.


> **Update 2026-10-11 (orchestrator):** the English display qualifier is now «Approx.» (EN-02) — chosen because a bare «~» above a display-size figure is ambiguous; the screen-reader sentence spells out «Approximately». Content-integrity QA (docs/evidence/content-integrity.md) confirmed all three statements render verbatim with qualifiers in both locales.
