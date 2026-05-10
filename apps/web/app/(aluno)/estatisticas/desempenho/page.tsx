"use client"

import * as React from "react"
import { BookOpen, BookMarked, Briefcase, ChevronRight, Calendar, TrendingUp, ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardDescription } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { StatOverviewCard } from "@/components/estatisticas/stat-overview-card"
import { DisciplinePerformanceList } from "@/components/estatisticas/discipline-performance-list"
import { EvolutionChart } from "@/components/estatisticas/evolution-chart"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

// --- Sub-componentes internos padronizados ---

function StatItem({ rank, title, stats, percentage }: any) {
    const isTop3 = rank <= 3
    const barColor =
        percentage === 100 ? "bg-emerald-500" : percentage >= 70 ? "bg-primary" : "bg-orange-500"

    return (
        <div className="flex items-center gap-3 py-2.5">
            <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                isTop3 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            }`}>
                {rank}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{title}</p>
                    <span className={`text-xs font-semibold ml-2 shrink-0 ${percentage === 100 ? "text-emerald-500" : "text-foreground"}`}>
                        {percentage}%
                    </span>
                </div>
                <Progress value={percentage} className={`h-1 ${barColor}`} />
                <p className="text-xs text-muted-foreground mt-0.5">{stats}</p>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        </div>
    )
}

function StatColumn({ title, subtitle, icon: Icon, items, count }: any) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-medium leading-none">{title}</p>
                        <CardDescription className="text-xs mt-0.5">{subtitle}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-1 divide-y">
                {items.map((item: any, i: number) => (
                    <StatItem key={i} rank={i + 1} {...item} />
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground gap-1.5 mt-1">
                    <ChevronDown className="h-3.5 w-3.5" />
                    Ver mais {count}
                </Button>
            </CardContent>
        </Card>
    )
}

// --- Página principal ---

export default function DesempenhoPage() {
    return (
        <div className="space-y-8">

            {/* Filtro */}
            <div className="flex justify-end">
                <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Últimos 30 Dias
                </Button>
            </div>

            <StatOverviewCard stats={PERFORMANCE_STATS.overall} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <EvolutionChart data={PERFORMANCE_STATS.evolution} />

                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardDescription>Média da Semana</CardDescription>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-semibold">82%</p>
                                    <span className="text-xs text-emerald-500 flex items-center gap-0.5 mb-1">
                                        <TrendingUp className="h-3 w-3" /> +4%
                                    </span>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Tempo Médio/Questão</CardDescription>
                                <p className="text-2xl font-semibold">1m 45s</p>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                <DisciplinePerformanceList disciplines={PERFORMANCE_STATS.byDiscipline} />
            </div>

            {/* Grid de colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t">
                <StatColumn
                    title="Por Disciplina"
                    subtitle="Suas melhores disciplinas"
                    icon={BookOpen}
                    count={2}
                    items={[
                        { title: "Matemática",            stats: "4 questões - 4 acertos",  percentage: 100 },
                        { title: "Informática",           stats: "2 questões - 2 acertos",  percentage: 100 },
                        { title: "Direito Administrativo",stats: "4 questões - 4 acertos",  percentage: 100 },
                        { title: "História",              stats: "5 questões - 4 acertos",  percentage: 85  },
                        { title: "Direito Penal",         stats: "26 questões - 15 acertos",percentage: 58  },
                    ]}
                />
                <StatColumn
                    title="Por Tópico"
                    subtitle="Seus melhores tópicos"
                    icon={BookMarked}
                    count={12}
                    items={[
                        { title: "Inequações",             stats: "4 questões - 4 acertos", percentage: 100 },
                        { title: "Princípios Fundamentais",stats: "2 questões - 2 acertos", percentage: 100 },
                        { title: "Teoria do Risco",        stats: "2 questões - 2 acertos", percentage: 100 },
                        { title: "Avaliação de Conteúdo",  stats: "4 questões - 4 acertos", percentage: 100 },
                        { title: "Diretórios",             stats: "2 questões - 2 acertos", percentage: 100 },
                    ]}
                />
                <StatColumn
                    title="Por Carreira"
                    subtitle="Suas carreiras em destaque"
                    icon={Briefcase}
                    count={3}
                    items={[
                        { title: "PCES", stats: "28 questões - 25 acertos", percentage: 89 },
                        { title: "PF",   stats: "15 questões - 10 acertos", percentage: 66 },
                        { title: "PRF",  stats: "10 questões - 5 acertos",  percentage: 50 },
                    ]}
                />
            </div>
        </div>
    )
}
