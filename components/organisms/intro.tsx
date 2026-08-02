"use client"

import { useTranslations } from "next-intl"
import { IconMark } from "@/components/molecules/icon-mark"
import { HoverImage } from "@/components/molecules/hover-image"
import { STRAPI_URL } from "@/lib/api"

export function Intro() {
  const t = useTranslations("home")

  return (
    <div className="flex flex-col gap-4 leading-relaxed text-foreground/90">
      <p>
        {t("introLead")} {t("introPrefix")}{" "}
        <IconMark word={t("workLabel")} badges={t.raw("badgesWork") as string[]} />{" "}
        {t("introMiddle")}{" "}
        <IconMark word={t("lookLabel")} badges={t.raw("badgesLook") as string[]} />.
      </p>
      <p>
        {t("currently")}{" "}
        <HoverImage
          src={`${STRAPI_URL}/uploads/creativedog.jpg`}
          alt="Creativedog Agency"
          href="http://creativedog.agency/"
          className="inline-block"
        >
          <span className="font-medium underline underline-offset-4 transition-colors hover:text-brand">
            Creativedog Agency
          </span>
        </HoverImage>{" "}
        {t("currentlyRole")}
      </p>
    </div>
  )
}
