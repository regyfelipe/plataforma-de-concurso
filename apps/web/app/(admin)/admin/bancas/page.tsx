import { prisma } from "@workspace/database"
import { deleteBanca } from "@/actions/admin-taxonomy"
import { BancasList } from "./bancas-list"
import { CreateBancaModal } from "./create-banca-modal"

export default async function BancasPage() {
    const bancas = await prisma.banca.findMany({
        orderBy: { nome: "asc" },
        include: {
            _count: {
                select: { questoes: true }
            }
        }
    })

    const items = bancas.map((item) => ({
        id: item.id,
        title: item.nome,
        sigla: item.sigla,
        subtitle: item.descricao || undefined,
        active: item.ativo,
        questionsCount: item._count.questoes,
        editHref: `/admin/bancas/editar/${item.id}`,
    }))

    async function handleDelete(id: string) {
        "use server"
        await deleteBanca(id)
    }

    return (
        <BancasList
            items={items}
            createAction={<CreateBancaModal />}
            onDelete={handleDelete}
        />
    )
}
