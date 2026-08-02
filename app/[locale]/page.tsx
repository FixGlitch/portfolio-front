import { PageShell } from "@/components/page-shell"
import { HomeClient } from "./home-client"
import { getProjects } from "@/lib/projects"
import { getSettings } from "@/lib/content"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [projects, settings] = await Promise.all([getProjects(locale), getSettings(locale)])

  return (
    <PageShell>
      <HomeClient projects={projects} settings={settings} />
    </PageShell>
  )
}
