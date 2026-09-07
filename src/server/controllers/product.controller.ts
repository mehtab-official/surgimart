import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/server/services/product.service'
import { requireAdmin, requireCsrf } from '@/server/middlewares'
import { productSchema } from '@/lib/validations'

export class ProductController {
  async listAdminProducts(req: NextRequest) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    try {
      const result = await productService.listAdminProducts({ query, category, page, limit })
      return NextResponse.json(result)
    } catch (error) {
      console.error('[Admin Products GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async createAdminProduct(req: NextRequest) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const csrfCheck = requireCsrf(req)
    if ('response' in csrfCheck) return csrfCheck.response

    try {
      const body = await req.json()
      const parsed = productSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: parsed.error.flatten() },
          { status: 400 }
        )
      }

      const product = await productService.createProduct(parsed.data)
      return NextResponse.json(product, { status: 201 })
    } catch (error) {
      console.error('[Admin Products POST]', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      )
    }
  }

  async getAdminProductById(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    try {
      const { id } = await params
      const product = await productService.getProductById(id)
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json(product)
    } catch (error) {
      console.error('[Admin Product GET]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }

  async updateAdminProduct(
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
      const parsed = productSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: parsed.error.flatten() },
          { status: 400 }
        )
      }

      const product = await productService.updateProduct(id, parsed.data)
      return NextResponse.json(product)
    } catch (error) {
      console.error('[Admin Product PUT]', error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      )
    }
  }

  async deleteAdminProduct(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authCheck = await requireAdmin()
    if ('response' in authCheck) return authCheck.response

    const csrfCheck = requireCsrf(req)
    if ('response' in csrfCheck) return csrfCheck.response

    try {
      const { id } = await params
      await productService.deleteProduct(id)
      return new NextResponse(null, { status: 204 })
    } catch (error) {
      console.error('[Admin Product DELETE]', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export const productController = new ProductController()
