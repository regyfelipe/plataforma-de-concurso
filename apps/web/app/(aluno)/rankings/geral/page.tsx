"use client"

import * as React from "react"
import { 
    Trophy, 
    ChevronRight, 
    ChevronDown,
    Award,
    Briefcase,
    BookOpen
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { RankingPodium } from "@/components/rankings/ranking-podium"
import { RankingTable } from "@/components/rankings/ranking-table"
import { LEADERBOARD_DATA } from "@/data/mocks/rankings"

export default function RankingGeralPage() {
    const [activeTab, setActiveTab] = React.useState("Geral")
    const [timeframe, setTimeframe] = React.useState("Geral")

    const currentData = LEADERBOARD_DATA[activeTab] || LEADERBOARD_DATA["Geral"]

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Performance Global</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Rankings de Elite
                    </h1>
                </div>

                <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-xl border border-border/40">
                    {['Semanal', 'Mensal', 'Geral'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setTimeframe(tab)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${timeframe === tab ? "bg-card text-foreground shadow-sm border border-border/40" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Abas Primárias */}
            <div className="flex items-center gap-2 border-b border-border/20 pb-4">
                {[
                    { id: "Geral", icon: Trophy },
                    { id: "Disciplina", icon: BookOpen },
                    { id: "Carreira", icon: Briefcase },
                    { id: "Assunto", icon: Award }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                            activeTab === tab.id 
                            ? "bg-primary/10 text-primary border-primary/20" 
                            : "text-muted-foreground hover:bg-muted/10 border-transparent"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.id}
                    </button>
                ))}
            </div>

            {/* Filtros Secundários */}
            {activeTab !== "Geral" && (
                <div className="flex items-center justify-between bg-muted/5 border border-border/40 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Filtrar {activeTab}:</span>
                        <Button variant="outline" className="rounded-lg h-9 text-[10px] font-bold uppercase tracking-widest gap-2 border-border/40">
                            {activeTab === "Disciplina" ? "Direito Constitucional" : activeTab === "Carreira" ? "Policial" : "Atos Administrativos"}
                            <ChevronDown className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Pódio Dinâmico */}
            <RankingPodium data={currentData} />

            {/* Tabela de Rankings */}
            <RankingTable data={currentData} />
            
            {/* CTA Final */}
            <div className="flex flex-col items-center gap-4 pt-4">
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.2em]">Continue resolvendo para subir de nível</p>
                <Button variant="ghost" className="text-muted-foreground/40 hover:text-primary text-[10px] font-black uppercase tracking-[0.2em] gap-2">
                    Ver regras de pontuação
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
