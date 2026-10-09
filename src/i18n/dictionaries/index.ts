import 'server-only'

import type { Locale } from '../config'

import { about as arAbout } from './ar/about'
import { common as arCommon } from './ar/common'
import { contact as arContact } from './ar/contact'
import { home as arHome } from './ar/home'
import { howWeWork as arHowWeWork } from './ar/howWeWork'
import { knowledge as arKnowledge } from './ar/knowledge'
import { partner as arPartner } from './ar/partner'
import { privacy as arPrivacy } from './ar/privacy'
import { products as arProducts } from './ar/products'
import { solutions as arSolutions } from './ar/solutions'

import { about as enAbout } from './en/about'
import { common as enCommon } from './en/common'
import { contact as enContact } from './en/contact'
import { home as enHome } from './en/home'
import { howWeWork as enHowWeWork } from './en/howWeWork'
import { knowledge as enKnowledge } from './en/knowledge'
import { partner as enPartner } from './en/partner'
import { privacy as enPrivacy } from './en/privacy'
import { products as enProducts } from './en/products'
import { solutions as enSolutions } from './en/solutions'

const dictionaries = {
  ar: {
    common: arCommon,
    home: arHome,
    about: arAbout,
    solutions: arSolutions,
    products: arProducts,
    howWeWork: arHowWeWork,
    knowledge: arKnowledge,
    contact: arContact,
    partner: arPartner,
    privacy: arPrivacy,
  },
  en: {
    common: enCommon,
    home: enHome,
    about: enAbout,
    solutions: enSolutions,
    products: enProducts,
    howWeWork: enHowWeWork,
    knowledge: enKnowledge,
    contact: enContact,
    partner: enPartner,
    privacy: enPrivacy,
  },
} as const

export type Dictionary = (typeof dictionaries)['ar']
export type CommonDict = Dictionary['common']

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale]
}
