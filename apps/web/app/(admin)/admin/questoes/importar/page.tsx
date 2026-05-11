import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ImportQuestionsForm } from "./import-questions-form"

export default async function ImportarQuestoesPage() {
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

  const [
    disciplinas,
    assuntos,
    topicos,
    subtopicos,
    bancas,
    concursos,
    carreiras,
    niveis,
    dificuldades,
    tiposQuestao,
  ] = await Promise.all([
    prisma.disciplina.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, code: true },
    }),
    prisma.assunto.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, disciplinaId: true },
    }),
    prisma.topico.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, assuntoId: true },
    }),
    prisma.subtopico.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, topicoId: true },
    }),
    prisma.banca.findMany({
      where: { ativo: true },
      orderBy: { sigla: "asc" },
      select: { id: true, nome: true, sigla: true },
    }),
    prisma.concurso.findMany({
      where: { ativo: true },
      orderBy: [{ ano: "desc" }, { nome: "asc" }],
      select: { id: true, nome: true, cargo: true, ano: true, bancaId: true, carreiraId: true },
    }),
    prisma.carreira.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.nivelEducacional.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.dificuldade.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, slug: true },
    }),
    prisma.tipoQuestao.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, slug: true, modelo: true, quantidadeAlternativas: true },
    }),
  ])

  return (
    <ImportQuestionsForm
      taxonomy={{
        disciplinas,
        assuntos,
        topicos,
        subtopicos,
        bancas,
        concursos,
        carreiras,
        niveis,
        dificuldades,
        tiposQuestao,
      }}
    />
  )
}
