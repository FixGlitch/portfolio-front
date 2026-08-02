"use client"

import { useTranslations } from "next-intl"
import { GithubIcon, LinkedinIcon } from "@/components/atoms/brand-icon"
import { ContactForm } from "@/components/molecules/contact-form"
import { ExternalLink } from "@/components/atoms/link"
import { StaggerContainer, StaggerItem } from "@/components/molecules/stagger"
import type { Settings } from "@/lib/api"

export function ContactHero({ settings }: { settings: Settings }) {
  const t = useTranslations("contact")
  const email = settings?.email || "blancolucas112@gmail.com"
  const github = settings?.github || "https://github.com/FixGlitch"
  const linkedin = settings?.linkedin || "https://linkedin.com/in/lucasdblanco"

  return (
    <StaggerContainer className="flex flex-col gap-4">
      <StaggerItem>
        <h1 className="text-2xl font-semibold tracking-tight">{t("heading")}</h1>
      </StaggerItem>

      <StaggerItem>
        <p className="leading-relaxed text-muted-foreground">
          {t("subtext1")}
          <br />
          {t("subtext2")}
        </p>
      </StaggerItem>

      <StaggerItem>
        <ExternalLink
          href={`mailto:${email}`}
          className="decoration-brand inline-block text-2xl font-semibold tracking-tight underline underline-offset-4 transition-transform hover:-translate-y-0.5"
        >
          {email}
        </ExternalLink>
      </StaggerItem>

      <StaggerItem>
        <div className="flex flex-wrap gap-3">
          <ExternalLink
            href={linkedin}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn
          </ExternalLink>
          <ExternalLink
            href={github}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <GithubIcon className="h-4 w-4" />
            GitHub
          </ExternalLink>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="relative">
          <div className="pointer-events-none absolute -left-20 -top-10 size-40 rounded-full bg-brand/10 blur-3xl" />
          <ContactForm />
        </div>
      </StaggerItem>

      <StaggerItem>
        <p className="text-sm text-muted-foreground">
          {t("basedIn")} ·{" "}
          <a href="/cv.pdf" className="font-medium text-foreground underline underline-offset-4 hover:text-brand">
            {t("downloadCV")}
          </a>
        </p>
      </StaggerItem>
    </StaggerContainer>
  )
}
