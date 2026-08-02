export default {
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
  home: {
    metaTitle: "Lucas Blanco, Fullstack Developer",
    metaDescription:
      "Fullstack developer with 6+ years of experience. I care about how things work just as much as how they look: performance, scalability, and craft.",
    ogDescription:
      "Selected projects in web development and fullstack applications.",
    role: "Software Developer | Frontend",
    introLead: "I'm a software developer specialized in fullstack with 6+ years of experience.",
    introPrefix: "I care about how",
    workLabel: "things work",
    introMiddle: "just as much as how they",
    lookLabel: "they look",
    badgesWork: ["Node.js", "TypeScript", "APIs", "PostgreSQL"],
    badgesLook: [
      "React",
      "Next.js",
      "UI/UX",
      "Responsive",
    ],
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
    send: "Send",
    sent: "Sent",
    basedIn: "Argentina",
    downloadCV: "Download CV (PDF) →",
  },
  projects: {
    metaTitle: "Projects · Lucas Blanco",
    metaDescription: "Selected projects by Lucas Blanco.",
    back: "Back",
    interested: "Interested in working together?",
    getInTouch: "Get in touch →",
  },
} as const
