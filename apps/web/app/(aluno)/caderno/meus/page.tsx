"use client"

import * as React from "react"
import { Plus, Search, MoreHorizontal, Play, Clock, BarChart3, Layers, Calendar } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Progress } from "@workspace/ui/components/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

const MY_NOTEBOOKS = [
    {
        id: "1",
        title: "Revisão Final - PRF 2024",
        description: "Foco em Legislação de Trânsito e Direito Administrativo.",
        questions: 150,
        solved: 45,
        lastActivity: "Há 40 min"
    },
    {
        id: "2",
        title: "Direito Constitucional - Top 100",
        description: "As 100 questões mais cobradas pela FCC nos últimos 2 anos.",
        questions: 100,
        solved: 88,
        lastActivity: "Ontem"
    }
]

const STATS = [
    { title: "Total de Cadernos", value: "2",    icon: Layers    },
    { title: "Questões Totais",   value: "250",  icon: BarChart3 },
    { title: "Última Revisão",    value: "Hoje", icon: Calendar  },
]

export default function MeusCadernosPage() {
    const [searchQuery, setSearchQuery] = React.useState("")

    const filtered = MY_NOTEBOOKS.filter((n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Meus Cadernos</h1>
                    <p className="text-sm text-muted-foreground">Gerencie e estude seus cadernos de questões</p>
                </div>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Novo
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATS.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription>{stat.title}</CardDescription>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl">{stat.value}</CardTitle>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Busca */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Filtrar cadernos..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Grid de Cadernos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((notebook) => {
                    const progress = Math.round((notebook.solved / notebook.questions) * 100)
                    return (
                        <Card key={notebook.id} className="flex flex-col">
                            <CardHeader className="flex flex-row items-start justify-between gap-2">
                                <div className="space-y-1 min-w-0">
                                    <CardTitle className="text-base line-clamp-1">{notebook.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{notebook.description}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Editar</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="flex flex-col gap-4 flex-1 justify-between">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Progresso</span>
                                        <span className="font-medium text-foreground">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-1.5" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" />
                                        {notebook.lastActivity}
                                    </div>
                                    <Button size="sm" variant="outline">
                                        Estudar
                                        <Play className="ml-2 h-3 w-3 fill-current" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}

                {filtered.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 gap-2 text-center">
                        <p className="font-medium">Nenhum caderno encontrado</p>
                        <p className="text-sm text-muted-foreground">Tente outro termo de busca ou crie um novo caderno.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
