import { prisma } from "@workspace/database"
import { 
    deleteDisciplina, 
    deleteAssunto, 
    deleteTopico, 
    deleteSubtopico,
    createAssuntoInline,
    createTopicoInline,
    createSubtopicoInline
} from "@/actions/admin-taxonomy"
import { DisciplinasList } from "./disciplinas-list"
import { CreateDisciplinaModal } from "./create-disciplina-modal"

export default async function DisciplinasPage() {
    const disciplinas = await prisma.disciplina.findMany({
        orderBy: { nome: "asc" },
        include: {
            _count: {
                select: { questoes: true }
            },
            assuntos: {
                include: {
                    _count: {
                        select: { questoes: true }
                    },
                    topicos: {
                        include: { 
                            _count: {
                                select: { questoes: true }
                            },
                            subtopicos: {
                                include: {
                                    _count: {
                                        select: { questoes: true }
                                    }
                                }
                            }
                        },
                        orderBy: { nome: "asc" },
                    }
                },
                orderBy: { nome: "asc" },
            }
        }
    })

    // Achatar hierarquia para o componente de listagem
    const items: any[] = []

    disciplinas.forEach((disciplina) => {
        items.push({
            id: `disciplina-${disciplina.id}`,
            rawId: disciplina.id,
            title: disciplina.nome,
            subtitle: disciplina.descricao || undefined,
            meta: disciplina.code,
            active: disciplina.ativo,
            indent: 0,
            nivel: "disciplina",
            questionsCount: disciplina._count.questoes,
            editHref: `/admin/disciplinas/editar/${disciplina.id}`,
        })

        disciplina.assuntos.forEach((assunto) => {
            items.push({
                id: `assunto-${assunto.id}`,
                rawId: assunto.id,
                title: assunto.nome,
                active: assunto.ativo,
                meta: "Assunto",
                indent: 1,
                nivel: "assunto",
                parentId: `disciplina-${disciplina.id}`,
                questionsCount: assunto._count.questoes,
                editHref: `/admin/assuntos/editar/${assunto.id}`,
            })

            assunto.topicos.forEach((topico) => {
                items.push({
                    id: `topico-${topico.id}`,
                    rawId: topico.id,
                    title: topico.nome,
                    active: topico.ativo,
                    meta: "Tópico",
                    indent: 2,
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
                        active: sub.ativo,
                        meta: "Subtópico",
                        indent: 3,
                        nivel: "subtopico",
                        parentId: `topico-${topico.id}`,
                        questionsCount: sub._count.questoes,
                        editHref: `/admin/assuntos/subtopicos/editar/${sub.id}`,
                    })
                })
            })
        })
    })

    async function handleDelete(id: string, nivel: string) {
        "use server"
        if (nivel === "disciplina") await deleteDisciplina(id)
        else if (nivel === "assunto") await deleteAssunto(id)
        else if (nivel === "topico") await deleteTopico(id)
        else await deleteSubtopico(id)
    }

    async function handleCreateAssunto(disciplinaId: string, nome: string) {
        "use server"
        await createAssuntoInline(disciplinaId, nome)
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
        <DisciplinasList
            items={items}
            createAction={<CreateDisciplinaModal key="create-disciplina" />}
            onDelete={handleDelete}
            onCreateAssunto={handleCreateAssunto}
            onCreateTopico={handleCreateTopico}
            onCreateSubtopico={handleCreateSubtopico}
        />
    )
}
