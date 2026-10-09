/**
 * Seed the CMS with APPROVED / PROPOSED site content — never with fictitious products.
 *
 *   pnpm seed            → taxonomy, approved metrics, homepage copy, FAQs, site settings, approval records
 *   pnpm seed:fixtures   → additionally creates TEST staff accounts and clearly-labelled fixture products
 *                          (isFixture=true). Use ONLY with an isolated database, e.g.
 *                          DATABASE_URL=file:./data/e2e.db pnpm seed:fixtures
 *
 * Idempotent: re-running updates existing records instead of duplicating them.
 * Optional first admin (local only): SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD.
 */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import { common as arCommon } from '../i18n/dictionaries/ar/common'
import { home as arHome } from '../i18n/dictionaries/ar/home'
import { common as enCommon } from '../i18n/dictionaries/en/common'
import { home as enHome } from '../i18n/dictionaries/en/home'

const FIXTURES = process.env.SEED_FIXTURES === 'true'

async function upsertByKey<T extends 'product-categories' | 'poultry-segments'>(
  payload: Payload,
  collection: T,
  key: string,
  ar: Record<string, unknown>,
  en: Record<string, unknown>,
  extra: Record<string, unknown> = {},
) {
  const existing = await payload.find({ collection, where: { key: { equals: key } }, limit: 1, depth: 0 })
  const doc = existing.docs[0]
    ? await payload.update({ collection, id: existing.docs[0].id, data: { ...ar, ...extra } as never, locale: 'ar' })
    : await payload.create({ collection, data: { key, ...ar, ...extra } as never, locale: 'ar' })
  await payload.update({ collection, id: doc.id, data: en as never, locale: 'en' })
  return doc
}

async function seedTaxonomy(payload: Payload) {
  const categories = ['feed', 'supplements', 'medicines', 'vaccines'] as const
  for (const [i, key] of categories.entries()) {
    await upsertByKey(
      payload,
      'product-categories',
      key,
      { name: arCommon.categories[key].name, description: arCommon.categories[key].short },
      { name: enCommon.categories[key].name, description: enCommon.categories[key].short },
      { order: i + 1 },
    )
  }
  const segments = ['broilers', 'layers', 'breeders'] as const
  for (const [i, key] of segments.entries()) {
    await upsertByKey(
      payload,
      'poultry-segments',
      key,
      { name: arCommon.segments[key].name, intro: arCommon.segments[key].short },
      { name: enCommon.segments[key].name, intro: enCommon.segments[key].short },
      { order: i + 1 },
    )
  }
  payload.logger.info('✓ taxonomy: 4 categories, 3 segments')
}

async function seedMetrics(payload: Payload) {
  const items = arCommon.metrics.items.map((m) => ({
    key: m.key as 'farms' | 'birds' | 'products',
    qualifier: m.qualifier,
    value: m.value,
    unit: m.unit,
    label: m.label,
    srLabel: m.srLabel,
    accuracyNote:
      'Client-supplied approximate figure (master spec §1.1). Farms = farms served on an ongoing basis; birds = production capacity of served farms (not birds sold/vaccinated/owned); products = veterinary medicines + vaccines distributed (not feed/supplements).',
  }))
  const ar = await payload.updateGlobal({ slug: 'metrics', data: { items, footnote: arCommon.metrics.footnote }, locale: 'ar' })
  await payload.updateGlobal({
    slug: 'metrics',
    locale: 'en',
    data: {
      footnote: enCommon.metrics.footnote,
      items: (ar.items ?? []).map((row, i) => ({
        ...row,
        qualifier: enCommon.metrics.items[i]!.qualifier,
        unit: enCommon.metrics.items[i]!.unit,
        label: enCommon.metrics.items[i]!.label,
        srLabel: enCommon.metrics.items[i]!.srLabel,
      })),
    },
  })
  payload.logger.info('✓ metrics: 3 approved statements (ar/en)')
}

async function seedHomepage(payload: Payload) {
  const toLines = (arr: string[]) => arr.map((text) => ({ text }))
  const ar = await payload.updateGlobal({
    slug: 'homepage',
    locale: 'ar',
    data: {
      heroEyebrow: arHome.hero.eyebrow,
      heroHeadline: toLines(arHome.hero.headline),
      heroSubhead: arHome.hero.subhead,
      heroPrimaryCta: arHome.hero.primaryCta,
      heroSecondaryCta: arHome.hero.secondaryCta,
      statementLines: toLines(arHome.statement.lines),
      closingHeadline: toLines(arHome.closing.headline),
      closingSubhead: arHome.closing.subhead,
    },
  })
  // Array rows are shared across locales; localized text is set per row id.
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      heroEyebrow: enHome.hero.eyebrow,
      heroHeadline: (ar.heroHeadline ?? []).map((row, i) => ({ ...row, text: enHome.hero.headline[i] ?? row.text })),
      heroSubhead: enHome.hero.subhead,
      heroPrimaryCta: enHome.hero.primaryCta,
      heroSecondaryCta: enHome.hero.secondaryCta,
      statementLines: (ar.statementLines ?? []).map((row, i) => ({ ...row, text: enHome.statement.lines[i] ?? row.text })),
      closingHeadline: (ar.closingHeadline ?? []).map((row, i) => ({ ...row, text: enHome.closing.headline[i] ?? row.text })),
      closingSubhead: enHome.closing.subhead,
    },
  })
  payload.logger.info('✓ homepage copy (ar/en) — high-visibility lines remain pending client approval')
}

async function seedFaqs(payload: Payload) {
  for (const [i, item] of arHome.faq.items.entries()) {
    const existing = await payload.find({ collection: 'faqs', where: { order: { equals: i + 1 } }, limit: 1, depth: 0 })
    const data = {
      question: item.question,
      answer: item.answer,
      placement: ['home'] as ('home' | 'products' | 'contact')[],
      order: i + 1,
      approvalStatus: 'approved' as const,
      isPublished: true,
      approvalEvidence: 'Questions and substance confirmed in master spec §5 Scene 10 (client brief). Final wording: review before launch.',
    }
    const doc = existing.docs[0]
      ? await payload.update({ collection: 'faqs', id: existing.docs[0].id, data, locale: 'ar' })
      : await payload.create({ collection: 'faqs', data, locale: 'ar' })
    await payload.update({
      collection: 'faqs',
      id: doc.id,
      locale: 'en',
      data: { question: enHome.faq.items[i]!.question, answer: enHome.faq.items[i]!.answer },
    })
  }
  payload.logger.info(`✓ faqs: ${arHome.faq.items.length} business/process answers`)
}

async function seedSettings(payload: Payload) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: { siteStatus: 'staging', showKnowledgeHub: true, englishApproved: false },
  })
  payload.logger.info('✓ site settings: staging (noindex), knowledge hub on, English pending approval, no contact channels')
}

async function seedApprovals(payload: Payload) {
  const rows = [
    { item: 'Metric — ~300 poultry farms served on an ongoing basis', location: 'globals/metrics.items[farms]', state: 'approved', owner: 'Client', evidence: 'User instruction + master spec §1.1' },
    { item: 'Metric — ~15 million birds within production capacity of served farms', location: 'globals/metrics.items[birds]', state: 'approved', owner: 'Client', evidence: 'User instruction + master spec §1.1' },
    { item: 'Metric — ~150 veterinary medicine & vaccine products distributed', location: 'globals/metrics.items[products]', state: 'approved', owner: 'Client', evidence: 'User instruction + master spec §1.1' },
    { item: 'Hero headline & eyebrow', location: 'globals/homepage hero*', state: 'review_required', owner: 'Client marketing', evidence: 'Proposed in master spec §5 Scene 1' },
    { item: 'Corporate taglines (شريكك في منظومة إنتاج الدواجن …)', location: 'site copy', state: 'review_required', owner: 'Client', evidence: 'Proposed in master spec §4.1 — never inside the logo' },
    { item: 'Five-step commercial process', location: 'home.journey / howWeWork', state: 'review_required', owner: 'Client operations', evidence: 'Proposed in master spec §5 Scene 6 — confirm against real operations' },
    { item: 'English translation (all pages)', location: 'src/i18n/dictionaries/en', state: 'review_required', owner: 'Client', evidence: 'English locale stays noindex until approved' },
    { item: 'Privacy policy', location: 'privacy page', state: 'review_required', owner: 'Legal', evidence: 'Draft describing actual data flows; legal sign-off required' },
    { item: 'Contact channels (phone / WhatsApp / email / address)', location: 'globals/site-settings', state: 'placeholder_internal', owner: 'Client', evidence: 'Not supplied — hidden until verified' },
    { item: 'Product catalogue records', location: 'collections/products', state: 'placeholder_internal', owner: 'Client + manufacturers', evidence: 'No real product data supplied — catalogue shows designed empty state' },
    { item: 'Photography (licensed stock)', location: 'src/content/photos.ts', state: 'review_required', owner: 'Client brand', evidence: 'docs/image-provenance.md — replace with commissioned imagery before launch' },
    { item: 'Favicon derived from official emblem paths', location: 'public/favicon.svg', state: 'review_required', owner: 'Brand owner', evidence: 'Subset of official vectors (PDF p.3); no redraw' },
  ] as const
  for (const row of rows) {
    const existing = await payload.find({ collection: 'content-approvals', where: { item: { equals: row.item } }, limit: 1, depth: 0 })
    if (existing.docs[0]) await payload.update({ collection: 'content-approvals', id: existing.docs[0].id, data: { ...row } })
    else await payload.create({ collection: 'content-approvals', data: { ...row } })
  }
  payload.logger.info(`✓ approval register: ${rows.length} records`)
}

async function ensureUser(payload: Payload, email: string, password: string, role: 'admin' | 'editor' | 'sales', canApprove = false) {
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1, depth: 0 })
  if (existing.docs[0]) {
    await payload.update({ collection: 'users', id: existing.docs[0].id, data: { role, canApprove, password } })
    return existing.docs[0]
  }
  return payload.create({ collection: 'users', data: { email, password, role, canApprove, name: `${role} (seed)` } })
}

async function seedFixtures(payload: Payload) {
  if (!/e2e|test|fixture/i.test(process.env.DATABASE_URL ?? '')) {
    throw new Error('Refusing to create fixtures: DATABASE_URL must point to an isolated test database (name containing e2e/test/fixture).')
  }
  await ensureUser(payload, 'admin@e2e.test', 'Admin-e2e-Password-1', 'admin')
  await ensureUser(payload, 'editor@e2e.test', 'Editor-e2e-Password-1', 'editor', true)
  await ensureUser(payload, 'sales@e2e.test', 'Sales-e2e-Password-1', 'sales')

  const cats = await payload.find({ collection: 'product-categories', limit: 10, depth: 0 })
  const segs = await payload.find({ collection: 'poultry-segments', limit: 10, depth: 0 })
  const cat = (k: string) => cats.docs.find((c) => c.key === k)!.id
  const seg = (k: string) => segs.docs.find((s) => s.key === k)!.id

  const fixtures = [
    { slug: 'fixture-feed-alpha', nameAr: '[اختبار] منتج أعلاف تجريبي', nameEn: '[TEST] Fixture feed item', category: cat('feed'), segments: [seg('broilers')], approvalStatus: 'approved', isPublished: true },
    { slug: 'fixture-supplement-beta', nameAr: '[اختبار] مكمل أعلاف تجريبي', nameEn: '[TEST] Fixture supplement item', category: cat('supplements'), segments: [seg('layers'), seg('breeders')], approvalStatus: 'approved', isPublished: true },
    { slug: 'fixture-medicine-gamma', nameAr: '[اختبار] منتج بيطري تجريبي', nameEn: '[TEST] Fixture veterinary item', category: cat('medicines'), segments: [seg('broilers'), seg('layers')], approvalStatus: 'approved', isPublished: true },
    { slug: 'fixture-draft-delta', nameAr: '[اختبار] مسودة غير منشورة', nameEn: '[TEST] Unpublished draft', category: cat('vaccines'), segments: [seg('breeders')], approvalStatus: 'review_required', isPublished: false },
  ] as const
  for (const f of fixtures) {
    const data = {
      ...f,
      segments: [...f.segments],
      description: 'سجل اختبار آلي — ليس منتجًا حقيقيًا.',
      availabilityStatus: 'inquiry_only' as const,
      isFixture: true,
      sourceEvidence: 'Automated test fixture — isolated e2e database only.',
    }
    const existing = await payload.find({ collection: 'products', where: { slug: { equals: f.slug } }, limit: 1, depth: 0 })
    if (existing.docs[0]) await payload.update({ collection: 'products', id: existing.docs[0].id, data: data as never, locale: 'ar' })
    else await payload.create({ collection: 'products', data: data as never, locale: 'ar' })
  }
  payload.logger.info(`✓ fixtures: 3 staff test accounts, ${fixtures.length} [TEST] products (isFixture)`)
}

async function main() {
  const payload = await getPayload({ config })
  await seedTaxonomy(payload)
  await seedMetrics(payload)
  await seedHomepage(payload)
  await seedFaqs(payload)
  await seedSettings(payload)
  await seedApprovals(payload)

  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    await ensureUser(payload, process.env.SEED_ADMIN_EMAIL, process.env.SEED_ADMIN_PASSWORD, 'admin')
    payload.logger.info(`✓ admin account ensured for ${process.env.SEED_ADMIN_EMAIL}`)
  }
  if (FIXTURES) await seedFixtures(payload)
  payload.logger.info('Seed complete.')
  process.exit(0)
}

// `payload run` resolves as soon as the module is imported, so the work must be awaited at top level.
try {
  await main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
