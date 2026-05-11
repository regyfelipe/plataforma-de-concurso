"use server"

import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const optionalUuid = z.string().uuid().optional().or(z.literal(""))

const createAdminNotebookSchema = z.object({
  nome: z.string().trim().min(3, "Informe um título com pelo menos 3 caracteres.").max(200),
  descricao: z.string().trim().optional(),
  concursoId: optionalUuid,
  disciplinaId: optionalUuid,
  visibilidade: z.enum(["privado", "publico"]),
  capaUrl: z.string().trim().url("URL da capa inválida.").optional().or(z.literal("")),
  questionIds: z.array(z.string().uuid()).default([]),
})

const updateAdminNotebookSchema = createAdminNotebookSchema.omit({ capaUrl: true })

export type CreateAdminNotebookPayload = z.infer<typeof createAdminNotebookSchema>
export type UpdateAdminNotebookPayload = z.infer<typeof updateAdminNotebookSchema>

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

function nullable(value?: string | null) {
  return value && value.trim().length > 0 ? value.trim() : null
}

function nullableId(value?: string | null) {
  return value && value.trim().length > 0 ? value.trim() : null
}

export async function createAdminNotebook(payload: CreateAdminNotebookPayload) {
  const usuarioId = await requireAdmin()
  const data = createAdminNotebookSchema.parse(payload)

  const caderno = await prisma.caderno.create({
    data: {
      usuarioId,
      concursoId: nullableId(data.concursoId),
      disciplinaId: nullableId(data.disciplinaId),
      nome: data.nome,
      descricao: nullable(data.descricao),
      visibilidade: data.visibilidade,
      capaUrl: nullable(data.capaUrl),
      questoes: {
        create: data.questionIds.map((questaoId, index) => ({
          questaoId,
          ordem: index + 1,
        })),
      },
    },
    select: { id: true },
  })

  revalidatePath("/admin/cadernos")
  revalidatePath("/admin/cadernos/criar")

  return caderno
}

export async function updateAdminNotebook(id: string, payload: UpdateAdminNotebookPayload) {
  await requireAdmin()

  const notebookId = z.string().uuid().parse(id)
  const data = updateAdminNotebookSchema.parse(payload)
  const questionIds = Array.from(new Set(data.questionIds))

  const caderno = await prisma.$transaction(async (tx) => {
    const updated = await tx.caderno.update({
      where: { id: notebookId },
      data: {
        concursoId: nullableId(data.concursoId),
        disciplinaId: nullableId(data.disciplinaId),
        nome: data.nome,
        descricao: nullable(data.descricao),
        visibilidade: data.visibilidade,
      },
      select: { id: true },
    })

    await tx.cadernoQuestao.deleteMany({
      where: { cadernoId: notebookId },
    })

    if (questionIds.length > 0) {
      await tx.cadernoQuestao.createMany({
        data: questionIds.map((questaoId, index) => ({
          cadernoId: notebookId,
          questaoId,
          ordem: index + 1,
        })),
      })
    }

    return updated
  })

  revalidatePath("/admin/cadernos")
  revalidatePath(`/admin/cadernos/editar/${notebookId}`)

  return caderno
}

export async function deleteAdminNotebook(id: string) {
  await requireAdmin()

  const notebookId = z.string().uuid().parse(id)

  await prisma.caderno.delete({
    where: { id: notebookId },
  })

  revalidatePath("/admin/cadernos")
}
