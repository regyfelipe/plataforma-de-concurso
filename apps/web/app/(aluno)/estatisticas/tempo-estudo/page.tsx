"use client"

import { Clock, TrendingUp, Calendar, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardDescription } from "@workspace/ui/components/card"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { WeeklyTimeChart } from "@/components/estatisticas/weekly-time-chart"
import { TimePerQuestionList } from "@/components/estatisticas/time-per-question-list"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

const TIME_STATS = (stats: typeof PERFORMANCE_STATS) => [
    { label: "Total Líquido",  value: `${stats.timeStats.totalLiquidHours}h`, icon: Zap,        color: "text-primary"      },
    { label: "Crescimento",    value: "+12% vs mês ant.",                      icon: TrendingUp, color: "text-emerald-500"  },
    { label: "Sessões Ativas", value: "342 Sessões",                           icon: Clock,      color: "text-orange-500"   },
]

export default function TempoEstudoPage() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Gestão de Produtividade</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Tempo de Estudo</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Média Diária</p>
                        <p className="text-sm font-medium text-primary flex items-center gap-1 justify-end">
                            <Clock className="h-3.5 w-3.5" />
                            {PERFORMANCE_STATS.timeStats.dailyAverage} / dia
                        </p>
                    </div>
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Esta Semana
                    </Button>
                </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TIME_STATS(PERFORMANCE_STATS).map((item) => (
                    <Card key={item.label}>
                        <CardContent className="flex items-center gap-4 pt-6">
                            <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
                            <div>
                                <CardDescription>{item.label}</CardDescription>
                                <p className="text-xl font-semibold">{item.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyTimeChart data={PERFORMANCE_STATS.timeStats.weeklyDistribution} />
                <TimePerQuestionList data={PERFORMANCE_STATS.timeStats.timePerQuestionBySubject} />
            </div>

            {/* Banner de produtividade */}
            <Card>
                <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
                    <div className="flex -space-x-3 shrink-0">
                        {[1, 2, 3].map((i) => (
                            <Avatar key={i} className="h-10 w-10 border-2 border-background">
                                <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                        Você está entre os <span className="font-medium text-foreground">15% mais constantes</span> da plataforma.
                        Manter uma média de 4h líquidas por dia é o padrão de aprovação para concursos de alto nível. Continue assim!
                    </p>
                    <Button size="sm" className="shrink-0">
                        Ver Ranking de Constância
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
