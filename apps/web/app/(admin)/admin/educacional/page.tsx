import { prisma } from "@workspace/database"
import { deleteEducacional } from "@/actions/admin-taxonomy"
import { EducacionalList } from "./educacional-list"
import { CreateEducacionalModal } from "./create-educacional-modal"

export default async function EducacionalPage() {
    const niveis = await prisma.nivelEducacional.findMany({
        orderBy: { nome: "asc" },
        include: {
            _count: {
                select: { questoes: true }
            }
        }
    })

    const items = niveis.map((item) => ({
        id: item.id,
        title: item.nome,
        active: item.ativo,
        questionsCount: item._count.questoes,
        editHref: `/admin/educacional/editar/${item.id}`,
    }))

    async function handleDelete(id: string) {
        "use server"
        await deleteEducacional(id)
    }

    return (
        <EducacionalList
            items={items}
            createAction={<CreateEducacionalModal key="create-educacional" />}
            onDelete={handleDelete}
        />
    )
}
