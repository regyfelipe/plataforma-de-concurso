"use client"

import * as React from "react"
import {
    Filter, Search, Users, BookOpen,
    Building2, Calendar, ChevronDown, Check,
    Activity, BarChart3, HelpCircle, MessageSquare,
    Globe, PanelRightClose, PanelRightOpen
} from "lucide-react"
import { useRightSidebar } from "@/contexts/right-sidebar-context"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
} from "@workspace/ui/components/sidebar"
import { Input } from "@workspace/ui/components/input"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"

const FILTER_DATA = [
    {
        title: "Carreiras",
        icon: Users,
        options: ["PF", "PRF", "PPF", "PLF CD", "DPRF", "Policial Civil", "Policial Militar", "Tribunais (AJAJ/TJ)", "Fiscal/Sefaz", "Administrativa"],
    },
    {
        title: "Disciplinas",
        icon: BookOpen,
        options: ["Direito Constitucional", "Direito Administrativo", "Português", "Raciocínio Lógico", "Informática", "Direito Penal", "Direito Processual Penal", "Estatística", "Contabilidade", "Arquivologia"],
    },
    {
        title: "Bancas",
        icon: Building2,
        options: ["FGV", "Cebraspe", "Vunesp", "FCC", "Instituto AOCP", "IBFC", "Fundatec", "Cesgranrio", "Fadesp", "Quadrix"],
    },
    {
        title: "Situação",
        icon: Activity,
        options: ["Não Resolvidas", "Resolvidas", "Acertos", "Erros", "Favoritas"],
    },
    {
        title: "Dificuldade",
        icon: BarChart3,
        options: ["Muito Fácil", "Fácil", "Média", "Difícil", "Muito Difícil"],
    },
    {
        title: "Tipo",
        icon: HelpCircle,
        options: ["Múltipla Escolha", "Certo / Errado", "Discursiva"],
    },
    {
        title: "Explicações",
        icon: MessageSquare,
        options: ["Com Comentário Professor", "Com Comentário Aluno", "Com Vídeo Aula", "Sem Comentários"],
    },
    {
        title: "Anos",
        icon: Calendar,
        options: ["2026", "2025", "2024", "2023", "2022", "2021", "2020"],
    },
    {
        title: "Abrangência",
        icon: Globe,
        options: ["Federal", "Estadual", "Municipal"],
    },
]

export function AppSidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isOpen } = useRightSidebar()
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const [activeFilters, setActiveFilters] = React.useState<string[]>([])
    const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["Carreiras", "Disciplinas", "Situação"])
    const [searchTerms, setSearchTerms] = React.useState<Record<string, string>>({})

    if (!isOpen) return null

    const toggleGroup = (title: string) =>
        setExpandedGroups((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
        )

    const toggleFilter = (option: string) =>
        setActiveFilters((prev) =>
            prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        )

    return (
        <Sidebar
            side="right"
            collapsible="none"
            className={`h-screen sticky top-0 self-start transition-all duration-200 ${isCollapsed ? "w-10" : "w-72"}`}
            {...props}
        >
            <div className="flex flex-col h-full">

                {/* Collapsed strip */}
                {isCollapsed ? (
                    <div className="flex flex-col items-center pt-3 px-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsCollapsed(false)}
                            title="Expandir filtros"
                        >
                            <PanelRightOpen className="h-4 w-4" />
                        </Button>
                        {activeFilters.length > 0 && (
                            <span className="mt-2 bg-primary text-primary-foreground rounded-full text-[10px] h-4 w-4 flex items-center justify-center font-semibold leading-none">
                                {activeFilters.length}
                            </span>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <SidebarHeader className="px-4 py-3 border-b shrink-0 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <h2 className="text-sm font-medium">Filtros de Questões</h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0"
                                    onClick={() => setIsCollapsed(true)}
                                    title="Recolher filtros"
                                >
                                    <PanelRightClose className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Busca global..." className="pl-9 h-8 text-sm" />
                            </div>
                        </SidebarHeader>

                        {/* Groups */}
                        <SidebarContent className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="p-3 space-y-1">
                                    {FILTER_DATA.map((group) => {
                                        const isExpanded = expandedGroups.includes(group.title)
                                        const searchTerm = searchTerms[group.title] ?? ""
                                        const filteredOptions = group.options.filter((opt) =>
                                            opt.toLowerCase().includes(searchTerm.toLowerCase())
                                        )

                                        return (
                                            <SidebarGroup key={group.title} className="p-0">
                                                {/* Group header */}
                                                <button
                                                    onClick={() => toggleGroup(group.title)}
                                                    className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <group.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        <SidebarGroupLabel className="p-0 h-auto text-xs font-medium text-foreground cursor-pointer">
                                                            {group.title}
                                                        </SidebarGroupLabel>
                                                    </div>
                                                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                                </button>

                                                {isExpanded && (
                                                    <SidebarGroupContent className="space-y-2 pb-2">
                                                        {/* Per-group search */}
                                                        <div className="relative px-2 pt-2">
                                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                                            <Input
                                                                placeholder={`Buscar em ${group.title}...`}
                                                                value={searchTerm}
                                                                onChange={(e) =>
                                                                    setSearchTerms((prev) => ({ ...prev, [group.title]: e.target.value }))
                                                                }
                                                                className="h-7 pl-8 text-xs"
                                                            />
                                                        </div>

                                                        {/* Options */}
                                                        <ScrollArea className="h-[128px] px-1">
                                                            <div className="space-y-0.5">
                                                                {filteredOptions.length > 0 ? (
                                                                    filteredOptions.map((option) => {
                                                                        const isSelected = activeFilters.includes(option)
                                                                        return (
                                                                            <button
                                                                                key={option}
                                                                                onClick={() => toggleFilter(option)}
                                                                                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs text-left transition-colors
                                                                                    ${isSelected
                                                                                        ? "bg-primary/10 text-primary"
                                                                                        : "text-foreground hover:bg-muted/50"
                                                                                    }`}
                                                                            >
                                                                                <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                                                                    isSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
                                                                                                }`}>
                                                                                    {isSelected && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
                                                                                </div>
                                                                                {option}
                                                                            </button>
                                                                        )
                                                                    })
                                                                ) : (
                                                                    <p className="py-3 text-center text-xs text-muted-foreground">
                                                                        Sem resultados
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </ScrollArea>
                                                    </SidebarGroupContent>
                                                )}
                                            </SidebarGroup>
                                        )
                                    })}
                                </div>
                            </ScrollArea>
                        </SidebarContent>

                        {/* Footer */}
                        <div className="p-4 border-t shrink-0 space-y-2">
                            <Button className="w-full" size="sm">
                                Aplicar Filtros
                                {activeFilters.length > 0 && (
                                    <span className="ml-2 bg-primary-foreground text-primary rounded-full text-[10px] px-1.5 py-0.5 font-semibold leading-none">
                                        {activeFilters.length}
                                    </span>
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground hover:text-destructive"
                                onClick={() => setActiveFilters([])}
                                disabled={activeFilters.length === 0}
                            >
                                Limpar Seleção
                            </Button>
                        </div>
                    </>
                )} {/* end !isCollapsed */}
            </div>
        </Sidebar>
    )
}
