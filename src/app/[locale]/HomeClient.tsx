'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import GenerateForm from '@/components/GenerateForm'
import community from './communityWorks'

interface FAQItem {
  q: string;
  a: string;
}

export default function HomeClient() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const t = useTranslations('home')
  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [steps, setSteps] = useState(20);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [batch_size, setBatchSize] = useState(4);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imageStatuses, setImageStatuses] = useState<Array<{
    status: 'pending' | 'success' | 'error';
    message: string;
    startTime?: number;
    endTime?: number;
  }>>([]);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const generateSectionRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  // Dreamify banner 显示控制
  const [showDreamifyBanner, setShowDreamifyBanner] = useState(true);

  // 示例图片数组
  const images = [
    '/images/demo-1.jpg',
    '/images/demo-2.jpg',
    '/images/demo-9.png',
    '/images/demo-4.jpg',
    '/images/demo-10.png',
    '/images/demo-6.jpg',
  ]

  // 自动轮播
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    timerRef.current = timer

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [images.length])

  // 手动切换图片时重置计时器
  const handleImageChange = (index: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setCurrentImageIndex(index)

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    timerRef.current = timer
  }

  // 模拟社区作品数据
  const communityWorks = community

  const handleGenerateSame = (promptText: string) => {
    setPrompt(promptText);
    if (promptRef.current) {
      promptRef.current.focus();
    }
    if (generateSectionRef.current) {
      generateSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGeneratedImages([])
    setImageStatuses(Array(batch_size).fill({ status: 'pending', message: t('generate.preview.generating') }))
    const images: string[] = Array(batch_size).fill('')

    const requests = Array(batch_size).fill(null).map((_, index) => {
      const startTime = Date.now();
      let retryCount = 0;
      const maxRetries = 2;

      const makeRequest = async () => {
        try {
          const res = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              width,
              height,
              steps,
              seed: seed ? parseInt(seed.toString()) : Math.floor(Math.random() * 100000000),
              batch_size,
            }),
          });

          if (res.status !== 200) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const data = await res.json();
          // Create a new promise to track image loading
          const imageLoadPromise = new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              const endTime = Date.now();
              const duration = ((endTime - startTime) / 1000).toFixed(1);
              images[index] = data.imageUrl;
              setGeneratedImages([...images]);
              setImageStatuses(prev => {
                const newStatuses = [...prev];
                newStatuses[index] = ({
                  status: 'success',
                  message: `${t('generate.preview.completed')} (${duration}s)`,
                  startTime,
                  endTime
                });
                return newStatuses;
              });
              resolve();
            };
            img.src = data.imageUrl;
          });
          await imageLoadPromise;
        } catch (err) {
          console.error(`生成图片失败 (尝试 ${retryCount + 1}/${maxRetries + 1}):`, err);

          if (retryCount < maxRetries) {
            retryCount++;
            setImageStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[index] = ({
                status: 'pending',
                message: `${t('generate.preview.retrying')} (${retryCount}/${maxRetries})`
              });
              return newStatuses;
            });
            // Wait for 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            return makeRequest();
          } else {
            setImageStatuses(prev => {
              const newStatuses = [...prev];
              newStatuses[index] = ({
                status: 'error',
                message: t('generate.preview.error')
              });
              return newStatuses;
            });
          }
        }
      };

      return makeRequest();
    });
    // 等待所有请求完成（可选，如果你想在全部完成后执行某些操作）
    await Promise.allSettled(requests);
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50">
      {/* Dreamify 顶部横幅推广 */}
      {showDreamifyBanner && (
        <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-500 via-primary-500 to-amber-400 text-white shadow-lg animate-fadeIn" style={{ minHeight: '48px' }}>
          <span className="flex-1 text-center text-sm sm:text-base font-medium">
            🚀 新一代免费AI绘画平台 <a
              href="https://dreamify.slmnb.cn/zh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold underline decoration-amber-200 text-black bg-white px-2 py-0.5 rounded"
            >Dreamify</a> 正式上线！支持文生图、图生图，多模型选择，体验更强大、更自由的创作！
          </span>
          <a
            href="https://dreamify.slmnb.cn/zh"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-4 py-1.5 rounded-full bg-white text-primary-600 font-semibold shadow hover:bg-amber-100 transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            立即体验
          </a>
          <button
            className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="关闭横幅"
            onClick={() => setShowDreamifyBanner(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <div className={showDreamifyBanner ? 'pt-16 sm:pt-14' : ''}>

        {/* 图片放大模态框 */}
        {zoomedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4"
            onClick={() => setZoomedImage(null)}
          >
            <div className="w-full max-w-4xl flex flex-col items-center">
              <button
                className="mb-4 text-white hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedImage(null);
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={zoomedImage}
                alt="Zoomed preview"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-primary-50 to-amber-50"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="flex items-center justify-center space-x-6 mb-12 transform hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/fluxEz-logo.png"
                  alt="FluxEz Logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <span className="text-6xl font-bold bg-gradient-to-br from-violet-600 via-primary-500 to-amber-500 bg-clip-text text-transparent">
                  FluxEz
                </span>
              </div>
              <div className="max-w-7xl mx-auto text-center">
                <h1 className="mb-6 flex items-center justify-center gap-4">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-800 break-words whitespace-nowrap">
                    {t('hero.titlePrefix')}
                  </span>
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent break-words whitespace-nowrap">
                    {t('hero.titleHighlight')}
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  {t('hero.subtitle.prefix')}
                  <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent px-1">
                    {t('hero.subtitle.highlight')}
                  </span>
                  {t('hero.subtitle.suffix')}
                </p>
                <p className="text-xl text-gray-600 mb-8">
                  {t('hero.subtitle2')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    document.getElementById('generate-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="btn-primary px-8 py-3 text-lg rounded-full"
                >
                  {t('hero.startButton')}
                </button>
                <button
                  onClick={() => {
                    document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="btn-secondary px-8 py-3 text-lg rounded-full"
                >
                  {t('hero.faqButton')}
                </button>
              </div>
            </div>

            {/* Image Showcase with Carousel */}
            <div className="relative max-w-7xl mx-auto">
              <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                {images.map((src, index) => (
                  <div
                    key={src}
                    className={`absolute inset-0 transition-opacity duration-700 ${currentImageIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    <Image
                      src={src}
                      alt={`AI生成的图像示例 ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 1536px) 100vw, 1536px"
                    />
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                {/* 大屏幕显示完整控件 */}
                <div className="hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-lg">
                  <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {t('hero.imageCaption')}
                  </p>
                  <div className="h-4 w-[1px] bg-gray-300"></div>
                  <div className="flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentImageIndex === index
                          ? 'bg-primary-500 w-4'
                          : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        aria-label={`切换到图片 ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* 小屏幕只显示指示器 */}
                <div className="md:hidden flex gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex === index
                        ? 'bg-primary-500 w-3'
                        : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      aria-label={`切换到图片 ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => handleImageChange(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 md:p-3 shadow-lg transition-all hover:scale-110"
                aria-label="上一张图片"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleImageChange(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 md:p-3 shadow-lg transition-all hover:scale-110"
                aria-label="下一张图片"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Generate Section */}
        <section id="generate-section" ref={generateSectionRef} className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{t('generate.title')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
              <div className="md:col-span-3">
                <GenerateForm
                  prompt={prompt}
                  setPrompt={setPrompt}
                  width={width}
                  setWidth={setWidth}
                  height={height}
                  setHeight={setHeight}
                  steps={steps}
                  setSteps={setSteps}
                  seed={seed}
                  setSeed={setSeed}
                  batch_size={batch_size}
                  setBatchSize={setBatchSize}
                  status="authenticated"
                  onGenerate={handleGenerate}
                  isAdvancedOpen={isAdvancedOpen}
                  setIsAdvancedOpen={setIsAdvancedOpen}
                  promptRef={promptRef}
                  communityWorks={communityWorks}
                  isGenerating={isGenerating}
                />
              </div>
              <div className="md:col-span-4 bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-white/80">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">{t('generate.preview.title')}</h2>
                  {generatedImages && generatedImages.length > 0 && (
                    <button
                      onClick={() => {
                        generatedImages.forEach((image, index) => {
                          const link = document.createElement('a');
                          link.href = image;
                          link.download = `generated-image-${index + 1}.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        });
                      }}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      {t('generate.preview.download')}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: batch_size }).map((_, index) => (
                    <div key={index} className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
                      {generatedImages[index] && (
                        <img
                          src={generatedImages[index]}
                          alt={`Generated ${index + 1}`}
                          className="w-full h-full object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
                          onClick={() => setZoomedImage(generatedImages[index])}
                        />
                      )}
                      <div className={`absolute bottom-0 left-0 right-0 p-2 text-center text-sm ${imageStatuses[index]?.status === 'error'
                        ? 'bg-red-100 text-red-700'
                        : imageStatuses[index]?.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                        {imageStatuses[index]?.message}
                      </div>
                      {isGenerating && !imageStatuses[index]?.status && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                        </div>
                      )}
                      {!isGenerating && !imageStatuses[index]?.status && !generatedImages[index] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-gray-400">{t('generate.preview.placeholder')}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-500">
                  {t('generate.preview.hint')}
                </div>
                {imageStatuses.length > 0 && (
                  <div className="mt-2 text-center text-sm">
                    <span className="text-blue-600">
                      {imageStatuses.filter(status => status.status === 'pending').length}
                    </span>
                    {t('generate.preview.status.generating')}
                    <span className="text-green-600 mx-2">
                      {imageStatuses.filter(status => status.status === 'success').length}
                    </span>
                    {t('generate.preview.status.success')}
                    <span className="text-red-600 mx-2">
                      {imageStatuses.filter(status => status.status === 'error').length}
                    </span>
                    {t('generate.preview.status.failed')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              {t('features.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card text-center">
                <div className="text-primary-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('features.speed.title')}</h3>
                <p className="text-gray-600">{t('features.speed.description')}</p>
              </div>
              <div className="card text-center">
                <div className="text-primary-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('features.customization.title')}</h3>
                <p className="text-gray-600">{t('features.customization.description')}</p>
              </div>
              <div className="card text-center">
                <div className="text-primary-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('features.security.title')}</h3>
                <p className="text-gray-600">{t('features.security.description')}</p>
              </div>
              <div className="card text-center">
                <div className="text-primary-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('features.noLogin.title')}</h3>
                <p className="text-gray-600">{t('features.noLogin.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <button
              onClick={() => {
                document.getElementById('community-showcase')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                })
              }}
              className="btn-primary px-8 py-3 text-lg inline-block"
            >
              {t('cta.button')}
            </button>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              {t('faq.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {t.raw('faq.questions').map((qa: FAQItem, index: number) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-4">Q{index + 1}: {qa.q}</h3>
                  <p className="text-gray-600 pl-4 border-l-2 border-primary-500">{qa.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Showcase Section */}
        <section id="community-showcase" className="py-16 bg-white/95">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('community.title')}</h2>
              <p className="text-xl text-gray-600">{t('community.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityWorks.map((work) => (
                <div key={work.id} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={work.image}
                      alt={`Community work ${work.id}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <p className="text-white text-sm mb-4 line-clamp-3">{work.prompt}</p>
                      <button
                        onClick={() => handleGenerateSame(work.prompt)}
                        className="w-full py-2 px-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        {t('community.generateSame')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="suanleme-section" className="py-16 bg-gradient-to-br from-violet-50 via-primary-50 to-amber-50">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <p className="text-gray-600 text-sm mb-4">
                {t('suanleme.title')}
              </p>
              <div className="flex justify-center items-center gap-8">
                <a
                  href="https://gongjiyun.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img
                    src="https://gongjiyun.com/logo.png"
                    alt={t('suanleme.gongji')}
                    className="h-10"
                  />
                </a>
                <a
                  href="https://suanleme.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  <img
                    src="https://suanleme.cn/logo.svg"
                    alt={t('suanleme.suanleme')}
                    className="h-10"
                  />
                </a>
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-16">
              <div className="w-full md:w-2/5 max-w-xl">
                <div className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg p-10 shadow-xl">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">{t('suanleme.advantages.title')}</h3>
                  <ul className="space-y-5 text-gray-600">
                    {t.raw('suanleme.advantages.items').map((item: string, index: number) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="text-amber-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="https://suanleme.cn"
                    target="_blank"
                    className="mt-10 w-full inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-md text-white text-center hover:translate-y-[-2px] transition-all duration-200 shadow-lg shadow-amber-900/20"
                  >
                    {t('suanleme.advantages.button')}
                  </a>
                </div>
              </div>
              <div className="w-full md:w-3/5">
                <img
                  src="https://suanleme.cn/cover.png"
                  alt={t('suanleme.suanleme')}
                  className="w-full rounded-lg shadow-2xl border border-amber-200"
                />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
} 