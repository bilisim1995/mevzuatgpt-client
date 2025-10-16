import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY missing' }, { status: 500 })
    }

    const contentType = req.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Expected application/json body' }, { status: 400 })
    }

    const body = await req.json().catch(() => ({})) as { text?: string, voice?: string, format?: 'mp3'|'wav'|'ogg', speed?: number }
    const text = (body?.text || '').toString().trim()
    if (!text) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const voice = (body.voice || 'alloy') as string
    const format = (body.format || 'mp3') as 'mp3'|'wav'|'ogg'
    const speed = typeof body.speed === 'number' ? Math.max(0.5, Math.min(2.0, body.speed)) : 1.0

    // OpenAI TTS: gpt-4o-mini-tts
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-tts',
        input: text,
        voice,
        format,
        speed
      })
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => 'Unknown error')
      return NextResponse.json({ error: 'OpenAI TTS failed', details: errText }, { status: 502 })
    }

    const arrayBuffer = await res.arrayBuffer()
    const mime = format === 'mp3' ? 'audio/mpeg' : (format === 'wav' ? 'audio/wav' : 'audio/ogg')
    return new Response(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'no-store'
      }
    })
  } catch (err: any) {
    return NextResponse.json({ error: 'TTS failed', details: err?.message || String(err) }, { status: 500 })
  }
}


