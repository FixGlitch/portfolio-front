"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { AnimatedGithubIcon } from "@/components/brand-icons"
import type { Project } from "@/lib/projects"
import { StaggerContainer, StaggerItem } from "@/components/stagger"
import { AnimatedRole } from "@/components/animated-text"
import { IconMark } from "@/components/icon-mark"
import { Link } from "@/i18n/routing"
import { HoverImage } from "@/components/hover-image"

type Settings = Record<string, string> | null

export function HomeClient({ projects, settings }: { projects: Project[]; settings: Settings }) {
  const t = useTranslations("home")
  const github = settings?.github || "https://github.com/FixGlitch"

  return (
    <StaggerContainer className="flex flex-col gap-4">
      <StaggerItem>
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Image
            src="/portrait.jpg"
            alt={t("avatarAlt")}
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
            priority
          />
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Lucas Blanco</h1>
            <p className="text-sm text-muted-foreground">
              <AnimatedRole text={t("role")} />
            </p>
          </div>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label={t("githubAria")}
            className="ms-auto inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <AnimatedGithubIcon className="h-5 w-5" />
          </a>
        </header>
      </StaggerItem>

      <StaggerItem>
        <div className="flex flex-col gap-4 leading-relaxed text-foreground/90">
          <p>
            {t("introLead")}{" "}
            {t("introPrefix")}{" "}
            <IconMark word={t("workLabel")} badges={t.raw("badgesWork")} />{" "}
            {t("introMiddle")}{" "}
            <IconMark word={t("lookLabel")} badges={t.raw("badgesLook")} />.
          </p>
          <p>
            {t("currently")}{" "}
            <HoverImage
              src="/uploads/creativedog.jpg"
              alt="Creativedog Agency"
              href="http://creativedog.agency/"
              className="inline-block"
            >
              <span className="font-medium underline underline-offset-4 transition-colors hover:text-brand">
                Creativedog Agency
              </span>
            </HoverImage>
            {" "}{t("currentlyRole")}
          </p>
        </div>
      </StaggerItem>

      <StaggerItem>
        <h2 className="text-lg font-semibold tracking-tight">{t("projectsHeading")}</h2>
      </StaggerItem>

      <StaggerItem>
        <div className="flex flex-col space-y-0">
          {projects.map((project) => (
            <HoverImage
              key={project.slug}
              src={project.image || ""}
              alt={project.title}
              className="-mx-3 rounded-xl hover:bg-accent"
            >
              <Link href={`/projects/${project.slug}`} className="block rounded-xl px-3 py-3">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-semibold dark:text-zinc-100">{project.title}</h3>
                  <p className="text-sm font-normal text-balance text-zinc-500 dark:text-zinc-400">
                    {project.summary}
                  </p>
                </div>
              </Link>
            </HoverImage>
          ))}
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}
