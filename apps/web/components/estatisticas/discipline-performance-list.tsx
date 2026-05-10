"use client"

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"

interface DisciplinePerformanceListProps {
    disciplines: {
        name: string
        precision: number
        solved: number
        trend: string
    }[]
}

const TREND_ICON = {
    up:   <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />,
    down: <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />,
    flat: <Minus className="h-3.5 w-3.5 text-muted-foreground" />,
}

const PRECISION_COLOR = (p: number) =>
    p >= 80 ? "bg-emerald-500" : p >= 60 ? "bg-primary" : "bg-orange-500"

export function DisciplinePerformanceList({ disciplines }: DisciplinePerformanceListProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Performance por Disciplina</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-primary h-7">
                    Ver Detalhes
                </Button>
            </CardHeader>
            <CardContent className="space-y-5">
                {disciplines.map((item) => (
                    <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5 font-medium">
                                {item.name}
                                {TREND_ICON[item.trend as keyof typeof TREND_ICON] ?? TREND_ICON.flat}
                            </div>
                            <div className="text-right">
                                <span className="font-semibold">{item.precision}%</span>
                                <p className="text-xs text-muted-foreground">{item.solved} questões</p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${PRECISION_COLOR(item.precision)}`}
                                style={{ width: `${item.precision}%` }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
