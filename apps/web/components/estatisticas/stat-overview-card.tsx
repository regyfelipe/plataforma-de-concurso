"use client"

import { Target, BookOpen, Clock, Zap } from "lucide-react"

interface StatOverviewCardProps {
    stats: {
        precision: number
        totalQuestions: number
        studyTime: string
        activeDays: number
    }
}

export function StatOverviewCard({ stats }: StatOverviewCardProps) {
    const items = [
        { label: "Precisão Global", value: `${stats.precision}%`, icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Questões Resolvidas", value: stats.totalQuestions, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
        { label: "Tempo de Estudo", value: stats.studyTime, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Dias Ativos", value: stats.activeDays, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
                <div key={item.label} className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] space-y-3 shadow-sm hover:border-primary/30 transition-all group">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{item.label}</p>
                        <p className="text-2xl font-black tracking-tighter text-foreground">{item.value}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
