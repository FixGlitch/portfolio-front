"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTranslations } from "next-intl"
import { Dock } from "@/components/organisms/dock"

export function BaseLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("common")

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-background focus:shadow-md"
        >
          {t("skipToContent")}
        </a>
        {children}
        <Dock />
      </MotionConfig>
    </NextThemesProvider>
  )
}
