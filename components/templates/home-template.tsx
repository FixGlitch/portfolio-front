"use client"

import { useTranslations } from "next-intl"
import { StaggerContainer, StaggerItem } from "@/components/molecules/stagger"
import { SiteHeader } from "@/components/organisms/site-header"
import { Intro } from "@/components/organisms/intro"
import { ProjectList } from "@/components/organisms/project-list"
import type { Project, Settings } from "@/lib/api"

export function HomeTemplate({
  projects,
  settings,
}: {
  projects: Project[]
  settings: Settings
}) {
  const t = useTranslations("home")

  return (
    <StaggerContainer className="flex flex-col gap-4">
      <StaggerItem>
        <SiteHeader settings={settings} />
      </StaggerItem>

      <StaggerItem>
        <Intro />
      </StaggerItem>

      <StaggerItem>
        <h2 className="text-lg font-semibold tracking-tight">{t("projectsHeading")}</h2>
      </StaggerItem>

      <StaggerItem>
        <ProjectList projects={projects} />
      </StaggerItem>
    </StaggerContainer>
  )
}
