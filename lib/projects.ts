import { prisma } from "./prisma"

export type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] }

export type Project = {
  slug: string
  title: string
  summary: string
  subtitle?: string
  tags: string[]
  metaDescription: string
  content: Block[]
  image?: string | null
}

function parseProjectData(raw: Record<string, string>): Project {
  return {
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary,
    subtitle: raw.subtitle || undefined,
    tags: (() => {
      try { return JSON.parse(raw.tags || "[]") as string[] } catch { return [] }
    })(),
    metaDescription: raw.metaDescription,
    content: (() => {
      try { return JSON.parse(raw.content || "[]") as Block[] } catch { return [] }
    })(),
    image: raw.image || null,
  }
}

export async function getProjects(locale: string = "en"): Promise<Project[]> {
  const entries = await prisma.entry.findMany({
    where: {
      contentTypeId: "collectionType.project",
      locale,
      published: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return entries.map((e: { data: unknown }) => parseProjectData(e.data as Record<string, string>))
}

export async function getProject(slug: string, locale: string = "en"): Promise<Project | undefined> {
  const entry = await prisma.entry.findFirst({
    where: {
      contentTypeId: "collectionType.project",
      locale,
      published: true,
      data: { path: ["slug"], equals: slug },
    },
  })

  if (!entry) return undefined
  return parseProjectData(entry.data as Record<string, string>)
}
