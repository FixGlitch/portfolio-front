"use client"

import { useTranslations } from "next-intl"
import { ArrowLeft } from "lucide-react"
import type { Project, Block } from "@/lib/projects"
import { StaggerContainer, StaggerItem } from "@/components/stagger"
import { Link } from "@/i18n/routing"

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} className="mt-10 text-lg font-semibold tracking-tight">
          {block.text}
        </h2>
      )
    case "h3":
      return (
        <h3 key={i} className="mt-8 text-base font-semibold tracking-tight">
          {block.text}
        </h3>
      )
    case "p":
      return (
        <p key={i} className="mt-4 leading-relaxed text-foreground/90">
          {block.text}
        </p>
      )
    case "ol":
      return (
        <ol key={i} className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-foreground/90 marker:text-brand">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ol>
      )
    case "ul":
      return (
        <ul key={i} className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-foreground/90 marker:text-brand">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      )
  }
}

export function ProjectClient({ project }: { project: Project }) {
  const t = useTranslations("projects")

  return (
    <StaggerContainer>
      <StaggerItem>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          {t("back")}
        </Link>
      </StaggerItem>

      <StaggerItem>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">{project.title}</h1>
        {project.subtitle && <p className="mt-2 text-sm text-muted-foreground">{project.subtitle}</p>}
      </StaggerItem>

      <StaggerItem>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </StaggerItem>

      <StaggerItem>
        <article className="mt-10">{project.content.map(renderBlock)}</article>
      </StaggerItem>

      <StaggerItem>
        <div className="mt-14 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">{t("interested")}</p>
          <Link
            href="/contact"
            className="mt-2 inline-block text-base font-semibold underline decoration-2 underline-offset-4 transition-colors hover:text-brand"
          >
            {t("getInTouch")}
          </Link>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}
