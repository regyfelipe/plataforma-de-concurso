import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { BookOpen, BookMarked, Briefcase, ChevronRight, Calendar, TrendingUp, ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardDescription } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { StatOverviewCard } from "@/components/estatisticas/stat-overview-card"
import { DisciplinePerformanceList } from "@/components/estatisticas/discipline-performance-list"
import { EvolutionChart } from "@/components/estatisticas/evolution-chart"

type StatListItem = {
    title: string
    stats: string
    percentage: number
}

type StatColumnProps = {
    title: string
    subtitle: string
    icon: React.ElementType
    items: StatListItem[]
    count: number
}

type PerformanceBucket = {
    solved: number
    correct: number
    timeSeconds: number
}

function StatItem({ rank, title, stats, percentage }: StatListItem & { rank: number }) {
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

function StatColumn({ title, subtitle, icon: Icon, items, count }: StatColumnProps) {
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
                {items.map((item, i) => (
                    <StatItem key={item.title} rank={i + 1} {...item} />
                ))}
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground gap-1.5 mt-1">
                    <ChevronDown className="h-3.5 w-3.5" />
                    Ver mais {count}
                </Button>
            </CardContent>
        </Card>
    )
}

function startOfDay(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function addDays(date: Date, days: number) {
    const next = new Date(date)
    next.setUTCDate(next.getUTCDate() + days)
    return next
}

function percentage(correct: number, solved: number) {
    return solved > 0 ? Math.round((correct / solved) * 100) : 0
}

function formatStudyTime(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    return `${minutes}m`
}

function formatAverageTime(seconds: number) {
    if (!seconds) return "0s"
    const minutes = Math.floor(seconds / 60)
    const rest = seconds % 60
    return minutes > 0 ? `${minutes}m ${rest.toString().padStart(2, "0")}s` : `${rest}s`
}

function bucketAdd(map: Map<string, PerformanceBucket>, key: string, isCorrect: boolean, timeSeconds: number) {
    const current = map.get(key) ?? { solved: 0, correct: 0, timeSeconds: 0 }
    current.solved += 1
    current.correct += isCorrect ? 1 : 0
    current.timeSeconds += timeSeconds
    map.set(key, current)
}

function toRankedItems(map: Map<string, PerformanceBucket>) {
    return Array.from(map.entries())
        .map(([title, item]) => ({
            title,
            stats: `${item.solved} questões - ${item.correct} acertos`,
            percentage: percentage(item.correct, item.solved),
        }))
        .sort((a, b) => b.percentage - a.percentage || Number.parseInt(b.stats) - Number.parseInt(a.stats))
}

export default async function DesempenhoPage() {
    const session = await getSession(await headers())
    if (!session?.user?.id) redirect("/login")

    const today = startOfDay()
    const from = addDays(today, -29)
    const previousFrom = addDays(from, -30)

    const answers = await prisma.respostaUsuario.findMany({
        where: {
            usuarioId: session.user.id,
            respondidoEm: { gte: previousFrom },
        },
        orderBy: { respondidoEm: "asc" },
        select: {
            isCorreta: true,
            tempoSeg: true,
            respondidoEm: true,
            questao: {
                select: {
                    disciplina: { select: { nome: true } },
                    assunto: { select: { nome: true } },
                    topico: { select: { nome: true } },
                    carreira: { select: { nome: true } },
                },
            },
        },
    })

    const currentAnswers = answers.filter((answer) => answer.respondidoEm >= from)
    const previousAnswers = answers.filter((answer) => answer.respondidoEm < from)
    const totalQuestions = currentAnswers.length
    const totalCorrect = currentAnswers.filter((answer) => answer.isCorreta).length
    const totalTimeSeconds = currentAnswers.reduce((sum, answer) => sum + (answer.tempoSeg ?? 0), 0)
    const activeDays = new Set(currentAnswers.map((answer) => answer.respondidoEm.toISOString().slice(0, 10))).size
    const precision = percentage(totalCorrect, totalQuestions)
    const previousPrecision = percentage(
        previousAnswers.filter((answer) => answer.isCorreta).length,
        previousAnswers.length
    )
    const precisionDelta = precision - previousPrecision

    const weeklyBuckets = Array.from({ length: 6 }, (_, index) => ({
        label: `Sem. ${index + 1}`,
        from: addDays(from, index * 5),
        to: addDays(from, index * 5 + 5),
    }))

    const evolution = weeklyBuckets.map((bucket, index) => {
        const bucketAnswers = currentAnswers.filter((answer) =>
            answer.respondidoEm >= bucket.from &&
            (index === weeklyBuckets.length - 1 ? answer.respondidoEm <= addDays(today, 1) : answer.respondidoEm < bucket.to)
        )

        return {
            week: bucket.label,
            value: percentage(bucketAnswers.filter((answer) => answer.isCorreta).length, bucketAnswers.length),
        }
    })

    const disciplineMap = new Map<string, PerformanceBucket>()
    const topicMap = new Map<string, PerformanceBucket>()
    const careerMap = new Map<string, PerformanceBucket>()

    for (const answer of currentAnswers) {
        const time = answer.tempoSeg ?? 0
        bucketAdd(disciplineMap, answer.questao.disciplina?.nome ?? "Sem disciplina", answer.isCorreta, time)
        bucketAdd(topicMap, answer.questao.topico?.nome ?? answer.questao.assunto?.nome ?? "Sem tópico", answer.isCorreta, time)
        bucketAdd(careerMap, answer.questao.carreira?.nome ?? "Sem carreira", answer.isCorreta, time)
    }

    const disciplineItems = toRankedItems(disciplineMap)
    const topicItems = toRankedItems(topicMap)
    const careerItems = toRankedItems(careerMap)
    const byDiscipline = disciplineItems.slice(0, 5).map((item) => ({
        name: item.title,
        precision: item.percentage,
        solved: Number(item.stats.split(" ")[0]) || 0,
        trend: item.percentage >= 70 ? "up" : item.percentage >= 50 ? "flat" : "down",
    }))

    const averageTime = totalQuestions > 0 ? Math.round(totalTimeSeconds / totalQuestions) : 0

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Últimos 30 Dias
                </Button>
            </div>

            <StatOverviewCard stats={{
                precision,
                totalQuestions,
                studyTime: formatStudyTime(totalTimeSeconds),
                activeDays,
            }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <EvolutionChart data={evolution} />

                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardDescription>Média da Semana</CardDescription>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-semibold">{precision}%</p>
                                    <span className={`text-xs ${precisionDelta >= 0 ? "text-emerald-500" : "text-destructive"} flex items-center gap-0.5 mb-1`}>
                                        <TrendingUp className="h-3 w-3" /> {precisionDelta >= 0 ? "+" : ""}{precisionDelta}%
                                    </span>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardDescription>Tempo Médio/Questão</CardDescription>
                                <p className="text-2xl font-semibold">{formatAverageTime(averageTime)}</p>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                <DisciplinePerformanceList disciplines={byDiscipline} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t">
                <StatColumn
                    title="Por Disciplina"
                    subtitle="Suas melhores disciplinas"
                    icon={BookOpen}
                    count={Math.max(disciplineItems.length - 5, 0)}
                    items={disciplineItems.slice(0, 5)}
                />
                <StatColumn
                    title="Por Tópico"
                    subtitle="Seus melhores tópicos"
                    icon={BookMarked}
                    count={Math.max(topicItems.length - 5, 0)}
                    items={topicItems.slice(0, 5)}
                />
                <StatColumn
                    title="Por Carreira"
                    subtitle="Suas carreiras em destaque"
                    icon={Briefcase}
                    count={Math.max(careerItems.length - 5, 0)}
                    items={careerItems.slice(0, 5)}
                />
            </div>
        </div>
    )
}
