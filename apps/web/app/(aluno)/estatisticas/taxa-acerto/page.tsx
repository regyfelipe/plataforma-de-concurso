import { getSession } from "@workspace/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Target, Filter, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { AccuracyGauge } from "@/components/estatisticas/accuracy-gauge"
import { DifficultyAccuracyCards } from "@/components/estatisticas/difficulty-accuracy-cards"
import { BoardAccuracyList } from "@/components/estatisticas/board-accuracy-list"
import { SubjectAccuracyDetail } from "@/components/estatisticas/subject-accuracy-detail"
import {
    buildBucketMap,
    getGlobalStats,
    getUserStatisticAnswers,
    rankedBuckets,
    splitCurrentPrevious,
} from "../statistics-data"

const DIFFICULTY_COLORS: Record<string, string> = {
    facil: "#10b981",
    medio: "#3b82f6",
    dificil: "#f59e0b",
    muito_dificil: "#ef4444",
}

export default async function TaxaAcertoPage() {
    const session = await getSession(await headers())
    if (!session?.user?.id) redirect("/login")

    const { answers, today } = await getUserStatisticAnswers(session.user.id, 60)
    const { currentAnswers } = splitCurrentPrevious(answers, today)
    const stats = getGlobalStats(currentAnswers)
    const missingToGoal = Math.max(85 - stats.accuracy, 0)
    const goalProgress = Math.min(Math.round((stats.accuracy / 85) * 100), 100)

    const difficultyMap = buildBucketMap(
        currentAnswers,
        (answer) => answer.questao.dificuldade?.slug ?? "medio"
    )
    const difficultyData = Array.from(difficultyMap.entries()).map(([slug, item]) => ({
        level: slug.replaceAll("_", " "),
        accuracy: Math.round((item.correct / item.solved) * 100),
        color: DIFFICULTY_COLORS[slug] ?? "#3b82f6",
    }))

    const boardData = rankedBuckets(
        buildBucketMap(currentAnswers, (answer) => answer.questao.banca?.sigla ?? answer.questao.banca?.nome ?? "Sem banca")
    ).slice(0, 8).map((item) => ({
        board: item.name,
        accuracy: item.accuracy,
    }))

    const disciplineMap = buildBucketMap(
        currentAnswers,
        (answer) => answer.questao.disciplina?.nome ?? "Sem disciplina"
    )
    const topicByDiscipline = new Map<string, Map<string, { solved: number; correct: number }>>()

    for (const answer of currentAnswers) {
        const discipline = answer.questao.disciplina?.nome ?? "Sem disciplina"
        const topic = answer.questao.topico?.nome ?? answer.questao.assunto?.nome ?? "Sem assunto"
        const topicMap = topicByDiscipline.get(discipline) ?? new Map<string, { solved: number; correct: number }>()
        const current = topicMap.get(topic) ?? { solved: 0, correct: 0 }
        current.solved += 1
        current.correct += answer.isCorreta ? 1 : 0
        topicMap.set(topic, current)
        topicByDiscipline.set(discipline, topicMap)
    }

    const disciplines = rankedBuckets(disciplineMap).slice(0, 8).map((item) => ({
        name: item.name,
        precision: item.accuracy,
        solved: item.solved,
        topics: Array.from(topicByDiscipline.get(item.name)?.entries() ?? [])
            .map(([name, topic]) => ({
                name,
                precision: topic.solved > 0 ? Math.round((topic.correct / topic.solved) * 100) : 0,
            }))
            .sort((a, b) => b.precision - a.precision)
            .slice(0, 5),
    }))

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
                    <AccuracyGauge value={stats.accuracy} />
                    <DifficultyAccuracyCards data={difficultyData} />
                    <SubjectAccuracyDetail disciplines={disciplines} />
                </div>

                {/* Coluna lateral */}
                <div className="space-y-6">
                    <BoardAccuracyList data={boardData} />

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
                                Faltam apenas <span className="font-medium text-primary">{missingToGoal}%</span>.
                            </p>
                            <Progress value={goalProgress} className="h-2" />
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
