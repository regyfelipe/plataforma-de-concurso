"use client"

import * as React from "react"
import { TrendingUp, Award, Calendar, ChevronRight, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { ComparativeEvolutionChart } from "@/components/estatisticas/comparative-evolution-chart"
import { SkillsRadarChart } from "@/components/estatisticas/skills-radar-chart"
import { MasteryProgressCards } from "@/components/estatisticas/mastery-progress-cards"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

export default function EvolucaoPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Análise de Longo Prazo</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Minha Evolução
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Status de Carreira</p>
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Em Ascensão
                        </p>
                    </div>
                    <Button className="h-11 px-6 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all">
                        Simular Nota de Corte
                    </Button>
                </div>
            </div>

            {/* Cards de Maestria (Repetição Espaçada) */}
            <MasteryProgressCards data={PERFORMANCE_STATS.mastery} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico de Evolução Comparativa */}
                <ComparativeEvolutionChart data={PERFORMANCE_STATS.evolution} />

                {/* Radar de Competências */}
                <SkillsRadarChart data={PERFORMANCE_STATS.skills} />
            </div>

            {/* Seção de Projeção */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-10 relative overflow-hidden group">
                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <Zap className="w-10 h-10 fill-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                        <h3 className="text-2xl font-black tracking-tighter text-foreground">Previsão de Elite</h3>
                        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-2xl">
                            Baseado na sua velocidade atual de <span className="text-foreground font-black">42 questões dominadas/semana</span> e sua precisão média de <span className="text-foreground font-black">82%</span>, você deve atingir o nível de aprovação para a <span className="text-primary font-black uppercase">Polícia Federal</span> em aproximadamente <span className="text-foreground font-black italic">4 meses</span>.
                        </p>
                    </div>
                    <Button variant="outline" className="rounded-xl h-12 px-8 text-[11px] font-black uppercase tracking-widest border-border/40 hover:bg-muted/10 gap-2 shrink-0">
                        Ver Roadmap Detalhado
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                
                {/* Efeito de fundo decorativo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            </div>
        </div>
    )
}
