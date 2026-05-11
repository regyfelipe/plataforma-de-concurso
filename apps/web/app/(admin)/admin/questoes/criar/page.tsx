import { CreateQuestionForm } from "@/components/admin/questions/create/create-question-form"
import { prisma } from "@workspace/database"

export default async function CriarQuestaoPage() {
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
        />
    )
}
