import { prisma } from "@workspace/database"
import type { StatusQuestao } from "@workspace/database"

function htmlToText(value?: string | null) {
  if (!value) return null

  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim()
}

export async function getAdminQuestionsListData(status?: StatusQuestao) {
  const where = status ? { status } : {}

  const [questoes, total] = await Promise.all([
    prisma.questao.findMany({
      where,
      orderBy: { criadoEm: "desc" },
      take: 10,
      include: {
        disciplina: { select: { nome: true } },
        assunto: { select: { nome: true } },
        topico: { select: { nome: true } },
        banca: { select: { sigla: true, nome: true } },
        concurso: { select: { nome: true } },
        carreira: { select: { nome: true } },
        nivel: { select: { nome: true } },
        dificuldade: { select: { slug: true, nome: true } },
        alternativas: { orderBy: { letra: "asc" } },
        objetivos: { select: { descricao: true } },
        referencias: { select: { texto: true } },
        videos: { select: { titulo: true, url: true } },
        autor: { select: { id: true, nome: true } },
      },
    }),
    prisma.questao.count({ where }),
  ])

  const questions = questoes.map((questao) => ({
    id: questao.id,
    code: questao.code,
    discipline: questao.disciplina?.nome ?? "Sem disciplina",
    subject: questao.assunto?.nome ?? null,
    topic: questao.topico?.nome ?? null,
    board: questao.banca?.sigla ?? questao.banca?.nome ?? null,
    institution: questao.instituicao ?? questao.concurso?.nome ?? null,
    career: questao.carreira?.nome ?? null,
    educationLevel: questao.nivel?.nome ?? null,
    year: questao.ano ?? undefined,
    questionText: htmlToText(questao.enunciado) ?? "Questão sem enunciado",
    supportText: htmlToText(questao.textoApoio),
    difficulty: questao.dificuldade?.slug ?? "medio",
    isUnique: questao.isInedita,
    access: questao.acesso,
    visibility: questao.visibilidade,
    status: questao.status,
    resolution: htmlToText(questao.resolucao),
    alternatives: questao.alternativas.map((alternativa) => ({
      id: alternativa.id,
      letter: alternativa.letra,
      text: htmlToText(alternativa.texto) ?? "",
      isCorrect: alternativa.isCorreta,
      percentage: alternativa.percentual ? Number(alternativa.percentual) : undefined,
      explanation: htmlToText(alternativa.explicacao) ?? undefined,
      reference: alternativa.referencia ?? undefined,
      tip: alternativa.dica ?? undefined,
    })),
    objectives: questao.objetivos.map((objetivo) => objetivo.descricao),
    references: questao.referencias.map((referencia) => referencia.texto),
    videos: questao.videos.map((video) => ({
      title: video.titulo,
      url: video.url,
    })),
    stats: {
      totalAnswers: questao.totalRespostas,
      correctRate: Number(questao.taxaAcerto),
      averageTimeSeconds: questao.tempoMedioSeg,
    },
    commentsCount: questao.totalComentarios,
    reportsCount: questao.totalDenuncias,
    createdAt: questao.criadoEm.toISOString(),
    updatedAt: questao.atualizadoEm.toISOString(),
    author: {
      id: questao.autor?.id ?? "admin",
      name: questao.autor?.nome ?? "Administrador",
    },
  }))

  return {
    questions,
    totalPages: Math.max(1, Math.ceil(total / 10)),
  }
}
