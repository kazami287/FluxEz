import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getTranslations } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('site')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }> | undefined
}) {
  const locale = (await Promise.resolve(params))?.locale || 'zh';

  return (
    <html lang={locale}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
