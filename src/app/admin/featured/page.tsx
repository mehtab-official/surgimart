'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  Upload, 
  Trash2, 
  Plus, 
  Save, 
  Play, 
  Video, 
  Image as ImageIcon, 
  ArrowLeft,
  RefreshCw,
  Eye,
  CheckCircle2,
  Send,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { FeaturedProductItem } from '@/types'

export default function AdminFeaturedProductsPage() {
  const [items, setItems] = useState<FeaturedProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<{ title: string; url: string } | null>(null)

  // Fetch current featured products
  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch('/api/admin/featured-products')
        const data = await res.json()
        if (data.items) {
          setItems(data.items)
        }
      } catch (err) {
        toast.error('Failed to load featured products')
      } finally {
        setLoading(false)
      }
    }
    loadItems()
  }, [])

  // Handle Video or Image Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, itemId: string, targetType: 'video' | 'image') {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploadingId(`${itemId}-${targetType}`)
    const toastId = toast.loading(`Uploading ${targetType === 'video' ? 'video (MP4/WebM)' : 'product image'}...`)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setItems(prev => prev.map(item => {
        if (item.id !== itemId) return item
        if (targetType === 'video') {
          return {
            ...item,
            videoUrl: data.url,
          }
        } else {
          return {
            ...item,
            image: data.url
          }
        }
      }))

      toast.success(`${targetType === 'video' ? 'Video' : 'Image'} uploaded successfully! Click "Save & Publish" to apply.`, { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: toastId })
    } finally {
      setUploadingId(null)
      e.target.value = ''
    }
  }

  // Update item field
  function updateItem(id: string, field: keyof FeaturedProductItem, value: any) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  // Add new featured product card
  function handleAddNewItem() {
    const newItem: FeaturedProductItem = {
      id: `fp-${Date.now()}`,
      title: 'New Surgical Instrument Model',
      category: 'General Surgery',
      description: 'Precision box-joint locking mechanism with fine serrated jaws for atraumatic vessel occlusion. German AISI 410 grade.',
      tag: 'Hot Selling',
      image: '/images/products-hero-1.jpg',
      videoUrl: '',
      specs: ['Available straight & curved', 'Autoclave resistant', 'German AISI 410 Steel']
    }
    setItems(prev => [...prev, newItem])
  }

  // Delete item
  function handleDeleteItem(id: string) {
    if (items.length <= 1) {
      toast.error('At least one featured product is required')
      return
    }
    setItems(prev => prev.filter(item => item.id !== id))
    toast.success('Card removed. Remember to save changes.')
  }

  // Save changes to server
  async function handleSaveChanges() {
    setSaving(true)
    const toastId = toast.loading('Saving featured products & video updates...')
    try {
      const res = await fetch('/api/admin/featured-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      toast.success('Featured products & videos published to the live homepage!', { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Error saving featured products', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-24 text-slate-400'>
        <RefreshCw className='animate-spin mr-2' size={20} />
        <span>Loading featured products configuration...</span>
      </div>
    )
  }

  return (
    <div className='space-y-8 max-w-6xl mx-auto'>
      {/* Back button */}
      <Link 
        href='/admin' 
        className='inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors'
      >
        <ArrowLeft size={14} /> Back to Admin Overview
      </Link>

      {/* Header Banner */}
      <div className='p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a1835] to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-400/30'>
            <Sparkles size={14} className='text-blue-400' />
            <span>Homepage Featured Products & Video Manager</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
            Featured Products & Video Previews
          </h2>
          <p className='text-slate-300 text-sm mt-1 max-w-2xl'>
            Upload 360° demonstration videos (MP4/WebM) and customize titles, descriptions, and technical specifications for each featured hot-selling instrument.
          </p>
        </div>

        <div className='flex items-center gap-3 shrink-0'>
          <button
            onClick={handleAddNewItem}
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors'
          >
            <Plus size={16} /> Add Product Card
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50'
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Product Cards List */}
      <div className='space-y-6'>
        {items.map((item, index) => {
          const isUploadingVideo = uploadingId === `${item.id}-video`
          const isUploadingImage = uploadingId === `${item.id}-image`
          const hasVideo = Boolean(item.videoUrl)

          return (
            <div 
              key={item.id}
              className='bg-[#0a1426] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6'
            >
              {/* Card Header */}
              <div className='flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80'>
                <div className='flex items-center gap-3'>
                  <span className='w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 font-mono font-bold text-xs flex items-center justify-center border border-blue-500/30'>
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className='font-bold text-white text-base'>{item.title}</h3>
                    <p className='text-xs text-slate-400'>
                      {item.category} • {hasVideo ? '🎬 Video Attached' : '⚡ 360° Demo Fallback'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  {hasVideo && (
                    <button
                      type='button'
                      onClick={() => setPreviewVideo({ title: item.title, url: item.videoUrl! })}
                      className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700 transition-colors'
                    >
                      <Play size={13} className='fill-amber-400' /> Preview Video
                    </button>
                  )}

                  <button
                    type='button'
                    onClick={() => handleDeleteItem(item.id)}
                    className='p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors'
                    title='Delete item'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Grid: Visual Preview & Uploads / Fields */}
              <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                
                {/* Left: Media & Upload Actions */}
                <div className='lg:col-span-4 space-y-4'>
                  <div className='relative h-48 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 flex items-center justify-center group/preview'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className='w-full h-full object-cover object-center'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent' />
                    
                    {hasVideo ? (
                      <div className='absolute inset-0 flex items-center justify-center bg-slate-950/40'>
                        <button
                          type='button'
                          onClick={() => setPreviewVideo({ title: item.title, url: item.videoUrl! })}
                          className='w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform'
                        >
                          <Play size={18} className='ml-0.5 fill-white' />
                        </button>
                      </div>
                    ) : (
                      <span className='absolute bottom-3 left-3 text-[10px] font-bold text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-white/10'>
                        No video uploaded (360° fallback active)
                      </span>
                    )}

                    <span className='absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-600 text-white shadow'>
                      {item.tag}
                    </span>
                  </div>

                  {/* Upload Controls */}
                  <div className='space-y-3'>
                    {/* Video Upload */}
                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5'>
                        <Video size={13} className='text-amber-400' />
                        Product Video (MP4, WebM up to 100MB):
                      </label>
                      <div className='flex items-center gap-2'>
                        <label className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-colors ${
                          isUploadingVideo 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}>
                          <Upload size={14} />
                          <span>{isUploadingVideo ? 'Uploading Video...' : (item.videoUrl ? 'Replace Video' : 'Choose Video File')}</span>
                          <input 
                            type='file' 
                            accept='video/mp4,video/webm,video/ogg,video/quicktime' 
                            className='hidden' 
                            disabled={isUploadingVideo}
                            onChange={(e) => handleFileUpload(e, item.id, 'video')} 
                          />
                        </label>
                        {item.videoUrl && (
                          <button
                            type='button'
                            onClick={() => updateItem(item.id, 'videoUrl', '')}
                            className='p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-700'
                            title='Remove video URL'
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      {item.videoUrl && (
                        <p className='text-[10px] text-emerald-400 truncate mt-1'>
                          ✓ Video: {item.videoUrl}
                        </p>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5'>
                        <ImageIcon size={13} className='text-blue-400' />
                        Card Backdrop Image:
                      </label>
                      <label className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-colors ${
                        isUploadingImage 
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}>
                        <Upload size={14} />
                        <span>{isUploadingImage ? 'Uploading Image...' : 'Replace Image'}</span>
                        <input 
                          type='file' 
                          accept='image/jpeg,image/png,image/webp' 
                          className='hidden' 
                          disabled={isUploadingImage}
                          onChange={(e) => handleFileUpload(e, item.id, 'image')} 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Information & Description Fields */}
                <div className='lg:col-span-8 space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1'>Instrument Title</label>
                      <input 
                        type='text' 
                        value={item.title} 
                        onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                        className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1'>Category Discipline</label>
                      <input 
                        type='text' 
                        value={item.category} 
                        onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                        className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-300 mb-1'>Badge / Tag (e.g. Hot Selling, Export Bestseller)</label>
                    <input 
                      type='text' 
                      value={item.tag} 
                      onChange={(e) => updateItem(item.id, 'tag', e.target.value)}
                      className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                    />
                  </div>

                  {/* Description Editor */}
                  <div>
                    <label className='block text-xs font-bold text-slate-300 mb-1'>
                      Product Description (Displayed on card & video modal)
                    </label>
                    <textarea 
                      rows={3} 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className='w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-400'
                      placeholder='Write engineering details, lock mechanism specifications, steel grade...'
                    />
                  </div>

                  {/* Technical Specs List */}
                  <div>
                    <label className='block text-xs font-bold text-slate-300 mb-1'>
                      Key Specifications (Comma separated bullets)
                    </label>
                    <input 
                      type='text' 
                      value={item.specs.join(', ')} 
                      onChange={(e) => updateItem(item.id, 'specs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                      placeholder='Compound double action, Titanium coated jaws, Autoclave resistant'
                    />
                  </div>

                  {/* Direct Video URL Input (Alternative to uploading) */}
                  <div>
                    <label className='block text-xs font-bold text-slate-300 mb-1'>
                      Or Video Link / URL (Optional CDN or Direct MP4 link)
                    </label>
                    <input 
                      type='text' 
                      value={item.videoUrl || ''} 
                      onChange={(e) => updateItem(item.id, 'videoUrl', e.target.value)}
                      className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400'
                      placeholder='https://... or /uploads/video.mp4'
                    />
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      {/* Save Button at Bottom */}
      <div className='p-4 bg-[#0a1426] rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4'>
        <span className='text-xs text-slate-400'>
          Changes will immediately sync with the Featured Products section on the live homepage.
        </span>
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50'
        >
          <Save size={16} />
          {saving ? 'Saving Changes...' : 'Save & Publish Featured Products'}
        </button>
      </div>

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md'>
          <div className='bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl'>
            <div className='flex items-center justify-between'>
              <h3 className='text-base font-bold text-white flex items-center gap-2'>
                <Video size={16} className='text-amber-400' />
                <span>{previewVideo.title}</span>
              </h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className='text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg'
              >
                ✕ Close
              </button>
            </div>
            <div className='aspect-video bg-black rounded-2xl overflow-hidden'>
              <video
                src={previewVideo.url}
                controls
                autoPlay
                playsInline
                className='w-full h-full object-contain'
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
