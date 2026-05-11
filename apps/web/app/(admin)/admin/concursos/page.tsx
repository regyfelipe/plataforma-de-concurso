import { prisma } from "@workspace/database"
import { deleteConcurso } from "@/actions/admin-taxonomy"
import { ConcursosList } from "./concursos-list"
import { CreateConcursoModal } from "./create-concurso-modal"

export default async function ConcursosPage() {
    const [concursos, bancas, carreiras, niveis] = await Promise.all([
        prisma.concurso.findMany({
            orderBy: { criadoEm: "desc" },
            include: {
                banca: true,
                carreira: true,
                nivel: true,
                _count: {
                    select: { questoes: true }
                }
            }
        }),
        prisma.banca.findMany({ where: { ativo: true }, orderBy: { sigla: "asc" } }),
        prisma.carreira.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
        prisma.nivelEducacional.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    ])

    const items = concursos.map((item) => ({
        id: item.id,
        nome: item.nome,
        sigla: item.sigla,
        cargo: item.cargo,
        bancaId: item.bancaId,
        carreiraId: item.carreiraId,
        nivelId: item.nivelId,
        banca: item.banca?.sigla,
        carreira: item.carreira?.nome,
        nivel: item.nivel?.nome,
        ano: item.ano || undefined,
        status: item.status,
        active: item.ativo,
        logoUrl: item.logoUrl || undefined,
        questionsCount: item._count.questoes,
        editHref: `/admin/concursos/editar/${item.id}`,
    }))

    async function handleDelete(id: string) {
        "use server"
        await deleteConcurso(id)
    }

    return (
        <ConcursosList
            items={items}
            createAction={
                <CreateConcursoModal 
                    key="create-concurso"
                    bancas={bancas.map(b => ({ id: b.id, nome: b.nome, sigla: b.sigla }))} 
                    carreiras={carreiras.map(c => ({ id: c.id, nome: c.nome }))}
                    niveis={niveis.map(n => ({ id: n.id, nome: n.nome }))}
                />
            }
            onDelete={handleDelete}
            bancas={bancas.map(b => ({ id: b.id, nome: b.nome, sigla: b.sigla }))}
            carreiras={carreiras.map(c => ({ id: c.id, nome: c.nome }))}
            niveis={niveis.map(n => ({ id: n.id, nome: n.nome }))}
        />
    )
}
