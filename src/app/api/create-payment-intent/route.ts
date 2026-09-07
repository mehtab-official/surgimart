import { NextRequest } from 'next/server'
import { paymentController } from '@/server/controllers/payment.controller'

export async function POST(req: NextRequest) {
  return paymentController.createPaymentIntent(req)
}
