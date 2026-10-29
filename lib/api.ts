import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337"

export function imageUrl(url: string | null | undefined): string {
  if (!url) return ""
  if (url.startsWith("http")) return url
  return `${STRAPI_URL}${url.startsWith("/") ? url : `/${url}`}`
}

// Thrown when Strapi cannot be reached or fails. Lets the error boundary show a
// proper "unavailable" state instead of rendering pages with missing text.
export class ContentUnavailableError extends Error {
  constructor() {
    super("Strapi content is unavailable")
    this.name = "ContentUnavailableError"
  }
}

// Returns null for missing data (4xx); throws ContentUnavailableError when Strapi is down (network or 5xx).
export async function strapiFetch<T>(
  path: string,
  params?: Record<string, string>,
): Promise<T | null> {
  const search = new URLSearchParams(params)
  let res: Response
  try {
    res = await fetch(`${STRAPI_URL}/api${path}?${search.toString()}`, {
      next: { revalidate: 60 },
    })
  } catch {
    throw new ContentUnavailableError()
  }
  if (res.status >= 500) throw new ContentUnavailableError()
  if (!res.ok) return null
  const json = await res.json()
  return (json?.data ?? null) as T | null
}

const STRAPI_META_KEYS = ["id", "documentId", "locale", "publishedAt", "createdAt", "updatedAt"]

export type Settings = {
  siteName?: string
  siteUrl?: string
  email?: string
  github?: string
  linkedin?: string
  location?: string
}

export type ContentMessages = {
  nav: Record<string, string>
  common: Record<string, string>
  home: Record<string, unknown>
  about: Record<string, unknown>
  contact: Record<string, string>
  projects: Record<string, string>
}

export type Content = ContentMessages & { settings: Settings }

function clean<T>(data: unknown): T {
  if (!data || typeof data !== "object") return {} as T
  const rest: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (!STRAPI_META_KEYS.includes(key)) rest[key] = value
  }
  return rest as T
}

export async function getContent(locale: string): Promise<Content> {
  const data = clean<Record<string, unknown>>(await strapiFetch("/content", { locale }))

  return {
    settings: (data.settings ?? {}) as Settings,
    nav: (data.nav ?? {}) as Record<string, string>,
    common: (data.common ?? {}) as Record<string, string>,
    home: (data.home ?? {}) as Record<string, unknown>,
    about: (data.about ?? {}) as Record<string, unknown>,
    contact: (data.contact ?? {}) as Record<string, string>,
    projects: (data.projects ?? {}) as Record<string, string>,
  }
}

export async function getSettings(locale: string): Promise<Settings> {
  const content = await getContent(locale)
  return content.settings
}

export type Block = {
  type: "h2" | "h3" | "p" | "ol" | "ul"
  text?: string
  items?: string[]
}

export type Project = {
  slug: string
  title: string
  subtitle: string | null
  summary: string
  metaDescription: string | null
  tags: string[]
  image: string
  content: Block[]
}

type SlateNode = {
  type?: string
  text?: string
  level?: number
  format?: string
  children?: SlateNode[]
}

function inlineText(node: SlateNode): string {
  if (node.type === "text") return node.text ?? ""
  return (node.children ?? []).map(inlineText).join("")
}

export function convertBlocks(content: unknown): Block[] {
  if (!Array.isArray(content)) return []
  const blocks: Block[] = []
  for (const node of content as SlateNode[]) {
    switch (node.type) {
      case "paragraph":
        blocks.push({ type: "p", text: (node.children ?? []).map(inlineText).join("") })
        break
      case "heading":
        blocks.push({ type: node.level === 3 ? "h3" : "h2", text: (node.children ?? []).map(inlineText).join("") })
        break
      case "list":
        blocks.push({
          type: node.format === "ordered" ? "ol" : "ul",
          items: (node.children ?? []).map((item) => inlineText(item)),
        })
        break
    }
  }
  return blocks
}

function mapProject(raw: Record<string, unknown>): Project {
  const image = raw.image as { url?: string } | null | undefined
  return {
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    subtitle: raw.subtitle ? String(raw.subtitle) : null,
    summary: String(raw.summary ?? ""),
    metaDescription: raw.metaDescription ? String(raw.metaDescription) : null,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    image: imageUrl(image?.url),
    content: convertBlocks(raw.content),
  }
}

async function fetchProjects(locale: string, params: Record<string, string> = {}): Promise<Project[]> {
  const data = await strapiFetch<Record<string, unknown>[]>("/projects", {
    locale,
    populate: "image",
    ...params,
  })
  return (data ?? []).map(mapProject)
}

export async function getProjects(locale: string): Promise<Project[]> {
  let projects = await fetchProjects(locale)
  if (projects.length === 0 && locale !== "en") {
    projects = await fetchProjects("en")
  }
  return projects
}

export async function getProject(slug: string, locale: string): Promise<Project | null> {
  const filter = { "filters[slug][$eq]": slug }
  let [project] = await fetchProjects(locale, filter)
  if (!project && locale !== "en") {
    ;[project] = await fetchProjects("en", filter)
  }
  return project ?? null
}
