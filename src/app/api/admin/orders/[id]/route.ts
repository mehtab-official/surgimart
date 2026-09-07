import { NextRequest } from 'next/server'
import { orderController } from '@/server/controllers/order.controller'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return orderController.getAdminOrderById(req, context)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return orderController.updateAdminOrderStatus(req, context)
}
