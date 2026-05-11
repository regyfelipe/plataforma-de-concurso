import { prisma } from "@workspace/database"
import { NotebooksAdminList } from "./notebooks-admin-list"
import { deleteAdminNotebook } from "@/actions/admin-notebooks"

export default async function ListarCadernosAdminPage() {
    const cadernos = await prisma.caderno.findMany({
        orderBy: { criadoEm: "desc" },
        include: {
            usuario: {
                select: {
                    nome: true,
                    email: true,
                },
            },
            disciplina: {
                select: { nome: true },
            },
            questoes: {
                take: 1,
                orderBy: { ordem: "asc" },
                include: {
                    questao: {
                        select: {
                            disciplina: {
                                select: { nome: true },
                            },
                        },
                    },
                },
            },
            _count: {
                select: { questoes: true },
            },
        },
    })

    async function handleDelete(id: string) {
        "use server"
        await deleteAdminNotebook(id)
    }

    return (
        <NotebooksAdminList
            notebooks={cadernos.map((caderno) => ({
                id: caderno.id,
                name: caderno.nome,
                professor: caderno.usuario.nome || caderno.usuario.email,
                disciplina: caderno.disciplina?.nome ?? caderno.questoes[0]?.questao.disciplina?.nome ?? "Sem disciplina",
                questions: caderno._count.questoes,
                status: caderno.visibilidade === "publico" ? "published" : "draft",
            }))}
            onDelete={handleDelete}
        />
    )
}
