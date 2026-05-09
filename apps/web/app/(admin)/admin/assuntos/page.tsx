"use client"

import * as React from "react"
import { Search, Plus, Bookmark, BookOpen, Layers, ChevronRight, ChevronDown, School, Settings2, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { DISCIPLINAS_MOCK, ASSUNTOS_MOCK } from "@/data/mocks/admin"

export default function ExploracaoAssuntosPage() {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set())

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds)
        if (newSet.has(id)) newSet.delete(id)
        else newSet.add(id)
        setExpandedIds(newSet)
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh]">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Gestão de Taxonomia</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Explorador de Conteúdo
                    </h1>
                </div>

                <div className="flex gap-3">
                    <Link href="/admin/assuntos/subtopicos">
                        <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all gap-2 shadow-lg shadow-primary/20">
                            <Plus className="w-4 h-4" />
                            Novo Item Hierárquico
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Explorador Moderno */}
            <div className="bg-card dark:bg-muted/5 border border-border/40 rounded-[2.5rem] overflow-hidden shadow-sm">
                
                {/* Barra de Filtros Interna */}
                <div className="p-6 border-b border-border/40 bg-muted/10 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input 
                            placeholder="Pesquisar na árvore..." 
                            className="pl-10 h-10 bg-background border-border/40 rounded-xl focus-visible:ring-primary/20 text-xs"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-border/40">
                        <Settings2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>

                {/* Árvore de Exploração */}
                <div className="p-4 min-h-[500px]">
                    {DISCIPLINAS_MOCK.map((disciplina) => (
                        <div key={disciplina.id} className="mb-2">
                            {/* Nível 1: Disciplina */}
                            <div 
                                onClick={() => toggleExpand(disciplina.id)}
                                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 cursor-pointer group transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                        <School className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-black tracking-tight text-foreground">{disciplina.name}</span>
                                    <Badge variant="ghost" className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                        {ASSUNTOS_MOCK.filter(a => a.disciplina === disciplina.name && a.level === 'assunto').length} Assuntos
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                    {expandedIds.has(disciplina.id) ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-muted-foreground/40" />}
                                </div>
                            </div>

                            {/* Nível 2: Assuntos */}
                            {expandedIds.has(disciplina.id) && (
                                <div className="ml-6 pl-4 border-l border-border/40 mt-1 space-y-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                    {ASSUNTOS_MOCK.filter(a => a.disciplina === disciplina.name && a.level === 'assunto').map((assunto) => (
                                        <div key={assunto.id}>
                                            <div 
                                                onClick={() => toggleExpand(assunto.id)}
                                                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/10 cursor-pointer group transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <BookOpen className={`w-4 h-4 transition-colors ${expandedIds.has(assunto.id) ? 'text-primary' : 'text-muted-foreground/30'}`} />
                                                    <span className={`text-[13px] font-bold ${expandedIds.has(assunto.id) ? 'text-foreground' : 'text-muted-foreground'}`}>{assunto.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] font-medium text-muted-foreground/30 uppercase tracking-tighter">
                                                        {ASSUNTOS_MOCK.filter(a => a.parentId === assunto.id).length} Tópicos
                                                    </span>
                                                    {expandedIds.has(assunto.id) ? <ChevronDown className="w-3.5 h-3.5 text-primary" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20" />}
                                                </div>
                                            </div>

                                            {/* Nível 3: Tópicos */}
                                            {expandedIds.has(assunto.id) && (
                                                <div className="ml-6 pl-4 border-l border-border/40 mt-1 space-y-1 animate-in fade-in slide-in-from-left-2 duration-300">
                                                    {ASSUNTOS_MOCK.filter(a => a.parentId === assunto.id).map((topico) => (
                                                        <div key={topico.id}>
                                                            <div 
                                                                onClick={() => toggleExpand(topico.id)}
                                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/10 cursor-pointer group transition-all"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <Bookmark className={`w-3.5 h-3.5 ${expandedIds.has(topico.id) ? 'text-primary/60' : 'text-muted-foreground/20'}`} />
                                                                    <span className="text-[12px] font-semibold text-muted-foreground group-hover:text-foreground">{topico.name}</span>
                                                                </div>
                                                                {expandedIds.has(topico.id) ? <ChevronDown className="w-3 h-3 text-primary/40" /> : <ChevronRight className="w-3 h-3 text-muted-foreground/10" />}
                                                            </div>

                                                            {/* Nível 4: Subtópicos */}
                                                            {expandedIds.has(topico.id) && (
                                                                <div className="ml-6 pl-4 border-l border-border/40 mt-1 space-y-0.5 animate-in fade-in slide-in-from-left-1 duration-200">
                                                                    {ASSUNTOS_MOCK.filter(a => a.parentId === topico.id).map((sub) => (
                                                                        <div key={sub.id} className="flex items-center justify-between p-1.5 rounded hover:bg-primary/5 transition-all group/sub cursor-default">
                                                                            <div className="flex items-center gap-2">
                                                                                <Layers className="w-3 h-3 text-muted-foreground/10 group-hover/sub:text-primary transition-colors" />
                                                                                <span className="text-[11px] font-medium text-muted-foreground/60 group-hover/sub:text-foreground">{sub.name}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
