import { prisma } from "@workspace/database"
import { CreateNotebookForm } from "./create-notebook-form"

function htmlToText(value?: string | null) {
  if (!value) return ""

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

export default async function CriarCadernoStepsPage() {
  const [concursos, disciplinas, tiposQuestao, questoes] = await Promise.all([
    prisma.concurso.findMany({
      where: { ativo: true },
      orderBy: [{ ano: "desc" }, { nome: "asc" }],
      select: {
        id: true,
        nome: true,
        ano: true,
        cargo: true,
        banca: { select: { sigla: true } },
        carreira: { select: { nome: true } },
      },
    }),
    prisma.disciplina.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, code: true },
    }),
    prisma.tipoQuestao.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, slug: true, modelo: true, quantidadeAlternativas: true },
    }),
    prisma.questao.findMany({
      where: {
        status: "published",
        visibilidade: "publica",
      },
      orderBy: { criadoEm: "desc" },
      take: 100,
      select: {
        id: true,
        code: true,
        enunciado: true,
        textoApoio: true,
        resolucao: true,
        instituicao: true,
        ano: true,
        isInedita: true,
        disciplina: { select: { nome: true } },
        assunto: { select: { nome: true } },
        topico: { select: { nome: true } },
        banca: { select: { sigla: true, nome: true } },
        concurso: { select: { nome: true } },
        carreira: { select: { nome: true } },
        nivel: { select: { nome: true } },
        dificuldade: { select: { slug: true, nome: true } },
        alternativas: {
          orderBy: { letra: "asc" },
          select: { id: true, letra: true, texto: true, isCorreta: true, explicacao: true },
        },
      },
    }),
  ])

  return (
    <CreateNotebookForm
      options={{
        concursos: concursos.map((concurso) => {
          const hasCarreira = concurso.carreira?.nome && concurso.carreira.nome !== concurso.nome
          return {
            label: `${concurso.banca?.sigla ?? "Geral"} • ${concurso.nome}${concurso.ano ? ` ${concurso.ano}` : ""} • ${concurso.cargo ?? "Geral"}${hasCarreira ? ` • ${concurso.carreira?.nome}` : ""}`,
            value: concurso.id,
          }
        }),
        disciplinas: disciplinas.map((disciplina) => ({
          label: disciplina.nome,
          value: disciplina.id,
        })),
        tiposQuestao,
      }}
      questions={questoes.map((questao) => ({
        id: questao.id,
        code: questao.code,
        text: htmlToText(questao.enunciado) || "Questão sem enunciado",
        supportText: questao.textoApoio,
        resolution: questao.resolucao,
        board: questao.banca?.sigla ?? questao.banca?.nome ?? "Sem banca",
        institution: questao.concurso?.nome ?? questao.instituicao,
        career: questao.carreira?.nome ?? null,
        subject: questao.assunto?.nome ?? null,
        topic: questao.topico?.nome ?? null,
        year: questao.ano,
        educationLevel: questao.nivel?.nome ?? "Nível não informado",
        discipline: questao.disciplina?.nome ?? "Sem disciplina",
        difficulty: questao.dificuldade?.slug ?? "medio",
        isUnique: questao.isInedita,
        alternatives: questao.alternativas.map((alternativa) => ({
          id: alternativa.id,
          letter: alternativa.letra,
          text: alternativa.texto,
          isCorrect: alternativa.isCorreta,
          explanation: alternativa.explicacao,
        })),
      }))}
    />
  )
}
