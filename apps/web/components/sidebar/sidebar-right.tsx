"use client"

import * as React from "react"
import { 
  Filter, Search, Users, BookOpen, 
  Building2, Calendar, ChevronDown, Check,
  Activity, BarChart3, HelpCircle, MessageSquare,
  Globe
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

const FILTER_DATA = [
  {
    title: "Carreiras",
    icon: Users,
    options: [
      "PF", "PRF", "PPF", "PLF CD", "DPRF",
      "Policial Civil", "Policial Militar", "Tribunais (AJAJ/TJ)", "Fiscal/Sefaz", "Administrativa"
    ],
  },
  {
    title: "Disciplinas",
    icon: BookOpen,
    options: [
      "Direito Constitucional", "Direito Administrativo", "Português", "Raciocínio Lógico", "Informática",
      "Direito Penal", "Direito Processual Penal", "Estatística", "Contabilidade", "Arquivologia"
    ],
  },
  {
    title: "Bancas",
    icon: Building2,
    options: [
      "FGV", "Cebraspe", "Vunesp", "FCC", "Instituto AOCP",
      "IBFC", "Fundatec", "Cesgranrio", "Fadesp", "Quadrix"
    ],
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
  const [activeFilters, setActiveFilters] = React.useState<string[]>([])
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(["Carreiras", "Disciplinas", "Situação"])
  const [searchTerms, setSearchTerms] = React.useState<Record<string, string>>({})

  if (!isOpen) return null

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  const toggleFilter = (option: string) => {
    setActiveFilters(prev => 
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    )
  }

  const handleSearchChange = (groupTitle: string, value: string) => {
    setSearchTerms(prev => ({ ...prev, [groupTitle]: value }))
  }

  return (
    <Sidebar side="right" collapsible="none" className="border-l bg-background w-80 h-screen sticky top-0 self-start" {...props}>
      <div className="flex flex-col h-full">
        <SidebarHeader className="p-6 border-b border-border/10 shrink-0 space-y-4">
            <div className="flex items-center gap-2 text-foreground">
                <Filter className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Filtros de Questões</h2>
            </div>
            
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input 
                    placeholder="BUSCA GLOBAL..." 
                    className="h-9 pl-10 bg-muted/10 border-border/60 rounded-xl text-[10px] font-black uppercase tracking-widest focus-visible:ring-1 focus-visible:ring-primary/20 transition-all placeholder:text-foreground/40"
                />
            </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
                {FILTER_DATA.map((group) => {
                const isExpanded = expandedGroups.includes(group.title)
                const searchTerm = searchTerms[group.title] || ""
                const filteredOptions = group.options.filter(opt => 
                    opt.toLowerCase().includes(searchTerm.toLowerCase())
                )

                return (
                    <SidebarGroup key={group.title} className="p-0 border border-transparent">
                    <div 
                        onClick={() => toggleGroup(group.title)}
                        className="flex items-center justify-between mb-2 px-2 py-2 group/title cursor-pointer hover:bg-muted/10 rounded-xl transition-all"
                    >
                        <div className="flex items-center gap-2">
                        <group.icon className="w-3.5 h-3.5 text-foreground/80" />
                        <SidebarGroupLabel className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-foreground cursor-pointer">
                            {group.title}
                        </SidebarGroupLabel>
                        </div>
                        <ChevronDown className={`w-3 h-3 text-foreground/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {isExpanded && (
                        <SidebarGroupContent className="space-y-3 animate-in fade-in zoom-in-95 origin-top duration-200">
                        <div className="relative px-2">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/40" />
                            <Input 
                            placeholder={`BUSCAR EM ${group.title.toUpperCase()}...`} 
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(group.title, e.target.value)}
                            className="h-8 pl-9 bg-muted/10 border-border/60 rounded-lg text-[9px] font-black uppercase tracking-widest focus-visible:ring-1 focus-visible:ring-primary/20 placeholder:text-foreground/30"
                            />
                        </div>

                        <ScrollArea className="max-h-[180px] px-1 overflow-y-auto no-scrollbar">
                            <div className="space-y-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => {
                                const isSelected = activeFilters.includes(option)
                                return (
                                    <div 
                                    key={option}
                                    onClick={() => toggleFilter(option)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all hover:bg-muted/20 group/opt ${
                                        isSelected ? "bg-primary/5" : ""
                                    }`}
                                    >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                        isSelected 
                                        ? "bg-primary border-primary" 
                                        : "border-border/60 bg-background group-hover/opt:border-primary/40"
                                    }`}>
                                        {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${
                                        isSelected ? "text-primary font-black" : "text-foreground/80"
                                    }`}>
                                        {option}
                                    </span>
                                    </div>
                                )
                                })
                            ) : (
                                <div className="py-4 text-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 italic">Sem resultados</span>
                                </div>
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

        <div className="p-6 border-t border-border/10 bg-muted/5 shrink-0">
            <Button 
            className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-primary hover:text-white transition-all shadow-xl shadow-foreground/10"
            >
            Aplicar Filtros
            </Button>
            <button 
            onClick={() => setActiveFilters([])}
            className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-red-500 transition-colors"
            >
            Limpar Seleção
            </button>
        </div>
      </div>
    </Sidebar>
  )
}
