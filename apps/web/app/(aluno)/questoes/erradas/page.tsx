import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Search, RotateCcw, ArrowUpRight, History, AlertCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

function htmlToText(value?: string | null) {
    return value
        ?.replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim() ?? ""
}

function relativeDate(date: Date) {
    const diff = Date.now() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return "Agora mesmo"
    if (hours < 24) return `Há ${hours} hora${hours > 1 ? "s" : ""}`
    const days = Math.floor(hours / 24)
    if (days === 1) return "Ontem"
    return `Há ${days} dias`
}

const FILTERS = ["Todas", "Recentes", "Mais Erradas"]

export default async function ErradasPage() {
    const session = await getSession(await headers())
    if (!session?.user?.id) redirect("/login")

    const wrongAnswers = await prisma.respostaUsuario.findMany({
        where: {
            usuarioId: session.user.id,
            isCorreta: false,
        },
        orderBy: { respondidoEm: "desc" },
        select: {
            respondidoEm: true,
            questao: {
                select: {
                    id: true,
                    code: true,
                    enunciado: true,
                    ano: true,
                    disciplina: { select: { nome: true } },
                    assunto: { select: { nome: true } },
                    topico: { select: { nome: true } },
                    banca: { select: { sigla: true, nome: true } },
                    _count: {
                        select: {
                            respostas: {
                                where: {
                                    usuarioId: session.user.id,
                                    isCorreta: false,
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    const questions = wrongAnswers.map(({ questao, respondidoEm }) => ({
        id: questao.id,
        code: questao.code,
        subject: questao.disciplina?.nome ?? "Sem disciplina",
        topic: questao.topico?.nome ?? questao.assunto?.nome ?? "Sem assunto",
        agency: questao.banca?.sigla ?? questao.banca?.nome ?? "S/B",
        year: questao.ano ?? "S/A",
        excerpt: htmlToText(questao.enunciado),
        lastError: relativeDate(respondidoEm),
        attempts: questao._count.respostas,
    }))

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-destructive mb-1">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Área de Revisão</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Questões Erradas</h1>
                    <p className="text-sm text-muted-foreground">
                        Você tem{" "}
                        <span className="font-medium text-destructive">{questions.length} questões</span>{" "}
                        para revisar e transformar em acertos.
                    </p>
                </div>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Limpar Histórico
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar entre as que você errou..." className="pl-9" />
                </div>
                <div className="flex items-center gap-1">
                    {FILTERS.map((tag) => (
                        <Button
                            key={tag}
                            variant="ghost"
                            size="sm"
                            className={tag === "Todas" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {questions.map((q) => (
                    <Card key={q.id} className="border-l-4 border-l-destructive/40">
                        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                            <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="secondary" className="text-destructive">{q.code}</Badge>
                                    <span>{q.agency}</span>
                                    <span>·</span>
                                    <span>{q.year}</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <History className="h-3 w-3" />
                                        {q.lastError}
                                    </span>
                                    <span>·</span>
                                    <span>{q.attempts}x tentada{q.attempts > 1 ? "s" : ""}</span>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        {q.subject} / {q.topic}
                                    </p>
                                    <p className="text-sm leading-relaxed line-clamp-2">
                                        &quot;{q.excerpt}&quot;
                                    </p>
                                </div>
                            </div>

                            <Separator orientation="vertical" className="hidden md:block h-12" />

                            <div className="flex items-center gap-2 shrink-0">
                                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/5">
                                    Tentar Novamente
                                    <RotateCcw className="ml-2 h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-muted-foreground">
                                    Ver Resolução
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col items-center gap-3 pt-6 border-t">
                <p className="text-sm text-muted-foreground text-center">
                    Dica: Refazer questões que você errou é o segredo da aprovação.
                </p>
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    Ver estatísticas de erro
                    <ArrowUpRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
