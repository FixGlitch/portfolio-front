import { prisma } from "./prisma";

// Build the messages object from DB entries for next-intl
export async function getContentMessages(locale: string) {
  const entries = await prisma.entry.findMany({
    where: { locale, published: true },
  });

  const messages: Record<string, Record<string, unknown>> = {};

  for (const entry of entries) {
    // Only include single types in i18n messages (collection types are fetched separately)
    if (!entry.contentTypeId.startsWith("singleType.")) continue;

    // Extract the section name from uid like "singleType.home" -> "home"
    const sectionName = entry.contentTypeId.replace("singleType.", "");

    const data = entry.data as Record<string, unknown>;

    // Parse JSON strings back to actual values
    const parsed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string" && (value.startsWith("[") || value.startsWith("{"))) {
        try {
          parsed[key] = JSON.parse(value);
        } catch {
          parsed[key] = value;
        }
      } else {
        parsed[key] = value;
      }
    }

    messages[sectionName] = parsed;
  }

  return messages;
}

// Get a single entry by content type uid and locale
export async function getEntry(contentTypeUid: string, locale: string) {
  return prisma.entry.findFirst({
    where: { contentTypeId: contentTypeUid, locale },
  });
}

// Get all entries for a content type
export async function getEntries(contentTypeUid: string, locale: string) {
  return prisma.entry.findMany({
    where: { contentTypeId: contentTypeUid, locale },
    orderBy: { createdAt: "desc" },
  });
}

// Get all published content for a locale (flat map)
export async function getAllContent(locale: string) {
  return prisma.entry.findMany({
    where: { locale, published: true },
  });
}

// Get settings entry
export async function getSettings(locale: string) {
  const entry = await prisma.entry.findFirst({
    where: { contentTypeId: "singleType.settings", locale },
  });
  if (!entry) return null;
  return entry.data as Record<string, string>;
}
