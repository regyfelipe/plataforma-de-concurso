"use client"

import * as React from "react"
import { Trophy, ChevronDown, Search, Filter } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { RankingPodium } from "@/components/rankings/ranking-podium"
import { RankingTable } from "@/components/rankings/ranking-table"
import { LEADERBOARD_DATA } from "@/data/mocks/rankings"

export default function RankingPorConcursoPage() {
    const [selectedConcurso, setSelectedConcurso] = React.useState("Polícia Federal - Agente")
    
    // Usando dados do mock (em produção seriam filtrados pelo concurso)
    const concursoData = LEADERBOARD_DATA["Geral"] 

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header com Seletor de Concurso */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Simulação de Vaga</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Ranking por Concurso
                    </h1>
                </div>

                <Button variant="outline" className="h-12 px-6 rounded-xl border-border/40 bg-card hover:bg-muted/10 gap-3 shadow-sm">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{selectedConcurso}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
                </Button>
            </div>

            {/* Filtros de Busca de Aluno no Concurso */}
            <div className="flex items-center gap-4 bg-muted/5 border border-border/20 p-4 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <input 
                        placeholder="Buscar concorrente..." 
                        className="w-full bg-transparent pl-10 pr-4 py-2 text-sm focus:outline-none"
                    />
                </div>
                <div className="h-4 w-[1px] bg-border/40" />
                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest gap-2 text-muted-foreground">
                    <Filter className="w-3.5 h-3.5" />
                    Filtros Avançados
                </Button>
            </div>

            {/* Pódio Dinâmico */}
            <RankingPodium data={concursoData} />

            {/* Tabela de Rankings */}
            <RankingTable data={concursoData} />
            
            {/* Disclaimer */}
            <div className="p-6 bg-primary/[0.03] border border-primary/10 rounded-2xl">
                <p className="text-[10px] font-medium text-primary/80 leading-relaxed">
                    * Este ranking considera apenas alunos ativos na plataforma que selecionaram este concurso como objetivo principal. A pontuação é baseada na precisão e volume de questões específicas deste edital.
                </p>
            </div>
        </div>
    )
}
