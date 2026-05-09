"use client"

import * as React from "react"
import { 
    Book, 
    Plus, 
    Search, 
    MoreHorizontal, 
    Play, 
    Clock, 
    ChevronRight,
    BarChart3,
    Layers,
    Calendar
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Progress } from "@workspace/ui/components/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

// --- Mock de Dados ---
const MY_NOTEBOOKS = [
    {
        id: "1",
        title: "Revisão Final - PRF 2024",
        description: "Foco em Legislação de Trânsito e Direito Administrativo.",
        questions: 150,
        solved: 45,
        lastActivity: "Há 40 min"
    },
    {
        id: "2",
        title: "Direito Constitucional - Top 100",
        description: "As 100 questões mais cobradas pela FCC nos últimos 2 anos.",
        questions: 100,
        solved: 88,
        lastActivity: "Ontem"
    }
]

export default function MeusCadernosPage() {
    const [searchQuery, setSearchQuery] = React.useState("")

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background max-w-7xl mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Gestão de Estudos</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Meus Cadernos
                    </h1>
                </div>

                <Button className="rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-[11px] uppercase tracking-widest h-11 px-6 hover:scale-[1.02] transition-all gap-2">
                    <Plus className="w-4 h-4" />
                    Criar Novo
                </Button>
            </div>

            {/* Quick Stats Dashboard Pattern */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: "Total de Cadernos", value: "2", icon: Layers },
                    { title: "Questões Totais", value: "250", icon: BarChart3 },
                    { title: "Última Revisão", value: "Hoje", icon: Calendar }
                ].map((stat, i) => (
                    <div key={i} className="bg-card dark:bg-muted/10 border border-border/40 p-5 rounded-[1.5rem] flex items-center gap-4 hover:border-primary/30 transition-all group">
                        <div className="p-2 rounded-xl bg-muted/20 dark:bg-white/5 border border-border/20 dark:border-white/5 text-muted-foreground group-hover:text-primary transition-all">
                            <stat.icon className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/40">{stat.title}</p>
                            <h4 className="text-xl font-black tracking-tighter text-foreground">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Busca */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                <Input 
                    placeholder="Filtrar cadernos..." 
                    className="pl-10 h-12 bg-card dark:bg-muted/10 border-border/40 rounded-xl text-sm"
                    value={searchQuery}
                />
            </div>

            {/* Grid de Cadernos - Padrão Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MY_NOTEBOOKS.map((notebook) => (
                    <div 
                        key={notebook.id} 
                        className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] space-y-6 hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm"
                    >
                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                    {notebook.title}
                                </h3>
                                <p className="text-[10px] font-bold text-muted-foreground/50 leading-relaxed line-clamp-2">
                                    {notebook.description}
                                </p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger 
                                    render={
                                        <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground/40">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    }
                                />
                                <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                                    <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest p-3">Editar</DropdownMenuItem>
                                    <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest p-3 text-red-500">Excluir</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-end">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">Progresso</p>
                                <span className="text-[10px] font-black text-primary">
                                    {Math.round((notebook.solved / notebook.questions) * 100)}%
                                </span>
                            </div>
                            <Progress value={(notebook.solved / notebook.questions) * 100} className="h-1 bg-muted/20" />
                        </div>

                        <div className="flex items-center justify-between pt-2 relative z-10">
                            <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">
                                <Clock className="w-3.5 h-3.5" />
                                {notebook.lastActivity}
                            </div>
                            <Button size="sm" className="rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 h-9 font-black text-[10px] uppercase tracking-widest transition-all">
                                Estudar
                                <Play className="w-3 h-3 ml-2 fill-current" />
                            </Button>
                        </div>

                        {/* Glow de Hover padrão dashboard */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    )
}
