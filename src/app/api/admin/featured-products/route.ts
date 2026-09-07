import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_FEATURED_PRODUCTS, type FeaturedProductItem } from '@/types'
import { auth } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const FEATURED_PRODUCTS_FILE = path.join(DATA_DIR, 'featured-products.json')

async function getFeaturedProducts(): Promise<FeaturedProductItem[]> {
  try {
    const raw = await fs.readFile(FEATURED_PRODUCTS_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // fallback to defaults if file not created yet
  }
  return DEFAULT_FEATURED_PRODUCTS
}

async function saveFeaturedProducts(items: FeaturedProductItem[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(FEATURED_PRODUCTS_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const items = await getFeaturedProducts()
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    const body = await req.json()
    const { items } = body

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload, expected array of items' }, { status: 400 })
    }

    await saveFeaturedProducts(items as FeaturedProductItem[])
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('[Featured Products API Error]:', error)
    return NextResponse.json({ error: 'Failed to save featured products' }, { status: 500 })
  }
}
