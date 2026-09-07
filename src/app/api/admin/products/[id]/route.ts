import { NextRequest } from 'next/server'
import { productController } from '@/server/controllers/product.controller'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return productController.getAdminProductById(req, context)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return productController.updateAdminProduct(req, context)
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return productController.deleteAdminProduct(req, context)
}
