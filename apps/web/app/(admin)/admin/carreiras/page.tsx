import { prisma } from "@workspace/database"
import { deleteCarreira, createCarreiraInline } from "@/actions/admin-taxonomy"
import { CarreirasList } from "./carreiras-list"
import { CreateCarreiraModal } from "./create-carreira-modal"

export default async function CarreirasPage() {
    const allCarreiras = await prisma.carreira.findMany({
        orderBy: { nome: "asc" },
        include: {
            _count: { select: { questoes: true } },
            concursos: {
                select: { id: true, nome: true, ano: true },
                orderBy: { ano: "desc" }
            }
        }
    })

    // Mapa para memoizar a contagem recursiva e não processar várias vezes
    const countsMap = new Map<string, number>()

    function getCumulativeConcursosCount(carreiraId: string): number {
        if (countsMap.has(carreiraId)) return countsMap.get(carreiraId)!
        
        const carreira = allCarreiras.find(c => c.id === carreiraId)
        if (!carreira) return 0

        const ownCount = (carreira as any).concursos.length
        const children = allCarreiras.filter(c => c.parentId === carreiraId)
        const childrenCount = children.reduce((acc, child) => acc + getCumulativeConcursosCount(child.id), 0)
        
        const total = ownCount + childrenCount
        countsMap.set(carreiraId, total)
        return total
    }

    const items: any[] = []

    function buildTree(parentId: string | null = null, indent = 0) {
        const children = allCarreiras.filter(c => c.parentId === parentId)

        children.forEach(carreira => {
            let nivel: any = "carreira"
            if (indent === 1) nivel = "subcarreira"
            else if (indent === 2) nivel = "orgao"
            else if (indent >= 3) nivel = "cargo"

            items.push({
                id: carreira.id,
                parentId: carreira.parentId || undefined,
                title: carreira.nome,
                subtitle: carreira.descricao || undefined,
                active: carreira.ativo,
                iconUrl: carreira.iconUrl || undefined,
                indent,
                nivel,
                questionsCount: carreira._count.questoes,
                concursosCount: getCumulativeConcursosCount(carreira.id),
                concursos: (carreira as any).concursos.map((c: any) => ({
                    id: c.id,
                    nome: c.nome,
                    ano: c.ano
                })),
                editHref: `/admin/carreiras/editar/${carreira.id}`,
            })

            buildTree(carreira.id, indent + 1)
        })
    }

    buildTree(null, 0)

    async function handleDelete(id: string) {
        "use server"
        await deleteCarreira(id)
    }

    async function handleCreateSubcarreira(parentId: string, nome: string, descricao?: string, iconUrl?: string) {
        "use server"
        await createCarreiraInline(nome, parentId, descricao, iconUrl)
    }

    return (
        <CarreirasList
            items={items}
            createAction={<CreateCarreiraModal key="create-carreira" />}
            onDelete={handleDelete}
            onCreateSubcarreira={handleCreateSubcarreira}
        />
    )
}
