'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { transferUrl } from '@/utils/locale'
import { useParams, useRouter } from 'next/navigation'

interface FAQItem {
  q: string;
  a: string;
}

export default function HomeClient() {
  const { data: session, status } = useSession()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const t = useTranslations('home')
  const router = useRouter()
  
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

  const getStartLink = () => {
    if (status === 'loading') return '#'
    return session ? '/generate' : '/login'
  }

  // 模拟社区作品数据
  const communityWorks = [
    { id: 1, image: '/images/demo-1.jpg', prompt: 'best quality,a cute anime girl,sunshine,soft features,swing,a blue white-edged dress,solo,flower,blue eyes,blush,blue flower,long hair,barefoot,sitting,looking at viewer,blue rose,blue theme,rose,light particles,pale skin,blue background,off shoulder,full body,smile,collarbone,long hair,blue hair,vines,plants,' },
    { id: 2, image: '/images/demo-2.jpg', prompt: 'The city, veiled under storm clouds, cracks open—a thread of radiance spills. On the sloping pavement, a girl with rose-tinted hair rises on her toes, her red-and-white sundress a fleeting bloom against the gloom, eyes fixed on the faraway light.' },
    { id: 3, image: '/images/demo-3.jpg', prompt: 'Skyscraper windows— a thousand fractured sunsets, a thousand pink-haired girls. Her fingertips meet cold glass, but the reflections start blinking out of rhythm. with shafts of folded darkness.' },
    { id: 4, image: '/images/demo-4.jpg', prompt: 'Golden light spills over the meadow. The maid, her hair the color of summer sky, cradles him in her lap— his dark strands mingling with the green beneath, a single stalk of grass between his teeth' },
    { id: 5, image: '/images/demo-5.jpg', prompt: 'Skyscraper windows— a thousand fractured sunsets, a thousand pink-haired girls. Her fingertips meet cold glass, but the reflections start blinking out of rhythm. with shafts of folded darkness.' },
    { id: 6, image: '/images/demo-6.jpg', prompt: 'Fluorescent lights strip them bare— commuters glide through turnstiles, their skeletons clattering like wind chimes. When she crouches down, the moon caught in her ribs flickers in time with her panic.' },
    { id: 7, image: '/images/demo-7.png', prompt: 'Sunlight, grass, A girl lies in the meadow, smiling softly, a blade of grass between her lips.' },
    { id: 8, image: '/images/demo-8.png', prompt: 'Sunlight, dappled shadows, a windchime’s lazy song,The girl dozes off on the porch swing,her straw hat tilted over her eyes—a melting popsicle stick abandoned on the floor,as the summer day hums her to sleep,' },
    { id: 9, image: '/images/demo-9.png', prompt: 'Neon-Coke™ in the Cryo Wastes,The last carbonated relic of the old world,its bio-luminescent syrup throbbing against permafrost—a corporate logo half-scratched off,stll whispering "Drink Me" in binary,' },
    { id: 10, image: '/images/demo-10.png', prompt: 'The rusted leviathan hovers, its belly gnawing on a shipwreck—rain sluicing off corroded brass plates, On the rooftop, the old fisherman casts his magnetic line,hauling in flickering spinal circuits to add to his bucket of glowing bolts' },
    { id: 11, image: '/images/demo-11.png', prompt: 'The tree consumes its own rings by sunrise, Today it regurgitates a headstone—the caretaker’s name in crooked chalk letters,plus a child’s shoe,still warm,' },
    { id: 12, image: '/images/demo-12.png', prompt: 'Books slip free from their shelves,drifting like slow-motion fireworks,The librarian’s ladder wobbles as she lunges—"A Brief History of the World" escapes again,shedding Sumerian dust and a 1943 bullet casing' },
  ]

  const { locale } = useParams()
  const handleGenerateSame = (prompt: string) => {
    let originUrl = `generate?prompt=${encodeURIComponent(prompt)}`
    console.log(originUrl)
    router.push(transferUrl(originUrl, locale))
  }

  return (
    <div className="min-h-screen">

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
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-800">
                  {t('hero.titlePrefix')}
                </span>
                <span className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={transferUrl(getStartLink(), locale)} 
                className={`btn-primary px-8 py-3 text-lg rounded-full ${
                  status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {t('hero.startButton')}
              </Link>
              <button 
                onClick={() => {
                  document.getElementById('faq-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  })
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
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    currentImageIndex === index ? 'opacity-100' : 'opacity-0'
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
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentImageIndex === index
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
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
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
      <section id="community-showcase" className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
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
    </div>
  )
} 