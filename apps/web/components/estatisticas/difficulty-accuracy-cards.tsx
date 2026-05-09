"use client"

import { Zap, BarChart2, ShieldAlert } from "lucide-react"

interface DifficultyAccuracyCardsProps {
    data: {
        level: string
        accuracy: number
        color: string
    }[]
}

export function DifficultyAccuracyCards({ data }: DifficultyAccuracyCardsProps) {
    const icons = [Zap, BarChart2, ShieldAlert]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((item, i) => {
                const Icon = icons[i]
                return (
                    <div key={item.level} className="bg-card dark:bg-muted/10 border border-border/40 p-6 rounded-[1.5rem] space-y-4 shadow-sm hover:border-primary/30 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted/10 text-muted-foreground group-hover:scale-110 transition-transform" style={{ color: item.color, backgroundColor: `${item.color}15` }}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">{item.level}</span>
                        </div>
                        <div>
                            <p className="text-3xl font-black tracking-tighter text-foreground">{item.accuracy}%</p>
                            <div className="w-full h-1.5 bg-muted/20 rounded-full mt-3 overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-1000" 
                                    style={{ width: `${item.accuracy}%`, backgroundColor: item.color }} 
                                />
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
