"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { TopBlurGradient, BottomBlurGradient } from "@/components/blur-gradient"

export function PageShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div id="main" className="pb-32 sm:pb-28">
      <TopBlurGradient />
      <main className={cn("container", className)}>{children}</main>
      <BottomBlurGradient />
    </div>
  )
}
