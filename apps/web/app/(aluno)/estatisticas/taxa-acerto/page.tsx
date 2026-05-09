"use client"

import * as React from "react"
import { Target, Download, Filter, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { AccuracyGauge } from "@/components/estatisticas/accuracy-gauge"
import { DifficultyAccuracyCards } from "@/components/estatisticas/difficulty-accuracy-cards"
import { BoardAccuracyList } from "@/components/estatisticas/board-accuracy-list"
import { SubjectAccuracyDetail } from "@/components/estatisticas/subject-accuracy-detail"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

export default function TaxaAcertoPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Métrica de Precisão</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Taxa de Acerto
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-6 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Filter className="w-4 h-4 text-muted-foreground/40" />
                        Todas as Bancas
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna do Gauge e Dificuldade (2/3 da largura) */}
                <div className="lg:col-span-2 space-y-8">
                    <AccuracyGauge value={PERFORMANCE_STATS.overall.precision} />
                    <DifficultyAccuracyCards data={PERFORMANCE_STATS.byDifficulty} />
                    <SubjectAccuracyDetail disciplines={PERFORMANCE_STATS.byDiscipline} />
                </div>

                {/* Coluna da Banca (1/3 da largura) */}
                <div className="space-y-8">
                    <BoardAccuracyList data={PERFORMANCE_STATS.byBoard} />
                    
                    {/* Card de Meta de Precisão */}
                    <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Meta de Curto Prazo</h4>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                            Sua meta é atingir <span className="text-foreground font-black">85%</span> de acertos globais para entrar na zona de classificação segura. Faltam apenas <span className="text-primary font-black">3%</span>.
                        </p>
                        <div className="pt-2">
                            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-[94%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rodapé de Navegação */}
            <div className="flex justify-center pt-4">
                <Button variant="ghost" className="text-muted-foreground/40 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] gap-2">
                    Analisar erros por tipo de assunto
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
