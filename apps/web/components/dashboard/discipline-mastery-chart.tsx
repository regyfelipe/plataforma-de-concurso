"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart, Sector } from "recharts"
import type { PieSectorShapeProps } from "recharts/types/polar/Pie"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@workspace/ui/components/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@workspace/ui/components/chart"

const chartData = [
  { discipline: "matematica", solved: 275, fill: "var(--color-matematica)" },
  { discipline: "direito", solved: 200, fill: "var(--color-direito)" },
  { discipline: "informatica", solved: 187, fill: "var(--color-informatica)" },
  { discipline: "portugues", solved: 173, fill: "var(--color-portugues)" },
  { discipline: "outros", solved: 90, fill: "var(--color-outros)" },
]

const chartConfig = {
  solved: {
    label: "Questões",
  },
  matematica: {
    label: "Matemática",
    color: "var(--chart-1)",
  },
  direito: {
    label: "Direito",
    color: "var(--chart-2)",
  },
  informatica: {
    label: "Informática",
    color: "var(--chart-3)",
  },
  portugues: {
    label: "Português",
    color: "var(--chart-4)",
  },
  outros: {
    label: "Outros",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const ACTIVE_INDEX = 0

export function DisciplineMasteryChart() {
    return (
        <Card className="flex flex-col bg-card dark:bg-muted/10 border-border/40 rounded-[2rem] shadow-none h-full border-0">
            <CardHeader className="items-center pb-0 pt-8">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-1">Pedagogia</p>
                <CardTitle className="text-xl font-black tracking-tight uppercase italic">Ponto Forte <span className="text-primary not-italic">.</span></CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40">Domínio por Disciplina</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="solved"
                            nameKey="discipline"
                            innerRadius={60}
                            strokeWidth={5}
                            shape={({
                                index,
                                outerRadius = 0,
                                ...props
                            }: PieSectorShapeProps) =>
                                index === ACTIVE_INDEX ? (
                                    <Sector {...props} outerRadius={outerRadius + 10} />
                                ) : (
                                    <Sector {...props} outerRadius={outerRadius} />
                                )
                            }
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm pb-8">
                <div className="flex items-center gap-2 text-[11px] font-black leading-none uppercase tracking-widest text-emerald-500">
                    Evolução de 5.2% este mês <TrendingUp className="h-3 w-3" />
                </div>
                <div className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/40 text-center">
                    Baseado nas últimas 825 questões resolvidas
                </div>
            </CardFooter>
        </Card>
    )
}
