import { CreateQuestionForm } from "@/components/admin/questions/create/create-question-form"
import { prisma } from "@workspace/database"
import { notFound } from "next/navigation"

export default async function EditarQuestaoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const questao = await prisma.questao.findUnique({
        where: { id },
        include: {
            alternativas: {
                orderBy: { letra: "asc" }
            },
            objetivos: true,
            referencias: true,
            videos: true,
        }
    })

    if (!questao) {
        notFound()
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
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.disciplinaId ? [{ id: questao.disciplinaId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, code: true },
        }),
        prisma.assunto.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.assuntoId ? [{ id: questao.assuntoId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, disciplinaId: true },
        }),
        prisma.topico.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.topicoId ? [{ id: questao.topicoId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, assuntoId: true },
        }),
        prisma.subtopico.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.subtopicoId ? [{ id: questao.subtopicoId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, topicoId: true },
        }),
        prisma.banca.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.bancaId ? [{ id: questao.bancaId }] : []),
                ],
            },
            orderBy: { sigla: "asc" },
            select: { id: true, nome: true, sigla: true },
        }),
        prisma.concurso.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.concursoId ? [{ id: questao.concursoId }] : []),
                ],
            },
            orderBy: [{ ano: "desc" }, { nome: "asc" }],
            select: { id: true, nome: true, cargo: true, ano: true },
        }),
        prisma.carreira.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.carreiraId ? [{ id: questao.carreiraId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true },
        }),
        prisma.nivelEducacional.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.nivelId ? [{ id: questao.nivelId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true },
        }),
        prisma.dificuldade.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.dificuldadeId ? [{ id: questao.dificuldadeId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, slug: true },
        }),
        prisma.tipoQuestao.findMany({
            where: {
                OR: [
                    { ativo: true },
                    ...(questao.tipoId ? [{ id: questao.tipoId }] : []),
                ],
            },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, slug: true, modelo: true, quantidadeAlternativas: true },
        }),
    ])

    // Adaptar os dados da questão para o formato esperado pelo formulário
    const initialData = {
        id: questao.id,
        disciplinaId: questao.disciplinaId,
        assuntoId: questao.assuntoId,
        topicoId: questao.topicoId,
        subtopicoId: questao.subtopicoId,
        bancaId: questao.bancaId,
        concursoId: questao.concursoId,
        carreiraId: questao.carreiraId,
        nivelId: questao.nivelId,
        dificuldadeId: questao.dificuldadeId,
        tipoId: questao.tipoId,
        cargo: questao.cargo,
        ano: questao.ano,
        isInedita: questao.isInedita,
        enunciado: questao.enunciado,
        textoApoio: questao.textoApoio,
        resolucao: questao.resolucao,
        videoUrl: questao.videos[0]?.url || "",
        objetivo: questao.objetivos[0]?.descricao || "",
        referencia: questao.referencias[0]?.texto || "",
        dica: questao.alternativas[0]?.dica || "", // Usando a primeira dica como geral se existir
        visibilidade: questao.visibilidade,
        status: questao.status as "draft" | "published",
        alternativas: questao.alternativas.map(alt => ({
            letter: alt.letra,
            text: alt.texto,
            isCorrect: alt.isCorreta,
            explanation: alt.explicacao,
            reference: alt.referencia,
            tip: alt.dica
        }))
    }

    return (
        <CreateQuestionForm
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
            initialData={initialData}
        />
    )
}
