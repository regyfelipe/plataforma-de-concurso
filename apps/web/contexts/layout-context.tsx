"use client"

import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react"

type SidebarVariant = "sidebar" | "floating" | "inset"
type SidebarCollapsible = "offcanvas" | "icon" | "none"
type SidebarSide = "left" | "right"
type ContentLayout = "full" | "centered"
type NavbarBehavior = "fixed" | "sticky"
type FontSize = "sm" | "base" | "lg"
type Radius = 0 | 0.3 | 0.5 | 0.75 | 1.0
type FontFamily = "sans" | "mono" | "serif" | "quicksand" | "inter" | "outfit" | "roboto" | "lexend"

interface LayoutContextProps {
  // Layout
  variant: SidebarVariant
  setVariant: (variant: SidebarVariant) => void
  collapsible: SidebarCollapsible
  setCollapsible: (collapsible: SidebarCollapsible) => void
  side: SidebarSide
  setSide: (side: SidebarSide) => void
  contentLayout: ContentLayout
  setContentLayout: (layout: ContentLayout) => void
  navbarBehavior: NavbarBehavior
  setNavbarBehavior: (behavior: NavbarBehavior) => void
  
  // Theme
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  radius: Radius
  setRadius: (radius: Radius) => void
  primaryColor: string
  setPrimaryColor: (color: string) => void
  fontFamily: FontFamily
  setFontFamily: (font: FontFamily) => void
}

const LayoutContext = createContext<LayoutContextProps | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Layout States
  const [variant, setVariant] = useState<SidebarVariant>("sidebar")
  const [collapsible, setCollapsible] = useState<SidebarCollapsible>("icon")
  const [side, setSide] = useState<SidebarSide>("left")
  const [contentLayout, setContentLayout] = useState<ContentLayout>("full")
  const [navbarBehavior, setNavbarBehavior] = useState<NavbarBehavior>("sticky")
  
  // Theme States
  const [fontSize, setFontSize] = useState<FontSize>("base")
  const [radius, setRadius] = useState<Radius>(0.5)
  const [primaryColor, setPrimaryColor] = useState<string>("default")
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans")

  // Carregar do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem("concurso-layout-settings")
    if (saved) {
      try {
        const config = JSON.parse(saved)
        if (config.variant) setVariant(config.variant)
        if (config.collapsible) setCollapsible(config.collapsible)
        if (config.side) setSide(config.side)
        if (config.contentLayout) setContentLayout(config.contentLayout)
        if (config.navbarBehavior) setNavbarBehavior(config.navbarBehavior)
        if (config.fontSize) setFontSize(config.fontSize)
        if (config.radius) setRadius(config.radius)
        if (config.primaryColor) setPrimaryColor(config.primaryColor)
        if (config.fontFamily) setFontFamily(config.fontFamily)
      } catch (e) {
        console.error("Erro ao carregar configurações do layout", e)
      }
    }
    setMounted(true)
  }, [])

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (!mounted) return
    
    const config = {
      variant, collapsible, side, contentLayout, navbarBehavior,
      fontSize, radius, primaryColor, fontFamily
    }
    localStorage.setItem("concurso-layout-settings", JSON.stringify(config))
  }, [variant, collapsible, side, contentLayout, navbarBehavior, fontSize, radius, primaryColor, fontFamily, mounted])

  // Efeito para aplicar Radius e Font Size globalmente
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--radius", `${radius}rem`)
    
    if (fontSize === "sm") root.style.fontSize = "14px"
    else if (fontSize === "base") root.style.fontSize = "16px"
    else if (fontSize === "lg") root.style.fontSize = "18px"
    
  }, [radius, fontSize])

  // Efeito para aplicar a paleta de cores (Data-Theme)
  useEffect(() => {
    const root = document.documentElement
    if (primaryColor === "default") {
        root.removeAttribute("data-theme")
    } else {
        root.setAttribute("data-theme", primaryColor)
    }
  }, [primaryColor])

  // Efeito para aplicar a Fonte (Data-Font)
  useEffect(() => {
    document.documentElement.setAttribute("data-font", fontFamily)
  }, [fontFamily])

  return (
    <LayoutContext.Provider value={{ 
        variant, setVariant, 
        collapsible, setCollapsible, 
        side, setSide,
        contentLayout, setContentLayout,
        navbarBehavior, setNavbarBehavior,
        fontSize, setFontSize,
        radius, setRadius,
        primaryColor, setPrimaryColor,
        fontFamily, setFontFamily
    }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
