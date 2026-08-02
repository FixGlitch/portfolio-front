"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Send, Check } from "lucide-react"

export function ContactForm() {
  const t = useTranslations("contact")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  function handleSend() {
    const subject = encodeURIComponent(`Message from ${name || "your site"}`)
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:blancolucas112@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/40 p-5 shadow-xs backdrop-blur-sm dark:bg-card/20 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight">{t("formTitle")}</h2>
        <span className="text-xs text-muted-foreground">{t("repliesIn")}</span>
      </div>

      <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          name="contact-website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px] opacity-0"
          aria-hidden="true"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground">{t("nameLabel")}</span>
            <input
              type="text"
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-brand dark:bg-background/40"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground">{t("emailLabel")}</span>
            <input
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-brand dark:bg-background/40"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted-foreground">{t("messageLabel")}</span>
          <textarea
            rows={4}
            placeholder={t("messagePlaceholder")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-y rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none transition-colors focus:border-brand dark:bg-background/40"
          />
        </label>

        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{t("replyNote")}</p>

          <button
            onClick={handleSend}
            disabled={sent}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/80 disabled:opacity-50 sm:w-auto"
          >
            {sent ? (
              <>
                <Check className="h-4 w-4" /> {t("sent")}
              </>
            ) : (
              <>
                {t("send")} <Send className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
