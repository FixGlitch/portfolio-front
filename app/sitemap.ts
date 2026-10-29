import type { MetadataRoute } from "next"
import { getProjects, getSettings } from "@/lib/api"

const LOCALES = ["en", "es"] as const

// Mirrors i18n/routing.ts: English has no prefix, other locales do.
function localizedPath(locale: string, path: string) {
  const prefix = locale === "en" ? "" : `/${locale}`
  return `${prefix}${path === "/" ? "" : path}` || "/"
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If Strapi is down, still list the static pages rather than failing the whole sitemap.
  const base = await getSettings("en")
    .then((settings) => settings.siteUrl)
    .catch(() => undefined)
  const origin = (base ?? "http://localhost:3000").replace(/\/$/, "")

  const staticPaths = ["/", "/about", "/projects", "/contact"]
  const projectsByLocale: Record<string, string[]> = {}
  for (const locale of LOCALES) {
    projectsByLocale[locale] = await getProjects(locale)
      .then((projects) => projects.map((project) => project.slug))
      .catch(() => [] as string[])
  }

  const entries: MetadataRoute.Sitemap = []
  for (const locale of LOCALES) {
    const paths = [
      ...staticPaths,
      ...projectsByLocale[locale].map((slug) => `/projects/${slug}`),
    ]
    for (const path of paths) {
      entries.push({
        url: `${origin}${localizedPath(locale, path)}`,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${origin}${localizedPath(l, path)}`]),
          ),
        },
      })
    }
  }
  return entries
}
