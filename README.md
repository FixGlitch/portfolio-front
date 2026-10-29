# portfolio-front

Sitio personal de Lucas Blanco, desarrollador fullstack. Next.js con internacionalización (español e inglés) y el contenido servido desde Strapi.

Backend asociado: [portfolio-back](../portfolio-back).

## Qué incluye

- Páginas: inicio, sobre mí, proyectos (listado y detalle por slug), contacto.
- Idiomas: `[locale]` con next-intl. Si un proyecto no existe en el idioma pedido, se muestra la versión en inglés.
- Formulario de contacto: envía un mensaje a Strapi a través de una server action. Incluye honeypot, estados de envío y error, y límite por IP.
- SEO: `robots.ts`, `sitemap.ts` y metadatos por página.
- Si Strapi no responde, se muestra una pantalla de contenido no disponible en lugar de páginas incompletas.
- Tema claro y oscuro.

## Requisitos

- Node.js 20 o superior.
- El backend de Strapi en marcha (ver el README de portfolio-back).

## Puesta en marcha

```bash
cp .env.example .env   # completar STRAPI_URL y CONTACT_PROXY_SECRET
npm install
npm run dev            # http://localhost:3000
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `STRAPI_URL` | URL base de Strapi. Solo se usa en el servidor. Por defecto `http://localhost:1337`. |
| `CONTACT_PROXY_SECRET` | Secreto compartido con portfolio-back. Debe coincidir en ambos servicios. Si falta, el límite del formulario usa la IP del servidor, no la del visitante. |

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Build de producción. |
| `npm start` | Sirve el build de producción. |
| `npm run lint` | ESLint. |

## Estructura

- `app/`: rutas de Next (`[locale]/` para las páginas traducidas).
- `components/`: atomic design (`atoms`, `molecules`, `organisms`, `templates`).
- `lib/api.ts`: cliente de Strapi y conversión del contenido. Los textos de la interfaz también vienen de Strapi (`content`), no de archivos locales.
- `lib/contact-action.ts`: server action del formulario de contacto.
