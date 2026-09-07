import { NextRequest } from 'next/server'
import { wholesaleController } from '@/server/controllers/wholesale.controller'

export async function POST(req: NextRequest) {
  return wholesaleController.createWholesale(req)
}
