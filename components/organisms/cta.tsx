"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/components/atoms/link"

export function Cta() {
  const t = useTranslations("projects")

  return (
    <div className="mt-14 border-t border-border pt-8">
      <p className="text-sm text-muted-foreground">{t("interested")}</p>
      <Link
        href="/contact"
        className="mt-2 inline-block text-base font-semibold underline decoration-2 underline-offset-4 transition-colors hover:text-brand"
      >
        {t("getInTouch")}
      </Link>
    </div>
  )
}
