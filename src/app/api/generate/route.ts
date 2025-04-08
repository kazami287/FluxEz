import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prompt, seed, width, height, steps } = await req.json()

    // Validate input
    if (!prompt) {
      return NextResponse.json(
        { message: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Call your image generation API
    const response = await fetch(process.env.IMAGE_GENERATION_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.IMAGE_GENERATION_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        seed,
        width,
        height,
        steps,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate image')
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 