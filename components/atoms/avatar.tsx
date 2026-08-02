import Image from "next/image"
import { cn } from "@/lib/api"

export function Avatar({
  src,
  alt,
  className,
  ...props
}: React.ComponentProps<typeof Image> & { src: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn("rounded-full object-cover", className)}
      {...props}
    />
  )
}
