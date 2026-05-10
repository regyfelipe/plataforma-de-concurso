import { prisma } from "@workspace/database"
import { CreateSubtopicoForm } from "./create-subtopico-form"

export default async function CriarSubtopicoPage() {
    const topicos = await prisma.topico.findMany({
        where: { ativo: true },
        orderBy: { nome: "asc" },
        select: {
            id: true,
            nome: true,
            assunto: {
                select: {
                    nome: true,
                    disciplina: {
                        select: { nome: true },
                    },
                },
            },
        },
    })

    return <CreateSubtopicoForm topicos={topicos} />
}
