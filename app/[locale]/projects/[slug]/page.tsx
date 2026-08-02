import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { getProject } from "@/lib/projects"
import { ProjectClient } from "./project-client"

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
    description: project.metaDescription,
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
      <ProjectClient project={project} />
    </PageShell>
  )
}
