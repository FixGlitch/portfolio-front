import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/templates/page-shell"
import { ProjectTemplate } from "@/components/templates/project-template"
import { getProject } from "@/lib/api"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const project = await getProject(slug, locale)
  if (!project) return { title: "Project · Lucas Blanco" }
  return {
    title: `${project.title} · Lucas Blanco`,
    description: project.metaDescription ?? project.summary,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const project = await getProject(slug, locale)
  if (!project) notFound()

  return (
    <PageShell>
      <ProjectTemplate project={project} />
    </PageShell>
  )
}
