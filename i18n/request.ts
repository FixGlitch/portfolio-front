import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"
import { getContent } from "@/lib/api"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  const content = await getContent(locale)

  return {
    locale,
    messages: {
      nav: content.nav,
      common: content.common,
      home: content.home,
      about: content.about,
      contact: content.contact,
      projects: content.projects,
    },
  }
})
