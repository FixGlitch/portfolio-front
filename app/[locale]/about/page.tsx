import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { AboutClient } from "./about-client"
import { getContentMessages } from "@/lib/content"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getContentMessages(locale)
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
