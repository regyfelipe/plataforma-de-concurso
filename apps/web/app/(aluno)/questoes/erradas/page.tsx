"use client"

import * as React from "react"
import { Search, RotateCcw, ArrowUpRight, History, AlertCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

const WRONG_QUESTIONS = [
    {
        id: "1",
        code: "Q283941",
        subject: "Raciocínio Lógico",
        topic: "Lógica de Argumentação",
        agency: "FCC",
        year: "2024",
        excerpt: "Considere a seguinte afirmação: 'Se estudo, então passo'. A negação lógica dessa afirmação é...",
        lastError: "Há 2 horas",
        attempts: 2,
    },
    {
        id: "2",
        code: "Q112045",
        subject: "Direito Administrativo",
        topic: "Atos Administrativos",
        agency: "Cebraspe",
        year: "2023",
        excerpt: "Acerca dos atributos dos atos administrativos, a imperatividade consiste na...",
        lastError: "Ontem",
        attempts: 1,
    },
    {
        id: "3",
        code: "Q99823",
        subject: "Informática",
        topic: "Segurança da Informação",
        agency: "Vunesp",
        year: "2024",
        excerpt: "O tipo de malware que se propaga automaticamente pelas redes, explorando vulnerabilidades, é conhecido como...",
        lastError: "Há 3 dias",
        attempts: 3,
    },
]

const FILTERS = ["Todas", "Recentes", "Mais Erradas"]

export default function ErradasPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [activeFilter, setActiveFilter] = React.useState("Todas")

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-destructive mb-1">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Área de Revisão</span>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Questões Erradas</h1>
                    <p className="text-sm text-muted-foreground">
                        Você tem{" "}
                        <span className="font-medium text-destructive">{WRONG_QUESTIONS.length} questões</span>{" "}
                        para revisar e transformar em acertos.
                    </p>
                </div>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Limpar Histórico
                </Button>
            </div>

            {/* Busca e Filtros */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar entre as que você errou..."
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
                {WRONG_QUESTIONS.map((q) => (
                    <Card key={q.id} className="border-l-4 border-l-destructive/40">
                        <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5">
                            <div className="space-y-2 flex-1 min-w-0">
                                {/* Meta */}
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

            {/* Rodapé */}
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
