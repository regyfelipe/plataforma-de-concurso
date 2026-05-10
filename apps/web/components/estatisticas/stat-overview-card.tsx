"use client"

import { Target, BookOpen, Clock, Zap } from "lucide-react"
import { Card, CardContent, CardDescription } from "@workspace/ui/components/card"

interface StatOverviewCardProps {
    stats: {
        precision: number
        totalQuestions: number
        studyTime: string
        activeDays: number
    }
}

const ITEMS = (stats: StatOverviewCardProps["stats"]) => [
    { label: "Precisão Global",      value: `${stats.precision}%`,  icon: Target,   color: "text-emerald-500" },
    { label: "Questões Resolvidas",  value: stats.totalQuestions,    icon: BookOpen, color: "text-primary"     },
    { label: "Tempo de Estudo",      value: stats.studyTime,         icon: Clock,    color: "text-orange-500"  },
    { label: "Dias Ativos",          value: stats.activeDays,        icon: Zap,      color: "text-yellow-500"  },
]

export function StatOverviewCard({ stats }: StatOverviewCardProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ITEMS(stats).map((item) => (
                <Card key={item.label}>
                    <CardContent className="pt-6 space-y-2">
                        <item.icon className={`h-5 w-5 ${item.color}`} />
                        <CardDescription>{item.label}</CardDescription>
                        <p className="text-2xl font-semibold">{item.value}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
