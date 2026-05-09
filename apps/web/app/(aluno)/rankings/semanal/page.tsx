"use client"

import * as React from "react"
import { Calendar, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { RankingPodium } from "@/components/rankings/ranking-podium"
import { RankingTable } from "@/components/rankings/ranking-table"
import { LEADERBOARD_DATA } from "@/data/mocks/rankings"

export default function RankingSemanalPage() {
    // Usando dados semanais (no mock real teríamos dados filtrados)
    const weeklyData = LEADERBOARD_DATA["Geral"] 

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Semanal */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Ciclo Atual</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Ranking Semanal
                    </h1>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-muted/20 rounded-xl border border-border/40">
                    <Calendar className="w-4 h-4 text-muted-foreground/40" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">01 Mai - 07 Mai</span>
                </div>
            </div>

            {/* Pódio Dinâmico */}
            <RankingPodium data={weeklyData} />

            {/* Tabela de Rankings */}
            <RankingTable data={weeklyData} />
            
            {/* CTA */}
            <div className="flex flex-col items-center gap-4 pt-4">
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">O ranking reseta em 2 dias e 14 horas</p>
                <Button variant="ghost" className="text-muted-foreground/40 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] gap-2">
                    Ver histórico de semanas
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
