import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const projectImages: Record<string, { seed: number; alt: string }> = {
  gastito: { seed: 10, alt: "Gastito - App de gestión de gastos" },
  coffy: { seed: 20, alt: "Coffy - Plataforma de cafetería" },
  "glitch-ui": { seed: 30, alt: "Glitch UI - Biblioteca de componentes" },
  "demo-back-nestjs": { seed: 40, alt: "Demo Backend NestJS" },
  "todo-app": { seed: 50, alt: "ToDo App - Aplicación móvil" },
  "demo-social-media": { seed: 60, alt: "Demo Social Media Backend" },
};

async function main() {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  for (const [slug, { seed, alt }] of Object.entries(projectImages)) {
    const filename = `project-${slug}.jpg`;
    const filepath = path.join(uploadDir, filename);
    const url = `/uploads/${filename}`;

    // Download from picsum with specific seed for consistency
    const res = await fetch(`https://picsum.photos/seed/${seed}/640/400`);
    if (!res.ok) {
      console.error(`Failed to download image for ${slug}: ${res.status}`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(filepath, buffer);
    console.log(`Downloaded: ${filename} (${buffer.length} bytes)`);

    // Create Media entry
    await prisma.media.create({
      data: {
        name: filename,
        alt,
        url,
        mime: "image/jpeg",
        size: buffer.length,
        width: 640,
        height: 400,
      },
    });

    // Update all project entries with this slug to include the image
    const entries = await prisma.entry.findMany({
      where: {
        contentTypeId: "collectionType.project",
      },
    });

    for (const entry of entries) {
      const data = entry.data as Record<string, string>;
      if (data.slug === slug) {
        const updatedData = { ...data, image: url };
        await prisma.entry.update({
          where: { id: entry.id },
          data: { data: updatedData },
        });
        console.log(`Updated entry ${entry.id} (${entry.locale}) with image`);
      }
    }
  }

  console.log("Done!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
