import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const ESSENTIAL_CATEGORIES = [
  { id: 'cat-1', name: 'General Surgery', slug: 'general-surgery', description: 'Hemostatic forceps, Mayo dissecting scissors, needle holders, and retractor sets.' },
  { id: 'cat-2', name: 'Orthopaedic Instruments & Implants', slug: 'orthopaedic', description: 'Stille-Luer bone rongeurs, titanium locking plates, cortical screws & cutters.' },
  { id: 'cat-3', name: 'Implants & Locking Plates', slug: 'implants', description: 'Titanium locking compression plates, cortical trauma screws, joint components.' },
  { id: 'cat-4', name: 'ENT Specialty Instruments', slug: 'ent', description: 'Micro laryngeal suction tubes, Hartmann forceps, speculums, and mouth gags.' },
  { id: 'cat-5', name: 'Dental Surgery Instruments', slug: 'dental', description: 'Extraction forceps, root elevators, periodontal scalers, and probe sets.' },
  { id: 'cat-6', name: 'Neuro & Spinal Surgery', slug: 'neuro-spinal', description: 'Micro forceps, spinal elevators, dissectors, and Kerrison rongeurs.' },
  { id: 'cat-7', name: 'Veterinary Surgical & Implants', slug: 'veterinary', description: 'Veterinary orthopedic bone plates, castrators, and trauma surgery kits.' },
]

// In-memory runtime store for categories so custom edits persist even when offline/mock DB
const runtimeCategoryStore = new Map<string, any>()
for (const cat of ESSENTIAL_CATEGORIES) {
  runtimeCategoryStore.set(cat.id, {
    ...cat,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export class CategoryService {
  async listCategories() {
    try {
      const dbCategories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      })
      if (dbCategories && dbCategories.length > 0) {
        const essentialSlugs = new Set(ESSENTIAL_CATEGORIES.map(c => c.slug))
        const filtered = dbCategories.filter(c => essentialSlugs.has(c.slug))
        return filtered.length > 0 ? filtered : ESSENTIAL_CATEGORIES
      }
      return Array.from(runtimeCategoryStore.values())
    } catch (err) {
      console.warn('DB error in CategoryService.listCategories, returning essential categories:', err)
      return Array.from(runtimeCategoryStore.values())
    }
  }

  async getCategoryById(id: string) {
    try {
      const cat = await prisma.category.findUnique({
        where: { id },
      })
      if (cat) return cat
    } catch (err) {
      console.warn('DB error in CategoryService.getCategoryById, checking runtime store:', err)
    }
    return runtimeCategoryStore.get(id) || Array.from(runtimeCategoryStore.values()).find(c => c.id === id || c.slug === id) || null
  }

  async createCategory(data: Prisma.CategoryCreateInput) {
    try {
      const created = await prisma.category.create({
        data,
      })
      runtimeCategoryStore.set(created.id, created)
      return created
    } catch (err) {
      console.warn('DB error in createCategory, saving to runtime store:', err)
      const mockCategory = {
        id: `cat-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        icon: data.icon || null,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      runtimeCategoryStore.set(mockCategory.id, mockCategory)
      return mockCategory
    }
  }

  async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    try {
      const updated = await prisma.category.update({
        where: { id },
        data,
      })
      runtimeCategoryStore.set(updated.id, updated)
      return updated
    } catch (err) {
      console.warn('DB error in updateCategory, updating runtime store:', err)
      const existing = await this.getCategoryById(id)
      const updated = {
        ...(existing || {}),
        ...data,
        id,
        updatedAt: new Date(),
      }
      runtimeCategoryStore.set(id, updated)
      return updated
    }
  }

  async deleteCategory(id: string) {
    try {
      await prisma.category.delete({
        where: { id },
      })
    } catch (err) {
      console.warn('DB error in deleteCategory:', err)
    }
    runtimeCategoryStore.delete(id)
    return { id }
  }
}

export const categoryService = new CategoryService()
