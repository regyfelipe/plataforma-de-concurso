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
    importHistory,
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
    prisma.importacaoQuestao.findMany({
      orderBy: { criadoEm: "desc" },
      take: 10,
      select: {
        id: true,
        arquivoNome: true,
        tipoArquivo: true,
        status: true,
        totalQuestoes: true,
        totalImportadas: true,
        totalErros: true,
        totalAvisos: true,
        erros: true,
        avisos: true,
        criadoEm: true,
        usuario: { select: { nome: true, perfilExtra: { select: { nomeExibicao: true } } } },
      },
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
      history={importHistory.map((item) => ({
        id: item.id,
        arquivoNome: item.arquivoNome,
        tipoArquivo: item.tipoArquivo,
        status: item.status,
        totalQuestoes: item.totalQuestoes,
        totalImportadas: item.totalImportadas,
        totalErros: item.totalErros,
        totalAvisos: item.totalAvisos,
        erros: item.erros,
        avisos: item.avisos,
        criadoEm: item.criadoEm.toISOString(),
        usuario: item.usuario.perfilExtra?.nomeExibicao || item.usuario.nome,
      }))}
    />
  )
}
