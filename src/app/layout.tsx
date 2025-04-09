import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from '@/components/Providers'
import { getTranslations } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations('site')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={params.locale}>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
