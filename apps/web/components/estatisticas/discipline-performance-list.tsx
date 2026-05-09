"use client"

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface DisciplinePerformanceListProps {
    disciplines: {
        name: string
        precision: number
        solved: number
        trend: string
    }[]
}

export function DisciplinePerformanceList({ disciplines }: DisciplinePerformanceListProps) {
    return (
        <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Performance por Disciplina</p>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-primary tracking-widest cursor-pointer hover:underline">
                    Ver Detalhes
                </div>
            </div>

            <div className="space-y-6">
                {disciplines.map((item) => (
                    <div key={item.name} className="space-y-2 group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                                {item.trend === 'up' ? (
                                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                                ) : item.trend === 'down' ? (
                                    <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                                ) : (
                                    <Minus className="w-3.5 h-3.5 text-muted-foreground/30" />
                                )}
                            </div>
                            <div className="text-right">
                                <span className="text-sm font-black text-foreground">{item.precision}%</span>
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{item.solved} Questões</p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-muted/20 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    item.precision >= 80 ? 'bg-emerald-500' : item.precision >= 60 ? 'bg-primary' : 'bg-orange-500'
                                }`} 
                                style={{ width: `${item.precision}%` }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
