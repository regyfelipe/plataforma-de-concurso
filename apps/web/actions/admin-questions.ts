"use server"

import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const optionalUuid = z.string().uuid().optional().nullable()

const alternativeSchema = z.object({
  letter: z.string().min(1).max(1),
  text: z.string().trim().min(1, "Preencha o texto de todas as alternativas."),
  isCorrect: z.boolean(),
  explanation: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  tip: z.string().trim().optional(),
})

const createQuestionSchema = z
  .object({
    disciplinaId: optionalUuid,
    assuntoId: optionalUuid,
    topicoId: optionalUuid,
    subtopicoId: optionalUuid,
    bancaId: optionalUuid,
    concursoId: optionalUuid,
    carreiraId: optionalUuid,
    nivelId: optionalUuid,
    dificuldadeId: optionalUuid,
    tipoId: optionalUuid,
    instituicao: z.string().trim().optional(),
    cargo: z.string().trim().optional(),
    ano: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
    isInedita: z.boolean(),
    enunciado: z.string().trim().min(1, "Preencha o enunciado da questão."),
    textoApoio: z.string().trim().optional(),
    resolucao: z.string().trim().optional(),
    videoUrl: z.string().trim().url("Informe uma URL válida para a videoaula.").optional().or(z.literal("")),
    objetivo: z.string().trim().optional(),
    referencia: z.string().trim().optional(),
    dica: z.string().trim().optional(),
    visibilidade: z.enum(["publica", "privada", "restrita"]),
    status: z.enum(["draft", "published"]),
    alternativas: z.array(alternativeSchema).min(2).max(5),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.alternativas.filter((alt) => alt.isCorrect).length

    if (correctCount !== 1) {
      ctx.addIssue({
        code: "custom",
        message: "Selecione exatamente uma alternativa correta.",
        path: ["alternativas"],
      })
    }
  })

export type CreateQuestionPayload = z.infer<typeof createQuestionSchema>

async function requireAdmin() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { id: true, perfil: true },
  })

  if (user?.perfil !== "admin") {
    redirect("/dashboard")
  }

  return user.id
}

async function generateQuestionCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
    const code = `Q${Date.now().toString().slice(-9)}${suffix}`.slice(0, 20)
    const exists = await prisma.questao.findUnique({
      where: { code },
      select: { id: true },
    })

    if (!exists) return code
  }

  throw new Error("Não foi possível gerar um código único para a questão.")
}

function nullable(value?: string | null) {
  return value && value.trim().length > 0 ? value.trim() : null
}

export async function createAdminQuestion(payload: CreateQuestionPayload) {
  const autorId = await requireAdmin()
  const data = createQuestionSchema.parse(payload)
  const code = await generateQuestionCode()

  const questao = await prisma.questao.create({
    data: {
      code,
      disciplinaId: data.disciplinaId ?? null,
      assuntoId: data.assuntoId ?? null,
      topicoId: data.topicoId ?? null,
      subtopicoId: data.subtopicoId ?? null,
      bancaId: data.bancaId ?? null,
      concursoId: data.concursoId ?? null,
      carreiraId: data.carreiraId ?? null,
      nivelId: data.nivelId ?? null,
      dificuldadeId: data.dificuldadeId ?? null,
      tipoId: data.tipoId ?? null,
      instituicao: nullable(data.instituicao),
      cargo: nullable(data.cargo),
      ano: data.ano ?? null,
      isInedita: data.isInedita,
      enunciado: data.enunciado,
      textoApoio: nullable(data.textoApoio),
      resolucao: nullable(data.resolucao),
      hasVideo: Boolean(data.videoUrl),
      visibilidade: data.visibilidade,
      status: data.status,
      autorId,
      alternativas: {
        create: data.alternativas.map((alt) => ({
          letra: alt.letter,
          texto: alt.text,
          isCorreta: alt.isCorrect,
          explicacao: nullable(alt.explanation),
          referencia: nullable(alt.reference),
          dica: nullable(alt.tip ?? data.dica),
        })),
      },
      objetivos: data.objetivo
        ? {
            create: [{ descricao: data.objetivo }],
          }
        : undefined,
      referencias: data.referencia
        ? {
            create: [{ texto: data.referencia }],
          }
        : undefined,
      videos: data.videoUrl
        ? {
            create: [{ titulo: "Videoaula", url: data.videoUrl }],
          }
        : undefined,
    },
  })

  revalidatePath("/admin/questoes")
  revalidatePath("/admin/questoes/criar")

  return questao
}

export async function updateAdminQuestion(id: string, payload: CreateQuestionPayload) {
  await requireAdmin()
  const data = createQuestionSchema.parse(payload)

  const questao = await prisma.questao.update({
    where: { id },
    data: {
      disciplinaId: data.disciplinaId ?? null,
      assuntoId: data.assuntoId ?? null,
      topicoId: data.topicoId ?? null,
      subtopicoId: data.subtopicoId ?? null,
      bancaId: data.bancaId ?? null,
      concursoId: data.concursoId ?? null,
      carreiraId: data.carreiraId ?? null,
      nivelId: data.nivelId ?? null,
      dificuldadeId: data.dificuldadeId ?? null,
      tipoId: data.tipoId ?? null,
      instituicao: nullable(data.instituicao),
      cargo: nullable(data.cargo),
      ano: data.ano ?? null,
      isInedita: data.isInedita,
      enunciado: data.enunciado,
      textoApoio: nullable(data.textoApoio),
      resolucao: nullable(data.resolucao),
      hasVideo: Boolean(data.videoUrl),
      visibilidade: data.visibilidade,
      status: data.status,
      // Sincronizar alternativas (Remover e Recriar é mais simples para este caso)
      alternativas: {
        deleteMany: {},
        create: data.alternativas.map((alt) => ({
          letra: alt.letter,
          texto: alt.text,
          isCorreta: alt.isCorrect,
          explicacao: nullable(alt.explanation),
          referencia: nullable(alt.reference),
          dica: nullable(alt.tip ?? data.dica),
        })),
      },
      objetivos: {
        deleteMany: {},
        create: data.objetivo ? [{ descricao: data.objetivo }] : [],
      },
      referencias: {
        deleteMany: {},
        create: data.referencia ? [{ texto: data.referencia }] : [],
      },
      videos: {
        deleteMany: {},
        create: data.videoUrl ? [{ titulo: "Videoaula", url: data.videoUrl }] : [],
      },
    },
    select: {
      id: true,
      code: true,
      status: true,
    },
  })

  revalidatePath("/admin/questoes")
  revalidatePath(`/admin/questoes/editar/${id}`)
  revalidatePath("/admin/questoes/criar")

  return questao
}

export async function deleteAdminQuestion(id: string) {
  await requireAdmin()
  
  await prisma.questao.delete({
    where: { id }
  })

  revalidatePath("/admin/questoes")
}

export async function updateAdminQuestionStatus(id: string, status: "draft" | "published" | "archived" | "reported") {
  await requireAdmin()

  await prisma.questao.update({
    where: { id },
    data: {
      status,
      revisadoEm: status === "published" || status === "archived" ? new Date() : undefined,
    },
  })

  revalidatePath("/admin/questoes")
  revalidatePath("/admin/questoes/revisao")
  revalidatePath("/admin/questoes/publicadas")
  revalidatePath("/admin/questoes/rejeitadas")
}
