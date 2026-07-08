import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const handlers = [
  http.get('*/api/health', () => {
    return HttpResponse.json({ status: 'ok', database: 'connected' })
  }),
  // Algolia mocks
  http.post('*.algolia.net/*', () => {
    return HttpResponse.json({
      hits: [{ objectID: '1', name: 'Scalpel #10', slug: 'scalpel-10', price: 25.99, category: 'Surgical Tools', image: 'http://example.com/img.png', inStock: true }]
    })
  }),
  http.post('*.algolianet.com/*', () => {
    return HttpResponse.json({
      hits: [{ objectID: '1', name: 'Scalpel #10', slug: 'scalpel-10', price: 25.99, category: 'Surgical Tools', image: 'http://example.com/img.png', inStock: true }]
    })
  })
]

export const server = setupServer(...handlers)
