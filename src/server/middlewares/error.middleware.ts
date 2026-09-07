import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function handleApiError(error: unknown, contextName = 'API'): NextResponse {
  console.error(`[${contextName}] Error:`, error)

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.flatten() },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    if (error.message.includes('Insufficient stock')) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
}
