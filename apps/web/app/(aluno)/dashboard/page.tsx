"use client"

import { useState } from "react"
import { 
    Flame, 
    Target, 
    TrendingUp, 
    BarChart3, 
    BookOpen, 
    LayoutGrid, 
    Trophy
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { DisciplineMasteryChart } from "@/components/dashboard/discipline-mastery-chart"
import { PerformanceEvolutionChart } from "@/components/dashboard/performance-evolution-chart"

export default function DashboardPage() {
    const [timeframe, setTimeframe] = useState('7 dias')

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background">
            
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 text-foreground italic uppercase">
                        Boa tarde, llipper! <span className="text-primary not-italic">.</span>
                    </h1>
                    <p className="text-xs font-medium text-muted-foreground/60 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-primary" />
                        Bom começo! Vamos construir seu streak!
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-4 bg-card dark:bg-muted/10 border border-border/40 px-5 py-3 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-foreground uppercase">1</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Questões hoje</span>
                            </div>
                        </div>
                        <div className="w-[1px] h-6 bg-border/40" />
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-foreground uppercase">1d</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Sequência</span>
                            </div>
                        </div>
                        <div className="w-[1px] h-6 bg-border/40" />
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-foreground uppercase italic">43%</span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/50">Precisão</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard title="Total de Questões" value="7" subtitle="2 acertos" icon={BarChart3} />
                <StatCard title="Taxa de Acerto" value="42.9%" icon={Target} trend="+5%" />
                <StatCard title="Disciplinas Estudadas" value="3" icon={BookOpen} />
                <StatCard title="Tópicos Estudados" value="4" icon={LayoutGrid} />
                <StatCard title="Melhor Ranking" value="#1" subtitle="Direito Social" icon={Trophy} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Lado Esquerdo: Gráfico de Evolução (Fixo 8 colunas) */}
                <div className="lg:col-span-8 flex flex-col">
                    <PerformanceEvolutionChart 
                        timeframe={timeframe} 
                        setTimeframe={setTimeframe} 
                    />
                </div>

                {/* Lado Direito: Gráfico de Domínio (Fixo 4 colunas) */}
                <div className="lg:col-span-4 flex flex-col shadow-sm">
                    <DisciplineMasteryChart />
                </div>

            </div>
        </div>
    )
}
