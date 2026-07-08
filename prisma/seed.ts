import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Test123!', 10)
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10)

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@surgimart.com' },
    update: {},
    create: {
      email: 'admin@surgimart.com',
      name: 'SurgiMart Admin',
      role: 'admin',
      passwordHash: adminPasswordHash,
    },
  })
  console.log('Seeded admin user:', admin.email)

  // Seed Buyer
  const user = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: {
      email: 'buyer@test.com',
      name: 'Test Buyer',
      role: 'buyer',
      passwordHash: passwordHash,
    },
  })
  console.log('Seeded buyer user:', user.email)

  // Seed Categories
  const categories = [
    { name: 'Surgical', slug: 'surgical', icon: 'Scissors', description: 'General surgical instruments' },
    { name: 'Dental', slug: 'dental', icon: 'Stethoscope', description: 'Professional dental tools' },
    { name: 'Orthopedic', slug: 'orthopedic', icon: 'Bone', description: 'Bone and joint surgery tools' },
    { name: 'Ophthalmology', slug: 'ophthalmology', icon: 'Eye', description: 'Eye surgery instruments' },
    { name: 'ENT', slug: 'ent', icon: 'Ear', description: 'Ear, Nose, and Throat tools' },
    { name: 'Cardiovascular', slug: 'cardiovascular', icon: 'Heart', description: 'Heart and vessel surgery tools' },
    { name: 'Veterinary', slug: 'veterinary', icon: 'Syringe', description: 'Animal surgery instruments' },
    { name: 'Obstetric', slug: 'obstetric', icon: 'Baby', description: 'Maternity and childbirth tools' },
    { name: 'Hospital Furniture', slug: 'hospital-furniture', icon: 'Bed', description: 'Clinical furniture' },
    { name: 'Diagnostic', slug: 'diagnostic', icon: 'Search', description: 'Diagnostic equipment' },
    { name: 'Laboratory', slug: 'laboratory', icon: 'FlaskConical', description: 'Lab equipment' },
    { name: 'Sterilization', slug: 'sterilization', icon: 'Zap', description: 'Sterilization equipment' },
    { name: 'Disposable', slug: 'disposable', icon: 'Trash2', description: 'Single-use items' },
    { name: 'Emergency', slug: 'emergency', icon: 'Ambulance', description: 'Emergency medical tools' },
    { name: 'Physiotherapy', slug: 'physiotherapy', icon: 'Activity', description: 'Rehabilitation tools' },
    { name: 'Pediatric', slug: 'pediatric', icon: 'Smile', description: 'Pediatric instruments' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log('Seeded 16 categories')

  // Seed Products
  const products = [
    {
      name: 'Surgical Scalpel Set',
      slug: 'surgical-scalpel-set',
      description: 'Professional grade stainless steel scalpels with 10 replaceable blades.',
      price: 45.0,
      category: 'Surgical',
      images: ['/uploads/products/Forceps.png'],
      stockCount: 100,
      isFeatured: true,
      sku: 'SRG-001',
      rating: 4.8,
      reviewCount: 124,
      badge: 'Best Seller',
    },
    {
      name: 'Forceps Set',
      slug: 'forceps-set',
      description: 'High-precision surgical forceps for delicate procedures.',
      price: 85.0,
      category: 'Surgical',
      images: ['/uploads/products/Forceps.png'],
      stockCount: 50,
      isFeatured: true,
      sku: 'SRG-002',
      rating: 4.5,
      reviewCount: 45,
    },
    {
      name: 'Surgical Scissors',
      slug: 'surgical-scissors',
      description: 'Tungsten carbide tipped Metzenbaum scissors for soft tissue dissection.',
      price: 65.0,
      category: 'Surgical',
      images: ['/uploads/products/Forceps.png'],
      stockCount: 75,
      isFeatured: true,
      sku: 'SRG-003',
      rating: 4.9,
      reviewCount: 89,
      badge: 'Premium',
    },
    {
      name: 'Retractor Set',
      slug: 'retractor-set',
      description: 'Self-retaining retractors for abdominal surgery.',
      price: 150.0,
      category: 'Surgical',
      images: ['/uploads/products/Forceps.png'],
      stockCount: 30,
      isFeatured: true,
      sku: 'SRG-004',
      rating: 4.7,
      reviewCount: 22,
    },
    {
      name: 'Needle Holder',
      slug: 'needle-holder',
      description: 'Mayo-Hegar needle holder with gold handle (tungsten carbide inserts).',
      price: 120.0,
      category: 'Surgical',
      images: ['/uploads/products/Forceps.png'],
      stockCount: 40,
      isFeatured: false,
      sku: 'SRG-005',
      rating: 4.6,
      reviewCount: 15,
    },
    {
      name: 'Bone Saw',
      slug: 'bone-saw',
      description: 'Electric surgical bone saw for orthopedic procedures.',
      price: 450.0,
      category: 'Orthopedic',
      images: ['/uploads/products/orthopedic.png'],
      stockCount: 15,
      isFeatured: false,
      sku: 'SRG-006',
      rating: 4.4,
      reviewCount: 8,
    },
    {
      name: 'Dental Mirror Set',
      slug: 'dental-mirror-set',
      description: 'Set of 5 premium rhodium coated front surface mirrors.',
      price: 35.0,
      category: 'Dental',
      images: ['/uploads/products/Dental.png'],
      stockCount: 200,
      isFeatured: false,
      sku: 'SRG-007',
      rating: 4.2,
      reviewCount: 56,
    },
    {
      name: 'Orthopedic Drill',
      slug: 'orthopedic-drill',
      description: 'Cannulated bone drill for trauma surgery.',
      price: 850.0,
      category: 'Orthopedic',
      images: ['/uploads/products/orthopedic.png'],
      stockCount: 10,
      isFeatured: false,
      sku: 'SRG-008',
      rating: 4.3,
      reviewCount: 4,
    },
    {
      name: 'Laryngoscope',
      slug: 'laryngoscope',
      description: 'Fiber-optic laryngoscope set with 4 Macintosh blades.',
      price: 220.0,
      category: 'ENT',
      images: ['/uploads/products/ENT.png'],
      stockCount: 25,
      isFeatured: false,
      sku: 'SRG-009',
      rating: 4.7,
      reviewCount: 12,
    },
    {
      name: 'Surgical Gloves (bulk)',
      slug: 'surgical-gloves-bulk',
      description: 'Powder-free sterile latex surgical gloves, case of 200 pairs.',
      price: 350.0,
      category: 'Disposable',
      images: ['/uploads/products/Veterinary.png'],
      stockCount: 50,
      isFeatured: false,
      sku: 'SRG-010',
      bulkPricing: { tiers: [{ min: 5, price: 320 }, { min: 10, price: 290 }] },
      rating: 4.9,
      reviewCount: 210,
      badge: 'Wholesale',
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }
  console.log('Seeded 10 products')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
