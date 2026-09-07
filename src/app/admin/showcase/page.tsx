'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  Film, 
  Upload, 
  Trash2, 
  Plus, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Video, 
  Image as ImageIcon, 
  ArrowLeft,
  RefreshCw,
  Eye,
  Sliders
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { ShowcaseItem } from '@/types'

export default function AdminShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<ShowcaseItem | null>(null)

  // Fetch current showcase items
  useEffect(() => {
    async function loadItems() {
      try {
        const res = await fetch('/api/admin/showcase')
        const data = await res.json()
        if (data.items) {
          setItems(data.items)
        }
      } catch (err) {
        toast.error('Failed to load showcase items')
      } finally {
        setLoading(false)
      }
    }
    loadItems()
  }, [])

  // Handle Video / Image Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, itemId: string, targetType: 'video' | 'image') {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploadingId(`${itemId}-${targetType}`)
    const toastId = toast.loading(`Uploading ${targetType === 'video' ? 'video (MP4/WebM)' : 'poster image'}...`)

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
            mediaType: 'video'
          }
        } else {
          return {
            ...item,
            image: data.url
          }
        }
      }))

      toast.success(`${targetType === 'video' ? 'Video' : 'Poster'} uploaded successfully! Remember to save changes.`, { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Upload failed', { id: toastId })
    } finally {
      setUploadingId(null)
      e.target.value = ''
    }
  }

  // Update item field
  function updateItem(id: string, field: keyof ShowcaseItem, value: any) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  // Add new showcase slide / video item
  function handleAddNewItem() {
    const newItem: ShowcaseItem = {
      id: `showcase-${Date.now()}`,
      title: 'New Surgical Video / Showcase Feature',
      category: 'Operating Theater Tech',
      badge: 'Manufacturing Craftsmanship',
      compliance: 'ISO 13485:2016',
      subtitle: 'Hospital & Distributor Presentation',
      description: 'Highlighting high-precision instrument manufacturing, articulation, and metallurgical strength.',
      image: '/images/products-hero-1.jpg',
      videoUrl: '',
      mediaType: 'image',
      aspectRatio: 'aspect-[16/9]',
      specs: ['AISI 410/420 German Stainless Steel', '100% Passivation & Autoclave Safe', 'Sialkot Master Finish']
    }
    setItems(prev => [...prev, newItem])
  }

  // Delete item
  function handleDeleteItem(id: string) {
    if (items.length <= 1) {
      toast.error('At least one showcase item is required for the landing page')
      return
    }
    setItems(prev => prev.filter(item => item.id !== id))
    toast.success('Slide removed. Click Save to apply.')
  }

  // Save changes to server
  async function handleSaveChanges() {
    setSaving(true)
    const toastId = toast.loading('Saving showcase and video settings...')
    try {
      const res = await fetch('/api/admin/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')

      toast.success('Showcase & video updates published to the live website!', { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Error saving showcase', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-24 text-slate-400'>
        <RefreshCw className='animate-spin mr-2' size={20} />
        <span>Loading showcase slides and video configuration...</span>
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
            <Film size={14} className='text-blue-400' />
            <span>Landing Page Showcase & Video Manager</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-extrabold text-white tracking-tight'>
            Hero Showcase Videos & Slides
          </h2>
          <p className='text-slate-300 text-sm mt-1 max-w-2xl'>
            Upload surgical demonstration videos (MP4, WebM up to 100MB) or high-resolution instrument images to be showcased in the landing page interactive hero player.
          </p>
        </div>

        <div className='flex items-center gap-3 shrink-0'>
          <button
            onClick={handleAddNewItem}
            className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors'
          >
            <Plus size={16} /> Add Slide / Video
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

      {/* Showcase Cards List */}
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
                    <p className='text-xs text-slate-400'>{item.category} • {item.mediaType === 'video' ? '🎬 Video Showcase' : '🖼 Image Showcase'}</p>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  {/* Media Type Toggle */}
                  <div className='flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs'>
                    <button
                      type='button'
                      onClick={() => updateItem(item.id, 'mediaType', 'image')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-bold transition-colors ${
                        item.mediaType !== 'video' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon size={13} /> Image
                    </button>
                    <button
                      type='button'
                      onClick={() => updateItem(item.id, 'mediaType', 'video')}
                      className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-bold transition-colors ${
                        item.mediaType === 'video' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Video size={13} /> Video
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className='p-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-900/40 transition-colors'
                    title='Delete this slide'
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Media Upload & Preview Row */}
              <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                
                {/* Media Preview Player */}
                <div className='lg:col-span-4 space-y-3'>
                  <div className='relative w-full h-52 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group'>
                    {item.mediaType === 'video' && item.videoUrl ? (
                      <video 
                        src={item.videoUrl} 
                        poster={item.image}
                        controls 
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={item.image || '/images/image5.jpg'} 
                        alt={item.title} 
                        className='w-full h-full object-cover'
                      />
                    )}
                    
                    {item.mediaType === 'video' && !item.videoUrl && (
                      <div className='absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-center p-4'>
                        <Video size={32} className='text-amber-400 mb-2' />
                        <span className='text-xs font-bold text-white'>No Video Uploaded Yet</span>
                        <span className='text-[10px] text-slate-400 mt-1'>Upload MP4/WebM below</span>
                      </div>
                    )}

                    <div className='absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-bold text-amber-400 border border-amber-500/30'>
                      {item.mediaType === 'video' ? 'VIDEO MODE' : 'IMAGE MODE'}
                    </div>
                  </div>

                  {/* Upload Controls */}
                  <div className='space-y-2'>
                    {/* Video Upload Button */}
                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5'>
                        <Video size={13} className='text-amber-400' />
                        Upload Video (MP4, WebM up to 100MB):
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
                          ✓ Video linked: {item.videoUrl}
                        </p>
                      )}
                    </div>

                    {/* Poster / Thumbnail Image Upload */}
                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5'>
                        <ImageIcon size={13} className='text-blue-400' />
                        Poster / Thumbnail Image:
                      </label>
                      <label className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer border transition-colors ${
                        isUploadingImage 
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}>
                        <Upload size={14} />
                        <span>{isUploadingImage ? 'Uploading Image...' : 'Replace Poster Image'}</span>
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

                {/* Information Fields */}
                <div className='lg:col-span-8 space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1'>Title / Headline</label>
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

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1'>Quality Badge Label</label>
                      <input 
                        type='text' 
                        value={item.badge} 
                        onChange={(e) => updateItem(item.id, 'badge', e.target.value)}
                        className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                      />
                    </div>

                    <div>
                      <label className='block text-xs font-bold text-slate-300 mb-1'>Compliance Standards</label>
                      <input 
                        type='text' 
                        value={item.compliance} 
                        onChange={(e) => updateItem(item.id, 'compliance', e.target.value)}
                        className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-300 mb-1'>Subtitle / Target Use</label>
                    <input 
                      type='text' 
                      value={item.subtitle} 
                      onChange={(e) => updateItem(item.id, 'subtitle', e.target.value)}
                      className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-slate-300 mb-1'>Full Description (Customer View)</label>
                    <textarea 
                      rows={2} 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-normal focus:outline-none focus:border-amber-400'
                    />
                  </div>

                  {/* Technical Specs List */}
                  <div>
                    <label className='block text-xs font-bold text-slate-300 mb-1'>
                      Technical Specifications (Comma separated)
                    </label>
                    <input 
                      type='text' 
                      value={item.specs.join(', ')} 
                      onChange={(e) => updateItem(item.id, 'specs', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className='w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-400'
                      placeholder='AISI 410/420 Martensitic Steel, Tungsten Carbide Inlays, Autoclavable'
                    />
                  </div>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      {/* Save Button at Bottom */}
      <div className='p-4 bg-[#0a1426] rounded-2xl border border-slate-800 flex items-center justify-between'>
        <span className='text-xs text-slate-400'>
          Changes will immediately sync with the live Landing Page hero showcase.
        </span>
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50'
        >
          <Save size={16} />
          {saving ? 'Saving Changes...' : 'Save & Publish All Slides'}
        </button>
      </div>
    </div>
  )
}
