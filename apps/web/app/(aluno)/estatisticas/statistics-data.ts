import { prisma } from "@workspace/database"

type AnswerRow = {
  isCorreta: boolean
  tempoSeg: number | null
  respondidoEm: Date
  questao: {
    disciplina: { nome: string } | null
    assunto: { nome: string } | null
    topico: { nome: string } | null
    banca: { sigla: string; nome: string } | null
    dificuldade: { nome: string; slug: string } | null
    carreira: { nome: string } | null
  }
}

type Bucket = {
  solved: number
  correct: number
  timeSeconds: number
}

export function startOfDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

export function percentage(correct: number, solved: number) {
  return solved > 0 ? Math.round((correct / solved) * 100) : 0
}

export function formatStudyTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  return `${minutes}m`
}

export function bucketAdd(map: Map<string, Bucket>, key: string, isCorrect: boolean, timeSeconds: number) {
  const current = map.get(key) ?? { solved: 0, correct: 0, timeSeconds: 0 }
  current.solved += 1
  current.correct += isCorrect ? 1 : 0
  current.timeSeconds += timeSeconds
  map.set(key, current)
}

export function accuracyFromBucket(item: Bucket) {
  return percentage(item.correct, item.solved)
}

export async function getUserStatisticAnswers(userId: string, days = 60) {
  const today = startOfDay()
  const from = addDays(today, -(days - 1))

  const answers = await prisma.respostaUsuario.findMany({
    where: {
      usuarioId: userId,
      respondidoEm: { gte: from },
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
          banca: { select: { sigla: true, nome: true } },
          dificuldade: { select: { nome: true, slug: true } },
          carreira: { select: { nome: true } },
        },
      },
    },
  })

  return { answers: answers satisfies AnswerRow[], today, from }
}

export function splitCurrentPrevious(answers: AnswerRow[], today = startOfDay()) {
  const currentFrom = addDays(today, -29)
  const previousFrom = addDays(currentFrom, -30)

  return {
    currentFrom,
    previousFrom,
    currentAnswers: answers.filter((answer) => answer.respondidoEm >= currentFrom),
    previousAnswers: answers.filter((answer) => answer.respondidoEm >= previousFrom && answer.respondidoEm < currentFrom),
  }
}

export function getGlobalStats(answers: AnswerRow[]) {
  const solved = answers.length
  const correct = answers.filter((answer) => answer.isCorreta).length
  const timeSeconds = answers.reduce((sum, answer) => sum + (answer.tempoSeg ?? 0), 0)
  const activeDays = new Set(answers.map((answer) => answer.respondidoEm.toISOString().slice(0, 10))).size

  return {
    solved,
    correct,
    accuracy: percentage(correct, solved),
    timeSeconds,
    activeDays,
    averageTime: solved > 0 ? Math.round(timeSeconds / solved) : 0,
  }
}

export function buildEvolution(answers: AnswerRow[], from: Date, today = startOfDay()) {
  return Array.from({ length: 6 }, (_, index) => {
    const start = addDays(from, index * 5)
    const end = index === 5 ? addDays(today, 1) : addDays(from, index * 5 + 5)
    const bucket = answers.filter((answer) => answer.respondidoEm >= start && answer.respondidoEm < end)
    const value = percentage(bucket.filter((answer) => answer.isCorreta).length, bucket.length)

    return {
      week: `Sem. ${index + 1}`,
      value,
      goal: 85,
      avg: 70,
    }
  })
}

export function buildBucketMap(answers: AnswerRow[], getKey: (answer: AnswerRow) => string) {
  const map = new Map<string, Bucket>()

  for (const answer of answers) {
    bucketAdd(map, getKey(answer), answer.isCorreta, answer.tempoSeg ?? 0)
  }

  return map
}

export function rankedBuckets(map: Map<string, Bucket>) {
  return Array.from(map.entries())
    .map(([name, item]) => ({ name, ...item, accuracy: accuracyFromBucket(item) }))
    .sort((a, b) => b.accuracy - a.accuracy || b.solved - a.solved)
}
