"use client"

import { Target, Filter, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { AccuracyGauge } from "@/components/estatisticas/accuracy-gauge"
import { DifficultyAccuracyCards } from "@/components/estatisticas/difficulty-accuracy-cards"
import { BoardAccuracyList } from "@/components/estatisticas/board-accuracy-list"
import { SubjectAccuracyDetail } from "@/components/estatisticas/subject-accuracy-detail"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

export default function TaxaAcertoPage() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Métrica de Precisão</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Taxa de Acerto</h1>
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Todas as Bancas
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna principal */}
                <div className="lg:col-span-2 space-y-6">
                    <AccuracyGauge value={PERFORMANCE_STATS.overall.precision} />
                    <DifficultyAccuracyCards data={PERFORMANCE_STATS.byDifficulty} />
                    <SubjectAccuracyDetail disciplines={PERFORMANCE_STATS.byDiscipline} />
                </div>

                {/* Coluna lateral */}
                <div className="space-y-6">
                    <BoardAccuracyList data={PERFORMANCE_STATS.byBoard} />

                    {/* Card de Meta */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Target className="h-4 w-4 text-primary" />
                                Meta de Curto Prazo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Sua meta é atingir <span className="font-medium text-foreground">85%</span> de acertos globais.
                                Faltam apenas <span className="font-medium text-primary">3%</span>.
                            </p>
                            <Progress value={94} className="h-2" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-center pt-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    Analisar erros por tipo de assunto
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
