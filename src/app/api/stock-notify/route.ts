import { NextRequest } from 'next/server'
import { stockNotifyController } from '@/server/controllers/stock-notify.controller'

export async function POST(req: NextRequest) {
  return stockNotifyController.subscribe(req)
}
