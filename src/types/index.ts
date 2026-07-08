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
