"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Sector } from "recharts"
import type { PieSectorShapeProps } from "recharts/types/polar/Pie"
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import {
    ChartContainer, ChartTooltip, ChartTooltipContent,
    type ChartConfig,
} from "@workspace/ui/components/chart"

const chartConfig = {
    solved:     { label: "Questões"    },
} satisfies ChartConfig

const ACTIVE_INDEX = 0

interface DisciplineMasteryChartProps {
    data: {
        discipline: string
        label: string
        solved: number
        fill: string
    }[]
    totalSolved: number
}

export function DisciplineMasteryChart({ data, totalSolved }: DisciplineMasteryChartProps) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Ponto Forte</CardTitle>
                <CardDescription>Domínio por Disciplina</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        {data.length > 0 && (
                            <Pie
                                data={data}
                                dataKey="solved"
                                nameKey="label"
                                innerRadius={60}
                                strokeWidth={5}
                                shape={({ index, outerRadius = 0, ...props }: PieSectorShapeProps) =>
                                    index === ACTIVE_INDEX
                                        ? <Sector {...props} outerRadius={outerRadius + 10} />
                                        : <Sector {...props} outerRadius={outerRadius} />
                                }
                            />
                        )}
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-1 text-sm pb-6">
                <div className="flex items-center gap-1.5 font-medium text-emerald-500">
                    {data[0]?.label ? `Maior volume em ${data[0].label}` : "Sem respostas por disciplina"} <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    Baseado em {totalSolved} questão(ões) resolvida(s)
                </p>
            </CardFooter>
        </Card>
    )
}
