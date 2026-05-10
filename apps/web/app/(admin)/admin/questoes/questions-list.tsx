"use client"

import { useState } from "react"
import { X, Filter, Trash2, Edit2, Copy } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import Link from "next/link"
import { QuestionCard } from "@/components/questoes/card"

type AdminQuestion = React.ComponentProps<typeof QuestionCard>["question"] & {
    access?: string
    visibility?: string
    status?: string
    reportsCount?: number
    createdAt?: string
    updatedAt?: string
}

interface AdminQuestionsListProps {
    questions: AdminQuestion[]
    totalPages: number
}

export function AdminQuestionsList({ questions, totalPages }: AdminQuestionsListProps) {
    const initialFilters = questions[0]
        ? [
            questions[0].career,
            questions[0].subject,
            questions[0].board,
            questions[0].year ? String(questions[0].year) : null,
        ].filter((filter): filter is string => Boolean(filter))
        : []
    const [activeFilters, setActiveFilters] = useState(initialFilters)

    const removeFilter = (filter: string) => {
        setActiveFilters(prev => prev.filter(f => f !== filter))
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
            <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
                
                {/* Header da Página */}
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-border/10 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tighter uppercase ">
                           Banco de Questões <span className="text-primary ">.</span>
                        </h1>
                      
                    </div>
                    
                   
                </div>

                {/* Barra de Filtros Selecionados */}
                {activeFilters.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 bg-muted/5 p-4 rounded-2xl border border-border/40 animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="flex items-center gap-2 mr-2">
                            <Filter className="w-3 h-3 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Filtros:</span>
                        </div>
                        
                        {activeFilters.map((filter) => (
                            <Badge 
                                key={filter} 
                                variant="secondary"
                                className="h-7 px-3 rounded-full bg-background border-border/60 text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 group hover:border-primary/40 transition-colors"
                            >
                                {filter}
                                <button 
                                    onClick={() => removeFilter(filter)}
                                    className="p-0.5 rounded-full hover:bg-red-500 hover:text-white transition-all"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </Badge>
                        ))}

                        <div className="h-4 w-[1px] bg-border/40 mx-2" />

                        <button 
                            onClick={() => setActiveFilters([])}
                            className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-red-500 flex items-center gap-1.5 transition-colors ml-auto"
                        >
                            <Trash2 className="w-3 h-3" />
                            Limpar Tudo
                        </button>
                    </div>
                )}

                {/* Lista de Questões - Visão Admin */}
                <div className="space-y-10">
                    {questions.length > 0 ? (
                        questions.map((q) => (
                            <div key={q.id} className="relative group">
                                {/* Ações Rápidas Flutuantes de Admin */}
                                <div className="absolute right-6 top-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                    <Link href={`/admin/questoes/editar/${q.id}`}>
                                        <Button variant="outline" size="sm" className="h-8 rounded-lg bg-background/80 backdrop-blur border-border/60 text-[9px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary">
                                            <Edit2 className="w-3 h-3 mr-2" /> Editar
                                        </Button>
                                    </Link>
                                    <Button variant="outline" size="sm" className="h-8 rounded-lg bg-background/80 backdrop-blur border-border/60 text-[9px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary">
                                        <Copy className="w-3 h-3 mr-2" /> Duplicar
                                    </Button>
                                </div>

                                {/* O Card que o aluno vê, mas com poder de Admin liberado */}
                                <QuestionCard 
                                    question={q} 
                                    userRole="ADMIN" 
                                    currentUserId="admin"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-16 text-center">
                            <p className="text-sm font-semibold text-foreground">Nenhuma questão cadastrada.</p>
                            <p className="mt-1 text-sm text-muted-foreground">Crie uma questão para ela aparecer neste banco.</p>
                        </div>
                    )}
                </div>

                {/* Paginação Minimalista */}
                <div className="flex justify-center py-12 border-t border-border/10">
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1).map(n => (
                            <button key={n} className={`w-8 h-8 text-[11px] font-black rounded-full transition-all ${n === 1 ? 'bg-foreground text-background shadow-xl' : 'text-muted-foreground/30 hover:bg-muted/10'}`}>
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
