import type { AnchorHTMLAttributes, ReactNode } from "react"
import { Link as IntlLink } from "@/i18n/routing"

export function Link({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <IntlLink href={href} {...props}>
      {children}
    </IntlLink>
  )
}

export function ExternalLink({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  )
}
