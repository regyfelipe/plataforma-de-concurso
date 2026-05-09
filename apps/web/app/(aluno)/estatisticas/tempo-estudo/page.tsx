"use client"

import * as React from "react"
import { Clock, TrendingUp, Calendar, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { WeeklyTimeChart } from "@/components/estatisticas/weekly-time-chart"
import { TimePerQuestionList } from "@/components/estatisticas/time-per-question-list"
import { StatOverviewCard } from "@/components/estatisticas/stat-overview-card"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

export default function TempoEstudoPage() {
    // Custom stats para o overview de tempo
    const timeOverview = {
        precision: 0, // não usado aqui
        totalQuestions: PERFORMANCE_STATS.overall.totalQuestions,
        studyTime: PERFORMANCE_STATS.timeStats.totalLiquidHours + "h",
        activeDays: PERFORMANCE_STATS.overall.activeDays
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Gestão de Produtividade</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Tempo de Estudo
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Média Diária</p>
                        <p className="text-xs font-black text-primary uppercase tracking-tighter flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {PERFORMANCE_STATS.timeStats.dailyAverage} / dia
                        </p>
                    </div>
                    <Button variant="outline" className="h-11 px-6 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Calendar className="w-4 h-4 text-muted-foreground/40" />
                        Esta Semana
                    </Button>
                </div>
            </div>

            {/* Overview de Tempo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] flex items-center gap-6 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="w-6 h-6 fill-primary" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Total Líquido</p>
                        <p className="text-2xl font-black tracking-tighter text-foreground">{PERFORMANCE_STATS.timeStats.totalLiquidHours} Horas</p>
                    </div>
                </div>
                <div className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] flex items-center gap-6 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Crescimento</p>
                        <p className="text-2xl font-black tracking-tighter text-foreground">+12% vs mês ant.</p>
                    </div>
                </div>
                <div className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] flex items-center gap-6 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Sessões Ativas</p>
                        <p className="text-2xl font-black tracking-tighter text-foreground">342 Sessões</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico Semanal */}
                <WeeklyTimeChart data={PERFORMANCE_STATS.timeStats.weeklyDistribution} />

                {/* Velocidade por Questão */}
                <TimePerQuestionList data={PERFORMANCE_STATS.timeStats.timePerQuestionBySubject} />
            </div>

            {/* Disclaimer de Produtividade */}
            <div className="p-8 bg-muted/5 border border-border/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-8">
                <div className="flex -space-x-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-muted flex items-center justify-center text-[10px] font-black uppercase">
                            U{i}
                        </div>
                    ))}
                </div>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed flex-1">
                    Você está entre os <span className="text-foreground font-black">15% mais constantes</span> da plataforma. Manter uma média de 4h líquidas por dia é o padrão de aprovação para concursos de alto nível. Continue assim!
                </p>
                <Button className="rounded-xl h-12 px-8 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest">
                    Ver Ranking de Constância
                </Button>
            </div>
        </div>
    )
}
