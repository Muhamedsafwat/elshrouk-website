import { Photo } from '@/components/media/Photo'
import { CheckIcon } from '@/components/ui/icons'
import { FlowSteps } from '@/components/sections/contact/FlowSteps'
import type { Locale } from '@/i18n/config'
import type { PartnerDictionary } from '@/i18n/dictionaries/ar/partner'

/** Section title with a neutral Montserrat index (vermilion stays reserved for ≥24px bold text). */
function Heading({ index, title, id }: { index: string; title: string; id: string }) {
  return (
    <div className="flex flex-col gap-5">
      <span className="num text-small font-semibold tracking-wide text-fg-muted" data-reveal="fade">
        {index}
      </span>
      <h2 id={id} className="text-display-md font-bold text-fg" data-reveal="up">
        {title}
      </h2>
    </div>
  )
}

/** 01 · Relationship types — editorial rows with hairlines beside an arch window (one per page). */
export function PartnerRelationships({ copy, locale }: { copy: PartnerDictionary['relationship']; locale: Locale }) {
  return (
    <section data-theme="light" aria-labelledby="partner-relationship" className="section-y bg-surface text-fg">
      <div className="container-site grid-site gap-y-14 lg:items-start">
        <div className="col-span-4 md:col-span-8 lg:col-span-7">
          <Heading index="01" title={copy.title} id="partner-relationship" />
          <ol className="mt-12 border-b border-line lg:mt-16">
            {copy.items.map((item, i) => (
              <li key={item.title} className="grid gap-3 border-t border-line py-8 md:grid-cols-[5rem_1fr] md:gap-8 lg:py-10" data-reveal="up">
                <span className="num text-small font-semibold text-fg-muted">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-title font-bold text-fg">{item.title}</h3>
                  <p className="measure text-body leading-relaxed text-fg-soft">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="col-span-4 md:col-span-6 md:col-start-2 lg:col-span-4 lg:col-start-9 lg:sticky lg:top-28">
          <Photo
            id="categoryMedicines"
            locale={locale}
            shape="arch"
            reveal
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 60vw, 90vw"
            className="aspect-[4/5] w-full"
          />
        </div>
      </div>
    </section>
  )
}

/** 02 · Fit criteria — a quiet checklist on warm grey. */
export function PartnerFit({ copy }: { copy: PartnerDictionary['fit'] }) {
  return (
    <section data-theme="warm" aria-labelledby="partner-fit" className="section-y bg-surface text-fg">
      <div className="container-site grid-site gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <Heading index="02" title={copy.title} id="partner-fit" />
        </div>
        <ul className="col-span-4 grid border-t border-fg md:col-span-8 md:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {copy.items.map((item) => (
            <li key={item} className="flex items-start gap-4 border-b border-line py-6 md:pe-8 md:even:ps-8 md:even:pe-0" data-reveal="up">
              <span aria-hidden className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                <CheckIcon size={14} />
              </span>
              <span className="text-body font-semibold leading-relaxed text-fg">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** 03 · Three-step process — a Distribution Flow that runs right→left in Arabic. */
export function PartnerProcess({ copy }: { copy: PartnerDictionary['process'] }) {
  return (
    <section data-theme="light" aria-labelledby="partner-process" className="section-y bg-surface text-fg">
      <div className="container-site">
        <Heading index="03" title={copy.title} id="partner-process" />
        <FlowSteps steps={copy.steps} orientation="horizontal" className="mt-14 lg:mt-20" />
      </div>
    </section>
  )
}
