'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function GeneratePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const t = useTranslations('generate')
  
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState('')
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [steps, setSteps] = useState(20)
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!session) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate inputs
      if (width < 64 || width > 1024 || height < 64 || height > 1024) {
        throw new Error(t('error.invalidSize'))
      }
      if (steps < 1 || steps > 100) {
        throw new Error(t('error.invalidSteps'))
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          seed: seed ? parseInt(seed) : undefined,
          width,
          height,
          steps,
        }),
      })

      if (!response.ok) {
        throw new Error(t('error.general'))
      }

      const data = await response.json()
      setImage(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.general'))
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{t('title')}</h1>
        <p className="text-gray-600 mb-8">{t('description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="form-group">
                <label className="form-label">{t('form.prompt.label')}</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('form.prompt.placeholder')}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('form.seed.label')}</label>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={t('form.seed.placeholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">{t('form.width.label')}</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value))}
                    min={64}
                    max={1024}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('form.height.label')}</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    min={64}
                    max={1024}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('form.steps.label')}</label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(parseInt(e.target.value))}
                  min={1}
                  max={100}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? t('form.generateButton.loading') : t('form.generateButton.default')}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">{t('preview.title')}</h2>
            <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
              {image ? (
                <img
                  src={`data:image/png;base64,${image}`}
                  alt="Generated"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">{t('preview.placeholder')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 