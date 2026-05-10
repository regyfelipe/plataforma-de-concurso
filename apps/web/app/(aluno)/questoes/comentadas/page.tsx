"use client"

import { useState } from "react"
import { Search, Filter, MessageSquare, ShieldCheck, Bookmark, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { COMMENTED_QUESTIONS } from "../../../../data/mocks/questoes"

export default function QuestoesComentadasPage() {
    const [onlyTeacher, setOnlyTeacher] = useState(false)

    const filtered = onlyTeacher
        ? COMMENTED_QUESTIONS.filter((q) => q.hasTeacherComment)
        : COMMENTED_QUESTIONS

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Inteligência Coletiva</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Questões Comentadas</h1>
                </div>
                <Button
                    variant={onlyTeacher ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOnlyTeacher(!onlyTeacher)}
                >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Apenas Professores
                </Button>
            </div>

            {/* Busca e Filtros */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Pesquise por palavras-chave, banca ou código..."
                        className="pl-9"
                    />
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar Matéria
                </Button>
            </div>

            {/* Grid de Questões */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filtered.map((q) => (
                    <Card key={q.id}>
                        <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="text-primary">{q.subject}</Badge>
                                <Badge variant="outline">{q.board} {q.year}</Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="font-mono text-xs text-muted-foreground">{q.code}</p>
                                <p className="text-sm leading-relaxed line-clamp-3">{q.preview}</p>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        {q.commentCount} comentários
                                    </span>
                                    {q.hasTeacherComment && (
                                        <span className="flex items-center gap-1 text-emerald-600">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            Professor
                                        </span>
                                    )}
                                </div>

                                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-primary">
                                    Ver Explicação
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
