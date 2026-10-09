import { TextReveal } from '@/components/motion/TextReveal'
import { isLocale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { notFound } from 'next/navigation'

// Temporary scaffold — replaced by the full homepage scenes.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const t = getDictionary(locale).home
  return (
    <section className="container-site section-y">
      <p className="eyebrow">{t.hero.eyebrow}</p>
      <TextReveal as="h1" lines={t.hero.headline} className="mt-6 text-display-2xl font-extrabold" />
      <p className="mt-8 measure text-lead text-fg-soft">{t.hero.subhead}</p>
    </section>
  )
}
