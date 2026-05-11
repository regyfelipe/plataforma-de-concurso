"use server"

import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const answerSchema = z.object({
  questionId: z.string().uuid(),
  alternativeId: z.string().uuid(),
  timeSeconds: z.number().int().min(0).max(60 * 60 * 4).optional(),
})

const favoriteSchema = z.object({
  questionId: z.string().uuid(),
})

const reportSchema = z.object({
  questionId: z.string().uuid(),
  description: z.string().trim().min(5).max(2000),
})

async function getCurrentUserId() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    throw new Error("Você precisa estar logado.")
  }

  return session.user.id
}

function startOfDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function weekStart(date = new Date()) {
  const day = startOfDay(date)
  const weekday = day.getUTCDay()
  const diff = weekday === 0 ? -6 : 1 - weekday
  return addDays(day, diff)
}

async function refreshQuestionStats(questionId: string) {
  const [total, correct, average] = await Promise.all([
    prisma.respostaUsuario.count({ where: { questaoId: questionId } }),
    prisma.respostaUsuario.count({ where: { questaoId: questionId, isCorreta: true } }),
    prisma.respostaUsuario.aggregate({
      where: { questaoId: questionId, tempoSeg: { not: null } },
      _avg: { tempoSeg: true },
    }),
  ])

  await prisma.questao.update({
    where: { id: questionId },
    data: {
      totalRespostas: total,
      taxaAcerto: total > 0 ? Number(((correct / total) * 100).toFixed(2)) : 0,
      tempoMedioSeg: Math.round(average._avg.tempoSeg ?? 0),
    },
  })
}

async function refreshAlternativeStats(questionId: string) {
  const [total, grouped] = await Promise.all([
    prisma.respostaUsuario.count({ where: { questaoId: questionId } }),
    prisma.respostaUsuario.groupBy({
      by: ["alternativaId"],
      where: { questaoId: questionId, alternativaId: { not: null } },
      _count: { alternativaId: true },
    }),
  ])

  const percentages = new Map(
    grouped.map((item) => [
      item.alternativaId,
      total > 0 ? Number(((item._count.alternativaId / total) * 100).toFixed(2)) : 0,
    ])
  )

  const alternatives = await prisma.alternativa.findMany({
    where: { questaoId: questionId },
    select: { id: true },
  })

  await Promise.all(
    alternatives.map((alternative) =>
      prisma.alternativa.update({
        where: { id: alternative.id },
        data: { percentual: percentages.get(alternative.id) ?? 0 },
      })
    )
  )
}

async function updateUserStats(params: {
  userId: string
  disciplineId: string | null
  wasCorrect?: boolean
  isCorrect: boolean
  timeSeconds?: number
}) {
  if (!params.disciplineId) return

  const date = startOfDay()
  const existing = await prisma.estatisticaUsuario.findFirst({
    where: {
      usuarioId: params.userId,
      disciplinaId: params.disciplineId,
      referenciaInicio: date,
    },
    select: {
      id: true,
      totalQuestoes: true,
      totalCorretas: true,
      totalErradas: true,
      tempoTotalSeg: true,
    },
  })

  const isNewAnswer = params.wasCorrect === undefined
  const correctDelta =
    params.wasCorrect === undefined
      ? params.isCorrect ? 1 : 0
      : Number(params.isCorrect) - Number(params.wasCorrect)
  const wrongDelta =
    params.wasCorrect === undefined
      ? params.isCorrect ? 0 : 1
      : Number(!params.isCorrect) - Number(!params.wasCorrect)
  const timeDelta = params.timeSeconds ?? 0

  if (!existing) {
    const totalQuestoes = isNewAnswer ? 1 : 0
    const totalCorretas = Math.max(correctDelta, 0)
    const totalErradas = Math.max(wrongDelta, 0)

    await prisma.estatisticaUsuario.create({
      data: {
        usuarioId: params.userId,
        disciplinaId: params.disciplineId,
        referenciaInicio: date,
        totalQuestoes,
        totalCorretas,
        totalErradas,
        taxaAcerto: totalQuestoes > 0 ? Number(((totalCorretas / totalQuestoes) * 100).toFixed(2)) : 0,
        tempoTotalSeg: timeDelta,
        tempoMedioSeg: totalQuestoes > 0 ? Math.round(timeDelta / totalQuestoes) : 0,
        sequenciaAtual: params.isCorrect ? 1 : 0,
        maiorSequencia: params.isCorrect ? 1 : 0,
      },
    })
    return
  }

  const totalQuestoes = existing.totalQuestoes + (isNewAnswer ? 1 : 0)
  const totalCorretas = Math.max(existing.totalCorretas + correctDelta, 0)
  const totalErradas = Math.max(existing.totalErradas + wrongDelta, 0)
  const tempoTotalSeg = existing.tempoTotalSeg + timeDelta
  const sequenciaAtual = params.isCorrect ? { increment: 1 } : 0

  await prisma.estatisticaUsuario.update({
    where: { id: existing.id },
    data: {
      totalQuestoes,
      totalCorretas,
      totalErradas,
      taxaAcerto: totalQuestoes > 0 ? Number(((totalCorretas / totalQuestoes) * 100).toFixed(2)) : 0,
      tempoTotalSeg,
      tempoMedioSeg: totalQuestoes > 0 ? Math.round(tempoTotalSeg / totalQuestoes) : 0,
      sequenciaAtual,
      maiorSequencia: params.isCorrect ? { increment: 1 } : undefined,
    },
  })
}

async function updateRanking(params: {
  userId: string
  careerId: string | null
  wasCorrect?: boolean
  isCorrect: boolean
}) {
  const reference = weekStart()
  const previousScore = params.wasCorrect === undefined ? 0 : params.wasCorrect ? 10 : 1
  const nextScore = params.isCorrect ? 10 : 1
  const scoreDelta = nextScore - previousScore
  const totalDelta = params.wasCorrect === undefined ? 1 : 0

  const existing = await prisma.ranking.findFirst({
    where: {
      usuarioId: params.userId,
      carreiraId: params.careerId,
      periodo: "semanal",
      referenciaEm: reference,
    },
    select: { id: true, totalQuestoes: true, pontuacao: true },
  })

  if (!existing) {
    await prisma.ranking.create({
      data: {
        usuarioId: params.userId,
        carreiraId: params.careerId,
        periodo: "semanal",
        referenciaEm: reference,
        pontuacao: Math.max(scoreDelta, 0),
        totalQuestoes: totalDelta,
        taxaAcerto: params.isCorrect ? 100 : 0,
      },
    })
    return
  }

  const totalQuestoes = existing.totalQuestoes + totalDelta
  const pontuacao = Math.max(existing.pontuacao + scoreDelta, 0)

  await prisma.ranking.update({
    where: { id: existing.id },
    data: {
      pontuacao,
      totalQuestoes,
      taxaAcerto: totalQuestoes > 0 ? Number(((pontuacao / (totalQuestoes * 10)) * 100).toFixed(2)) : 0,
    },
  })
}

async function updateReview(params: {
  userId: string
  questionId: string
  wasCorrect?: boolean
  isCorrect: boolean
}) {
  const existing = await prisma.revisao.findUnique({
    where: {
      usuarioId_questaoId: {
        usuarioId: params.userId,
        questaoId: params.questionId,
      },
    },
    select: { intervaloDias: true, repeticoes: true },
  })

  if (!params.isCorrect) {
    await prisma.revisao.upsert({
      where: {
        usuarioId_questaoId: {
          usuarioId: params.userId,
          questaoId: params.questionId,
        },
      },
      create: {
        usuarioId: params.userId,
        questaoId: params.questionId,
        status: "pendente",
        intervaloDias: 1,
        repeticoes: 0,
        proximaRevisao: addDays(startOfDay(), 1),
      },
      update: {
        status: "pendente",
        intervaloDias: 1,
        proximaRevisao: addDays(startOfDay(), 1),
      },
    })
    return
  }

  if (existing) {
    const nextInterval = Math.min(Math.max(existing.intervaloDias * 2, 2), 30)
    await prisma.revisao.update({
      where: {
        usuarioId_questaoId: {
          usuarioId: params.userId,
          questaoId: params.questionId,
        },
      },
      data: {
        status: "revisada",
        intervaloDias: nextInterval,
        repeticoes: { increment: 1 },
        ultimaRevisao: new Date(),
        proximaRevisao: addDays(startOfDay(), nextInterval),
      },
    })
  }
}

export async function submitQuestionAnswer(input: z.infer<typeof answerSchema>) {
  const userId = await getCurrentUserId()
  const data = answerSchema.parse(input)

  const alternative = await prisma.alternativa.findUnique({
    where: { id: data.alternativeId },
    select: {
      id: true,
      questaoId: true,
      isCorreta: true,
      questao: {
        select: {
          id: true,
          disciplinaId: true,
          carreiraId: true,
        },
      },
    },
  })

  if (!alternative || alternative.questaoId !== data.questionId) {
    throw new Error("Alternativa inválida para esta questão.")
  }

  const previous = await prisma.respostaUsuario.findUnique({
    where: {
      usuarioId_questaoId: {
        usuarioId: userId,
        questaoId: data.questionId,
      },
    },
    select: { isCorreta: true },
  })

  await prisma.respostaUsuario.upsert({
    where: {
      usuarioId_questaoId: {
        usuarioId: userId,
        questaoId: data.questionId,
      },
    },
    create: {
      usuarioId: userId,
      questaoId: data.questionId,
      alternativaId: data.alternativeId,
      isCorreta: alternative.isCorreta,
      tempoSeg: data.timeSeconds,
    },
    update: {
      alternativaId: data.alternativeId,
      isCorreta: alternative.isCorreta,
      tempoSeg: data.timeSeconds,
      respondidoEm: new Date(),
    },
  })

  await Promise.all([
    refreshQuestionStats(data.questionId),
    refreshAlternativeStats(data.questionId),
    updateUserStats({
      userId,
      disciplineId: alternative.questao.disciplinaId,
      wasCorrect: previous?.isCorreta,
      isCorrect: alternative.isCorreta,
      timeSeconds: data.timeSeconds,
    }),
    updateRanking({
      userId,
      careerId: alternative.questao.carreiraId,
      wasCorrect: previous?.isCorreta,
      isCorrect: alternative.isCorreta,
    }),
    updateReview({
      userId,
      questionId: data.questionId,
      wasCorrect: previous?.isCorreta,
      isCorrect: alternative.isCorreta,
    }),
  ])

  revalidatePath("/dashboard")
  revalidatePath("/questoes/historico")
  revalidatePath("/questoes/erradas")
  revalidatePath("/caderno/revisoes")
  revalidatePath("/estatisticas")

  return {
    isCorrect: alternative.isCorreta,
  }
}

export async function toggleQuestionFavorite(input: z.infer<typeof favoriteSchema>) {
  const userId = await getCurrentUserId()
  const data = favoriteSchema.parse(input)

  const existing = await prisma.favorito.findUnique({
    where: {
      usuarioId_questaoId: {
        usuarioId: userId,
        questaoId: data.questionId,
      },
    },
  })

  if (existing) {
    await prisma.favorito.delete({
      where: {
        usuarioId_questaoId: {
          usuarioId: userId,
          questaoId: data.questionId,
        },
      },
    })
    revalidatePath("/questoes/favoritas")
    return { favorited: false }
  }

  await prisma.favorito.create({
    data: {
      usuarioId: userId,
      questaoId: data.questionId,
    },
  })

  revalidatePath("/questoes/favoritas")
  return { favorited: true }
}

export async function reportQuestion(input: z.infer<typeof reportSchema>) {
  const userId = await getCurrentUserId()
  const data = reportSchema.parse(input)

  await prisma.denuncia.upsert({
    where: {
      questaoId_usuarioId: {
        questaoId: data.questionId,
        usuarioId: userId,
      },
    },
    create: {
      questaoId: data.questionId,
      usuarioId: userId,
      motivo: "outro",
      descricao: data.description,
    },
    update: {
      status: "pendente",
      motivo: "outro",
      descricao: data.description,
    },
  })

  await prisma.questao.update({
    where: { id: data.questionId },
    data: {
      totalDenuncias: await prisma.denuncia.count({ where: { questaoId: data.questionId } }),
    },
  })

  revalidatePath("/admin/reports")
  return { success: true }
}
