import { prisma } from "@workspace/database"
import { CreateHierarquiaForm } from "./create-hierarquia-form"

export default async function CriarHierarquiaPage() {
    const [assuntos, topicos] = await Promise.all([
        prisma.assunto.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: {
                id: true,
                nome: true,
                disciplina: {
                    select: { nome: true },
                },
            },
        }),
        prisma.topico.findMany({
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
        }),
    ])

    return <CreateHierarquiaForm assuntos={assuntos} topicos={topicos} />
}
