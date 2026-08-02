import { strapiFetch, imageUrl, type StrapiRawImage, type StrapiBlock } from "./strapi"

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

type StrapiProject = {
  slug: string
  title: string
  summary: string
  subtitle?: string | null
  tags: string[] | null
  metaDescription: string | null
  content: StrapiBlock[] | null
  image: StrapiRawImage | null
}

type StrapiListResponse = { data: StrapiProject[] }

function toBlocks(blocks: StrapiBlock[] | null): Block[] {
  if (!blocks) return []

  const out: Block[] = []
  for (const block of blocks) {
    switch (block.type) {
      case "heading": {
        const text = block.children.map((c) => c.text).join("")
        out.push({ type: block.level === 3 ? "h3" : "h2", text })
        break
      }
      case "paragraph": {
        const text = block.children.map((c) => c.text).join("")
        if (text) out.push({ type: "p", text })
        break
      }
      case "list": {
        const items = block.children.map((c) => c.children.map((i) => i.text).join(""))
        out.push({ type: block.format === "ordered" ? "ol" : "ul", items })
        break
      }
    }
  }
  return out
}

function parseProject(raw: StrapiProject): Project {
  return {
    slug: raw.slug,
    title: raw.title,
    summary: raw.summary,
    subtitle: raw.subtitle || undefined,
    tags: raw.tags ?? [],
    metaDescription: raw.metaDescription ?? "",
    content: toBlocks(raw.content),
    image: imageUrl(raw.image),
  }
}

const projectParams = "&sort[0]=createdAt:asc&populate=*"

export async function getProjects(locale: string = "en"): Promise<Project[]> {
  const locales = [locale, "en"]

  for (const l of locales) {
    const res = await strapiFetch<StrapiListResponse>(`/projects?locale=${l}${projectParams}`)
    if (res.data.length > 0) return res.data.map(parseProject)
  }

  return []
}

export async function getProject(slug: string, locale: string = "en"): Promise<Project | undefined> {
  const locales = [locale, "en"]

  for (const l of locales) {
    const res = await strapiFetch<StrapiListResponse>(
      `/projects?filters[slug][$eq]=${slug}&locale=${l}${projectParams}`
    )
    if (res.data.length > 0) return parseProject(res.data[0])
  }

  return undefined
}
