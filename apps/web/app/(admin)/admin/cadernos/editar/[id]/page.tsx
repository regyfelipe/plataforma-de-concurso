import { notFound } from "next/navigation"
import { prisma } from "@workspace/database"
import { CreateNotebookForm } from "../../criar/create-notebook-form"

interface EditarCadernoAdminPageProps {
    params: Promise<{ id: string }>
}

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

export default async function EditarCadernoAdminPage({ params }: EditarCadernoAdminPageProps) {
    const { id } = await params

    const caderno = await prisma.caderno.findUnique({
        where: { id },
        include: {
            questoes: {
                orderBy: { ordem: "asc" },
                include: {
                    questao: {
                        select: {
                            disciplinaId: true,
                            concursoId: true,
                            carreiraId: true,
                            dificuldadeId: true,
                            ano: true,
                        },
                    },
                },
            },
        },
    })

    if (!caderno) {
        notFound()
    }

    const selectedQuestionIds = caderno.questoes.map((item) => item.questaoId)
    const firstQuestion = caderno.questoes[0]?.questao

    const [carreiras, concursos, disciplinas, dificuldades, tiposQuestao, questoes] = await Promise.all([
        prisma.carreira.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true },
        }),
        prisma.concurso.findMany({
            where: { ativo: true },
            orderBy: [{ ano: "desc" }, { nome: "asc" }],
            select: {
                id: true,
                nome: true,
                ano: true,
                banca: { select: { sigla: true } },
            },
        }),
        prisma.disciplina.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, code: true },
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
        prisma.questao.findMany({
            where: {
                OR: [
                    {
                        status: "published",
                        visibilidade: "publica",
                    },
                    {
                        id: { in: selectedQuestionIds },
                    },
                ],
            },
            orderBy: { criadoEm: "desc" },
            take: 100,
            include: {
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
            mode="edit"
            notebookId={caderno.id}
            initialValues={{
                nome: caderno.nome,
                descricao: caderno.descricao ?? "",
                carreiraId: caderno.carreiraId ?? firstQuestion?.carreiraId ?? "",
                concursoId: caderno.concursoId ?? firstQuestion?.concursoId ?? "",
                disciplinaId: caderno.disciplinaId ?? firstQuestion?.disciplinaId ?? "",
                dificuldade: caderno.dificuldadeId ?? firstQuestion?.dificuldadeId ?? "",
                ano: caderno.anoReferencia ? String(caderno.anoReferencia) : firstQuestion?.ano ? String(firstQuestion.ano) : String(new Date().getFullYear()),
                disponivel: caderno.visibilidade === "publico",
            }}
            initialSelectedQuestionIds={selectedQuestionIds}
            options={{
                carreiras: carreiras.map((carreira) => ({ label: carreira.nome, value: carreira.id })),
                concursos: concursos.map((concurso) => ({
                    label: `${concurso.banca?.sigla ? `${concurso.banca.sigla} • ` : ""}${concurso.nome}${concurso.ano ? ` • ${concurso.ano}` : ""}`,
                    value: concurso.id,
                })),
                disciplinas: disciplinas.map((disciplina) => ({
                    label: `${disciplina.code} - ${disciplina.nome}`,
                    value: disciplina.id,
                })),
                dificuldades: dificuldades.map((dificuldade) => ({
                    label: dificuldade.nome,
                    value: dificuldade.id,
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
