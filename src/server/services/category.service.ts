import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'General Surgery', slug: 'general-surgery' },
  { id: 'cat-2', name: 'Orthopaedic', slug: 'orthopaedic' },
  { id: 'cat-3', name: 'Dental Instruments', slug: 'dental' },
  { id: 'cat-4', name: 'ENT Specialty', slug: 'ent' },
  { id: 'cat-5', name: 'Neuro & Spinal', slug: 'neuro-spinal' },
  { id: 'cat-6', name: 'Implants & Trauma', slug: 'implants-trauma' },
  { id: 'cat-7', name: 'Surgical Implants & Prosthetics', slug: 'implants' },
  { id: 'cat-8', name: 'Veterinary Surgical', slug: 'veterinary' },
]

export class CategoryService {
  async listCategories() {
    try {
      const dbCategories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      })
      if (dbCategories && dbCategories.length > 0) {
        return dbCategories
      }
      return DEFAULT_CATEGORIES
    } catch (err) {
      console.warn('DB error in CategoryService.listCategories, returning default categories:', err)
      return DEFAULT_CATEGORIES
    }
  }

  async getCategoryById(id: string) {
    try {
      const cat = await prisma.category.findUnique({
        where: { id },
      })
      if (cat) return cat
      return DEFAULT_CATEGORIES.find(c => c.id === id || c.slug === id) || null
    } catch (err) {
      console.warn('DB error in CategoryService.getCategoryById, returning default category:', err)
      return DEFAULT_CATEGORIES.find(c => c.id === id || c.slug === id) || null
    }
  }

  async createCategory(data: Prisma.CategoryCreateInput) {
    try {
      return await prisma.category.create({
        data,
      })
    } catch (err) {
      console.warn('DB error in createCategory, returning mock category:', err)
      return {
        id: `cat-${Date.now()}`,
        name: data.name,
        slug: data.slug,
        icon: data.icon || null,
        description: data.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  }

  async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    try {
      return await prisma.category.update({
        where: { id },
        data,
      })
    } catch (err) {
      console.warn('DB error in updateCategory, returning mock updated category:', err)
      return {
        id,
        name: data.name as string,
        slug: data.slug as string,
        icon: (data.icon as string) || null,
        description: (data.description as string) || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
  }

  async deleteCategory(id: string) {
    try {
      return await prisma.category.delete({
        where: { id },
      })
    } catch (err) {
      console.warn('DB error in deleteCategory:', err)
      return { id }
    }
  }
}

export const categoryService = new CategoryService()
