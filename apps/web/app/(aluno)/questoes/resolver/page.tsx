import { QuestionCard } from "@/components/questoes/card"
import { QuestionFilter } from "@/components/questoes/filter"
import { prisma } from "@workspace/database"

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

function uniqueOptions<T>(
  items: T[],
  getValue: (item: T) => string | null | undefined,
  getLabel: (item: T) => string | null | undefined = getValue
) {
  const map = new Map<string, string>()

  for (const item of items) {
    const value = getValue(item)
    const label = getLabel(item)

    if (value && label && !map.has(value)) {
      map.set(value, label)
    }
  }

  return Array.from(map, ([value, label]) => ({ value, label }))
}

export default async function Page() {
  const [
    questoes,
    disciplinas,
    assuntos,
    topicos,
    bancas,
    concursos,
    carreiras,
    niveis,
    dificuldades,
  ] = await Promise.all([
    prisma.questao.findMany({
      where: {
        status: "published",
        visibilidade: "publica",
      },
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
    prisma.disciplina.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.assunto.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.topico.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
    prisma.banca.findMany({
      where: { ativo: true },
      orderBy: { sigla: "asc" },
      select: { id: true, nome: true, sigla: true },
    }),
    prisma.concurso.findMany({
      where: { ativo: true },
      orderBy: [{ ano: "desc" }, { nome: "asc" }],
      select: { id: true, nome: true, sigla: true, status: true, ano: true, logoUrl: true, cargo: true },
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
    author: {
      id: questao.autor?.id ?? "admin",
      name: questao.autor?.nome ?? "Administrador",
    },
  }))

  const filterOptions = {
    disciplinas: disciplinas.map((disciplina) => ({
      label: disciplina.nome,
      value: disciplina.id,
    })),
    assuntos: assuntos.map((assunto) => ({
      label: assunto.nome,
      value: assunto.id,
    })),
    topicos: topicos.map((topico) => ({
      label: topico.nome,
      value: topico.id,
    })),
    bancas: bancas.map((banca) => ({
      label: `${banca.sigla} - ${banca.nome}`,
      value: banca.id,
    })),
    concursos: concursos.map((concurso) => ({
      id: concurso.id,
      name: concurso.nome,
      sigla: concurso.sigla ?? undefined,
      ano: concurso.ano ?? undefined,
      status: concurso.status?.toUpperCase(),
      logoUrl: concurso.logoUrl ?? undefined,
      icon: "landmark" as const,
    })),
    carreiras: carreiras.map((carreira) => ({
      label: carreira.nome,
      value: carreira.id,
    })),
    cargos: uniqueOptions(concursos.filter(c => c.cargo), (c) => c.cargo, (c) => c.cargo),
    escolaridades: niveis.map((nivel) => ({
      label: nivel.nome,
      value: nivel.id,
    })),
    anos: uniqueOptions(questoes, (questao) => questao.ano?.toString()),
    dificuldades: dificuldades.map((dificuldade) => ({
      label: dificuldade.nome,
      value: dificuldade.slug,
    })),
  }

  return (
    <div className="flex flex-1 flex-col gap-6 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        {/* <h1 className="text-3xl font-bold tracking-tight">Resolver Questões</h1> */}
        {/* <p className="text-muted-foreground">
          Pratique com nossa base de questões atualizadas e comentadas.
        </p> */}
      </div>

      {/* Componente de Filtro adicionado aqui */}
      <QuestionFilter options={filterOptions} />

      <div className="grid gap-6">
        {questions.length > 0 ? (
          questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-foreground">Nenhuma questão publicada disponível.</p>
            <p className="mt-1 text-sm text-muted-foreground">Assim que novas questões forem publicadas, elas aparecerão aqui.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center py-8">
        <p className="text-sm text-muted-foreground italic">
          Você chegou ao fim da lista inicial. Use os filtros para encontrar mais questões.
        </p>
      </div>
    </div>
  )
}
