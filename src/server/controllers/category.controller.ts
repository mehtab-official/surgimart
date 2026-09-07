import { NextRequest, NextResponse } from 'next/server'
import { categoryService } from '@/server/services/category.service'
import { requireAdmin, requireCsrf } from '@/server/middlewares'
import { categorySchema } from '@/lib/validations'

export class CategoryController {
  async listCategories() {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    try {
      const categories = await categoryService.listCategories()
      return NextResponse.json(categories)
    } catch (error) {
      console.error('[Admin Categories GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async createCategory(req: NextRequest) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const csrfCheck = requireCsrf(req)
    if ('response' in csrfCheck) return csrfCheck.response

    try {
      const body = await req.json()
      const validatedData = categorySchema.parse(body)

      const category = await categoryService.createCategory(validatedData)
      return NextResponse.json(category, { status: 201 })
    } catch (error) {
      if (error instanceof Error && 'name' in error && error.name === 'ZodError') {
        return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
      }
      console.error('[Admin Categories POST]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async getCategoryById(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    try {
      const { id } = await params
      const category = await categoryService.getCategoryById(id)
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      return NextResponse.json(category)
    } catch (error) {
      console.error('[Admin Category GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async updateCategory(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const csrfCheck = requireCsrf(req)
    if ('response' in csrfCheck) return csrfCheck.response

    try {
      const { id } = await params
      const body = await req.json()
      const validatedData = categorySchema.parse(body)

      const category = await categoryService.updateCategory(id, validatedData)
      return NextResponse.json(category)
    } catch (error) {
      if (error instanceof Error && 'name' in error && error.name === 'ZodError') {
        return NextResponse.json({ error: 'Validation failed', details: error }, { status: 400 })
      }
      console.error('[Admin Category PUT]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async deleteCategory(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const csrfCheck = requireCsrf(req)
    if ('response' in csrfCheck) return csrfCheck.response

    try {
      const { id } = await params
      await categoryService.deleteCategory(id)
      return new NextResponse(null, { status: 204 })
    } catch (error) {
      console.error('[Admin Category DELETE]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export const categoryController = new CategoryController()
