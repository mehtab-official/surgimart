import { NextRequest } from 'next/server'
import { quoteController } from '@/server/controllers/quote.controller'

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return quoteController.updateAdminQuoteStatus(req, context)
}
