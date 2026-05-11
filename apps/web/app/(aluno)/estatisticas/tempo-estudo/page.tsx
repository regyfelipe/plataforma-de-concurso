import { getSession } from "@workspace/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Clock, TrendingUp, Calendar, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription } from "@workspace/ui/components/card"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { WeeklyTimeChart } from "@/components/estatisticas/weekly-time-chart"
import { TimePerQuestionList } from "@/components/estatisticas/time-per-question-list"
import {
    addDays,
    buildBucketMap,
    formatStudyTime,
    getGlobalStats,
    getUserStatisticAnswers,
    rankedBuckets,
    splitCurrentPrevious,
    startOfDay,
} from "../statistics-data"

function decimalHours(seconds: number) {
    return Number((seconds / 3600).toFixed(1))
}

export default async function TempoEstudoPage() {
    const session = await getSession(await headers())
    if (!session?.user?.id) redirect("/login")

    const { answers, today } = await getUserStatisticAnswers(session.user.id, 60)
    const { currentAnswers, previousAnswers } = splitCurrentPrevious(answers, today)
    const stats = getGlobalStats(currentAnswers)
    const previousStats = getGlobalStats(previousAnswers)
    const growth = previousStats.timeSeconds > 0
        ? Math.round(((stats.timeSeconds - previousStats.timeSeconds) / previousStats.timeSeconds) * 100)
        : stats.timeSeconds > 0 ? 100 : 0

    const weekStart = addDays(startOfDay(), -6)
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
    const weeklyDistribution = Array.from({ length: 7 }, (_, index) => {
        const day = addDays(weekStart, index)
        const nextDay = addDays(day, 1)
        const seconds = currentAnswers
            .filter((answer) => answer.respondidoEm >= day && answer.respondidoEm < nextDay)
            .reduce((sum, answer) => sum + (answer.tempoSeg ?? 0), 0)

        return {
            day: weekDays[day.getUTCDay()] ?? "Dia",
            hours: decimalHours(seconds),
        }
    })

    const subjectTime = rankedBuckets(
        buildBucketMap(currentAnswers, (answer) => answer.questao.disciplina?.nome ?? "Sem disciplina")
    )
        .slice(0, 8)
        .map((item) => ({
            subject: item.name,
            time: item.solved > 0 ? Math.round(item.timeSeconds / item.solved) : 0,
        }))

    const dailyAverageSeconds = stats.activeDays > 0 ? Math.round(stats.timeSeconds / stats.activeDays) : 0
    const timeStats = [
        { label: "Total Líquido",  value: formatStudyTime(stats.timeSeconds), icon: Zap,        color: "text-primary"      },
        { label: "Crescimento",    value: `${growth >= 0 ? "+" : ""}${growth}% vs mês ant.`,    icon: TrendingUp, color: "text-emerald-500"  },
        { label: "Sessões Ativas", value: `${stats.solved} Sessões`,                            icon: Clock,      color: "text-orange-500"   },
    ]

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
                            {formatStudyTime(dailyAverageSeconds)} / dia
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
                {timeStats.map((item) => (
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
                <WeeklyTimeChart data={weeklyDistribution} />
                <TimePerQuestionList data={subjectTime} />
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
                        Manter uma média consistente de estudo líquido por dia é o padrão de aprovação para concursos de alto nível. Continue assim!
                    </p>
                    <Button size="sm" className="shrink-0">
                        Ver Ranking de Constância
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
