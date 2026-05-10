import { prisma } from "@workspace/database"
import { deleteTipoQuestao } from "@/actions/admin-taxonomy"
import { TiposQuestaoList } from "./tipos-questao-list"
import { CreateTipoQuestaoModal } from "./create-tipo-questao-modal"

export default async function TiposQuestaoPage() {
    const tipos = await prisma.tipoQuestao.findMany({
        orderBy: { nome: "asc" },
        include: {
            _count: {
                select: { questoes: true }
            }
        }
    })

    const items = tipos.map((item) => ({
        id: item.id,
        title: item.nome,
        slug: item.slug,
        active: item.ativo,
        questionsCount: item._count.questoes,
        editHref: `/admin/tipos-questao/editar/${item.id}`,
    }))

    async function handleDelete(id: string) {
        "use server"
        await deleteTipoQuestao(id)
    }

    return (
        <TiposQuestaoList
            items={items}
            createAction={<CreateTipoQuestaoModal />}
            onDelete={handleDelete}
        />
    )
}
