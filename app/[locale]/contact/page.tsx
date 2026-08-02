import type { Metadata } from "next"
import { PageShell } from "@/components/page-shell"
import { ContactClient } from "./contact-client"
import { getContentMessages, getSettings } from "@/lib/content"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getContentMessages(locale)
  const contact = messages.contact as Record<string, string>

  return {
    title: contact.metaTitle,
    description: contact.metaDescription,
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const settings = await getSettings(locale)

  return (
    <PageShell>
      <ContactClient settings={settings} />
    </PageShell>
  )
}
