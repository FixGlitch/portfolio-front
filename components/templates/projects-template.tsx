"use client"

import { useTranslations } from "next-intl"
import { StaggerContainer, StaggerItem } from "@/components/molecules/stagger"
import { ProjectList } from "@/components/organisms/project-list"
import { Cta } from "@/components/organisms/cta"
import type { Project } from "@/lib/api"

export function ProjectsTemplate({ projects }: { projects: Project[] }) {
  const t = useTranslations("home")

  return (
    <StaggerContainer className="flex flex-col gap-4">
      <StaggerItem>
        <h1 className="text-2xl font-semibold tracking-tight">{t("projectsHeading")}</h1>
      </StaggerItem>

      <StaggerItem>
        <ProjectList projects={projects} />
      </StaggerItem>

      <StaggerItem>
        <Cta />
      </StaggerItem>
    </StaggerContainer>
  )
}
