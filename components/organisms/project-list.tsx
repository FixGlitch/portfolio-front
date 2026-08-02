"use client"

import { HoverImage } from "@/components/molecules/hover-image"
import { Link } from "@/components/atoms/link"
import type { Project } from "@/lib/api"

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col space-y-0">
      {projects.map((project) => (
        <HoverImage
          key={project.slug}
          src={project.image}
          alt={project.title}
          className="-mx-3 rounded-xl hover:bg-accent"
        >
          <Link href={`/projects/${project.slug}`} className="block rounded-xl px-3 py-3">
            <div className="flex flex-col space-y-1">
              <h3 className="font-semibold dark:text-zinc-100">{project.title}</h3>
              <p className="text-sm font-normal text-balance text-zinc-500 dark:text-zinc-400">
                {project.summary}
              </p>
            </div>
          </Link>
        </HoverImage>
      ))}
    </div>
  )
}
