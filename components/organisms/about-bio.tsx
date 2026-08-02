"use client"

import { useTranslations } from "next-intl"
import { FileText } from "lucide-react"
import { Avatar } from "@/components/atoms/avatar"
import { ExternalLink } from "@/components/atoms/link"
import { StaggerContainer, StaggerItem } from "@/components/molecules/stagger"

const LINKED_WORDS = ["Creativedog Agency", "Universidad de Buenos Aires", "DevLabs"]

export function AboutBio() {
  const t = useTranslations("about")
  const bio = t.raw("bio") as Array<Record<string, string>>

  return (
    <StaggerContainer className="flex flex-col gap-4">
      <StaggerItem>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{t("heading")}</h2>
          <Avatar
            src="/portrait.jpg"
            alt={t("avatarAlt")}
            width={80}
            height={80}
            className="size-20 rounded-lg border"
            loading="lazy"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="space-y-4 leading-relaxed text-foreground/90">
          {bio.map((paragraph, i) => {
            const text = paragraph.text || ""
            const parts = text.split(new RegExp(`(${LINKED_WORDS.join("|")})`))
            return (
              <p key={i}>
                {parts.map((part, j) => {
                  if (part === "Creativedog Agency") {
                    return (
                      <ExternalLink
                        key={j}
                        href="http://creativedog.agency/"
                        className="font-semibold underline underline-offset-4 transition-colors hover:text-brand"
                      >
                        {part}
                      </ExternalLink>
                    )
                  }
                  if (part === "Universidad de Buenos Aires" || part === "DevLabs") {
                    return (
                      <strong key={j} className="font-semibold text-foreground">
                        {part}
                      </strong>
                    )
                  }
                  return <span key={j}>{part}</span>
                })}
              </p>
            )
          })}
        </div>
      </StaggerItem>

      <StaggerItem>
        <a
          href="/cv.pdf"
          className="inline-flex shrink-0 items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-xs transition-all hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
        >
          <FileText size={16} strokeWidth={1.75} />
          {t("readCV")}
        </a>
      </StaggerItem>
    </StaggerContainer>
  )
}
