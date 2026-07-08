import 'server-only'
import type { AlgoliaResult } from '@/types'

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const INDEX_NAME = 'products'

// Lazy-initialize so missing keys don't crash at module load time
function getClient() {
  if (!APP_ID || !SEARCH_KEY || APP_ID === 'your_app_id' || APP_ID === 'placeholder') {
    return null
  }
  // Dynamic import to avoid module-level initialization
  const { algoliasearch } = require('algoliasearch')
  return algoliasearch(APP_ID, SEARCH_KEY)
}

export async function searchProducts(query: string, limit = 6): Promise<AlgoliaResult[]> {
  const client = getClient()
  if (!client) return []

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
    return []
  }
}
