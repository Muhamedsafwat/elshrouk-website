/*
 * Partner companies shown in the header "Partners" menu and the home page partners section.
 * Names, links and logo files supplied by the client on 2026-10-25 (logos live in public/img/logos/).
 * Each link opens the partner's own website in a new tab.
 *
 * To add a partner: drop its logo into public/img/logos/ and add an entry here.
 */
export type Partner = {
  name: string
  /** The partner's own page (products or poultry range). */
  link: string
  /** Logo path under /public. */
  icon: string
}

export const partners: Partner[] = [
  {
    name: 'Betra',
    link: 'https://www.betrakimya.com/urunler',
    icon: '/img/logos/Betra.png',
  },
  {
    name: 'Menon',
    // The supplied /shop URL returns 404; /poultry is Menon's live poultry range page.
    link: 'https://www.menon-nutrition.com/poultry',
    icon: '/img/logos/Menon.png',
  },
  {
    name: 'NFT',
    link: 'https://www.nftitalia.com/en/products/',
    icon: '/img/logos/NFT.png',
  },
]

/** Bare host for display, e.g. "betrakimya.com". */
export const partnerDomain = (link: string): string => new URL(link).hostname.replace(/^www\./, '')
