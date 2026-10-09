import type { StaticImageData } from 'next/image'
import hero from '@/assets/photos/hero.jpg'
import heroAlt1 from '@/assets/photos/hero-alt-1.jpg'
import heroAlt2 from '@/assets/photos/hero-alt-2.jpg'
import statement from '@/assets/photos/statement.jpg'
import segmentBroilers from '@/assets/photos/segment-broilers.jpg'
import broilersDetail from '@/assets/photos/broilers-detail.jpg'
import segmentLayers from '@/assets/photos/segment-layers.jpg'
import layersDetail from '@/assets/photos/layers-detail.jpg'
import segmentBreeders from '@/assets/photos/segment-breeders.jpg'
import breedersDetail from '@/assets/photos/breeders-detail.jpg'
import categoryFeed from '@/assets/photos/category-feed.jpg'
import categorySupplements from '@/assets/photos/category-supplements.jpg'
import categoryMedicines from '@/assets/photos/category-medicines.jpg'
import categoryVaccines from '@/assets/photos/category-vaccines.jpg'
import chicks from '@/assets/photos/chicks.jpg'
import peopleVet from '@/assets/photos/people-vet.jpg'
import eggs from '@/assets/photos/eggs.jpg'
import farmExterior from '@/assets/photos/farm-exterior.jpg'
import ambient from '@/assets/photos/ambient.jpg'

/*
 * Licensed documentary poultry photography registry (interim stock — replace with commissioned photography
 * before launch, spec §19 item 4). Full provenance, rejected candidates and flags: docs/image-provenance.md.
 * Contact sheet: docs/image-contact-sheet.jpg. Untouched originals: assets-src/photos/ (git-ignored).
 * focal = CSS object-position percentages (x from the left edge, y from the top), checked against 4:5, 9:16,
 * 1:1 and 16:9 cover crops. hero → heroAlt1 → heroAlt2 is the ranked hero order; heroAlt2 is the native
 * portrait frame of the hero's farm (best for the 4:5 arch window and mobile).
 */

export type PhotoCredit = {
  author: string
  authorUrl?: string
  platform: 'Unsplash' | 'Pexels' | 'Pixabay' | 'Public domain'
  sourceUrl: string
  license: string
  licenseUrl: string
}

export type Photo = {
  src: StaticImageData
  alt: { ar: string; en: string }
  focal: { x: number; y: number }
  subject: string
  credit: PhotoCredit
}

export const photos = {
  hero: {
    src: hero,
    alt: {
      ar: 'قطيع كبير من الدجاجات والديوك البيضاء داخل عنبر دواجن تجاري، مع خطوط معالف تحت إضاءة دافئة.',
      en: 'A large flock of white hens and roosters inside a commercial poultry house, with feeder lines under warm lighting.',
    },
    focal: { x: 50, y: 50 },
    subject:
      'Broiler-breeder (parent-stock) flock, hens with roosters, in a closed commercial house under warm light (USA; North Carolina-based photographer).',
    credit: {
      author: 'Mark Stebnicki',
      authorUrl: 'https://www.pexels.com/@nc-farm-bureau-mark/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/large-poultry-farm-with-numerous-chickens-35877061/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  heroAlt1: {
    src: heroAlt1,
    alt: {
      ar: 'دجاج تسمين أبيض على الفرشة داخل عنبر مفتوح الجوانب، مع معالف حمراء وخطوط شرب.',
      en: 'White broiler chickens on litter in an open-sided poultry house with red pan feeders and drinker lines.',
    },
    focal: { x: 42, y: 60 },
    subject:
      'Open-sided broiler house: white broilers on litter, red pan-feeder and nipple-drinker lines, daylight (photographer based in Maharashtra, India).',
    credit: {
      author: 'Ramdas Aswale',
      authorUrl: 'https://www.pexels.com/@ramdasaswale/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/chickens-in-a-coop-12995535/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  heroAlt2: {
    src: heroAlt2,
    alt: {
      ar: 'منظر رأسي لدجاجات وديوك بيضاء داخل عنبر دواجن تجاري تحت إضاءة دافئة.',
      en: 'Vertical view of white hens and roosters inside a commercial poultry house under warm lighting.',
    },
    focal: { x: 50, y: 55 },
    subject:
      'Native portrait frame from the same breeder house as the hero: roosters and hens, warm light (USA; North Carolina-based photographer).',
    credit: {
      author: 'Mark Stebnicki',
      authorUrl: 'https://www.pexels.com/@nc-farm-bureau-mark/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/chickens-in-a-commercial-poultry-farm-barn-35877057/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  statement: {
    src: statement,
    alt: {
      ar: 'لقطة قريبة لرأس ديك يظهر فيها العُرف والدلايات الحمراء.',
      en: 'Close-up of a rooster’s head showing its red comb and wattles.',
    },
    focal: { x: 50, y: 45 },
    subject:
      'Close-up rooster portrait, healthy red comb and wattles, warm dark background; context-neutral, not a commercial house (Kathmandu, Nepal).',
    credit: {
      author: 'Ashes Sitoula',
      authorUrl: 'https://unsplash.com/@awesome',
      platform: 'Unsplash',
      sourceUrl: 'https://unsplash.com/photos/red-and-brown-rooster-head-in-closeup-shot-KdZvvyemkPM',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
  segmentBroilers: {
    src: segmentBroilers,
    alt: {
      ar: 'دجاج تسمين أبيض على الفرشة داخل عنبر دواجن به معالف أنبوبية معلقة ومشارب جرسية.',
      en: 'White broiler chickens on litter in a poultry house with hanging tube feeders and bell drinkers.',
    },
    focal: { x: 50, y: 60 },
    subject:
      'Broiler house: white broilers on litter, yellow tube feeders and red bell drinkers, open sides (Ecuador).',
    credit: {
      author: 'DΛVΞ GΛRCIΛ',
      authorUrl: 'https://www.pexels.com/@davegarcia/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/large-chicken-farm-in-ecuador-feeding-area-32840078/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  broilersDetail: {
    src: broilersDetail,
    alt: {
      ar: 'دجاج تسمين يرتاح على الفرشة، وفي الخلفية معالف صفراء ومشارب حمراء.',
      en: 'Broiler chickens resting on litter, with yellow feeders and red drinkers in the background.',
    },
    focal: { x: 55, y: 85 },
    subject:
      'Broilers resting on litter with tube feeders and drinkers behind them; same Ecuador house as segmentBroilers.',
    credit: {
      author: 'DΛVΞ GΛRCIΛ',
      authorUrl: 'https://www.pexels.com/@davegarcia/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/free-range-chickens-in-ecuadorian-indoor-farm-32840073/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  segmentLayers: {
    src: segmentLayers,
    alt: {
      ar: 'ممر داخل عنبر دجاج بياض تظهر فيه دجاجات بنية في أقفاص متعددة الطوابق والبيض على حواف التجميع.',
      en: 'Aisle of a layer house with brown laying hens in tiered cages and eggs on the collection ledges.',
    },
    focal: { x: 50, y: 60 },
    subject:
      'Open-sided layer house: brown laying hens in tiered cages, eggs on the roll-out ledges, feed troughs (Bali, Indonesia).',
    credit: {
      author: 'Artem Beliaikin',
      authorUrl: 'https://unsplash.com/@belart84',
      platform: 'Unsplash',
      sourceUrl: 'https://unsplash.com/photos/brown-chicken-farm-BGqf-w1Nod0',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
  layersDetail: {
    src: layersDetail,
    alt: {
      ar: 'بيض أبيض على سيور التجميع داخل منشأة لإنتاج البيض.',
      en: 'White eggs moving along collection conveyors in an egg production facility.',
    },
    focal: { x: 45, y: 60 },
    subject:
      'Egg collection and sorting conveyors carrying white eggs in an egg production facility (North Carolina, USA).',
    credit: {
      author: 'Mark Stebnicki',
      authorUrl: 'https://www.pexels.com/@nc-farm-bureau-mark/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/eggs-in-warehouse-2255825/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  segmentBreeders: {
    src: segmentBreeders,
    alt: {
      ar: 'دجاجات وديوك بيضاء معًا على الفرشة داخل عنبر أمهات، ويعلوها خط معالف.',
      en: 'White hens and roosters kept together on litter in a breeder house, with a feeder line overhead.',
    },
    focal: { x: 45, y: 52 },
    subject:
      'Breeder (parent-stock) flock: roosters with hens on litter, pan-feeder line overhead, LED lighting (USA; North Carolina-based photographer).',
    credit: {
      author: 'Mark Stebnicki',
      authorUrl: 'https://www.pexels.com/@nc-farm-bureau-mark/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/industrial-chicken-farm-2253583/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  breedersDetail: {
    src: breedersDetail,
    alt: {
      ar: 'بيض في صوانٍ بلاستيكية مرصوصة على عربة معدنية داخل معمل تفريخ.',
      en: 'Eggs in plastic setter trays stacked on a metal hatchery trolley.',
    },
    focal: { x: 62, y: 50 },
    subject:
      'Hatching eggs in plastic setter trays on a hatchery trolley; links breeder flocks to the hatchery (USA; North Carolina-based photographer).',
    credit: {
      author: 'Mark Stebnicki',
      authorUrl: 'https://www.pexels.com/@nc-farm-bureau-mark/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/egg-storage-in-industrial-rack-system-35877059/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  categoryFeed: {
    src: categoryFeed,
    alt: {
      ar: 'كتاكيت تسمين صغيرة متجمعة حول صحن معلفة مملوء بالعلف.',
      en: 'Young broiler chicks gathered around a feeder pan filled with feed.',
    },
    focal: { x: 52, y: 55 },
    subject:
      'Young broiler chicks feeding from a tube-feeder pan on litter; no feed bag, brand or label in frame.',
    credit: {
      author: 'raja j',
      authorUrl: 'https://www.pexels.com/@gamerxtc/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/food-bird-dinner-animal-17064389/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  categorySupplements: {
    src: categorySupplements,
    alt: {
      ar: 'لقطة قريبة ليد تحمل مادة علفية صفراء مطحونة ناعمًا.',
      en: 'Close-up of a hand holding finely ground yellow feed material.',
    },
    focal: { x: 66, y: 42 },
    subject:
      'Hand examining finely ground yellow feed material in sunlight; neutral feed texture, no product, label or claim.',
    credit: {
      author: 'Mark Stebnicki',
      authorUrl: 'https://www.pexels.com/@nc-farm-bureau-mark/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/man-with-powder-in-hand-17765437/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  categoryMedicines: {
    src: categoryMedicines,
    alt: {
      ar: 'زجاجتان من الزجاج الكهرماني بلا ملصقات وبأغطية سوداء على سطح من الستانلس ستيل.',
      en: 'Two unlabelled amber glass bottles with black caps on a stainless steel surface.',
    },
    focal: { x: 47, y: 55 },
    subject:
      'Two unlabelled amber glass bottles on stainless steel; generic, no brand, drug name or dosage visible.',
    credit: {
      author: 'Denise Chan',
      authorUrl: 'https://unsplash.com/@elchan',
      platform: 'Unsplash',
      sourceUrl:
        'https://unsplash.com/photos/a-couple-of-brown-bottles-sitting-on-top-of-a-table-Ci1nQNQDfmA',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
  categoryVaccines: {
    src: categoryVaccines,
    alt: {
      ar: 'يد في قفاز طبي تمسك محقنة سعة 1 مل على خلفية داكنة.',
      en: 'Gloved hand holding a 1 ml syringe against a dark background.',
    },
    focal: { x: 50, y: 50 },
    subject:
      'Gloved hand holding a 1 ml syringe on black; generic studio still life, no vial, label or administration shown.',
    credit: {
      author: 'Mika Baumeister',
      authorUrl: 'https://unsplash.com/@kommumikation',
      platform: 'Unsplash',
      sourceUrl:
        'https://unsplash.com/photos/person-in-white-pants-and-white-shirt-holding-clear-glass-tube-8Qi6Yn6qDyA',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
  chicks: {
    src: chicks,
    alt: {
      ar: 'كتاكيت عمر يوم تحت دفاية التحضين، وحولها معالف ومشارب.',
      en: 'Day-old chicks under a brooder heater, surrounded by feeders and drinkers.',
    },
    focal: { x: 50, y: 60 },
    subject:
      'Day-old chicks in a commercial brooding pen under a brooder canopy with chick feeders and drinkers, warm light.',
    credit: {
      author: 'Muhammed Minhaj VP',
      authorUrl: 'https://unsplash.com/@muhd_minhaj_vp',
      platform: 'Unsplash',
      sourceUrl: 'https://unsplash.com/photos/a-bunch-of-chickens-that-are-in-a-barn-8YZOdT7CsGk',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
  peopleVet: {
    src: peopleVet,
    alt: {
      ar: 'طبيب بيطري بمعطف أبيض وكمامة يفحص جناح دجاجة يمسكها أفراد من فريق المزرعة يرتدون الكمامات وأغطية الشعر.',
      en: 'A veterinarian in a white coat and face mask examines a chicken’s wing held by farm staff wearing masks and hairnets.',
    },
    focal: { x: 45, y: 45 },
    subject:
      'Veterinary consultant examining a bird’s wing with masked, hair-netted farm staff during a farm visit (Ghana). Identifiable people.',
    credit: {
      author: 'Creab ThePolymath',
      authorUrl: 'https://unsplash.com/@cr_eab',
      platform: 'Unsplash',
      sourceUrl:
        'https://unsplash.com/photos/a-group-of-people-wearing-masks-and-holding-chickens-e83gkmG_yW8',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
  eggs: {
    src: eggs,
    alt: {
      ar: 'يد ترفع بيضة بنية من أطباق بيض كرتونية مرصوصة في مزرعة دواجن.',
      en: 'A hand lifts a brown egg from stacked pulp egg trays on a poultry farm.',
    },
    focal: { x: 55, y: 35 },
    subject:
      'Hand lifting a brown egg from stacked pulp trays on a layer farm, cages blurred behind (Ghana).',
    credit: {
      author: 'Creab ThePolymath',
      authorUrl: 'https://unsplash.com/@cr_eab',
      platform: 'Unsplash',
      sourceUrl: 'https://unsplash.com/photos/a-person-reaching-for-an-egg-in-a-carton-rY56zxvWnKs',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
  farmExterior: {
    src: farmExterior,
    alt: {
      ar: 'منظر جوي لأربعة عنابر دواجن طويلة مع صوامع علف ومراوح تهوية، تحيط بها حقول خضراء.',
      en: 'Aerial view of four long poultry houses with feed bins and ventilation fans, surrounded by green fields.',
    },
    focal: { x: 55, y: 58 },
    subject:
      'Aerial view of four tunnel-ventilated poultry houses with feed bins, daylight rather than dawn (Mooresville, North Carolina, USA).',
    credit: {
      author: 'Mark Stebnicki',
      authorUrl: 'https://www.pexels.com/@nc-farm-bureau-mark/',
      platform: 'Pexels',
      sourceUrl: 'https://www.pexels.com/photo/rural-landscape-with-a-farm-24740509/',
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    },
  },
  ambient: {
    src: ambient,
    alt: {
      ar: 'نمط من البيض البني في طبق كرتوني، مصوَّر من أعلى.',
      en: 'Top-down pattern of brown eggs in a pulp egg tray.',
    },
    focal: { x: 50, y: 50 },
    subject: 'Abstract top-down pattern of brown eggs in a pulp tray, for empty states and knowledge pages.',
    credit: {
      author: 'Peter Werkman',
      authorUrl: 'https://unsplash.com/@pwphotography',
      platform: 'Unsplash',
      sourceUrl: 'https://unsplash.com/photos/a-bunch-of-brown-eggs-in-a-carton-d6oEre5qMkQ',
      license: 'Unsplash License',
      licenseUrl: 'https://unsplash.com/license',
    },
  },
} satisfies Record<string, Photo>

export type PhotoId = keyof typeof photos
