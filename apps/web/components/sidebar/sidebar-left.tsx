"use client"

import { ComponentProps, useState, useEffect } from "react"
import Link from "next/link"
import {
  IconDashboard,
  IconBook,
  IconNotebook,
  IconTrophy,
  IconChartBar,
  IconMessage,
  IconFolder,
  IconAlertTriangle,
  IconBriefcase,
  IconSignal4g,
  IconSchool,
  IconBuildingBank,
  IconClipboardList,
  IconBrain,
  IconBookmark,
  IconLibrary,
  IconChevronRight,
  IconInnerShadowTop
} from "@tabler/icons-react"

import { useLayout } from "@/contexts/layout-context"
import { NavUser } from "@/components/nav/nav-user"
import { useSession } from "@/lib/auth-client"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"

// Removido dado fixo "data" daqui

// ─── Main navigation (Principais) ───────────────────────────────────────────

const navPrincipais = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Estudar Questões",
    url: "#",
    icon: IconBook,
    items: [
      { title: "Resolver Questões", url: "/questoes/resolver" },
      { title: "Questões Favoritas", url: "/questoes/favoritas" },
      { title: "Questões Erradas", url: "/questoes/erradas" },
      // { title: "Histórico", url: "/questoes/historico" },
      { title: "Comentadas", url: "/questoes/comentadas" },
    ],
  },
  {
    title: "Caderno do Aluno",
    url: "/caderno",
    icon: IconNotebook,
  },
  {
    title: "Rankings",
    url: "#",
    icon: IconTrophy,
    items: [
      { title: "Geral", url: "/rankings/geral" },
      // { title: "Semanal", url: "/rankings/semanal" },
      { title: "Por Concurso", url: "/rankings/por-concurso" },
    ],
  },
  {
    title: "Estatísticas",
    url: "/estatisticas/desempenho",
    icon: IconChartBar,
    // items: [
    //   { title: "Desempenho", url: "/estatisticas/desempenho" },
    //   { title: "Taxa de Acerto", url: "/estatisticas/taxa-acerto" },
    //   { title: "Evolução", url: "/estatisticas/evolucao" },
    //   { title: "Tempo de Estudo", url: "/estatisticas/tempo-estudo" },
    // ],
  },
  {
    title: "Suporte",
    url: "#",
    icon: IconMessage,
    items: [
      { title: "Abrir Ticket", url: "/suporte/novo" },
      { title: "Meus Tickets", url: "/suporte/meus" },
      { title: "FAQ", url: "/suporte/faq" },
    ],
  },
]

// ─── Admin navigation ────────────────────────────────────────────────────────

const navAdmin = [

  {
    title: "Gestão de Questões",
    url: "#",
    icon: IconFolder,
    items: [
      { title: "Lista de Questões", url: "/admin/questoes" },
      { title: "Criar Questão", url: "/admin/questoes/criar" },
      { title: "Editar Questão", url: "/admin/questoes/editar" },
      { title: "Revisão", url: "/admin/questoes/revisao" },
      { title: "Publicadas", url: "/admin/questoes/publicadas" },
      { title: "Rejeitadas", url: "/admin/questoes/rejeitadas" },
      { title: "Importar Questões", url: "/admin/questoes/importar" },
    ],
  },
  {
    title: "Report de Questões",
    url: "#",
    icon: IconAlertTriangle,
    items: [
      { title: "Lista de Reports", url: "/admin/reports" },
      { title: "Revisar Reports", url: "/admin/reports/revisar" },
      { title: "Resolver Reports", url: "/admin/reports/resolver" },
    ],
  },
  {
    title: "Disciplinas",
    url: "/admin/disciplinas",
    icon: IconBook,
    
  },
  {
    title: "Carreiras",
    url: "/admin/carreiras",
    icon: IconBriefcase,
    
  },
  {
    title: "Níveis de Dificuldade",
    url: "/admin/dificuldade",
    icon: IconSignal4g,

  },
  {
    title: "Níveis Educacionais",
    url: "/admin/educacional",
    icon: IconSchool,
  
  },
  {
    title: "Bancas Examinadoras",
    url: "/admin/bancas",
    icon: IconBuildingBank,
  
  },
  {
    title: "Concursos",
    url: "/admin/concursos",
    icon: IconClipboardList,
   
  },
  {
    title: "Tipos de Questão",
    url: "/admin/tipos-questao",
    icon: IconBrain,
    
  },
  {
    title: "Assuntos",
    url: "/admin/assuntos",
    icon: IconBookmark,
   
  },
  {
    title: "Cadernos",
    url: "#",
    icon: IconLibrary,
    items: [
      { title: "Listar Cadernos", url: "/admin/cadernos" },
      { title: "Criar Caderno", url: "/admin/cadernos/criar" },
      // { title: "Editar Caderno", url: "/admin/cadernos/editar" },
      { title: "Compartilhados", url: "/admin/cadernos/compartilhados" },
    ],
  },
]

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  showAdmin?: boolean
}

export function AppSidebar({ showAdmin = false, ...props }: AppSidebarProps) {
  const { data: session } = useSession()
  const { variant, collapsible, side } = useLayout()

  const user = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "/avatars/default.jpg",
  }

  return (
    <Sidebar
      variant={variant}
      collapsible={collapsible}
      side={side}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <IconInnerShadowTop className="size-5!" />
              <span className="text-base font-semibold">PLataforma</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principais</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navPrincipais.map((item) => (
                <NavCollapsibleItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navAdmin.map((item) => (
                  <NavCollapsibleItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

function NavCollapsibleItem({ item }: { item: any }) {
  const { isMobile, state } = useSidebar()

  if (!item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton render={<Link href={item.url} />} tooltip={item.title}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  // Se a barra estiver recolhida e não for mobile, usamos DropdownMenu
  if (state === "collapsed" && !isMobile) {
    return (
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent side="right" align="start" className="min-w-48 rounded-xl ml-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5 border-b border-border/5 mb-1">
                {item.title}
              </DropdownMenuLabel>
              {item.items.map((subItem: any) => (
                <DropdownMenuItem
                  key={subItem.title}
                  className="text-xs font-bold uppercase tracking-wider cursor-pointer py-2 focus:bg-primary/5 focus:text-primary transition-all"
                  render={<Link href={subItem.url} />}
                >
                  {subItem.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    )
  }

  // Comportamento normal quando a barra está aberta ou em mobile
  return (
    <SidebarMenuItem>
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger
          render={
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          }
        />
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem: any) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton render={<Link href={subItem.url} />}>
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
