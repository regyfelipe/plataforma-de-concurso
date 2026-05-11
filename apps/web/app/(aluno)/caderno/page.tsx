import { prisma } from "@workspace/database"
import { CadernoClientPage } from "./caderno-client"

export default async function CadernoPage() {
    const [concursos, cadernos, cadernosPorConcurso, questoesPorConcurso] = await Promise.all([
        prisma.concurso.findMany({
            where: { ativo: true },
            orderBy: [{ ano: "desc" }, { nome: "asc" }],
            select: {
                id: true,
                nome: true,
                sigla: true,
                ano: true,
                status: true,
                logoUrl: true,
            },
        }),
        prisma.caderno.findMany({
            where: {
                concursoId: { not: null },
                visibilidade: "publico",
            },
            orderBy: { atualizadoEm: "desc" },
            select: {
                id: true,
                nome: true,
                concursoId: true,
                disciplina: { select: { nome: true } },
                usuario: {
                    select: {
                        nome: true,
                        avatarUrl: true,
                        perfilExtra: { select: { avatarUrl: true } },
                    },
                },
                questoes: {
                    take: 1,
                    orderBy: { ordem: "asc" },
                    select: {
                        questao: {
                            select: {
                                disciplina: { select: { nome: true } },
                            },
                        },
                    },
                },
                _count: { select: { questoes: true } },
            },
        }),
        prisma.caderno.groupBy({
            by: ["concursoId"],
            where: {
                concursoId: { not: null },
                visibilidade: "publico",
            },
            _count: { _all: true },
        }),
        prisma.questao.groupBy({
            by: ["concursoId"],
            where: {
                concursoId: { not: null },
                status: "published",
                visibilidade: "publica",
            },
            _count: { _all: true },
        }),
    ])

    const cadernosCount = new Map(
        cadernosPorConcurso.map((item) => [item.concursoId, item._count._all])
    )
    const questoesCount = new Map(
        questoesPorConcurso.map((item) => [item.concursoId, item._count._all])
    )

    return (
        <CadernoClientPage
            concursos={concursos.map((concurso) => ({
                id: concurso.id,
                name: concurso.sigla || concurso.nome,
                title: concurso.nome,
                year: concurso.ano,
                status: concurso.status,
                logoUrl: concurso.logoUrl,
                notebooks: cadernosCount.get(concurso.id) ?? 0,
                questions: questoesCount.get(concurso.id) ?? 0,
            }))}
            notebooks={cadernos.map((caderno) => ({
                id: caderno.id,
                concursoId: caderno.concursoId,
                title: caderno.nome,
                professor: caderno.usuario.nome.split(" ")[0] || caderno.usuario.nome,
                avatarUrl: caderno.usuario.perfilExtra?.avatarUrl || caderno.usuario.avatarUrl,
                discipline: caderno.disciplina?.nome || caderno.questoes[0]?.questao.disciplina?.nome || "Sem disciplina",
                questions: caderno._count.questoes,
            }))}
        />
    )
}
