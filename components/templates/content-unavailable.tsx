// Server-rendered fallback for when Strapi cannot supply the page content.
// It renders without next-intl, so the copy is bilingual, and the retry is a plain reload.
export function ContentUnavailable() {
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
      <a
        href=""
        className="inline-flex h-10 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
      >
        Retry · Reintentar
      </a>
    </main>
  )
}
