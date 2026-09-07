import { NextRequest } from 'next/server'
import { orderController } from '@/server/controllers/order.controller'

export async function POST(req: NextRequest) {
  return orderController.createOrder(req)
}

export async function GET(req: NextRequest) {
  return orderController.lookupOrder(req)
}
