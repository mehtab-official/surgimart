import 'server-only'
import { algoliasearch, type SearchClient } from 'algoliasearch'
import type { AlgoliaResult } from '@/types'

const APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
const INDEX_NAME = 'products'

let _client: SearchClient | null = null

function getClient(): SearchClient | null {
  if (_client) return _client
  if (!APP_ID || !SEARCH_KEY || APP_ID === 'your_app_id' || APP_ID === 'placeholder') {
    return null
  }
  _client = algoliasearch(APP_ID, SEARCH_KEY)
  return _client
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
