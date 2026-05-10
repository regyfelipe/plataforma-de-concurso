"use server"

import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

function str(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function nullable(value: string) {
  return value.length > 0 && value !== "none" ? value : null
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on"
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function requireAdmin() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { perfil: true },
  })

  if (user?.perfil !== "admin") {
    redirect("/dashboard")
  }
}

export async function createDisciplina(formData: FormData) {
  await requireAdmin()

  await prisma.disciplina.create({
    data: {
      nome: str(formData, "nome"),
      code: str(formData, "code").toUpperCase(),
      descricao: nullable(str(formData, "descricao")),
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/disciplinas")
}

export async function createCarreira(formData: FormData) {
  await requireAdmin()

  await prisma.carreira.create({
    data: {
      nome: str(formData, "nome"),
      descricao: nullable(str(formData, "descricao")),
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/carreiras")
}

export async function createDificuldade(formData: FormData) {
  await requireAdmin()
  const nome = str(formData, "nome")
  const slug = str(formData, "slug") || slugify(nome)

  await prisma.dificuldade.create({
    data: {
      nome,
      slug,
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/dificuldade")
}

export async function createNivelEducacional(formData: FormData) {
  await requireAdmin()

  await prisma.nivelEducacional.create({
    data: {
      nome: str(formData, "nome"),
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/educacional")
}

export async function createBanca(formData: FormData) {
  await requireAdmin()

  await prisma.banca.create({
    data: {
      nome: str(formData, "nome"),
      sigla: str(formData, "sigla").toUpperCase(),
      descricao: nullable(str(formData, "descricao")),
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/bancas")
}

export async function createTipoQuestao(formData: FormData) {
  await requireAdmin()
  const nome = str(formData, "nome")
  const slug = str(formData, "slug") || slugify(nome)

  await prisma.tipoQuestao.create({
    data: {
      nome,
      slug,
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/tipos-questao")
}

export async function createConcurso(formData: FormData) {
  await requireAdmin()
  const ano = str(formData, "ano")

  await prisma.concurso.create({
    data: {
      nome: str(formData, "nome"),
      bancaId: nullable(str(formData, "bancaId")),
      carreiraId: nullable(str(formData, "carreiraId")),
      nivelId: nullable(str(formData, "nivelId")),
      ano: ano ? Number(ano) : null,
      status: str(formData, "status") as "aberto" | "previsto" | "encerrado",
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/concursos")
}

export async function createAssunto(formData: FormData) {
  await requireAdmin()

  await prisma.assunto.create({
    data: {
      disciplinaId: str(formData, "disciplinaId"),
      nome: str(formData, "nome"),
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/assuntos")
}

export async function createTopico(formData: FormData) {
  await requireAdmin()

  await prisma.topico.create({
    data: {
      assuntoId: str(formData, "assuntoId"),
      nome: str(formData, "nome"),
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/assuntos")
}

export async function createSubtopico(formData: FormData) {
  await requireAdmin()

  await prisma.subtopico.create({
    data: {
      topicoId: str(formData, "topicoId"),
      nome: str(formData, "nome"),
      ativo: bool(formData, "ativo"),
    },
  })

  redirect("/admin/assuntos")
}

export async function deleteDisciplina(id: string) {
  await requireAdmin()
  await prisma.disciplina.delete({ where: { id } })
  redirect("/admin/disciplinas")
}

export async function deleteAssunto(id: string) {
  await requireAdmin()
  await prisma.assunto.delete({ where: { id } })
  redirect("/admin/assuntos")
}

export async function deleteTopico(id: string) {
  await requireAdmin()
  await prisma.topico.delete({ where: { id } })
  redirect("/admin/assuntos")
}

export async function deleteSubtopico(id: string) {
  await requireAdmin()
  await prisma.subtopico.delete({ where: { id } })
  redirect("/admin/assuntos")
}

export async function createTopicoInline(assuntoId: string, nome: string) {
  await requireAdmin()
  await prisma.topico.create({ data: { assuntoId, nome, ativo: true } })
  revalidatePath("/admin/assuntos")
}

export async function createSubtopicoInline(topicoId: string, nome: string) {
  await requireAdmin()
  await prisma.subtopico.create({ data: { topicoId, nome, ativo: true } })
  revalidatePath("/admin/assuntos")
  revalidatePath("/admin/disciplinas")
}

export async function createDisciplinaInline(nome: string, code: string) {
  await requireAdmin()
  await prisma.disciplina.create({
    data: {
      nome,
      code: code.toUpperCase(),
      ativo: true
    }
  })
  revalidatePath("/admin/disciplinas")
}

export async function createAssuntoInline(disciplinaId: string, nome: string) {
  await requireAdmin()
  await prisma.assunto.create({
    data: {
      disciplinaId,
      nome,
      ativo: true
    }
  })
  revalidatePath("/admin/disciplinas")
  revalidatePath("/admin/assuntos")
}

export async function createCarreiraInline(nome: string, descricao?: string) {
  await requireAdmin()
  await prisma.carreira.create({
    data: {
      nome,
      descricao: descricao || null,
      ativo: true
    }
  })
  revalidatePath("/admin/carreiras")
}

export async function deleteCarreira(id: string) {
  await requireAdmin()
  await prisma.carreira.delete({ where: { id } })
  revalidatePath("/admin/carreiras")
}

export async function createDificuldadeInline(nome: string, slug: string) {
  await requireAdmin()
  await prisma.dificuldade.create({
    data: {
      nome,
      slug: slug.toLowerCase(),
      ativo: true
    }
  })
  revalidatePath("/admin/dificuldade")
}

export async function deleteDificuldade(id: string) {
  await requireAdmin()
  await prisma.dificuldade.delete({ where: { id } })
  revalidatePath("/admin/dificuldade")
}

export async function createBancaInline(nome: string, sigla: string, descricao?: string) {
  await requireAdmin()
  await prisma.banca.create({
    data: {
      nome,
      sigla: sigla.toUpperCase(),
      descricao: descricao || null,
      ativo: true
    }
  })
  revalidatePath("/admin/bancas")
}

export async function deleteBanca(id: string) {
  await requireAdmin()
  await prisma.banca.delete({ where: { id } })
  revalidatePath("/admin/bancas")
}

export async function createConcursoInline(data: {
  nome: string
  sigla?: string
  cargo?: string
  bancaId?: string
  carreiraId?: string
  nivelId?: string
  ano?: number
  status: "aberto" | "previsto" | "encerrado"
}) {
  await requireAdmin()
  await prisma.concurso.create({
    data: {
      ...data,
      ativo: true
    }
  })
  revalidatePath("/admin/concursos")
}

export async function deleteConcurso(id: string) {
  await requireAdmin()
  await prisma.concurso.delete({ where: { id } })
  revalidatePath("/admin/concursos")
}

export async function createTipoQuestaoInline(nome: string, slug: string, modelo: string, quantidadeAlternativas: number) {
  await requireAdmin()
  await prisma.tipoQuestao.create({
    data: {
      nome,
      slug: slug.toLowerCase(),
      modelo,
      quantidadeAlternativas,
      ativo: true
    }
  })
  revalidatePath("/admin/tipos-questao")
}

export async function deleteTipoQuestao(id: string) {
  await requireAdmin()
  await prisma.tipoQuestao.delete({ where: { id } })
  revalidatePath("/admin/tipos-questao")
}

export async function createEducacionalInline(nome: string) {
  await requireAdmin()
  await prisma.nivelEducacional.create({
    data: {
      nome,
      ativo: true
    }
  })
  revalidatePath("/admin/educacional")
}

export async function deleteEducacional(id: string) {
  await requireAdmin()
  await prisma.nivelEducacional.delete({ where: { id } })
  revalidatePath("/admin/educacional")
}







