import type { Product } from '@/types'

export type { Product }

// B2B Export Showcase products across all main categories
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Surgical Hemostatic Kelly Forceps 14cm',
    slug: 'surgical-kelly-forceps-14cm',
    description: 'Precision box-joint locking mechanism with fine serrated jaws for atraumatic vessel clamping. German AISI 410 grade stainless steel.',
    category: 'General Surgery',
    price: 18.5,
    oldPrice: 24.0,
    images: ['/uploads/products/Forceps.png'],
    sku: 'SM-FC-140',
    inStock: true,
    stockCount: 500,
    rating: 4.9,
    reviewCount: 38,
    isPublished: true,
    isFeatured: true,
    moq: 10,
    specifications: [
      { key: 'Material', value: 'AISI 410 German Stainless Steel' },
      { key: 'Overall Length', value: '14 cm (5.5 inches)' },
      { key: 'Jaw Type', value: 'Straight / Curved Serrated' },
      { key: 'Sterilization', value: 'Autoclavable / ETO / Steam' },
      { key: 'Origin', value: 'Sialkot, Pakistan' },
    ],
    reviews: [
      {
        id: 'r1',
        rating: 5,
        title: 'Superb precision box joint',
        body: 'Smooth action with zero lateral play. Exceptional quality for general surgery hospital sets.',
        customerName: 'Dr. Marcus Vance',
        country: 'United Kingdom',
        verified: true,
        createdAt: '2026-02-14',
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Double Action Stille-Luer Bone Rongeur',
    slug: 'double-action-bone-rongeur',
    description: 'Engineered compound action for maximum cutting force with minimal surgeon hand fatigue during orthopedic trauma procedures.',
    category: 'Orthopaedic',
    price: 75.0,
    oldPrice: 95.0,
    images: ['/uploads/products/orthopedic.png'],
    sku: 'SM-OR-BR01',
    inStock: true,
    stockCount: 250,
    rating: 5.0,
    reviewCount: 24,
    isPublished: true,
    isFeatured: true,
    moq: 5,
    specifications: [
      { key: 'Material', value: 'High Carbon Stainless Steel' },
      { key: 'Action Type', value: 'Compound Double Action' },
      { key: 'Bite Size', value: '4 mm Curved Cup Jaws' },
      { key: 'Finish', value: 'Anti-Glare Satin Finish' },
    ],
    reviews: []
  },
  {
    id: 'prod-3',
    name: 'Locking Distal Radius Plate System (Titanium)',
    slug: 'locking-distal-radius-plate',
    description: 'Anatomically contoured locking compression plates with combi-holes for variable angle locking screws in wrist trauma reconstruction.',
    category: 'Implants',
    price: 120.0,
    oldPrice: 150.0,
    images: ['/uploads/products/orthopedic.png'],
    sku: 'SM-IMP-RP01',
    inStock: true,
    stockCount: 300,
    rating: 4.8,
    reviewCount: 19,
    isPublished: true,
    isFeatured: true,
    moq: 5,
    specifications: [
      { key: 'Material', value: 'Medical Grade Pure Titanium (Gr 4)' },
      { key: 'Thickness', value: '2.0 mm Low Profile' },
      { key: 'Screw Compatibility', value: '2.4mm / 2.7mm Locking Screws' },
      { key: 'Compliance', value: 'ISO 13485:2016 & CE Certified' },
    ],
    reviews: []
  },
  {
    id: 'prod-4',
    name: 'Hartmann Micro Ear Forceps & Suction Set',
    slug: 'hartmann-micro-ear-forceps',
    description: 'Delicate 8.5cm shaft micro forceps designed for precision middle ear exploration and tympanoplasty.',
    category: 'ENT',
    price: 45.0,
    oldPrice: 58.0,
    images: ['/uploads/products/ENT.png'],
    sku: 'SM-ENT-HF02',
    inStock: true,
    stockCount: 400,
    rating: 4.9,
    reviewCount: 29,
    isPublished: true,
    isFeatured: true,
    moq: 10,
    specifications: [
      { key: 'Material', value: 'Surgical Stainless Steel' },
      { key: 'Working Length', value: '8.5 cm' },
      { key: 'Jaw Dimensions', value: '0.8 mm x 4.0 mm Serrated' },
    ],
    reviews: []
  },
  {
    id: 'prod-5',
    name: 'Weitlaner Self-Retaining Retractor 3x4 Teeth',
    slug: 'weitlaner-retractor-3x4',
    description: 'Blunt & sharp prongs with ratchet cam lock for steady, non-glare exposure during spinal and deep tissue operations.',
    category: 'Neuro/Spinal',
    price: 58.0,
    oldPrice: 72.0,
    images: ['/uploads/products/Forceps.png'],
    sku: 'SM-NS-WR01',
    inStock: true,
    stockCount: 200,
    rating: 5.0,
    reviewCount: 15,
    isPublished: true,
    isFeatured: true,
    moq: 5,
    specifications: [
      { key: 'Prong Configuration', value: '3 x 4 Sharp / Blunt Interlocking' },
      { key: 'Locking Mechanism', value: 'Positive Cam Action Ratchet' },
      { key: 'Length', value: '16.5 cm' },
    ],
    reviews: []
  },
  {
    id: 'prod-6',
    name: 'Mayo Hegar Needle Holder with TC Jaws',
    slug: 'mayo-hegar-needle-holder-tc',
    description: 'Gold-ring tungsten carbide cross-serrated inserts for firm needle grip without slippage or suture shearing.',
    category: 'General Surgery',
    price: 32.0,
    oldPrice: 42.0,
    images: ['/uploads/products/Forceps.png'],
    sku: 'SM-GS-NH05',
    inStock: true,
    stockCount: 600,
    rating: 4.9,
    reviewCount: 42,
    isPublished: true,
    isFeatured: true,
    moq: 15,
    specifications: [
      { key: 'Inserts', value: 'Tungsten Carbide (0.4mm pitch)' },
      { key: 'Handle', value: 'Gold Plated Ring Handles' },
      { key: 'Sizes Available', value: '14cm, 16cm, 18cm, 20cm' },
    ],
    reviews: []
  },
  {
    id: 'prod-7',
    name: 'Dental Extraction Forceps Set (English Pattern)',
    slug: 'dental-extraction-forceps-set',
    description: 'Precision forged dental extraction instruments with cross-hatch grip for upper & lower root extraction.',
    category: 'Dental',
    price: 48.0,
    oldPrice: 65.0,
    images: ['/uploads/products/Dental.png'],
    sku: 'SM-DN-EF07',
    inStock: true,
    stockCount: 350,
    rating: 4.9,
    reviewCount: 18,
    isPublished: true,
    isFeatured: true,
    moq: 5,
    specifications: [
      { key: 'Pattern', value: 'English Anatomical Pattern' },
      { key: 'Material', value: 'Medical Stainless Steel' },
    ],
    reviews: []
  },
  {
    id: 'prod-8',
    name: 'Veterinary Orthopedic Bone Holding Forceps',
    slug: 'veterinary-bone-holding-forceps',
    description: 'Self-centering ratchet locking bone clamp for veterinary fracture reduction and bone plating.',
    category: 'Veterinary',
    price: 52.0,
    oldPrice: 70.0,
    images: ['/uploads/products/Veterinary.png'],
    sku: 'SM-VT-BF08',
    inStock: true,
    stockCount: 220,
    rating: 4.8,
    reviewCount: 12,
    isPublished: true,
    isFeatured: true,
    moq: 5,
    specifications: [
      { key: 'Material', value: 'AISI 420 Grade' },
      { key: 'Feature', value: 'Self-Centering Speed Lock' },
    ],
    reviews: []
  },
  {
    id: 'prod-9',
    name: 'Castroviejo Micro Needle Holder (Ophthalmic)',
    slug: 'castroviejo-micro-needle-holder',
    description: 'Ultra-fine curved tips with spring action and catch lock for 7-0 to 10-0 microsurgical sutures.',
    category: 'Ophthalmology',
    price: 65.0,
    oldPrice: 85.0,
    images: ['/uploads/products/opthalmoogy.png'],
    sku: 'SM-OPH-CN09',
    inStock: true,
    stockCount: 180,
    rating: 5.0,
    reviewCount: 21,
    isPublished: true,
    isFeatured: true,
    moq: 5,
    specifications: [
      { key: 'Tips', value: '0.6mm Micro Straight / Curved' },
      { key: 'Tungsten Carbide', value: 'Yes, 0.4mm Cross-Serrated' },
    ],
    reviews: []
  }
]

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const dbProds = await prisma.product.findMany({
      where: { isFeatured: true, isPublished: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    })
    if (dbProds && dbProds.length > 0) {
      return dbProds.map(mapDbProduct)
    }
    return FALLBACK_PRODUCTS
  } catch (error) {
    return FALLBACK_PRODUCTS
  }
}

export async function getAllProducts(options?: {
  page?: number
  limit?: number
  category?: string
}): Promise<{ products: Product[]; total: number }> {
  const page = options?.page ?? 1
  const limit = options?.limit ?? 48
  const skip = (page - 1) * limit

  try {
    const { prisma } = await import('@/lib/prisma')
    const where = {
      isPublished: true,
      ...(options?.category ? { category: options.category } : {}),
    }
    const [dbProds, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])
    if (dbProds && dbProds.length > 0) {
      return { products: dbProds.map(mapDbProduct), total }
    }
    return filterFallback(options?.category)
  } catch (error) {
    return filterFallback(options?.category)
  }
}

function mapDbProduct(p: any): Product {
  const stock = typeof p.stock === 'number' ? p.stock : 100
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    oldPrice: p.comparePrice,
    images: p.images && p.images.length > 0 ? p.images : ['/uploads/products/Forceps.png'],
    category: p.category,
    inStock: stock > 0,
    stockCount: stock > 0 ? stock : 150,
    sku: p.sku,
    rating: p.rating || 5.0,
    reviewCount: p.ratingCount || 12,
    isFeatured: p.isFeatured ?? true,
    isPublished: p.isPublished ?? true,
    moq: p.minOrderQty || 5,
    specifications: [
      { key: 'Material', value: 'AISI 410 / 420 Stainless Steel' },
      { key: 'Standard', value: 'ISO 9001:2015 & ISO 13485:2016' },
      { key: 'Origin', value: 'Sialkot, Pakistan' },
    ],
    reviews: []
  }
}

function normalizeCategory(cat: string): string {
  const c = cat.toLowerCase().replace(/[-_\s]/g, '')
  if (c.includes('general') || c.includes('surg')) return 'surgical'
  if (c.includes('ortho')) return 'orthopedic'
  if (c.includes('dent')) return 'dental'
  if (c.includes('vet')) return 'veterinary'
  if (c.includes('ent')) return 'ent'
  if (c.includes('neuro') || c.includes('spin')) return 'neuro-spinal'
  if (c.includes('implant') || c.includes('plat')) return 'implants'
  if (c.includes('ophth')) return 'ophthalmology'
  return c
}

function filterFallback(category?: string): { products: Product[]; total: number } {
  let list = FALLBACK_PRODUCTS
  if (category && category.toLowerCase() !== 'all') {
    const target = normalizeCategory(category)
    list = list.filter(p => normalizeCategory(p.category) === target)
    // If no exact category match, return full list so empty screen is not shown
    if (list.length === 0) list = FALLBACK_PRODUCTS
  }
  return { products: list, total: list.length }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const prod = await prisma.product.findUnique({ where: { slug } })
    if (prod) return mapDbProduct(prod)
    return FALLBACK_PRODUCTS.find(p => p.slug === slug) || null
  } catch (error) {
    return FALLBACK_PRODUCTS.find(p => p.slug === slug) || null
  }
}

export async function getRelatedProducts(slug: string, category?: string): Promise<Product[]> {
  try {
    const { prisma } = await import('@/lib/prisma')
    const dbProds = await prisma.product.findMany({
      where: {
        isPublished: true,
        category: category || undefined,
        NOT: { slug },
      },
      take: 4,
    })
    if (dbProds && dbProds.length > 0) return dbProds.map(mapDbProduct)
    return FALLBACK_PRODUCTS.filter(p => p.slug !== slug).slice(0, 4)
  } catch (error) {
    return FALLBACK_PRODUCTS.filter(p => p.slug !== slug).slice(0, 4)
  }
}

export { DEFAULT_SHOWCASE_SLIDES } from '@/types'
export type { ShowcaseItem } from '@/types'


