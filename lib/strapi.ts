export const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"

export type StrapiImage = {
  url: string
  alternativeText?: string | null
}

export type StrapiMedia = {
  data: StrapiImage | null
}

export type StrapiRawImage = {
  url?: string
  alternativeText?: string | null
  formats?: Record<string, { url: string }> | null
}

export type StrapiBlock =
  | { type: "heading"; level: number; children: { type: "text"; text: string }[] }
  | { type: "paragraph"; children: { type: "text"; text: string }[] }
  | { type: "list"; format: "ordered" | "unordered"; children: { type: "list-item"; children: { type: "text"; text: string }[] }[] }

export async function strapiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 * 60, tags: ["content"] },
  })
  if (!res.ok) throw new Error(`Strapi ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export function imageUrl(image: StrapiMedia | StrapiRawImage | null | undefined): string | null {
  const url = (image as StrapiMedia | null | undefined)?.data?.url ?? (image as StrapiRawImage | null | undefined)?.url
  if (!url) return null
  return url.startsWith("/") ? `${STRAPI_URL}${url}` : url
}
