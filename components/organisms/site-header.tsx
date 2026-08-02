"use client"

import { useTranslations } from "next-intl"
import { AnimatedGithubIcon } from "@/components/atoms/brand-icon"
import { AnimatedRole } from "@/components/atoms/animated-text"
import { Avatar } from "@/components/atoms/avatar"
import { ExternalLink } from "@/components/atoms/link"
import type { Settings } from "@/lib/api"

export function SiteHeader({ settings }: { settings: Settings }) {
  const t = useTranslations("home")
  const github = settings?.github || "https://github.com/FixGlitch"
  const name = settings?.siteName || "Lucas Blanco"

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <Avatar
        src="/portrait.jpg"
        alt={t("avatarAlt")}
        width={40}
        height={40}
        className="size-10"
        priority
      />
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{name}</h1>
        <p className="text-sm text-muted-foreground">
          <AnimatedRole text={t("role")} />
        </p>
      </div>
      <ExternalLink
        href={github}
        aria-label={t("githubAria")}
        className="ms-auto inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <AnimatedGithubIcon className="h-5 w-5" />
      </ExternalLink>
    </header>
  )
}
