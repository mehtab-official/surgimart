import { NextRequest } from 'next/server'
import { productController } from '@/server/controllers/product.controller'

export async function GET(req: NextRequest) {
  return productController.listAdminProducts(req)
}

export async function POST(req: NextRequest) {
  return productController.createAdminProduct(req)
}
