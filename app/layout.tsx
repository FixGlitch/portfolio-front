import type { Metadata, Viewport } from "next"
import { Geist, Fira_Code } from "next/font/google"
import { getLocale } from "next-intl/server"
import { getSettings } from "@/lib/api"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export async function generateMetadata(): Promise<Metadata> {
  // Metadata must not take the whole page down when Strapi is unreachable.
  const siteUrl = await getSettings("en")
    .then((settings) => settings.siteUrl)
    .catch(() => undefined)
  return {
    metadataBase: new URL(siteUrl ?? "http://localhost:3000"),
    title: "Lucas Blanco, Desarrollador Fullstack",
    description:
      "Desarrollador fullstack con más de 6 años de experiencia. Frontend, backend, bases de datos y todo lo que conecta ambas puntas.",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
        { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
  }
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // getLocale runs the i18n request config, which fetches content. Fall back so <html lang> still renders.
  const locale = await getLocale().catch(() => "en")
  return (
    <html lang={locale} suppressHydrationWarning className={`${geistSans.variable} ${firaCode.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
