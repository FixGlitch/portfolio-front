import type { Metadata } from "next"
import { getMessages } from "next-intl/server"
import { PageShell } from "@/components/templates/page-shell"
import { ContactTemplate } from "@/components/templates/contact-template"
import { getSettings } from "@/lib/api"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const contact = (messages.contact ?? {}) as Record<string, string>

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
      <ContactTemplate settings={settings} />
    </PageShell>
  )
}
