import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { TrendingUp, ChevronRight, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { ComparativeEvolutionChart } from "@/components/estatisticas/comparative-evolution-chart"
import { SkillsRadarChart } from "@/components/estatisticas/skills-radar-chart"
import { MasteryProgressCards } from "@/components/estatisticas/mastery-progress-cards"
import {
    buildBucketMap,
    buildEvolution,
    getGlobalStats,
    getUserStatisticAnswers,
    rankedBuckets,
    splitCurrentPrevious,
} from "../statistics-data"

export default async function EvolucaoPage() {
    const session = await getSession(await headers())
    if (!session?.user?.id) redirect("/login")

    const [{ answers, today }, totalPublishedQuestions, user, availableDisciplines] = await Promise.all([
        getUserStatisticAnswers(session.user.id, 60),
        prisma.questao.count({
            where: {
                status: "published",
                visibilidade: "publica",
            },
        }),
        prisma.usuario.findUnique({
            where: { id: session.user.id },
            select: {
                perfilExtra: {
                    select: {
                        carreira: { select: { nome: true } },
                    },
                },
            },
        }),
        prisma.disciplina.findMany({
            where: {
                ativo: true,
                questoes: {
                    some: {
                        status: "published",
                        visibilidade: "publica",
                    },
                },
            },
            orderBy: { nome: "asc" },
            take: 6,
            select: { nome: true },
        }),
    ])
    const { currentAnswers, currentFrom } = splitCurrentPrevious(answers, today)
    const stats = getGlobalStats(currentAnswers)
    const evolution = buildEvolution(currentAnswers, currentFrom, today)
    const disciplineBuckets = rankedBuckets(
        buildBucketMap(currentAnswers, (answer) => answer.questao.disciplina?.nome ?? "Sem disciplina")
    )
    const skills = disciplineBuckets.length > 0
        ? disciplineBuckets.slice(0, 6).map((item) => ({
            subject: item.name,
            A: item.accuracy,
            fullMark: 100,
        }))
        : availableDisciplines.map((discipline) => ({
            subject: discipline.nome,
            A: 0,
            fullMark: 100,
        }))
    const mastered = currentAnswers.filter((answer) => answer.isCorreta).length
    const learning = currentAnswers.filter((answer) => !answer.isCorreta).length
    const newQuestions = Math.max(totalPublishedQuestions - currentAnswers.length, 0)
    const masteredPerWeek = Math.round(mastered / 4)
    const hasHistory = stats.solved > 0
    const statusLabel = !hasHistory ? "Aguardando Dados" : stats.accuracy >= 70 ? "Em Ascensão" : "Em Construção"
    const monthsToApproval = !hasHistory ? 0 : stats.accuracy >= 85 ? 1 : Math.max(2, Math.ceil((85 - stats.accuracy) / 6))
    const careerName = user?.perfilExtra?.carreira?.nome ?? "carreira selecionada"
    const projectionMessage = stats.solved > 0
        ? (
            <>
                Baseado na sua velocidade atual de <span className="font-medium text-foreground">{masteredPerWeek} questões dominadas/semana</span>{" "}
                e sua precisão média de <span className="font-medium text-foreground">{stats.accuracy}%</span>, você deve atingir o nível de aprovação
                para a <span className="font-medium text-primary">{careerName}</span> em aproximadamente{" "}
                <span className="font-medium text-foreground">{monthsToApproval} meses</span>.
            </>
        )
        : (
            <>
                Resolva questões para gerar uma projeção real de evolução para a <span className="font-medium text-primary">{careerName}</span>.
                Assim que houver histórico, o sistema calcula velocidade, precisão média e previsão de aprovação.
            </>
        )

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
                            {statusLabel}
                        </p>
                    </div>
                    <Button nativeButton={false} size="sm" render={<Link href="/estatisticas/taxa-acerto" />}>
                        Simular Nota de Corte
                    </Button>
                </div>
            </div>

            <MasteryProgressCards data={{ mastered, learning, new: newQuestions }} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComparativeEvolutionChart data={evolution} />
                <SkillsRadarChart data={skills} />
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
                            {projectionMessage}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        nativeButton={false}
                        size="sm"
                        className="shrink-0 gap-1.5"
                        render={<Link href="/estatisticas/desempenho" />}
                    >
                        Ver Roadmap Detalhado
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
