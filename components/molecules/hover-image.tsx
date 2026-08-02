"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HoverImageProps {
  src: string
  alt: string
  children: React.ReactNode
  href?: string
  className?: string
}

export function HoverImage({ src, alt, children, href, className }: HoverImageProps) {
  const [hovered, setHovered] = useState(false)

  const Wrapper = href ? "a" : "div"
  const wrapperProps = href ? { href, target: "_blank", rel: "noreferrer" } : {}

  return (
    <span
      className={`relative ${className ?? ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Wrapper {...wrapperProps}>{children}</Wrapper>

      <AnimatePresence>
        {hovered && src && (
          <motion.img
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 0.8, x: -12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -12, transition: { duration: 0.2, ease: "backIn" } }}
            transition={{ type: "spring", stiffness: 70, damping: 20 }}
            className="absolute top-1/2 z-50 -translate-y-1/2 rounded-lg border border-border object-cover shadow-lg pointer-events-none"
            style={{
              left: "calc(100% + 27px)",
              width: "auto",
              height: "auto",
              maxWidth: 500,
              maxHeight: 500,
            }}
          />
        )}
      </AnimatePresence>
    </span>
  )
}
