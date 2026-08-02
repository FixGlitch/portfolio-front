import type { Metadata } from "next"
import { getMessages } from "next-intl/server"
import { NextIntlClientProvider } from "next-intl"
import { routing } from "@/i18n/routing"
import { BaseLayout } from "@/components/templates/base-layout"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const home = (messages.home ?? {}) as Record<string, string>

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
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <BaseLayout>{children}</BaseLayout>
    </NextIntlClientProvider>
  )
}
