'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import LanguageSwitch from '@/components/LanguageSwitch'
import { transferUrl } from '@/utils/locale'

export default function HomeClient() {
  const { data: session, status } = useSession()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const t = useTranslations('home')
  
  // 示例图片数组
  const images = [
    '/images/demo-1.jpg',
    '/images/demo-2.jpg',
    '/images/demo-3.jpg',
    '/images/demo-4.jpg',
    '/images/demo-5.jpg',
    '/images/demo-6.jpg',
  ]

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length])

  const getStartLink = () => {
    if (status === 'loading') return '#'
    return session ? '/generate' : '/login'
  }

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 opacity-20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href={transferUrl(getStartLink())} 
                className={`btn-primary px-8 py-3 text-lg ${
                  status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {t('hero.startButton')}
              </Link>
              <Link 
                href={transferUrl('generate')} 
                className="btn-secondary px-8 py-3 text-lg"
              >
                {t('hero.faqButton')}
              </Link>
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
                      onClick={() => setCurrentImageIndex(index)}
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
                    onClick={() => setCurrentImageIndex(index)}
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
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 md:p-3 shadow-lg transition-all hover:scale-110"
              aria-label="上一张图片"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          <Link 
            href="/register" 
            className="btn-primary px-8 py-3 text-lg inline-block"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  )
} 