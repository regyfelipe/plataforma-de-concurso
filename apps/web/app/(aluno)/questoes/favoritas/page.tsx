"use client"

import * as React from "react"
import { Star, Search, PlayCircle, Trash2, ArrowUpRight, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

const FAVORITE_QUESTIONS = [
    {
        id: "1",
        code: "Q283941",
        subject: "Direito Constitucional",
        topic: "Direitos e Garantias Fundamentais",
        agency: "FCC",
        year: "2024",
        excerpt: "No que tange aos direitos fundamentais previstos na Constituição Federal de 1988, é correto afirmar que...",
        difficulty: "Média"
    },
    {
        id: "2",
        code: "Q112045",
        subject: "Direito Administrativo",
        topic: "Atos Administrativos",
        agency: "Cebraspe",
        year: "2023",
        excerpt: "Acerca dos atributos dos atos administrativos, a imperatividade consiste na...",
        difficulty: "Difícil"
    },
    {
        id: "3",
        code: "Q99823",
        subject: "Raciocínio Lógico",
        topic: "Lógica de Argumentação",
        agency: "Vunesp",
        year: "2024",
        excerpt: "Considere a seguinte afirmação: 'Se estudo, então passo'. A negação lógica dessa afirmação é...",
        difficulty: "Fácil"
    },
]

const FILTERS = ["Todas", "Direito", "Lógica", "Informática"]

const DIFFICULTY_COLOR: Record<string, string> = {
    Difícil: "text-destructive",
    Média:   "text-orange-500",
    Fácil:   "text-emerald-500",
}

export default function FavoritosPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [activeFilter, setActiveFilter] = React.useState("Todas")

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-primary mb-1">
                        <Star className="h-4 w-4 fill-primary" />
                        <span className="text-xs font-medium">Minha Coleção</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Questões Favoritas</h1>
                    <p className="text-sm text-muted-foreground">
                        Você possui <span className="font-medium text-foreground">{FAVORITE_QUESTIONS.length} questões</span> salvas para revisão.
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Iniciar Simulado com Favoritos
                </Button>
            </div>

            {/* Busca e Filtros */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar em seus favoritos..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1">
                    {FILTERS.map((tag) => (
                        <Button
                            key={tag}
                            variant="ghost"
                            size="sm"
                            className={activeFilter === tag ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}
                            onClick={() => setActiveFilter(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Lista */}
            <div className="space-y-3">
                {FAVORITE_QUESTIONS.map((q) => (
                    <Card key={q.id}>
                        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                            <div className="space-y-2 flex-1 min-w-0">
                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant="secondary">{q.code}</Badge>
                                    <span>{q.agency}</span>
                                    <span>·</span>
                                    <span>{q.year}</span>
                                    <span>·</span>
                                    <span className={DIFFICULTY_COLOR[q.difficulty] ?? ""}>{q.difficulty}</span>
                                </div>

                                {/* Conteúdo */}
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                        {q.subject} / {q.topic}
                                    </p>
                                    <p className="text-sm leading-relaxed line-clamp-2">
                                        "{q.excerpt}"
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

            {/* Footer */}
            <div className="flex justify-center">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    Explorar mais questões
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
