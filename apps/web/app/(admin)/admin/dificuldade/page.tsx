import { prisma } from "@workspace/database"
import { deleteDificuldade } from "@/actions/admin-taxonomy"
import { DificuldadeList } from "./dificuldade-list"
import { CreateDificuldadeModal } from "./create-dificuldade-modal"

export default async function DificuldadePage() {
  const dificuldades = await prisma.dificuldade.findMany({ 
    orderBy: { nome: "asc" },
    include: {
        _count: {
            select: { questoes: true }
        }
    }
  })

  const items = dificuldades.map((item) => ({
    id: item.id,
    title: item.nome,
    slug: item.slug,
    active: item.ativo,
    questionsCount: item._count.questoes,
    editHref: `/admin/dificuldade/editar/${item.id}`,
  }))

  async function handleDelete(id: string) {
    "use server"
    await deleteDificuldade(id)
  }

  return (
    <DificuldadeList
        items={items}
        createAction={<CreateDificuldadeModal key="create-dificuldade" />}
        onDelete={handleDelete}
    />
  )
}
