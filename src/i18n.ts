import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from './config';

export default getRequestConfig(async ({locale}) => {
  const activeLocale = locale || defaultLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(activeLocale as any)) {
    console.log('无效的语言：', locale);
    notFound();
  }

  console.log('正在加载语言包：', activeLocale);
  return {
    messages: (await import(`@/messages/${activeLocale}.json`)).default,
    timeZone: 'Asia/Shanghai',
    now: new Date(),
    locale: activeLocale as string
  };
}); 