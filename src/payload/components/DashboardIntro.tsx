import type { ServerProps } from 'payload'

/**
 * CMS dashboard intro: role-aware work queue for the client's team — new inquiries for sales, records
 * awaiting approval for editors — plus the two rules that matter most (approved + published; no
 * invented data). Server component: counts come from the Local API with the user's own access rights.
 */
export async function DashboardIntro({ payload, user, i18n }: ServerProps) {
  const ar = i18n?.language === 'ar'
  const role = (user as { role?: string } | undefined)?.role
  const req = { user } as never

  const safeCount = async (collection: 'inquiries' | 'products' | 'articles' | 'faqs', where: Record<string, unknown>) => {
    try {
      const res = await payload.count({ collection, where: where as never, overrideAccess: false, req })
      return res.totalDocs
    } catch {
      return null
    }
  }

  const [newInquiries, productsInReview, articlesInReview] = await Promise.all([
    role === 'admin' || role === 'sales' ? safeCount('inquiries', { status: { equals: 'new' } }) : Promise.resolve(null),
    role === 'admin' || role === 'editor' ? safeCount('products', { approvalStatus: { equals: 'review_required' } }) : Promise.resolve(null),
    role === 'admin' || role === 'editor' ? safeCount('articles', { approvalStatus: { equals: 'review_required' } }) : Promise.resolve(null),
  ])

  const cards = [
    newInquiries !== null && {
      label: ar ? 'طلبات جديدة بانتظار التواصل' : 'New inquiries awaiting contact',
      value: newInquiries,
      href: '/admin/collections/inquiries?where[status][equals]=new',
    },
    productsInReview !== null && {
      label: ar ? 'منتجات بانتظار الاعتماد' : 'Products awaiting approval',
      value: productsInReview,
      href: '/admin/collections/products?where[approvalStatus][equals]=review_required',
    },
    articlesInReview !== null && {
      label: ar ? 'مقالات بانتظار الاعتماد' : 'Articles awaiting approval',
      value: articlesInReview,
      href: '/admin/collections/articles?where[approvalStatus][equals]=review_required',
    },
  ].filter(Boolean) as { label: string; value: number; href: string }[]

  return (
    <section
      style={{
        border: '1px solid var(--theme-elevation-150)',
        borderInlineStart: '4px solid #FE3300',
        borderRadius: 4,
        padding: '20px 24px',
        marginBottom: 32,
        background: 'var(--theme-elevation-0)',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 20 }}>{ar ? 'مرحبًا بك في نظام إدارة محتوى الشروق' : 'Welcome to the Alshorouk CMS'}</h2>
      <p style={{ margin: '8px 0 0', maxWidth: 760, lineHeight: 1.7 }}>
        {ar
          ? 'لا يظهر أي منتج أو مقال أو سؤال للزوار إلا إذا كان «معتمدًا» و«منشورًا». أدخل بيانات حقيقية معتمدة فقط — لا أرقام هواتف تجريبية، ولا منتجات أو شهادات أو جرعات غير موثقة.'
          : 'Visitors only see products, articles and FAQs that are Approved AND Published. Enter real, approved data only — no sample phone numbers, and no undocumented products, certifications or dosages.'}
      </p>
      {cards.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
          {cards.map((c) => (
            <a
              key={c.href}
              href={c.href}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                padding: '10px 14px',
                border: '1px solid var(--theme-elevation-150)',
                borderRadius: 4,
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <strong style={{ fontSize: 22, fontFamily: 'Montserrat, system-ui, sans-serif' }}>{c.value}</strong>
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  )
}
