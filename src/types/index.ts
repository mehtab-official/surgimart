// src/types/index.ts — Single source of truth for all types

// ■■ Product ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export interface ProductImage {
  url: string
  alt?: string
}

export interface BulkPricingTier {
  minQty: number
  price: number
  label: string
}

export interface ProductSpec {
  key: string
  value: string
}

export interface Review {
  id: string
  rating: number
  title: string
  body: string
  customerName: string
  country: string
  verified: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  price: number
  comparePrice?: number | null
  images: string[]
  category: string
  subCategory?: string | null
  inStock: boolean
  stockCount: number
  sku?: string | null
  specs?: import('@prisma/client/runtime/library').JsonValue | null
  bulkPricing?: import('@prisma/client/runtime/library').JsonValue | null
  isFeatured: boolean
  isPublished: boolean
  badge?: string | null
  moq?: number | null
  specifications?: ProductSpec[]
  reviews?: Review[]
  rating: number
  reviewCount: number
  oldPrice?: number // For backward compatibility with UI
  convertedPrice?: number
}

// ■■ Cart ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  qty: number
  slug: string
  category: string
}

// ■■ Wishlist ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

// ■■ Checkout ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export interface ShippingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  city: string
  country: string
  postalCode?: string
}

export interface OrderResult {
  orderNumber: string
  status: string
  total?: number
  estimatedDelivery?: string
}

// ■■ Order (from DB) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'failed'

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  total: number
  items: CartItem[]
  shippingData: ShippingData
  trackingNumber?: string
  createdAt: string
  updatedAt: string
}

// ■■ Algolia ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export interface AlgoliaResult {
  objectID: string
  name: string
  slug: string
  price: number
  category: string
  image?: string
  inStock: boolean
  badge?: string
  rating: number
}

// ■■ Blog ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: ProductImage
  category: string
  publishedAt: string
  readTime?: number
  body?: unknown
}

// ■■ API request/response ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
export interface ApiError {
  error: string
  details?: unknown
}

export interface QuoteRequest {
  productId: string
  productName: string
  qty: number
  name: string
  email: string
  organization?: string
  country: string
  message?: string
}

export interface WholesaleApplication {
  firstName: string
  lastName: string
  email: string
  phone?: string
  organization: string
  country: string
  monthlyVolume: string
  categories: string[]
  message?: string
}

// ■■ Next.js augmentation for NextAuth ■■■■■■■■■■■■■■■■■■■■■■■■
declare module 'next-auth' {
  interface Session {
    user: { id: string; role: string; name?: string; email?: string; image?: string }
  }
}

// ■■ Landing Page Showcase & Video Item Types ■■■■■■■■■■■■■■■■
export interface ShowcaseItem {
  id: string
  title: string
  category: string
  badge: string
  compliance: string
  subtitle: string
  description: string
  image: string
  videoUrl?: string
  mediaType?: 'image' | 'video'
  aspectRatio: string
  specs: string[]
}

export const DEFAULT_SHOWCASE_SLIDES: ShowcaseItem[] = [
  {
    id: 'precision-surgical-tray',
    title: 'Operating Room Precision Surgical Trays & Forceps',
    category: 'General & Thoracic Surgery',
    badge: 'Premier Export Line',
    compliance: 'ISO 13485:2016 & CE',
    subtitle: 'High-Polish Surgical Dissection & Clamping Instruments',
    description: 'High-definition laser passivated hemostatic forceps, Mayo dissection scissors, and fine tissue needle holders arranged in surgical stainless containment trays.',
    image: '/images/products-hero-1.jpg',
    mediaType: 'image',
    aspectRatio: 'aspect-[3/2]',
    specs: ['German AISI 410/420 Stainless Steel', '100% Passivation Tested', 'Atraumatic Jaws & Box-Joints', 'Autoclavable to 134°C']
  },
  {
    id: 'orthopedic-trauma-implants',
    title: 'Titanium Orthopedic Trauma Plates & Fixation Screws',
    category: 'Orthopedic & Trauma Surgery',
    badge: 'Titanium & 316L VM',
    compliance: 'ISO 9001 & 13485',
    subtitle: 'Anodized Color-Coded Locking Bone Compression Systems',
    description: 'Anatomically contoured locking distal radius, femoral and reconstruction plates with titanium locking cortical screws and precision insertion drivers.',
    image: '/images/products-hero-2.jpg',
    mediaType: 'image',
    aspectRatio: 'aspect-[3/2]',
    specs: ['Pure Titanium Grade 5 & 316L VM', 'Multi-Axis Locking Combi-Holes', 'Color-Anodized Diameter Identifiers', 'Low-Profile Anatomical Contour']
  },
  {
    id: 'surgical-craftsmanship',
    title: 'Operating Theater Precision Craftsmanship',
    category: 'General & Microsurgery',
    badge: 'Sialkot Traditional Craftsmanship',
    compliance: 'ISO 13485:2016',
    subtitle: 'Direct Hospital & Distributor Supply',
    description: 'Master hand-finished surgical instruments crafted by generational artisans in Sialkot, Pakistan. Engineered with tight tolerance passivated German stainless steel.',
    image: '/images/image5.jpg',
    mediaType: 'image',
    aspectRatio: 'aspect-[4/3]',
    specs: ['AISI 410/420 Martensitic Steel', 'Tungsten Carbide Inlays', 'Anti-Glare Satin Finish', 'Autoclavable to 134°C']
  },
  {
    id: 'laparoscopic',
    title: 'Laparoscopic & Trocar Forceps Systems',
    category: 'Minimally Invasive Surgery',
    badge: 'Laparoscopic Specialty',
    compliance: 'CE Certified',
    subtitle: 'High Precision Rotatable Instruments',
    description: 'Ergonomic 360° rotational handles, insulated shafts, detachable modular jaw mechanisms, and precise monopolar/bipolar electrosurgical compatibility.',
    image: '/images/image2.jpeg',
    mediaType: 'image',
    aspectRatio: 'aspect-[16/10]',
    specs: ['360° Shaft Rotation', 'Electrosurgical Insulation', 'Quick Disassembly Ports', 'Diamond-Grip Ratchets']
  },
  {
    id: 'orthopedic-trauma',
    title: 'Distal Femoral & Orthopedic Trauma Sets',
    category: 'Orthopedic & Bone Fixation',
    badge: 'Trauma & Bone Fixation',
    compliance: 'ISO 9001 & 13485',
    subtitle: 'Complete Intramedullary Nailing Instruments',
    description: 'Targeting guides, flexible reamers, locking screws, and extraction wrenches organized in custom anodized aluminum sterilization containment trays.',
    image: '/images/image3.jpeg',
    mediaType: 'image',
    aspectRatio: 'aspect-[4/3]',
    specs: ['Titanium Grade 5 & 316L VM', 'Anodized Sterilization Cases', 'Calibrated Depth Gauges', 'Double-Action Rongeurs']
  },
  {
    id: 'medical-dental',
    title: 'Medical, Dental & Minor Surgical Supplies',
    category: 'Dental & Minor Procedures',
    badge: 'Dental & Minor Specialty',
    compliance: 'Class I & IIa Medical',
    subtitle: 'Precision Probes, Scalers & Forceps',
    description: 'Comprehensive line of dental extractors, root tip elevators, periodontal probes, and minor suture kits made for dental clinics and outpatient centers.',
    image: '/images/image4-clean.png',
    mediaType: 'image',
    aspectRatio: 'aspect-[16/9]',
    specs: ['Ultrasonic Bath Safe', 'Non-Slip Knurled Grips', 'Corrosion-Resistant Passivation', 'Custom Laser Etched']
  }
]

// ■■ Featured Products Section Types & Defaults ■■■■■■■■■■■■■■■■
export interface FeaturedProductItem {
  id: string
  title: string
  category: string
  description: string
  tag: string
  image: string
  videoUrl?: string
  specs: string[]
}

export const DEFAULT_FEATURED_PRODUCTS: FeaturedProductItem[] = [
  {
    id: 'fp-1',
    title: 'Surgical Hemostatic Artery Forceps',
    category: 'General Surgery',
    description: 'Precision box-joint locking mechanism with fine serrated jaws for atraumatic vessel occlusion. German AISI 410 grade.',
    tag: 'Hot Selling',
    image: '/images/products-hero-1.jpg',
    videoUrl: '',
    specs: ['Available straight & curved', 'Sizes: 12.5cm – 20cm', 'Autoclave resistant']
  },
  {
    id: 'fp-2',
    title: 'Double Action Bone Rongeurs',
    category: 'Orthopaedics',
    description: 'Engineered compound action for maximum cutting force with minimal surgeon hand fatigue during bone re-sectioning.',
    tag: 'Export Bestseller',
    image: '/images/products-hero-2.jpg',
    videoUrl: '',
    specs: ['Compound double action', 'Titanium coated jaws', 'Curved & straight tips']
  },
  {
    id: 'fp-3',
    title: 'Locking Distal Radius & 3.5mm Plates',
    category: 'Implants & Fixation',
    description: 'Anatomically contoured locking compression plates with combi-holes for variable angle locking screws in trauma surgery.',
    tag: 'High Demand',
    image: '/images/products-hero-2.jpg',
    videoUrl: '',
    specs: ['Pure Titanium & 316L VM', 'Low-profile design', 'Anatomical pre-contour']
  },
  {
    id: 'fp-4',
    title: 'Self-Retaining Surgical Retractor Systems',
    category: 'General & Neuro',
    description: 'Adjustable multi-blade surgical retractors designed for clean, unobstructed surgical field exposure.',
    tag: 'Hospital Choice',
    image: '/images/products-hero-1.jpg',
    videoUrl: '',
    specs: ['Interchangeable blades', 'Ratchet locking lock', 'Matte satin anti-glare finish']
  }
]


