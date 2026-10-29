"use server"

import { headers } from "next/headers"
import { STRAPI_URL } from "./api"

export type ContactResult = "ok" | "validation" | "rate_limited" | "error"

type ContactInput = {
  name: string
  email: string
  message: string
  website: string
}

// Runs on the server so the Strapi URL and request IP handling stay out of the browser.
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  try {
    // Strapi sees this server's IP, so the visitor's IP goes along, signed with a shared secret.
    const requestHeaders = await headers()
    const clientIp = requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() || requestHeaders.get("x-real-ip")
    const secret = process.env.CONTACT_PROXY_SECRET
    const proxyHeaders: Record<string, string> =
      secret && clientIp ? { "x-contact-client-ip": clientIp, "x-contact-proxy-secret": secret } : {}

    const res = await fetch(`${STRAPI_URL}/api/contact-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...proxyHeaders },
      body: JSON.stringify({
        data: {
          name: input.name,
          email: input.email,
          message: input.message,
          "contact-website": input.website,
        },
      }),
      cache: "no-store",
    })

    if (res.ok) return "ok"
    if (res.status === 400) return "validation"
    if (res.status === 429) return "rate_limited"
    return "error"
  } catch {
    return "error"
  }
}
