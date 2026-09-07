import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { FALLBACK_PRODUCTS } from '@/lib/products'

export interface ListProductsAdminParams {
  query?: string
  category?: string
  page?: number
  limit?: number
}

// In-memory runtime cache for products added or updated during development
const runtimeProductStore = new Map<string, any>()

// Initialize runtime cache with fallback products
for (const p of FALLBACK_PRODUCTS) {
  runtimeProductStore.set(p.id, {
    ...p,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export class ProductService {
  async listAdminProducts({
    query = '',
    category = '',
    page = 1,
    limit = 10,
  }: ListProductsAdminParams) {
    const skip = (page - 1) * limit
    try {
      const where: Prisma.ProductWhereInput = {
        AND: [
          query ? { name: { contains: query, mode: 'insensitive' as const } } : {},
          category ? { category } : {},
        ],
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

      if (products && products.length > 0) {
        return {
          products,
          total,
          pages: Math.ceil(total / limit),
        }
      }
    } catch (err) {
      console.warn('Prisma DB error in listAdminProducts, using runtime store:', err)
    }

    let all = Array.from(runtimeProductStore.values())
    if (query) {
      all = all.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku?.toLowerCase().includes(query.toLowerCase()))
    }
    if (category) {
      all = all.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }
    const total = all.length
    const products = all.slice(skip, skip + limit)

    return {
      products,
      total,
      pages: Math.ceil(total / limit),
    }
  }

  async getProductById(id: string) {
    try {
      const prod = await prisma.product.findUnique({
        where: { id },
      })
      if (prod) return prod
    } catch (err) {
      console.warn('Prisma DB error in getProductById, checking runtime store:', err)
    }

    return runtimeProductStore.get(id) || Array.from(runtimeProductStore.values()).find(p => p.slug === id) || null
  }

  async createProduct(data: Prisma.ProductCreateInput) {
    try {
      const created = await prisma.product.create({
        data,
      })
      runtimeProductStore.set(created.id, created)
      return created
    } catch (err) {
      console.warn('Prisma DB error in createProduct, saving to runtime store:', err)
      const mockProduct = {
        id: `prod-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      runtimeProductStore.set(mockProduct.id, mockProduct)
      return mockProduct
    }
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    try {
      const updated = await prisma.product.update({
        where: { id },
        data,
      })
      runtimeProductStore.set(updated.id, updated)
      return updated
    } catch (err) {
      console.warn('Prisma DB error in updateProduct, updating runtime store:', err)
      const existing = await this.getProductById(id)
      const updated = {
        ...(existing || {}),
        ...data,
        id,
        updatedAt: new Date(),
      }
      runtimeProductStore.set(id, updated)
      return updated
    }
  }

  async deleteProduct(id: string) {
    try {
      await prisma.product.delete({
        where: { id },
      })
    } catch (err) {
      console.warn('Prisma DB error in deleteProduct, removing from runtime store:', err)
    }
    runtimeProductStore.delete(id)
    return { id }
  }

  async getProductsByIds(ids: string[]) {
    try {
      const list = await prisma.product.findMany({
        where: { id: { in: ids } },
      })
      if (list && list.length > 0) return list
    } catch (err) {
      console.warn('Prisma DB error in getProductsByIds:', err)
    }
    return Array.from(runtimeProductStore.values()).filter(p => ids.includes(p.id))
  }
}

export const productService = new ProductService()
