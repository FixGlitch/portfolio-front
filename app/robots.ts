import type { MetadataRoute } from "next"
import { getSettings } from "@/lib/api"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getSettings("en")
    .then((settings) => settings.siteUrl)
    .catch(() => undefined)
  const origin = (base ?? "http://localhost:3000").replace(/\/$/, "")

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${origin}/sitemap.xml`,
  }
}
