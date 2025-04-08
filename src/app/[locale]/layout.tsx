import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'

// 可以选择性地设置缓存时间
async function getMessages(locale: string) {
  try {
    return (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    console.error('Failed to fetch messages:', error)
    notFound()
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await Promise.resolve(params);
  const messages = await getMessages(locale)

  return (
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </NextIntlClientProvider>
  )
}