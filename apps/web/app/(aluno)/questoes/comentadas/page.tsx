"use client"

import * as React from "react"
import { Search, Filter, MessageSquare, ShieldCheck, Bookmark, ChevronRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { COMMENTED_QUESTIONS } from "../../../../data/mocks/questoes"

export default function QuestoesComentadasPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Inteligência Coletiva</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Questões Comentadas
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-6 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest bg-card">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        Apenas Professores
                    </Button>
                </div>
            </div>

            {/* Barra de Busca e Filtros */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input 
                            placeholder="Pesquise por palavras-chave, banca ou código..." 
                            className="pl-10 h-11 bg-muted/20 border-border/40 rounded-xl focus-visible:ring-primary/20"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-11 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Filter className="w-4 h-4 text-muted-foreground/40" />
                            Filtrar Matéria
                        </Button>
                    </div>
                </div>

                {/* Grid de Questões */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {COMMENTED_QUESTIONS.map((q) => (
                        <div key={q.id} className="group bg-muted/5 border border-border/40 rounded-3xl p-6 hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="text-[9px] font-black px-2 h-5 border-primary/20 text-primary uppercase">{q.subject}</Badge>
                                        <Badge variant="outline" className="text-[9px] font-black px-2 h-5 border-border/40 uppercase">{q.board} {q.year}</Badge>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                                        <Bookmark className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-mono text-[10px] font-bold text-muted-foreground/40">{q.code}</p>
                                    <p className="text-sm font-medium text-foreground leading-relaxed line-clamp-3">
                                        {q.preview}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <MessageSquare className="w-4 h-4 text-muted-foreground/40" />
                                            <span className="text-[11px] font-bold text-muted-foreground">{q.commentCount} comentários</span>
                                        </div>
                                        {q.hasTeacherComment && (
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                <span className="text-[9px] font-black text-emerald-600 uppercase">Comentário do Professor</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2 group-hover:text-primary transition-colors">
                                        Ver Explicação
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
