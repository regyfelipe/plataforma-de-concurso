"use client"

import { useRightSidebar } from "@/contexts/right-sidebar-context"
import { Button } from "@workspace/ui/components/button"
import { Filter } from "lucide-react"
import { usePathname } from "next/navigation"

export function SidebarTriggerRight() {
  const { toggleSidebar } = useRightSidebar()
  const pathname = usePathname()

  // O ícone de filtro só aparece na página de gerenciamento de questões
  const isQuestionsPage = pathname === "/admin/questoes"

  if (!isQuestionsPage) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-primary/10 hover:text-primary transition-colors group"
      onClick={toggleSidebar}
    >
      <Filter className="h-4 w-4 group-hover:scale-110 transition-transform" />
      <span className="sr-only">Abrir Filtros</span>
    </Button>
  )
}
