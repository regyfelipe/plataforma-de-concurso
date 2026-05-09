"use client"

import * as React from "react"
import { 
    BookOpen, BookMarked, Briefcase, 
    ChevronRight, Calendar, TrendingUp, ChevronDown
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { StatOverviewCard } from "@/components/estatisticas/stat-overview-card"
import { DisciplinePerformanceList } from "@/components/estatisticas/discipline-performance-list"
import { EvolutionChart } from "@/components/estatisticas/evolution-chart"
import { PERFORMANCE_STATS } from "@/data/mocks/estatisticas"

// --- RESTAURANDO COMPONENTES APROVADOS (DESIGN DA IMAGEM) ---

function StatItem({ rank, title, stats, percentage, color }: any) {
    const isTop3 = rank <= 3
    return (
        <div className="flex items-center gap-4 group cursor-pointer py-3 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                isTop3 ? "bg-foreground text-background" : "bg-muted text-muted-foreground/40"
            }`}>
                {rank}
            </div>

            <div className="flex-1 flex items-center gap-4 min-w-0">
                <div className="flex-1 min-w-[120px]">
                    <h4 className="text-[13px] font-black tracking-tight text-foreground/90 truncate">{title}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase leading-none mt-1">{stats}</p>
                </div>

                <div className="flex-1 h-1 bg-muted/20 rounded-full overflow-hidden hidden sm:block max-w-[100px]">
                    <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <span className={`text-[12px] font-black italic min-w-[40px] text-right ${percentage === 100 ? "text-emerald-500" : "text-primary"}`}>
                        {percentage}%
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/20" />
                </div>
            </div>
        </div>
    )
}

function StatColumn({ title, subtitle, icon: Icon, items, count }: any) {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-muted/5 border border-border/40 flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-foreground/80" />
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-[13px] font-black uppercase tracking-widest text-foreground">{title}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">{subtitle}</p>
                    </div>
                </div>
                <div className="relative w-11 h-11 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/10" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="113" strokeDashoffset="55" className="text-foreground" />
                    </svg>
                    <span className="absolute text-[9px] font-black italic">51%</span>
                </div>
            </div>

            <div className="space-y-1 divide-y divide-border/5">
                {items.map((item: any, i: number) => (
                    <StatItem key={i} rank={i + 1} {...item} />
                ))}
            </div>

            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/20 pl-12">
                <ChevronDown className="w-3 h-3" /> Ver mais {count}
            </button>
        </div>
    )
}

export default function DesempenhoPage() {
    return (
        <div className="flex-1 space-y-12 p-8 pt-6">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6 border-b pb-10">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-primary uppercase tracking-widest">Análise Pedagógica</p>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">Meu Desempenho <span className="text-primary not-italic">.</span></h1>
                </div>

                <Button variant="outline" className="rounded-xl border-border/40">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground/40" />
                    Últimos 30 Dias
                </Button>
            </div>

            {/* Overview */}
            <StatOverviewCard stats={PERFORMANCE_STATS.overall} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gráfico */}
                <div className="space-y-8">
                    <EvolutionChart data={PERFORMANCE_STATS.evolution} />
                    
                    <div className="grid grid-cols-2 gap-6">
                        <Card className="bg-muted/5 border-border/40 rounded-3xl shadow-none">
                            <CardHeader className="space-y-4">
                                <CardDescription className="uppercase text-[9px] font-black tracking-widest">Média da Semana</CardDescription>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-black italic">82%</span>
                                    <span className="text-[10px] font-black text-emerald-500 flex items-center gap-0.5 mb-1.5">
                                        <TrendingUp className="w-3 h-3" /> +4%
                                    </span>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="bg-muted/5 border-border/40 rounded-3xl shadow-none">
                            <CardHeader className="space-y-4">
                                <CardDescription className="uppercase text-[9px] font-black tracking-widest">Tempo Médio/Questão</CardDescription>
                                <CardTitle className="text-3xl font-black italic">1m 45s</CardTitle>
                            </CardHeader>
                        </Card>
                    </div>
                </div>

                <DisciplinePerformanceList disciplines={PERFORMANCE_STATS.byDiscipline} />
            </div>

            {/* RESTAURANDO O GRID DE COLUNAS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t">
                <StatColumn 
                    title="Desempenho por Disciplina"
                    subtitle="Suas melhores disciplinas"
                    icon={BookOpen}
                    count={2}
                    items={[
                        { title: "Matemática", stats: "4 questões - 4 acertos", percentage: 100, color: "bg-emerald-500" },
                        { title: "Informática", stats: "2 questões - 2 acertos", percentage: 100, color: "bg-emerald-500" },
                        { title: "Direito Administrativo", stats: "4 questões - 4 acertos", percentage: 100, color: "bg-emerald-500" },
                        { title: "História", stats: "5 questões - 4 acertos", percentage: 85, color: "bg-emerald-500" },
                        { title: "Direito Penal", stats: "26 questões - 15 acertos", percentage: 58, color: "bg-amber-500" },
                    ]}
                />

                <StatColumn 
                    title="Desempenho por Tópico"
                    subtitle="Seus melhores tópicos"
                    icon={BookMarked}
                    count={12}
                    items={[
                        { title: "Inequações", stats: "4 questões - 4 acertos", percentage: 100, color: "bg-emerald-500" },
                        { title: "Princípios Fundamentais", stats: "2 questões - 2 acertos", percentage: 100, color: "bg-emerald-500" },
                        { title: "Teoria do Risco", stats: "2 questões - 2 acertos", percentage: 100, color: "bg-emerald-500" },
                        { title: "Avaliação de Conteúdo", stats: "4 questões - 4 acertos", percentage: 100, color: "bg-emerald-500" },
                        { title: "Diretórios", stats: "2 questões - 2 acertos", percentage: 100, color: "bg-emerald-500" },
                    ]}
                />

                <StatColumn 
                    title="Desempenho por Carreira"
                    subtitle="Suas carreiras em destaque"
                    icon={Briefcase}
                    count={3}
                    items={[
                        { title: "PCES", stats: "28 questões - 25 acertos", percentage: 89, color: "bg-primary" },
                        { title: "PF", stats: "15 questões - 10 acertos", percentage: 66, color: "bg-amber-500" },
                        { title: "PRF", stats: "10 questões - 5 acertos", percentage: 50, color: "bg-red-500" },
                    ]}
                />
            </div>
        </div>
    )
}
