import type { Metadata } from "next"
import { getMessages } from "next-intl/server"
import { PageShell } from "@/components/templates/page-shell"
import { AboutTemplate } from "@/components/templates/about-template"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale }).catch(() => null)
  const about = (messages?.about ?? {}) as Record<string, string>

  return {
    title: about.metaTitle,
    description: about.metaDescription,
  }
}

export default async function AboutPage() {
  return (
    <PageShell>
      <AboutTemplate />
    </PageShell>
  )
}
