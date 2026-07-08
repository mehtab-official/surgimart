import { prisma } from '@/lib/prisma'
import type { Product } from '@prisma/client'

export type { Product }

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      where: { isFeatured: true, isPublished: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('[Prisma] getFeaturedProducts failed:', error)
    return []
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
    const where = {
      isPublished: true,
      ...(options?.category ? { category: options.category } : {}),
    }
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])
    return { products, total }
  } catch (error) {
    console.error('[Prisma] getAllProducts failed:', error)
    return { products: [], total: 0 }
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await prisma.product.findUnique({ where: { slug } })
  } catch (error) {
    console.error('[Prisma] getProductBySlug failed:', error)
    return null
  }
}

export async function getRelatedProducts(slug: string, category?: string): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      where: {
        slug: { not: slug },
        category: category,
        isPublished: true,
      },
      take: 4,
    })
  } catch (error) {
    console.error('[Prisma] getRelatedProducts failed:', error)
    return []
  }
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } })
  } catch (error) {
    console.error('[Prisma] getCategories failed:', error)
    return []
  }
}
