"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      type: "spring",
      bounce: 0,
    },
  },
}

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 24,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 0.8,
    },
  },
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`overflow-visible ${className ?? ""}`}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={`overflow-visible ${className ?? ""}`}>
      {children}
    </motion.div>
  )
}
