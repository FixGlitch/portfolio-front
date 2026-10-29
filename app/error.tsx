"use client"

import { useEffect } from "react"

// Shown when a page fails, most often because Strapi is unreachable.
// Rendered outside next-intl's provider, so the copy is bilingual instead of translated.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold tracking-tight">
        Content unavailable · Contenido no disponible
      </h1>
      <p className="text-sm text-muted-foreground">
        The content service is not responding. Please try again in a moment.
        <br />
        El servicio de contenido no responde. Intenta de nuevo en un momento.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
      >
        Retry · Reintentar
      </button>
    </main>
  )
}
