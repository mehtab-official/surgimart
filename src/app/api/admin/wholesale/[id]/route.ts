import { NextRequest } from 'next/server'
import { wholesaleController } from '@/server/controllers/wholesale.controller'

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return wholesaleController.updateAdminWholesaleStatus(req, context)
}
