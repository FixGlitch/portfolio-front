import { strapiFetch } from "./strapi"

type SettingsEntry = {
  siteName?: string
  siteUrl?: string
  email?: string
  github?: string
  linkedin?: string
  location?: string
}

export async function getSettings(locale: string): Promise<Record<string, string> | null> {
  const locales = [locale, "en"]

  for (const l of locales) {
    const res = await strapiFetch<{ data: SettingsEntry | null }>(`/site-settings?locale=${l}`)
    if (res?.data) {
      return Object.fromEntries(
        Object.entries(res.data).filter(([, v]) => typeof v === "string")
      ) as Record<string, string>
    }
  }

  return null
}
