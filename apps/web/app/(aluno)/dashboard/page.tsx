import { DashboardClient } from "./dashboard-client"
import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function buildEvolution(
  respostas: Array<{
    isCorreta: boolean
    respondidoEm: Date
  }>,
  days: number,
) {
  const today = startOfDay(new Date())
  const start = addDays(today, -(days - 1))
  const buckets = new Map<string, { label: string; correct: number; wrong: number }>()

  for (let i = 0; i < days; i++) {
    const date = addDays(start, i)
    const key = date.toISOString().slice(0, 10)
    const label = days <= 30
      ? String(date.getDate()).padStart(2, "0")
      : date.toLocaleDateString("pt-BR", { month: "short", day: "2-digit" })

    buckets.set(key, { label, correct: 0, wrong: 0 })
  }

  for (const resposta of respostas) {
    const key = startOfDay(resposta.respondidoEm).toISOString().slice(0, 10)
    const bucket = buckets.get(key)

    if (!bucket) continue

    if (resposta.isCorreta) {
      bucket.correct += 1
    } else {
      bucket.wrong += 1
    }
  }

  return Array.from(buckets.values())
}

function getStudentName(nome: string) {
  return nome.trim().split(/\s+/)[0] || "aluno"
}

export default async function DashboardPage() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const since90 = addDays(startOfDay(new Date()), -89)
  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)

  const [usuario, respostas, respostas90, ranking, estatisticaGeral] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id: session.user.id },
      select: {
        nome: true,
      },
    }),
    prisma.respostaUsuario.findMany({
      where: { usuarioId: session.user.id },
      include: {
        questao: {
          include: {
            disciplina: true,
            topico: true,
          },
        },
      },
      orderBy: { respondidoEm: "desc" },
    }),
    prisma.respostaUsuario.findMany({
      where: {
        usuarioId: session.user.id,
        respondidoEm: {
          gte: since90,
        },
      },
      select: {
        isCorreta: true,
        respondidoEm: true,
      },
      orderBy: { respondidoEm: "asc" },
    }),
    prisma.ranking.findFirst({
      where: { usuarioId: session.user.id },
      include: {
        carreira: true,
      },
      orderBy: [
        { posicao: "asc" },
        { pontuacao: "desc" },
      ],
    }),
    prisma.estatisticaUsuario.findFirst({
      where: {
        usuarioId: session.user.id,
        disciplinaId: null,
      },
      orderBy: { atualizadoEm: "desc" },
    }),
  ])

  if (!usuario) {
    redirect("/login")
  }

  const totalQuestoes = respostas.length
  const totalCorretas = respostas.filter((resposta) => resposta.isCorreta).length
  const totalErradas = totalQuestoes - totalCorretas
  const taxaAcerto = totalQuestoes > 0 ? (totalCorretas / totalQuestoes) * 100 : 0
  const questoesHoje = respostas.filter((resposta) => resposta.respondidoEm >= today && resposta.respondidoEm < tomorrow).length
  const disciplinas = new Map<string, { label: string; solved: number }>()
  const topicos = new Set<string>()

  for (const resposta of respostas) {
    const disciplina = resposta.questao.disciplina

    if (disciplina) {
      const current = disciplinas.get(disciplina.id) || { label: disciplina.nome, solved: 0 }
      current.solved += 1
      disciplinas.set(disciplina.id, current)
    }

    if (resposta.questao.topicoId) {
      topicos.add(resposta.questao.topicoId)
    }
  }

  const disciplineData = Array.from(disciplinas.entries())
    .map(([id, item], index) => ({
      discipline: id,
      label: item.label,
      solved: item.solved,
      fill: CHART_COLORS[index % CHART_COLORS.length] ?? "#64748b",
    }))
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 5)

  return (
    <DashboardClient
      data={{
        aluno: {
          nome: getStudentName(usuario.nome),
        },
        resumo: {
          questoesHoje,
          sequenciaAtual: estatisticaGeral?.sequenciaAtual || 0,
          totalQuestoes,
          totalCorretas,
          totalErradas,
          taxaAcerto,
          disciplinasEstudadas: disciplinas.size,
          topicosEstudados: topicos.size,
          melhorRanking: ranking
            ? {
                posicao: ranking.posicao,
                descricao: ranking.carreira?.nome || ranking.periodo,
              }
            : null,
        },
        evolucao: {
          "7 dias": buildEvolution(respostas90, 7),
          "30 dias": buildEvolution(respostas90, 30),
          "90 dias": buildEvolution(respostas90, 90),
        },
        disciplinas: disciplineData,
      }}
    />
  )
}
