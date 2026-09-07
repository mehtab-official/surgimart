import { NextRequest } from 'next/server'
import { categoryController } from '@/server/controllers/category.controller'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return categoryController.getCategoryById(req, context)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return categoryController.updateCategory(req, context)
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return categoryController.deleteCategory(req, context)
}
