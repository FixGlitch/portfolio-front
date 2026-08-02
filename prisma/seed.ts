import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── Field type helpers ─────────────────────────────────────────
const text = (name: string, label: string, required = false) => ({
  name,
  label,
  type: "text",
  required,
});
const longText = (name: string, label: string, required = false) => ({
  name,
  label,
  type: "longText",
  required,
});
const json = (name: string, label: string, required = false) => ({
  name,
  label,
  type: "json",
  required,
});
const media = (name: string, label: string, required = false) => ({
  name,
  label,
  type: "media",
  required,
});
const boolean = (name: string, label: string) => ({
  name,
  label,
  type: "boolean",
  required: false,
});

// ─── Content Type Schemas ───────────────────────────────────────
const contentTypes = [
  {
    uid: "singleType.home",
    displayName: "Home",
    kind: "singleType",
    schema: [
      text("metaTitle", "Meta Title", true),
      text("metaDescription", "Meta Description", true),
      text("ogDescription", "OG Description"),
      text("role", "Role", true),
      longText("introLead", "Intro Lead", true),
      text("introPrefix", "Intro Prefix"),
      text("workLabel", "Work Label"),
      text("introMiddle", "Intro Middle"),
      text("lookLabel", "Look Label"),
      json("badgesWork", "Badges (Work)"),
      json("badgesLook", "Badges (Look)"),
      text("currently", "Currently"),
      text("currentlyRole", "Currently Role"),
      text("projectsHeading", "Projects Heading"),
      text("githubAria", "GitHub Aria"),
      text("avatarAlt", "Avatar Alt", true),
      media("portrait", "Portrait Image"),
    ],
  },
  {
    uid: "singleType.about",
    displayName: "About",
    kind: "singleType",
    schema: [
      text("metaTitle", "Meta Title", true),
      text("metaDescription", "Meta Description", true),
      text("heading", "Heading", true),
      text("avatarAlt", "Avatar Alt", true),
      longText("bio", "Bio (JSON array)", true),
      text("readCV", "Read CV Label"),
    ],
  },
  {
    uid: "singleType.contact",
    displayName: "Contact",
    kind: "singleType",
    schema: [
      text("metaTitle", "Meta Title", true),
      text("metaDescription", "Meta Description", true),
      text("heading", "Heading", true),
      text("subtext1", "Subtext 1"),
      text("subtext2", "Subtext 2"),
      text("formTitle", "Form Title"),
      text("repliesIn", "Replies In"),
      text("nameLabel", "Name Label"),
      text("namePlaceholder", "Name Placeholder"),
      text("emailLabel", "Email Label"),
      text("emailPlaceholder", "Email Placeholder"),
      text("messageLabel", "Message Label"),
      text("messagePlaceholder", "Message Placeholder"),
      text("replyNote", "Reply Note"),
      text("slideToSend", "Slide to Send"),
      text("sent", "Sent"),
      text("basedIn", "Based In"),
      text("downloadCV", "Download CV"),
    ],
  },
  {
    uid: "singleType.nav",
    displayName: "Navigation",
    kind: "singleType",
    schema: [
      text("home", "Home", true),
      text("about", "About", true),
      text("contact", "Contact", true),
      text("settings", "Settings"),
      text("theme", "Theme"),
      text("light", "Light"),
      text("dark", "Dark"),
      text("system", "System"),
      text("language", "Language"),
    ],
  },
  {
    uid: "singleType.common",
    displayName: "Common",
    kind: "singleType",
    schema: [
      text("skipToContent", "Skip to Content"),
      text("back", "Back"),
    ],
  },
  {
    uid: "singleType.projects",
    displayName: "Projects",
    kind: "singleType",
    schema: [
      text("back", "Back"),
      text("interested", "Interested in working together?"),
      text("getInTouch", "Get in touch"),
    ],
  },
  {
    uid: "singleType.settings",
    displayName: "Settings",
    kind: "singleType",
    schema: [
      text("siteName", "Site Name", true),
      text("siteUrl", "Site URL"),
      text("email", "Email", true),
      text("github", "GitHub URL"),
      text("linkedin", "LinkedIn URL"),
      text("location", "Location"),
    ],
  },
  {
    uid: "collectionType.project",
    displayName: "Project",
    kind: "collectionType",
    schema: [
      text("slug", "Slug", true),
      text("title", "Title", true),
      longText("summary", "Summary", true),
      text("subtitle", "Subtitle"),
      json("tags", "Tags", true),
      text("metaDescription", "Meta Description", true),
      json("content", "Content Blocks", true),
      media("image", "Featured Image"),
      text("githubUrl", "GitHub URL"),
      text("liveUrl", "Live URL"),
      boolean("featured", "Featured"),
    ],
  },
];

// ─── Existing data (from en.ts / es.ts) ─────────────────────────
const enData: Record<string, Record<string, unknown>> = {
  home: {
    metaTitle: "Lucas Blanco, Fullstack Developer",
    metaDescription:
      "Fullstack developer with 6+ years of experience. I care about how things work just as much as how they look: performance, scalability, and craft.",
    ogDescription:
      "Selected projects in web development and fullstack applications.",
    role: "Software Developer | Frontend",
    introLead:
      "I'm a software developer specialized in fullstack with 6+ years of experience.",
    introPrefix: "I care about how",
    workLabel: "things work",
    introMiddle: "just as much as how they",
    lookLabel: "they look",
    badgesWork: ["Node.js", "TypeScript", "APIs", "PostgreSQL"],
    badgesLook: ["React", "Next.js", "UI/UX", "Responsive"],
    currently: "Currently frontend developer at",
    currentlyRole: "and available for freelance projects.",
    projectsHeading: "Projects",
    githubAria: "Github",
    avatarAlt: "Portrait of Lucas Blanco",
  },
  about: {
    metaTitle: "About · Lucas Blanco",
    metaDescription:
      "Lucas Blanco is a fullstack developer from Argentina, passionate about building scalable web applications and quality user experiences.",
    heading: "About",
    avatarAlt: "avatar of Lucas",
    bio: [
      {
        text: "I'm {name}, a software developer specialized in fullstack with more than 4 years of experience in implementations, automations and integrations. I studied at {university} and since then I've been building web applications that work well and look good.",
        name: "Lucas Blanco",
        university: "Universidad de Buenos Aires",
      },
      {
        text: "I currently work as a Frontend Developer at Creativedog Agency, where I use Next.js, React.js, JavaScript, CSS and Strapi daily to build web applications.",
      },
      {
        text: "Previously I worked at DevLabs as a Full Stack Programmer, where I developed web and mobile applications using Next.js, React.js, Node.js and Redux Toolkit. I also worked as a freelance developer building complete solutions for clients.",
      },
      {
        text: "My main stack includes React, TypeScript, Node.js, Express, and databases like PostgreSQL and MongoDB. I also use Docker, Git and Figma in my daily workflow.",
      },
      {
        text: "I'm always learning something new. I'm proactive, resourceful and determined. If you have an idea or need help with a project, don't hesitate to reach out.",
      },
    ],
    readCV: "View CV",
  },
  contact: {
    metaTitle: "Contact · Lucas Blanco",
    metaDescription:
      "Let's work together. I'm always open to chat about what we can build.",
    heading: "Let's work together.",
    subtext1: "I'm always open to chat.",
    subtext2: "Let's talk about what we can build.",
    formTitle: "Send me a message",
    repliesIn: "Replies in 1-2 days",
    nameLabel: "Name",
    namePlaceholder: "Jane Doe",
    emailLabel: "Email",
    emailPlaceholder: "jane@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Hi Lucas, I'd love to chat about...",
    replyNote: "I'll reply directly to your email.",
    slideToSend: "Slide to send",
    sent: "Sent",
    basedIn: "Argentina",
    downloadCV: "Download CV (PDF) →",
  },
  nav: {
    home: "Home",
    about: "About",
    contact: "Contact",
    settings: "Settings",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
  },
  common: {
    skipToContent: "Skip to content",
    back: "Back",
  },
  projects: {
    back: "Back",
    interested: "Interested in working together?",
    getInTouch: "Get in touch",
  },
};

const esData: Record<string, Record<string, unknown>> = {
  home: {
    metaTitle: "Lucas Blanco, Desarrollador Fullstack",
    metaDescription:
      "Desarrollador fullstack con más de 6 años de experiencia. Me importa cómo funcionan las cosas tanto como cómo se ven: rendimiento, escalabilidad y calidad.",
    ogDescription:
      "Proyectos seleccionados de desarrollo web y aplicaciones fullstack.",
    role: "Software Developer | Frontend",
    introLead:
      "Soy un software developer especializado en fullstack con más de 6 años de experiencia.",
    introPrefix: "Me importa cómo",
    workLabel: "funcionan las cosas",
    introMiddle: "tanto como cómo",
    lookLabel: "se ven",
    badgesWork: ["Node.js", "TypeScript", "APIs", "PostgreSQL"],
    badgesLook: ["React", "Next.js", "UI/UX", "Responsive"],
    currently: "Actualmente frontend developer en",
    currentlyRole: "y disponible para proyectos freelance.",
    projectsHeading: "Proyectos",
    githubAria: "Github",
    avatarAlt: "Retrato de Lucas Blanco",
  },
  about: {
    metaTitle: "Sobre mí · Lucas Blanco",
    metaDescription:
      "Lucas Blanco es un desarrollador fullstack de Argentina, apasionado por construir aplicaciones web escalables y experiencias de usuario de calidad.",
    heading: "Sobre mí",
    avatarAlt: "avatar de Lucas",
    bio: [
      {
        text: "Soy {name}, un software developer especializado en fullstack con más de 4 años de experiencia en implementaciones, automatizaciones e integraciones. Estudié en la {university} y desde entonces me dedico a construir aplicaciones web que funcionan bien y se ven bien.",
        name: "Lucas Blanco",
        university: "Universidad de Buenos Aires",
      },
      {
        text: "Actualmente trabajo como Frontend Developer en Creativedog Agency, donde uso Next.js, React.js, JavaScript, CSS y Strapi diariamente para construir aplicaciones web.",
      },
      {
        text: "Anteriormente trabajé en DevLabs como Programador Full Stack, donde desarrollé aplicaciones web y móviles usando Next.js, React.js, Node.js y Redux Toolkit. También trabajé como desarrollador freelance construyendo soluciones completas para clientes.",
      },
      {
        text: "Mi stack principal incluye React, TypeScript, Node.js, Express y bases de datos como PostgreSQL y MongoDB. También uso Docker, Git y Figma en mi día a día.",
      },
      {
        text: "Siempre estoy aprendiendo algo nuevo. Soy proactivo, resolutivo y decidido. Si tenés una idea o necesitás ayuda con un proyecto, no dudes en contactarme.",
      },
    ],
    readCV: "Ver CV",
  },
  contact: {
    metaTitle: "Contacto · Lucas Blanco",
    metaDescription:
      "Trabajemos juntos. Siempre estoy abierto a charlar sobre lo que podemos construir.",
    heading: "Trabajemos juntos.",
    subtext1: "Siempre estoy abierto a charlar.",
    subtext2: "Hablemos de lo que podemos construir.",
    formTitle: "Envíame un mensaje",
    repliesIn: "Respondo en 1-2 días",
    nameLabel: "Nombre",
    namePlaceholder: "Juan Pérez",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "juan@ejemplo.com",
    messageLabel: "Mensaje",
    messagePlaceholder: "Hola Lucas, me encantaría charlar sobre...",
    replyNote: "Te responderé directamente a tu correo.",
    slideToSend: "Desliza para enviar",
    sent: "Enviado",
    basedIn: "Argentina",
    downloadCV: "Descargar CV (PDF) →",
  },
  nav: {
    home: "Inicio",
    about: "Sobre mí",
    contact: "Contacto",
    settings: "Ajustes",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    language: "Idioma",
  },
  common: {
    skipToContent: "Saltar al contenido",
    back: "Volver",
  },
  projects: {
    back: "Volver",
    interested: "¿Te gustaría trabajar juntos?",
    getInTouch: "Escribime",
  },
};

// ─── Helpers ────────────────────────────────────────────────────
function toEntryData(obj: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      result[k] = v;
    } else if (Array.isArray(v) || typeof v === "object") {
      result[k] = JSON.stringify(v);
    }
  }
  return result;
}

function cuid(): string {
  return "c" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

// ─── Main ───────────────────────────────────────────────────────
async function main() {
  console.log("Seeding content types + entries...");

  // Clean existing
  await prisma.entry.deleteMany();
  await prisma.contentType.deleteMany();
  await prisma.media.deleteMany();

  // Create content types
  const ctOps = contentTypes.map((ct) =>
    prisma.contentType.create({
      data: {
        id: cuid(),
        uid: ct.uid,
        displayName: ct.displayName,
        kind: ct.kind,
        schema: ct.schema,
      },
    })
  );
  await Promise.all(ctOps);
  console.log(`Created ${contentTypes.length} content types`);

  // Create entries from existing data
  let entryCount = 0;

  for (const ct of contentTypes) {
    const [kind, name] = ct.uid.split(".");
    if (kind !== "singleType") continue;

    const enValues = enData[name];
    const esValues = esData[name];
    if (!enValues && !esValues) continue;

    if (enValues) {
      await prisma.entry.create({
        data: {
          id: cuid(),
          uid: cuid(),
          contentTypeId: ct.uid,
          locale: "en",
          data: toEntryData(enValues),
          published: true,
        },
      });
      entryCount++;
    }

    if (esValues) {
      await prisma.entry.create({
        data: {
          id: cuid(),
          uid: cuid(),
          contentTypeId: ct.uid,
          locale: "es",
          data: toEntryData(esValues),
          published: true,
        },
      });
      entryCount++;
    }
  }

  // Settings entry (new data)
  const settingsEn = {
    siteName: "Lucas Blanco",
    siteUrl: "https://fixglitch.dev",
    email: "blancolucas112@gmail.com",
    github: "https://github.com/FixGlitch",
    linkedin: "https://linkedin.com/in/lucasdblanco",
    location: "Argentina",
  };
  const settingsEs = {
    siteName: "Lucas Blanco",
    siteUrl: "https://fixglitch.dev",
    email: "blancolucas112@gmail.com",
    github: "https://github.com/FixGlitch",
    linkedin: "https://linkedin.com/in/lucasdblanco",
    location: "Argentina",
  };

  await prisma.entry.create({
    data: {
      id: cuid(),
      uid: cuid(),
      contentTypeId: "singleType.settings",
      locale: "en",
      data: settingsEn,
      published: true,
    },
  });
  await prisma.entry.create({
    data: {
      id: cuid(),
      uid: cuid(),
      contentTypeId: "singleType.settings",
      locale: "es",
      data: settingsEs,
      published: true,
    },
  });
  entryCount += 2;

  // Collection type entries: Projects (same data for both locales since project content is in Spanish)
  const projects = [
    {
      slug: "gastito",
      title: "Gastito",
      summary: "Aplicación de gestión de gastos personales con frontend y backend separados.",
      subtitle: undefined,
      tags: ["TypeScript", "Node.js", "React"],
      metaDescription: "Gastito: app de gestión de gastos personales con arquitectura fullstack.",
      content: [
        { type: "p", text: "Gastito es una aplicación para el seguimiento de gastos personales. Consta de un frontend y un backend separados, ambos desarrollados en TypeScript." },
        { type: "p", text: "El proyecto demuestra una arquitectura fullstack completa, con una API REST en el backend y una interfaz moderna en el frontend." },
        { type: "h2", text: "Tecnologías" },
        { type: "ul", items: ["TypeScript", "Node.js", "React", "API REST"] },
      ],
      githubUrl: "https://github.com/FixGlitch/gastito",
      liveUrl: undefined,
      featured: true,
    },
    {
      slug: "coffy",
      title: "Coffy",
      summary: "Plataforma de gestión de cafetería con dashboard administrativo.",
      subtitle: undefined,
      tags: ["TypeScript", "Next.js", "Dashboard"],
      metaDescription: "Coffy: plataforma de gestión de cafetería con dashboard administrativo.",
      content: [
        { type: "p", text: "Coffy es una plataforma completa para la gestión de una cafetería, incluyendo un dashboard administrativo para monitorear ventas, inventario y estadísticas." },
        { type: "p", text: "El proyecto incluye un frontend con Next.js y un dashboard interactivo para la toma de decisiones." },
        { type: "h2", text: "Funcionalidades" },
        { type: "ul", items: ["Dashboard administrativo", "Gestión de inventario", "Estadísticas de ventas", "Interfaz moderna"] },
      ],
      githubUrl: "https://github.com/FixGlitch/coffy",
      liveUrl: undefined,
      featured: true,
    },
    {
      slug: "glitch-ui",
      title: "Glitch UI",
      summary: "Biblioteca de componentes UI construida con Next.js, Tailwind y shadcn/ui.",
      subtitle: undefined,
      tags: ["Next.js", "Tailwind", "shadcn/ui", "TypeScript"],
      metaDescription: "Glitch UI: biblioteca de componentes moderna con Next.js y Tailwind CSS.",
      content: [
        { type: "p", text: "Glitch UI es una biblioteca de componentes de interfaz de usuario que utilizo en mis proyectos. Está construida con Next.js, Tailwind CSS y shadcn/ui." },
        { type: "p", text: "El objetivo es tener un conjunto reutilizable de componentes que sigan las mejores prácticas de accesibilidad y diseño." },
        { type: "h2", text: "Stack" },
        { type: "ul", items: ["Next.js", "Tailwind CSS", "shadcn/ui", "TypeScript"] },
      ],
      githubUrl: "https://github.com/FixGlitch/glitch-ui",
      liveUrl: undefined,
      featured: false,
    },
    {
      slug: "demo-back-nestjs",
      title: "Demo Backend NestJS",
      summary: "API backend demo con NestJS, JWT, Passport y Jest para testing.",
      subtitle: undefined,
      tags: ["NestJS", "JWT", "Jest", "Passport", "TypeScript"],
      metaDescription: "Demo Backend: API REST con NestJS, autenticación JWT y tests con Jest.",
      content: [
        { type: "p", text: "Este proyecto es una demo de un backend robusto construido con NestJS. Incluye autenticación JWT, autorización con Passport y tests unitarios con Jest." },
        { type: "p", text: "Demuestra las mejores prácticas para la construcción de APIs escalables en Node.js." },
        { type: "h2", text: "Características" },
        { type: "ul", items: ["NestJS framework", "Autenticación JWT", "Passport strategies", "Tests con Jest"] },
      ],
      githubUrl: "https://github.com/FixGlitch/demo-backend-nestjs",
      liveUrl: undefined,
      featured: false,
    },
    {
      slug: "todo-app",
      title: "ToDo App",
      summary: "Aplicación móvil de tareas desarrollada con React Native y Redux Toolkit.",
      subtitle: undefined,
      tags: ["React Native", "Redux Toolkit", "TypeScript"],
      metaDescription: "ToDo App: aplicación móvil de gestión de tareas con React Native.",
      content: [
        { type: "p", text: "Una aplicación móvil de tareas desarrollada con React Native y gestionada con Redux Toolkit para un estado predecible y escalable." },
        { type: "p", text: "El proyecto incluye un backend separado con autenticación JWT para sincronizar tareas entre dispositivos." },
        { type: "h2", text: "Stack móvil" },
        { type: "ul", items: ["React Native", "Redux Toolkit", "TypeScript"] },
        { type: "h2", text: "Stack backend" },
        { type: "ul", items: ["Node.js", "Express", "JWT", "MongoDB"] },
      ],
      githubUrl: "https://github.com/FixGlitch/todo-app",
      liveUrl: undefined,
      featured: true,
    },
    {
      slug: "demo-social-media",
      title: "Demo Social Media Backend",
      summary: "Backend de red social demo con Node.js, Express y JWT.",
      subtitle: undefined,
      tags: ["Node.js", "Express", "JWT", "JavaScript"],
      metaDescription: "Demo Social Media: backend de red social con autenticación y posts.",
      content: [
        { type: "p", text: "Un backend demo para una red social, construido con Node.js y Express. Incluye autenticación de usuarios con JWT y sistema de posts." },
        { type: "p", text: "Este proyecto demuestra la construcción de una API REST completa con manejo de errores, validación y autenticación." },
        { type: "h2", text: "Endpoints" },
        { type: "ul", items: ["Registro y login de usuarios", "CRUD de posts", "Autenticación JWT", "Manjo de errores"] },
      ],
      githubUrl: "https://github.com/FixGlitch/demo-social-media",
      liveUrl: undefined,
      featured: false,
    },
  ];

  const projectCt = contentTypes.find((ct) => ct.uid === "collectionType.project")!;

  for (const project of projects) {
    const data = toEntryData({
      ...project,
      tags: project.tags,
      content: project.content,
    });

    await prisma.entry.create({
      data: {
        id: cuid(),
        uid: cuid(),
        contentTypeId: projectCt.uid,
        locale: "en",
        data,
        published: true,
      },
    });
    await prisma.entry.create({
      data: {
        id: cuid(),
        uid: cuid(),
        contentTypeId: projectCt.uid,
        locale: "es",
        data,
        published: true,
      },
    });
    entryCount += 2;
  }

  console.log(`Created ${entryCount} entries`);
  console.log("Seed complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
