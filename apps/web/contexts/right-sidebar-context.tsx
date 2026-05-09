"use client"

import * as React from "react"

type RightSidebarContextProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  toggleSidebar: () => void
}

const RightSidebarContext = React.createContext<RightSidebarContextProps | undefined>(undefined)

export function RightSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return (
    <RightSidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </RightSidebarContext.Provider>
  )
}

export function useRightSidebar() {
  const context = React.useContext(RightSidebarContext)
  if (!context) {
    throw new Error("useRightSidebar must be used within a RightSidebarProvider")
  }
  return context
}
