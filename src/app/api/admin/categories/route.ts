import { NextRequest } from 'next/server'
import { categoryController } from '@/server/controllers/category.controller'

export async function GET() {
  return categoryController.listCategories()
}

export async function POST(req: NextRequest) {
  return categoryController.createCategory(req)
}
