import { ThemeProvider } from "@/components/theme-provider"
import { MotionProvider } from "@/components/motion-provider"
import { Dock } from "@/components/dock"
import type { Metadata } from "next"
import { routing } from "@/i18n/routing"
import { NextIntlClientProvider } from "next-intl"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = (await import(`../../messages/${locale}.ts`)).default
  const home = messages.home as Record<string, string>

  return {
    title: home.metaTitle,
    description: home.metaDescription,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, l === "en" ? "/" : `/${l}`])
      ),
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = (await import(`../../messages/${locale}.ts`)).default

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-background focus:shadow-md"
          >
            Skip to content
          </a>
          {children}
          <Dock />
        </MotionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
