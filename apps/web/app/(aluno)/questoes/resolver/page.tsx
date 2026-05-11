import React from "react"
import { QuestionCard } from "@/components/questoes/card"
import { QuestionFilter } from "@/components/questoes/filter"
import { prisma } from "@workspace/database"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"

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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ 
    notebookId?: string; 
    page?: string;
    disciplinaId?: string;
    assuntoId?: string;
    topicoId?: string;
    bancaId?: string;
    carreiraId?: string;
    dificuldade?: string;
    ano?: string;
  }>
}) {
  const { 
    notebookId, 
    page: pageParam,
    disciplinaId,
    assuntoId,
    topicoId,
    bancaId,
    carreiraId,
    dificuldade,
    ano,
  } = await searchParams
  const currentPage = Math.max(1, Number(pageParam) || 1)
  const pageSize = 10
  const skip = (currentPage - 1) * pageSize

  const whereClause = {
    ...(notebookId
      ? {
          cadernos: {
            some: {
              cadernoId: notebookId,
            },
          },
        }
      : {
          status: "published" as const,
          visibilidade: "publica" as const,
        }),
    ...(disciplinaId ? { disciplinaId } : {}),
    ...(assuntoId ? { assuntoId } : {}),
    ...(topicoId ? { topicoId } : {}),
    ...(bancaId ? { bancaId } : {}),
    ...(carreiraId ? { carreiraId } : {}),
    ...(dificuldade ? { dificuldade: { slug: dificuldade } } : {}),
    ...(ano ? { ano: Number(ano) } : {}),
  }

  const [
    questoes,
    totalCount,
    disciplinas,
    assuntos,
    topicos,
    bancas,
    concursos,
    carreiras,
    niveis,
    dificuldades,
    notebook,
  ] = await Promise.all([
    prisma.questao.findMany({
      where: whereClause,
      orderBy: { criadoEm: "desc" },
      skip,
      take: pageSize,
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
    prisma.questao.count({
      where: whereClause,
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
      select: { id: true, nome: true, parentId: true },
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
    notebookId ? prisma.caderno.findUnique({ where: { id: notebookId } }) : null,
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

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
      parentId: carreira.parentId,
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
    <div className="flex flex-1 flex-col gap-6 pt-6 max-w-7xl mx-auto w-full px-4">
      {notebook ? (
        <div className="flex flex-col gap-1 px-4 py-6 bg-muted/10 rounded-2xl border border-border/40 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
             Caderno de Questões
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">{notebook.nome}</h1>
          <p className="text-xs text-muted-foreground font-medium uppercase">{questions.length} questões disponíveis para resolução</p>
        </div>
      ) : null}

      {!notebookId && <QuestionFilter options={filterOptions} />}

      <div className="grid gap-6">
        {questions.length > 0 ? (
          questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 px-6 py-16 text-center">
            <p className="text-sm font-semibold text-foreground">Nenhuma questão encontrada.</p>
            <p className="mt-1 text-sm text-muted-foreground">Assim que novas questões forem adicionadas, elas aparecerão aqui.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="py-10">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious 
                    href={`?${new URLSearchParams({ 
                        ...Object.fromEntries(
                            Object.entries({
                                notebookId,
                                disciplinaId,
                                assuntoId,
                                topicoId,
                                bancaId,
                                carreiraId,
                                dificuldade,
                                ano,
                                page: (currentPage - 1).toString()
                            }).filter(([_, v]) => v != null)
                        )
                    }).toString()}`} 
                    text="Anterior"
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((p, i, arr) => {
                const prevPage = arr[i - 1]
                const showEllipsisBefore = i > 0 && prevPage !== undefined && p - prevPage > 1
                return (
                  <React.Fragment key={p}>
                    {showEllipsisBefore && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href={`?${new URLSearchParams({ 
                            ...Object.fromEntries(
                                Object.entries({
                                    notebookId,
                                    disciplinaId,
                                    assuntoId,
                                    topicoId,
                                    bancaId,
                                    carreiraId,
                                    dificuldade,
                                    ano,
                                    page: p.toString()
                                }).filter(([_, v]) => v != null)
                            )
                        }).toString()}`}
                        isActive={currentPage === p}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                )
              })}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext 
                    href={`?${new URLSearchParams({ 
                        ...Object.fromEntries(
                            Object.entries({
                                notebookId,
                                disciplinaId,
                                assuntoId,
                                topicoId,
                                bancaId,
                                carreiraId,
                                dificuldade,
                                ano,
                                page: (currentPage + 1).toString()
                            }).filter(([_, v]) => v != null)
                        )
                    }).toString()}`} 
                    text="Próxima"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      <div className="flex justify-center py-8">
        <p className="text-sm text-muted-foreground italic text-center">
          {notebookId && currentPage === totalPages ? "Fim do caderno de questões." : ""}
          {!notebookId && currentPage === totalPages ? "Você chegou ao fim da lista disponível. Use os filtros para encontrar mais questões." : ""}
          {currentPage < totalPages ? `Página ${currentPage} de ${totalPages}` : ""}
        </p>
      </div>
    </div>
  )
}
