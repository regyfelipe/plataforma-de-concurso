"use client"

import { Progress } from "@workspace/ui/components/progress"
import { Users, Timer, BarChart3 } from "lucide-react"

interface QuestionStatsProps {
    stats: {
        totalAnswers: number
        correctRate: number
        averageTimeSeconds?: number
        mostSelectedWrongAlternative?: string
    }
}

export function QuestionStats({ stats }: QuestionStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-xl border border-border/50">
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> Taxa de Acerto</span>
                    <span>{stats.correctRate}%</span>
                </div>
                <Progress value={stats.correctRate} className="h-1.5" />
            </div>

            <div className="flex items-center gap-3 px-4 md:border-l md:border-r border-border/50">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Respostas</p>
                    <p className="text-sm font-bold">{stats.totalAnswers.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 px-4">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Timer className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Tempo Médio</p>
                    <p className="text-sm font-bold">{stats.averageTimeSeconds}s</p>
                </div>
            </div>
        </div>
    )
}
