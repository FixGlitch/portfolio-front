import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { AboutClient } from "./about-client"
import { getMessages } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const about = messages.about as Record<string, string>

  return {
    title: about.metaTitle,
    description: about.metaDescription,
  }
}

export default function AboutPage() {
  return (
    <PageShell>
      <AboutClient />
    </PageShell>
  )
}
