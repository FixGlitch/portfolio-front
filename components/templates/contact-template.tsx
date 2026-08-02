"use client"

import { ContactHero } from "@/components/organisms/contact-hero"
import type { Settings } from "@/lib/api"

export function ContactTemplate({ settings }: { settings: Settings }) {
  return <ContactHero settings={settings} />
}
