"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import React from "react"

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  
  // Divide a URL em partes e remove strings vazias
  const segments = pathname.split('/').filter(Boolean)
  
  // Mapeamento manual para nomes amigáveis (opcional)
  const routeNames: Record<string, string> = {
    dashboard: "Dashboard",
    questoes: "Questões",
    resolver: "Resolver",
    favoritas: "Favoritas",
    erradas: "Erradas",
    historico: "Histórico",
    comentadas: "Comentadas",
    caderno: "Caderno",
    meus: "Meus Cadernos",
    anotacoes: "Anotações",
    revisoes: "Revisões",
    rankings: "Rankings",
    geral: "Geral",
    semanal: "Semanal",
    estatisticas: "Estatísticas",
    desempenho: "Desempenho",
    admin: "Administração",
    disciplinas: "Disciplinas",
    carreiras: "Carreiras",
    criar: "Novo",
    editar: "Editar",
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/dashboard">Início</BreadcrumbLink>
        </BreadcrumbItem>
        
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const isLast = index === segments.length - 1
          const name = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href} className="hidden md:block">
                    {name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
