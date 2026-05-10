"use client"

import * as React from "react"
import { ChevronDown, Search, Filter } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { RankingPodium } from "@/components/rankings/ranking-podium"
import { RankingTable } from "@/components/rankings/ranking-table"
import { LEADERBOARD_DATA } from "@/data/mocks/rankings"
import { Separator } from "@workspace/ui/components/separator"

export default function RankingPorConcursoPage() {
    const [selectedConcurso] = React.useState("Polícia Federal - Agente")

    const concursoData = LEADERBOARD_DATA["Geral"]

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Simulação de Vaga</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Ranking por Concurso</h1>
                </div>
                <Button variant="outline" size="sm">
                    {selectedConcurso}
                    <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                </Button>
            </div>

            {/* Busca */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar concorrente..." className="pl-9" />
                </div>
                <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </div>

            <RankingPodium data={concursoData} />
            <RankingTable data={concursoData} />

            {/* Disclaimer */}
            <div className="rounded-lg border bg-muted/40 p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                    * Este ranking considera apenas alunos ativos na plataforma que selecionaram este concurso como objetivo principal.
                    A pontuação é baseada na precisão e volume de questões específicas deste edital.
                </p>
            </div>
        </div>
    )
}
