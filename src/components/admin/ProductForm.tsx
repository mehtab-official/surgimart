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
    fetch('/api/admin/categories', { credentials: 'include' })
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
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setImages(prev => [...prev, data.url])
        toast.success('Image uploaded')
      } else {
        toast.error(data.error || 'Upload failed')
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
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        const message = err.error || 'Failed to save product'
        const details = err.details?.fieldErrors
          ? Object.entries(err.details.fieldErrors).map(([f, msgs]) => `${f}: ${(msgs as string[]).join(', ')}`).join(' | ')
          : ''
        throw new Error(details ? `${message} — ${details}` : message)
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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 max-w-4xl text-slate-200'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Left Column: Basic Info */}
        <div className='space-y-6'>
          <div className='bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm'>
            <h3 className='font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between text-sm'>
              <span>Basic Instrument Details</span>
              <span className='text-[10px] uppercase tracking-wider text-amber-400 font-mono font-bold'>Showcase Listing</span>
            </h3>
            
            <div>
              <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Instrument Name *</label>
              <input 
                {...register('name')}
                placeholder='e.g. Surgical Hemostatic Kelly Forceps 14cm'
                className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all'
              />
              {errors.name && <p className='text-xs text-rose-400 mt-1'>{errors.name.message}</p>}
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-300 block mb-1.5'>URL Slug *</label>
              <input 
                {...register('slug')}
                placeholder='surgical-kelly-forceps-14cm'
                className='w-full bg-[#070e1e]/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 placeholder:text-slate-600 focus:border-slate-600 outline-none'
              />
              {errors.slug && <p className='text-xs text-rose-400 mt-1'>{errors.slug.message}</p>}
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Technical Specification / Description</label>
              <textarea 
                {...register('description')}
                rows={4}
                placeholder='Precision box joint locking mechanism, AISI 410 stainless steel, surgical grade serrations...'
                className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition-all resize-none'
              />
            </div>
          </div>

          <div className='bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm'>
            <h3 className='font-bold text-white border-b border-slate-800 pb-3 text-sm'>
              Specifications & Inventory Tiers
            </h3>
            
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Target Rate / RFQ ($)</label>
                <input 
                  type='number'
                  step='0.01'
                  {...register('price', { valueAsNumber: true })}
                  className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none'
                />
              </div>
              <div>
                <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Catalogue Baseline ($)</label>
                <input 
                  type='number'
                  step='0.01'
                  {...register('comparePrice', { valueAsNumber: true })}
                  className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none'
                />
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Export Batch Stock</label>
                <input 
                  type='number'
                  {...register('stockCount', { valueAsNumber: true })}
                  className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none'
                />
              </div>
              <div>
                <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Model SKU</label>
                <input 
                  {...register('sku')}
                  placeholder='SM-FC-140'
                  className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder:text-slate-500 focus:border-amber-400 outline-none'
                />
              </div>
            </div>
            
            <div className='flex items-center gap-6 pt-2 border-t border-slate-800/80'>
               <label className='flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer'>
                 <input type='checkbox' {...register('inStock')} className='w-4 h-4 rounded text-amber-500 accent-amber-500 bg-slate-950 border-slate-700' />
                 Export Ready
               </label>
               <label className='flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer'>
                 <input type='checkbox' {...register('isFeatured')} className='w-4 h-4 rounded text-amber-500 accent-amber-500 bg-slate-950 border-slate-700' />
                 Featured Specimen
               </label>
               <label className='flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer'>
                 <input type='checkbox' {...register('isPublished')} className='w-4 h-4 rounded text-amber-500 accent-amber-500 bg-slate-950 border-slate-700' />
                 Showcased Live
               </label>
            </div>
          </div>
        </div>

        {/* Right Column: Images & Organization */}
        <div className='space-y-6'>
          <div className='bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm'>
            <h3 className='font-bold text-white border-b border-slate-800 pb-3 text-sm flex items-center justify-between'>
              <span>Instrument Photographs</span>
              <span className='text-[10px] text-slate-400 font-mono'>Max 5MB</span>
            </h3>
            
            <div className='flex gap-2'>
              <div className='flex-1 relative'>
                <LinkIcon className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500' size={15} />
                <input 
                  type='text'
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder='/images/categories/general-surgery.png or URL'
                  className='w-full pl-9 pr-3 py-2.5 text-xs bg-[#070e1e] border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:border-amber-400 outline-none font-mono'
                />
              </div>
              <button 
                type='button'
                onClick={addImageUrl}
                className='bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shrink-0'
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
                className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl cursor-pointer bg-[#070e1e]/40 hover:bg-[#070e1e] transition-all ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? <Loader2 className='animate-spin text-amber-400 mb-2' size={24} /> : <Upload className='text-slate-400 mb-2' size={24} />}
                <span className='text-xs font-semibold text-slate-300'>
                  {isUploading ? 'Uploading to Server...' : 'Click to upload photograph'}
                </span>
                <span className='text-[10px] text-slate-500 mt-1'>PNG, JPEG, WebP</span>
              </label>
            </div>

            {/* Image Preview Grid */}
            <div className='grid grid-cols-3 gap-3 pt-2'>
              {images.map((url, i) => (
                <div key={i} className='relative group aspect-square rounded-xl overflow-hidden border border-slate-800 bg-[#070e1e] p-1.5 flex items-center justify-center'>
                  <Image src={url} alt='Preview' fill className='object-contain p-2' />
                  <button 
                    type='button'
                    onClick={() => removeImage(i)}
                    className='absolute top-1 right-1 bg-rose-600/90 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                    title='Remove image'
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && <p className='text-xs text-rose-400'>{errors.images.message}</p>}
          </div>

          <div className='bg-slate-900/90 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm'>
            <h3 className='font-bold text-white border-b border-slate-800 pb-3 text-sm'>
              Classification & Discipline
            </h3>
            
            <div>
              <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Surgical Category *</label>
              <select 
                {...register('category')}
                className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none'
              >
                <option value=''>Select Surgical Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name} className='bg-slate-900 text-white'>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className='text-xs text-rose-400 mt-1'>{errors.category.message}</p>}
            </div>

            <div>
              <label className='text-xs font-semibold text-slate-300 block mb-1.5'>Sub Category (optional)</label>
              <input 
                {...register('subCategory')}
                placeholder='e.g. Atraumatic Forceps, Bone Plates, Rongeurs'
                className='w-full bg-[#070e1e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-400 outline-none'
              />
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-end gap-4 border-t border-slate-800 pt-6'>
        <button 
          type='button'
          onClick={() => router.back()}
          className='px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors'
        >
          Cancel
        </button>
        <button 
          type='submit'
          disabled={isSubmitting}
          className='bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50'
        >
          {isSubmitting ? <Loader2 size={16} className='animate-spin' /> : <Save size={16} />}
          <span>{productId ? 'Update Specifications' : 'Publish Instrument'}</span>
        </button>
      </div>
    </form>
  )
}
