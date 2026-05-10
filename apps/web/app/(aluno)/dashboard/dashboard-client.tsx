"use client"

import { useMemo, useState } from "react"
import {
  Flame,
  Target,
  TrendingUp,
  BarChart3,
  BookOpen,
  LayoutGrid,
  Trophy,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { DisciplineMasteryChart } from "@/components/dashboard/discipline-mastery-chart"
import { PerformanceEvolutionChart } from "@/components/dashboard/performance-evolution-chart"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

type DashboardData = {
  aluno: {
    nome: string
  }
  resumo: {
    questoesHoje: number
    sequenciaAtual: number
    totalQuestoes: number
    totalCorretas: number
    totalErradas: number
    taxaAcerto: number
    disciplinasEstudadas: number
    topicosEstudados: number
    melhorRanking: {
      posicao: number | null
      descricao: string
    } | null
  }
  evolucao: {
    "7 dias": Array<{ label: string; correct: number; wrong: number }>
    "30 dias": Array<{ label: string; correct: number; wrong: number }>
    "90 dias": Array<{ label: string; correct: number; wrong: number }>
  }
  disciplinas: Array<{
    discipline: string
    label: string
    solved: number
    fill: string
  }>
}

function greeting() {
  const hour = new Date().getHours()

  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [timeframe, setTimeframe] = useState<"7 dias" | "30 dias" | "90 dias">("7 dias")
  const accuracy = `${data.resumo.taxaAcerto.toFixed(1)}%`
  const bestRanking = data.resumo.melhorRanking?.posicao
    ? `#${data.resumo.melhorRanking.posicao}`
    : "-"

  const performanceData = useMemo(() => data.evolucao[timeframe], [data.evolucao, timeframe])

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{greeting()}, {data.aluno.nome}!</h1>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            {data.resumo.totalQuestoes > 0
              ? "Continue acompanhando sua evolução."
              : "Comece respondendo questões para montar seu histórico."}
          </p>
        </div>

        <Card>
          <CardContent className="flex items-center gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-semibold leading-none">{data.resumo.questoesHoje}</p>
                <p className="text-xs text-muted-foreground">Questões hoje</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-semibold leading-none">{data.resumo.sequenciaAtual}d</p>
                <p className="text-xs text-muted-foreground">Sequência</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold leading-none">{accuracy}</p>
                <p className="text-xs text-muted-foreground">Precisão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total de Questões"
          value={String(data.resumo.totalQuestoes)}
          subtitle={`${data.resumo.totalCorretas} acertos`}
          icon={BarChart3}
        />
        <StatCard title="Taxa de Acerto" value={accuracy} icon={Target} />
        <StatCard title="Disciplinas Estudadas" value={String(data.resumo.disciplinasEstudadas)} icon={BookOpen} />
        <StatCard title="Tópicos Estudados" value={String(data.resumo.topicosEstudados)} icon={LayoutGrid} />
        <StatCard
          title="Melhor Ranking"
          value={bestRanking}
          subtitle={data.resumo.melhorRanking?.descricao}
          icon={Trophy}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-8">
          <PerformanceEvolutionChart
            timeframe={timeframe}
            setTimeframe={(value) => setTimeframe(value as "7 dias" | "30 dias" | "90 dias")}
            data={performanceData}
          />
        </div>
        <div className="flex flex-col lg:col-span-4">
          <DisciplineMasteryChart data={data.disciplinas} totalSolved={data.resumo.totalQuestoes} />
        </div>
      </div>
    </div>
  )
}
