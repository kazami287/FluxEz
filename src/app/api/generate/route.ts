import { NextResponse } from 'next/server'
import { generateImage } from '@/utils/comfyApi'

const COMFYUI_API_URL = "https://lastapi-light1-last.550w.run"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, width, height, steps, seed, batch_size } = body

    // 验证输入
    if (width < 64 || width > 1024 || height < 64 || height > 1024) {
      return NextResponse.json({ error: 'Invalid image dimensions' }, { status: 400 })
    }
    if (steps < 15 || steps > 30) {
      return NextResponse.json({ error: 'Invalid steps value' }, { status: 400 })
    }

    // 调用 ComfyUI API
    const imageUrl = await generateImage({
      prompt,
      width,
      height,
      steps,
      seed: seed ? parseInt(seed) : undefined,
      batch_size
    }, COMFYUI_API_URL || '')

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    )
  }
} 