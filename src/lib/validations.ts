import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().min(0),
  comparePrice: z.number().optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional().nullable(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  inStock: z.boolean(),
  stockCount: z.number().int().min(0),
  sku: z.string().optional().nullable(),
  specs: z.any().optional(), // Json
  bulkPricing: z.any().optional(), // Json
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
})

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled', 'failed']),
})
