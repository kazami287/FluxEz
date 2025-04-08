'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export default function LanguageSwitch() {
  const locale = useLocale()
  const router = useRouter()

  const switchLanguage = (newLocale: string) => {
    // 获取当前路径
    const currentPath = window.location.pathname
    // 移除当前语言前缀
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '')
    // 构建新的URL
    const newPath = `/${newLocale}${pathWithoutLocale || '/'}`
    router.push(newPath)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900">
        <span>{locale === 'zh' ? '中文' : 'English'}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <button
          onClick={() => switchLanguage('zh')}
          className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
            locale === 'zh' ? 'text-primary-600 font-medium' : 'text-gray-700'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
            locale === 'en' ? 'text-primary-600 font-medium' : 'text-gray-700'
          }`}
        >
          English
        </button>
      </div>
    </div>
  )
} 