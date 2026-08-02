"use client"

import { Link, usePathname, useRouter } from "@/i18n/routing"
import { useState, useRef, createContext, useContext, useCallback, useEffect } from "react"
import { useTheme } from "next-themes"
import { useTranslations, useLocale } from "next-intl"
import { Home, User, PenLine, Settings, Sun, Moon, Monitor, Globe, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/api"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, type MotionValue } from "framer-motion"

const navItems = [
  { href: "/", labelKey: "home" as const, icon: Home },
  { href: "/about", labelKey: "about" as const, icon: User },
  { href: "/contact", labelKey: "contact" as const, icon: PenLine },
]

const spring = { mass: 0.1, stiffness: 150, damping: 12 }
const ICON_SIZE = 40
const MAGNIFICATION = 80
const DISTANCE = 150
const PANEL_W = 192
const GAP = 12

const DockContext = createContext<MotionValue<number> | null>(null)

function useDockMouseX() {
  const ctx = useContext(DockContext)
  if (!ctx) throw new Error("useDockMouseX must be used within Dock")
  return ctx
}

function DockIcon({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: typeof Home
  active: boolean
}) {
  const mouseX = useDockMouseX()
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const el = ref.current
    if (!el || !isFinite(val)) return DISTANCE * 2
    const rect = el.getBoundingClientRect()
    return val - rect.x - rect.width / 2
  })

  const rawWidth = useTransform(distance, [-DISTANCE, 0, DISTANCE], [ICON_SIZE, MAGNIFICATION, ICON_SIZE])
  const width = useSpring(rawWidth, spring)

  return (
    <Link href={href} aria-label={label} aria-current={active ? "page" : undefined}>
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className={cn(
          "relative flex items-center justify-center rounded-full border transition-colors",
          active ? "bg-accent dark:bg-stone-950" : "bg-stone-50 dark:bg-stone-950",
        )}
      >
        {active && (
          <motion.div
            layoutId="selected"
            className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", bounce: 0 }}
          />
        )}
        <Tooltip visible={hovered}>{label}</Tooltip>
        <motion.div
          style={{
            width: useSpring(useTransform(width, (v) => v / 2), spring),
            height: useSpring(useTransform(width, (v) => v / 2), spring),
          }}
          className="flex items-center justify-center [&_svg]:text-muted-foreground [&_svg]:transition-colors dark:[&_svg]:text-muted-foreground"
        >
          <Icon size={20} strokeWidth={1.75} />
        </motion.div>
      </motion.div>
    </Link>
  )
}

function SettingsIcon({
  expanded,
  onToggle,
}: {
  expanded: boolean
  onToggle: () => void
}) {
  const t = useTranslations("nav")
  const mouseX = useDockMouseX()
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const el = ref.current
    if (!el || !isFinite(val)) return DISTANCE * 2
    const rect = el.getBoundingClientRect()
    return val - rect.x - rect.width / 2
  })

  const rawWidth = useTransform(distance, [-DISTANCE, 0, DISTANCE], [ICON_SIZE, MAGNIFICATION, ICON_SIZE])
  const width = useSpring(rawWidth, spring)
  const finalWidth = useSpring(
    useTransform(width, (w) => (expanded ? MAGNIFICATION : w)),
    spring,
  )

  return (
    <motion.div
      data-dock-settings-icon
      ref={ref}
      style={{ width: finalWidth, height: finalWidth }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onToggle}
      className={cn(
        "relative flex cursor-pointer items-center justify-center rounded-full border transition-colors",
        expanded ? "bg-accent dark:bg-stone-950" : "bg-stone-50 dark:bg-stone-950",
      )}
      role="button"
      tabIndex={0}
      aria-label={t("settings")}
      aria-haspopup="menu"
      aria-expanded={expanded}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      <Tooltip visible={hovered && !expanded}>{t("settings")}</Tooltip>
      <motion.div
        style={{
          width: useSpring(useTransform(finalWidth, (v) => v / 2), spring),
          height: useSpring(useTransform(finalWidth, (v) => v / 2), spring),
        }}
        className="flex items-center justify-center [&_svg]:transition-colors"
      >
        <Settings
          size={20}
          strokeWidth={1.75}
          className={cn(expanded ? "text-brand" : "text-muted-foreground")}
        />
      </motion.div>
    </motion.div>
  )
}

function Tooltip({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: -10, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute -top-6 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type MenuView = "main" | "theme" | "language"

function SettingsMenu({
  onClose,
  anchorRect,
}: {
  onClose: () => void
  anchorRect: { x: number; y: number; width: number; height: number }
}) {
  const t = useTranslations("nav")
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [view, setView] = useState<MenuView>("main")

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest("[data-dock-menu]")) onClose()
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
  ]

  const themes = [
    { value: "light", label: t("light"), icon: Sun },
    { value: "dark", label: t("dark"), icon: Moon },
    { value: "system", label: t("system"), icon: Monitor },
  ]

  const iconCenterX = anchorRect.x + anchorRect.width / 2

  return (
    <div
      data-dock-menu
      className="pointer-events-auto fixed z-[100]"
      style={{
        left: iconCenterX - PANEL_W / 2,
        bottom: window.innerHeight - anchorRect.y + GAP,
      }}
    >
      <div className="flex rounded-md border border-border bg-popover text-popover-foreground shadow-md dark:shadow-none">
        <div className="w-48 shrink-0 p-1">
          <div className="px-2 py-1.5 text-sm font-medium">{t("settings")}</div>
          <div className="-mx-1 my-1 h-px bg-border" />
          <button
            type="button"
            onClick={() => setView(view === "theme" ? "main" : "theme")}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
              view === "theme" && "bg-accent text-accent-foreground",
            )}
          >
            <Sun size={16} strokeWidth={1.75} />
            <span className="flex-1 text-left">{t("theme")}</span>
            <ChevronLeft
              size={16}
              strokeWidth={1.75}
              className={cn("transition-transform", view === "theme" && "rotate-180")}
            />
          </button>
          <button
            type="button"
            onClick={() => setView(view === "language" ? "main" : "language")}
            className={cn(
              "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground",
              view === "language" && "bg-accent text-accent-foreground",
            )}
          >
            <Globe size={16} strokeWidth={1.75} />
            <span className="flex-1 text-left">{t("language")}</span>
            <ChevronLeft
              size={16}
              strokeWidth={1.75}
              className={cn("transition-transform", view === "language" && "rotate-180")}
            />
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {view === "theme" && (
            <motion.div
              key="theme"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: PANEL_W, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 overflow-hidden border-l border-border"
            >
              <div className="w-48 p-1">
                <div className="px-2 py-1.5 text-sm font-medium">{t("theme")}</div>
                <div className="-mx-1 my-1 h-px bg-border" />
                <div role="group">
                  {themes.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={theme === value}
                      data-state={theme === value ? "checked" : "unchecked"}
                      onClick={() => setTheme(value)}
                      className="relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                        {theme === value && (
                          <span data-state="checked">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-2 fill-current">
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          </span>
                        )}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {view === "language" && (
            <motion.div
              key="language"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: PANEL_W, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="shrink-0 overflow-hidden border-l border-border"
            >
              <div className="w-48 p-1">
                <div className="px-2 py-1.5 text-sm font-medium">{t("language")}</div>
                <div className="-mx-1 my-1 h-px bg-border" />
                <div role="group">
                  {languages.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={locale === value}
                      data-state={locale === value ? "checked" : "unchecked"}
                      onClick={() => router.replace(pathname, { locale: value })}
                      className="relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                        {locale === value && (
                          <span data-state="checked">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-2 fill-current">
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          </span>
                        )}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Dock() {
  const pathname = usePathname()
  const t = useTranslations("nav")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const mouseX = useMotionValue<number>(Infinity)
  const [anchorRect, setAnchorRect] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const handleToggle = useCallback(() => {
    if (!settingsOpen) {
      const el = document.querySelector<HTMLDivElement>("[data-dock-settings-icon]")
      if (el) {
        const rect = el.getBoundingClientRect()
        setAnchorRect({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })
      }
    }
    setSettingsOpen((prev) => !prev)
  }, [settingsOpen])

  return (
    <DockContext.Provider value={mouseX}>
      <nav
        aria-label="Site"
        className="fixed inset-x-0 bottom-10 z-50 flex justify-center pointer-events-none print:hidden"
      >
        <div
          data-dock
          role="toolbar"
          aria-label="Application dock"
          className="pointer-events-auto relative flex items-end gap-3 rounded-full border border-border bg-gradient-to-br from-stone-50/80 from-25% to-stone-100/80 p-1 pl-3 pr-3 pb-3 backdrop-blur-sm dark:border-white/10 dark:from-white/10 dark:to-white/5"
          style={{ height: 64 }}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
        >
          {navItems.map(({ href, labelKey, icon }) => (
            <DockIcon
              key={href}
              href={href}
              label={t(labelKey)}
              icon={icon}
              active={href === "/" ? pathname === "/" : pathname.startsWith(href)}
            />
          ))}
          <SettingsIcon
            expanded={settingsOpen}
            onToggle={handleToggle}
          />
        </div>
      </nav>

      <AnimatePresence>
        {settingsOpen && (
          <SettingsMenu
            onClose={() => setSettingsOpen(false)}
            anchorRect={anchorRect}
          />
        )}
      </AnimatePresence>
    </DockContext.Provider>
  )
}
