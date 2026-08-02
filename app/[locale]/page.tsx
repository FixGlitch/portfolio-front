import { PageShell } from "@/components/templates/page-shell"
import { HomeTemplate } from "@/components/templates/home-template"
import { getProjects, getSettings } from "@/lib/api"

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [projects, settings] = await Promise.all([getProjects(locale), getSettings(locale)])

  return (
    <PageShell>
      <HomeTemplate projects={projects} settings={settings} />
    </PageShell>
  )
}
