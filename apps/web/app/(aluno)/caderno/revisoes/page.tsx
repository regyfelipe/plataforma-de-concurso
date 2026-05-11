import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ReviewCard } from "@/components/caderno/revisoes/review-card"
import { ReviewInfoSection } from "@/components/caderno/revisoes/review-info-section"
import { Button } from "@workspace/ui/components/button"

function daysBetween(from: Date, to = new Date()) {
    const diff = to.getTime() - from.getTime()
    return Math.max(0, Math.min(7, Math.floor(diff / (1000 * 60 * 60 * 24))))
}

function reviewStatus(repetitions: number, interval: number) {
    if (interval <= 1 && repetitions === 0) return "Crítico"
    if (repetitions >= 3 || interval >= 7) return "Quase"
    return "Recuperando"
}

export default async function RevisoesPage() {
    const session = await getSession(await headers())
    if (!session?.user?.id) redirect("/login")

    const reviews = await prisma.revisao.findMany({
        where: {
            usuarioId: session.user.id,
            status: "pendente",
            proximaRevisao: { lte: new Date() },
        },
        orderBy: [{ proximaRevisao: "asc" }, { criadoEm: "asc" }],
        select: {
            id: true,
            intervaloDias: true,
            repeticoes: true,
            criadoEm: true,
            ultimaRevisao: true,
            questao: {
                select: {
                    code: true,
                    disciplina: { select: { nome: true } },
                    assunto: { select: { nome: true } },
                    topico: { select: { nome: true } },
                    subtopico: { select: { nome: true } },
                },
            },
        },
    })

    const queue = reviews.map((review) => ({
        id: review.id,
        code: review.questao.code,
        discipline: review.questao.disciplina?.nome ?? "Sem disciplina",
        subject: review.questao.assunto?.nome ?? "Sem assunto",
        topic: review.questao.topico?.nome ?? "Sem tópico",
        subtopic: review.questao.subtopico?.nome ?? "Sem subtópico",
        consecutiveErrors: Math.max(1, review.intervaloDias === 1 ? 2 : 1),
        daysInReview: daysBetween(review.criadoEm),
        status: reviewStatus(review.repeticoes, review.intervaloDias),
        lastAttempt: review.ultimaRevisao ? "Revisada recentemente" : "Pendente",
    }))

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Inteligência Pedagógica</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Ciclo de Revisão</h1>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Questões com <span className="font-medium text-destructive">2+ erros consecutivos</span> entram aqui.
                        Complete 7 dias de acertos para removê-las.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total em Fila</p>
                        <p className="text-2xl font-semibold">{queue.length}</p>
                    </div>
                    <Button size="sm">
                        Iniciar Sessão de Recuperação
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                {queue.map((item) => (
                    <ReviewCard key={item.id} item={item} />
                ))}
            </div>

            <ReviewInfoSection />
        </div>
    )
}
