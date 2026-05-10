"use client"

import { Zap, BarChart2, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription } from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"

interface DifficultyAccuracyCardsProps {
    data: { level: string; accuracy: number; color: string }[]
}

const ICONS = [Zap, BarChart2, ShieldAlert]

export function DifficultyAccuracyCards({ data }: DifficultyAccuracyCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.map((item, i) => {
                const Icon = ICONS[i]
                return (
                    <Card key={item.level}>
                        <CardContent className="pt-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <Icon className="h-4 w-4 text-muted-foreground" style={{ color: item.color }} />
                                <CardDescription>{item.level}</CardDescription>
                            </div>
                            <p className="text-3xl font-semibold">{item.accuracy}%</p>
                            <Progress value={item.accuracy} className="h-1.5" />
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
