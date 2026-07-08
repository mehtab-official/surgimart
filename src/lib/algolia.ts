import 'server-only'
import { algoliasearch } from 'algoliasearch'
import type { AlgoliaResult } from '@/types'

// H-9: 'server-only' import prevents accidental client-side bundling
const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'dummy',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || 'dummy'
)

const INDEX_NAME = 'products'

export async function searchProducts(query: string, limit = 6): Promise<AlgoliaResult[]> {
  // Return empty if keys not configured
  if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID === 'your_app_id') {
    return []
  }

  try {
    const { hits } = await client.searchSingleIndex<AlgoliaResult>({
      indexName: INDEX_NAME,
      searchParams: {
        query,
        hitsPerPage: limit,
        attributesToRetrieve: [
          'objectID', 'name', 'slug', 'price', 'category', 'image', 'inStock', 'badge', 'rating',
        ],
      },
    })
    return hits
  } catch (error) {
    console.error('[Algolia] Search failed:', error)
    return []   // never crash the app
  }
}
