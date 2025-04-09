'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GeneratePage() {
  const t = useTranslations('generate')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState('')
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [steps, setSteps] = useState(20)
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // 从URL参数中获取prompt并设置到输入框
  useEffect(() => {
    const promptFromUrl = searchParams.get('prompt')
    if (promptFromUrl) {
      setPrompt(decodeURIComponent(promptFromUrl))
    }
  }, [searchParams])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Form Section */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5">
            <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-white/80">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="form-label text-gray-700">{t('form.prompt.label')}</label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('form.prompt.placeholder')}
                    rows={12}
                    className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all resize-none text-lg"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{showAdvanced ? t('form.advanced.collapse') : t('form.advanced.expand')}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className={`space-y-6 transition-all duration-300 ${showAdvanced ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                  <div className="form-group">
                    <label className="form-label text-gray-700">{t('form.seed.label')}</label>
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(e.target.value)}
                      placeholder={t('form.seed.placeholder')}
                      className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label text-gray-700">{t('form.width.label')}</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                        min={64}
                        max={1024}
                        className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label text-gray-700">{t('form.height.label')}</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        min={64}
                        max={1024}
                        className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-gray-700">{t('form.steps.label')}</label>
                    <input
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value))}
                      min={1}
                      max={100}
                      className="w-full rounded-xl border-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-violet-500 text-white font-medium hover:from-primary-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('form.generateButton.loading') : t('form.generateButton.default')}
                </button>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-7">
            <div className="bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-white/80">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">{t('preview.title')}</h2>
              <div className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
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
                        className="w-20 h-20 mx-auto"
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
                    <p className="text-gray-500 text-lg">{t('preview.placeholder')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 