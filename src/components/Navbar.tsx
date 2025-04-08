'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import LanguageSwitch from './LanguageSwitch'
import { transferUrl } from '@/utils/locale'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const t = useTranslations('nav')

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-500">
            FluxEz
          </Link>

          <div className="flex items-center space-x-6">
            {session ? (
              <>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  {t('signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={transferUrl('login')}
                  className={`text-gray-600 hover:text-primary-500 transition-colors ${
                    isActive('/login') ? 'text-primary-500 font-medium' : ''
                  }`}
                >
                  {t('login')}
                </Link>
              </>
            )}
          </div>
          {/* Language Switch */}
          <div className="absolute top-4 right-4 z-50">
            <LanguageSwitch />
          </div>
        </div>
      </div>
    </nav>
  )
} 