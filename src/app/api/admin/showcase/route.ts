import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_SHOWCASE_SLIDES, type ShowcaseItem } from '@/types'
import { auth } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SHOWCASE_FILE = path.join(DATA_DIR, 'showcase.json')

async function getShowcaseItems(): Promise<ShowcaseItem[]> {
  try {
    const raw = await fs.readFile(SHOWCASE_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // fallback to defaults if not created yet
  }
  return DEFAULT_SHOWCASE_SLIDES
}

async function saveShowcaseItems(items: ShowcaseItem[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(SHOWCASE_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const items = await getShowcaseItems()
    return NextResponse.json({ items })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch showcase items' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
    }

    const body = await req.json()
    const { items } = body

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload, expected array of items' }, { status: 400 })
    }

    await saveShowcaseItems(items as ShowcaseItem[])
    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('[Showcase API Error]:', error)
    return NextResponse.json({ error: 'Failed to save showcase items' }, { status: 500 })
  }
}
