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
    id: 'medica-2026',
    title: 'MEDICA 2026 — Leading International Trade Fair',
    shortName: 'MEDICA Germany',
    organizer: 'Messe Düsseldorf',
    category: 'World Forum for Medicine & Surgical Tech',
    image: '/images/custom-surgical-kit.jpg',
    location: {
      venue: 'Messe Düsseldorf Exhibition Centre',
      city: 'Düsseldorf',
      country: 'Germany'
    },
    startDate: '2026-11-16',
    endDate: '2026-11-19',
    booth: 'Stand B42',
    hall: 'Hall 10',
    description: 'The world’s largest gathering for medical technology and hospital supply. SubMedOrtho showcases precision tungsten carbide needle holders, double action bone rongeurs, and titanium orthopedic plating systems.',
    focusAreas: ['Surgical Instruments', 'Orthopedic Implants', 'Hospital Procurement', 'OEM Manufacturing'],
    externalUrl: 'https://www.medica-tradefair.com'
  },
  {
    id: 'whx-dubai-2027',
    title: 'World Health Expo 2027 (Formerly Arab Health)',
    shortName: 'WHX Dubai 2027',
    organizer: 'Informa Markets Healthcare',
    category: 'Middle East & Global Healthcare Exhibition',
    image: '/images/implants-trauma-plates.jpg',
    location: {
      venue: 'Dubai World Trade Centre & DEC',
      city: 'Dubai',
      country: 'United Arab Emirates'
    },
    startDate: '2027-01-25',
    endDate: '2027-01-28',
    booth: 'Booth Z2.B19',
    hall: 'Za’abeel Hall 2',
    description: 'The premier healthcare exhibition in the MENA region. Connect directly with SubMedOrtho directors for bulk hospital distributor contracts, custom laser branding, and international trade terms.',
    focusAreas: ['Middle East Distribution', 'General Surgery Sets', 'ENT Microsurgery', 'ISO 13485 Compliance'],
    externalUrl: 'https://www.worldhealthexpo.com'
  },
  {
    id: 'ids-cologne-2027',
    title: 'IDS 2027 — International Dental Show',
    shortName: 'IDS Cologne',
    organizer: 'Koelnmesse & GFDI',
    category: 'World’s Leading Dental & Oral Surgery Fair',
    image: '/images/surgical-instruments-blue.jpg',
    location: {
      venue: 'Koelnmesse Fairgrounds',
      city: 'Cologne',
      country: 'Germany'
    },
    startDate: '2027-03-16',
    endDate: '2027-03-20',
    booth: 'Stand C-018',
    hall: 'Hall 11.2',
    description: 'Biennial international trade fair showcasing cutting-edge dental extraction forceps, periodontal curettes, and micro-suture instrument kits manufactured in Sialkot.',
    focusAreas: ['Dental Surgery', 'Extraction Forceps', 'Periodontal Instruments', 'Sterilization Cassettes'],
    externalUrl: 'https://www.ids-cologne.de'
  },
  {
    id: 'expomed-eurasia-2027',
    title: 'Expomed Eurasia 2027',
    shortName: 'Expomed Istanbul',
    organizer: 'Tüyap Fairs and Exhibitions',
    category: 'Eurasian Medical & Hospital Equipment Trade Fair',
    image: '/images/custom-titanium-tools.jpg',
    location: {
      venue: 'Tüyap Fair & Congress Center',
      city: 'Istanbul',
      country: 'Turkey'
    },
    startDate: '2027-04-15',
    endDate: '2027-04-18',
    booth: 'Stand 312',
    hall: 'Hall 3',
    description: 'The leading gateway into Central Asian and Eastern European medical markets. Demonstrations of surgical retractor systems, bone holding forceps, and orthopedic trauma kits.',
    focusAreas: ['Eurasian Supply Chains', 'Orthopedic Trauma', 'Tender Procurement', 'Hospital Tenders'],
    externalUrl: 'https://www.expomedistanbul.com'
  },
  {
    id: 'fime-miami-2027',
    title: 'FIME 2027 (WHX Americas)',
    shortName: 'FIME Miami',
    organizer: 'Informa Markets Healthcare',
    category: 'Americas Leading Medical Trade Show',
    image: '/images/implants-joint-replacement.jpg',
    location: {
      venue: 'Miami Beach Convention Center',
      city: 'Miami, Florida',
      country: 'United States'
    },
    startDate: '2027-06-16',
    endDate: '2027-06-18',
    booth: 'Booth J-45',
    hall: 'Main Exhibition Hall',
    description: 'Connecting with distributors across North America, Latin America, and the Caribbean. Explore custom OEM partnerships and US FDA compliant surgical instruments.',
    focusAreas: ['North & Latin America', 'FDA Regulatory Support', 'Private Labeling', 'Trauma Systems'],
    externalUrl: 'https://www.fimeshow.com'
  }
]
