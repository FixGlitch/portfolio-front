"use client"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

interface BadgeData {
  text: string
  side: "left" | "right"
  offsetY: number
  offsetX: number
  rotation: number
  floatDuration: number
  driftX: number[]
  driftY: number[]
  driftRotate: number[]
}

function computeBadgeLayout(badges: string[]): BadgeData[] {
  return badges.map((text, i) => {
    const s = (n: number) => seededRandom(i * 1000 + n)
    const side: "left" | "right" = i < 2 ? "left" : "right"
    const sideIndex = i % 2
    const baseX = side === "left" ? 180 : 120
    const spreadX = side === "left" ? 100 : 60
    const offsetX = baseX + sideIndex * spreadX + s(1) * 20
    const jitterY = (s(2) - 0.5) * 16
    const offsetY = sideIndex === 0 ? -14 - Math.abs(jitterY) : 14 + Math.abs(jitterY)
    const rotation = (s(3) - 0.5) * 12
    const driftBase = 5
    return {
      text,
      side,
      offsetY,
      offsetX,
      rotation,
      floatDuration: 4 + s(4) * 3,
      driftX: [0, (s(5) - 0.5) * driftBase * 2, (s(6) - 0.5) * driftBase * 2, 0],
      driftY: [0, (s(7) - 0.5) * driftBase * 2, (s(8) - 0.5) * driftBase * 2, 0],
      driftRotate: [0, (s(9) - 0.5) * 2, (s(10) - 0.5) * 2, 0],
    }
  })
}

function Badge({
  badge,
  textRect,
  containerRect,
}: {
  badge: BadgeData
  textRect: DOMRect
  containerRect: DOMRect
}) {
  const isLeft = badge.side === "left"
  const centerX = textRect.left + textRect.width / 2
  const centerY = textRect.top + textRect.height / 2
  const baseLeft = containerRect.left - 20
  const baseRight = containerRect.right + 20
  const targetX = isLeft ? baseLeft - badge.offsetX : baseRight + badge.offsetX
  const targetY = centerY + badge.offsetY

  return (
    <motion.span
      className="pointer-events-none fixed z-[9999] whitespace-nowrap rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground backdrop-blur-sm"
      style={{ left: 0, top: 0 }}
      initial={{ opacity: 0, scale: 0.8, x: centerX, y: centerY }}
      animate={{
        opacity: 1,
        scale: 1,
        x: targetX,
        y: targetY,
        rotate: badge.rotation,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        x: centerX,
        y: centerY,
        transition: { duration: 0.2, ease: "backIn" },
      }}
      transition={{ type: "spring", stiffness: 70, damping: 20 }}
    >
      <motion.span
        className="inline-block"
        animate={{
          x: badge.driftX,
          y: badge.driftY,
          rotate: badge.driftRotate,
        }}
        transition={{
          duration: badge.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {badge.text}
      </motion.span>
    </motion.span>
  )
}

export function IconMark({
  word,
  badges: rawBadges,
}: {
  word: string
  badges: string[]
}) {
  const [visible, setVisible] = useState(false)
  const [textRect, setTextRect] = useState<DOMRect | null>(null)
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const layout = useMemo(() => computeBadgeLayout(rawBadges), [rawBadges])

  const handleEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (spanRef.current) {
      setTextRect(spanRef.current.getBoundingClientRect())
    }
    const container = document.querySelector(".container")
    if (container) {
      setContainerRect(container.getBoundingClientRect())
    }
    setVisible(true)
  }, [])

  const handleLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      <span
        ref={spanRef}
        className="relative mt-0! inline-block transition-transform"
        style={{ zIndex: visible ? 100 : "auto" }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <span className="group relative">
          {word}
          <span className="absolute right-px bottom-0 left-0 hidden h-[1.5px] bg-[repeating-linear-gradient(to_right,var(--color-brand)_0px,var(--color-brand)_3px,transparent_3px,transparent_6px)] md:block" />
        </span>
      </span>
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {visible && textRect && containerRect &&
              layout.map((badge) => (
                <Badge key={badge.text} badge={badge} textRect={textRect} containerRect={containerRect} />
              ))}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
