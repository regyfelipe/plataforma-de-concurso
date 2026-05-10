import { prisma } from "@workspace/database"
import { deleteCarreira } from "@/actions/admin-taxonomy"
import { CarreirasList } from "./carreiras-list"
import { CreateCarreiraModal } from "./create-carreira-modal"

export default async function CarreirasPage() {
    const carreiras = await prisma.carreira.findMany({
        orderBy: { nome: "asc" },
        include: {
            _count: {
                select: { questoes: true }
            }
        }
    })

    const items = carreiras.map((item) => ({
        id: item.id,
        title: item.nome,
        subtitle: item.descricao || undefined,
        active: item.ativo,
        iconUrl: item.iconUrl || undefined,
        questionsCount: item._count.questoes,
        editHref: `/admin/carreiras/editar/${item.id}`,
    }))

    async function handleDelete(id: string) {
        "use server"
        await deleteCarreira(id)
    }

    return (
        <CarreirasList
            items={items}
            createAction={<CreateCarreiraModal />}
            onDelete={handleDelete}
        />
    )
}
