"use client"

import { CheckCircle2, BookOpen, Sparkles } from "lucide-react"

interface MasteryProgressCardsProps {
    data: {
        mastered: number
        learning: number
        new: number
    }
}

export function MasteryProgressCards({ data }: MasteryProgressCardsProps) {
    const items = [
        { label: "Dominados", value: data.mastered, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Em Aprendizado", value: data.learning, icon: BookOpen, color: "text-primary", bg: "bg-primary/10" },
        { label: "Não Iniciados", value: data.new, icon: Sparkles, color: "text-muted-foreground/40", bg: "bg-muted/10" },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item) => (
                <div key={item.label} className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] flex items-center gap-6 shadow-sm group hover:border-primary/30 transition-all">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-6 h-6" />
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
