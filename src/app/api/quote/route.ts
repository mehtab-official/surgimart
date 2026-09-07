import { NextRequest } from 'next/server'
import { quoteController } from '@/server/controllers/quote.controller'

export async function POST(req: NextRequest) {
  return quoteController.createQuote(req)
}
