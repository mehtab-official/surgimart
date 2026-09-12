export interface MedicalExpo {
  id: string
  title: string
  shortName: string
  organizer: string
  category: string
  location: {
    venue: string
    city: string
    country: string
  }
  startDate: string // ISO date format YYYY-MM-DD
  endDate: string   // ISO date format YYYY-MM-DD
  booth: string
  hall: string
  description: string
  focusAreas: string[]
  externalUrl?: string
  badgeText?: string
  image?: string
}

export const GLOBAL_EXPOS_DATA: MedicalExpo[] = [
  {
    id: 'health-asia-karachi-2026',
    title: 'Health Asia International Exhibition & Conferences 2026',
    shortName: 'Health Asia Karachi',
    organizer: 'Ecommerce Gateway Pakistan (Pvt) Ltd',
    category: 'Pakistan’s Largest International Medical & Surgical Trade Fair',
    image: '/images/image3.jpeg',
    location: {
      venue: 'Karachi Expo Centre, University Road',
      city: 'Karachi',
      country: 'Pakistan'
    },
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    booth: 'Hall 2 — Stand B-14',
    hall: 'Hall 2 (Surgical & Pharma)',
    description: 'Pakistan’s premier international healthcare event certified by UFI (Paris). SubMedOrtho showcases export-grade orthopedic implants, tungsten carbide needle holders, and precision surgical sets directly manufactured in Sialkot.',
    focusAreas: ['Orthopedic Implants', 'Surgical Instrument Sets', 'Hospital Tenders', 'OEM Export Partnerships'],
    externalUrl: 'https://health-asia.com'
  },
  {
    id: 'cmef-shanghai-2026',
    title: 'CMEF Autumn 2026 — China International Medical Equipment Fair',
    shortName: 'CMEF Shanghai',
    organizer: 'Reed Sinopharm Exhibitions',
    category: 'Asia-Pacific’s Premier Medical Device & Manufacturing Fair',
    image: '/images/quality-step-01-cad.jpg',
    location: {
      venue: 'National Exhibition and Convention Center (NECC)',
      city: 'Shanghai',
      country: 'China'
    },
    startDate: '2026-11-20',
    endDate: '2026-11-23',
    booth: 'Booth 6.1-K32',
    hall: 'Hall 6.1 (Surgery & Orthopedics)',
    description: 'The world-renowned CMEF platform connects global healthcare leaders and medical device distributors across Asia. Explore SubMedOrtho’s titanium trauma systems, bone plates, and custom OEM manufacturing.',
    focusAreas: ['Trauma Plating Systems', 'Precision Surgical Tools', 'Asian Medical Distribution', 'Contract Manufacturing'],
    externalUrl: 'https://www.cmef.com.cn'
  },
  {
    id: 'medhealth-lahore-2027',
    title: 'Health Asia & Pharma Asia International Expo 2027',
    shortName: 'Health Asia Lahore',
    organizer: 'Ecommerce Gateway Pakistan',
    category: 'Punjab Healthcare & Surgical Technology Convention',
    image: '/images/custom-surgical-kit.jpg',
    location: {
      venue: 'Expo Centre Lahore, Johar Town',
      city: 'Lahore',
      country: 'Pakistan'
    },
    startDate: '2027-04-08',
    endDate: '2027-04-10',
    booth: 'Stand A-22',
    hall: 'Hall 1',
    description: 'The regional powerhouse healthcare trade exhibition in Punjab. Meet SubMedOrtho engineering heads to evaluate hospital distributor agreements, custom laser engraving, and certified sterilization instrument kits.',
    focusAreas: ['Hospital Procurement', 'Micro-Surgery Instruments', 'Distributor Contracts', 'Sterilization Cassettes'],
    externalUrl: 'https://health-asia.com'
  },
  {
    id: 'canton-fair-guangzhou-2027',
    title: 'Canton Fair 2027 — Medical Devices & Health Products',
    shortName: 'Canton Fair Guangzhou',
    organizer: 'China Foreign Trade Centre (CFTC)',
    category: 'China Import & Export Fair (Medical Pavilion)',
    image: '/images/surgical-instruments-blue.jpg',
    location: {
      venue: 'Canton Fair Complex (Pazhou), Haizhu District',
      city: 'Guangzhou',
      country: 'China'
    },
    startDate: '2027-05-01',
    endDate: '2027-05-05',
    booth: 'Booth 10.2D18',
    hall: 'Hall 10.2 (Health & Medical Products)',
    description: 'The historic and most influential trade fair in China. SubMedOrtho welcomes international delegations to examine our ISO 13485 surgical grade scissors, laparoscopic instruments, and orthopedic implants.',
    focusAreas: ['Global Supply Chain', 'Laparoscopic Instruments', 'Private Labeling', 'ISO 13485 Certified Instruments'],
    externalUrl: 'https://www.cantonfair.org.cn'
  }
]
