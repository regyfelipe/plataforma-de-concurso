import { prisma } from "@workspace/database"
import { CreateAssuntoForm } from "./create-assunto-form"

export default async function CriarAssuntoPage() {
    const [disciplinas, assuntos] = await Promise.all([
        prisma.disciplina.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true },
        }),
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
    ])

    return <CreateAssuntoForm disciplinas={disciplinas} assuntos={assuntos} />
}
