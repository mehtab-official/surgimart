import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-slate-800'>Add New Product</h2>
        <p className='text-slate-500'>Create a new surgical instrument listing.</p>
      </div>

      <ProductForm />
    </div>
  )
}
