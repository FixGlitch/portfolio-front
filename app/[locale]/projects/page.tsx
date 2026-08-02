import type { Metadata } from "next"
import { getMessages } from "next-intl/server"
import { PageShell } from "@/components/templates/page-shell"
import { ProjectsTemplate } from "@/components/templates/projects-template"
import { getProjects } from "@/lib/api"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const projects = (messages.projects ?? {}) as Record<string, string>

  return {
    title: projects.metaTitle,
    description: projects.metaDescription,
  }
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const projects = await getProjects(locale)

  return (
    <PageShell>
      <ProjectsTemplate projects={projects} />
    </PageShell>
  )
}
