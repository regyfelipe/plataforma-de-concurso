"use client"

import { TrendingUp, ChevronRight, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { ComparativeEvolutionChart } from "@/components/estatisticas/comparative-evolution-chart"
import { SkillsRadarChart } from "@/components/estatisticas/skills-radar-chart"
import { MasteryProgressCards } from "@/components/estatisticas/mastery-progress-cards"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

export default function EvolucaoPage() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Análise de Longo Prazo</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Minha Evolução</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Status de Carreira</p>
                        <p className="text-sm font-medium text-emerald-500 flex items-center gap-1 justify-end">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Em Ascensão
                        </p>
                    </div>
                    <Button size="sm">Simular Nota de Corte</Button>
                </div>
            </div>

            <MasteryProgressCards data={PERFORMANCE_STATS.mastery} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComparativeEvolutionChart data={PERFORMANCE_STATS.evolution} />
                <SkillsRadarChart data={PERFORMANCE_STATS.skills} />
            </div>

            {/* Projeção */}
            <Card>
                <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
                    <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Zap className="h-8 w-8 fill-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <h3 className="text-lg font-semibold">Previsão de Elite</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Baseado na sua velocidade atual de <span className="font-medium text-foreground">42 questões dominadas/semana</span>{" "}
                            e sua precisão média de <span className="font-medium text-foreground">82%</span>, você deve atingir o nível de aprovação
                            para a <span className="font-medium text-primary">Polícia Federal</span> em aproximadamente{" "}
                            <span className="font-medium text-foreground">4 meses</span>.
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                        Ver Roadmap Detalhado
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
