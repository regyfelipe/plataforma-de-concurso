import { prisma } from "@workspace/database"
import { CreateConcursoForm } from "./create-concurso-form"

export default async function CriarConcursoPage() {
    const [bancas, carreiras, niveis] = await Promise.all([
        prisma.banca.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true, sigla: true },
        }),
        prisma.carreira.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true },
        }),
        prisma.nivelEducacional.findMany({
            where: { ativo: true },
            orderBy: { nome: "asc" },
            select: { id: true, nome: true },
        }),
    ])

    return <CreateConcursoForm bancas={bancas} carreiras={carreiras} niveis={niveis} />
}
