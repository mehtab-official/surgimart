import { NextRequest } from 'next/server'
import { orderController } from '@/server/controllers/order.controller'

export async function GET(req: NextRequest) {
  return orderController.listAdminOrders(req)
}
