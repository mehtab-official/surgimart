'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Upload, X, Link as LinkIcon, Loader2, Save } from 'lucide-react'
import Image from 'next/image'
import { productSchema } from '@/lib/validations'

import { Product } from '@/types'

type ProductFormData = z.infer<typeof productSchema>

interface Props {
  initialData?: Product | null
  productId?: string
}

interface Category {
  id: string
  name: string
}

export function ProductForm({ initialData, productId }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      comparePrice: initialData?.comparePrice || null,
      category: initialData?.category || '',
      subCategory: initialData?.subCategory || '',
      images: initialData?.images || [],
      inStock: initialData?.inStock ?? true,
      stockCount: initialData?.stockCount ?? 0,
      sku: initialData?.sku || '',
      isFeatured: initialData?.isFeatured ?? false,
      isPublished: initialData?.isPublished ?? true,
    }
  })

  // Watch name to auto-generate slug
  const name = watch('name')
  useEffect(() => {
    if (name && !productId) {
      const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
      setValue('slug', slug)
    }
  }, [name, setValue, productId])

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories', err))
  }, [])

  useEffect(() => {
    setValue('images', images)
  }, [images, setValue])

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setImages(prev => [...prev, data.url])
        toast.success('Image uploaded')
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error('Upload failed')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const addImageUrl = () => {
    if (!imageUrlInput) return
    setImages(prev => [...prev, imageUrlInput])
    setImageUrlInput('')
    toast.success('Image added via URL')
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data: ProductFormData) {
    setIsSubmitting(true)
    try {
      const url = productId ? `/api/admin/products/${productId}` : '/api/admin/products'
      const method = productId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save product')
      }

      toast.success(productId ? 'Product updated' : 'Product created')
      router.push('/admin/products')
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An error occurred'
      toast.error(message)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 max-w-4xl'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Left Column: Basic Info */}
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3'>Basic Information</h3>
            
            <div>
              <label className='text-sm font-medium block mb-1'>Product Name</label>
              <input 
                {...register('name')}
                placeholder='e.g. Surgical Scalpel Set'
                className='w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none'
              />
              {errors.name && <p className='text-xs text-red-500 mt-1'>{errors.name.message}</p>}
            </div>

            <div>
              <label className='text-sm font-medium block mb-1'>Slug</label>
              <input 
                {...register('slug')}
                placeholder='surgical-scalpel-set'
                className='w-full border rounded-lg px-3 py-2 text-sm bg-slate-50'
              />
              {errors.slug && <p className='text-xs text-red-500 mt-1'>{errors.slug.message}</p>}
            </div>

            <div>
              <label className='text-sm font-medium block mb-1'>Description</label>
              <textarea 
                {...register('description')}
                rows={4}
                className='w-full border rounded-lg px-3 py-2 text-sm outline-none'
              />
            </div>
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3'>Pricing & Inventory</h3>
            
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium block mb-1'>Price ($)</label>
                <input 
                  type='number'
                  step='0.01'
                  {...register('price', { valueAsNumber: true })}
                  className='w-full border rounded-lg px-3 py-2 text-sm'
                />
              </div>
              <div>
                <label className='text-sm font-medium block mb-1'>Compare Price ($)</label>
                <input 
                  type='number'
                  step='0.01'
                  {...register('comparePrice', { valueAsNumber: true })}
                  className='w-full border rounded-lg px-3 py-2 text-sm'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium block mb-1'>Stock Count</label>
                <input 
                  type='number'
                  {...register('stockCount', { valueAsNumber: true })}
                  className='w-full border rounded-lg px-3 py-2 text-sm'
                />
              </div>
              <div>
                <label className='text-sm font-medium block mb-1'>SKU</label>
                <input 
                  {...register('sku')}
                  placeholder='SRG-001'
                  className='w-full border rounded-lg px-3 py-2 text-sm'
                />
              </div>
            </div>
            
            <div className='flex items-center gap-6 pt-2'>
               <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                 <input type='checkbox' {...register('inStock')} />
                 In Stock
               </label>
               <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                 <input type='checkbox' {...register('isFeatured')} />
                 Featured
               </label>
               <label className='flex items-center gap-2 text-sm font-medium cursor-pointer'>
                 <input type='checkbox' {...register('isPublished')} />
                 Published
               </label>
            </div>
          </div>
        </div>

        {/* Right Column: Images & Organization */}
        <div className='space-y-6'>
          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3'>Images</h3>
            
            <div className='flex gap-2'>
              <div className='flex-1 relative'>
                <LinkIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
                <input 
                  type='text'
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder='Paste image URL'
                  className='w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none'
                />
              </div>
              <button 
                type='button'
                onClick={addImageUrl}
                className='bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs hover:bg-slate-200 transition-colors'
              >
                Add URL
              </button>
            </div>

            <div className='relative'>
              <input 
                type='file'
                id='file-upload'
                className='hidden'
                accept='image/*'
                onChange={onImageUpload}
                disabled={isUploading}
              />
              <label 
                htmlFor='file-upload'
                className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? <Loader2 className='animate-spin text-blue-600' /> : <Upload className='text-slate-400 mb-2' />}
                <span className='text-sm font-medium text-slate-600'>
                  {isUploading ? 'Uploading...' : 'Click to upload image'}
                </span>
                <span className='text-xs text-slate-400 mt-1'>Max size: 5MB</span>
              </label>
            </div>

            {/* Image Preview Grid */}
            <div className='grid grid-cols-3 gap-3 pt-2'>
              {images.map((url, i) => (
                <div key={i} className='relative group aspect-square rounded-lg overflow-hidden border border-slate-200'>
                  <Image src={url} alt='Preview' fill className='object-cover' />
                  <button 
                    type='button'
                    onClick={() => removeImage(i)}
                    className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && <p className='text-xs text-red-500'>{errors.images.message}</p>}
          </div>

          <div className='bg-white p-6 rounded-2xl border border-slate-200 space-y-4'>
            <h3 className='font-bold text-slate-800 border-b border-slate-100 pb-3'>Organization</h3>
            
            <div>
              <label className='text-sm font-medium block mb-1'>Category</label>
              <select 
                {...register('category')}
                className='w-full border rounded-lg px-3 py-2 text-sm bg-white'
              >
                <option value=''>Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className='text-xs text-red-500 mt-1'>{errors.category.message}</p>}
            </div>

            <div>
              <label className='text-sm font-medium block mb-1'>Sub Category (optional)</label>
              <input 
                {...register('subCategory')}
                placeholder='e.g. Scopes'
                className='w-full border rounded-lg px-3 py-2 text-sm'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-end gap-4 border-t border-slate-200 pt-8'>
        <button 
          type='button'
          onClick={() => router.back()}
          className='px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors'
        >
          Cancel
        </button>
        <button 
          type='submit'
          disabled={isSubmitting}
          className='bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50'
        >
          {isSubmitting ? <Loader2 size={20} className='animate-spin' /> : <Save size={20} />}
          {productId ? 'Update Product' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}
