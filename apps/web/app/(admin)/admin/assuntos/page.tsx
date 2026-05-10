import { prisma } from "@workspace/database"
import { deleteAssunto, deleteTopico, deleteSubtopico, createTopicoInline, createSubtopicoInline } from "@/actions/admin-taxonomy"
import { AssuntosList } from "./assuntos-list"
import { CreateAssuntoModal } from "./create-assunto-modal"

export default async function AssuntosPage() {
    const [assuntos, disciplinas] = await Promise.all([
        prisma.assunto.findMany({
            include: {
                disciplina: true,
                _count: {
                    select: { questoes: true }
                },
                topicos: {
                    include: { 
                        subtopicos: {
                            include: {
                                _count: {
                                    select: { questoes: true }
                                }
                            }
                        },
                        _count: {
                            select: { questoes: true }
                        }
                    },
                    orderBy: { nome: "asc" },
                },
            },
            orderBy: { nome: "asc" },
        }),
        prisma.disciplina.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true },
        }),
    ])

    // Achatar hierarquia — inclui rawId para as actions inline e questionsCount
    const items: any[] = []

    assuntos.forEach((assunto) => {
        items.push({
            id: `assunto-${assunto.id}`,
            rawId: assunto.id,
            title: assunto.nome,
            subtitle: `Disciplina: ${assunto.disciplina.nome}`,
            active: assunto.ativo,
            meta: "Assunto Base",
            indent: 0,
            nivel: "assunto",
            questionsCount: assunto._count.questoes,
            editHref: `/admin/assuntos/editar/${assunto.id}`,
        })

        assunto.topicos.forEach((topico) => {
            items.push({
                id: `topico-${topico.id}`,
                rawId: topico.id,
                title: topico.nome,
                subtitle: "",
                active: topico.ativo,
                meta: "Tópico",
                indent: 1,
                nivel: "topico",
                parentId: `assunto-${assunto.id}`,
                questionsCount: topico._count.questoes,
                editHref: `/admin/assuntos/editar/${topico.id}`,
            })

            topico.subtopicos.forEach((sub) => {
                items.push({
                    id: `subtopico-${sub.id}`,
                    rawId: sub.id,
                    title: sub.nome,
                    subtitle: "",
                    active: sub.ativo,
                    meta: "Subtópico",
                    indent: 2,
                    nivel: "subtopico",
                    parentId: `topico-${topico.id}`,
                    questionsCount: sub._count.questoes,
                    editHref: `/admin/assuntos/subtopicos/editar/${sub.id}`,
                })
            })
        })
    })

    async function handleDelete(id: string, nivel: "assunto" | "topico" | "subtopico") {
        "use server"
        if (nivel === "assunto") await deleteAssunto(id)
        else if (nivel === "topico") await deleteTopico(id)
        else await deleteSubtopico(id)
    }

    async function handleCreateTopico(assuntoId: string, nome: string) {
        "use server"
        await createTopicoInline(assuntoId, nome)
    }

    async function handleCreateSubtopico(topicoId: string, nome: string) {
        "use server"
        await createSubtopicoInline(topicoId, nome)
    }

    return (
        <AssuntosList
            items={items}
            disciplinas={disciplinas}
            createAction={<CreateAssuntoModal disciplinas={disciplinas} />}
            onDelete={handleDelete}
            onCreateTopico={handleCreateTopico}
            onCreateSubtopico={handleCreateSubtopico}
        />
    )
}
