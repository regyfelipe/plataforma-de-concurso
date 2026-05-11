import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Star, Search, PlayCircle, Trash2, ArrowUpRight, ChevronRight } from "lucide-react"
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

const FILTERS = ["Todas", "Direito", "Lógica", "Informática"]

const DIFFICULTY_COLOR: Record<string, string> = {
    dificil: "text-destructive",
    medio: "text-orange-500",
    facil: "text-emerald-500",
}

export default async function FavoritosPage() {
    const session = await getSession(await headers())
    if (!session?.user?.id) redirect("/login")

    const favorites = await prisma.favorito.findMany({
        where: { usuarioId: session.user.id },
        orderBy: { criadoEm: "desc" },
        select: {
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
                    dificuldade: { select: { slug: true, nome: true } },
                },
            },
        },
    })

    const questions = favorites.map(({ questao }) => ({
        id: questao.id,
        code: questao.code,
        subject: questao.disciplina?.nome ?? "Sem disciplina",
        topic: questao.topico?.nome ?? questao.assunto?.nome ?? "Sem assunto",
        agency: questao.banca?.sigla ?? questao.banca?.nome ?? "S/B",
        year: questao.ano ?? "S/A",
        excerpt: htmlToText(questao.enunciado),
        difficulty: questao.dificuldade?.nome ?? "Média",
        difficultySlug: questao.dificuldade?.slug ?? "medio",
    }))

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-primary mb-1">
                        <Star className="h-4 w-4 fill-primary" />
                        <span className="text-xs font-medium">Minha Coleção</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Questões Favoritas</h1>
                    <p className="text-sm text-muted-foreground">
                        Você possui <span className="font-medium text-foreground">{questions.length} questões</span> salvas para revisão.
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Iniciar Simulado com Favoritos
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar em seus favoritos..." className="pl-9" />
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
                    <Card key={q.id}>
                        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                            <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="secondary">{q.code}</Badge>
                                    <span>{q.agency}</span>
                                    <span>·</span>
                                    <span>{q.year}</span>
                                    <span>·</span>
                                    <span className={DIFFICULTY_COLOR[q.difficultySlug] ?? ""}>{q.difficulty}</span>
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
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm">
                                    Resolver
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    Explorar mais questões
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
