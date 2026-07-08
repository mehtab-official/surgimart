'use server'
import type { AlgoliaResult } from '@/types'

export async function searchProducts(query: string, limit = 6): Promise<AlgoliaResult[]> {
  console.log('[DEBUG] searchProducts action called:', { query, E2E_MOCK: process.env.E2E_MOCK })
  if (process.env.E2E_MOCK === 'true') {
    return [
      {
        objectID: 'e2e-2',
        name: 'Scalpel #11 (Mock)',
        slug: 'scalpel-11',
        price: 15.00,
        category: 'Instruments',
        image: 'https://placehold.co/400x400/png?text=Scalpel',
        inStock: true,
        rating: 5.0
      },
      {
        objectID: 'e2e-1',
        name: 'Surgical Mask (Mock)',
        slug: 'mask',
        price: 5.99,
        category: 'Safety',
        image: 'https://placehold.co/400x400/png?text=Mask',
        inStock: true,
        rating: 4.5
      }
    ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
  }
  const { searchProducts: _searchProducts } = await import('@/lib/algolia')
  return _searchProducts(query, limit)
}
