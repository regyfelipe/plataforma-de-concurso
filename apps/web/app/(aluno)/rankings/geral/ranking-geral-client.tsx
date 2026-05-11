"use client"

import * as React from "react"
import { Trophy, ChevronRight, ChevronDown, Award, Briefcase, BookOpen } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { RankingPodium } from "@/components/rankings/ranking-podium"
import { RankingTable } from "@/components/rankings/ranking-table"
import type { RankingCategory, RankingEntry, RankingPeriod } from "../ranking-data"

const CATEGORY_TABS: Array<{ id: RankingCategory; icon: typeof Trophy }> = [
    { id: "Geral", icon: Trophy },
    { id: "Disciplina", icon: BookOpen },
    { id: "Carreira", icon: Briefcase },
    { id: "Assunto", icon: Award },
]

const TIMEFRAMES: RankingPeriod[] = ["Semanal", "Mensal", "Geral"]

type RankingGeralClientProps = {
    rankings: Record<RankingCategory, Record<RankingPeriod, RankingEntry[]>>
    labels: Record<Exclude<RankingCategory, "Geral">, string>
}

export function RankingGeralClient({ rankings, labels }: RankingGeralClientProps) {
    const [activeTab, setActiveTab] = React.useState<RankingCategory>("Geral")
    const [timeframe, setTimeframe] = React.useState<RankingPeriod>("Geral")
    const currentData = rankings[activeTab][timeframe]

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Performance Global</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Rankings de Elite</h1>
                </div>

                {/* Timeframe toggle */}
                <div className="flex items-center gap-1">
                    {TIMEFRAMES.map((tab) => (
                        <Button
                            key={tab}
                            variant={timeframe === tab ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setTimeframe(tab)}
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 border-b">
                {CATEGORY_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px
                            ${activeTab === tab.id
                                ? "border-foreground text-foreground font-medium"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <tab.icon className="h-4 w-4 shrink-0" />
                        {tab.id}
                    </button>
                ))}
            </div>

            {/* Secondary filter */}
            {activeTab !== "Geral" && (
                <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Filtrar {activeTab}:</span>
                    <Button variant="outline" size="sm">
                        {labels[activeTab]}
                        <ChevronDown className="ml-2 h-3 w-3" />
                    </Button>
                </div>
            )}

            <RankingPodium data={currentData} />
            <RankingTable data={currentData} />

            {/* Footer */}
            <div className="flex flex-col items-center gap-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Continue resolvendo para subir de nível</p>
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    Ver regras de pontuação
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
