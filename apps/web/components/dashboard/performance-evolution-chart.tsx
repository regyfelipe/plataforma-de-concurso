"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Button } from "@workspace/ui/components/button"
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle,
} from "@workspace/ui/components/card"
import {
    ChartConfig, ChartContainer,
    ChartTooltip, ChartTooltipContent,
} from "@workspace/ui/components/chart"

const chartConfig = {
    correct: { label: "Acertos", color: "var(--chart-1)" },
    wrong:   { label: "Erros",   color: "var(--chart-2)" },
} satisfies ChartConfig

interface PerformanceEvolutionChartProps {
    timeframe: string
    setTimeframe: (value: string) => void
    data: {
        label: string
        correct: number
        wrong: number
    }[]
}

const PERIODS = ["7 dias", "30 dias", "90 dias"]

export function PerformanceEvolutionChart({ timeframe, setTimeframe, data }: PerformanceEvolutionChartProps) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-wrap items-start justify-between gap-4 pb-2">
                <div>
                    <CardTitle>Evolução de Desempenho</CardTitle>
                    <CardDescription>Visualizando últimos {timeframe}</CardDescription>
                </div>

                <div className="flex items-center gap-1">
                    {PERIODS.map((tab) => (
                        <Button
                            key={tab}
                            variant={timeframe === tab ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => setTimeframe(tab)}
                            className="text-xs"
                        >
                            {tab}
                        </Button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-video max-h-[300px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{ left: 12, right: 12, top: 20, bottom: 20 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            interval={0}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="correct"
                            type="monotone"
                            stroke="var(--color-correct)"
                            strokeWidth={2}
                            dot={timeframe === "7 dias" ? { r: 3, fill: "var(--color-correct)", strokeWidth: 0 } : false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                        <Line
                            dataKey="wrong"
                            type="monotone"
                            stroke="var(--color-wrong)"
                            strokeWidth={2}
                            dot={timeframe === "7 dias" ? { r: 3, fill: "var(--color-wrong)", strokeWidth: 0 } : false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col items-start gap-1 text-sm pb-6">
                <div className="flex items-center gap-1.5 font-medium text-emerald-500">
                    Tendência de alta de 5.2% este mês <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-xs text-muted-foreground">
                    Exibindo comparativo dos últimos {timeframe}
                </p>
            </CardFooter>
        </Card>
    )
}
